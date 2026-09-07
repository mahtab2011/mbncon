import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { AuthModule } from "./modules/auth/auth.module";
import { SubscriptionModule } from "./modules/subscription/subscription.module";
import { HealthModule } from "./modules/health/health.module";
import { SubscriptionGuard } from "./common/guards/subscription.guard";
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
    // Phase 2: central entitlement — provides the SubscriptionGuard's new
    // decision dependencies (OrganisationResolverService,
    // EntitlementOnboardingService, the entitlement Prisma/service tokens).
    // See docs/PHASE-2-ENTITLEMENT-CUTOVER.md.
    EntitlementIntegrationModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // Runs on every route unless the handler/controller carries
    // @SkipSubscriptionCheck() (auth and the subscription endpoints themselves
    // are exempted).
    { provide: APP_GUARD, useClass: SubscriptionGuard },
  ],
})
export class AppModule {}
