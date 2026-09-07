// Extra seats for a Bangladeshi factory (beyond the 3 free ones) are billed
// offline by an OptiFabric Bangladesh representative, not through the online
// activate/cancel flow foreign factories use. There is no per-factory
// "representative" user role in this system (a representative acts across
// factories, not as a tenant member), so this guard checks a shared,
// server-only secret instead of a factory-scoped JWT — same fail-closed
// pattern as LICENSE_SIGNING_SECRET.
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { timingSafeEqual } from "crypto";

export function platformRepApiKey(): string {
  const key = process.env.PLATFORM_REP_API_KEY;
  if (!key || key.length < 64) {
    throw new Error("PLATFORM_REP_API_KEY must be at least 64 characters.");
  }
  return key;
}

@Injectable()
export class PlatformRepGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.header("x-platform-rep-key");
    if (!provided) {
      throw new UnauthorizedException("Missing X-Platform-Rep-Key header.");
    }

    const expected = platformRepApiKey();
    const expectedBuf = Buffer.from(expected, "utf8");
    const providedBuf = Buffer.from(provided, "utf8");
    const matches =
      expectedBuf.length === providedBuf.length && timingSafeEqual(expectedBuf, providedBuf);
    if (!matches) {
      throw new UnauthorizedException("Invalid X-Platform-Rep-Key header.");
    }
    return true;
  }
}
