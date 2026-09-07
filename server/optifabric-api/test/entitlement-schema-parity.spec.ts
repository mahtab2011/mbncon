// PHASE 2A (Issue 4) — enforces that the local entitlement Prisma schema
// mirror (server/optifabric-api/prisma/entitlement/schema.prisma) never
// silently drifts from the authoritative schema
// (server/entitlement-api/prisma/schema.prisma). Runs as part of the
// ordinary `npm test` suite — see scripts/entitlement-schema-parity.ts for
// the shared comparator logic and the full rationale.
//
// This reads entitlement-api's schema.prisma as plain TEXT via fs — it
// does NOT import anything from entitlement-api, so it carries none of the
// cross-package `@prisma/client` resolution risk documented in
// docs/PHASE-2-ENTITLEMENT-CUTOVER.md.
import * as fs from "fs";
import * as path from "path";
import {
  AUTHORITATIVE_SCHEMA_PATH,
  MIRROR_SCHEMA_PATH,
  extractModelsAndEnums,
} from "../scripts/entitlement-schema-parity";

const DRIFTED_FIXTURE_PATH = path.resolve(__dirname, "fixtures/drifted-entitlement-schema.prisma");

describe("entitlement schema mirror parity", () => {
  it("13. the optifabric-api mirror is model-for-model identical to the authoritative entitlement-api schema", () => {
    const authoritative = extractModelsAndEnums(fs.readFileSync(AUTHORITATIVE_SCHEMA_PATH, "utf8"));
    const mirror = extractModelsAndEnums(fs.readFileSync(MIRROR_SCHEMA_PATH, "utf8"));

    expect(mirror).toBe(authoritative);
  });

  it("14. the comparator actually detects drift (proof against a deliberately-mismatched fixture)", () => {
    const authoritative = extractModelsAndEnums(fs.readFileSync(AUTHORITATIVE_SCHEMA_PATH, "utf8"));
    const drifted = extractModelsAndEnums(fs.readFileSync(DRIFTED_FIXTURE_PATH, "utf8"));

    expect(drifted).not.toBe(authoritative);
  });

  it("normalization ignores the intentionally-different generator/datasource blocks (output path, env var name)", () => {
    const authoritativeRaw = fs.readFileSync(AUTHORITATIVE_SCHEMA_PATH, "utf8");
    const mirrorRaw = fs.readFileSync(MIRROR_SCHEMA_PATH, "utf8");

    // Sanity check that the raw files really do differ here — otherwise
    // this test would prove nothing about the normalization step.
    expect(authoritativeRaw).not.toBe(mirrorRaw);
    expect(authoritativeRaw).toContain('env("DATABASE_URL")');
    expect(mirrorRaw).toContain('env("ENTITLEMENT_DATABASE_URL")');

    expect(extractModelsAndEnums(authoritativeRaw)).not.toContain("generator");
    expect(extractModelsAndEnums(mirrorRaw)).not.toContain("generator");
    expect(extractModelsAndEnums(mirrorRaw)).not.toContain("ENTITLEMENT_DATABASE_URL");
  });

  it("normalization is insensitive to comments and whitespace formatting (only structure matters)", () => {
    const a = extractModelsAndEnums("model Foo {\n  id String // a comment\n}\n");
    const b = extractModelsAndEnums("model Foo {   id   String   \n\n}");
    expect(a).toBe(b);

    const c = extractModelsAndEnums("model Foo { id String }");
    const d = extractModelsAndEnums("model Foo { id Int }");
    expect(c).not.toBe(d);
  });
});
