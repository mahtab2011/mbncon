// PHASE 2A (Issue 3) — coverage for AuthService.reconcileEntitlementOnboarding,
// the idempotent recovery mechanism triggered on every login. See
// docs/PHASE-2A-MAPPING-BACKFILL-HARDENING.md, "Issue 3", for why this
// approach (idempotent reconciliation on login) was chosen over a fake
// cross-database transaction or a controlled "pending" signup response.
import { AuthService } from "../src/modules/auth/auth.service";
import * as bcrypt from "bcrypt";

const BCRYPT_WORK_FACTOR = 12;

function buildPrismaMock() {
  return {
    user: { findFirst: jest.fn() },
    factory: { findUnique: jest.fn() },
  };
}

describe("AuthService.reconcileEntitlementOnboarding", () => {
  it("10/11. login after a failed signup completes mapping + starts the trial exactly once (recovery)", async () => {
    const passwordHash = await bcrypt.hash("password123", BCRYPT_WORK_FACTOR);
    const prisma = buildPrismaMock();
    prisma.user.findFirst.mockResolvedValue({
      id: "user-1",
      factoryId: "f-1",
      passwordHash,
      isActive: true,
    });
    prisma.factory.findUnique.mockResolvedValue({ id: "f-1", factoryName: "Hanoi Textiles", country: "Vietnam" });

    const organisationResolver = {
      resolveOrCreateOrganisationForOptiFabricFactory: jest.fn().mockResolvedValue("org-1"),
    };
    const entitlementOnboarding = {
      onboardNewBangladeshFactory: jest.fn(),
      onboardNewInternationalFactory: jest.fn().mockResolvedValue(undefined),
    };
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(
      prisma as never,
      jwtService as never,
      organisationResolver as never,
      entitlementOnboarding as never,
    );

    await service.validateCredentials("admin@test.local", "f-1", "password123");

    expect(organisationResolver.resolveOrCreateOrganisationForOptiFabricFactory).toHaveBeenCalledWith(
      "f-1",
      "Hanoi Textiles",
      "Vietnam",
    );
    expect(entitlementOnboarding.onboardNewInternationalFactory).toHaveBeenCalledWith("org-1");
    expect(entitlementOnboarding.onboardNewInternationalFactory).toHaveBeenCalledTimes(1);
  });

  it("11. a second login (retry) calls onboarding again, but onboardNewInternationalFactory's own idempotency (unchanged) prevents a trial extension", async () => {
    // This test proves the CALL happens on every login (the reconciliation
    // contract) — trial-extension safety itself is proven at the
    // EntitlementDecisionService level in test/entitlement-cutover.spec.ts
    // ("19. an existing trial is not extended/restarted by a signup retry")
    // and is not re-derived here with a fake Prisma client.
    const passwordHash = await bcrypt.hash("password123", BCRYPT_WORK_FACTOR);
    const prisma = buildPrismaMock();
    prisma.user.findFirst.mockResolvedValue({ id: "user-1", factoryId: "f-1", passwordHash, isActive: true });
    prisma.factory.findUnique.mockResolvedValue({ id: "f-1", factoryName: "Hanoi Textiles", country: "Vietnam" });

    const organisationResolver = {
      resolveOrCreateOrganisationForOptiFabricFactory: jest.fn().mockResolvedValue("org-1"),
    };
    const entitlementOnboarding = {
      onboardNewBangladeshFactory: jest.fn(),
      onboardNewInternationalFactory: jest.fn().mockResolvedValue(undefined),
    };
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(
      prisma as never,
      jwtService as never,
      organisationResolver as never,
      entitlementOnboarding as never,
    );

    await service.validateCredentials("admin@test.local", "f-1", "password123");
    await service.validateCredentials("admin@test.local", "f-1", "password123");

    expect(entitlementOnboarding.onboardNewInternationalFactory).toHaveBeenCalledTimes(2);
    expect(entitlementOnboarding.onboardNewInternationalFactory).toHaveBeenNthCalledWith(1, "org-1");
    expect(entitlementOnboarding.onboardNewInternationalFactory).toHaveBeenNthCalledWith(2, "org-1");
  });

  it("Bangladesh factory login -> reconciliation maps only, never calls onboardNewInternationalFactory", async () => {
    const passwordHash = await bcrypt.hash("password123", BCRYPT_WORK_FACTOR);
    const prisma = buildPrismaMock();
    prisma.user.findFirst.mockResolvedValue({ id: "user-bd", factoryId: "f-bd", passwordHash, isActive: true });
    prisma.factory.findUnique.mockResolvedValue({ id: "f-bd", factoryName: "Dhaka Garments", country: "Bangladesh" });

    const organisationResolver = {
      resolveOrCreateOrganisationForOptiFabricFactory: jest.fn().mockResolvedValue("org-bd"),
    };
    const entitlementOnboarding = {
      onboardNewBangladeshFactory: jest.fn(),
      onboardNewInternationalFactory: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(
      prisma as never,
      jwtService as never,
      organisationResolver as never,
      entitlementOnboarding as never,
    );

    await service.validateCredentials("admin@test.local", "f-bd", "password123");

    expect(entitlementOnboarding.onboardNewBangladeshFactory).toHaveBeenCalledTimes(1);
    expect(entitlementOnboarding.onboardNewInternationalFactory).not.toHaveBeenCalled();
  });

  it("10. reconciliation failure never blocks a legitimate login (best-effort, swallowed)", async () => {
    const passwordHash = await bcrypt.hash("password123", BCRYPT_WORK_FACTOR);
    const prisma = buildPrismaMock();
    prisma.user.findFirst.mockResolvedValue({ id: "user-1", factoryId: "f-1", passwordHash, isActive: true });
    prisma.factory.findUnique.mockResolvedValue({ id: "f-1", factoryName: "Hanoi Textiles", country: "Vietnam" });

    const organisationResolver = {
      resolveOrCreateOrganisationForOptiFabricFactory: jest.fn().mockRejectedValue(new Error("entitlement DB unreachable")),
    };
    const entitlementOnboarding = {
      onboardNewBangladeshFactory: jest.fn(),
      onboardNewInternationalFactory: jest.fn(),
    };
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(
      prisma as never,
      jwtService as never,
      organisationResolver as never,
      entitlementOnboarding as never,
    );

    const user = await service.validateCredentials("admin@test.local", "f-1", "password123");

    expect(user.id).toBe("user-1"); // login itself still succeeds
  });

  it("reconciliation for a factoryId with no Factory row is a safe no-op (never throws, never calls onboarding)", async () => {
    const prisma = buildPrismaMock();
    prisma.factory.findUnique.mockResolvedValue(null);
    const organisationResolver = { resolveOrCreateOrganisationForOptiFabricFactory: jest.fn() };
    const entitlementOnboarding = { onboardNewBangladeshFactory: jest.fn(), onboardNewInternationalFactory: jest.fn() };
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(
      prisma as never,
      jwtService as never,
      organisationResolver as never,
      entitlementOnboarding as never,
    );

    await expect(service.reconcileEntitlementOnboarding("ghost-factory")).resolves.toBeUndefined();
    expect(organisationResolver.resolveOrCreateOrganisationForOptiFabricFactory).not.toHaveBeenCalled();
  });
});
