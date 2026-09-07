// Resolves an OptiFabric Factory.id to its central Organisation, via
// OrganisationExternalRef{system: OPTIFABRIC, externalFactoryId: Factory.id}.
// Never modifies Factory.id itself and never assumes it equals
// organisationId — the two id spaces stay independent, exactly as required.
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ENTITLEMENT_PRISMA, EntitlementPrismaClient } from "./entitlement-providers";

@Injectable()
export class OrganisationResolverService {
  private readonly logger = new Logger("OrganisationResolverService");

  constructor(
    @Inject(ENTITLEMENT_PRISMA) private readonly entitlementPrisma: EntitlementPrismaClient,
  ) {}

  /** Read-only lookup. Returns null if this factory has never been mapped. */
  async resolveOrganisationForOptiFabricFactory(factoryId: string): Promise<string | null> {
    const ref = await this.entitlementPrisma.organisationExternalRef.findUnique({
      where: {
        system_externalFactoryId: { system: "OPTIFABRIC", externalFactoryId: factoryId },
      },
    });
    return ref?.organisationId ?? null;
  }

  /**
   * Idempotent onboarding: creates a central Organisation + external-ref
   * mapping for a factory that doesn't have one yet, or returns the
   * existing mapping unchanged. Never creates a duplicate Organisation for
   * an already-mapped factory — the read-check-then-create sequence below,
   * combined with the database-level `@@unique([system, externalFactoryId])`
   * constraint on OrganisationExternalRef, makes double-mapping impossible
   * even under a race: if two concurrent calls both pass the initial check,
   * only one `organisationExternalRef.create()` can succeed — the loser
   * catches the unique-constraint violation and returns the winner's
   * organisationId instead of erroring. NOTE: this can rarely leave one
   * orphaned Organisation row (created by the losing call, with no
   * external ref pointing at it) — harmless for entitlement decisions
   * (nothing ever reads it), a known minor cleanup item, not a correctness
   * or security issue. See docs/PHASE-2-ENTITLEMENT-CUTOVER.md.
   *
   * Only creates the ORGANISATION MAPPING — never grants an entitlement.
   * Granting access is always a separate, explicit call (see
   * EntitlementOnboardingService).
   */
  async resolveOrCreateOrganisationForOptiFabricFactory(
    factoryId: string,
    factoryName: string,
    countryCode: string | null,
  ): Promise<string> {
    const existing = await this.resolveOrganisationForOptiFabricFactory(factoryId);
    if (existing) return existing;

    const organisation = await this.entitlementPrisma.organisation.create({
      data: { name: factoryName, countryCode: countryCode ?? undefined },
    });

    try {
      await this.entitlementPrisma.organisationExternalRef.create({
        data: {
          organisationId: organisation.id,
          system: "OPTIFABRIC",
          externalFactoryId: factoryId,
        },
      });
      return organisation.id;
    } catch (err: unknown) {
      const code = (err as { code?: string } | null)?.code;
      if (code === "P2002") {
        // Lost a create-race to a concurrent caller — use their mapping.
        const winner = await this.resolveOrganisationForOptiFabricFactory(factoryId);
        if (winner) {
          this.logger.warn(
            `Lost a concurrent organisation-mapping race for OptiFabric factory ${factoryId}; ` +
              `using the winning mapping. Organisation ${organisation.id} is now an orphan row.`,
          );
          return winner;
        }
      }
      throw err;
    }
  }
}
