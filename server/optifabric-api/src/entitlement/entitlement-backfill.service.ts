// PHASE 2A — explicit, safe, idempotent backfill of central entitlement
// state from OptiFabric's legacy per-factory Subscription table, WITHOUT
// resetting anyone's clock. See docs/PHASE-2A-MAPPING-BACKFILL-HARDENING.md,
// "Issue 2" and "Backfill tool", for the full design rationale.
//
// This is a service method, not an HTTP endpoint, by design (per
// instruction) — invoke it from scripts/backfill-optifabric-entitlements.ts
// (a one-off, explicitly-authorized admin/developer action), never from a
// request path. NEVER auto-invoked by the guard or by signup/login.
//
// Core rules, all enforced below:
//   - Never extends an existing expired trial, never shortens a valid
//     existing paid-through date — this only ever WRITES a
//     ProductEntitlement row when NONE exists yet for (organisation,
//     OPTIFABRIC). Re-running this against an already-backfilled factory is
//     a pure no-op for that factory (see "already mapped/skipped").
//   - Never grants BANGLADESH_FREE from Factory.country — Bangladesh
//     factories are identified and reported, never converted. See the
//     Bangladesh Legacy Transition section of the Phase 2A doc for why.
//   - Never invents OptiSewing access from an OptiFabric-only legacy
//     record — only ever writes the OPTIFABRIC row.
import { Inject, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { OrganisationResolverService } from "./organisation-resolver.service";
import { ENTITLEMENT_PRISMA, EntitlementPrismaClient } from "./entitlement-providers";
import { SubscriptionService } from "../modules/subscription/subscription.service";
import { GRACE_PERIOD_DAYS, isBangladeshFactory } from "../modules/subscription/subscription.types";

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export interface BackfillReport {
  factoriesScanned: number;
  organisationsCreated: number;
  refsCreated: number;
  legacyBangladeshFreeDetected: number;
  activeTrialsMigrated: number;
  expiredTrialsMigrated: number;
  activePaidMigrated: number;
  expiredMigrated: number;
  alreadyMappedOrSkipped: number;
  errors: Array<{ factoryId: string; message: string }>;
}

function emptyReport(factoriesScanned: number): BackfillReport {
  return {
    factoriesScanned,
    organisationsCreated: 0,
    refsCreated: 0,
    legacyBangladeshFreeDetected: 0,
    activeTrialsMigrated: 0,
    expiredTrialsMigrated: 0,
    activePaidMigrated: 0,
    expiredMigrated: 0,
    alreadyMappedOrSkipped: 0,
    errors: [],
  };
}

@Injectable()
export class EntitlementBackfillService {
  private readonly logger = new Logger("EntitlementBackfillService");

  constructor(
    private readonly prisma: PrismaService,
    private readonly resolver: OrganisationResolverService,
    private readonly legacySubscriptionService: SubscriptionService,
    @Inject(ENTITLEMENT_PRISMA) private readonly entitlementPrisma: EntitlementPrismaClient,
  ) {}

  /**
   * Enumerates every OptiFabric Factory, maps it centrally if unmapped, and
   * translates its legacy Subscription state into a central OPTIFABRIC
   * ProductEntitlement row — preserving the original trialEndsAt/
   * currentPeriodEnd exactly, never reissuing a fresh 90-day window. Fully
   * idempotent: safe to run repeatedly, safe to interrupt and re-run.
   */
  async backfillOptiFabricEntitlements(): Promise<BackfillReport> {
    const factories = await this.prisma.factory.findMany();
    const report = emptyReport(factories.length);

    for (const factory of factories) {
      try {
        await this.backfillOneFactory(factory, report);
      } catch (err) {
        report.errors.push({ factoryId: factory.id, message: (err as Error).message });
        this.logger.error(`Backfill failed for factory ${factory.id}: ${(err as Error).message}`);
      }
    }

    this.logger.log(`Backfill complete: ${JSON.stringify(report)}`);
    return report;
  }

  private async backfillOneFactory(
    factory: { id: string; factoryName: string; country: string },
    report: BackfillReport,
  ): Promise<void> {
    const existingOrgId = await this.resolver.resolveOrganisationForOptiFabricFactory(factory.id);
    let organisationId: string;
    if (existingOrgId) {
      organisationId = existingOrgId;
    } else {
      organisationId = await this.resolver.resolveOrCreateOrganisationForOptiFabricFactory(
        factory.id,
        factory.factoryName,
        factory.country,
      );
      report.organisationsCreated++;
      report.refsCreated++;
    }

    // Idempotency guard: if a central OPTIFABRIC entitlement already exists
    // for this organisation (from a prior backfill run, or from a live
    // Phase-2 signup/trial), NEVER touch it — never extend, never shorten.
    const existingRow = await this.entitlementPrisma.productEntitlement.findUnique({
      where: { organisationId_product: { organisationId, product: "OPTIFABRIC" } },
    });
    if (existingRow) {
      report.alreadyMappedOrSkipped++;
      return;
    }

    // Bangladesh rule: identify and report only. Never auto-convert a
    // self-declared country field into a permanent BANGLADESH_FREE grant —
    // that requires a trusted eligibility basis (future Bangladesh Apparel
    // integration). The transitional guard fallback already preserves this
    // factory's access in the meantime — see EntitlementOnboardingService.
    if (isBangladeshFactory(factory.country)) {
      report.legacyBangladeshFreeDetected++;
      return;
    }

    const subscription = await this.prisma.subscription.findUnique({ where: { factoryId: factory.id } });
    if (!subscription) {
      // No legacy record at all (e.g. a factory with users but no founding-
      // admin signup flow ever ran) — nothing to migrate; a fresh trial is
      // NOT started here (that would violate "never invent access"). This
      // factory falls back to the ordinary new-signup/reconciliation path.
      report.alreadyMappedOrSkipped++;
      return;
    }

    const effective = this.legacySubscriptionService.computeEffectiveState(subscription, new Date());

    if (subscription.planType === "TRIAL") {
      // trialStartedAt was never stored on the legacy row — createdAt is
      // the closest trustworthy approximation of when the trial began.
      // trialEndsAt is copied EXACTLY, so an expired trial stays expired
      // and an active trial keeps its real remaining time — no new 90 days.
      await this.entitlementPrisma.productEntitlement.create({
        data: {
          organisationId,
          product: "OPTIFABRIC",
          source: "INTERNATIONAL_TRIAL",
          trialStartedAt: subscription.createdAt,
          trialEndsAt: subscription.trialEndsAt,
        },
      });
      if (effective.isAccessAllowed) report.activeTrialsMigrated++;
      else report.expiredTrialsMigrated++;
      return;
    }

    if (subscription.planType === "MONTHLY" || subscription.planType === "ANNUAL") {
      // A factory in the legacy grace period is still allowed access today
      // — copying the bare currentPeriodEnd (already in the past for a
      // grace-period row) would wrongly deny it the instant this backfill
      // runs. Use the grace-adjusted "still allowed until" date instead, so
      // central access exactly matches legacy access at backfill time —
      // this is the "preserve the appropriate paid-through period" rule.
      const effectiveUntil =
        effective.status === "GRACE_PERIOD"
          ? (subscription.graceEndsAt ?? addDays(subscription.currentPeriodEnd as Date, GRACE_PERIOD_DAYS))
          : subscription.currentPeriodEnd;

      await this.entitlementPrisma.productEntitlement.create({
        data: {
          organisationId,
          product: "OPTIFABRIC",
          source: "PAID",
          planCode: "OPTIFABRIC_MONTHLY",
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: effectiveUntil,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        },
      });
      if (effective.isAccessAllowed) report.activePaidMigrated++;
      else report.expiredMigrated++;
      return;
    }

    // BD_FREE_REGIONAL planType with a non-Bangladesh country (shouldn't
    // happen in practice — country is what actually drives legacy access —
    // but handled explicitly rather than silently falling through).
    report.alreadyMappedOrSkipped++;
  }
}
