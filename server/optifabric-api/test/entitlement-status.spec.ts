// Stage 2F-2 — unit coverage for EntitlementStatusController, the read-only
// GET /entitlements/me/optifabric endpoint the OptiFabric subscription page
// now uses as its single source of truth.
//
// This is a controller-level test: it mocks the three services the
// controller composes (FactoryOrganisationMappingService,
// EntitlementDecisionService, EntitlementOnboardingService) rather than
// re-testing their own internals — those are already covered by
// test/entitlement-cutover.spec.ts and test/entitlement-backfill.spec.ts.
// What this file proves is specific to the controller's own composition:
// that it maps each central state to the correct response shape, applies
// the Bangladesh transitional fallback in the same order as
// SubscriptionGuard, never mutates anything, and never uses anything but
// the authenticated user's own factoryId.
import { EffectiveEntitlement } from "../src/entitlement/entitlement-decision.service";
import { EntitlementStatusController } from "../src/entitlement/entitlement-status.controller";

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function makeController(overrides: {
  resolveOrLazilyMapOrganisation?: jest.Mock;
  getEffectiveEntitlement?: jest.Mock;
  getEntitlementDates?: jest.Mock;
  isEligibleForBangladeshTransitionalAccess?: jest.Mock;
}) {
  const mapping = {
    resolveOrLazilyMapOrganisation: overrides.resolveOrLazilyMapOrganisation ?? jest.fn(),
  };
  const entitlementDecision = {
    getEffectiveEntitlement: overrides.getEffectiveEntitlement ?? jest.fn(),
    getEntitlementDates: overrides.getEntitlementDates ?? jest.fn(),
    // Present so a controller bug that accidentally called canAccess/
    // startInternationalTrial directly (bypassing getEffectiveEntitlement)
    // would fail loudly rather than silently returning undefined.
    canAccess: jest.fn(() => {
      throw new Error("canAccess should not be called directly by the status controller");
    }),
    startInternationalTrial: jest.fn(() => {
      throw new Error("startInternationalTrial must never be called by a read-only status endpoint");
    }),
  };
  const onboarding = {
    isEligibleForBangladeshTransitionalAccess:
      overrides.isEligibleForBangladeshTransitionalAccess ?? jest.fn().mockResolvedValue(false),
  };

  const controller = new EntitlementStatusController(mapping as never, entitlementDecision as never, onboarding as never);
  return { controller, mapping, entitlementDecision, onboarding };
}

function requestFor(factoryId: string | undefined) {
  return { user: { userId: "user-1", factoryId, role: "ROLE_FACTORY_ADMIN", jti: "jti-1" } } as never;
}

describe("EntitlementStatusController.getMyOptiFabricEntitlement", () => {
  it("active trial: reports TRIAL_ACTIVE, access allowed, and trial days remaining", async () => {
    const trialEndsAt = daysFromNow(12);
    const effective: EffectiveEntitlement = { isAccessAllowed: true, reason: "TRIAL_ACTIVE" };
    const { controller, entitlementDecision, onboarding } = makeController({
      resolveOrLazilyMapOrganisation: jest.fn().mockResolvedValue("org-1"),
      getEffectiveEntitlement: jest.fn().mockResolvedValue(effective),
      getEntitlementDates: jest.fn().mockResolvedValue({ trialEndsAt, currentPeriodEnd: null }),
    });

    const result = await controller.getMyOptiFabricEntitlement(requestFor("factory-1"));

    expect(result.isAccessAllowed).toBe(true);
    expect(result.reason).toBe("TRIAL_ACTIVE");
    expect(result.legacyBangladeshTransitionalAccess).toBe(false);
    expect(result.trialEndsAt).toBe(trialEndsAt.toISOString());
    expect(result.trialDaysRemaining).toBe(12);
    expect(result.currentPeriodEnd).toBeNull();
    expect(result.paidDaysRemaining).toBeNull();
    // A real central decision exists — the legacy fallback must never even
    // be consulted.
    expect(onboarding.isEligibleForBangladeshTransitionalAccess).not.toHaveBeenCalled();
    expect(entitlementDecision.getEffectiveEntitlement).toHaveBeenCalledWith("org-1", "OPTIFABRIC");
  });

  it("active paid entitlement: reports PAID_ACTIVE, access allowed, and paid days remaining", async () => {
    const currentPeriodEnd = daysFromNow(20);
    const { controller } = makeController({
      resolveOrLazilyMapOrganisation: jest.fn().mockResolvedValue("org-2"),
      getEffectiveEntitlement: jest.fn().mockResolvedValue({ isAccessAllowed: true, reason: "PAID_ACTIVE" }),
      getEntitlementDates: jest.fn().mockResolvedValue({ trialEndsAt: null, currentPeriodEnd }),
    });

    const result = await controller.getMyOptiFabricEntitlement(requestFor("factory-2"));

    expect(result.isAccessAllowed).toBe(true);
    expect(result.reason).toBe("PAID_ACTIVE");
    expect(result.trialDaysRemaining).toBeNull();
    expect(result.currentPeriodEnd).toBe(currentPeriodEnd.toISOString());
    expect(result.paidDaysRemaining).toBe(20);
  });

  it("expired trial: reports TRIAL_EXPIRED, access denied, and zero days remaining", async () => {
    const trialEndsAt = daysFromNow(-3);
    const { controller } = makeController({
      resolveOrLazilyMapOrganisation: jest.fn().mockResolvedValue("org-3"),
      getEffectiveEntitlement: jest.fn().mockResolvedValue({ isAccessAllowed: false, reason: "TRIAL_EXPIRED" }),
      getEntitlementDates: jest.fn().mockResolvedValue({ trialEndsAt, currentPeriodEnd: null }),
    });

    const result = await controller.getMyOptiFabricEntitlement(requestFor("factory-3"));

    expect(result.isAccessAllowed).toBe(false);
    expect(result.reason).toBe("TRIAL_EXPIRED");
    expect(result.trialDaysRemaining).toBe(0);
  });

  it("expired paid period: reports PAID_EXPIRED, access denied, and zero days remaining", async () => {
    const currentPeriodEnd = daysFromNow(-1);
    const { controller } = makeController({
      resolveOrLazilyMapOrganisation: jest.fn().mockResolvedValue("org-4"),
      getEffectiveEntitlement: jest.fn().mockResolvedValue({ isAccessAllowed: false, reason: "PAID_EXPIRED" }),
      getEntitlementDates: jest.fn().mockResolvedValue({ trialEndsAt: null, currentPeriodEnd }),
    });

    const result = await controller.getMyOptiFabricEntitlement(requestFor("factory-4"));

    expect(result.isAccessAllowed).toBe(false);
    expect(result.reason).toBe("PAID_EXPIRED");
    expect(result.paidDaysRemaining).toBe(0);
  });

  it("Bangladesh-free (real central row): reports BANGLADESH_FREE and access allowed, with no legacy fallback flag", async () => {
    const { controller, onboarding } = makeController({
      resolveOrLazilyMapOrganisation: jest.fn().mockResolvedValue("org-bd-central"),
      getEffectiveEntitlement: jest.fn().mockResolvedValue({ isAccessAllowed: true, reason: "BANGLADESH_FREE" }),
      getEntitlementDates: jest.fn().mockResolvedValue({ trialEndsAt: null, currentPeriodEnd: null }),
    });

    const result = await controller.getMyOptiFabricEntitlement(requestFor("factory-bd"));

    expect(result.isAccessAllowed).toBe(true);
    expect(result.reason).toBe("BANGLADESH_FREE");
    expect(result.legacyBangladeshTransitionalAccess).toBe(false);
    // A real central row exists (reason isn't NO_ENTITLEMENT) — the
    // transitional fallback must never be consulted, matching
    // SubscriptionGuard's own "never overrides a real decision" rule.
    expect(onboarding.isEligibleForBangladeshTransitionalAccess).not.toHaveBeenCalled();
  });

  it("no entitlement at all, and not legacy-eligible: reports NO_ENTITLEMENT and access denied", async () => {
    const { controller, onboarding } = makeController({
      resolveOrLazilyMapOrganisation: jest.fn().mockResolvedValue("org-5"),
      getEffectiveEntitlement: jest.fn().mockResolvedValue({ isAccessAllowed: false, reason: "NO_ENTITLEMENT" }),
      getEntitlementDates: jest.fn().mockResolvedValue({ trialEndsAt: null, currentPeriodEnd: null }),
      isEligibleForBangladeshTransitionalAccess: jest.fn().mockResolvedValue(false),
    });

    const result = await controller.getMyOptiFabricEntitlement(requestFor("factory-5"));

    expect(result.isAccessAllowed).toBe(false);
    expect(result.reason).toBe("NO_ENTITLEMENT");
    expect(result.legacyBangladeshTransitionalAccess).toBe(false);
    expect(onboarding.isEligibleForBangladeshTransitionalAccess).toHaveBeenCalledWith("factory-5", "org-5");
  });

  it("no entitlement, but eligible for the legacy Bangladesh transitional fallback: access allowed, reason stays NO_ENTITLEMENT, flag is true", async () => {
    const { controller } = makeController({
      resolveOrLazilyMapOrganisation: jest.fn().mockResolvedValue("org-6"),
      getEffectiveEntitlement: jest.fn().mockResolvedValue({ isAccessAllowed: false, reason: "NO_ENTITLEMENT" }),
      getEntitlementDates: jest.fn().mockResolvedValue({ trialEndsAt: null, currentPeriodEnd: null }),
      isEligibleForBangladeshTransitionalAccess: jest.fn().mockResolvedValue(true),
    });

    const result = await controller.getMyOptiFabricEntitlement(requestFor("factory-6"));

    // This is the coherence case Stage 2F-2 exists to get right: a factory
    // SubscriptionGuard is actually letting through must not be told by
    // this status page that it has no entitlement.
    expect(result.isAccessAllowed).toBe(true);
    expect(result.reason).toBe("NO_ENTITLEMENT");
    expect(result.legacyBangladeshTransitionalAccess).toBe(true);
  });

  it("no factory associated with the account: fails closed with NO_ENTITLEMENT, never calls the mapping service", async () => {
    const { controller, mapping } = makeController({});

    const result = await controller.getMyOptiFabricEntitlement(requestFor(undefined));

    expect(result).toEqual({
      isAccessAllowed: false,
      reason: "NO_ENTITLEMENT",
      legacyBangladeshTransitionalAccess: false,
      trialEndsAt: null,
      trialDaysRemaining: null,
      currentPeriodEnd: null,
      paidDaysRemaining: null,
    });
    expect(mapping.resolveOrLazilyMapOrganisation).not.toHaveBeenCalled();
  });

  it("factoryId does not resolve to any real Factory: fails closed with NO_ENTITLEMENT", async () => {
    const { controller, entitlementDecision } = makeController({
      resolveOrLazilyMapOrganisation: jest.fn().mockResolvedValue(null),
    });

    const result = await controller.getMyOptiFabricEntitlement(requestFor("factory-unknown"));

    expect(result.isAccessAllowed).toBe(false);
    expect(result.reason).toBe("NO_ENTITLEMENT");
    // No organisationId was ever resolved, so the decision service must
    // never be called with something invented.
    expect(entitlementDecision.getEffectiveEntitlement).not.toHaveBeenCalled();
  });

  it("only ever resolves the organisation from the authenticated user's own factoryId, never a second identity", async () => {
    const mappingSpy = jest.fn().mockResolvedValue("org-7");
    const { controller } = makeController({
      resolveOrLazilyMapOrganisation: mappingSpy,
      getEffectiveEntitlement: jest.fn().mockResolvedValue({ isAccessAllowed: true, reason: "PAID_ACTIVE" }),
      getEntitlementDates: jest.fn().mockResolvedValue({ trialEndsAt: null, currentPeriodEnd: daysFromNow(5) }),
    });

    await controller.getMyOptiFabricEntitlement(requestFor("factory-7"));

    expect(mappingSpy).toHaveBeenCalledTimes(1);
    expect(mappingSpy).toHaveBeenCalledWith("factory-7");
  });
});
