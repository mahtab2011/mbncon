// Stage 1A hardening — manual-validation bounds (no new validation
// framework/package, matching the rest of this codebase's DTOs).
export const MAX_NAME_LENGTH = 200;
export const MAX_SEQUENCE = 100_000;
export const MAX_CUT_QUANTITY = 100_000;

// Structural safety net on PatternGeometry.polygon, independent of the
// global JSON body-size limit (see main.ts) — bounds the point COUNT rather
// than bytes, so a payload that's small in bytes but structurally absurd
// (tens of thousands of degenerate points) is still rejected. 20,000 is
// generous headroom above even a very detailed traced boundary (see the
// sizing note in main.ts) without duplicating any geometry engine logic —
// this only counts array length.
export const MAX_POLYGON_POINTS = 20_000;
