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

// Stage 1B — Project core-field bounds. fabricWidth/scaleLength are user-
// entered inches (see app/optifabric/project/new/page.tsx); generous upper
// bounds well above any real fabric roll or calibration reference length.
// orderQuantity is a whole garment count; generous upper bound well above
// any real bulk order.
export const MAX_FABRIC_WIDTH = 1_000;
export const MAX_SCALE_LENGTH = 1_000;
export const MAX_ORDER_QUANTITY = 10_000_000;

// Stage 2A — cap on CreateProjectDto.patterns' array length. A real garment
// pattern set (lib/optifabric/projectMaster.ts's defaultPatternLibrary) is
// at most a few dozen pieces; 500 is generous headroom for custom/complex
// garments while still rejecting a pathological submission.
export const MAX_INITIAL_PATTERNS = 500;

// Stage 2C-2 — FabricProfile bounds. Widths/repeats are centimetre values
// (unlike Project.fabricWidth's own inches) — 1,000 cm is far beyond any
// real fabric roll or print repeat, same "generous safety ceiling, not a
// business rule" role MAX_FABRIC_WIDTH already plays for Project. Marker
// length can legitimately run to tens of metres (see
// MAXIMUM_MARKER_LENGTH_OPTIONS in fabricProfileTypes.ts, up to 50 m); 100
// m of headroom keeps the same generous-ceiling intent.
export const MAX_FABRIC_PROFILE_WIDTH_CM = 1_000;
export const MAX_FABRIC_PROFILE_MARKER_LENGTH_CM = 10_000;
export const MAX_FABRIC_PROFILE_PERCENT = 100;
