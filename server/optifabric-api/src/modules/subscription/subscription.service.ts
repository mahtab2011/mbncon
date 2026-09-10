// OptiFabric's subscription/licensing system, mirroring OptiSewing's
// apps/api/src/modules/subscription/subscription.service.ts exactly: a 90-day
// free trial, monthly ($29.98/2 users + $5/extra user) and annual ($300/5
// users) plans, a 7-day grace period before automatic cancellation, and
// tamper-evident subscription records (HMAC-SHA256 signature over the row,
// verified on every read). Factories registered in Bangladesh get 3 free
// seats, permanently — see isBangladeshFactory() in subscription.types.ts.
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import {
  SignableSubscriptionFields,
  signSubscriptionFields,
  verifySubscriptionSignature,
} from "./subscription-signing";
import {
  ANNUAL_BASE_PRICE_CENTS,
  ANNUAL_BASE_SEATS,
  ANNUAL_EXTRA_SEAT_PRICE_CENTS,
  BD_INCLUDED_FREE_SEATS,
  EffectiveSubscriptionState,
  GRACE_PERIOD_DAYS,
  isBangladeshFactory,
  MONTHLY_BASE_PRICE_CENTS,
  MONTHLY_BASE_SEATS,
  MONTHLY_EXTRA_SEAT_PRICE_CENTS,
  TRIAL_PERIOD_DAYS,
} from "./subscription.types";

type SignableFields = SignableSubscriptionFields;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger("SubscriptionService");

  constructor(private readonly prisma: PrismaService) {}

  async startTrial(factoryId: string) {
    const now = new Date();
    const trialEndsAt = addDays(now, TRIAL_PERIOD_DAYS);
    const fields: SignableFields = {
      factoryId,
      planType: "TRIAL",
      status: "TRIALING",
      trialEndsAt,
      currentPeriodStart: null,
      currentPeriodEnd: null,
      graceEndsAt: null,
      includedSeats: MONTHLY_BASE_SEATS,
      extraSeats: 0,
      cancelAtPeriodEnd: false,
    };
    return this.prisma.subscription.create({
      data: { ...fields, signature: signSubscriptionFields(fields) },
    });
  }

  // SECURITY: kept for now but deliberately unreachable — no controller
  // route calls this. SubscriptionController.activate() (POST
  // /subscription/activate) was found to let an authenticated factory user
  // set their own legacy status to ACTIVE and extraSeats to any value from
  // client-supplied input, which auth.service.ts's signup approval gate
  // then read to silently bypass the only payment-enforcement checkpoint
  // that exists before a real payment gateway is built. Do not wire this
  // back to an endpoint reachable by an ordinary factory JWT without a real
  // payment verification step first.
  async activateSubscription(
    factoryId: string,
    planType: "MONTHLY" | "ANNUAL",
    extraSeats: number,
  ) {
    const now = new Date();
    const periodDays = planType === "ANNUAL" ? 365 : 30;
    const fields: SignableFields = {
      factoryId,
      planType,
      status: "ACTIVE",
      trialEndsAt: now,
      currentPeriodStart: now,
      currentPeriodEnd: addDays(now, periodDays),
      graceEndsAt: null,
      includedSeats: planType === "ANNUAL" ? ANNUAL_BASE_SEATS : MONTHLY_BASE_SEATS,
      extraSeats: Math.max(0, extraSeats),
      cancelAtPeriodEnd: false,
    };
    return this.prisma.subscription.upsert({
      where: { factoryId },
      create: { ...fields, signature: signSubscriptionFields(fields) },
      update: { ...fields, signature: signSubscriptionFields(fields) },
    });
  }

  async cancelAtPeriodEnd(factoryId: string) {
    const existing = await this.prisma.subscription.findUnique({ where: { factoryId } });
    if (!existing) return null;
    const fields: SignableFields = { ...existing, cancelAtPeriodEnd: true };
    return this.prisma.subscription.update({
      where: { factoryId },
      data: { cancelAtPeriodEnd: true, signature: signSubscriptionFields(fields) },
    });
  }

  computeMonthlyPriceCents(extraSeats: number): number {
    return MONTHLY_BASE_PRICE_CENTS + Math.max(0, extraSeats) * MONTHLY_EXTRA_SEAT_PRICE_CENTS;
  }

  computeAnnualPriceCents(extraSeats: number): number {
    return ANNUAL_BASE_PRICE_CENTS + Math.max(0, extraSeats) * ANNUAL_EXTRA_SEAT_PRICE_CENTS;
  }

  // Seat fields are carried on every branch below so the frontend can show "N of
  // M seats used." `seatsUsed` is only supplied by callers that already counted
  // active users (today, just getBangladeshFreeState) — everywhere else it stays
  // null and canAddMoreUsers defaults to true, which preserves the pre-existing,
  // uncapped behavior for foreign (paid) factories.
  private seatFields(
    subscription: { includedSeats: number; extraSeats: number } | null,
    seatsUsed: number | null,
  ): Pick<EffectiveSubscriptionState, "includedSeats" | "extraSeats" | "seatsUsed" | "canAddMoreUsers"> {
    if (!subscription) {
      return { includedSeats: null, extraSeats: null, seatsUsed, canAddMoreUsers: true };
    }
    const total = subscription.includedSeats + subscription.extraSeats;
    return {
      includedSeats: subscription.includedSeats,
      extraSeats: subscription.extraSeats,
      seatsUsed,
      canAddMoreUsers: seatsUsed === null ? true : seatsUsed < total,
    };
  }

  private async countActiveUsers(factoryId: string): Promise<number> {
    return this.prisma.user.count({ where: { factoryId, isActive: true } });
  }

  computeEffectiveState(
    subscription: (SignableFields & { signature: string }) | null,
    now: Date = new Date(),
    seatsUsed: number | null = null,
  ): EffectiveSubscriptionState {
    if (!subscription) {
      return {
        status: "EXPIRED",
        isAccessAllowed: false,
        daysUntilExpiry: null,
        tampered: false,
        ...this.seatFields(null, seatsUsed),
      };
    }

    const tampered = !verifySubscriptionSignature(subscription, subscription.signature);
    if (tampered) {
      return {
        status: "CANCELLED",
        isAccessAllowed: false,
        daysUntilExpiry: null,
        tampered: true,
        ...this.seatFields(null, seatsUsed),
      };
    }

    if (subscription.status === "CANCELLED") {
      return {
        status: "CANCELLED",
        isAccessAllowed: false,
        daysUntilExpiry: null,
        tampered: false,
        ...this.seatFields(subscription, seatsUsed),
      };
    }

    if (subscription.status === "TRIALING") {
      const msRemaining = subscription.trialEndsAt.getTime() - now.getTime();
      if (msRemaining > 0) {
        return {
          status: "TRIALING",
          isAccessAllowed: true,
          daysUntilExpiry: Math.ceil(msRemaining / (24 * 60 * 60 * 1000)),
          tampered: false,
          ...this.seatFields(subscription, seatsUsed),
        };
      }
      return {
        status: "EXPIRED",
        isAccessAllowed: false,
        daysUntilExpiry: 0,
        tampered: false,
        ...this.seatFields(subscription, seatsUsed),
      };
    }

    // ACTIVE / GRACE_PERIOD: date-derived from currentPeriodEnd, not from the stored
    // status alone, so access correctly expires even before the maintenance sweep
    // (Section below) has run.
    if (subscription.currentPeriodEnd) {
      const msRemaining = subscription.currentPeriodEnd.getTime() - now.getTime();
      if (msRemaining > 0) {
        return {
          status: "ACTIVE",
          isAccessAllowed: true,
          daysUntilExpiry: Math.ceil(msRemaining / (24 * 60 * 60 * 1000)),
          tampered: false,
          ...this.seatFields(subscription, seatsUsed),
        };
      }
      const graceEndsAt = subscription.graceEndsAt ?? addDays(subscription.currentPeriodEnd, GRACE_PERIOD_DAYS);
      if (now.getTime() < graceEndsAt.getTime()) {
        return {
          status: "GRACE_PERIOD",
          isAccessAllowed: true,
          daysUntilExpiry: 0,
          tampered: false,
          ...this.seatFields(subscription, seatsUsed),
        };
      }
      return {
        status: "EXPIRED",
        isAccessAllowed: false,
        daysUntilExpiry: 0,
        tampered: false,
        ...this.seatFields(subscription, seatsUsed),
      };
    }

    return {
      status: "EXPIRED",
      isAccessAllowed: false,
      daysUntilExpiry: null,
      tampered: false,
      ...this.seatFields(subscription, seatsUsed),
    };
  }

  // Backfills a Subscription row for a factory that has none yet (e.g. a
  // Bangladeshi factory that predates the 3-free-seat model, or a foreign
  // factory getting its first rep-granted extra seat before ever activating a
  // paid plan). Seat accounting needs somewhere to live, so the first
  // operation that needs it creates one, with country-appropriate defaults.
  private async getOrCreateSubscriptionRow(factoryId: string, country: string) {
    const existing = await this.prisma.subscription.findUnique({ where: { factoryId } });
    if (existing) return existing;

    const fields: SignableFields = isBangladeshFactory(country)
      ? {
          factoryId,
          planType: "BD_FREE_REGIONAL",
          status: "FREE_REGIONAL",
          trialEndsAt: new Date(),
          currentPeriodStart: null,
          currentPeriodEnd: null,
          graceEndsAt: null,
          includedSeats: BD_INCLUDED_FREE_SEATS,
          extraSeats: 0,
          cancelAtPeriodEnd: false,
        }
      : {
          factoryId,
          planType: "TRIAL",
          status: "TRIALING",
          trialEndsAt: addDays(new Date(), TRIAL_PERIOD_DAYS),
          currentPeriodStart: null,
          currentPeriodEnd: null,
          graceEndsAt: null,
          includedSeats: MONTHLY_BASE_SEATS,
          extraSeats: 0,
          cancelAtPeriodEnd: false,
        };
    return this.prisma.subscription.create({
      data: { ...fields, signature: signSubscriptionFields(fields) },
    });
  }

  private async getBangladeshFreeState(factoryId: string): Promise<EffectiveSubscriptionState> {
    const subscription = await this.getOrCreateSubscriptionRow(factoryId, "Bangladesh");

    const tampered = !verifySubscriptionSignature(subscription, subscription.signature);
    if (tampered) {
      return {
        status: "CANCELLED",
        isAccessAllowed: false,
        daysUntilExpiry: null,
        tampered: true,
        includedSeats: null,
        extraSeats: null,
        seatsUsed: null,
        canAddMoreUsers: false,
      };
    }

    const seatsUsed = await this.countActiveUsers(factoryId);
    return {
      status: "FREE_REGIONAL",
      isAccessAllowed: true,
      daysUntilExpiry: null,
      tampered: false,
      ...this.seatFields(subscription, seatsUsed),
    };
  }

  // An OptiFabric representative can grant any factory (Bangladeshi or
  // foreign) extra seats beyond its normal free/approval-gated ceiling, after
  // confirming payment offline (no payment gateway exists yet — see
  // SEATS_ALLOWED_BEFORE_APPROVAL in subscription.types.ts). Gated by
  // PlatformRepGuard at the controller layer, not by factory-scoped auth,
  // since a representative acts across factories rather than as a member of
  // any one tenant. Additive only (no "remove seats" path — not requested).
  // Also used internally by AuthService.approvePendingUser to grant the one
  // seat a held signup was waiting on.
  async grantExtraSeats(
    factoryCode: string,
    additionalSeats: number,
    note?: string,
  ): Promise<EffectiveSubscriptionState> {
    if (!Number.isInteger(additionalSeats) || additionalSeats < 1) {
      throw new BadRequestException("additionalSeats must be a positive integer.");
    }

    const factory = await this.prisma.factory.findUnique({ where: { factoryCode } });
    if (!factory) {
      throw new NotFoundException(`No factory found with code "${factoryCode}".`);
    }

    const existing = await this.getOrCreateSubscriptionRow(factory.id, factory.country);
    const newExtraSeats = existing.extraSeats + additionalSeats;
    const fields: SignableFields = {
      factoryId: factory.id,
      planType: existing.planType,
      status: existing.status,
      trialEndsAt: existing.trialEndsAt,
      currentPeriodStart: existing.currentPeriodStart,
      currentPeriodEnd: existing.currentPeriodEnd,
      graceEndsAt: existing.graceEndsAt,
      includedSeats: existing.includedSeats,
      extraSeats: newExtraSeats,
      cancelAtPeriodEnd: existing.cancelAtPeriodEnd,
    };
    const subscription = await this.prisma.subscription.update({
      where: { factoryId: factory.id },
      data: { ...fields, signature: signSubscriptionFields(fields) },
    });

    await this.prisma.auditEvent.create({
      data: {
        factoryId: factory.id,
        entityName: "Subscription",
        entityId: subscription.id,
        actionType: "REP_GRANTED_EXTRA_SEATS",
        performedBy: "platform:representative",
        detailsJson: { factoryCode, additionalSeats, newExtraSeats, note: note ?? null },
      },
    });

    // Built directly from the just-updated row rather than re-fetched — avoids a
    // redundant round trip, since we already have the post-update seat counts.
    const seatsUsed = await this.countActiveUsers(factory.id);
    return this.computeEffectiveState({ ...subscription }, new Date(), seatsUsed);
  }

  async getEffectiveState(factoryId: string): Promise<EffectiveSubscriptionState> {
    // Free for factories registered in Bangladesh — 3 seats included permanently,
    // no trial countdown. Extra seats beyond 3 are billed offline by a
    // representative (see grantExtraSeats above).
    const factory = await this.prisma.factory.findUnique({ where: { id: factoryId } });
    if (factory && isBangladeshFactory(factory.country)) {
      return this.getBangladeshFreeState(factoryId);
    }

    const subscription = await this.prisma.subscription.findUnique({ where: { factoryId } });
    return this.computeEffectiveState(subscription, new Date());
  }

  // Maintenance sweep — intended to run on a schedule. Persists the
  // GRACE_PERIOD -> EXPIRED transition and writes an AuditEvent, so the audit
  // trail records exactly when access was actually cut off.
  async sweepExpiredGracePeriods(): Promise<number> {
    const now = new Date();
    const candidates = await this.prisma.subscription.findMany({
      where: { status: { in: ["ACTIVE", "GRACE_PERIOD"] } },
    });

    let expiredCount = 0;
    for (const subscription of candidates) {
      const effective = this.computeEffectiveState(subscription, now);
      if (effective.status === "EXPIRED" && subscription.status !== "EXPIRED") {
        const fields: SignableFields = { ...subscription, status: "EXPIRED" };
        await this.prisma.subscription.update({
          where: { factoryId: subscription.factoryId },
          data: { status: "EXPIRED", signature: signSubscriptionFields(fields) },
        });
        await this.prisma.auditEvent.create({
          data: {
            factoryId: subscription.factoryId,
            entityName: "Subscription",
            entityId: subscription.id,
            actionType: "SUBSCRIPTION_AUTO_CANCELLED_AFTER_GRACE_PERIOD",
            performedBy: "system:subscription-sweep",
            detailsJson: { graceEndsAt: subscription.graceEndsAt },
          },
        });
        expiredCount += 1;
      } else if (effective.status === "GRACE_PERIOD" && subscription.status === "ACTIVE") {
        const graceEndsAt = addDays(subscription.currentPeriodEnd as Date, GRACE_PERIOD_DAYS);
        const fields: SignableFields = { ...subscription, status: "GRACE_PERIOD", graceEndsAt };
        await this.prisma.subscription.update({
          where: { factoryId: subscription.factoryId },
          data: { status: "GRACE_PERIOD", graceEndsAt, signature: signSubscriptionFields(fields) },
        });
      }
    }
    this.logger.log(`Subscription sweep: ${expiredCount} subscription(s) auto-cancelled after grace period.`);
    return expiredCount;
  }
}
