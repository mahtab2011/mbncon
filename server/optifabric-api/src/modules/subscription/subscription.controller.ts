import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotImplementedException,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { SkipJwtAuth } from "../auth/jwt-auth.guard";
import { SkipSubscriptionCheck } from "../../common/guards/subscription.guard";
import { PlatformRepGuard } from "../../common/guards/platform-rep.guard";
import { SubscriptionService } from "./subscription.service";
import { AuthenticatedUser } from "../auth/auth.types";
import { isAtLeastManager } from "../../common/role-tier";
import {
  ANNUAL_BASE_PRICE_CENTS,
  ANNUAL_BASE_SEATS,
  ANNUAL_EXTRA_SEAT_PRICE_CENTS,
  BD_EXTRA_SEAT_PRICE_CENTS,
  BD_INCLUDED_FREE_SEATS,
  MONTHLY_BASE_PRICE_CENTS,
  MONTHLY_BASE_SEATS,
  MONTHLY_EXTRA_SEAT_PRICE_CENTS,
} from "./subscription.types";

@Controller("subscription")
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // Public pricing info — must remain reachable even for an expired/cancelled
  // tenant, so the user can see what to buy. Free permanently for factories
  // registered in Bangladesh (checked dynamically per-factory by
  // SubscriptionService.getEffectiveState() from Factory.country); the terms
  // below apply to factories outside Bangladesh.
  @SkipJwtAuth()
  @SkipSubscriptionCheck()
  @Get("pricing")
  getPricing() {
    return {
      monthly: {
        baseSeats: MONTHLY_BASE_SEATS,
        basePriceCents: MONTHLY_BASE_PRICE_CENTS,
        extraSeatPriceCents: MONTHLY_EXTRA_SEAT_PRICE_CENTS,
      },
      annual: {
        baseSeats: ANNUAL_BASE_SEATS,
        basePriceCents: ANNUAL_BASE_PRICE_CENTS,
        extraSeatPriceCents: ANNUAL_EXTRA_SEAT_PRICE_CENTS,
      },
      trialDays: 90,
      gracePeriodDays: 7,
      bangladeshFree: true,
      bangladeshIncludedSeats: BD_INCLUDED_FREE_SEATS,
      bangladeshExtraSeatPriceCents: BD_EXTRA_SEAT_PRICE_CENTS,
      bangladeshNote:
        `Free, permanently, for any factory registered in Bangladesh — ${BD_INCLUDED_FREE_SEATS} users included at no ` +
        `charge, no trial countdown. Once you're satisfied, extra users beyond ${BD_INCLUDED_FREE_SEATS} are ` +
        `$5.00/user/month (or the equivalent in Bangladeshi Taka), billed by your OptiFabric Bangladesh ` +
        "representative — not through the online plans below, which apply to factories outside Bangladesh.",
      languageNote:
        "Available in Bangla by default. Translation into any other language can be arranged for factories outside Bangladesh — please contact us.",
      contact: "contact@bangladeshapparel.com",
    };
  }

  // JwtAuthGuard is now the global APP_GUARD (see app.module.ts) — no
  // per-route @UseGuards(JwtAuthGuard) needed; JWT is still required, only
  // entitlement enforcement is skipped.
  @SkipSubscriptionCheck()
  @Get("status")
  async getStatus(@Req() request: Request) {
    const user = request.user as AuthenticatedUser;
    return this.subscriptionService.getEffectiveState(user.factoryId);
  }

  // SECURITY: deliberately fails closed for every caller. There is no
  // payment gateway yet, so nothing here may derive a paid subscription or
  // extraSeats from client-supplied data — see subscription.service.ts's
  // activateSubscription() doc comment and the incident this patch
  // addresses. Online activation is not implemented; a factory activates a
  // paid plan only through the rep-gated POST /subscription/grant-seats
  // (PlatformRepGuard), after payment is confirmed offline. The global
  // JwtAuthGuard (app.module.ts) still runs on this route, so an
  // unauthenticated caller gets a normal 401 rather than this message.
  @SkipSubscriptionCheck()
  @Post("activate")
  activate(): never {
    throw new NotImplementedException(
      "Online subscription activation is not available yet. Please contact OptiFabric to activate a paid plan.",
    );
  }

  @SkipSubscriptionCheck()
  @Post("cancel")
  async cancel(@Req() request: Request) {
    const user = request.user as AuthenticatedUser;
    if (!isAtLeastManager(user.role)) {
      throw new BadRequestException("Cancelling a subscription requires a manager or executive role.");
    }
    return this.subscriptionService.cancelAtPeriodEnd(user.factoryId);
  }

  // An OptiFabric representative grants any factory (Bangladeshi or foreign)
  // extra seats after confirming payment offline. Gated by PlatformRepGuard (a
  // shared server-only secret) rather than a factory-scoped JWT, since a
  // representative is not a member of any one tenant — so this route must
  // skip the global JWT guard.
  @SkipJwtAuth()
  @SkipSubscriptionCheck()
  @UseGuards(PlatformRepGuard)
  @Post("grant-seats")
  async grantExtraSeats(@Body() body: { factoryCode: string; additionalSeats: number; note?: string }) {
    return this.subscriptionService.grantExtraSeats(body.factoryCode, body.additionalSeats, body.note);
  }
}
