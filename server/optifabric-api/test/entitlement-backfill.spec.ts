// PHASE 2A — coverage for EntitlementBackfillService: preserving historical
// trial/paid dates when migrating legacy Subscription rows into the
// central entitlement database. Uses the same hand-built in-memory fakes
// as test/entitlement-cutover.spec.ts (entitlement side) plus a fake of
// the OptiFabric-side PrismaService surface this service also reads
// (Factory, Subscription) — no live database required, as instructed.
//
// Stage 2H-1: backfillOptiFabricEntitlements() now defaults to dry-run
// (`{ dryRun: true }`) and only writes anything when explicitly called with
// `{ dryRun: false }`. Every pre-existing test below that asserts a real
// mutation happened (a row was created, dates were preserved, idempotency
// held across repeated real runs, etc.) was updated to pass
// `{ dryRun: false }` explicitly — the assertions themselves are unchanged,
// since apply mode preserves the exact previously-tested mutation
// behavior. The new dry-run-specific tests are further down this file.
import { EntitlementBackfillService } from "../src/entitlement/entitlement-backfill.service";
import { OrganisationResolverService } from "../src/entitlement/organisation-resolver.service";
import { SubscriptionService } from "../src/modules/subscription/subscription.service";
import { SignableSubscriptionFields, signSubscriptionFields } from "../src/modules/subscription/subscription-signing";

const TEST_SECRET = "f".repeat(64);

// SubscriptionService.computeEffectiveState verifies a real HMAC signature
// over every legacy row it reads (tamper-evidence, unchanged by Phase 2A) —
// see subscription-signing.ts. Fake subscription rows in this file must
// carry a real signature computed the same way, under a real
// LICENSE_SIGNING_SECRET, or computeEffectiveState treats them as tampered.
async function withLicenseSecret<T>(fn: () => Promise<T>): Promise<T> {
  const original = process.env.LICENSE_SIGNING_SECRET;
  process.env.LICENSE_SIGNING_SECRET = TEST_SECRET;
  try {
    return await fn();
  } finally {
    if (original === undefined) delete process.env.LICENSE_SIGNING_SECRET;
    else process.env.LICENSE_SIGNING_SECRET = original;
  }
}

function signedSubscriptionRow(
  fields: SignableSubscriptionFields & { createdAt: Date },
): SignableSubscriptionFields & { createdAt: Date; signature: string } {
  return { ...fields, signature: signSubscriptionFields(fields) };
}

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

/** Same fake shape as test/entitlement-cutover.spec.ts's makeFakeEntitlementPrisma(). */
function makeFakeEntitlementPrisma() {
  const organisations = new Map<string, OrgRow>();
  const refs = new Map<string, RefRow>();
  const entitlements = new Map<string, EntitlementRow>();
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
      async ({ data }: { data: { organisationId: string; system: ExternalSystem; externalFactoryId: string } }) => {
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

  return {
    prisma: { organisation, organisationExternalRef, productEntitlement } as never,
    organisations,
    refs,
    entitlements,
  };
}

interface FakeFactoryRow {
  id: string;
  factoryName: string;
  country: string;
}
interface FakeSubscriptionRow extends SignableSubscriptionFields {
  createdAt: Date;
  signature: string;
}

/** Fake of the OptiFabric-side PrismaService surface EntitlementBackfillService reads. */
function makeFakeOptiFabricPrisma(factories: FakeFactoryRow[], subscriptions: Record<string, FakeSubscriptionRow>) {
  return {
    factory: {
      findMany: jest.fn(async () => factories),
    },
    subscription: {
      findUnique: jest.fn(async ({ where }: { where: { factoryId: string } }) => subscriptions[where.factoryId] ?? null),
    },
  } as never;
}

function buildService(
  factories: FakeFactoryRow[],
  subscriptions: Record<string, FakeSubscriptionRow>,
  entitlementPrisma: unknown,
) {
  const optifabricPrisma = makeFakeOptiFabricPrisma(factories, subscriptions);
  const resolver = new OrganisationResolverService(entitlementPrisma as never);
  const legacySubscriptionService = new SubscriptionService(optifabricPrisma as never);
  return new EntitlementBackfillService(optifabricPrisma, resolver, legacySubscriptionService, entitlementPrisma as never);
}

describe("EntitlementBackfillService.backfillOptiFabricEntitlements", () => {
  it("3. existing international ACTIVE trial + no mapping -> migrated, retains the ORIGINAL trialEndsAt exactly", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements } = makeFakeEntitlementPrisma();
      const originalTrialEndsAt = daysFromNow(35);
      const createdAt = new Date(Date.now() - 55 * 24 * 60 * 60 * 1000);
      const service = buildService(
        [{ id: "f-1", factoryName: "Hanoi Textiles", country: "Vietnam" }],
        {
          "f-1": signedSubscriptionRow({
            factoryId: "f-1",
            planType: "TRIAL",
            status: "TRIALING",
            trialEndsAt: originalTrialEndsAt,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt,
          }),
        },
        prisma,
      );

      const report = await service.backfillOptiFabricEntitlements({ dryRun: false });

      expect(report.activeTrialsMigrated).toBe(1);
      expect(report.expiredTrialsMigrated).toBe(0);
      const row = [...entitlements.values()][0];
      expect(row.source).toBe("INTERNATIONAL_TRIAL");
      expect(row.trialEndsAt!.getTime()).toBe(originalTrialEndsAt.getTime());
      expect(row.trialStartedAt!.getTime()).toBe(createdAt.getTime());
      // Never re-issues a fresh 90-day window from "now".
      expect(row.trialEndsAt!.getTime()).not.toBe(daysFromNow(90).getTime());
    });
  });

  it("4. existing international EXPIRED trial -> migrated, remains expired (no new 90 days issued)", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements } = makeFakeEntitlementPrisma();
      const originalTrialEndsAt = daysFromNow(-20);
      const service = buildService(
        [{ id: "f-2", factoryName: "Old Factory", country: "Vietnam" }],
        {
          "f-2": signedSubscriptionRow({
            factoryId: "f-2",
            planType: "TRIAL",
            status: "TRIALING",
            trialEndsAt: originalTrialEndsAt,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-110),
          }),
        },
        prisma,
      );

      const report = await service.backfillOptiFabricEntitlements({ dryRun: false });

      expect(report.expiredTrialsMigrated).toBe(1);
      expect(report.activeTrialsMigrated).toBe(0);
      const row = [...entitlements.values()][0];
      expect(row.trialEndsAt!.getTime()).toBe(originalTrialEndsAt.getTime());
      expect(row.trialEndsAt!.getTime()).toBeLessThan(Date.now());
    });
  });

  it("5. re-running the backfill never restarts a historical trial (idempotent — second run is a no-op for this factory)", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements } = makeFakeEntitlementPrisma();
      const originalTrialEndsAt = daysFromNow(10);
      const service = buildService(
        [{ id: "f-3", factoryName: "Repeat Factory", country: "Vietnam" }],
        {
          "f-3": signedSubscriptionRow({
            factoryId: "f-3",
            planType: "TRIAL",
            status: "TRIALING",
            trialEndsAt: originalTrialEndsAt,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-80),
          }),
        },
        prisma,
      );

      const first = await service.backfillOptiFabricEntitlements({ dryRun: false });
      expect(first.activeTrialsMigrated).toBe(1);

      // Age what's stored, then re-run — must NOT touch the row at all.
      const key = [...entitlements.keys()][0];
      const agedTrialEndsAt = daysFromNow(999);
      entitlements.get(key)!.trialEndsAt = agedTrialEndsAt;

      const second = await service.backfillOptiFabricEntitlements({ dryRun: false });

      expect(second.activeTrialsMigrated).toBe(0);
      expect(second.alreadyMappedOrSkipped).toBe(1);
      expect(entitlements.get(key)!.trialEndsAt!.getTime()).toBe(agedTrialEndsAt.getTime());
    });
  });

  it("6. historical ACTIVE OptiFabric paid period -> correct OPTIFABRIC entitlement retained", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements } = makeFakeEntitlementPrisma();
      const currentPeriodStart = daysFromNow(-10);
      const currentPeriodEnd = daysFromNow(20);
      const service = buildService(
        [{ id: "f-4", factoryName: "Paid Factory", country: "Vietnam" }],
        {
          "f-4": signedSubscriptionRow({
            factoryId: "f-4",
            planType: "MONTHLY",
            status: "ACTIVE",
            trialEndsAt: new Date(0),
            currentPeriodStart,
            currentPeriodEnd,
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-10),
          }),
        },
        prisma,
      );

      const report = await service.backfillOptiFabricEntitlements({ dryRun: false });

      expect(report.activePaidMigrated).toBe(1);
      const row = [...entitlements.values()][0];
      expect(row.product).toBe("OPTIFABRIC");
      expect(row.source).toBe("PAID");
      expect(row.currentPeriodEnd!.getTime()).toBe(currentPeriodEnd.getTime());
      expect(row.currentPeriodStart!.getTime()).toBe(currentPeriodStart.getTime());
    });
  });

  it("preserves access through a legacy GRACE_PERIOD instead of wrongly denying it at backfill time", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements } = makeFakeEntitlementPrisma();
      const currentPeriodEnd = daysFromNow(-2); // nominal period already passed
      const graceEndsAt = daysFromNow(5); // but still within the 7-day grace window
      const service = buildService(
        [{ id: "f-5", factoryName: "Grace Factory", country: "Vietnam" }],
        {
          "f-5": signedSubscriptionRow({
            factoryId: "f-5",
            planType: "MONTHLY",
            status: "GRACE_PERIOD",
            trialEndsAt: new Date(0),
            currentPeriodStart: daysFromNow(-32),
            currentPeriodEnd,
            graceEndsAt,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-32),
          }),
        },
        prisma,
      );

      const report = await service.backfillOptiFabricEntitlements({ dryRun: false });

      expect(report.activePaidMigrated).toBe(1);
      const row = [...entitlements.values()][0];
      // currentPeriodEnd must be the grace-adjusted date, not the already-past
      // nominal one, or central access would wrongly deny this factory.
      expect(row.currentPeriodEnd!.getTime()).toBe(graceEndsAt.getTime());
      expect(row.currentPeriodEnd!.getTime()).toBeGreaterThan(Date.now());
    });
  });

  it("historical EXPIRED/CANCELLED paid period -> migrated, remains denied", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements } = makeFakeEntitlementPrisma();
      const service = buildService(
        [{ id: "f-6", factoryName: "Lapsed Factory", country: "Vietnam" }],
        {
          "f-6": signedSubscriptionRow({
            factoryId: "f-6",
            planType: "ANNUAL",
            status: "CANCELLED",
            trialEndsAt: new Date(0),
            currentPeriodStart: daysFromNow(-400),
            currentPeriodEnd: daysFromNow(-40),
            graceEndsAt: null,
            includedSeats: 5,
            extraSeats: 0,
            cancelAtPeriodEnd: true,
            createdAt: daysFromNow(-400),
          }),
        },
        prisma,
      );

      const report = await service.backfillOptiFabricEntitlements({ dryRun: false });

      expect(report.expiredMigrated).toBe(1);
      expect(report.activePaidMigrated).toBe(0);
      const row = [...entitlements.values()][0];
      expect(row.currentPeriodEnd!.getTime()).toBeLessThan(Date.now());
    });
  });

  it("7. an old OptiFabric-only paid plan does NOT grant OptiSewing paid entitlement", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements } = makeFakeEntitlementPrisma();
      const service = buildService(
        [{ id: "f-7", factoryName: "Fabric Only Factory", country: "Vietnam" }],
        {
          "f-7": signedSubscriptionRow({
            factoryId: "f-7",
            planType: "MONTHLY",
            status: "ACTIVE",
            trialEndsAt: new Date(0),
            currentPeriodStart: daysFromNow(-5),
            currentPeriodEnd: daysFromNow(25),
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-5),
          }),
        },
        prisma,
      );

      await service.backfillOptiFabricEntitlements({ dryRun: false });

      const products = [...entitlements.values()].map((r) => r.product);
      expect(products).toEqual(["OPTIFABRIC"]);
      expect(products).not.toContain("OPTISEWING");
    });
  });

  it("legacy Bangladesh factory -> identified/reported, NEVER auto-converted to a central BANGLADESH_FREE grant", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements } = makeFakeEntitlementPrisma();
      const service = buildService(
        [{ id: "f-bd", factoryName: "Dhaka Garments", country: "Bangladesh" }],
        {}, // no legacy Subscription row needed — country alone drives legacy access
        prisma,
      );

      const report = await service.backfillOptiFabricEntitlements({ dryRun: false });

      expect(report.legacyBangladeshFreeDetected).toBe(1);
      expect(entitlements.size).toBe(0); // no central row written at all
    });
  });

  it("full idempotency: running the backfill twice produces identical entitlement state and non-zero organisationsCreated only once", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements, organisations, refs } = makeFakeEntitlementPrisma();
      const service = buildService(
        [
          { id: "f-a", factoryName: "A", country: "Vietnam" },
          { id: "f-b", factoryName: "B", country: "Bangladesh" },
        ],
        {
          "f-a": signedSubscriptionRow({
            factoryId: "f-a",
            planType: "TRIAL",
            status: "TRIALING",
            trialEndsAt: daysFromNow(50),
            currentPeriodStart: null,
            currentPeriodEnd: null,
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-40),
          }),
        },
        prisma,
      );

      const first = await service.backfillOptiFabricEntitlements({ dryRun: false });
      expect(first.organisationsCreated).toBe(2);
      expect(first.refsCreated).toBe(2);
      expect(first.activeTrialsMigrated).toBe(1);
      expect(first.legacyBangladeshFreeDetected).toBe(1);

      const orgSnapshot = new Map(organisations);
      const refSnapshot = new Map(refs);
      const entitlementSnapshot = new Map(entitlements);

      const second = await service.backfillOptiFabricEntitlements({ dryRun: false });
      expect(second.organisationsCreated).toBe(0);
      expect(second.refsCreated).toBe(0);
      expect(second.activeTrialsMigrated).toBe(0);
      expect(second.legacyBangladeshFreeDetected).toBe(1); // still reported every run — read-only

      expect(organisations).toEqual(orgSnapshot);
      expect(refs).toEqual(refSnapshot);
      expect(entitlements).toEqual(entitlementSnapshot);
    });
  });

  it("errors on one factory do not abort the batch, and are captured in the report", async () => {
    await withLicenseSecret(async () => {
      const { prisma } = makeFakeEntitlementPrisma();
      const optifabricPrisma = {
        factory: {
          findMany: jest.fn(async () => [
            { id: "f-good", factoryName: "Good", country: "Vietnam" },
            { id: "f-bad", factoryName: "Bad", country: "Vietnam" },
          ]),
        },
        subscription: {
          findUnique: jest.fn(async ({ where }: { where: { factoryId: string } }) => {
            if (where.factoryId === "f-bad") throw new Error("simulated DB failure");
            return null;
          }),
        },
      } as never;
      const resolver = new OrganisationResolverService(prisma as never);
      const legacySubscriptionService = new SubscriptionService(optifabricPrisma);
      const service = new EntitlementBackfillService(optifabricPrisma, resolver, legacySubscriptionService, prisma as never);

      const report = await service.backfillOptiFabricEntitlements({ dryRun: false });

      expect(report.factoriesScanned).toBe(2);
      expect(report.errors).toHaveLength(1);
      expect(report.errors[0].factoryId).toBe("f-bad");
      expect(report.alreadyMappedOrSkipped).toBe(1); // f-good: no subscription row -> skipped cleanly
    });
  });
});

// Stage 2H-1 — dry-run safety contract at the service layer. The CLI
// argv-parsing contract itself (no arg / --dry-run / --apply / unknown /
// conflicting flags) is tested separately in test/backfill-cli.spec.ts,
// since parseBackfillCliArgs has no service/database dependency at all.
describe("EntitlementBackfillService — dry-run safety (Stage 2H-1)", () => {
  it("A. calling with no options at all defaults to dry-run and writes nothing", async () => {
    await withLicenseSecret(async () => {
      const { prisma, organisations, refs, entitlements } = makeFakeEntitlementPrisma();
      const service = buildService(
        [{ id: "f-default", factoryName: "Default Mode Factory", country: "Vietnam" }],
        {
          "f-default": signedSubscriptionRow({
            factoryId: "f-default",
            planType: "TRIAL",
            status: "TRIALING",
            trialEndsAt: daysFromNow(30),
            currentPeriodStart: null,
            currentPeriodEnd: null,
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-60),
          }),
        },
        prisma,
      );

      // No options argument at all — must behave exactly like { dryRun: true }.
      const report = await service.backfillOptiFabricEntitlements();

      expect(report.activeTrialsMigrated).toBe(1); // still classified/reported
      expect(organisations.size).toBe(0);
      expect(refs.size).toBe(0);
      expect(entitlements.size).toBe(0);
    });
  });

  it("B. { dryRun: true } performs zero create/update/delete calls on the entitlement Prisma client", async () => {
    await withLicenseSecret(async () => {
      const { prisma, entitlements } = makeFakeEntitlementPrisma();
      const service = buildService(
        [
          { id: "f-dr-1", factoryName: "Dry Run Trial", country: "Vietnam" },
          { id: "f-dr-2", factoryName: "Dry Run Paid", country: "Vietnam" },
          { id: "f-dr-bd", factoryName: "Dry Run Bangladesh", country: "Bangladesh" },
        ],
        {
          "f-dr-1": signedSubscriptionRow({
            factoryId: "f-dr-1",
            planType: "TRIAL",
            status: "TRIALING",
            trialEndsAt: daysFromNow(15),
            currentPeriodStart: null,
            currentPeriodEnd: null,
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-75),
          }),
          "f-dr-2": signedSubscriptionRow({
            factoryId: "f-dr-2",
            planType: "MONTHLY",
            status: "ACTIVE",
            trialEndsAt: new Date(0),
            currentPeriodStart: daysFromNow(-5),
            currentPeriodEnd: daysFromNow(25),
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-5),
          }),
        },
        prisma,
      );

      const report = await service.backfillOptiFabricEntitlements({ dryRun: true });

      // Classification still happened (a trustworthy preview)...
      expect(report.activeTrialsMigrated).toBe(1);
      expect(report.activePaidMigrated).toBe(1);
      expect(report.legacyBangladeshFreeDetected).toBe(1);
      expect(report.organisationsCreated).toBe(3);
      expect(report.refsCreated).toBe(3);

      // ...but nothing was actually persisted anywhere.
      const entitlementPrisma = prisma as unknown as {
        organisation: { create: jest.Mock };
        organisationExternalRef: { create: jest.Mock };
        productEntitlement: { create: jest.Mock };
      };
      expect(entitlementPrisma.organisation.create).not.toHaveBeenCalled();
      expect(entitlementPrisma.organisationExternalRef.create).not.toHaveBeenCalled();
      expect(entitlementPrisma.productEntitlement.create).not.toHaveBeenCalled();
      expect(entitlements.size).toBe(0);
    });
  });

  it("F. dry-run and apply produce identical classification counters for the same source state", async () => {
    await withLicenseSecret(async () => {
      const factories = [
        { id: "f-cmp-trial", factoryName: "Compare Trial", country: "Vietnam" },
        { id: "f-cmp-paid", factoryName: "Compare Paid", country: "Vietnam" },
        { id: "f-cmp-expired", factoryName: "Compare Expired", country: "Vietnam" },
        { id: "f-cmp-bd", factoryName: "Compare Bangladesh", country: "Bangladesh" },
        { id: "f-cmp-none", factoryName: "Compare No Subscription", country: "Vietnam" },
      ];
      const subscriptions = {
        "f-cmp-trial": signedSubscriptionRow({
          factoryId: "f-cmp-trial",
          planType: "TRIAL",
          status: "TRIALING",
          trialEndsAt: daysFromNow(40),
          currentPeriodStart: null,
          currentPeriodEnd: null,
          graceEndsAt: null,
          includedSeats: 2,
          extraSeats: 0,
          cancelAtPeriodEnd: false,
          createdAt: daysFromNow(-50),
        }),
        "f-cmp-paid": signedSubscriptionRow({
          factoryId: "f-cmp-paid",
          planType: "ANNUAL",
          status: "ACTIVE",
          trialEndsAt: new Date(0),
          currentPeriodStart: daysFromNow(-30),
          currentPeriodEnd: daysFromNow(335),
          graceEndsAt: null,
          includedSeats: 5,
          extraSeats: 0,
          cancelAtPeriodEnd: false,
          createdAt: daysFromNow(-30),
        }),
        "f-cmp-expired": signedSubscriptionRow({
          factoryId: "f-cmp-expired",
          planType: "MONTHLY",
          status: "CANCELLED",
          trialEndsAt: new Date(0),
          currentPeriodStart: daysFromNow(-90),
          currentPeriodEnd: daysFromNow(-60),
          graceEndsAt: null,
          includedSeats: 2,
          extraSeats: 0,
          cancelAtPeriodEnd: true,
          createdAt: daysFromNow(-90),
        }),
      };

      // Run dry-run against a fresh fake, then apply against an equally
      // fresh fake with the same source data — two independent instances
      // so apply's writes can never contaminate the dry-run comparison.
      const dryRunPrisma = makeFakeEntitlementPrisma();
      const dryRunService = buildService(factories, subscriptions, dryRunPrisma.prisma);
      const dryRunReport = await dryRunService.backfillOptiFabricEntitlements({ dryRun: true });

      const applyPrisma = makeFakeEntitlementPrisma();
      const applyService = buildService(factories, subscriptions, applyPrisma.prisma);
      const applyReport = await applyService.backfillOptiFabricEntitlements({ dryRun: false });

      expect(dryRunReport).toEqual(applyReport);
      // And to be explicit about the one real difference this task cares about:
      expect(dryRunPrisma.entitlements.size).toBe(0);
      expect(applyPrisma.entitlements.size).toBeGreaterThan(0);
    });
  });

  it("dry-run is itself idempotent in the trivial sense: running it twice in a row against unwritten state produces the same preview both times", async () => {
    await withLicenseSecret(async () => {
      const { prisma } = makeFakeEntitlementPrisma();
      const service = buildService(
        [{ id: "f-dr-repeat", factoryName: "Repeat Dry Run", country: "Vietnam" }],
        {
          "f-dr-repeat": signedSubscriptionRow({
            factoryId: "f-dr-repeat",
            planType: "TRIAL",
            status: "TRIALING",
            trialEndsAt: daysFromNow(12),
            currentPeriodStart: null,
            currentPeriodEnd: null,
            graceEndsAt: null,
            includedSeats: 2,
            extraSeats: 0,
            cancelAtPeriodEnd: false,
            createdAt: daysFromNow(-78),
          }),
        },
        prisma,
      );

      const first = await service.backfillOptiFabricEntitlements({ dryRun: true });
      const second = await service.backfillOptiFabricEntitlements({ dryRun: true });

      // Since dry-run never persists anything, the underlying state never
      // changes, so a second dry-run sees the exact same "not yet mapped,
      // not yet entitled" starting point and previews the same outcome —
      // unlike apply mode, where a second run would report
      // alreadyMappedOrSkipped instead.
      expect(second).toEqual(first);
      expect(first.activeTrialsMigrated).toBe(1);
    });
  });
});
