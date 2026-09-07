// Phase 2 integration boundary: OptiFabric talks to the central entitlement
// database via its OWN separately-generated Prisma client (see
// prisma/entitlement/schema.prisma for why — a direct cross-package import
// of entitlement-api's generated client hit a confirmed `tsc`
// module-resolution collision between two identically-named "@prisma/client"
// packages; this local, custom-output-path client sidesteps that entirely).
//
// This is ONE authoritative database, not two: ENTITLEMENT_DATABASE_URL
// must be set to the exact same connection string as entitlement-api's own
// DATABASE_URL at deploy time. See docs/PHASE-2-ENTITLEMENT-CUTOVER.md.
import { Provider } from "@nestjs/common";
import { PrismaClient as EntitlementPrismaClient } from "../../node_modules/.prisma-entitlement-client";

export const ENTITLEMENT_PRISMA = "ENTITLEMENT_PRISMA";

export function requireEntitlementDatabaseUrl(): string {
  const url = process.env.ENTITLEMENT_DATABASE_URL;
  if (!url) {
    // Fail-closed at startup, matching the existing convention in
    // env-validation.config.ts — a missing entitlement database URL must
    // stop the process, not silently degrade to "always deny" at runtime.
    throw new Error(
      "Fail-closed startup check: ENTITLEMENT_DATABASE_URL is required now that " +
        "SubscriptionGuard is backed by central entitlement (see " +
        "docs/PHASE-2-ENTITLEMENT-CUTOVER.md).",
    );
  }
  return url;
}

export const entitlementPrismaProvider: Provider = {
  provide: ENTITLEMENT_PRISMA,
  useFactory: (): EntitlementPrismaClient =>
    new EntitlementPrismaClient({
      datasources: { db: { url: requireEntitlementDatabaseUrl() } },
    }),
};

export type { EntitlementPrismaClient };
