// Phase 2 cutover coverage — the central-entitlement guard decision flow:
// JWT factoryId -> OrganisationExternalRef -> organisationId ->
// EntitlementDecisionService.canAccess(organisationId, "OPTIFABRIC").
//
// Uses a hand-built in-memory fake of the local entitlement Prisma client
// (see prisma/entitlement/schema.prisma), matching the mocking style
// already established in test/subscription-licensing.spec.ts and
// server/entitlement-api's own tests — no live database required.
import { HttpException } from "@nestjs/common";
import { SubscriptionGuard } from "../src/common/guards/subscription.guard";
import { EntitlementDecisionService } from "../src/entitlement/entitlement-decision.service";
import { OrganisationResolverService } from "../src/entitlement/organisation-resolver.service";
import { EntitlementOnboardingService } from "../src/entitlement/entitlement-onboarding.service";
import { FactoryOrganisationMappingService } from "../src/entitlement/factory-organisation-mapping.service";

type Product = "OPTIFABRIC" | "OPTISEWING";
type ExternalSystem = "BANGLADESH_APPAREL" | "OPTIFABRIC" | "OPTISEWING";

interface OrgRow {
  id: string;
  name: string;
  countryCode: string | null;
}
interface RefRow {
  id: string;
  organisationId: string;
  system: ExternalSystem;
  externalFactoryId: string;
}
interface EntitlementRow {
  id: string;
  organisationId: string;
  product: Product;
  source: "BANGLADESH_FREE" | "INTERNATIONAL_TRIAL" | "PAID";
  planCode: string | null;
  trialStartedAt: Date | null;
  trialEndsAt: Date | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

/** In-memory fake of the local `.prisma-entitlement-client` surface. */
function makeFakeEntitlementPrisma() {
  const organisations = new Map<string, OrgRow>();
  const refs = new Map<string, RefRow>(); // key: `${system}::${externalFactoryId}`
  const entitlements = new Map<string, EntitlementRow>(); // key: `${organisationId}::${product}`
  let nextId = 1;

  const refKey = (system: string, externalFactoryId: string) => `${system}::${externalFactoryId}`;
  const entKey = (organisationId: string, product: string) => `${organisationId}::${product}`;

  const organisation = {
    create: jest.fn(async ({ data }: { data: { name: string; countryCode?: string } }) => {
      const row: OrgRow = { id: `org-${nextId++}`, name: data.name, countryCode: data.countryCode ?? null };
      organisations.set(row.id, row);
      return row;
    }),
  };

  const organisationExternalRef = {
    findUnique: jest.fn(
      async ({ where }: { where: { system_externalFactoryId: { system: ExternalSystem; externalFactoryId: string } } }) => {
        const { system, externalFactoryId } = where.system_externalFactoryId;
        return refs.get(refKey(system, externalFactoryId)) ?? null;
      },
    ),
    create: jest.fn(
      async ({
        data,
      }: {
        data: { organisationId: string; system: ExternalSystem; externalFactoryId: string };
      }) => {
        const key = refKey(data.system, data.externalFactoryId);
        if (refs.has(key)) {
          const err = new Error("Unique constraint failed") as Error & { code: string };
          err.code = "P2002";
          throw err;
        }
        const row: RefRow = { id: `ref-${nextId++}`, ...data };
        refs.set(key, row);
        return row;
      },
    ),
  };

  const productEntitlement = {
    findUnique: jest.fn(
      async ({ where }: { where: { organisationId_product: { organisationId: string; product: Product } } }) => {
        const { organisationId, product } = where.organisationId_product;
        return entitlements.get(entKey(organisationId, product)) ?? null;
      },
    ),
    create: jest.fn(async ({ data }: { data: Partial<EntitlementRow> & { organisationId: string; product: Product; source: EntitlementRow["source"] } }) => {
      const row: EntitlementRow = {
        id: `pe-${nextId++}`,
        planCode: null,
        trialStartedAt: null,
        trialEndsAt: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        ...data,
      };
      entitlements.set(entKey(row.organisationId, row.product), row);
      return row;
    }),
  };

  const prisma = {
    organisation,
    organisationExternalRef,
    productEntitlement,
    $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  };

  return { prisma: prisma as never, organisations, refs, entitlements };
}

interface FactoryRow {
  id: string;
  factoryName: string;
  country: string;
}

/**
 * In-memory fake of the OptiFabric-side PrismaService surface that
 * FactoryOrganisationMappingService needs (Factory.findUnique only) — a
 * trusted "server-side Factory record" for lazy-mapping tests. Separate
 * from makeFakeEntitlementPrisma(), which fakes the entitlement database.
 */
function makeFakeOptiFabricPrisma(factories: FactoryRow[] = []) {
  const byId = new Map(factories.map((f) => [f.id, f]));
  return {
    factory: {
      findUnique: jest.fn(async ({ where }: { where: { id: string } }) => byId.get(where.id) ?? null),
    },
  } as never;
}

/** Builds a real FactoryOrganisationMappingService over fake OptiFabric + entitlement Prisma clients. */
function buildMapping(entitlementPrisma: unknown, factories: FactoryRow[], resolver?: OrganisationResolverService) {
  const optifabricPrisma = makeFakeOptiFabricPrisma(factories);
  return new FactoryOrganisationMappingService(
    optifabricPrisma,
    resolver ?? new OrganisationResolverService(entitlementPrisma as never),
  );
}

function seedEntitlement(
  entitlements: Map<string, EntitlementRow>,
  organisationId: string,
  product: Product,
  fields: Partial<EntitlementRow> & { source: EntitlementRow["source"] },
) {
  entitlements.set(`${organisationId}::${product}`, {
    id: `pe-seed-${organisationId}-${product}`,
    organisationId,
    product,
    planCode: null,
    trialStartedAt: null,
    trialEndsAt: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    ...fields,
  });
}

function buildContext(user: unknown) {
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as never;
}

function buildLegacySubscriptionServiceStub(getEffectiveStateImpl: (factoryId: string) => Promise<unknown>) {
  return { getEffectiveState: jest.fn(getEffectiveStateImpl) } as never;
}

const noSkipReflector = { getAllAndOverride: jest.fn().mockReturnValue(false) } as never;

describe("Entitlement cutover — SubscriptionGuard access decisions", () => {
  it("1. mapped factory + active OptiFabric trial -> allowed", async () => {
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });
    seedEntitlement(entitlements, "org-1", "OPTIFABRIC", { source: "INTERNATIONAL_TRIAL", trialEndsAt: daysFromNow(10) });

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).resolves.toBe(true);
  });

  it("2. mapped factory + expired trial -> denied", async () => {
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });
    seedEntitlement(entitlements, "org-1", "OPTIFABRIC", { source: "INTERNATIONAL_TRIAL", trialEndsAt: daysFromNow(-1) });

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).rejects.toBeInstanceOf(HttpException);
  });

  it("3. mapped factory + OptiFabric-only paid -> allowed", async () => {
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });
    seedEntitlement(entitlements, "org-1", "OPTIFABRIC", {
      source: "PAID",
      planCode: "OPTIFABRIC_MONTHLY",
      currentPeriodEnd: daysFromNow(20),
    });

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).resolves.toBe(true);
  });

  it("4. mapped factory + OptiSewing-only paid -> OptiFabric denied", async () => {
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });
    seedEntitlement(entitlements, "org-1", "OPTISEWING", {
      source: "PAID",
      planCode: "OPTISEWING_MONTHLY",
      currentPeriodEnd: daysFromNow(20),
    });
    // Deliberately no OPTIFABRIC row for org-1.

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).rejects.toBeInstanceOf(HttpException);
  });

  it("5. mapped factory + bundle -> OptiFabric allowed", async () => {
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });
    seedEntitlement(entitlements, "org-1", "OPTIFABRIC", {
      source: "PAID",
      planCode: "BUNDLE_MONTHLY",
      currentPeriodEnd: daysFromNow(20),
    });
    seedEntitlement(entitlements, "org-1", "OPTISEWING", {
      source: "PAID",
      planCode: "BUNDLE_MONTHLY",
      currentPeriodEnd: daysFromNow(20),
    });

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).resolves.toBe(true);
  });

  it("6. Bangladesh-free central entitlement -> allowed", async () => {
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });
    seedEntitlement(entitlements, "org-1", "OPTIFABRIC", { source: "BANGLADESH_FREE" });

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).resolves.toBe(true);
  });

  it("7. mapped factory, no entitlement row at all, no legacy Bangladesh fallback -> denied", async () => {
    const { prisma, refs } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).rejects.toBeInstanceOf(HttpException);
  });

  it("8. invalid/nonexistent factoryId (no Factory row at all) -> denied (fail closed, not silently allowed)", async () => {
    // PHASE 2A: this is now the ONLY way to reach the guard's "no
    // organisationId" branch — a merely-unmapped-but-real factory is
    // lazily mapped instead (see the two tests below). This factoryId
    // corresponds to no Factory row anywhere, so lazy mapping legitimately
    // fails to resolve one.
    const { prisma } = makeFakeEntitlementPrisma(); // no ref seeded at all
    const resolver = new OrganisationResolverService(prisma);

    const decision = new EntitlementDecisionService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "unmapped-factory" }))).rejects.toBeInstanceOf(
      HttpException,
    );
  });

  it("8a. PHASE 2A FIX: existing Bangladesh factory with NO mapping yet -> lazily mapped, transitional fallback engages (was previously locked out)", async () => {
    // This is the exact lockout scenario the Phase 2A review identified:
    // before the fix, "no OrganisationExternalRef" denied immediately,
    // before the Bangladesh fallback ever ran. Now the factory gets mapped
    // on the fly from its trusted server-side Factory row, THEN the
    // central/fallback decision runs.
    const { prisma } = makeFakeEntitlementPrisma(); // no ref, no central entitlement — fully unmapped
    const resolver = new OrganisationResolverService(prisma);
    const mapping = buildMapping(prisma, [{ id: "f-bd-legacy", factoryName: "Dhaka Garments", country: "Bangladesh" }], resolver);

    const decision = new EntitlementDecisionService(prisma);
    const onboarding = new EntitlementOnboardingService(
      decision,
      buildLegacySubscriptionServiceStub(async () => ({ status: "FREE_REGIONAL", isAccessAllowed: true })),
    );
    const guard = new SubscriptionGuard(noSkipReflector, mapping, onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-bd-legacy" }))).resolves.toBe(true);
  });

  it("8b. repeating the same previously-unmapped request does not create a duplicate Organisation/ref (lazy mapping is idempotent)", async () => {
    const { prisma, organisations, refs } = makeFakeEntitlementPrisma();
    const resolver = new OrganisationResolverService(prisma);
    const mapping = buildMapping(prisma, [{ id: "f-bd-legacy", factoryName: "Dhaka Garments", country: "Bangladesh" }], resolver);

    const decision = new EntitlementDecisionService(prisma);
    const onboarding = new EntitlementOnboardingService(
      decision,
      buildLegacySubscriptionServiceStub(async () => ({ status: "FREE_REGIONAL", isAccessAllowed: true })),
    );
    const guard = new SubscriptionGuard(noSkipReflector, mapping, onboarding, decision);

    await guard.canActivate(buildContext({ factoryId: "f-bd-legacy" }));
    await guard.canActivate(buildContext({ factoryId: "f-bd-legacy" }));

    expect(organisations.size).toBe(1);
    expect(refs.size).toBe(1);
  });

  it("8c. existing INTERNATIONAL factory with no mapping and no backfilled trial -> lazily mapped, but still correctly denied (mapping alone grants nothing)", async () => {
    const { prisma } = makeFakeEntitlementPrisma();
    const resolver = new OrganisationResolverService(prisma);
    const mapping = buildMapping(prisma, [{ id: "f-intl-legacy", factoryName: "Hanoi Textiles", country: "Vietnam" }], resolver);

    const decision = new EntitlementDecisionService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, mapping, onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-intl-legacy" }))).rejects.toBeInstanceOf(HttpException);
  });

  it("9. invalid/missing factoryId on the authenticated user -> denied", async () => {
    const { prisma } = makeFakeEntitlementPrisma();
    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "" }))).rejects.toBeInstanceOf(HttpException);
    await expect(guard.canActivate(buildContext({}))).rejects.toBeInstanceOf(HttpException);
  });

  it("10. login/auth route remains exempt via @SkipSubscriptionCheck()", async () => {
    const skipReflector = { getAllAndOverride: jest.fn().mockReturnValue(true) } as never;
    const { prisma } = makeFakeEntitlementPrisma();
    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const spyResolve = jest.spyOn(resolver, "resolveOrganisationForOptiFabricFactory");
    const guard = new SubscriptionGuard(skipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).resolves.toBe(true);
    expect(spyResolve).not.toHaveBeenCalled();
  });

  it("11. subscription/pricing route remains exempt via @SkipSubscriptionCheck() (same mechanism as auth)", async () => {
    // AuthController and every SubscriptionController handler carry
    // @SkipSubscriptionCheck() — see auth.controller.ts and
    // subscription.controller.ts, both unchanged by Phase 2. This test
    // re-confirms the guard's skip path (shared by both) still short-circuits
    // before any entitlement lookup.
    const skipReflector = { getAllAndOverride: jest.fn().mockReturnValue(true) } as never;
    const { prisma } = makeFakeEntitlementPrisma();
    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const spyCanAccess = jest.spyOn(decision, "canAccess");
    const guard = new SubscriptionGuard(skipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).resolves.toBe(true);
    expect(spyCanAccess).not.toHaveBeenCalled();
  });

  it("12. client cannot choose product=OPTISEWING to bypass the OptiFabric guard", async () => {
    // The guard's product argument to canAccess is a hardcoded literal
    // ("OPTIFABRIC") in subscription.guard.ts — not read from the request
    // body/query/headers at all, so there is no field a client could set to
    // change it. This factory has only an OptiSewing entitlement; confirm
    // the guard still denies (it can never evaluate "OPTISEWING" no matter
    // what the request contains).
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });
    seedEntitlement(entitlements, "org-1", "OPTISEWING", {
      source: "PAID",
      planCode: "OPTISEWING_MONTHLY",
      currentPeriodEnd: daysFromNow(20),
    });

    const decision = new EntitlementDecisionService(prisma);
    const canAccessSpy = jest.spyOn(decision, "canAccess");
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    // Attacker-controlled fields on the request user object, if any existed,
    // are irrelevant — canActivate() only ever reads `user.factoryId`.
    await expect(
      guard.canActivate(buildContext({ factoryId: "f-1", product: "OPTISEWING", role: "ANYTHING" })),
    ).rejects.toBeInstanceOf(HttpException);
    expect(canAccessSpy).toHaveBeenCalledWith("org-1", "OPTIFABRIC");
  });

  it("13. client clock manipulation is irrelevant — access is decided by the server's own Date.now()", async () => {
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });
    seedEntitlement(entitlements, "org-1", "OPTIFABRIC", { source: "INTERNATIONAL_TRIAL", trialEndsAt: daysFromNow(-1) });

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    // No client-supplied date exists anywhere in the request path for this
    // guard to read — canActivate()'s signature carries no date/time field.
    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }))).rejects.toBeInstanceOf(HttpException);
  });

  it("20. the guard always evaluates the OPTIFABRIC constant, never a per-request value", async () => {
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-1", { id: "r1", organisationId: "org-1", system: "OPTIFABRIC", externalFactoryId: "f-1" });
    seedEntitlement(entitlements, "org-1", "OPTIFABRIC", { source: "BANGLADESH_FREE" });

    const decision = new EntitlementDecisionService(prisma);
    const canAccessSpy = jest.spyOn(decision, "canAccess");
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(decision, buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })));
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await guard.canActivate(buildContext({ factoryId: "f-1" }));
    expect(canAccessSpy.mock.calls[0][1]).toBe("OPTIFABRIC");
  });
});

describe("Entitlement cutover — Bangladesh transitional compatibility", () => {
  it("engages only when central has NO_ENTITLEMENT and legacy status is FREE_REGIONAL and allowed", async () => {
    const { prisma, refs } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-bd", { id: "r1", organisationId: "org-bd", system: "OPTIFABRIC", externalFactoryId: "f-bd" });
    // No central entitlement row exists for org-bd at all.

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(
      decision,
      buildLegacySubscriptionServiceStub(async () => ({ status: "FREE_REGIONAL", isAccessAllowed: true })),
    );
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-bd" }))).resolves.toBe(true);
  });

  it("does NOT engage when central entitlement exists but has genuinely expired (a real denial is never overridden)", async () => {
    const { prisma, refs, entitlements } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-bd", { id: "r1", organisationId: "org-bd", system: "OPTIFABRIC", externalFactoryId: "f-bd" });
    seedEntitlement(entitlements, "org-bd", "OPTIFABRIC", { source: "INTERNATIONAL_TRIAL", trialEndsAt: daysFromNow(-5) });

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(
      decision,
      buildLegacySubscriptionServiceStub(async () => ({ status: "FREE_REGIONAL", isAccessAllowed: true })),
    );
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-bd" }))).rejects.toBeInstanceOf(HttpException);
  });

  it("does NOT engage when the legacy status is not FREE_REGIONAL (e.g. a plain expired trial)", async () => {
    const { prisma, refs } = makeFakeEntitlementPrisma();
    refs.set("OPTIFABRIC::f-x", { id: "r1", organisationId: "org-x", system: "OPTIFABRIC", externalFactoryId: "f-x" });

    const decision = new EntitlementDecisionService(prisma);
    const resolver = new OrganisationResolverService(prisma);
    const onboarding = new EntitlementOnboardingService(
      decision,
      buildLegacySubscriptionServiceStub(async () => ({ status: "EXPIRED", isAccessAllowed: false })),
    );
    const guard = new SubscriptionGuard(noSkipReflector, buildMapping(prisma, [], resolver), onboarding, decision);

    await expect(guard.canActivate(buildContext({ factoryId: "f-x" }))).rejects.toBeInstanceOf(HttpException);
  });
});

describe("Entitlement cutover — OrganisationResolverService mapping", () => {
  it("15. repeated resolveOrCreateOrganisationForOptiFabricFactory does not create a duplicate Organisation", async () => {
    const { prisma, organisations } = makeFakeEntitlementPrisma();
    const resolver = new OrganisationResolverService(prisma);

    const first = await resolver.resolveOrCreateOrganisationForOptiFabricFactory("f-1", "Test Factory", "Vietnam");
    const second = await resolver.resolveOrCreateOrganisationForOptiFabricFactory("f-1", "Test Factory", "Vietnam");

    expect(first).toBe(second);
    expect(organisations.size).toBe(1);
  });

  it("16. repeated external-ref creation is idempotent (unique-constraint race is handled, not thrown)", async () => {
    const { prisma, refs } = makeFakeEntitlementPrisma();
    const resolver = new OrganisationResolverService(prisma);

    await resolver.resolveOrCreateOrganisationForOptiFabricFactory("f-1", "Test Factory", "Vietnam");
    expect(refs.size).toBe(1);

    // Simulate a second concurrent/retried onboarding call for the SAME
    // factory — must not throw and must not create a second ref.
    await expect(
      resolver.resolveOrCreateOrganisationForOptiFabricFactory("f-1", "Test Factory", "Vietnam"),
    ).resolves.toBeDefined();
    expect(refs.size).toBe(1);
  });

  it("resolveOrganisationForOptiFabricFactory returns null for an unmapped factory (read-only, no side effect)", async () => {
    const { prisma, organisations, refs } = makeFakeEntitlementPrisma();
    const resolver = new OrganisationResolverService(prisma);

    const result = await resolver.resolveOrganisationForOptiFabricFactory("never-mapped");

    expect(result).toBeNull();
    expect(organisations.size).toBe(0);
    expect(refs.size).toBe(0);
  });
});

describe("Entitlement cutover — international trial creation", () => {
  it("17. startInternationalTrial creates entitlement rows for both OPTIFABRIC and OPTISEWING", async () => {
    const { prisma, entitlements } = makeFakeEntitlementPrisma();
    const decision = new EntitlementDecisionService(prisma);

    await decision.startInternationalTrial("org-1");

    expect(entitlements.has("org-1::OPTIFABRIC")).toBe(true);
    expect(entitlements.has("org-1::OPTISEWING")).toBe(true);
  });

  it("18. both trial rows share the exact same trialStartedAt/trialEndsAt", async () => {
    const { prisma, entitlements } = makeFakeEntitlementPrisma();
    const decision = new EntitlementDecisionService(prisma);

    await decision.startInternationalTrial("org-1");

    const fabric = entitlements.get("org-1::OPTIFABRIC")!;
    const sewing = entitlements.get("org-1::OPTISEWING")!;
    expect(fabric.trialStartedAt!.getTime()).toBe(sewing.trialStartedAt!.getTime());
    expect(fabric.trialEndsAt!.getTime()).toBe(sewing.trialEndsAt!.getTime());
    expect(fabric.trialEndsAt!.getTime() - fabric.trialStartedAt!.getTime()).toBe(90 * 24 * 60 * 60 * 1000);
  });

  it("19. an existing trial is not extended/restarted by a signup retry", async () => {
    const { prisma, entitlements } = makeFakeEntitlementPrisma();
    const decision = new EntitlementDecisionService(prisma);

    await decision.startInternationalTrial("org-1");
    const originalEndsAt = entitlements.get("org-1::OPTIFABRIC")!.trialEndsAt!.getTime();

    // Age the trial, then retry — must not reset it.
    entitlements.get("org-1::OPTIFABRIC")!.trialEndsAt = daysFromNow(40);
    entitlements.get("org-1::OPTISEWING")!.trialEndsAt = daysFromNow(40);
    const beforeRetry = entitlements.get("org-1::OPTIFABRIC")!.trialEndsAt!.getTime();

    await decision.startInternationalTrial("org-1");

    expect(entitlements.get("org-1::OPTIFABRIC")!.trialEndsAt!.getTime()).toBe(beforeRetry);
    expect(beforeRetry).not.toBe(originalEndsAt); // sanity: we did age it above
  });

  it("14. a second login (a pure read) never touches entitlement rows or restarts a trial", async () => {
    const { prisma, entitlements } = makeFakeEntitlementPrisma();
    const decision = new EntitlementDecisionService(prisma);
    await decision.startInternationalTrial("org-1");
    const before = entitlements.get("org-1::OPTIFABRIC")!.trialEndsAt!.getTime();

    // A "second login" only ever calls read methods (getEffectiveEntitlement/
    // canAccess) — there is no code path from login to startInternationalTrial.
    await decision.getEffectiveEntitlement("org-1", "OPTIFABRIC");
    await decision.canAccess("org-1", "OPTIFABRIC");

    expect(entitlements.get("org-1::OPTIFABRIC")!.trialEndsAt!.getTime()).toBe(before);
  });
});
