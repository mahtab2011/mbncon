// Stage 4D — real Nest guard-pipeline regression coverage.
//
// WHY THIS FILE EXISTS: every other guard/entitlement test in this repo
// (test/entitlement-cutover.spec.ts, test/subscription-licensing.spec.ts)
// instantiates SubscriptionGuard directly via `new SubscriptionGuard(...)`
// and calls `.canActivate()` with a hand-built ExecutionContext whose
// request.user is ALREADY populated — i.e. every existing test assumes
// JwtAuthGuard has already run. That assumption is exactly what was false
// in production before this stage: JwtAuthGuard was registered only at
// controller/method level, so Nest's real global-guard-before-controller-
// guard execution order meant SubscriptionGuard always saw request.user as
// undefined and silently allowed every request through its `if (!user)
// return true` branch. No test using the `new SubscriptionGuard(...)` +
// pre-populated-user pattern can ever catch that class of bug.
//
// This file instead boots a REAL NestJS application (NestFactory.create,
// not @nestjs/testing's Test.createTestingModule — neither @nestjs/testing
// nor supertest is a dependency of this package, and none is added here;
// @nestjs/core + @nestjs/platform-express are already real runtime
// dependencies) with the exact same APP_GUARD registrations and order as
// src/app.module.ts, listens on an ephemeral local port, and issues REAL
// HTTP requests via Node's built-in fetch. This exercises Nest's actual
// guard execution order end-to-end — the one thing no other test in this
// repo does.
//
// Only Prisma/database access is faked (same in-memory-Map convention as
// entitlement-cutover.spec.ts) — no live database is used or required.
// ProjectsService is faked too, since this file is about proving guard
// ordering, not project persistence (that's projects-persistence.spec.ts's
// job).

process.env.JWT_SECRET = "f".repeat(64);
const TEST_JWT_SECRET = process.env.JWT_SECRET;

import { INestApplication, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtService } from "@nestjs/jwt";

import { JwtAuthGuard } from "../src/modules/auth/jwt-auth.guard";
import { JwtStrategy } from "../src/modules/auth/jwt.strategy";
import { AuthService } from "../src/modules/auth/auth.service";
import { SubscriptionGuard } from "../src/common/guards/subscription.guard";
import { ENTITLEMENT_PRISMA } from "../src/entitlement/entitlement-providers";
import { OrganisationResolverService } from "../src/entitlement/organisation-resolver.service";
import { FactoryOrganisationMappingService } from "../src/entitlement/factory-organisation-mapping.service";
import { EntitlementOnboardingService } from "../src/entitlement/entitlement-onboarding.service";
import { EntitlementDecisionService } from "../src/entitlement/entitlement-decision.service";
import { PrismaService } from "../src/common/prisma.service";
import { SubscriptionService } from "../src/modules/subscription/subscription.service";
import { HealthController } from "../src/modules/health/health.controller";
import { ProjectsController } from "../src/modules/projects/projects.controller";
import { ProjectsService } from "../src/modules/projects/projects.service";
import { SubscriptionController } from "../src/modules/subscription/subscription.controller";
import { AppModule } from "../src/app.module";

/* ============================================================================
 * Fakes — same in-memory-Map convention already used throughout this repo
 * (see entitlement-cutover.spec.ts's makeFakeEntitlementPrisma), kept
 * self-contained in this file rather than imported since none of the
 * existing helpers are exported.
 * ========================================================================== */

type Product = "OPTIFABRIC" | "OPTISEWING";

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function makeFakeEntitlementPrisma() {
  const refs = new Map<string, { organisationId: string }>();
  const entitlements = new Map<
    string,
    { organisationId: string; product: Product; source: string; trialEndsAt: Date | null; currentPeriodEnd: Date | null }
  >();

  return {
    seedRef(organisationId: string, externalFactoryId: string) {
      refs.set(`OPTIFABRIC::${externalFactoryId}`, { organisationId });
    },
    seedEntitlement(organisationId: string, product: Product, trialEndsAt: Date) {
      entitlements.set(`${organisationId}::${product}`, {
        organisationId,
        product,
        source: "INTERNATIONAL_TRIAL",
        trialEndsAt,
        currentPeriodEnd: null,
      });
    },
    client: {
      organisationExternalRef: {
        findUnique: jest.fn(
          async ({ where }: { where: { system_externalFactoryId: { system: string; externalFactoryId: string } } }) => {
            const { system, externalFactoryId } = where.system_externalFactoryId;
            return refs.get(`${system}::${externalFactoryId}`) ?? null;
          },
        ),
      },
      productEntitlement: {
        findUnique: jest.fn(
          async ({ where }: { where: { organisationId_product: { organisationId: string; product: Product } } }) => {
            const { organisationId, product } = where.organisationId_product;
            return entitlements.get(`${organisationId}::${product}`) ?? null;
          },
        ),
      },
    },
  };
}

/* ============================================================================
 * Test module — mirrors app.module.ts's guard registration exactly (same
 * classes, same order), with fake Prisma-backed providers standing in for
 * the real ones. HealthController/ProjectsController/SubscriptionController
 * are the REAL controllers with their REAL decorators — that's the whole
 * point: this proves the actual production routing/guard wiring, not a
 * decoy.
 * ========================================================================== */

describe("Guard ordering — real Nest HTTP pipeline (Stage 4D regression)", () => {
  let app: INestApplication;
  let baseUrl: string;
  let jwtService: JwtService;
  const fakeEntitlementPrisma = makeFakeEntitlementPrisma();

  const fakeAuthService = { isRevoked: jest.fn().mockResolvedValue(false) };
  const fakeOptifabricPrisma = { factory: { findUnique: jest.fn().mockResolvedValue(null) } };
  const fakeProjectsService = { listProjects: jest.fn().mockResolvedValue([]) };
  const fakeLegacySubscriptionService = {
    getEffectiveState: jest.fn().mockResolvedValue({ status: "TRIALING", isAccessAllowed: false }),
    cancelAtPeriodEnd: jest.fn(),
    grantExtraSeats: jest.fn().mockResolvedValue({ factoryCode: "F1", extraSeats: 1 }),
  };

  beforeAll(async () => {
    @Module({
      imports: [
        ThrottlerModule.forRoot([{ name: "default", ttl: 60_000, limit: 1000 }]),
        PassportModule,
        JwtModule.register({ secret: TEST_JWT_SECRET, signOptions: { expiresIn: "7d" } }),
      ],
      controllers: [HealthController, ProjectsController, SubscriptionController],
      providers: [
        // Same three APP_GUARDs, same order, as src/app.module.ts. (Verified
        // during development that swapping SubscriptionGuard/JwtAuthGuard
        // here makes test C above fail with 200 instead of 402 — i.e. this
        // module's guard order is what test C actually exercises.)
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: SubscriptionGuard },

        JwtStrategy,
        { provide: AuthService, useValue: fakeAuthService },
        { provide: PrismaService, useValue: fakeOptifabricPrisma },
        { provide: ENTITLEMENT_PRISMA, useValue: fakeEntitlementPrisma.client },
        OrganisationResolverService,
        FactoryOrganisationMappingService,
        EntitlementDecisionService,
        { provide: SubscriptionService, useValue: fakeLegacySubscriptionService },
        EntitlementOnboardingService,
        { provide: ProjectsService, useValue: fakeProjectsService },
      ],
    })
    class TestAppModule {}

    app = await NestFactory.create<NestExpressApplication>(TestAppModule, { logger: false });
    await app.listen(0, "127.0.0.1");
    const address = app.getHttpServer().address();
    baseUrl = `http://127.0.0.1:${address.port}`;
    jwtService = new JwtService({ secret: TEST_JWT_SECRET });
  });

  afterAll(async () => {
    await app.close();
  });

  function tokenFor(factoryId: string, role = "ROLE_FACTORY_ADMIN") {
    return jwtService.sign({ sub: "user-1", factoryId, role, jti: `jti-${factoryId}` });
  }

  /* -------------------------------------------------------------------- *
   * A. No JWT on a protected project route -> 401
   * -------------------------------------------------------------------- */
  it("A. GET /projects with no Authorization header -> 401", async () => {
    const res = await fetch(`${baseUrl}/projects`);
    expect(res.status).toBe(401);
  });

  it("A2. GET /projects with a garbage Authorization header -> 401", async () => {
    const res = await fetch(`${baseUrl}/projects`, {
      headers: { Authorization: "Bearer not-a-real-token" },
    });
    expect(res.status).toBe(401);
  });

  /* -------------------------------------------------------------------- *
   * B. Valid JWT + active OPTIFABRIC entitlement -> passes SubscriptionGuard
   * -------------------------------------------------------------------- */
  it("B. valid JWT + active INTERNATIONAL_TRIAL entitlement -> 200", async () => {
    fakeEntitlementPrisma.seedRef("org-active", "f-active");
    fakeEntitlementPrisma.seedEntitlement("org-active", "OPTIFABRIC", daysFromNow(10));

    const res = await fetch(`${baseUrl}/projects`, {
      headers: { Authorization: `Bearer ${tokenFor("f-active")}` },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
    expect(fakeProjectsService.listProjects).toHaveBeenCalled();
  });

  /* -------------------------------------------------------------------- *
   * C. Valid JWT + expired OPTIFABRIC entitlement -> 402 (THE Stage 4B/4C
   *    regression this whole file exists to guard against — before this
   *    stage's fix, this exact scenario returned 200.)
   * -------------------------------------------------------------------- */
  it("C. valid JWT + expired INTERNATIONAL_TRIAL entitlement -> 402", async () => {
    fakeEntitlementPrisma.seedRef("org-expired", "f-expired");
    fakeEntitlementPrisma.seedEntitlement("org-expired", "OPTIFABRIC", daysFromNow(-10));

    const res = await fetch(`${baseUrl}/projects`, {
      headers: { Authorization: `Bearer ${tokenFor("f-expired")}` },
    });
    expect(res.status).toBe(402);
    const body = await res.json();
    expect(body.message).toBe(
      "Your free trial or subscription has ended. Please subscribe to continue using OptiFabric.",
    );
  });

  /* -------------------------------------------------------------------- *
   * Public / exempt route preservation (Section 9) — verified through the
   * same real pipeline, not just by inspection.
   * -------------------------------------------------------------------- */
  it("health remains fully public (no JWT, no entitlement)", async () => {
    const res = await fetch(`${baseUrl}/health/live`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("subscription/status remains authenticated (401 without a JWT) but entitlement-exempt", async () => {
    const unauthenticated = await fetch(`${baseUrl}/subscription/status`);
    expect(unauthenticated.status).toBe(401);

    // Authenticated with NO entitlement seeded at all for this factory —
    // still 200, proving @SkipSubscriptionCheck() still works correctly
    // now that JwtAuthGuard runs first.
    const authenticated = await fetch(`${baseUrl}/subscription/status`, {
      headers: { Authorization: `Bearer ${tokenFor("f-no-entitlement-needed")}` },
    });
    expect(authenticated.status).toBe(200);
  });

  it("subscription/grant-seats (PlatformRepGuard-only) works with NO JWT at all", async () => {
    const originalKey = process.env.PLATFORM_REP_API_KEY;
    process.env.PLATFORM_REP_API_KEY = "g".repeat(64);
    try {
      const res = await fetch(`${baseUrl}/subscription/grant-seats`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-platform-rep-key": process.env.PLATFORM_REP_API_KEY },
        body: JSON.stringify({ factoryCode: "F1", additionalSeats: 1 }),
      });
      expect(res.status).toBe(201);
      expect(fakeLegacySubscriptionService.grantExtraSeats).toHaveBeenCalled();
    } finally {
      if (originalKey === undefined) delete process.env.PLATFORM_REP_API_KEY;
      else process.env.PLATFORM_REP_API_KEY = originalKey;
    }
  });

  it("subscription/grant-seats still rejects a request with neither a JWT nor the rep header", async () => {
    const res = await fetch(`${baseUrl}/subscription/grant-seats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factoryCode: "F1", additionalSeats: 1 }),
    });
    expect(res.status).toBe(401);
  });
});

/* ============================================================================
 * Ties the TestAppModule's guard order above directly to the REAL
 * app.module.ts, so a future edit to the real registration order can't
 * silently drift from what this file's HTTP tests actually exercise (the
 * HTTP tests above prove *a* correctly-ordered pipeline behaves correctly;
 * this proves app.module.ts IS that pipeline). Reads @Module() metadata via
 * plain Reflect — no instantiation, no DB, no NestFactory — so it's safe to
 * run standalone.
 * ========================================================================== */
describe("app.module.ts APP_GUARD registration order (Stage 4D)", () => {
  it("registers ThrottlerGuard, then JwtAuthGuard, then SubscriptionGuard, in that order", () => {
    const providers = Reflect.getMetadata("providers", AppModule) as Array<{
      provide?: unknown;
      useClass?: unknown;
    }>;

    const guardProviders = providers.filter(
      (p) => typeof p === "object" && p !== null && p.provide === APP_GUARD,
    );

    expect(guardProviders.map((p) => p.useClass)).toEqual([ThrottlerGuard, JwtAuthGuard, SubscriptionGuard]);
  });
});
