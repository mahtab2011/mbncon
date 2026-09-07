/**
 * OptiFabric AI
 * RC5-005-013 — DXF Import Deterministic Validation Suite (Step 5B §18)
 *
 * Purpose:
 * - This repository has no Jest/Vitest test runner (confirmed: package.json
 *   has no test framework dependency). Following the established pattern
 *   already used for the marker optimiser (safeDenseAxisRegressionTest.ts),
 *   this is a plain, dependency-free TypeScript module: each check is a
 *   function returning a structured pass/fail result, collected here and
 *   rendered by a diagnostic page. Deterministic — no randomness, no I/O.
 */

import DxfParser from "dxf-parser";

import { extractDrawing } from "./dxfEntityExtraction";
import { importDxfPatternFile } from "./dxfPatternImportPipeline";
import { classifyPairMirror } from "./pairMirrorAndQuantity";
import { detectUnitFromDxfHeader } from "./unitDetection";
import * as fixtures from "./testFixtures/dxfFixtures";

export interface ValidationCheckResult {
  readonly name: string;
  readonly passed: boolean;
  readonly detail: string;
}

function approxEqual(a: number, b: number, toleranceCm: number): boolean {
  return Math.abs(a - b) <= toleranceCm;
}

function check(
  name: string,
  fn: () => { passed: boolean; detail: string }
): ValidationCheckResult {
  try {
    const result = fn();
    return { name, passed: result.passed, detail: result.detail };
  } catch (error) {
    return {
      name,
      passed: false,
      detail: `Threw: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

const DIMENSION_TOLERANCE_CM = 0.1;

export function runDxfImportValidationSuite(): ReadonlyArray<ValidationCheckResult> {
  const results: ValidationCheckResult[] = [];

  /* ------------------------------ Valid DXF ------------------------------ */

  results.push(
    check("Valid DXF (T-shirt body) imports as one accepted-or-confirmed piece", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_TSHIRT_BODY, {
        fileName: "tshirt-body.dxf",
        fileSizeBytes: fixtures.FIXTURE_TSHIRT_BODY.length,
      });

      const outcome = result.pieceResults[0]?.validation.outcome;

      return {
        passed:
          result.success &&
          result.patternSet?.pieces.length === 1 &&
          (outcome === "IMPORT_ACCEPTED" || outcome === "ENGINEERING_CONFIRMATION_REQUIRED"),
        detail: `success=${result.success}, pieceCount=${result.patternSet?.pieces.length}, outcome=${outcome}`,
      };
    })
  );

  /* --------------------------------- Units -------------------------------- */

  results.push(
    check("600mm rectangle canonicalises to 60cm x 30cm", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_RECTANGLE_MM, {
        fileName: "rect-mm.dxf",
        fileSizeBytes: fixtures.FIXTURE_RECTANGLE_MM.length,
      });

      const piece = result.patternSet?.pieces[0];

      const passed =
        !!piece &&
        approxEqual(piece.widthCm, 60, DIMENSION_TOLERANCE_CM) &&
        approxEqual(piece.heightCm, 30, DIMENSION_TOLERANCE_CM);

      return {
        passed,
        detail: `widthCm=${piece?.widthCm}, heightCm=${piece?.heightCm}`,
      };
    })
  );

  results.push(
    check("60cm rectangle canonicalises to 60cm x 30cm (identity)", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_RECTANGLE_CM, {
        fileName: "rect-cm.dxf",
        fileSizeBytes: fixtures.FIXTURE_RECTANGLE_CM.length,
      });

      const piece = result.patternSet?.pieces[0];

      const passed =
        !!piece &&
        approxEqual(piece.widthCm, 60, DIMENSION_TOLERANCE_CM) &&
        approxEqual(piece.heightCm, 30, DIMENSION_TOLERANCE_CM);

      return { passed, detail: `widthCm=${piece?.widthCm}, heightCm=${piece?.heightCm}` };
    })
  );

  results.push(
    check("10in x 5in rectangle canonicalises to exactly 25.4cm x 12.7cm", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_RECTANGLE_INCH, {
        fileName: "rect-inch.dxf",
        fileSizeBytes: fixtures.FIXTURE_RECTANGLE_INCH.length,
      });

      const piece = result.patternSet?.pieces[0];

      const passed =
        !!piece &&
        approxEqual(piece.widthCm, 25.4, DIMENSION_TOLERANCE_CM) &&
        approxEqual(piece.heightCm, 12.7, DIMENSION_TOLERANCE_CM);

      return { passed, detail: `widthCm=${piece?.widthCm}, heightCm=${piece?.heightCm}` };
    })
  );

  results.push(
    check("Missing $INSUNITS triggers ENGINEERING_CONFIRMATION_REQUIRED, not a silent guess", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_RECTANGLE_MISSING_UNITS, {
        fileName: "rect-no-units.dxf",
        fileSizeBytes: fixtures.FIXTURE_RECTANGLE_MISSING_UNITS.length,
      });

      const validation = result.pieceResults[0]?.validation;

      const passed =
        validation?.outcome === "ENGINEERING_CONFIRMATION_REQUIRED" &&
        validation.issues.some((issue) => issue.code === "unitUnconfirmed");

      return { passed, detail: `outcome=${validation?.outcome}, issues=${JSON.stringify(validation?.issues.map((i) => i.code))}` };
    })
  );

  /* ------------------------- Coordinate canonicalisation ------------------------- */

  results.push(
    check("Negative source coordinates still canonicalise to a piece-local origin with correct dimensions", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_RECTANGLE_NEGATIVE_COORDS, {
        fileName: "rect-negative.dxf",
        fileSizeBytes: fixtures.FIXTURE_RECTANGLE_NEGATIVE_COORDS.length,
      });

      const piece = result.patternSet?.pieces[0];

      const minX = piece ? Math.min(...piece.outerContour.map((p) => p.x)) : NaN;
      const minY = piece ? Math.min(...piece.outerContour.map((p) => p.y)) : NaN;

      const passed =
        !!piece &&
        approxEqual(minX, 0, 1e-6) &&
        approxEqual(minY, 0, 1e-6) &&
        approxEqual(piece.widthCm, 60, DIMENSION_TOLERANCE_CM) &&
        approxEqual(piece.heightCm, 70, DIMENSION_TOLERANCE_CM);

      return {
        passed,
        detail: `minX=${minX}, minY=${minY}, widthCm=${piece?.widthCm}, heightCm=${piece?.heightCm}`,
      };
    })
  );

  /* ---------------------------------- Curves ---------------------------------- */

  results.push(
    check("Bulge=1 (exact semicircle) produces points all equidistant from the true centre", () => {
      const parser = new DxfParser();
      const dxf = parser.parseSync(fixtures.FIXTURE_BULGE_SEMICIRCLE);
      const drawing = extractDrawing(dxf!);

      const polyline = drawing.polylines[0];

      // P1=(0,0), P2=(2,0), bulge=1 => derived centre (1,0), radius 1.
      // Checking every sampled point's distance from that centre (rather
      // than looking for one specific "apex" point) is robust to exactly
      // which parameter values got sampled, and directly validates the
      // bulge->centre/radius derivation itself.
      const expectedCenter = { x: 1, y: 0 };
      const expectedRadius = 1;

      const distances = polyline.points.map((point) =>
        Math.hypot(point.x - expectedCenter.x, point.y - expectedCenter.y)
      );

      const maxDeviation = Math.max(
        ...distances.map((distance) => Math.abs(distance - expectedRadius))
      );

      const passed = polyline.points.length >= 4 && maxDeviation < 0.01;

      return {
        passed,
        detail: `pointCount=${polyline.points.length}, maxRadiusDeviation=${maxDeviation.toFixed(4)}`,
      };
    })
  );

  for (const [label, fixture] of [
    ["Sleeve with curved head", fixtures.FIXTURE_SLEEVE_WITH_CURVED_HEAD],
    ["Trouser leg with crotch curve", fixtures.FIXTURE_TROUSER_LEG_WITH_CROTCH_CURVE],
    ["Collar", fixtures.FIXTURE_COLLAR],
    ["Pocket", fixtures.FIXTURE_POCKET],
  ] as const) {
    results.push(
      check(`${label} imports as one closed, non-zero-area piece`, () => {
        const result = importDxfPatternFile(fixture, {
          fileName: `${label}.dxf`,
          fileSizeBytes: fixture.length,
        });

        const piece = result.patternSet?.pieces[0];

        const passed = !!piece && piece.areaCm2 > 0 && piece.widthCm > 0 && piece.heightCm > 0;

        return {
          passed,
          detail: `areaCm2=${piece?.areaCm2.toFixed(2)}, widthCm=${piece?.widthCm.toFixed(2)}, heightCm=${piece?.heightCm.toFixed(2)}`,
        };
      })
    );
  }

  /* ------------------------------ Rejections ------------------------------ */

  results.push(
    check("Open contour is rejected with code 'openContour'", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_OPEN_CONTOUR, {
        fileName: "open.dxf",
        fileSizeBytes: fixtures.FIXTURE_OPEN_CONTOUR.length,
      });

      const validation = result.pieceResults[0]?.validation;

      const passed =
        !result.success &&
        validation?.outcome === "IMPORT_REJECTED" &&
        validation.issues.some((issue) => issue.code === "openContour");

      return { passed, detail: `outcome=${validation?.outcome}, issues=${JSON.stringify(validation?.issues.map((i) => i.code))}` };
    })
  );

  results.push(
    check("Self-intersecting contour is rejected with code 'selfIntersecting'", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_SELF_INTERSECTING, {
        fileName: "bowtie.dxf",
        fileSizeBytes: fixtures.FIXTURE_SELF_INTERSECTING.length,
      });

      const validation = result.pieceResults[0]?.validation;

      const passed =
        !result.success &&
        validation?.outcome === "IMPORT_REJECTED" &&
        validation.issues.some((issue) => issue.code === "selfIntersecting");

      return { passed, detail: `outcome=${validation?.outcome}, issues=${JSON.stringify(validation?.issues.map((i) => i.code))}` };
    })
  );

  results.push(
    check("Malformed (non-DXF) file fails gracefully with a fatalError, never throws uncaught", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_MALFORMED_FILE, {
        fileName: "garbage.dxf",
        fileSizeBytes: fixtures.FIXTURE_MALFORMED_FILE.length,
      });

      const passed = !result.success && typeof result.fatalError === "string" && result.fatalError.length > 0;

      return { passed, detail: `success=${result.success}, fatalError=${result.fatalError}` };
    })
  );

  results.push(
    check("Unsupported entity (SOLID) is tracked, does not crash, and produces no outer contour", () => {
      const parser = new DxfParser();
      const dxf = parser.parseSync(fixtures.FIXTURE_UNSUPPORTED_ENTITY);
      const drawing = extractDrawing(dxf!);

      const result = importDxfPatternFile(fixtures.FIXTURE_UNSUPPORTED_ENTITY, {
        fileName: "solid.dxf",
        fileSizeBytes: fixtures.FIXTURE_UNSUPPORTED_ENTITY.length,
      });

      const passed =
        drawing.unsupportedEntityTypes.includes("SOLID") &&
        !result.success &&
        result.pieceResults[0]?.validation.issues[0]?.code === "missingOuterContour";

      return {
        passed,
        detail: `unsupportedEntityTypes=${JSON.stringify(drawing.unsupportedEntityTypes)}, success=${result.success}`,
      };
    })
  );

  /* ---------------------------- Entity coverage ---------------------------- */

  const entityFixtures: ReadonlyArray<[string, string]> = [
    ["LINE", fixtures.FIXTURE_ENTITY_LINE],
    ["ARC", fixtures.FIXTURE_ENTITY_ARC],
    ["CIRCLE", fixtures.FIXTURE_ENTITY_CIRCLE],
    ["POINT", fixtures.FIXTURE_ENTITY_POINT],
    ["TEXT", fixtures.FIXTURE_ENTITY_TEXT],
    ["MTEXT", fixtures.FIXTURE_ENTITY_MTEXT],
    ["SPLINE", fixtures.FIXTURE_ENTITY_SPLINE],
    ["INSERT", fixtures.FIXTURE_ENTITY_INSERT_MIRRORED],
  ];

  for (const [entityType, fixtureText] of entityFixtures) {
    results.push(
      check(`Entity coverage: ${entityType} extracts without throwing`, () => {
        const parser = new DxfParser();
        const dxf = parser.parseSync(fixtureText);
        const drawing = extractDrawing(dxf!);

        const hasSomeOutput =
          drawing.lines.length +
            drawing.polylines.length +
            drawing.points.length +
            drawing.texts.length +
            drawing.inserts.length >
          0;

        return {
          passed: hasSomeOutput,
          detail: `lines=${drawing.lines.length}, polylines=${drawing.polylines.length}, points=${drawing.points.length}, texts=${drawing.texts.length}, inserts=${drawing.inserts.length}`,
        };
      })
    );
  }

  /* ------------------------- Grainline, quantity, pair/mirror ------------------------- */

  results.push(
    check("Grainline is extracted from the GRAINLINE layer with a plausible vertical vector", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_POCKET, {
        fileName: "pocket.dxf",
        fileSizeBytes: fixtures.FIXTURE_POCKET.length,
      });

      const grain = result.patternSet?.pieces[0]?.grainLine;

      const passed =
        !!grain && Math.abs(Math.abs(grain.angleDegrees) - 90) < 1;

      return { passed, detail: `grainLine=${JSON.stringify(grain)}` };
    })
  );

  results.push(
    check("Notches and drill points are classified from NOTCH/DRILL layers", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_POCKET, {
        fileName: "pocket.dxf",
        fileSizeBytes: fixtures.FIXTURE_POCKET.length,
      });

      const piece = result.patternSet?.pieces[0];

      const passed = piece?.notches.length === 2 && piece?.drillPoints.length === 1;

      return {
        passed,
        detail: `notches=${piece?.notches.length}, drillPoints=${piece?.drillPoints.length}`,
      };
    })
  );

  results.push(
    check("Cut quantity is extracted from 'CUT 2' annotation text", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_POCKET, {
        fileName: "pocket.dxf",
        fileSizeBytes: fixtures.FIXTURE_POCKET.length,
      });

      const piece = result.patternSet?.pieces[0];

      return {
        passed: piece?.cutQuantity === 2,
        detail: `cutQuantity=${piece?.cutQuantity}`,
      };
    })
  );

  results.push(
    check("Piece with no quantity annotation leaves cutQuantity undefined (never assumed 1)", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_TSHIRT_BODY, {
        fileName: "tshirt-body.dxf",
        fileSizeBytes: fixtures.FIXTURE_TSHIRT_BODY.length,
      });

      const piece = result.patternSet?.pieces[0];

      return {
        passed: piece?.cutQuantity === undefined,
        detail: `cutQuantity=${piece?.cutQuantity}`,
      };
    })
  );

  results.push(
    check("Pair/mirror: negative-scale INSERT is evidenced as mirrored", () => {
      const classified = classifyPairMirror(
        { pieceCode: undefined, pieceName: undefined, size: undefined, allNearbyText: [] },
        [
          {
            blockName: "SLEEVE-BLOCK",
            position: { x: 0, y: 0 },
            rotationDegrees: 0,
            xScale: -1,
            yScale: 1,
            layer: "0",
          },
        ]
      );

      return {
        passed: classified.role === "mirroredPairUnspecifiedSide" && classified.evidenced,
        detail: JSON.stringify(classified),
      };
    })
  );

  results.push(
    check("Pair/mirror: 'LEFT' annotation text is evidenced as a left piece", () => {
      const classified = classifyPairMirror(
        {
          pieceCode: undefined,
          pieceName: undefined,
          size: undefined,
          allNearbyText: ["FRONT LEFT PANEL"],
        },
        []
      );

      return {
        passed: classified.role === "left" && classified.evidenced,
        detail: JSON.stringify(classified),
      };
    })
  );

  results.push(
    check("Pair/mirror: no evidence at all falls back to unevidenced 'single', never a guessed pair", () => {
      const classified = classifyPairMirror(
        { pieceCode: undefined, pieceName: undefined, size: undefined, allNearbyText: [] },
        []
      );

      return {
        passed: classified.role === "single" && classified.evidenced === false,
        detail: JSON.stringify(classified),
      };
    })
  );

  results.push(
    check("Size annotation 'M' is extracted as the piece size", () => {
      const result = importDxfPatternFile(fixtures.FIXTURE_POCKET, {
        fileName: "pocket.dxf",
        fileSizeBytes: fixtures.FIXTURE_POCKET.length,
      });

      const piece = result.patternSet?.pieces[0];

      return { passed: piece?.size === "M", detail: `size=${piece?.size}` };
    })
  );

  /* ------------------------------- Unit detection unit test ------------------------------- */

  results.push(
    check("detectUnitFromDxfHeader resolves $INSUNITS=4 to mm with 'detected' confidence", () => {
      const state = detectUnitFromDxfHeader({ $INSUNITS: 4 });
      return {
        passed: state.unit === "mm" && state.confidence === "detected",
        detail: JSON.stringify(state),
      };
    })
  );

  results.push(
    check("detectUnitFromDxfHeader resolves an unrecognised $INSUNITS code to userConfirmationRequired", () => {
      const state = detectUnitFromDxfHeader({ $INSUNITS: 99 });
      return {
        passed: state.confidence === "userConfirmationRequired",
        detail: JSON.stringify(state),
      };
    })
  );

  return results;
}

export function summariseValidationSuite(results: ReadonlyArray<ValidationCheckResult>): {
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly allPassed: boolean;
} {
  const passed = results.filter((result) => result.passed).length;

  return {
    total: results.length,
    passed,
    failed: results.length - passed,
    allPassed: passed === results.length,
  };
}
