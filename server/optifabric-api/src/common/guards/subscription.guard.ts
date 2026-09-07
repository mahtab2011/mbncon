// Global guard — PHASE 2: access is now decided by the central entitlement
// system (server/entitlement-api), not the legacy per-factory Subscription
// table. See docs/PHASE-2-ENTITLEMENT-CUTOVER.md for the full design and
// docs/PHASE-2A-MAPPING-BACKFILL-HARDENING.md for the Phase 2A lockout fix
// below.
//
// Decision flow: JWT factoryId -> lazily-resolved organisationId (mapping
// only, never an entitlement) -> EntitlementDecisionService.canAccess ->
// Bangladesh transitional fallback. Every failure mode (missing factoryId,
// no such Factory, no entitlement) FAILS CLOSED (denies access) — this
// guard never defaults to "allowed" on an error or an unresolved lookup,
// except the pre-existing, unchanged behavior of deferring to JwtAuthGuard
// when there is no authenticated user at all (see the `if (!user) return
// true` comment below, carried over unchanged from the legacy guard).
//
// PHASE 2A FIX: Phase 2 originally denied outright when no
// OrganisationExternalRef existed yet, which ran BEFORE the Bangladesh
// legacy-compatibility fallback ever got a chance to apply — an existing
// Bangladesh factory with legitimate FREE_REGIONAL access but no central
// mapping yet was denied before its fallback could engage. Fixed by lazily
// creating the mapping (from a trusted server-side Factory row) BEFORE the
// central/fallback decision, via FactoryOrganisationMappingService. Mapping
// alone never grants anything — see that service's own doc comment.
//
// The legacy SubscriptionService is still used, narrowly, for ONE thing:
// the Bangladesh transitional-compatibility fallback (see
// EntitlementOnboardingService.isEligibleForBangladeshTransitionalAccess) —
// it is NOT the primary decision source anymore.
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { AuthenticatedUser } from "../../modules/auth/auth.types";
import { EntitlementDecisionService } from "../../entitlement/entitlement-decision.service";
import { FactoryOrganisationMappingService } from "../../entitlement/factory-organisation-mapping.service";
import { EntitlementOnboardingService } from "../../entitlement/entitlement-onboarding.service";

export const SKIP_SUBSCRIPTION_CHECK_KEY = "skipSubscriptionCheck";
export const SkipSubscriptionCheck = () => SetMetadata(SKIP_SUBSCRIPTION_CHECK_KEY, true);

function denyAccess(message: string): never {
  throw new HttpException(
    {
      statusCode: HttpStatus.PAYMENT_REQUIRED,
      message,
    },
    HttpStatus.PAYMENT_REQUIRED,
  );
}

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly mapping: FactoryOrganisationMappingService,
    private readonly onboarding: EntitlementOnboardingService,
    private readonly entitlementDecision: EntitlementDecisionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_SUBSCRIPTION_CHECK_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;
    // Unchanged from the legacy guard: no authenticated user on the request
    // means JwtAuthGuard hasn't run (or the route isn't behind it) — this
    // guard defers to that guard's own rejection rather than issuing a
    // confusing "subscription" error for an unauthenticated request.
    if (!user) return true;

    // Fail closed: a JWT without a usable factoryId can never be granted
    // access, regardless of what central/legacy state might say.
    if (!user.factoryId || typeof user.factoryId !== "string") {
      denyAccess("No factory associated with this account.");
    }

    let organisationId: string | null;
    try {
      // Resolves the existing mapping, or lazily creates one from a
      // trusted server-side Factory row if none exists yet — see
      // FactoryOrganisationMappingService's doc comment. This runs BEFORE
      // the central/Bangladesh decision below specifically so an existing
      // Bangladesh factory's transitional fallback (which needs an
      // organisationId to ask "does central entitlement have anything for
      // this org?") is reachable on its very first post-cutover request,
      // not just on later ones — see docs/PHASE-2A-MAPPING-BACKFILL-HARDENING.md.
      organisationId = await this.mapping.resolveOrLazilyMapOrganisation(user.factoryId);
    } catch {
      // Any lookup/creation failure (e.g. the entitlement database is
      // unreachable) fails closed — never treated as "allowed".
      denyAccess("Unable to verify subscription status. Please try again shortly.");
    }

    if (!organisationId) {
      // factoryId does not correspond to any real Factory row — fail
      // closed. (A real, currently-unmapped factory is handled above: it
      // gets mapped on the fly, it never reaches this branch.)
      denyAccess("No factory found for this account.");
    }

    const allowed = await this.entitlementDecision.canAccess(organisationId, "OPTIFABRIC");
    if (allowed) return true;

    const transitional = await this.onboarding.isEligibleForBangladeshTransitionalAccess(
      user.factoryId,
      organisationId,
    );
    if (transitional) return true;

    denyAccess("Your free trial or subscription has ended. Please subscribe to continue using OptiFabric.");
  }
}
