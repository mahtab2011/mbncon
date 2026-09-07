// PHASE 2A — closes the lockout gap identified in the Phase 2 checkpoint
// review: the guard used to deny outright when no OrganisationExternalRef
// existed yet, which ran BEFORE the Bangladesh legacy-compatibility fallback
// ever got a chance to apply, and a lockout can never be a "compatibility"
// fix. See docs/PHASE-2A-MAPPING-BACKFILL-HARDENING.md, "Issue 1", for the
// full writeup.
//
// This service is the ONLY place that turns an OptiFabric Factory.id the
// guard has never seen before into a central organisationId, on demand,
// from a TRUSTED SERVER-SIDE Factory row — never from anything client-
// supplied. It creates the mapping (Organisation + OrganisationExternalRef)
// and NOTHING else: no trial is started, no entitlement is granted, exactly
// as required ("Do NOT create a new trial merely because an old factory was
// mapped."). Granting access is always a separate, explicit step — see
// EntitlementOnboardingService / EntitlementBackfillService.
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { OrganisationResolverService } from "./organisation-resolver.service";

@Injectable()
export class FactoryOrganisationMappingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resolver: OrganisationResolverService,
  ) {}

  /**
   * Read-only lookup first (the common case once a factory has been mapped
   * once — no write, no Factory query). Only when nothing is mapped yet
   * does this load the Factory row itself and lazily create the mapping.
   * Returns null ONLY when factoryId does not correspond to a real Factory
   * — the caller (SubscriptionGuard) fails closed on that, exactly as it
   * already fails closed on any other unresolvable state.
   */
  async resolveOrLazilyMapOrganisation(factoryId: string): Promise<string | null> {
    const existing = await this.resolver.resolveOrganisationForOptiFabricFactory(factoryId);
    if (existing) return existing;

    const factory = await this.prisma.factory.findUnique({ where: { id: factoryId } });
    if (!factory) return null;

    return this.resolver.resolveOrCreateOrganisationForOptiFabricFactory(
      factory.id,
      factory.factoryName,
      factory.country,
    );
  }
}
