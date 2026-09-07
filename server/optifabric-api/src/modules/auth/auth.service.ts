// OptiFabric's self-service signup + login, mirroring OptiSewing's
// apps/api/src/modules/auth/auth.service.ts exactly: bcrypt work factor 12,
// JWT_EXPIRATION=7d, Bearer-token auth with a RevokedTokenRecord revocation
// ledger, and the same Bangladesh-free-tier signup rules. Deliberately does NOT
// import SubscriptionService/SubscriptionModule (that would create a circular
// module dependency, since SubscriptionModule imports AuthModule for its
// guards) — it writes the Subscription row directly using the same pure
// signing function SubscriptionService uses.
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { PrismaService } from "../../common/prisma.service";
import { JwtPayload } from "./auth.types";
import { SignableSubscriptionFields, signSubscriptionFields } from "../subscription/subscription-signing";
import {
  BD_INCLUDED_FREE_SEATS,
  isBangladeshFactory,
  MONTHLY_BASE_SEATS,
  SEATS_ALLOWED_BEFORE_APPROVAL,
  TRIAL_PERIOD_DAYS,
} from "../subscription/subscription.types";
import { OrganisationResolverService } from "../../entitlement/organisation-resolver.service";
import { EntitlementOnboardingService } from "../../entitlement/entitlement-onboarding.service";

const BCRYPT_WORK_FACTOR = 12;

export interface SignUpInput {
  factoryCode: string;
  factoryName: string;
  country: string;
  city: string;
  email: string;
  password: string;
  // Only used when joining an *existing* factory (ignored for the founding
  // admin, who is always granted ROLE_FACTORY_ADMIN). Self-declared, not yet
  // reviewed by an existing admin — a known limitation until a user-
  // management/invite flow exists.
  requestedRole?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger("AuthService");

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly organisationResolver: OrganisationResolverService,
    private readonly entitlementOnboarding: EntitlementOnboardingService,
  ) {}

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, BCRYPT_WORK_FACTOR);
  }

  async signUp(input: SignUpInput) {
    if (input.password.length < 8) {
      throw new BadRequestException("Password must be at least 8 characters.");
    }

    // Populated only when this signup creates a brand-new factory — read
    // after the (optifabric-database-only) transaction below commits, to
    // drive central-entitlement onboarding. See onboardNewFactoryEntitlement.
    let newFactoryContext: {
      factoryId: string;
      factoryName: string;
      country: string;
      isBangladesh: boolean;
    } | null = null;

    const result = await this.prisma.$transaction(async (tx) => {
      let factory = await tx.factory.findUnique({ where: { factoryCode: input.factoryCode } });
      let isFoundingAdmin = false;

      if (!factory) {
        factory = await tx.factory.create({
          data: {
            factoryCode: input.factoryCode,
            factoryName: input.factoryName,
            country: input.country,
            city: input.city,
          },
        });
        isFoundingAdmin = true;
      }

      const existingUser = await tx.user.findUnique({
        where: { factoryId_email: { factoryId: factory.id, email: input.email } },
      });
      if (existingUser) {
        throw new ConflictException("An account with this email already exists for this factory.");
      }

      const isBangladesh = isBangladeshFactory(factory.country);

      // No payment gateway exists yet (planned after a 1-2 month trial), so
      // instead of rejecting a signup past the seat limit, ANY factory's first
      // SEATS_ALLOWED_BEFORE_APPROVAL (3) users log in normally — a 4th+ user is
      // still created, but held (isActive=false) until an OptiFabric
      // representative manually approves it (confirming payment was arranged
      // offline) via AuthService.approvePendingUser. Only checked for someone
      // *joining* an existing factory — the founding admin always gets in.
      let requiresApproval = false;
      if (!isFoundingAdmin) {
        const subscription = await tx.subscription.findUnique({ where: { factoryId: factory.id } });
        const extraApprovedSeats = subscription?.extraSeats ?? 0;
        const activeUserCount = await tx.user.count({ where: { factoryId: factory.id, isActive: true } });
        requiresApproval = activeUserCount >= SEATS_ALLOWED_BEFORE_APPROVAL + extraApprovedSeats;
      }

      const passwordHash = await this.hashPassword(input.password);
      const user = await tx.user.create({
        data: {
          factoryId: factory.id,
          email: input.email,
          passwordHash,
          role: isFoundingAdmin ? "ROLE_FACTORY_ADMIN" : (input.requestedRole ?? "ROLE_OPERATIVE"),
          isActive: !requiresApproval,
        },
      });

      // Every new factory gets a Subscription row. Bangladeshi factories get 3
      // free seats and no trial countdown (status FREE_REGIONAL); everyone else
      // gets the normal 90-day trial.
      if (isFoundingAdmin) {
        const fields: SignableSubscriptionFields = isBangladesh
          ? {
              factoryId: factory.id,
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
              factoryId: factory.id,
              planType: "TRIAL",
              status: "TRIALING",
              trialEndsAt: new Date(Date.now() + TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000),
              currentPeriodStart: null,
              currentPeriodEnd: null,
              graceEndsAt: null,
              includedSeats: MONTHLY_BASE_SEATS,
              extraSeats: 0,
              cancelAtPeriodEnd: false,
            };
        await tx.subscription.create({ data: { ...fields, signature: signSubscriptionFields(fields) } });

        newFactoryContext = {
          factoryId: factory.id,
          factoryName: factory.factoryName,
          country: factory.country,
          isBangladesh,
        };
      }

      await tx.auditEvent.create({
        data: {
          factoryId: factory.id,
          entityName: "User",
          entityId: user.id,
          actionType: isFoundingAdmin
            ? "FACTORY_AND_ADMIN_SIGNED_UP"
            : requiresApproval
              ? "USER_SIGNUP_PENDING_APPROVAL"
              : "USER_SIGNED_UP",
          performedBy: user.id,
          detailsJson: { email: input.email, isFoundingAdmin, requiresApproval },
        },
      });

      if (requiresApproval) {
        return {
          status: "PENDING_APPROVAL" as const,
          factoryId: factory.id,
          userId: user.id,
          isFoundingAdmin: false as const,
          message:
            "Your account has been created but needs approval before you can sign in — this factory has " +
            "reached its free/trial seat limit. An OptiFabric representative will review and confirm payment " +
            "before activating it.",
        };
      }

      const { accessToken, tokenType } = await this.issueToken(user);
      return {
        status: "ACTIVE" as const,
        accessToken,
        tokenType,
        factoryId: factory.id,
        userId: user.id,
        role: user.role,
        isFoundingAdmin,
      };
    });

    if (newFactoryContext) {
      await this.onboardNewFactoryEntitlement(newFactoryContext);
    }

    return result;
  }

  // Central-entitlement side effect of a brand-new factory's founding-admin
  // signup. Deliberately runs AFTER the optifabric-database transaction
  // above has already committed, not inside it: the entitlement database is
  // a physically separate Postgres database (server/entitlement-api's own),
  // so no single Prisma/Postgres transaction can span both — there is no
  // two-phase-commit here. This is an accepted eventual-consistency
  // tradeoff (see docs/PHASE-2-ENTITLEMENT-CUTOVER.md): if this call fails,
  // the OptiFabric account still exists (the signup itself already
  // succeeded), but SubscriptionGuard will fail closed for that factory
  // until the mapping/trial is retried or backfilled — never the other way
  // around (never "account exists, guard wrongly allows access").
  //
  // Bangladesh factories: mapping only, per the Phase 2 Bangladesh rule —
  // never auto-grants BANGLADESH_FREE from a self-declared country field.
  private async onboardNewFactoryEntitlement(ctx: {
    factoryId: string;
    factoryName: string;
    country: string;
    isBangladesh: boolean;
  }): Promise<void> {
    try {
      const organisationId = await this.organisationResolver.resolveOrCreateOrganisationForOptiFabricFactory(
        ctx.factoryId,
        ctx.factoryName,
        ctx.country,
      );

      if (ctx.isBangladesh) {
        this.entitlementOnboarding.onboardNewBangladeshFactory();
      } else {
        await this.entitlementOnboarding.onboardNewInternationalFactory(organisationId);
      }
    } catch (err) {
      this.logger.error(
        `Central entitlement onboarding failed for factory ${ctx.factoryId}: ${(err as Error).message}. ` +
          "The OptiFabric account was created successfully; entitlement mapping/trial needs to be retried or backfilled.",
      );
    }
  }

  // An OptiFabric representative approves a signup that was held past the
  // free/trial seat limit, after confirming payment was arranged offline (no
  // payment gateway exists yet). Activates the user AND grants the factory one
  // more permanent extra seat (via SubscriptionService.grantExtraSeats's exact
  // update logic, reimplemented here directly to avoid importing
  // SubscriptionService — see the module-level comment on why AuthModule must
  // not import SubscriptionModule).
  async approvePendingUser(userId: string, note?: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`No user found with id "${userId}".`);
      }
      if (user.isActive) {
        throw new BadRequestException("This user is already active.");
      }

      const factory = await tx.factory.findUnique({ where: { id: user.factoryId } });
      if (!factory) {
        throw new NotFoundException(`No factory found for this user.`);
      }

      const existing = await tx.subscription.findUnique({ where: { factoryId: factory.id } });
      const isBangladesh = isBangladeshFactory(factory.country);
      const baseFields: SignableSubscriptionFields = existing
        ? {
            factoryId: factory.id,
            planType: existing.planType,
            status: existing.status,
            trialEndsAt: existing.trialEndsAt,
            currentPeriodStart: existing.currentPeriodStart,
            currentPeriodEnd: existing.currentPeriodEnd,
            graceEndsAt: existing.graceEndsAt,
            includedSeats: existing.includedSeats,
            extraSeats: existing.extraSeats,
            cancelAtPeriodEnd: existing.cancelAtPeriodEnd,
          }
        : isBangladesh
          ? {
              factoryId: factory.id,
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
              factoryId: factory.id,
              planType: "TRIAL",
              status: "TRIALING",
              trialEndsAt: new Date(Date.now() + TRIAL_PERIOD_DAYS * 24 * 60 * 60 * 1000),
              currentPeriodStart: null,
              currentPeriodEnd: null,
              graceEndsAt: null,
              includedSeats: MONTHLY_BASE_SEATS,
              extraSeats: 0,
              cancelAtPeriodEnd: false,
            };

      const fields: SignableSubscriptionFields = { ...baseFields, extraSeats: baseFields.extraSeats + 1 };
      const subscription = await tx.subscription.upsert({
        where: { factoryId: factory.id },
        create: { ...fields, signature: signSubscriptionFields(fields) },
        update: { ...fields, signature: signSubscriptionFields(fields) },
      });

      await tx.user.update({ where: { id: userId }, data: { isActive: true } });

      await tx.auditEvent.create({
        data: {
          factoryId: factory.id,
          entityName: "User",
          entityId: userId,
          actionType: "USER_SIGNUP_APPROVED_BY_REP",
          performedBy: "platform:representative",
          detailsJson: { note: note ?? null, newExtraSeats: subscription.extraSeats },
        },
      });

      return { userId, factoryId: factory.id, extraSeats: subscription.extraSeats };
    });
  }

  async validateCredentials(email: string, factoryId: string, plainPassword: string) {
    const user = await this.prisma.user.findFirst({ where: { email, factoryId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials.");
    }
    const passwordMatches = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    // PHASE 2A hardening (Issue 3): every successful login is also an
    // idempotent entitlement-reconciliation opportunity. If this factory's
    // signup-time onboarding failed or never ran (mapping missing, or an
    // international trial never started), this repairs it here — never by
    // extending an already-existing trial/mapping. See
    // reconcileEntitlementOnboarding's own doc comment and
    // docs/PHASE-2A-MAPPING-BACKFILL-HARDENING.md, "Issue 3", for why this
    // was chosen over a fake cross-database transaction.
    await this.reconcileEntitlementOnboarding(factoryId);

    return user;
  }

  // IDEMPOTENT RECOVERY/RECONCILIATION — Phase 2A. Safe to call on every
  // login, not just once: resolveOrCreateOrganisationForOptiFabricFactory
  // is idempotent (never creates a duplicate mapping), and
  // onboardNewInternationalFactory -> startInternationalTrial is idempotent
  // (a no-op once an entitlement row already exists for either product) —
  // so this can NEVER restart a trial or re-grant something that already
  // exists. It only ever completes work that a prior signup's best-effort
  // onboarding step failed to finish. Never throws: a reconciliation
  // failure must never block a legitimate login (the account already
  // exists); SubscriptionGuard's fail-closed behavior remains the actual
  // safety net for a factory whose reconciliation keeps failing.
  async reconcileEntitlementOnboarding(factoryId: string): Promise<void> {
    try {
      const factory = await this.prisma.factory.findUnique({ where: { id: factoryId } });
      if (!factory) return;

      const isBangladesh = isBangladeshFactory(factory.country);
      const organisationId = await this.organisationResolver.resolveOrCreateOrganisationForOptiFabricFactory(
        factory.id,
        factory.factoryName,
        factory.country,
      );

      if (isBangladesh) {
        this.entitlementOnboarding.onboardNewBangladeshFactory();
      } else {
        await this.entitlementOnboarding.onboardNewInternationalFactory(organisationId);
      }
    } catch (err) {
      this.logger.error(
        `Entitlement reconciliation failed for factory ${factoryId}: ${(err as Error).message}. ` +
          "Access remains fail-closed via SubscriptionGuard until this is retried.",
      );
    }
  }

  async issueToken(user: { id: string; factoryId: string; role: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      factoryId: user.factoryId,
      role: user.role,
      jti: randomUUID(),
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, tokenType: "Bearer" as const };
  }

  async isRevoked(jti: string): Promise<boolean> {
    const revoked = await this.prisma.revokedTokenRecord.findUnique({ where: { tokenJti: jti } });
    return revoked !== null;
  }

  async revokeToken(jti: string, expiresAt: Date) {
    await this.prisma.revokedTokenRecord.upsert({
      where: { tokenJti: jti },
      create: { tokenJti: jti, expiresAt },
      update: {},
    });
  }
}
