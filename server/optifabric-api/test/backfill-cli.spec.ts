// Stage 2H-1 — coverage for the backfill script's argv-parsing safety
// contract (parseBackfillCliArgs), tested in complete isolation from
// EntitlementBackfillService, Nest, and any database. Importing the script
// module here does NOT boot the application or connect to anything: main()
// only runs when the script is the actual entry point (`require.main ===
// module`), which is never true when this file imports it as a module.
import { parseBackfillCliArgs } from "../scripts/backfill-optifabric-entitlements";

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
