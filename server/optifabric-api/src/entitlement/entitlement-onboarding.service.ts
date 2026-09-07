// Explicit, auditable entitlement side-effects triggered by OptiFabric
// signup — never triggered implicitly inside the access-decision guard.
// Mapping a factory to an Organisation and granting/starting an
// entitlement are deliberately kept as separate actions (see
// organisation-resolver.service.ts and CENTRAL-ENTITLEMENT-PHASE-1.md).
import { Injectable, Logger } from "@nestjs/common";
import { EntitlementDecisionService } from "./entitlement-decision.service";
import { SubscriptionService } from "../modules/subscription/subscription.service";
import { isBangladeshFactory } from "../modules/subscription/subscription.types";

@Injectable()
export class EntitlementOnboardingService {
  private readonly logger = new Logger("EntitlementOnboardingService");

  constructor(
    private readonly entitlementDecision: EntitlementDecisionService,
    private readonly legacySubscriptionService: SubscriptionService,
  ) {}

  /**
   * Called after a NEW international (non-Bangladesh) factory's founding
   * admin completes signup. Starts the central 90-day trial for BOTH
   * products (OptiFabric and OptiSewing) atomically — this factory did not
   * exist before this signup, so startInternationalTrial's own
   * idempotency guarantee (a no-op if a trial already exists) is a safety
   * net here, not the primary mechanism preventing duplicate trials.
   */
  async onboardNewInternationalFactory(organisationId: string): Promise<void> {
    await this.entitlementDecision.startInternationalTrial(organisationId);
  }

  /**
   * Bangladesh signup rule for Phase 2: create the organisation mapping
   * ONLY. Never call grantBangladeshFreeEntitlement() from a self-declared
   * country field — see the Bangladesh Rule section of
   * docs/PHASE-2-ENTITLEMENT-CUTOVER.md. This method exists mainly for
   * symmetry/clarity at the call site (auth.service.ts) — it deliberately
   * does nothing beyond what resolveOrCreateOrganisationForOptiFabricFactory
   * already did.
   */
  onboardNewBangladeshFactory(): void {
    // Intentionally a no-op. Organisation mapping already happened in
    // OrganisationResolverService; granting BANGLADESH_FREE is reserved for
    // a future trusted Bangladesh Apparel signal (see
    // CENTRAL-ENTITLEMENT-PHASE-1.md, "Future Bangladesh Apparel
    // integration").
  }

  /**
   * TRANSITIONAL COMPATIBILITY RULE — see docs/PHASE-2-ENTITLEMENT-CUTOVER.md,
   * "Bangladesh legacy/free compatibility issue", for the full writeup of
   * why this exists and how to retire it.
   *
   * Engages ONLY when central entitlement has genuinely nothing recorded
   * yet for this organisation+product (reason === "NO_ENTITLEMENT") — never
   * overrides a real central denial (an expired trial or expired paid
   * period both deny correctly, with no fallback). If the organisation's
   * mapped factory has a pre-existing LEGACY subscription with status
   * FREE_REGIONAL (Bangladesh, granted under the old per-request
   * country-text check before this cutover) and that legacy state
   * currently allows access, this returns true — preserving exactly the
   * access that factory already had, without granting anything new and
   * without touching the central entitlement store at all (read-only).
   *
   * This is a temporary bridge, not a general bypass: it never applies to
   * a factory whose central entitlement was deliberately allowed to
   * expire, and it grants nothing to a factory the legacy system itself
   * would deny.
   */
  async isEligibleForBangladeshTransitionalAccess(factoryId: string, organisationId: string): Promise<boolean> {
    const centralEffective = await this.entitlementDecision.getEffectiveEntitlement(
      organisationId,
      "OPTIFABRIC",
    );
    if (centralEffective.reason !== "NO_ENTITLEMENT") {
      return false;
    }

    const legacyEffective = await this.legacySubscriptionService.getEffectiveState(factoryId);
    const eligible = legacyEffective.status === "FREE_REGIONAL" && legacyEffective.isAccessAllowed;

    if (eligible) {
      this.logger.warn(
        `Transitional Bangladesh legacy-compatibility fallback engaged for factory ${factoryId} ` +
          `(organisation ${organisationId}) — no central entitlement exists yet. ` +
          `This factory needs a one-time BANGLADESH_FREE backfill; see ` +
          `docs/PHASE-2-ENTITLEMENT-CUTOVER.md.`,
      );
    }

    return eligible;
  }

  /**
   * Read-only reporting helper — does NOT grant anything, does NOT write
   * to the central entitlement store. Identifies which existing OptiFabric
   * factories currently rely on the legacy Bangladesh-free path, so the
   * compatibility gap can be reported and a deliberate, explicitly
   * authorized backfill decision made separately. Intended for a one-off
   * diagnostic call (e.g. from a script or test), not a hot path.
   */
  async identifyLegacyBangladeshFreeFactories(
    factories: Array<{ id: string; country: string }>,
  ): Promise<string[]> {
    return factories.filter((f) => isBangladeshFactory(f.country)).map((f) => f.id);
  }
}
