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
import { Inject, Injectable, OnModuleDestroy, Provider } from "@nestjs/common";
import * as path from "node:path";
// Type-only: elided from emitted JS, so this relative path is only ever
// resolved by tsc against the SOURCE tree at compile time (where it's
// correct, two levels up from src/entitlement/) — it never affects runtime
// module resolution below.
import type { PrismaClient as EntitlementPrismaClientType } from "../../node_modules/.prisma-entitlement-client";

// The VALUE import cannot use the same static relative path: after `nest
// build`, this file runs from somewhere under dist/ (the exact depth has
// already changed once — dist/src/entitlement/ before tsconfig.build.json
// was added to scope `nest build` to src/ only, dist/entitlement/ after —
// see docs/DEPLOYMENT-READINESS.md), so a relative "../../"-style path
// would break the moment that depth changes again, throwing
// MODULE_NOT_FOUND. Since this file has no fixed
// depth relative to the package root once compiled (unlike the type import
// above, which tsc always resolves from source), resolve it instead from
// process.cwd() — the repo's start commands (`nest start`/`nest build`
// output, and the backfill script's documented `ts-node scripts/...` usage)
// are always run from server/optifabric-api, so this is stable regardless
// of dist/'s internal layout or direct ts-node source execution.
const entitlementClientPath = path.join(
  process.cwd(),
  "node_modules",
  ".prisma-entitlement-client",
);

const { PrismaClient: EntitlementPrismaClient } = require(entitlementClientPath) as {
  PrismaClient: typeof EntitlementPrismaClientType;
};

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
  useFactory: (): EntitlementPrismaClientType =>
    new EntitlementPrismaClient({
      datasources: { db: { url: requireEntitlementDatabaseUrl() } },
    }),
};

// Stage A2: entitlementPrismaProvider is a plain value factory, so it can't
// implement OnModuleDestroy itself. Nest providers are singletons by
// default, so this injects the SAME client instance every other consumer
// gets (OrganisationResolverService, EntitlementDecisionService, etc.) —
// this class adds nothing to that shape, it only closes the connection when
// the app shuts down (see main.ts's enableShutdownHooks()).
@Injectable()
export class EntitlementPrismaLifecycle implements OnModuleDestroy {
  constructor(@Inject(ENTITLEMENT_PRISMA) private readonly client: EntitlementPrismaClientType) {}

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}

export type { EntitlementPrismaClientType as EntitlementPrismaClient };
