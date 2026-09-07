// Standard passport-jwt strategy, Bearer-token extraction only (no cookies —
// matching OptiSewing's CSRF decision: no CSRF mechanism, no cookie-based auth).
// Rejects revoked tokens via the RevokedTokenRecord ledger (jti-based check).
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { JwtPayload } from "./auth.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const secret = process.env.JWT_SECRET;
        if (!secret || secret.length < 64) {
          throw new Error("Fail-closed startup check: JWT_SECRET must be at least 64 characters.");
        }
        return secret;
      })(),
    });
  }

  async validate(payload: JwtPayload) {
    if (await this.authService.isRevoked(payload.jti)) {
      throw new UnauthorizedException("Token has been revoked.");
    }
    return {
      userId: payload.sub,
      factoryId: payload.factoryId,
      role: payload.role,
      jti: payload.jti,
    };
  }
}
