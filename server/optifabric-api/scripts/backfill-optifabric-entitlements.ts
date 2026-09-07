// PHASE 2A — one-off, explicitly-authorized admin/developer backfill entry
// point for EntitlementBackfillService.backfillOptiFabricEntitlements().
// See docs/PHASE-2A-MAPPING-BACKFILL-HARDENING.md, "Backfill tool", for the
// full design rationale and the report shape this prints.
//
// ============================================================================
// THIS SCRIPT HAS NOT BEEN RUN. Per instruction, no backfill was executed
// against any database (production or otherwise) as part of Phase 2A — this
// is the tool, built and unit-tested (test/entitlement-backfill.spec.ts)
// against fixtures/mocks only, ready for a deliberate, separately-authorized
// invocation later.
// ============================================================================
//
// Deliberately a script, not an HTTP endpoint (per instruction) — it can
// only be run from a trusted shell with direct access to both database
// connection strings, never triggered by a request.
//
// USAGE (only after explicit authorization to run against a specific
// database — read every line of the safety checklist below first):
//   DATABASE_URL=... ENTITLEMENT_DATABASE_URL=... \
//     npx ts-node scripts/backfill-optifabric-entitlements.ts
//
// SAFETY CHECKLIST before ever running this for real:
//   1. Confirm DATABASE_URL and ENTITLEMENT_DATABASE_URL point at the
//      environment you actually intend to backfill (never point either at
//      production without a deliberate, separate decision to do so).
//   2. Take a database backup/snapshot first — this script only ever
//      CREATES ProductEntitlement rows (see the service's own doc comment:
//      idempotent, never updates or deletes an existing row), but a backup
//      before any migration-adjacent operation is standard practice.
//   3. Run it once, read the printed report, and use
//      EntitlementOnboardingService.identifyLegacyBangladeshFreeFactories-style
//      reporting (the report's legacyBangladeshFreeDetected count) to
//      separately decide on a real backfill once a trusted Bangladesh
//      Apparel registration/eligibility signal exists (NOT marketplace
//      verification, and never a self-declared country field) —
//      this script never grants BANGLADESH_FREE itself.
//   4. Re-running it is always safe (idempotent) if step 3 needs repeating.
import * as path from "path";
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: path.resolve(process.cwd(), ".env") });

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { EntitlementBackfillService } from "../src/entitlement/entitlement-backfill.service";

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ["log", "warn", "error"] });
  try {
    const service = app.get(EntitlementBackfillService);
    const report = await service.backfillOptiFabricEntitlements();
    console.log(JSON.stringify(report, null, 2));
    if (report.errors.length > 0) {
      console.error(`Backfill completed with ${report.errors.length} error(s) — see the "errors" array above.`);
      process.exitCode = 1;
    }
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error("Backfill script failed:", err);
    process.exit(1);
  });
}
