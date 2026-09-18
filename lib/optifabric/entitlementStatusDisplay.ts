// Stage 2F-2 — pure presentation mapping from the central OptiFabric
// entitlement decision to what app/optifabric/subscription/page.tsx shows.
// No access decision is made or re-derived here, only wording chosen for a
// decision the backend already made (GET /entitlements/me/optifabric — see
// server/optifabric-api/src/entitlement/entitlement-status.controller.ts
// for the authoritative shape and decision logic this mirrors field names
// from, never recomputes). No React, localStorage, fetch, or backend
// dependency — a plain function of its input, same convention as
// markerFabricConsumptionEngine.ts / engineeringRecommendationsEngine.ts.
export interface OptiFabricEntitlementStatus {
  isAccessAllowed: boolean;
  reason:
    | "NO_ENTITLEMENT"
    | "BANGLADESH_FREE"
    | "TRIAL_ACTIVE"
    | "TRIAL_EXPIRED"
    | "PAID_ACTIVE"
    | "PAID_EXPIRED";
  legacyBangladeshTransitionalAccess: boolean;
  trialEndsAt: string | null;
  trialDaysRemaining: number | null;
  currentPeriodEnd: string | null;
  paidDaysRemaining: number | null;
}

export interface EntitlementStatusDisplay {
  headline: string;
  headlineBangla: string;
  detail: string;
  detailBangla: string;
  tone: "positive" | "warning" | "neutral";
}

// Bangladesh-free is checked first because it can be true via either a real
// central BANGLADESH_FREE row OR the temporary legacy-compatibility
// fallback (see the interface comment above) — both mean the same thing to
// this factory: free, permanent access, with no trial/payment concept
// applying at all. Never claims a server fault, data loss, or a failed
// payment for any reason — an expired paid period only ever says the
// access period ended.
export function describeEntitlement(entitlement: OptiFabricEntitlementStatus): EntitlementStatusDisplay {
  if (entitlement.reason === "BANGLADESH_FREE" || entitlement.legacyBangladeshTransitionalAccess) {
    return {
      headline: "Free for Bangladesh",
      headlineBangla: "বাংলাদেশের জন্য বিনামূল্যে",
      detail:
        "This factory is registered in Bangladesh, so OptiFabric is free for you, permanently — no trial countdown, no payment required.",
      detailBangla:
        "এই কারখানাটি বাংলাদেশে নিবন্ধিত, তাই OptiFabric আপনার জন্য স্থায়ীভাবে বিনামূল্যে — কোনো ট্রায়াল সময়সীমা নেই, কোনো অর্থ প্রদানের প্রয়োজন নেই।",
      tone: "positive",
    };
  }

  switch (entitlement.reason) {
    case "TRIAL_ACTIVE":
      return {
        headline: "Free trial active",
        headlineBangla: "ফ্রি ট্রায়াল সক্রিয়",
        detail:
          entitlement.trialDaysRemaining !== null
            ? `Your free OptiFabric trial is active — ${entitlement.trialDaysRemaining} day(s) remaining.`
            : "Your free OptiFabric trial is active.",
        detailBangla: "আপনার ফ্রি OptiFabric ট্রায়াল সক্রিয় আছে।",
        tone: "positive",
      };
    case "PAID_ACTIVE":
      return {
        headline: "Subscription active",
        headlineBangla: "সাবস্ক্রিপশন সক্রিয়",
        detail:
          entitlement.paidDaysRemaining !== null
            ? `Your OptiFabric subscription is active — ${entitlement.paidDaysRemaining} day(s) remaining in the current billing period.`
            : "Your OptiFabric subscription is active.",
        detailBangla: "আপনার OptiFabric সাবস্ক্রিপশন সক্রিয় আছে।",
        tone: "positive",
      };
    case "TRIAL_EXPIRED":
      return {
        headline: "Trial ended",
        headlineBangla: "ট্রায়াল শেষ হয়েছে",
        detail:
          "Your free OptiFabric trial has ended. Server-backed project access is unavailable until a plan is activated.",
        detailBangla:
          "আপনার ফ্রি OptiFabric ট্রায়াল শেষ হয়ে গেছে। একটি পরিকল্পনা সক্রিয় না হওয়া পর্যন্ত সার্ভার-ভিত্তিক প্রকল্প অ্যাক্সেস উপলব্ধ নয়।",
        tone: "warning",
      };
    case "PAID_EXPIRED":
      return {
        headline: "Access period ended",
        headlineBangla: "অ্যাক্সেসের মেয়াদ শেষ হয়েছে",
        detail: "Your paid OptiFabric access period has ended. Contact us to renew and restore access.",
        detailBangla:
          "আপনার পেইড OptiFabric অ্যাক্সেসের মেয়াদ শেষ হয়ে গেছে। অ্যাক্সেস পুনরায় চালু করতে আমাদের সাথে যোগাযোগ করুন।",
        tone: "warning",
      };
    case "NO_ENTITLEMENT":
    default:
      return {
        headline: "No active entitlement",
        headlineBangla: "কোনো সক্রিয় সাবস্ক্রিপশন নেই",
        detail: "No active OptiFabric trial or subscription exists for this account yet.",
        detailBangla: "এই অ্যাকাউন্টের জন্য এখনও কোনো সক্রিয় OptiFabric ট্রায়াল বা সাবস্ক্রিপশন নেই।",
        tone: "neutral",
      };
  }
}

/** True when access is allowed via either a real central BANGLADESH_FREE row or the temporary legacy-compatibility fallback — see describeEntitlement's own comment. Exported so callers (the subscription page) don't have to repeat this OR condition themselves. */
export function isBangladeshFreeEntitlement(entitlement: OptiFabricEntitlementStatus): boolean {
  return entitlement.reason === "BANGLADESH_FREE" || entitlement.legacyBangladeshTransitionalAccess;
}
