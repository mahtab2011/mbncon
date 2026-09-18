/**
 * Stage 2F-2 — focused unit tests for entitlementStatusDisplay.ts: proves the
 * frontend correctly maps each central entitlement state to the right
 * display state ("frontend correctly maps central states to display
 * states" from the Stage 2F-2 task spec), and that no wording ever claims a
 * server fault, data loss, or a failed payment.
 *
 * Same no-test-framework convention as markerFabricConsumptionEngine.test.ts
 * and engineeringRecommendationsEngine.test.ts (no Jest/Vitest is configured
 * anywhere in this frontend project). This file has NO `@/`-aliased imports
 * (a plain, dependency-free module, like markerFabricConsumptionEngine.ts),
 * so unlike apiClient.test.ts it can use the simple two-file recipe:
 *
 *   npx tsc --outDir <tmp> lib/optifabric/entitlementStatusDisplay.ts lib/optifabric/entitlementStatusDisplay.test.ts --module commonjs --target es2019
 *   node <tmp>/entitlementStatusDisplay.test.js
 */
import {
  describeEntitlement,
  isBangladeshFreeEntitlement,
  type OptiFabricEntitlementStatus,
} from "./entitlementStatusDisplay";

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean): void {
  if (condition) {
    passed += 1;
    console.log(`PASS: ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL: ${name}`);
  }
}

function baseStatus(overrides: Partial<OptiFabricEntitlementStatus>): OptiFabricEntitlementStatus {
  return {
    isAccessAllowed: false,
    reason: "NO_ENTITLEMENT",
    legacyBangladeshTransitionalAccess: false,
    trialEndsAt: null,
    trialDaysRemaining: null,
    currentPeriodEnd: null,
    paidDaysRemaining: null,
    ...overrides,
  };
}

const FORBIDDEN_PHRASES = ["server error", "connection failed", "payment failed", "your projects are gone", "data has been deleted", "data was deleted"];

function containsNoForbiddenPhrase(text: string): boolean {
  const lower = text.toLowerCase();
  return !FORBIDDEN_PHRASES.some((phrase) => lower.includes(phrase));
}

function run(): void {
  // -- Central-state -> display-state mapping -------------------------------

  const trialActive = describeEntitlement(baseStatus({ reason: "TRIAL_ACTIVE", isAccessAllowed: true, trialDaysRemaining: 7 }));
  check("TRIAL_ACTIVE maps to a positive tone", trialActive.tone === "positive");
  check("TRIAL_ACTIVE mentions the days remaining", trialActive.detail.includes("7 day"));
  check("TRIAL_ACTIVE headline mentions a trial, not a subscription", /trial/i.test(trialActive.headline));

  const paidActive = describeEntitlement(baseStatus({ reason: "PAID_ACTIVE", isAccessAllowed: true, paidDaysRemaining: 25 }));
  check("PAID_ACTIVE maps to a positive tone", paidActive.tone === "positive");
  check("PAID_ACTIVE mentions the days remaining", paidActive.detail.includes("25 day"));
  check("PAID_ACTIVE headline mentions a subscription, not a trial", /subscription/i.test(paidActive.headline));

  const trialExpired = describeEntitlement(baseStatus({ reason: "TRIAL_EXPIRED", isAccessAllowed: false, trialDaysRemaining: 0 }));
  check("TRIAL_EXPIRED maps to a warning tone, not neutral/positive", trialExpired.tone === "warning");
  check("TRIAL_EXPIRED explains the trial ended", /trial/i.test(trialExpired.detail) && /ended/i.test(trialExpired.detail));
  check("TRIAL_EXPIRED does not claim a payment failed", containsNoForbiddenPhrase(trialExpired.detail));

  const paidExpired = describeEntitlement(baseStatus({ reason: "PAID_EXPIRED", isAccessAllowed: false, paidDaysRemaining: 0 }));
  check("PAID_EXPIRED maps to a warning tone", paidExpired.tone === "warning");
  check("PAID_EXPIRED explains the access period ended, not a payment failure", /period/i.test(paidExpired.detail) && /ended/i.test(paidExpired.detail));
  check("PAID_EXPIRED never claims a payment failed (the core Stage 2F-2 wording rule)", containsNoForbiddenPhrase(paidExpired.detail) && !/payment/i.test(paidExpired.detail));

  const noEntitlement = describeEntitlement(baseStatus({ reason: "NO_ENTITLEMENT", isAccessAllowed: false }));
  check("NO_ENTITLEMENT maps to a neutral tone (not an error/warning)", noEntitlement.tone === "neutral");
  check("NO_ENTITLEMENT explains no entitlement exists", /no active/i.test(noEntitlement.detail));

  const bangladeshFreeCentral = describeEntitlement(baseStatus({ reason: "BANGLADESH_FREE", isAccessAllowed: true }));
  check("BANGLADESH_FREE (real central row) maps to a positive tone", bangladeshFreeCentral.tone === "positive");
  check("BANGLADESH_FREE headline says free for Bangladesh", /bangladesh/i.test(bangladeshFreeCentral.headline));

  const bangladeshFreeLegacy = describeEntitlement(
    baseStatus({ reason: "NO_ENTITLEMENT", isAccessAllowed: true, legacyBangladeshTransitionalAccess: true }),
  );
  check(
    "legacy Bangladesh transitional access (reason still NO_ENTITLEMENT) is displayed identically to a real BANGLADESH_FREE row",
    bangladeshFreeLegacy.headline === bangladeshFreeCentral.headline && bangladeshFreeLegacy.tone === "positive",
  );

  // -- isBangladeshFreeEntitlement ------------------------------------------

  check("isBangladeshFreeEntitlement is true for a real central BANGLADESH_FREE row", isBangladeshFreeEntitlement(baseStatus({ reason: "BANGLADESH_FREE" })));
  check(
    "isBangladeshFreeEntitlement is true for the legacy transitional fallback even though reason is NO_ENTITLEMENT",
    isBangladeshFreeEntitlement(baseStatus({ reason: "NO_ENTITLEMENT", legacyBangladeshTransitionalAccess: true })),
  );
  check(
    "isBangladeshFreeEntitlement is false for a plain NO_ENTITLEMENT with no legacy fallback",
    !isBangladeshFreeEntitlement(baseStatus({ reason: "NO_ENTITLEMENT", legacyBangladeshTransitionalAccess: false })),
  );
  check("isBangladeshFreeEntitlement is false for TRIAL_ACTIVE", !isBangladeshFreeEntitlement(baseStatus({ reason: "TRIAL_ACTIVE" })));

  // -- No wording anywhere claims a server fault, data loss, or payment failure --

  const allReasons: OptiFabricEntitlementStatus["reason"][] = [
    "NO_ENTITLEMENT",
    "BANGLADESH_FREE",
    "TRIAL_ACTIVE",
    "TRIAL_EXPIRED",
    "PAID_ACTIVE",
    "PAID_EXPIRED",
  ];
  for (const reason of allReasons) {
    const display = describeEntitlement(baseStatus({ reason }));
    check(
      `${reason}: neither headline nor detail contains a forbidden technical-fault/payment-failure phrase`,
      containsNoForbiddenPhrase(display.headline) && containsNoForbiddenPhrase(display.detail),
    );
  }

  // -- Missing day-count numbers degrade gracefully, never showing "null"/"undefined" --

  const trialActiveNoDays = describeEntitlement(baseStatus({ reason: "TRIAL_ACTIVE", isAccessAllowed: true, trialDaysRemaining: null }));
  check("TRIAL_ACTIVE with no day count omits it rather than printing null/undefined", !/null|undefined/i.test(trialActiveNoDays.detail));

  const paidActiveNoDays = describeEntitlement(baseStatus({ reason: "PAID_ACTIVE", isAccessAllowed: true, paidDaysRemaining: null }));
  check("PAID_ACTIVE with no day count omits it rather than printing null/undefined", !/null|undefined/i.test(paidActiveNoDays.detail));

  console.log(failed === 0 ? "\nALL CHECKS PASSED" : `\n${failed} CHECK(S) FAILED`);
  process.exitCode = failed === 0 ? 0 : 1;
}

run();
