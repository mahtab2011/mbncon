// Phase 4D: registered globally (see app.module.ts) so authentication runs
// BEFORE SubscriptionGuard — request.user must already be populated by the
// time entitlement is evaluated, otherwise SubscriptionGuard's own "defer to
// JwtAuthGuard" branch (`if (!user) return true`) silently skips the
// entitlement check entirely (the Stage 4B/4C bug). This guard's own JWT
// verification logic is unchanged — it still delegates entirely to
// Passport's "jwt" strategy (JwtStrategy); only routes explicitly marked
// @SkipJwtAuth() bypass it, exactly the way @SkipSubscriptionCheck() lets a
// route bypass SubscriptionGuard.
//
// @SkipJwtAuth() is intentionally a SEPARATE decorator from
// @SkipSubscriptionCheck() — the two mean different things. A route can be
// authenticated-but-entitlement-exempt (e.g. subscription status/cancel:
// @SkipSubscriptionCheck() only) or genuinely unauthenticated/authenticated
// by a different mechanism entirely (signup, login, health, and the
// PlatformRepGuard-only routes: @SkipJwtAuth()). Reusing one decorator for
// both would either wrongly make an entitlement-exempt route public, or
// wrongly require a JWT on a PlatformRepGuard-only route.
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

export const SKIP_JWT_AUTH_KEY = "skipJwtAuth";
export const SkipJwtAuth = () => SetMetadata(SKIP_JWT_AUTH_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_JWT_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    return super.canActivate(context);
  }
}
