// Deliberately does NOT `imports: [SubscriptionModule]` — SubscriptionModule
// imports AuthModule (for its guards), and AuthModule needs this module (for
// AuthService's onboarding calls), so importing SubscriptionModule here
// would recreate exactly the circular module dependency auth.service.ts's
// own top-of-file comment already documents avoiding once. Instead, this
// follows the same pattern already established by AuthModule and
// SubscriptionModule themselves: provide SubscriptionService (and its
// PrismaService) directly, rather than importing the module that owns it.
import { Module } from "@nestjs/common";
import { SubscriptionService } from "../modules/subscription/subscription.service";
import { PrismaService } from "../common/prisma.service";
import { entitlementPrismaProvider } from "./entitlement-providers";
import { EntitlementDecisionService } from "./entitlement-decision.service";
import { OrganisationResolverService } from "./organisation-resolver.service";
import { EntitlementOnboardingService } from "./entitlement-onboarding.service";
import { FactoryOrganisationMappingService } from "./factory-organisation-mapping.service";
import { EntitlementBackfillService } from "./entitlement-backfill.service";

@Module({
  providers: [
    PrismaService,
    SubscriptionService,
    entitlementPrismaProvider,
    EntitlementDecisionService,
    OrganisationResolverService,
    EntitlementOnboardingService,
    FactoryOrganisationMappingService,
    EntitlementBackfillService,
  ],
  exports: [
    entitlementPrismaProvider,
    EntitlementDecisionService,
    OrganisationResolverService,
    EntitlementOnboardingService,
    FactoryOrganisationMappingService,
    EntitlementBackfillService,
  ],
})
export class EntitlementIntegrationModule {}
