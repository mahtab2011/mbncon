// Every route here is exempt from SubscriptionGuard: a user whose trial/
// subscription has lapsed must still be able to log in (to see the paywall and
// manage billing) and log out.
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthenticatedUser } from "./auth.types";
import { SkipSubscriptionCheck } from "../../common/guards/subscription.guard";
import { PlatformRepGuard } from "../../common/guards/platform-rep.guard";

@SkipSubscriptionCheck()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post("signup")
  async signUp(@Body() body: Parameters<AuthService["signUp"]>[0]) {
    return this.authService.signUp(body);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post("login")
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateCredentials(dto.email, dto.factoryId, dto.password);
    return this.authService.issueToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Req() request: Request) {
    const user = request.user as AuthenticatedUser | undefined;
    if (user) {
      await this.authService.revokeToken(user.jti, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    }
    return { status: "ok" };
  }

  // An OptiFabric representative approves a signup that was held past the
  // free/trial seat limit, after confirming payment was arranged offline (no
  // payment gateway exists yet — see SEATS_ALLOWED_BEFORE_APPROVAL). Gated by
  // PlatformRepGuard rather than a factory-scoped JWT, matching
  // SubscriptionController's grant-seats endpoint.
  @UseGuards(PlatformRepGuard)
  @Post("approve-user")
  async approveUser(@Body() body: { userId: string; note?: string }) {
    return this.authService.approvePendingUser(body.userId, body.note);
  }
}
