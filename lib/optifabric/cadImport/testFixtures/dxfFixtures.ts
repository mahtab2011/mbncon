/**
 * OptiFabric AI
 * RC5-005-012 — DXF Test Fixtures (Step 5B §12)
 *
 * ============================================================
 * ENGINEERING TEST FIXTURES — NOT REAL FACTORY CAD.
 * ============================================================
 * Every constant below is a hand-authored, standards-compliant ASCII DXF
 * string, used only to exercise this module's own parser/canonicalisation/
 * validation code. None of these are digitised real garment patterns, and
 * passing these tests does NOT establish compatibility with any commercial
 * CAD system's actual export files. See the Step 5B report.
 */

import {
  dxfDocument,
  dxfLwpolyline,
  dxfLine,
  dxfArc,
  dxfCircle,
  dxfPoint,
  dxfText,
  dxfMtext,
  dxfInsert,
  dxfSpline,
  dxfSolid,
} from "./dxfFixtureBuilder";

/* ============================================================================
 * Garment-shaped piece fixtures (representative simplified shapes, same
 * spirit as markerOptimisationRealPatternFixtures.ts's honesty disclaimer —
 * these are NOT traced from a real pattern block).
 * ========================================================================== */

/** Simple rectangular body panel, 52 x 70 cm. */
export const FIXTURE_TSHIRT_BODY = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0 },
        { x: 52, y: 0 },
        { x: 52, y: 70 },
        { x: 0, y: 70 },
      ],
      true,
      "CUTTING"
    ),
  ],
  "cm"
);

/**
 * Tapered sleeve panel with a curved sleeve cap (bulge on the top edge).
 * DXF bulge is stored on the vertex a segment STARTS from — the bulge
 * belongs on (22,20) to curve the (22,20)->(2,20) top edge, not on (2,20)
 * itself (which would curve the side edge instead).
 */
export const FIXTURE_SLEEVE_WITH_CURVED_HEAD = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0 },
        { x: 24, y: 0 },
        { x: 22, y: 20, bulge: 0.35 },
        { x: 2, y: 20 },
      ],
      true,
      "CUTTING"
    ),
  ],
  "cm"
);

/** Trouser front-leg panel with a curved crotch corner (bulge). */
export const FIXTURE_TROUSER_LEG_WITH_CROTCH_CURVE = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0 },
        { x: 40, y: 0 },
        { x: 40, y: 95 },
        { x: 28, y: 105, bulge: 0.4 },
        { x: 0, y: 105 },
      ],
      true,
      "CUTTING"
    ),
  ],
  "cm"
);

/** Simple collar band with one slightly concave edge (negative bulge). */
export const FIXTURE_COLLAR = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0, bulge: -0.15 },
        { x: 40, y: 0 },
        { x: 40, y: 6 },
        { x: 0, y: 6 },
      ],
      true,
      "CUTTING"
    ),
  ],
  "cm"
);

/** Small rectangular pocket bag with two notches, one drill point, and a grainline. */
export const FIXTURE_POCKET = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0 },
        { x: 14, y: 0 },
        { x: 14, y: 16 },
        { x: 0, y: 16 },
      ],
      true,
      "CUTTING"
    ),
    dxfPoint({ x: 3, y: 16 }, "NOTCH"),
    dxfPoint({ x: 11, y: 16 }, "NOTCH"),
    dxfPoint({ x: 7, y: 8 }, "DRILL"),
    dxfLine({ x: 7, y: 2 }, { x: 7, y: 14 }, "GRAINLINE"),
    dxfText("POCKET", { x: 5, y: 9 }, "TEXT"),
    dxfText("CUT 2", { x: 5, y: 11 }, "TEXT"),
    dxfText("M", { x: 5, y: 13 }, "TEXT"),
  ],
  "cm"
);

/* ============================================================================
 * Unit / dimensional round-trip fixtures (Step 5B §13)
 * ========================================================================== */

/** 600mm x 300mm rectangle — must canonicalise to 60cm x 30cm. */
export const FIXTURE_RECTANGLE_MM = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0 },
        { x: 600, y: 0 },
        { x: 600, y: 300 },
        { x: 0, y: 300 },
      ],
      true
    ),
  ],
  "mm"
);

/** 60cm x 30cm rectangle — must canonicalise to the same 60cm x 30cm. */
export const FIXTURE_RECTANGLE_CM = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0 },
        { x: 60, y: 0 },
        { x: 60, y: 30 },
        { x: 0, y: 30 },
      ],
      true
    ),
  ],
  "cm"
);

/** 10in x 5in rectangle — must canonicalise to exactly 25.4cm x 12.7cm. */
export const FIXTURE_RECTANGLE_INCH = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 5 },
        { x: 0, y: 5 },
      ],
      true
    ),
  ],
  "in"
);

/** Same numeric coordinates as FIXTURE_RECTANGLE_CM, but NO $INSUNITS header at all. */
export const FIXTURE_RECTANGLE_MISSING_UNITS = dxfDocument([
  dxfLwpolyline(
    [
      { x: 0, y: 0 },
      { x: 60, y: 0 },
      { x: 60, y: 30 },
      { x: 0, y: 30 },
    ],
    true
  ),
]);

/** Same 60x70 rectangle, but authored with negative source coordinates. */
export const FIXTURE_RECTANGLE_NEGATIVE_COORDS = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: -30, y: -20 },
        { x: 30, y: -20 },
        { x: 30, y: 50 },
        { x: -30, y: 50 },
      ],
      true
    ),
  ],
  "cm"
);

/* ============================================================================
 * Edge-case / rejection fixtures (Step 5B §12, §18)
 * ========================================================================== */

/** An OPEN 4-point path — no closing segment. Must be rejected as "openContour". */
export const FIXTURE_OPEN_CONTOUR = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0 },
        { x: 20, y: 0 },
        { x: 20, y: 20 },
        { x: 0, y: 20 },
      ],
      false
    ),
  ],
  "cm"
);

/**
 * A closed but self-intersecting "bowtie" quadrilateral. Must be rejected
 * as "selfIntersecting". Deliberately ASYMMETRIC — a perfectly symmetric
 * bowtie's two lobes cancel in the shoelace-formula net area, triggering
 * "zeroArea" instead (also a correct rejection, but not the one this fixture
 * is meant to isolate); this shape's net area is 20 cm^2, non-zero, so the
 * self-intersection check is what actually fires.
 */
export const FIXTURE_SELF_INTERSECTING = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0 },
        { x: 10, y: 6 },
        { x: 10, y: 0 },
        { x: 0, y: 10 },
      ],
      true
    ),
  ],
  "cm"
);

/** A single SOLID entity — a real, dxf-parser-recognised entity type this importer does not extract geometry from. Must be tracked as unsupported without crashing, and (with no closed contour present) rejected as missing an outer contour. */
export const FIXTURE_UNSUPPORTED_ENTITY = dxfDocument(
  [dxfSolid({ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 })],
  "cm"
);

/** Not valid DXF at all — must fail gracefully (a caught parse error), never throw uncaught or hang. */
export const FIXTURE_MALFORMED_FILE = "this is not a dxf file\nit is just text\n%%%garbage%%%";

/* ============================================================================
 * Entity-coverage micro-fixtures (Step 5B §4) — one entity type each,
 * exercised directly against extractDrawing(), not the full pipeline.
 * ========================================================================== */

export const FIXTURE_ENTITY_LINE = dxfDocument(
  [dxfLine({ x: 0, y: 0 }, { x: 10, y: 5 })],
  "cm"
);

export const FIXTURE_ENTITY_ARC = dxfDocument(
  [dxfArc({ x: 0, y: 0 }, 5, 0, 90)],
  "cm"
);

export const FIXTURE_ENTITY_CIRCLE = dxfDocument(
  [dxfCircle({ x: 0, y: 0 }, 3)],
  "cm"
);

export const FIXTURE_ENTITY_POINT = dxfDocument(
  [dxfPoint({ x: 1, y: 1 })],
  "cm"
);

export const FIXTURE_ENTITY_TEXT = dxfDocument(
  [dxfText("SIZE M", { x: 0, y: 0 })],
  "cm"
);

export const FIXTURE_ENTITY_MTEXT = dxfDocument(
  [dxfMtext("STYLE: TROUSER-01", { x: 0, y: 0 })],
  "cm"
);

/** Non-rational cubic B-spline, 5 control points, gently curved. */
export const FIXTURE_ENTITY_SPLINE = dxfDocument(
  [
    dxfSpline([
      { x: 0, y: 0 },
      { x: 5, y: 8 },
      { x: 10, y: 10 },
      { x: 15, y: 8 },
      { x: 20, y: 0 },
    ]),
  ],
  "cm"
);

export const FIXTURE_ENTITY_INSERT_MIRRORED = dxfDocument(
  [dxfInsert("SLEEVE-BLOCK", { x: 0, y: 0 }, -1, 1)],
  "cm"
);

/** A dedicated bulge=1 exact-semicircle case, used to verify flattenBulgePolyline's arc-centre derivation empirically. */
export const FIXTURE_BULGE_SEMICIRCLE = dxfDocument(
  [
    dxfLwpolyline(
      [
        { x: 0, y: 0, bulge: 1 },
        { x: 2, y: 0 },
      ],
      false
    ),
  ],
  "cm"
);
