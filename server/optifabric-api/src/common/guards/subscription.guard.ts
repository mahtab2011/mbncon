// Global guard: once a factory's trial or paid period (plus its 7-day grace
// period) has elapsed, every route not explicitly exempted via
// @SkipSubscriptionCheck() returns 402 Payment Required.
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
import { SubscriptionService } from "../../modules/subscription/subscription.service";
import { AuthenticatedUser } from "../../modules/auth/auth.types";

export const SKIP_SUBSCRIPTION_CHECK_KEY = "skipSubscriptionCheck";
export const SkipSubscriptionCheck = () => SetMetadata(SKIP_SUBSCRIPTION_CHECK_KEY, true);

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_SUBSCRIPTION_CHECK_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;
    if (!user) return true;

    const effective = await this.subscriptionService.getEffectiveState(user.factoryId);
    if (!effective.isAccessAllowed) {
      throw new HttpException(
        {
          statusCode: HttpStatus.PAYMENT_REQUIRED,
          message:
            effective.status === "CANCELLED" && effective.tampered
              ? "Subscription record failed integrity verification."
              : "Your free trial or subscription has ended. Please subscribe to continue using OptiFabric.",
          subscriptionStatus: effective.status,
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }
    return true;
  }
}
