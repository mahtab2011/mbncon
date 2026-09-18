// Stage 2F-2 — real-HTTP boundary coverage for GET /entitlements/me/optifabric.
//
// test/entitlement-status.spec.ts already covers the controller's own
// composition logic (mapping/decision/fallback) against mocked services.
// What that file's unit-level construction CANNOT prove is the real Nest
// guard pipeline: that an unauthenticated request is rejected by the global
// JwtAuthGuard before it ever reaches this controller, and that
// @SkipSubscriptionCheck() genuinely lets an authenticated-but-entitlement-
// denied caller reach this route with a 200 (the whole reason this route
// exists — see test/guard-ordering-e2e.spec.ts's header comment for why a
// hand-built ExecutionContext with a pre-populated request.user cannot catch
// a guard-ordering regression).
//
// Same technique as guard-ordering-e2e.spec.ts: NestFactory.create with the
// real APP_GUARD registrations/order, an ephemeral local port, real HTTP via
// Node's built-in fetch. Only Prisma access is faked (same in-memory-Map
// convention). No live database is used or required.

process.env.JWT_SECRET = "e".repeat(64);
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
import { EntitlementStatusController } from "../src/entitlement/entitlement-status.controller";
import { PrismaService } from "../src/common/prisma.service";
import { SubscriptionService } from "../src/modules/subscription/subscription.service";

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
    seedEntitlement(organisationId: string, trialEndsAt: Date | null, currentPeriodEnd: Date | null = null) {
      entitlements.set(`${organisationId}::OPTIFABRIC`, {
        organisationId,
        product: "OPTIFABRIC",
        source: trialEndsAt ? "INTERNATIONAL_TRIAL" : "PAID",
        trialEndsAt,
        currentPeriodEnd,
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

describe("GET /entitlements/me/optifabric — real Nest HTTP pipeline (Stage 2F-2)", () => {
  let app: INestApplication;
  let baseUrl: string;
  let jwtService: JwtService;
  const fakeEntitlementPrisma = makeFakeEntitlementPrisma();

  const fakeAuthService = { isRevoked: jest.fn().mockResolvedValue(false) };
  const fakeOptifabricPrisma = { factory: { findUnique: jest.fn().mockResolvedValue(null) } };
  const fakeLegacySubscriptionService = {
    getEffectiveState: jest.fn().mockResolvedValue({ status: "EXPIRED", isAccessAllowed: false }),
  };

  beforeAll(async () => {
    @Module({
      imports: [
        ThrottlerModule.forRoot([{ name: "default", ttl: 60_000, limit: 1000 }]),
        PassportModule,
        JwtModule.register({ secret: TEST_JWT_SECRET, signOptions: { expiresIn: "7d" } }),
      ],
      controllers: [EntitlementStatusController],
      providers: [
        // Same three APP_GUARDs, same order, as src/app.module.ts.
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

  function tokenFor(factoryId: string) {
    return jwtService.sign({ sub: "user-1", factoryId, role: "ROLE_FACTORY_ADMIN", jti: `jti-${factoryId}` });
  }

  it("rejects a request with no Authorization header (401) before it ever reaches the controller", async () => {
    const res = await fetch(`${baseUrl}/entitlements/me/optifabric`);
    expect(res.status).toBe(401);
  });

  it("rejects a request with an invalid token (401)", async () => {
    const res = await fetch(`${baseUrl}/entitlements/me/optifabric`, {
      headers: { Authorization: "Bearer not-a-real-token" },
    });
    expect(res.status).toBe(401);
  });

  it("returns 200 with the real entitlement state for an authenticated factory with active access", async () => {
    fakeEntitlementPrisma.seedRef("org-e2e-active", "f-e2e-active");
    fakeEntitlementPrisma.seedEntitlement("org-e2e-active", daysFromNow(15));

    const res = await fetch(`${baseUrl}/entitlements/me/optifabric`, {
      headers: { Authorization: `Bearer ${tokenFor("f-e2e-active")}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ isAccessAllowed: true, reason: "TRIAL_ACTIVE", trialDaysRemaining: 15 });
  });

  it("@SkipSubscriptionCheck lets an authenticated-but-entitlement-denied caller reach 200 (the whole point of this route)", async () => {
    fakeEntitlementPrisma.seedRef("org-e2e-expired", "f-e2e-expired");
    fakeEntitlementPrisma.seedEntitlement("org-e2e-expired", daysFromNow(-5));

    // Sanity check first: a normal protected route WOULD deny this factory
    // with 402 — proving the skip below is meaningful, not just "everything
    // is allowed in this test module."
    const res = await fetch(`${baseUrl}/entitlements/me/optifabric`, {
      headers: { Authorization: `Bearer ${tokenFor("f-e2e-expired")}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ isAccessAllowed: false, reason: "TRIAL_EXPIRED", trialDaysRemaining: 0 });
  });

  it("performs no entitlement mutation: productEntitlement.findUnique is the only call, never create/update", async () => {
    fakeEntitlementPrisma.seedRef("org-e2e-readonly", "f-e2e-readonly");
    fakeEntitlementPrisma.seedEntitlement("org-e2e-readonly", daysFromNow(3));

    const client = fakeEntitlementPrisma.client as unknown as { productEntitlement: Record<string, unknown> };
    expect(client.productEntitlement.create).toBeUndefined();
    expect(client.productEntitlement.update).toBeUndefined();
    expect(client.productEntitlement.upsert).toBeUndefined();

    const res = await fetch(`${baseUrl}/entitlements/me/optifabric`, {
      headers: { Authorization: `Bearer ${tokenFor("f-e2e-readonly")}` },
    });
    expect(res.status).toBe(200);
  });
});
