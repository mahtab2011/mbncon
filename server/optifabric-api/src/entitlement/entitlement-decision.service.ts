// LOCAL COPY of the two entitlement operations this backend actually needs
// (read access decisions, and starting an international trial) — see
// prisma/entitlement/schema.prisma for why this is a copy rather than a
// direct import of entitlement-api's own EntitlementService, and
// docs/PHASE-2-ENTITLEMENT-CUTOVER.md for the full writeup.
//
// This is DELIBERATELY NOT a full reimplementation of
// server/entitlement-api/src/modules/entitlement/entitlement.service.ts —
// only the two methods this backend calls (getEffectiveEntitlement/
// canAccess for the guard, startInternationalTrial for signup) are
// reproduced here, kept LOGICALLY IDENTICAL to that file. Everything else
// (grantBangladeshFreeEntitlement, activateXMonthly, cancelEntitlement)
// stays exclusively entitlement-api's own responsibility — this backend
// never writes a PAID or BANGLADESH_FREE row.
//
// KNOWN RISK, explicitly flagged: keeping this logic in sync with
// entitlement-api's copy is a manual discipline, not something the type
// system enforces. Any future change to trial/access rules must be applied
// in BOTH places. See "Recommended safe cutover/checkpoint step" in the
// Phase 2 report for the proper long-term fix (a shared package).
import { Inject, Injectable } from "@nestjs/common";
import { ENTITLEMENT_PRISMA, EntitlementPrismaClient } from "./entitlement-providers";

export type Product = "OPTIFABRIC" | "OPTISEWING";

export interface EffectiveEntitlement {
  isAccessAllowed: boolean;
  reason: "NO_ENTITLEMENT" | "BANGLADESH_FREE" | "TRIAL_ACTIVE" | "TRIAL_EXPIRED" | "PAID_ACTIVE" | "PAID_EXPIRED";
}

const TRIAL_PERIOD_DAYS = 90;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

@Injectable()
export class EntitlementDecisionService {
  constructor(
    @Inject(ENTITLEMENT_PRISMA) private readonly prisma: EntitlementPrismaClient,
  ) {}

  /** Logic mirrors EntitlementService.getEffectiveEntitlement() exactly. */
  async getEffectiveEntitlement(organisationId: string, product: Product): Promise<EffectiveEntitlement> {
    const row = await this.prisma.productEntitlement.findUnique({
      where: { organisationId_product: { organisationId, product } },
    });

    if (!row) {
      return { isAccessAllowed: false, reason: "NO_ENTITLEMENT" };
    }

    const now = Date.now();

    if (row.source === "BANGLADESH_FREE") {
      return { isAccessAllowed: true, reason: "BANGLADESH_FREE" };
    }

    if (row.source === "INTERNATIONAL_TRIAL") {
      const allowed = row.trialEndsAt !== null && now < row.trialEndsAt.getTime();
      return { isAccessAllowed: allowed, reason: allowed ? "TRIAL_ACTIVE" : "TRIAL_EXPIRED" };
    }

    // source === "PAID". cancelAtPeriodEnd is deliberately NOT read here,
    // matching entitlement-api's own EntitlementService exactly.
    const allowed = row.currentPeriodEnd !== null && now < row.currentPeriodEnd.getTime();
    return { isAccessAllowed: allowed, reason: allowed ? "PAID_ACTIVE" : "PAID_EXPIRED" };
  }

  async canAccess(organisationId: string, product: Product): Promise<boolean> {
    const effective = await this.getEffectiveEntitlement(organisationId, product);
    return effective.isAccessAllowed;
  }

  /**
   * Stage 2F-2 — read-only helper for UI display purposes only (e.g. "N
   * days remaining"). Deliberately NOT part of the entitlement-api mirror
   * above (getEffectiveEntitlement/canAccess/startInternationalTrial stay
   * byte-for-byte identical to that file's own three methods) — this is a
   * plain data read of the same row, added for the status endpoint that
   * needs the raw dates behind getEffectiveEntitlement's boolean/reason.
   * Returns null fields when no row exists, same "no row = nothing to
   * report" convention as the rest of this service.
   */
  async getEntitlementDates(
    organisationId: string,
    product: Product,
  ): Promise<{ trialEndsAt: Date | null; currentPeriodEnd: Date | null }> {
    const row = await this.prisma.productEntitlement.findUnique({
      where: { organisationId_product: { organisationId, product } },
    });
    return { trialEndsAt: row?.trialEndsAt ?? null, currentPeriodEnd: row?.currentPeriodEnd ?? null };
  }

  /**
   * Logic mirrors EntitlementService.startInternationalTrial() exactly:
   * idempotent (a no-op if either product already has an entitlement row),
   * both products created atomically with identical server-generated
   * trialStartedAt/trialEndsAt.
   */
  async startInternationalTrial(organisationId: string): Promise<void> {
    const [existingFabric, existingSewing] = await Promise.all([
      this.prisma.productEntitlement.findUnique({
        where: { organisationId_product: { organisationId, product: "OPTIFABRIC" } },
      }),
      this.prisma.productEntitlement.findUnique({
        where: { organisationId_product: { organisationId, product: "OPTISEWING" } },
      }),
    ]);

    if (existingFabric || existingSewing) {
      return;
    }

    const trialStartedAt = new Date();
    const trialEndsAt = addDays(trialStartedAt, TRIAL_PERIOD_DAYS);

    await this.prisma.$transaction([
      this.prisma.productEntitlement.create({
        data: {
          organisationId,
          product: "OPTIFABRIC",
          source: "INTERNATIONAL_TRIAL",
          trialStartedAt,
          trialEndsAt,
        },
      }),
      this.prisma.productEntitlement.create({
        data: {
          organisationId,
          product: "OPTISEWING",
          source: "INTERNATIONAL_TRIAL",
          trialStartedAt,
          trialEndsAt,
        },
      }),
    ]);
  }
}
