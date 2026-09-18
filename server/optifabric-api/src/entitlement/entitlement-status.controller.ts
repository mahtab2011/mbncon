// Stage 2F-2 — the first (and, per Phase 1's own note, deliberately smallest
// possible) public HTTP exposure of the central entitlement system. Read
// only: this route never creates, updates, or grants anything beyond the
// same lazy organisation MAPPING (never an entitlement) that SubscriptionGuard
// already performs on every protected OptiFabric request — see
// FactoryOrganisationMappingService's own doc comment for why that is safe
// and idempotent.
//
// PURPOSE: give app/optifabric/subscription/page.tsx one authoritative place
// to read "does this factory currently have OptiFabric access, and why" —
// the exact same decision SubscriptionGuard enforces — instead of the page
// independently reading the legacy SubscriptionService status (see
// docs/PHASE-2-ENTITLEMENT-CUTOVER.md and the stage 2F-2 report for why that
// was a source-of-truth mismatch).
//
// This controller composes three already-existing, already-tested services
// exactly the way SubscriptionGuard.canActivate() does (see that guard's own
// header comment for the authoritative flow) — it does not reimplement or
// recompute any access decision, mapping rule, or Bangladesh fallback rule
// of its own.
import { Controller, Get, Req } from "@nestjs/common";
import type { Request } from "express";
import { SkipSubscriptionCheck } from "../common/guards/subscription.guard";
import { AuthenticatedUser } from "../modules/auth/auth.types";
import { EffectiveEntitlement, EntitlementDecisionService } from "./entitlement-decision.service";
import { EntitlementOnboardingService } from "./entitlement-onboarding.service";
import { FactoryOrganisationMappingService } from "./factory-organisation-mapping.service";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Same rounding/floor-at-zero convention as SubscriptionService's own daysUntilExpiry, for a consistent "days remaining" reading across the legacy and central status. */
function daysRemaining(target: Date | null): number | null {
  if (!target) return null;
  const remainingMs = target.getTime() - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / MS_PER_DAY) : 0;
}

export interface OptiFabricEntitlementStatus {
  /**
   * The final, authoritative access decision for this account — identical
   * in meaning to what SubscriptionGuard enforces on every protected
   * OptiFabric request right now (the central entitlement decision, OR,
   * only when central has nothing recorded at all, the temporary legacy
   * Bangladesh-compatibility fallback below). This is the one field the UI
   * needs to answer "do I currently have access."
   */
  isAccessAllowed: boolean;
  /** The CENTRAL entitlement system's own reason, verbatim from EntitlementDecisionService — never renamed, narrowed, or invented. */
  reason: EffectiveEntitlement["reason"];
  /**
   * True only when isAccessAllowed is true SOLELY because of the temporary
   * legacy Bangladesh-compatibility fallback (reason is "NO_ENTITLEMENT"
   * but a pre-cutover FREE_REGIONAL legacy subscription still allows
   * access — see EntitlementOnboardingService.isEligibleForBangladeshTransitionalAccess
   * and docs/PHASE-2-ENTITLEMENT-CUTOVER.md). False whenever access is
   * decided purely by the central system, allowed or not.
   */
  legacyBangladeshTransitionalAccess: boolean;
  trialEndsAt: string | null;
  trialDaysRemaining: number | null;
  currentPeriodEnd: string | null;
  paidDaysRemaining: number | null;
}

function noEntitlementResponse(): OptiFabricEntitlementStatus {
  return {
    isAccessAllowed: false,
    reason: "NO_ENTITLEMENT",
    legacyBangladeshTransitionalAccess: false,
    trialEndsAt: null,
    trialDaysRemaining: null,
    currentPeriodEnd: null,
    paidDaysRemaining: null,
  };
}

@Controller("entitlements")
export class EntitlementStatusController {
  constructor(
    private readonly mapping: FactoryOrganisationMappingService,
    private readonly entitlementDecision: EntitlementDecisionService,
    private readonly onboarding: EntitlementOnboardingService,
  ) {}

  // Read-only. @SkipSubscriptionCheck() for the same reason
  // GET /subscription/status already carries it (see subscription.controller.ts):
  // a user whose entitlement is denied must still be able to load the page
  // that explains why they were denied. JwtAuthGuard (global APP_GUARD)
  // still runs, so this route always requires a valid, authenticated
  // session — an unauthenticated caller gets the normal 401.
  @SkipSubscriptionCheck()
  @Get("me/optifabric")
  async getMyOptiFabricEntitlement(@Req() request: Request): Promise<OptiFabricEntitlementStatus> {
    const user = request.user as AuthenticatedUser;

    // factoryId comes exclusively from the verified JWT — never from a
    // query/body param — exactly like SubscriptionGuard. There is no code
    // path here that could accept a client-supplied organisationId either:
    // the only organisationId this method ever uses is the one resolved
    // from that server-trusted factoryId, below.
    if (!user.factoryId || typeof user.factoryId !== "string") {
      return noEntitlementResponse();
    }

    const organisationId = await this.mapping.resolveOrLazilyMapOrganisation(user.factoryId);
    if (!organisationId) {
      // factoryId does not correspond to any real Factory row — fail
      // closed, same as SubscriptionGuard.
      return noEntitlementResponse();
    }

    const [effective, dates] = await Promise.all([
      this.entitlementDecision.getEffectiveEntitlement(organisationId, "OPTIFABRIC"),
      this.entitlementDecision.getEntitlementDates(organisationId, "OPTIFABRIC"),
    ]);

    let isAccessAllowed = effective.isAccessAllowed;
    let legacyBangladeshTransitionalAccess = false;

    // Mirrors SubscriptionGuard's own decision flow exactly: the legacy
    // fallback is only ever consulted after a genuine central
    // "NO_ENTITLEMENT" — never overriding an expired trial/paid period.
    if (!isAccessAllowed && effective.reason === "NO_ENTITLEMENT") {
      legacyBangladeshTransitionalAccess = await this.onboarding.isEligibleForBangladeshTransitionalAccess(
        user.factoryId,
        organisationId,
      );
      if (legacyBangladeshTransitionalAccess) {
        isAccessAllowed = true;
      }
    }

    return {
      isAccessAllowed,
      reason: effective.reason,
      legacyBangladeshTransitionalAccess,
      trialEndsAt: dates.trialEndsAt ? dates.trialEndsAt.toISOString() : null,
      trialDaysRemaining:
        effective.reason === "TRIAL_ACTIVE" || effective.reason === "TRIAL_EXPIRED"
          ? daysRemaining(dates.trialEndsAt)
          : null,
      currentPeriodEnd: dates.currentPeriodEnd ? dates.currentPeriodEnd.toISOString() : null,
      paidDaysRemaining:
        effective.reason === "PAID_ACTIVE" || effective.reason === "PAID_EXPIRED"
          ? daysRemaining(dates.currentPeriodEnd)
          : null,
    };
  }
}
