// PHASE 2A — one-off, explicitly-authorized admin/developer backfill entry
// point for EntitlementBackfillService.backfillOptiFabricEntitlements().
// See docs/PHASE-2A-MAPPING-BACKFILL-HARDENING.md, "Backfill tool", for the
// full design rationale and the report shape this prints.
//
// ============================================================================
// THIS SCRIPT HAS NOT BEEN RUN AGAINST ANY REAL DATABASE. No backfill has
// been executed against production or staging — this is the tool, built and
// unit-tested (test/entitlement-backfill.spec.ts) against fixtures/mocks
// only, ready for a deliberate, separately-authorized invocation later.
// ============================================================================
//
// Stage 2H-1 — SAFE-BY-DEFAULT CLI CONTRACT:
//   no argument   -> DRY RUN (identical to --dry-run)
//   --dry-run     -> DRY RUN: runs the full eligibility/classification/
//                    planning logic and prints an accurate preview report,
//                    but performs ZERO Organisation/OrganisationExternalRef/
//                    ProductEntitlement writes.
//   --apply       -> REAL MUTATION MODE: performs the writes a dry-run only
//                    previews.
//   anything else (unknown flags, or --dry-run and --apply together)
//                 -> FAILS CLOSED: non-zero exit, no NestFactory bootstrap,
//                    no database connection attempted, no writes.
//
// Mode is decided EXCLUSIVELY from argv (see parseBackfillCliArgs below) —
// never from an environment variable. There is no way to authorize mutation
// except literally typing --apply on the command line.
//
// Deliberately a script, not an HTTP endpoint (per instruction) — it can
// only be run from a trusted shell with direct access to both database
// connection strings, never triggered by a request.
//
// USAGE — LOCAL DEVELOPMENT (ts-node, a devDependency, is available):
//   npx ts-node scripts/backfill-optifabric-entitlements.ts            # safe preview, no writes
//   npx ts-node scripts/backfill-optifabric-entitlements.ts --dry-run  # same, explicit
//   npx ts-node scripts/backfill-optifabric-entitlements.ts --apply    # REAL WRITES — see checklist below
//
// USAGE — DEPLOYED / RENDER RUNTIME (Stage 2H-3): ts-node is a devDependency
// and is not installed when Render (or any host) runs `npm install` under
// NODE_ENV=production — see docs/DEPLOYMENT-READINESS.md's "Correction"
// note, which fixed the exact same class of problem for the Nest CLI
// earlier. Rather than promoting ts-node to a real dependency just for this
// one script, `npm run build` now also compiles this file to plain
// JavaScript via tsconfig.scripts.json, requiring nothing beyond the
// runtime `node` binary already used to run the whole service:
//   node dist/scripts/backfill-optifabric-entitlements.js             # safe preview, no writes
//   node dist/scripts/backfill-optifabric-entitlements.js --dry-run   # same, explicit
//   node dist/scripts/backfill-optifabric-entitlements.js --apply     # REAL WRITES — see checklist below
// (equivalently: npm run backfill:optifabric-entitlements:compiled:dry-run / :apply)
// This is the SAME source file and the SAME parseBackfillCliArgs/
// EntitlementBackfillService logic as the ts-node path above — compiling it
// does not create a second implementation, only a second way to run the one
// that already exists. Requires `npm run build` (or at minimum `npm run
// build:backfill-script`) to have already produced dist/scripts/ — if that
// path doesn't exist yet, run the build first.
//
// ==================== --apply WRITES TO A REAL DATABASE ====================
// SAFETY CHECKLIST before ever running with --apply:
//   1. Confirm DATABASE_URL and ENTITLEMENT_DATABASE_URL point at the
//      environment you actually intend to backfill (never point either at
//      production without a deliberate, separate decision to do so).
//   2. Run WITHOUT --apply first (or with --dry-run) and read the preview
//      report — it reflects the exact same classification --apply would
//      act on against the same source state.
//   3. Take a database backup/snapshot before running with --apply — this
//      script only ever CREATES ProductEntitlement rows (see the service's
//      own doc comment: idempotent, never updates or deletes an existing
//      row), but a backup before any migration-adjacent operation is
//      standard practice.
//   4. Use the preview/report's legacyBangladeshFreeDetected count to
//      separately decide on a real Bangladesh backfill once a trusted
//      Bangladesh Apparel registration/eligibility signal exists (NOT
//      marketplace verification, and never a self-declared country field)
//      — this script never grants BANGLADESH_FREE itself, in either mode.
//   5. Re-running with --apply is always safe (idempotent) if step 4 needs
//      repeating — an already-backfilled factory is skipped, never touched.
// ============================================================================
import * as path from "path";
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: path.resolve(process.cwd(), ".env") });

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../src/app.module";
import { EntitlementBackfillService } from "../src/entitlement/entitlement-backfill.service";

export type BackfillCliResult =
  | { mode: "dry-run" }
  | { mode: "apply" }
  | { mode: "error"; message: string };

const RECOGNIZED_FLAGS = new Set(["--dry-run", "--apply"]);

// Pure, dependency-free argv parser — no Nest, no Prisma, no environment
// variables read. Exported so it can be unit-tested in complete isolation
// (see test/backfill-cli.spec.ts) without booting the application or
// touching any database, and so `main()` below is the only place that ever
// turns "apply" into a real write.
export function parseBackfillCliArgs(argv: string[]): BackfillCliResult {
  const unknown = argv.filter((arg) => !RECOGNIZED_FLAGS.has(arg));
  if (unknown.length > 0) {
    return {
      mode: "error",
      message: `Unknown argument(s): ${unknown.join(", ")}. Recognized flags: --dry-run, --apply.`,
    };
  }

  const hasDryRun = argv.includes("--dry-run");
  const hasApply = argv.includes("--apply");

  if (hasDryRun && hasApply) {
    return { mode: "error", message: "Conflicting arguments: --dry-run and --apply cannot both be specified." };
  }

  if (hasApply) return { mode: "apply" };

  // No argument, or --dry-run explicitly given — both mean the same safe
  // default.
  return { mode: "dry-run" };
}

async function main() {
  const parsed = parseBackfillCliArgs(process.argv.slice(2));

  if (parsed.mode === "error") {
    // Reflects however this file was actually invoked (ts-node against the
    // .ts source in local development, or plain `node` against the
    // Stage 2H-3 compiled artifact in a deployed runtime — see
    // tsconfig.scripts.json) rather than hardcoding one form.
    const invokedAs = `node ${path.relative(process.cwd(), process.argv[1] ?? __filename)}`;
    console.error(`Backfill script: ${parsed.message}`);
    console.error(`Usage: ${invokedAs} [--dry-run|--apply]`);
    console.error("No database connection was attempted and no writes occurred.");
    process.exit(1);
    return;
  }

  const dryRun = parsed.mode === "dry-run";

  console.log(
    dryRun
      ? "DRY RUN — previewing the backfill. No Organisation/OrganisationExternalRef/ProductEntitlement rows will be written."
      : "APPLY MODE — this WILL write to the configured entitlement database (DATABASE_URL / ENTITLEMENT_DATABASE_URL).",
  );

  const app = await NestFactory.createApplicationContext(AppModule, { logger: ["log", "warn", "error"] });
  try {
    const service = app.get(EntitlementBackfillService);
    const report = await service.backfillOptiFabricEntitlements({ dryRun });
    console.log(JSON.stringify({ mode: dryRun ? "dry-run" : "apply", ...report }, null, 2));
    if (report.errors.length > 0) {
      console.error(`${dryRun ? "Dry-run" : "Backfill"} completed with ${report.errors.length} error(s) — see the "errors" array above.`);
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
