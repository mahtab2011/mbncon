// Phase 1 central entitlement tests. Fresh unit tests against a hand-built
// in-memory fake of the Prisma client, matching the mocking style already
// used in server/optifabric-api/test/subscription-licensing.spec.ts (no
// live database is used or required — see CENTRAL-ENTITLEMENT-PHASE-1.md
// "Validation" section for why).
import { NotFoundException } from "@nestjs/common";
import { EntitlementService } from "../src/modules/entitlement/entitlement.service";
import {
  BUNDLE_MONTHLY_PRICE_CENTS,
  OPTIFABRIC_MONTHLY_PRICE_CENTS,
  OPTISEWING_MONTHLY_PRICE_CENTS,
} from "../src/modules/entitlement/entitlement.types";

type Product = "OPTIFABRIC" | "OPTISEWING";

interface Row {
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

function key(organisationId: string, product: Product) {
  return `${organisationId}::${product}`;
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

/**
 * A minimal in-memory fake of the two Prisma surfaces EntitlementService
 * actually calls: `productEntitlement.{findUnique,create,upsert,update,
 * updateMany}` and `$transaction`. `$transaction` here just resolves every
 * operation (each of which mutates the map immediately, matching the fake's
 * synchronous style) — this proves the SERVICE always groups a bundle's two
 * writes into one $transaction call (the pattern that gives a *real*
 * Prisma+Postgres connection its atomicity guarantee), not that this mock
 * itself re-implements database rollback. Test 16 below separately proves
 * the service correctly propagates a transaction-level failure rather than
 * completing with partial state.
 */
function makeFakePrisma() {
  const store = new Map<string, Row>();
  let nextId = 1;

  const productEntitlement = {
    findUnique: jest.fn(async ({ where }: { where: { organisationId_product: { organisationId: string; product: Product } } }) => {
      const { organisationId, product } = where.organisationId_product;
      return store.get(key(organisationId, product)) ?? null;
    }),

    create: jest.fn(async ({ data }: { data: Partial<Row> & { organisationId: string; product: Product; source: Row["source"] } }) => {
      const row: Row = {
        id: `pe-${nextId++}`,
        planCode: null,
        trialStartedAt: null,
        trialEndsAt: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        ...data,
      };
      store.set(key(row.organisationId, row.product), row);
      return row;
    }),

    upsert: jest.fn(
      async ({
        where,
        create,
        update,
      }: {
        where: { organisationId_product: { organisationId: string; product: Product } };
        create: Partial<Row> & { organisationId: string; product: Product; source: Row["source"] };
        update: Partial<Row>;
      }) => {
        const { organisationId, product } = where.organisationId_product;
        const k = key(organisationId, product);
        const existing = store.get(k);
        if (existing) {
          const updated: Row = { ...existing, ...update };
          store.set(k, updated);
          return updated;
        }
        const row: Row = {
          id: `pe-${nextId++}`,
          planCode: null,
          trialStartedAt: null,
          trialEndsAt: null,
          currentPeriodStart: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          ...create,
        };
        store.set(k, row);
        return row;
      },
    ),

    update: jest.fn(async ({ where, data }: { where: { organisationId_product: { organisationId: string; product: Product } }; data: Partial<Row> }) => {
      const { organisationId, product } = where.organisationId_product;
      const k = key(organisationId, product);
      const existing = store.get(k);
      if (!existing) throw new Error("Record to update not found.");
      const updated = { ...existing, ...data };
      store.set(k, updated);
      return updated;
    }),

    updateMany: jest.fn(async ({ where, data }: { where: { organisationId: string; product: Product; planCode?: string }; data: Partial<Row> }) => {
      const k = key(where.organisationId, where.product);
      const existing = store.get(k);
      if (existing && (!where.planCode || existing.planCode === where.planCode)) {
        store.set(k, { ...existing, ...data });
        return { count: 1 };
      }
      return { count: 0 };
    }),
  };

  const prisma = {
    productEntitlement,
    $transaction: jest.fn(async (ops: Promise<unknown>[]) => Promise.all(ops)),
  };

  return { prisma: prisma as never, store };
}

describe("EntitlementService — pricing constants", () => {
  it("matches the newly approved commercial model", () => {
    expect(OPTIFABRIC_MONTHLY_PRICE_CENTS).toBe(1998);
    expect(OPTISEWING_MONTHLY_PRICE_CENTS).toBe(1498);
    expect(BUNDLE_MONTHLY_PRICE_CENTS).toBe(2998);
  });
});

describe("EntitlementService.getEffectiveEntitlement — Bangladesh free access", () => {
  it("1. day 1 — both enabled", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.grantBangladeshFreeEntitlement("org-bd");

    expect((await service.getEffectiveEntitlement("org-bd", "OPTIFABRIC")).isAccessAllowed).toBe(true);
    expect((await service.getEffectiveEntitlement("org-bd", "OPTISEWING")).isAccessAllowed).toBe(true);
  });

  it("2. day 500 — still both enabled (no expiry ever consulted)", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.grantBangladeshFreeEntitlement("org-bd");

    // Simulate the passage of 500 days directly on the stored row —
    // BANGLADESH_FREE rows carry no trial/period dates at all, so there is
    // nothing to age; this asserts that explicitly.
    const row = store.get("org-bd::OPTIFABRIC")!;
    expect(row.trialEndsAt).toBeNull();
    expect(row.currentPeriodEnd).toBeNull();

    const effective = await service.getEffectiveEntitlement("org-bd", "OPTIFABRIC");
    expect(effective.isAccessAllowed).toBe(true);
    expect(effective.reason).toBe("BANGLADESH_FREE");
  });

  it("21. Bangladesh free grant is idempotent", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    const first = await service.grantBangladeshFreeEntitlement("org-bd");
    const second = await service.grantBangladeshFreeEntitlement("org-bd");

    expect(first.optifabric.source).toBe("BANGLADESH_FREE");
    expect(second.optifabric.source).toBe("BANGLADESH_FREE");
    expect(second.optifabric.isAccessAllowed).toBe(true);
    expect(second.optisewing.isAccessAllowed).toBe(true);
  });

  it("22. Bangladesh free does not depend on any country text field", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    // grantBangladeshFreeEntitlement takes only an organisationId — there
    // is no `country` parameter for it to depend on. This test exists to
    // make that contract explicit and to fail loudly if a future edit adds
    // one back.
    expect(service.grantBangladeshFreeEntitlement.length).toBe(1);
  });
});

describe("EntitlementService.startInternationalTrial", () => {
  it("3. creates exactly 2 product rows", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    await service.startInternationalTrial("org-intl");

    expect(store.has("org-intl::OPTIFABRIC")).toBe(true);
    expect(store.has("org-intl::OPTISEWING")).toBe(true);
    expect(store.size).toBe(2);
  });

  it("4. both trial rows share the exact same start/end timestamps", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    await service.startInternationalTrial("org-intl");

    const fabric = store.get("org-intl::OPTIFABRIC")!;
    const sewing = store.get("org-intl::OPTISEWING")!;
    expect(fabric.trialStartedAt!.getTime()).toBe(sewing.trialStartedAt!.getTime());
    expect(fabric.trialEndsAt!.getTime()).toBe(sewing.trialEndsAt!.getTime());
    expect(fabric.trialEndsAt!.getTime() - fabric.trialStartedAt!.getTime()).toBe(
      90 * 24 * 60 * 60 * 1000,
    );
  });

  it("5. day 1 — both enabled", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.startInternationalTrial("org-intl");

    expect(await service.canAccess("org-intl", "OPTIFABRIC")).toBe(true);
    expect(await service.canAccess("org-intl", "OPTISEWING")).toBe(true);
  });

  it("6. day 89 — both enabled", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.startInternationalTrial("org-intl");

    for (const p of ["OPTIFABRIC", "OPTISEWING"] as const) {
      const row = store.get(`org-intl::${p}`)!;
      row.trialStartedAt = daysFromNow(-89);
      row.trialEndsAt = daysFromNow(1); // 90 - 89 = 1 day remaining
    }

    expect(await service.canAccess("org-intl", "OPTIFABRIC")).toBe(true);
    expect(await service.canAccess("org-intl", "OPTISEWING")).toBe(true);
  });

  it("7. immediately before trialEndsAt — both enabled", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.startInternationalTrial("org-intl");

    for (const p of ["OPTIFABRIC", "OPTISEWING"] as const) {
      store.get(`org-intl::${p}`)!.trialEndsAt = new Date(Date.now() + 200);
    }

    expect(await service.canAccess("org-intl", "OPTIFABRIC")).toBe(true);
    expect(await service.canAccess("org-intl", "OPTISEWING")).toBe(true);
  });

  it("8. at/after trialEndsAt — both disabled", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.startInternationalTrial("org-intl");

    // "at" trialEndsAt: set it to exactly now (or a moment in the past by
    // the time the comparison runs) — the boundary is strict "<", so this
    // must already be denied.
    for (const p of ["OPTIFABRIC", "OPTISEWING"] as const) {
      store.get(`org-intl::${p}`)!.trialEndsAt = new Date();
    }
    expect(await service.canAccess("org-intl", "OPTIFABRIC")).toBe(false);
    expect(await service.canAccess("org-intl", "OPTISEWING")).toBe(false);

    // "after" trialEndsAt.
    for (const p of ["OPTIFABRIC", "OPTISEWING"] as const) {
      store.get(`org-intl::${p}`)!.trialEndsAt = daysFromNow(-1);
    }
    expect(await service.canAccess("org-intl", "OPTIFABRIC")).toBe(false);
    expect(await service.canAccess("org-intl", "OPTISEWING")).toBe(false);

    const effective = await service.getEffectiveEntitlement("org-intl", "OPTIFABRIC");
    expect(effective.reason).toBe("TRIAL_EXPIRED");
  });

  it("9. calling startInternationalTrial again does not restart the trial", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    await service.startInternationalTrial("org-intl");
    const originalEndsAt = store.get("org-intl::OPTIFABRIC")!.trialEndsAt!.getTime();

    // Age the trial, then call startInternationalTrial again — it must NOT
    // reset trialEndsAt back to +90 days from now.
    for (const p of ["OPTIFABRIC", "OPTISEWING"] as const) {
      store.get(`org-intl::${p}`)!.trialStartedAt = daysFromNow(-50);
      store.get(`org-intl::${p}`)!.trialEndsAt = daysFromNow(40);
    }

    const before = store.get("org-intl::OPTIFABRIC")!.trialEndsAt!.getTime();
    await service.startInternationalTrial("org-intl");
    const after = store.get("org-intl::OPTIFABRIC")!.trialEndsAt!.getTime();

    expect(after).toBe(before);
    expect(after).not.toBe(originalEndsAt); // sanity: we did age it above
  });

  it("10. a re-login-equivalent call (re-fetching state) does not alter trial timestamps", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.startInternationalTrial("org-intl");
    const before = store.get("org-intl::OPTIFABRIC")!.trialEndsAt!.getTime();

    // "Re-login" has no code path that touches entitlement rows at all in
    // this service — it can only ever call read methods.
    await service.getEffectiveEntitlement("org-intl", "OPTIFABRIC");
    await service.canAccess("org-intl", "OPTISEWING");

    expect(store.get("org-intl::OPTIFABRIC")!.trialEndsAt!.getTime()).toBe(before);
  });

  it("11. a new browser/client has no bearing on trial state — it's keyed purely by organisationId server-side", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.startInternationalTrial("org-intl");

    // Nothing in getEffectiveEntitlement's signature accepts any
    // client/browser/session identifier — only organisationId + product.
    expect(service.getEffectiveEntitlement.length).toBe(2);

    const a = await service.getEffectiveEntitlement("org-intl", "OPTIFABRIC");
    const b = await service.getEffectiveEntitlement("org-intl", "OPTIFABRIC");
    expect(a.trialEndsAt!.getTime()).toBe(b.trialEndsAt!.getTime());
  });
});

describe("EntitlementService paid activation", () => {
  it("12. OptiFabric monthly activation enables Fabric only", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    await service.activateOptiFabricMonthly("org-paid");

    expect(await service.canAccess("org-paid", "OPTIFABRIC")).toBe(true);
    expect(await service.canAccess("org-paid", "OPTISEWING")).toBe(false);
  });

  it("13. OptiSewing monthly activation enables Sewing only", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    await service.activateOptiSewingMonthly("org-paid");

    expect(await service.canAccess("org-paid", "OPTIFABRIC")).toBe(false);
    expect(await service.canAccess("org-paid", "OPTISEWING")).toBe(true);
  });

  it("14. bundle activation enables both", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    await service.activateBundleMonthly("org-paid");

    expect(await service.canAccess("org-paid", "OPTIFABRIC")).toBe(true);
    expect(await service.canAccess("org-paid", "OPTISEWING")).toBe(true);
  });

  it("15. bundle writes both rows atomically via a single $transaction call", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    await service.activateBundleMonthly("org-paid");

    expect((prisma as { $transaction: jest.Mock }).$transaction).toHaveBeenCalledTimes(1);
    const fabric = store.get("org-paid::OPTIFABRIC")!;
    const sewing = store.get("org-paid::OPTISEWING")!;
    expect(fabric.currentPeriodEnd!.getTime()).toBe(sewing.currentPeriodEnd!.getTime());
    expect(fabric.planCode).toBe("BUNDLE_MONTHLY");
    expect(sewing.planCode).toBe("BUNDLE_MONTHLY");
  });

  it("16. a transaction-level failure during bundle activation is propagated, not silently swallowed", async () => {
    const { prisma } = makeFakePrisma();
    // Simulate a DB-level transaction failure. NOTE on this test's scope:
    // this in-memory fake's upsert() mutates its Map synchronously/eagerly
    // when called — a real Prisma PrismaPromise is lazy and does not touch
    // the database until awaited or handed to $transaction(), which is
    // what lets a real Postgres connection roll back BOTH writes atomically
    // if either fails. Reproducing that laziness faithfully in a hand-built
    // mock is out of scope for this fake. What THIS test proves is the
    // service-level half of the contract: activateBundleMonthly() always
    // routes both writes through one $transaction([...]) call (never two
    // separate awaited calls), and correctly propagates a transaction
    // rejection to its own caller rather than catching/ignoring it. The
    // atomicity of the underlying writes themselves is Prisma's own
    // documented guarantee for the array form of $transaction(), exercised
    // against a real database — not something this unit test can observe.
    (prisma as { $transaction: jest.Mock }).$transaction = jest
      .fn()
      .mockRejectedValue(new Error("simulated transaction rollback"));
    const service = new EntitlementService(prisma);

    await expect(service.activateBundleMonthly("org-paid")).rejects.toThrow(
      "simulated transaction rollback",
    );
    expect((prisma as { $transaction: jest.Mock }).$transaction).toHaveBeenCalledTimes(1);
  });

  it("monthly period is a fixed 30-day window, not calendar-month arithmetic", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    const start = new Date("2026-01-31T00:00:00.000Z");

    const effective = await service.activateOptiFabricMonthly("org-paid", start);

    expect(effective.currentPeriodEnd!.getTime()).toBe(
      start.getTime() + 30 * 24 * 60 * 60 * 1000,
    );
  });
});

describe("EntitlementService cancellation", () => {
  it("17. cancelling OptiFabric at period end leaves it enabled before currentPeriodEnd", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.activateOptiFabricMonthly("org-paid");

    await service.cancelEntitlement("org-paid", "OPTIFABRIC");

    const effective = await service.getEffectiveEntitlement("org-paid", "OPTIFABRIC");
    expect(effective.cancelAtPeriodEnd).toBe(true);
    expect(effective.isAccessAllowed).toBe(true);
    expect(effective.reason).toBe("PAID_ACTIVE");
  });

  it("18. OptiFabric is disabled once currentPeriodEnd has passed, cancelled or not", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.activateOptiFabricMonthly("org-paid");
    await service.cancelEntitlement("org-paid", "OPTIFABRIC");

    store.get("org-paid::OPTIFABRIC")!.currentPeriodEnd = daysFromNow(-1);

    const effective = await service.getEffectiveEntitlement("org-paid", "OPTIFABRIC");
    expect(effective.isAccessAllowed).toBe(false);
    expect(effective.reason).toBe("PAID_EXPIRED");
  });

  it("19. cancelling a bundle cancels both rows, both remain enabled until the shared currentPeriodEnd", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.activateBundleMonthly("org-paid");

    await service.cancelEntitlement("org-paid", "OPTIFABRIC");

    const fabric = await service.getEffectiveEntitlement("org-paid", "OPTIFABRIC");
    const sewing = await service.getEffectiveEntitlement("org-paid", "OPTISEWING");
    expect(fabric.cancelAtPeriodEnd).toBe(true);
    expect(sewing.cancelAtPeriodEnd).toBe(true);
    expect(fabric.isAccessAllowed).toBe(true);
    expect(sewing.isAccessAllowed).toBe(true);
  });

  it("20. a cancelled bundle is disabled on both products once the shared period ends", async () => {
    const { prisma, store } = makeFakePrisma();
    const service = new EntitlementService(prisma);
    await service.activateBundleMonthly("org-paid");
    await service.cancelEntitlement("org-paid", "OPTIFABRIC");

    for (const p of ["OPTIFABRIC", "OPTISEWING"] as const) {
      store.get(`org-paid::${p}`)!.currentPeriodEnd = daysFromNow(-1);
    }

    expect(await service.canAccess("org-paid", "OPTIFABRIC")).toBe(false);
    expect(await service.canAccess("org-paid", "OPTISEWING")).toBe(false);
  });

  it("cancelling a non-existent entitlement fails closed with NotFoundException", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    await expect(service.cancelEntitlement("org-none", "OPTIFABRIC")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe("EntitlementService security/fail-closed behaviour", () => {
  it("23. an invalid product is rejected", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    await expect(
      service.getEffectiveEntitlement("org-x", "SHOES" as never),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("24. an unknown organisation fails closed (no entitlement -> access denied)", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    const effective = await service.getEffectiveEntitlement("org-does-not-exist", "OPTIFABRIC");
    expect(effective.isAccessAllowed).toBe(false);
    expect(effective.reason).toBe("NO_ENTITLEMENT");
  });

  it("25. no method accepts a client-supplied expiry date for a privileged grant", async () => {
    const { prisma } = makeFakePrisma();
    const service = new EntitlementService(prisma);

    // grantBangladeshFreeEntitlement and startInternationalTrial take only
    // an organisationId — there is no parameter through which a caller
    // could supply trialEndsAt/currentPeriodEnd directly.
    expect(service.grantBangladeshFreeEntitlement.length).toBe(1);
    expect(service.startInternationalTrial.length).toBe(1);

    const before = Date.now();
    const result = await service.startInternationalTrial("org-x");
    const after = Date.now();

    const endsAt = result.optifabric.trialEndsAt!.getTime();
    expect(endsAt).toBeGreaterThanOrEqual(before + 90 * 24 * 60 * 60 * 1000);
    expect(endsAt).toBeLessThanOrEqual(after + 90 * 24 * 60 * 60 * 1000);
  });
});
