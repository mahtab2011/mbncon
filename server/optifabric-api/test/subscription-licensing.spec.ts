// This suite covers the subscription/licensing system added at the user's explicit
// request (docs/LICENSE-AND-SUBSCRIPTION-TERMS.md). It is NOT a reconstruction of any
// historical OptiSewing/PRISM suite — there is no evidenced precedent for this feature
// at all. Ordinary fresh unit tests against apps/api/src/modules/subscription/
// subscription.service.ts and apps/api/src/common/guards/subscription.guard.ts.
import { HttpException } from "@nestjs/common";
import { SubscriptionService } from "../src/modules/subscription/subscription.service";
import { SubscriptionGuard, SkipSubscriptionCheck } from "../src/common/guards/subscription.guard";
import { signSubscriptionFields } from "../src/modules/subscription/subscription-signing";
import {
  ANNUAL_BASE_PRICE_CENTS,
  ANNUAL_EXTRA_SEAT_PRICE_CENTS,
  isBangladeshFactory,
  MONTHLY_BASE_PRICE_CENTS,
  MONTHLY_EXTRA_SEAT_PRICE_CENTS,
} from "../src/modules/subscription/subscription.types";

const TEST_SECRET = "c".repeat(64);

function withLicenseSecret<T>(fn: () => T): T {
  const original = process.env.LICENSE_SIGNING_SECRET;
  process.env.LICENSE_SIGNING_SECRET = TEST_SECRET;
  try {
    return fn();
  } finally {
    if (original === undefined) delete process.env.LICENSE_SIGNING_SECRET;
    else process.env.LICENSE_SIGNING_SECRET = original;
  }
}

// Async variant for tests whose body awaits promises (e.g. SubscriptionService
// methods that hit the mocked Prisma client) — the sync version above would
// restore/delete the env var in its `finally` before those awaited operations
// actually run, since calling an async fn returns immediately.
async function withLicenseSecretAsync<T>(fn: () => Promise<T>): Promise<T> {
  const original = process.env.LICENSE_SIGNING_SECRET;
  process.env.LICENSE_SIGNING_SECRET = TEST_SECRET;
  try {
    return await fn();
  } finally {
    if (original === undefined) delete process.env.LICENSE_SIGNING_SECRET;
    else process.env.LICENSE_SIGNING_SECRET = original;
  }
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

describe("isBangladeshFactory", () => {
  it("matches Bangladesh case-insensitively and in Bangla script", () => {
    expect(isBangladeshFactory("Bangladesh")).toBe(true);
    expect(isBangladeshFactory("bangladesh")).toBe(true);
    expect(isBangladeshFactory("BD")).toBe(true);
    expect(isBangladeshFactory("বাংলাদেশ")).toBe(true);
  });

  it("does not match other countries", () => {
    expect(isBangladeshFactory("India")).toBe(false);
    expect(isBangladeshFactory("Vietnam")).toBe(false);
    expect(isBangladeshFactory("")).toBe(false);
  });
});

describe("SubscriptionService pricing", () => {
  it("computes the monthly price as $29.98 base + $5.00 per extra seat", () => {
    const prisma = {} as never;
    const service = new SubscriptionService(prisma);

    expect(service.computeMonthlyPriceCents(0)).toBe(MONTHLY_BASE_PRICE_CENTS);
    expect(service.computeMonthlyPriceCents(3)).toBe(MONTHLY_BASE_PRICE_CENTS + 3 * MONTHLY_EXTRA_SEAT_PRICE_CENTS);
  });

  it("computes the annual price as $300.00 base for up to 5 users", () => {
    const prisma = {} as never;
    const service = new SubscriptionService(prisma);

    expect(service.computeAnnualPriceCents(0)).toBe(ANNUAL_BASE_PRICE_CENTS);
    expect(service.computeAnnualPriceCents(2)).toBe(ANNUAL_BASE_PRICE_CENTS + 2 * ANNUAL_EXTRA_SEAT_PRICE_CENTS);
  });
});

describe("SubscriptionService.getEffectiveState — Bangladesh free-access rule", () => {
  it("backfills a 3-free-seat subscription row for a Bangladeshi factory with none yet, and reports seat usage", async () => {
    await withLicenseSecretAsync(async () => {
      const prisma = {
        factory: { findUnique: jest.fn().mockResolvedValue({ id: "f-1", country: "Bangladesh" }) },
        subscription: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve({ id: "sub-1", ...data }),
          ),
        },
        user: { count: jest.fn().mockResolvedValue(1) },
      };
      const service = new SubscriptionService(prisma as never);

      const effective = await service.getEffectiveState("f-1");

      expect(effective.status).toBe("FREE_REGIONAL");
      expect(effective.isAccessAllowed).toBe(true);
      expect(effective.includedSeats).toBe(3);
      expect(effective.extraSeats).toBe(0);
      expect(effective.seatsUsed).toBe(1);
      expect(effective.canAddMoreUsers).toBe(true);
      expect(prisma.subscription.create).toHaveBeenCalled();
    });
  });

  it("blocks adding more users once a Bangladeshi factory's included + extra seats are all used", async () => {
    await withLicenseSecretAsync(async () => {
      const existing = {
        factoryId: "f-1",
        planType: "BD_FREE_REGIONAL" as const,
        status: "FREE_REGIONAL" as const,
        trialEndsAt: new Date(),
        currentPeriodStart: null,
        currentPeriodEnd: null,
        graceEndsAt: null,
        includedSeats: 3,
        extraSeats: 1,
        cancelAtPeriodEnd: false,
        signature: "",
      };
      existing.signature = signSubscriptionFields(existing);
      const prisma = {
        factory: { findUnique: jest.fn().mockResolvedValue({ id: "f-1", country: "Bangladesh" }) },
        subscription: { findUnique: jest.fn().mockResolvedValue(existing) },
        user: { count: jest.fn().mockResolvedValue(4) },
      };
      const service = new SubscriptionService(prisma as never);

      const effective = await service.getEffectiveState("f-1");

      expect(effective.canAddMoreUsers).toBe(false);
      expect(effective.isAccessAllowed).toBe(true); // existing members keep working
    });
  });

  it("falls through to normal subscription logic for a factory outside Bangladesh", async () => {
    const prisma = {
      factory: { findUnique: jest.fn().mockResolvedValue({ id: "f-1", country: "Vietnam" }) },
      subscription: { findUnique: jest.fn().mockResolvedValue(null) },
    };
    const service = new SubscriptionService(prisma as never);

    const effective = await service.getEffectiveState("f-1");

    expect(effective.status).not.toBe("FREE_REGIONAL");
    expect(prisma.subscription.findUnique).toHaveBeenCalled();
  });
});

describe("SubscriptionService.grantExtraSeats", () => {
  it("adds seats for a Bangladeshi factory and records an audit event", async () => {
    await withLicenseSecretAsync(async () => {
      const existing = {
        id: "sub-1",
        factoryId: "f-1",
        planType: "BD_FREE_REGIONAL" as const,
        status: "FREE_REGIONAL" as const,
        trialEndsAt: new Date(),
        currentPeriodStart: null,
        currentPeriodEnd: null,
        graceEndsAt: null,
        includedSeats: 3,
        extraSeats: 0,
        cancelAtPeriodEnd: false,
        signature: "",
      };
      existing.signature = signSubscriptionFields(existing);
      const prisma = {
        factory: { findUnique: jest.fn().mockResolvedValue({ id: "f-1", factoryCode: "F-1", country: "Bangladesh" }) },
        subscription: {
          findUnique: jest.fn().mockResolvedValue(existing),
          update: jest.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve({ id: "sub-1", ...data }),
          ),
        },
        user: { count: jest.fn().mockResolvedValue(3) },
        auditEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      const service = new SubscriptionService(prisma as never);

      const effective = await service.grantExtraSeats("F-1", 2, "paid via bKash");

      expect(effective.extraSeats).toBe(2);
      expect(effective.canAddMoreUsers).toBe(true); // 3 used, now 5 total seats
      expect(prisma.auditEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ actionType: "REP_GRANTED_EXTRA_SEATS" }),
        }),
      );
    });
  });

  it("also grants seats to a foreign (non-Bangladesh) factory — no longer Bangladesh-only", async () => {
    await withLicenseSecretAsync(async () => {
      const existing = {
        id: "sub-2",
        factoryId: "f-2",
        planType: "TRIAL" as const,
        status: "TRIALING" as const,
        trialEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        currentPeriodStart: null,
        currentPeriodEnd: null,
        graceEndsAt: null,
        includedSeats: 2,
        extraSeats: 0,
        cancelAtPeriodEnd: false,
        signature: "",
      };
      existing.signature = signSubscriptionFields(existing);
      const prisma = {
        factory: { findUnique: jest.fn().mockResolvedValue({ id: "f-2", factoryCode: "F-2", country: "Vietnam" }) },
        subscription: {
          findUnique: jest.fn().mockResolvedValue(existing),
          update: jest.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
            Promise.resolve({ id: "sub-2", ...data }),
          ),
        },
        user: { count: jest.fn().mockResolvedValue(3) },
        auditEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      const service = new SubscriptionService(prisma as never);

      const effective = await service.grantExtraSeats("F-2", 1, "confirmed by bank transfer");

      expect(effective.extraSeats).toBe(1);
    });
  });

  it("rejects a non-positive seat count", async () => {
    const prisma = { factory: { findUnique: jest.fn() } };
    const service = new SubscriptionService(prisma as never);

    await expect(service.grantExtraSeats("F-1", 0)).rejects.toThrow(/positive integer/);
  });
});

describe("SubscriptionService.computeEffectiveState", () => {
  it("allows access while still within the 90-day trial", () => {
    withLicenseSecret(() => {
      const service = new SubscriptionService({} as never);
      const subscription = {
        factoryId: "f-1",
        planType: "TRIAL" as const,
        status: "TRIALING" as const,
        trialEndsAt: daysFromNow(10),
        currentPeriodStart: null,
        currentPeriodEnd: null,
        graceEndsAt: null,
        includedSeats: 2,
        extraSeats: 0,
        cancelAtPeriodEnd: false,
        signature: "",
      };
      subscription.signature = signSubscriptionFields(subscription);

      const effective = service.computeEffectiveState(subscription);
      expect(effective.status).toBe("TRIALING");
      expect(effective.isAccessAllowed).toBe(true);
    });
  });

  it("blocks access once the trial period has elapsed", () => {
    withLicenseSecret(() => {
      const service = new SubscriptionService({} as never);
      const subscription = {
        factoryId: "f-1",
        planType: "TRIAL" as const,
        status: "TRIALING" as const,
        trialEndsAt: daysFromNow(-1),
        currentPeriodStart: null,
        currentPeriodEnd: null,
        graceEndsAt: null,
        includedSeats: 2,
        extraSeats: 0,
        cancelAtPeriodEnd: false,
        signature: "",
      };
      subscription.signature = signSubscriptionFields(subscription);

      const effective = service.computeEffectiveState(subscription);
      expect(effective.status).toBe("EXPIRED");
      expect(effective.isAccessAllowed).toBe(false);
    });
  });

  it("keeps access allowed during the 7-day grace period after a paid period ends", () => {
    withLicenseSecret(() => {
      const service = new SubscriptionService({} as never);
      const subscription = {
        factoryId: "f-1",
        planType: "ANNUAL" as const,
        status: "ACTIVE" as const,
        trialEndsAt: daysFromNow(-400),
        currentPeriodStart: daysFromNow(-370),
        currentPeriodEnd: daysFromNow(-2), // period ended 2 days ago
        graceEndsAt: null,
        includedSeats: 5,
        extraSeats: 0,
        cancelAtPeriodEnd: false,
        signature: "",
      };
      subscription.signature = signSubscriptionFields(subscription);

      const effective = service.computeEffectiveState(subscription);
      expect(effective.status).toBe("GRACE_PERIOD");
      expect(effective.isAccessAllowed).toBe(true);
    });
  });

  it("blocks access once the 7-day grace period has fully elapsed", () => {
    withLicenseSecret(() => {
      const service = new SubscriptionService({} as never);
      const subscription = {
        factoryId: "f-1",
        planType: "ANNUAL" as const,
        status: "ACTIVE" as const,
        trialEndsAt: daysFromNow(-400),
        currentPeriodStart: daysFromNow(-380),
        currentPeriodEnd: daysFromNow(-10), // period ended 10 days ago, grace (7d) exhausted
        graceEndsAt: null,
        includedSeats: 5,
        extraSeats: 0,
        cancelAtPeriodEnd: false,
        signature: "",
      };
      subscription.signature = signSubscriptionFields(subscription);

      const effective = service.computeEffectiveState(subscription);
      expect(effective.status).toBe("EXPIRED");
      expect(effective.isAccessAllowed).toBe(false);
    });
  });

  it("treats a tampered (signature-mismatched) row as CANCELLED regardless of its dates", () => {
    withLicenseSecret(() => {
      const service = new SubscriptionService({} as never);
      const subscription = {
        factoryId: "f-1",
        planType: "ANNUAL" as const,
        status: "ACTIVE" as const,
        trialEndsAt: daysFromNow(-400),
        currentPeriodStart: daysFromNow(-10),
        currentPeriodEnd: daysFromNow(355), // dates say "plenty of time left"
        graceEndsAt: null,
        includedSeats: 5,
        extraSeats: 0,
        cancelAtPeriodEnd: false,
        signature: "hand-edited-invalid-signature",
      };

      const effective = service.computeEffectiveState(subscription);
      expect(effective.status).toBe("CANCELLED");
      expect(effective.isAccessAllowed).toBe(false);
      expect(effective.tampered).toBe(true);
    });
  });

  it("blocks access when no subscription record exists at all", () => {
    withLicenseSecret(() => {
      const service = new SubscriptionService({} as never);
      const effective = service.computeEffectiveState(null);
      expect(effective.isAccessAllowed).toBe(false);
    });
  });
});

describe("SubscriptionGuard", () => {
  function buildContext(user: unknown, handlerMeta: boolean | undefined) {
    return {
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
      getHandler: () => ({}),
      getClass: () => ({}),
      __meta: handlerMeta,
    } as never;
  }

  it("allows the request through when @SkipSubscriptionCheck() metadata is present", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(true) };
    const subscriptionService = { getEffectiveState: jest.fn() };
    const guard = new SubscriptionGuard(reflector as never, subscriptionService as never);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }, true))).resolves.toBe(true);
    expect(subscriptionService.getEffectiveState).not.toHaveBeenCalled();
  });

  it("throws 402 Payment Required when the factory's subscription has expired", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
    const subscriptionService = {
      getEffectiveState: jest.fn().mockResolvedValue({ status: "EXPIRED", isAccessAllowed: false, tampered: false }),
    };
    const guard = new SubscriptionGuard(reflector as never, subscriptionService as never);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }, false))).rejects.toBeInstanceOf(HttpException);
  });

  it("allows the request through when the subscription is active", async () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(false) };
    const subscriptionService = {
      getEffectiveState: jest.fn().mockResolvedValue({ status: "ACTIVE", isAccessAllowed: true, tampered: false }),
    };
    const guard = new SubscriptionGuard(reflector as never, subscriptionService as never);

    await expect(guard.canActivate(buildContext({ factoryId: "f-1" }, false))).resolves.toBe(true);
  });

  it("SkipSubscriptionCheck() decorator is defined and callable", () => {
    expect(typeof SkipSubscriptionCheck).toBe("function");
    expect(() => SkipSubscriptionCheck()).not.toThrow();
  });
});
