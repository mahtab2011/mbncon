/**
 * OptiFabric AI
 * RC5-004-019 — Real-Pattern Validation Fixtures (Step 4)
 *
 * Purpose:
 * - Give the Step 3 benchmark dashboard fixtures shaped like real garment
 *   pattern pieces (front/back panels, sleeves, collars, cuffs, pockets,
 *   waistbands, yokes) instead of only the abstract geometry-stress-test
 *   shapes in markerOptimisationBenchmarkEngine.ts.
 *
 * Honesty note: these are structurally-representative simplified polygon
 * approximations built from realistic garment-industry dimensions and
 * grain/rotation rules — rectangles, tapered trapezoids for sleeves/legs,
 * and simple pentagons for pointed collars. They are NOT digitised real
 * pattern pieces traced from an actual factory block. They exist to exercise
 * the optimiser against garment-shaped proportions (long tapered sleeves,
 * pointed collars, narrow waistbands, curved-crotch leg panels) that the
 * purely synthetic fixtures don't cover, and to give a mixed-size marker a
 * realistic shape to work with.
 */

import type { PolygonPoint } from "@/lib/optifabric/marker/markerPolygonCollisionEngine";

import type { MarkerOptimisationSourcePiece } from "./markerOptimisationOrchestrator";

import type { MarkerOptimisationBenchmarkFixture } from "./markerOptimisationBenchmarkEngine";

/* ============================================================================
 * Shape helpers
 * ========================================================================== */

function rectangle(width: number, height: number): PolygonPoint[] {
  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
}

/** Corner-notched panel — approximates a curved crotch or shaped hem/seam. */
function notchedPanel(width: number, height: number, notch: number): PolygonPoint[] {
  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height - notch },
    { x: width - notch, y: height - notch },
    { x: width - notch, y: height },
    { x: 0, y: height },
  ];
}

/** Right-trapezoid — approximates a tapered sleeve or leg panel: vertical left edge, slanted right edge. */
function taperedPanel(topWidth: number, bottomWidth: number, height: number): PolygonPoint[] {
  return [
    { x: 0, y: 0 },
    { x: topWidth, y: 0 },
    { x: bottomWidth, y: height },
    { x: 0, y: height },
  ];
}

/** Symmetric pentagon with a centred point — approximates a pointed shirt/jacket collar. */
function pointedCollar(width: number, height: number, pointDepth: number): PolygonPoint[] {
  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height - pointDepth },
    { x: width / 2, y: height },
    { x: 0, y: height - pointDepth },
  ];
}

function instance(
  baseId: string,
  count: number,
  build: (index: number) => Omit<MarkerOptimisationSourcePiece, "id">
): MarkerOptimisationSourcePiece[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${baseId}-${index + 1}`,
    ...build(index),
  }));
}

/** Uniformly scales a polygon about its own origin corner — used for mixed-size markers. */
function scalePolygon(polygon: ReadonlyArray<PolygonPoint>, factor: number): PolygonPoint[] {
  return polygon.map((point) => ({ x: point.x * factor, y: point.y * factor }));
}

const FABRIC_WIDTH = 150;
const CUTTING_GAP = 0.5;

/* ============================================================================
 * T-shirt
 * ========================================================================== */

const TSHIRT_FIXTURE: MarkerOptimisationBenchmarkFixture = {
  name: "real-pattern-tshirt",
  description:
    "Basic crew-neck short-sleeve T-shirt: front/back body panels (grain-controlled), 2 tapered sleeves (grain-controlled), and a neckband strip (free rotation, small).",
  fabricWidth: FABRIC_WIDTH,
  cuttingGap: CUTTING_GAP,
  pieces: [
    {
      id: "tshirt-front",
      polygon: notchedPanel(52, 70, 6),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    },
    {
      id: "tshirt-back",
      polygon: rectangle(52, 72),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    },
    ...instance("tshirt-sleeve", 2, () => ({
      polygon: taperedPanel(24, 18, 22),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "sleeve",
    })),
    {
      id: "tshirt-neckband",
      polygon: rectangle(40, 3),
      geometricRotationRule: "free",
      priority: 45,
      category: "trim",
    },
  ],
};

/* ============================================================================
 * Polo shirt
 * ========================================================================== */

const POLO_FIXTURE: MarkerOptimisationBenchmarkFixture = {
  name: "real-pattern-polo",
  description:
    "Polo shirt: front/back body panels, 2 tapered sleeves, a pointed collar, and 2 placket strips.",
  fabricWidth: FABRIC_WIDTH,
  cuttingGap: CUTTING_GAP,
  pieces: [
    {
      id: "polo-front",
      polygon: notchedPanel(54, 72, 6),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    },
    {
      id: "polo-back",
      polygon: rectangle(54, 74),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    },
    ...instance("polo-sleeve", 2, () => ({
      polygon: taperedPanel(25, 19, 23),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "sleeve",
    })),
    {
      id: "polo-collar",
      polygon: pointedCollar(44, 8, 3),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "collar",
    },
    ...instance("polo-placket", 2, () => ({
      polygon: rectangle(4, 20),
      geometricRotationRule: "free",
      priority: 40,
      category: "trim",
    })),
  ],
};

/* ============================================================================
 * Woven shirt (long sleeve, button-up)
 * ========================================================================== */

const WOVEN_SHIRT_FIXTURE: MarkerOptimisationBenchmarkFixture = {
  name: "real-pattern-woven-shirt",
  description:
    "Long-sleeve woven shirt: left/right front panels with placket, back panel plus yoke, 2 long tapered sleeves, pointed collar, collar stand, 2 cuffs and a chest pocket.",
  fabricWidth: FABRIC_WIDTH,
  cuttingGap: CUTTING_GAP,
  pieces: [
    {
      id: "shirt-front-left",
      polygon: rectangle(48, 78),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    },
    {
      id: "shirt-front-right",
      polygon: notchedPanel(48, 78, 5),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    },
    {
      id: "shirt-back",
      polygon: rectangle(52, 70),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    },
    {
      id: "shirt-yoke",
      polygon: rectangle(52, 12),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "body",
    },
    ...instance("shirt-sleeve", 2, () => ({
      polygon: taperedPanel(26, 20, 62),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "sleeve",
    })),
    {
      id: "shirt-collar",
      polygon: pointedCollar(44, 8, 3),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "collar",
    },
    {
      id: "shirt-collar-stand",
      polygon: rectangle(44, 4),
      geometricRotationRule: "free",
      priority: 50,
      category: "collar",
    },
    ...instance("shirt-cuff", 2, () => ({
      polygon: rectangle(24, 7),
      geometricRotationRule: "free",
      priority: 45,
      category: "trim",
    })),
    {
      id: "shirt-pocket",
      polygon: rectangle(13, 14),
      geometricRotationRule: "free",
      priority: 40,
      category: "trim",
    },
  ],
};

/* ============================================================================
 * Trouser
 * ========================================================================== */

const TROUSER_FIXTURE: MarkerOptimisationBenchmarkFixture = {
  name: "real-pattern-trouser",
  description:
    "Basic trouser: 2 front leg panels and 2 back leg panels (grain-controlled, curved-crotch corner notch), a long narrow waistband, 2 pocket bags and a fly piece.",
  fabricWidth: FABRIC_WIDTH,
  cuttingGap: CUTTING_GAP,
  pieces: [
    ...instance("trouser-front-leg", 2, () => ({
      polygon: notchedPanel(40, 105, 10),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 65,
      category: "leg",
    })),
    ...instance("trouser-back-leg", 2, () => ({
      polygon: notchedPanel(42, 108, 12),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 65,
      category: "leg",
    })),
    {
      id: "trouser-waistband",
      polygon: rectangle(90, 6),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "trim",
    },
    ...instance("trouser-pocket-bag", 2, () => ({
      polygon: rectangle(18, 22),
      geometricRotationRule: "free",
      priority: 40,
      category: "trim",
    })),
    {
      id: "trouser-fly",
      polygon: rectangle(8, 15),
      geometricRotationRule: "free",
      priority: 35,
      category: "trim",
    },
  ],
};

/* ============================================================================
 * Jeans (denim trouser — more pieces, directional nap)
 * ========================================================================== */

const JEANS_FIXTURE: MarkerOptimisationBenchmarkFixture = {
  name: "real-pattern-jeans",
  description:
    "Denim jeans: 2 front leg panels and 2 back leg panels (grain-controlled AND directional-fabric — denim twill nap), 2 back yokes, waistband, 2 front pocket bags, 2 back patch pockets, 5 belt loops and a fly facing.",
  fabricWidth: FABRIC_WIDTH,
  cuttingGap: CUTTING_GAP,
  pieces: [
    ...instance("jeans-front-leg", 2, () => ({
      polygon: notchedPanel(42, 100, 10),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      directionalFabric: true,
      priority: 65,
      category: "leg",
    })),
    ...instance("jeans-back-leg", 2, () => ({
      polygon: notchedPanel(44, 102, 12),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      directionalFabric: true,
      priority: 65,
      category: "leg",
    })),
    ...instance("jeans-back-yoke", 2, () => ({
      polygon: notchedPanel(44, 12, 4),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      directionalFabric: true,
      priority: 55,
      category: "body",
    })),
    {
      id: "jeans-waistband",
      polygon: rectangle(88, 6),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "trim",
    },
    ...instance("jeans-front-pocket-bag", 2, () => ({
      polygon: rectangle(16, 20),
      geometricRotationRule: "free",
      priority: 40,
      category: "trim",
    })),
    ...instance("jeans-back-pocket", 2, () => ({
      polygon: notchedPanel(15, 16, 4),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 45,
      category: "trim",
    })),
    ...instance("jeans-belt-loop", 5, () => ({
      polygon: rectangle(3, 10),
      geometricRotationRule: "free",
      priority: 30,
      category: "trim",
    })),
    {
      id: "jeans-fly-facing",
      polygon: rectangle(7, 18),
      geometricRotationRule: "free",
      priority: 35,
      category: "trim",
    },
  ],
};

/* ============================================================================
 * Jacket
 * ========================================================================== */

const JACKET_FIXTURE: MarkerOptimisationBenchmarkFixture = {
  name: "real-pattern-jacket",
  description:
    "Simple unlined jacket: left/right front panels, back panel, back yoke, 2 tapered sleeves, a pointed collar/lapel, 2 front facings and 2 welt-pocket flaps.",
  fabricWidth: FABRIC_WIDTH,
  cuttingGap: CUTTING_GAP,
  pieces: [
    ...instance("jacket-front", 2, () => ({
      polygon: notchedPanel(46, 68, 6),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    })),
    {
      id: "jacket-back",
      polygon: rectangle(50, 70),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: "body",
    },
    {
      id: "jacket-back-yoke",
      polygon: rectangle(50, 10),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "body",
    },
    ...instance("jacket-sleeve", 2, () => ({
      polygon: taperedPanel(28, 22, 60),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: "sleeve",
    })),
    {
      id: "jacket-collar",
      polygon: pointedCollar(50, 14, 5),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      directionalFabric: true,
      priority: 55,
      category: "collar",
    },
    ...instance("jacket-facing", 2, () => ({
      polygon: rectangle(10, 68),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 50,
      category: "trim",
    })),
    ...instance("jacket-pocket-flap", 2, () => ({
      polygon: rectangle(12, 6),
      geometricRotationRule: "free",
      priority: 35,
      category: "trim",
    })),
  ],
};

/* ============================================================================
 * Mixed-size marker: T-shirt in Small / Medium / Large together
 * ========================================================================== */

const TSHIRT_SIZE_SCALE: Record<"S" | "M" | "L", number> = {
  S: 0.92,
  M: 1.0,
  L: 1.1,
};

function scaledTshirtPieces(size: "S" | "M" | "L"): MarkerOptimisationSourcePiece[] {
  const scale = TSHIRT_SIZE_SCALE[size];

  return [
    {
      id: `tshirt-${size}-front`,
      polygon: scalePolygon(notchedPanel(52, 70, 6), scale),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: `body-${size}`,
    },
    {
      id: `tshirt-${size}-back`,
      polygon: scalePolygon(rectangle(52, 72), scale),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 60,
      category: `body-${size}`,
    },
    ...instance(`tshirt-${size}-sleeve`, 2, () => ({
      polygon: scalePolygon(taperedPanel(24, 18, 22), scale),
      geometricRotationRule: "rotate-180",
      grainControlled: true,
      priority: 55,
      category: `sleeve-${size}`,
    })),
    {
      id: `tshirt-${size}-neckband`,
      polygon: scalePolygon(rectangle(40, 3), scale),
      geometricRotationRule: "free",
      priority: 45,
      category: `trim-${size}`,
    },
  ];
}

const MIXED_SIZE_TSHIRT_FIXTURE: MarkerOptimisationBenchmarkFixture = {
  name: "real-pattern-tshirt-mixed-size",
  description:
    "Ratio marker: one T-shirt each in Small, Medium and Large cut together in a single marker — the realistic multi-size scenario cutting rooms use to spread fabric cost across an order's full size run.",
  fabricWidth: FABRIC_WIDTH,
  cuttingGap: CUTTING_GAP,
  pieces: [
    ...scaledTshirtPieces("S"),
    ...scaledTshirtPieces("M"),
    ...scaledTshirtPieces("L"),
  ],
};

export const REAL_PATTERN_BENCHMARK_FIXTURES: ReadonlyArray<MarkerOptimisationBenchmarkFixture> =
  [
    TSHIRT_FIXTURE,
    POLO_FIXTURE,
    WOVEN_SHIRT_FIXTURE,
    TROUSER_FIXTURE,
    JEANS_FIXTURE,
    JACKET_FIXTURE,
    MIXED_SIZE_TSHIRT_FIXTURE,
  ];
