import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { HealthModule } from "./modules/health/health.module";
import { ProjectsModule } from "./modules/projects/projects.module";
import { SubscriptionGuard } from "./common/guards/subscription.guard";
import { JwtAuthGuard } from "./modules/auth/jwt-auth.guard";
import { EntitlementIntegrationModule } from "./entitlement/entitlement.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: "default",
        ttl: 60_000,
        limit: Number(process.env.RATE_LIMIT_API_MAX ?? 120),
      },
    ]),
    HealthModule,
    AuthModule,
    SubscriptionModule,
    ProjectsModule,
    // Phase 2: central entitlement — provides the SubscriptionGuard's new
    // decision dependencies (OrganisationResolverService,
    // EntitlementOnboardingService, the entitlement Prisma/service tokens).
    // See docs/PHASE-2-ENTITLEMENT-CUTOVER.md.
    EntitlementIntegrationModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // Phase 4D: global authentication — MUST run before SubscriptionGuard so
    // request.user is populated when entitlement is evaluated (see
    // jwt-auth.guard.ts's header comment for the full ordering rationale).
    // Routes that don't need a JWT — genuinely public (signup/login/health)
    // or authenticated by PlatformRepGuard's shared secret instead — carry
    // @SkipJwtAuth().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Runs on every route unless the handler/controller carries
    // @SkipSubscriptionCheck() (auth and the subscription endpoints themselves
    // are exempted).
    { provide: APP_GUARD, useClass: SubscriptionGuard },
  ],
})
export class AppModule {}
