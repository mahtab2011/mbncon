// Central entitlement decision service — Phase 1.
//
// This is the ONE place that decides whether an Organisation may use
// OPTIFABRIC or OPTISEWING. Every method here is a service-layer primitive
// only — there is deliberately no HTTP controller in this phase (see
// CENTRAL-ENTITLEMENT-PHASE-1.md, "No public API in Phase 1"). Nothing here
// verifies payment; activateXMonthly()/activateBundleMonthly() are
// entitlement primitives for admin/test-controlled activation, not proof
// that a charge occurred — see the "No payment gateway" note in the docs.
//
// Security invariants preserved by this file (see also the tests):
//   - every date (trialStartedAt, trialEndsAt, currentPeriodStart,
//     currentPeriodEnd) is always computed from the server clock inside
//     this service — no method accepts an end date directly from a caller.
//   - "product" is always the generated Prisma enum type; assertValidProduct()
//     defends the boundary at runtime too, for any caller that bypasses
//     TypeScript (e.g. a future HTTP layer deserializing JSON).
//   - access is always COMPUTED from (source, trialEndsAt, currentPeriodEnd)
//     at read time — there is no separate stored "status" flag that could
//     drift out of sync with the timestamps.
//   - cancelAtPeriodEnd is written but deliberately never read by
//     getEffectiveEntitlement() — cancelling must not shorten access
//     already paid for.
//   - an unknown organisationId fails closed for reads (no entitlement row
//     -> NO_ENTITLEMENT -> isAccessAllowed: false) and fails closed for
//     writes via the Organisation foreign key (Prisma/Postgres reject the
//     write outright if the organisation does not exist).
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import {
  EffectiveEntitlement,
  MONTHLY_PERIOD_DAYS,
  Product,
  TRIAL_PERIOD_DAYS,
  TrialPair,
} from "./entitlement.types";

function assertValidProduct(product: unknown): asserts product is Product {
  if (product !== "OPTIFABRIC" && product !== "OPTISEWING") {
    throw new NotFoundException(`Unknown product: ${String(product)}`);
  }
}

function otherProduct(product: Product): Product {
  return product === "OPTIFABRIC" ? "OPTISEWING" : "OPTIFABRIC";
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

@Injectable()
export class EntitlementService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The one authoritative read: does this organisation currently have
   * access to this product, and why. Every other read/gate in this system
   * should ultimately call this (or canAccess()) rather than re-implement
   * date comparisons elsewhere.
   */
  async getEffectiveEntitlement(
    organisationId: string,
    product: Product,
  ): Promise<EffectiveEntitlement> {
    assertValidProduct(product);

    const row = await this.prisma.productEntitlement.findUnique({
      where: { organisationId_product: { organisationId, product } },
    });

    const base = {
      organisationId,
      product,
      trialEndsAt: row?.trialEndsAt ?? null,
      currentPeriodEnd: row?.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: row?.cancelAtPeriodEnd ?? false,
      planCode: row?.planCode ?? null,
      source: row?.source ?? null,
    };

    if (!row) {
      return { ...base, isAccessAllowed: false, reason: "NO_ENTITLEMENT" };
    }

    const now = Date.now();

    if (row.source === "BANGLADESH_FREE") {
      // Always allowed. No date is ever consulted for this source — see
      // grantBangladeshFreeEntitlement(), which never sets trialEndsAt or
      // currentPeriodEnd on a BANGLADESH_FREE row.
      return { ...base, isAccessAllowed: true, reason: "BANGLADESH_FREE" };
    }

    if (row.source === "INTERNATIONAL_TRIAL") {
      // Strict "<" — access ends AT trialEndsAt, not after it. A request
      // arriving at exactly trialEndsAt is already denied.
      const allowed = row.trialEndsAt !== null && now < row.trialEndsAt.getTime();
      return {
        ...base,
        isAccessAllowed: allowed,
        reason: allowed ? "TRIAL_ACTIVE" : "TRIAL_EXPIRED",
      };
    }

    // source === "PAID". cancelAtPeriodEnd is deliberately NOT read here —
    // a cancelled-but-still-within-period subscription remains fully
    // usable. Only currentPeriodEnd governs access.
    const allowed = row.currentPeriodEnd !== null && now < row.currentPeriodEnd.getTime();
    return {
      ...base,
      isAccessAllowed: allowed,
      reason: allowed ? "PAID_ACTIVE" : "PAID_EXPIRED",
    };
  }

  async canAccess(organisationId: string, product: Product): Promise<boolean> {
    const effective = await this.getEffectiveEntitlement(organisationId, product);
    return effective.isAccessAllowed;
  }

  private async getBothEffective(organisationId: string): Promise<TrialPair> {
    const [optifabric, optisewing] = await Promise.all([
      this.getEffectiveEntitlement(organisationId, "OPTIFABRIC"),
      this.getEffectiveEntitlement(organisationId, "OPTISEWING"),
    ]);
    return { optifabric, optisewing };
  }

  /**
   * Starts the 90-day international trial for BOTH products at once,
   * atomically, with a single shared trialStartedAt/trialEndsAt pair.
   *
   * Idempotent by design: if EITHER product already has an entitlement row
   * for this organisation (trial, paid, or Bangladesh-free), this method
   * creates nothing and simply returns the current state unchanged. This
   * is what makes "re-login doesn't restart the trial" and "calling this
   * twice doesn't extend the trial" true by construction, not by a
   * separate check — there is no code path that overwrites an existing
   * row here.
   */
  async startInternationalTrial(organisationId: string): Promise<TrialPair> {
    const [existingFabric, existingSewing] = await Promise.all([
      this.prisma.productEntitlement.findUnique({
        where: { organisationId_product: { organisationId, product: "OPTIFABRIC" } },
      }),
      this.prisma.productEntitlement.findUnique({
        where: { organisationId_product: { organisationId, product: "OPTISEWING" } },
      }),
    ]);

    if (existingFabric || existingSewing) {
      return this.getBothEffective(organisationId);
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

    return this.getBothEffective(organisationId);
  }

  /**
   * Grants permanent, non-expiring access to BOTH products for an
   * organisation. Idempotent (an upsert — calling it again just reaffirms
   * the same state).
   *
   * Deliberately takes ONLY an organisationId — no country string, and no
   * lookup against Factory.country / isRecognisedBangladeshCountryValue().
   * This must only ever be invoked from a trusted, explicit operation (an
   * admin action today; a verified Bangladesh Apparel signal in a future
   * phase — see CENTRAL-ENTITLEMENT-PHASE-1.md). It is not, and must never
   * become, something a user's own signup form can trigger by typing
   * "Bangladesh" into a text field.
   */
  async grantBangladeshFreeEntitlement(organisationId: string): Promise<TrialPair> {
    const upsertOne = (product: Product) =>
      this.prisma.productEntitlement.upsert({
        where: { organisationId_product: { organisationId, product } },
        create: { organisationId, product, source: "BANGLADESH_FREE" },
        update: {
          source: "BANGLADESH_FREE",
          planCode: null,
          trialStartedAt: null,
          trialEndsAt: null,
          currentPeriodStart: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        },
      });

    await this.prisma.$transaction([upsertOne("OPTIFABRIC"), upsertOne("OPTISEWING")]);

    return this.getBothEffective(organisationId);
  }

  private computeMonthlyPeriod(periodStart?: Date): {
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  } {
    const currentPeriodStart = periodStart ?? new Date();
    const currentPeriodEnd = addDays(currentPeriodStart, MONTHLY_PERIOD_DAYS);
    return { currentPeriodStart, currentPeriodEnd };
  }

  /**
   * Admin/test-controlled activation only — there is no payment gateway in
   * Phase 1, so calling this is NOT proof that a charge occurred. The
   * optional `periodStart` exists only so tests (and, later, a real
   * activation flow that knows exactly when a charge cleared) can control
   * the period explicitly; it is never sourced from an unauthenticated
   * client request in this phase, since there is no HTTP endpoint yet.
   *
   * Only writes the OPTIFABRIC row. Does not touch OPTISEWING — a fresh
   * organisation with no prior entitlement correctly ends up with
   * OptiFabric enabled and OptiSewing not (NO_ENTITLEMENT). NOTE: this
   * does NOT retract an existing OPTISEWING entitlement if the
   * organisation is downgrading from an active bundle — reconciling a
   * plan change is explicitly out of scope for this phase's primitives;
   * see "Unresolved design issues" in CENTRAL-ENTITLEMENT-PHASE-1.md.
   */
  async activateOptiFabricMonthly(
    organisationId: string,
    periodStart?: Date,
  ): Promise<EffectiveEntitlement> {
    const { currentPeriodStart, currentPeriodEnd } = this.computeMonthlyPeriod(periodStart);

    await this.prisma.productEntitlement.upsert({
      where: { organisationId_product: { organisationId, product: "OPTIFABRIC" } },
      create: {
        organisationId,
        product: "OPTIFABRIC",
        source: "PAID",
        planCode: "OPTIFABRIC_MONTHLY",
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
      },
      update: {
        source: "PAID",
        planCode: "OPTIFABRIC_MONTHLY",
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
      },
    });

    return this.getEffectiveEntitlement(organisationId, "OPTIFABRIC");
  }

  /** Symmetric counterpart of activateOptiFabricMonthly() — see its docs. */
  async activateOptiSewingMonthly(
    organisationId: string,
    periodStart?: Date,
  ): Promise<EffectiveEntitlement> {
    const { currentPeriodStart, currentPeriodEnd } = this.computeMonthlyPeriod(periodStart);

    await this.prisma.productEntitlement.upsert({
      where: { organisationId_product: { organisationId, product: "OPTISEWING" } },
      create: {
        organisationId,
        product: "OPTISEWING",
        source: "PAID",
        planCode: "OPTISEWING_MONTHLY",
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
      },
      update: {
        source: "PAID",
        planCode: "OPTISEWING_MONTHLY",
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
      },
    });

    return this.getEffectiveEntitlement(organisationId, "OPTISEWING");
  }

  /**
   * Activates the bundle for BOTH products atomically, with the SAME
   * currentPeriodStart/currentPeriodEnd on both rows. Uses a single
   * prisma.$transaction — if either write fails, Prisma rolls the whole
   * transaction back, so a bundle purchase can never succeed for one
   * product while silently failing for the other.
   */
  async activateBundleMonthly(organisationId: string, periodStart?: Date): Promise<TrialPair> {
    const { currentPeriodStart, currentPeriodEnd } = this.computeMonthlyPeriod(periodStart);

    const upsertOne = (product: Product) =>
      this.prisma.productEntitlement.upsert({
        where: { organisationId_product: { organisationId, product } },
        create: {
          organisationId,
          product,
          source: "PAID",
          planCode: "BUNDLE_MONTHLY",
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: false,
        },
        update: {
          source: "PAID",
          planCode: "BUNDLE_MONTHLY",
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: false,
        },
      });

    await this.prisma.$transaction([upsertOne("OPTIFABRIC"), upsertOne("OPTISEWING")]);

    return this.getBothEffective(organisationId);
  }

  /**
   * Sets cancelAtPeriodEnd = true. Does NOT touch currentPeriodEnd and
   * does NOT affect isAccessAllowed — see getEffectiveEntitlement(), which
   * never reads this flag. Its only effect today is a durable record that
   * "this should not renew"; a future auto-renewal implementation is what
   * would actually need to consult it.
   *
   * If the entitlement being cancelled is part of a BUNDLE_MONTHLY plan,
   * cancels BOTH product rows together — a bundle is one commercial
   * purchase, so cancelling "OptiSewing" out of a bundle without also
   * cancelling "OptiFabric" would misrepresent what was actually
   * purchased.
   */
  async cancelEntitlement(organisationId: string, product: Product): Promise<TrialPair> {
    assertValidProduct(product);

    const row = await this.prisma.productEntitlement.findUnique({
      where: { organisationId_product: { organisationId, product } },
    });

    if (!row) {
      throw new NotFoundException(
        `No entitlement found for organisation ${organisationId} / product ${product}`,
      );
    }

    if (row.planCode === "BUNDLE_MONTHLY") {
      const other = otherProduct(product);
      await this.prisma.$transaction([
        this.prisma.productEntitlement.update({
          where: { organisationId_product: { organisationId, product } },
          data: { cancelAtPeriodEnd: true },
        }),
        this.prisma.productEntitlement.updateMany({
          where: { organisationId, product: other, planCode: "BUNDLE_MONTHLY" },
          data: { cancelAtPeriodEnd: true },
        }),
      ]);
      return this.getBothEffective(organisationId);
    }

    await this.prisma.productEntitlement.update({
      where: { organisationId_product: { organisationId, product } },
      data: { cancelAtPeriodEnd: true },
    });

    return this.getBothEffective(organisationId);
  }
}
