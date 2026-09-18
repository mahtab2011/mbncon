// Stage 2H-1 — coverage for the backfill script's argv-parsing safety
// contract (parseBackfillCliArgs), tested in complete isolation from
// EntitlementBackfillService, Nest, and any database. Importing the script
// module here does NOT boot the application or connect to anything: main()
// only runs when the script is the actual entry point (`require.main ===
// module`), which is never true when this file imports it as a module.
import { parseBackfillCliArgs } from "../scripts/backfill-optifabric-entitlements";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

describe("parseBackfillCliArgs (Stage 2H-1 CLI safety contract)", () => {
  it("A. no argument defaults to dry-run", () => {
    expect(parseBackfillCliArgs([])).toEqual({ mode: "dry-run" });
  });

  it("--dry-run explicitly requests dry-run", () => {
    expect(parseBackfillCliArgs(["--dry-run"])).toEqual({ mode: "dry-run" });
  });

  it("--apply requests real mutation mode", () => {
    expect(parseBackfillCliArgs(["--apply"])).toEqual({ mode: "apply" });
  });

  it("D. an unknown argument fails closed with an error result, not a mode", () => {
    const result = parseBackfillCliArgs(["--force"]);
    expect(result.mode).toBe("error");
    expect((result as { mode: "error"; message: string }).message).toContain("--force");
  });

  it("D. an unknown argument alongside a recognized one still fails closed", () => {
    const result = parseBackfillCliArgs(["--apply", "--yolo"]);
    expect(result.mode).toBe("error");
  });

  it("E. --dry-run and --apply together fail closed, never silently picking one", () => {
    const result = parseBackfillCliArgs(["--dry-run", "--apply"]);
    expect(result.mode).toBe("error");
    expect((result as { mode: "error"; message: string }).message).toMatch(/conflicting/i);
  });

  it("E. order does not matter for the conflicting-flags case", () => {
    expect(parseBackfillCliArgs(["--apply", "--dry-run"]).mode).toBe("error");
  });

  it("repeating the same recognized flag is not itself an error", () => {
    expect(parseBackfillCliArgs(["--apply", "--apply"])).toEqual({ mode: "apply" });
    expect(parseBackfillCliArgs(["--dry-run", "--dry-run"])).toEqual({ mode: "dry-run" });
  });

  it("never returns 'apply' unless --apply is literally present", () => {
    // Guards against a future regression that infers apply from anything
    // other than the exact --apply flag (e.g. an environment variable, a
    // truthy NODE_ENV, or a positional argument).
    const noApplyCases: string[][] = [[], ["--dry-run"], ["production"], ["APPLY"], ["apply"]];
    for (const argv of noApplyCases) {
      const result = parseBackfillCliArgs(argv);
      expect(result.mode).not.toBe("apply");
    }
  });
});

// Stage 2H-3 — proves the COMPILED artifact (produced by `npm run
// build:backfill-script` / `npm run build`, see tsconfig.scripts.json)
// enforces the exact same fail-closed contract as the .ts source above, run
// as a real, separate `node` process. This is deliberately the ONLY thing
// tested against the compiled artifact here: an invalid flag and a
// conflicting-flags case, both of which parseBackfillCliArgs guarantees
// exit before NestFactory.createApplicationContext is ever called — so
// neither of these spawned processes attempts a database connection,
// regardless of what DATABASE_URL/ENTITLEMENT_DATABASE_URL happen to be set
// to in this environment. A valid dry-run or --apply invocation is
// deliberately never exercised here — that would boot Nest and dial a real
// database, which no automated test in this repository does.
describe("compiled artifact fail-closed behavior (Stage 2H-3)", () => {
  const compiledPath = path.resolve(__dirname, "..", "dist", "scripts", "backfill-optifabric-entitlements.js");
  const artifactExists = fs.existsSync(compiledPath);

  function runCompiled(args: string[]) {
    // 10s is generous for an argv-parsing failure that should return in
    // milliseconds; it exists only to fail the test loudly (rather than
    // hang the suite) if a future change accidentally lets invalid input
    // reach the Nest bootstrap / a real connection attempt.
    return spawnSync(process.execPath, [compiledPath, ...args], { encoding: "utf8", timeout: 10_000 });
  }

  // Skips (rather than fails) when the artifact hasn't been built yet —
  // `npm test` does not itself invoke `npm run build`, and this suite
  // should not fail for an unrelated, easily-fixed prerequisite. Validation
  // for this stage always runs `npm run build` first specifically so these
  // tests execute for real; see the Stage 2H-3 report.
  (artifactExists ? it : it.skip)(
    "an unknown flag exits non-zero before Nest/database bootstrap",
    () => {
      const result = runCompiled(["--invalid-test-flag"]);
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("Unknown argument(s): --invalid-test-flag");
      expect(result.stderr).toContain("No database connection was attempted and no writes occurred.");
      // The DRY RUN / APPLY MODE banner only ever prints after a valid mode
      // is established, immediately before the Nest bootstrap — its
      // absence here is itself evidence bootstrap never happened.
      expect(result.stdout).not.toMatch(/DRY RUN|APPLY MODE/);
    },
  );

  (artifactExists ? it : it.skip)(
    "--dry-run and --apply together exit non-zero before Nest/database bootstrap",
    () => {
      const result = runCompiled(["--dry-run", "--apply"]);
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("Conflicting arguments");
      expect(result.stderr).toContain("No database connection was attempted and no writes occurred.");
      expect(result.stdout).not.toMatch(/DRY RUN|APPLY MODE/);
    },
  );

  if (!artifactExists) {
    console.warn(
      `Stage 2H-3 compiled-artifact tests skipped: ${compiledPath} does not exist. Run "npm run build" (or "npm run build:backfill-script") first.`,
    );
  }
});
