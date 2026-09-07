// PHASE 2A (Issue 4) — deterministic drift detection between the two
// entitlement Prisma schemas, without relying on developer memory.
//
// AUTHORITATIVE SCHEMA: server/entitlement-api/prisma/schema.prisma
// CLIENT MIRROR:        server/optifabric-api/prisma/entitlement/schema.prisma
//
// The mirror MUST stay model-for-model identical to the authoritative
// schema — see that file's own header comment for why it exists as a copy
// at all (a confirmed `tsc` module-resolution collision between two
// identically-named generated `@prisma/client` packages; full writeup in
// docs/PHASE-2-ENTITLEMENT-CUTOVER.md). The two files are ALLOWED to
// differ in exactly two respects, which this comparator deliberately
// ignores: the `generator` block (different `output` path) and the
// `datasource` block (different env var name for the connection string —
// both must still point at the SAME database at deploy time, but that's an
// operational fact, not something a text diff can check). Everything else
// — every model, field, enum, and constraint — must match exactly.
//
// This is pure text/string logic with zero Prisma-generated-type
// dependencies, so it is safe to import from both a plain script (this
// file) and a Jest test (test/entitlement-schema-parity.spec.ts) without
// any risk of the `tsc` cross-package collision the mirror itself exists
// to avoid.
import * as fs from "fs";
import * as path from "path";

export const AUTHORITATIVE_SCHEMA_PATH = path.resolve(
  __dirname,
  "../../entitlement-api/prisma/schema.prisma",
);
export const MIRROR_SCHEMA_PATH = path.resolve(__dirname, "../prisma/entitlement/schema.prisma");

/**
 * Strips `//` line comments, `/* *\/` block comments, and the `generator`/
 * `datasource` blocks (see module doc comment for why those are excluded),
 * then collapses all whitespace to single spaces and trims. What remains
 * is just the models/enums, normalized enough that formatting differences
 * (blank lines, indentation, trailing whitespace) never register as drift
 * — only an actual structural change does.
 */
export function extractModelsAndEnums(schemaText: string): string {
  let text = schemaText;
  text = text.replace(/\/\/[^\n]*/g, "");
  text = text.replace(/\/\*[\s\S]*?\*\//g, "");
  text = text.replace(/generator\s+\w+\s*\{[^}]*\}/g, "");
  text = text.replace(/datasource\s+\w+\s*\{[^}]*\}/g, "");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

export interface SchemaParityResult {
  matches: boolean;
  authoritativePath: string;
  mirrorPath: string;
  authoritativeNormalized: string;
  mirrorNormalized: string;
}

export function checkEntitlementSchemaParity(
  authoritativePath: string = AUTHORITATIVE_SCHEMA_PATH,
  mirrorPath: string = MIRROR_SCHEMA_PATH,
): SchemaParityResult {
  const authoritativeNormalized = extractModelsAndEnums(fs.readFileSync(authoritativePath, "utf8"));
  const mirrorNormalized = extractModelsAndEnums(fs.readFileSync(mirrorPath, "utf8"));
  return {
    matches: authoritativeNormalized === mirrorNormalized,
    authoritativePath,
    mirrorPath,
    authoritativeNormalized,
    mirrorNormalized,
  };
}

// Runnable directly: `npx ts-node scripts/entitlement-schema-parity.ts`.
// Exits 1 on drift so it can be wired into CI, a pre-commit hook, or run
// manually before a deploy — separate from (and in addition to) the Jest
// test, which is what actually enforces this during `npm test`.
if (require.main === module) {
  const result = checkEntitlementSchemaParity();
  if (result.matches) {
    console.log("OK: entitlement schema mirror matches the authoritative schema (generator/datasource excluded).");
    process.exit(0);
  } else {
    console.error("DRIFT DETECTED between the authoritative entitlement schema and its optifabric-api mirror.");
    console.error(`Authoritative: ${result.authoritativePath}`);
    console.error(`Mirror:        ${result.mirrorPath}`);
    console.error("Normalized authoritative text:\n" + result.authoritativeNormalized);
    console.error("Normalized mirror text:\n" + result.mirrorNormalized);
    process.exit(1);
  }
}
