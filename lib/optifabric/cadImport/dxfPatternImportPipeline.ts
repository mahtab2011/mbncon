/**
 * OptiFabric AI
 * RC5-005-010 — DXF Pattern Import Pipeline (Step 5B §1, §16)
 *
 * Purpose:
 * - The single orchestration entry point tying together every isolated
 *   module in lib/optifabric/cadImport/ into:
 *     DXF text -> dxf-parser -> entity extraction -> garment semantics
 *     -> per-piece canonicalisation -> Import Validation Gate
 *     -> ImportedPatternSet
 * - NOT wired into the live marker page. NOT consumed by
 *   patternGeometryEngine.ts. This is Step 5B's complete, self-contained
 *   output — a future Step 5C+ adapter would map ImportedPatternSet onto
 *   PatternGeometryResult (or a justified extension of it), which is
 *   explicitly out of scope here.
 *
 * Known scope limitation (reported, not hidden): this pipeline currently
 * treats each DXF file as containing exactly ONE piece — the largest
 * closed contour found. Splitting a multi-piece-per-file DXF into several
 * ImportedPatternPiece entries is not implemented; every test fixture in
 * testFixtures/ is therefore a single-piece file. See the Step 5B report.
 */

import DxfParser, { type IDxf } from "dxf-parser";

import { extractDrawing, type ExtractedDrawing } from "./dxfEntityExtraction";
import {
  selectOuterContour,
  classifyPoints,
  findGrainline,
  extractTextEvidence,
  type OuterContourCandidate,
} from "./garmentSemanticsExtraction";
import { classifyPairMirror, classifyQuantity } from "./pairMirrorAndQuantity";
import { detectUnitFromDxfHeader } from "./unitDetection";
import {
  canonicalisePoints,
  computeRawBounds,
  type RawCadPoint,
} from "./coordinateCanonicalisation";
import {
  validateImportedPiece,
  type ImportValidationResult,
} from "./importValidationGate";
import {
  checkFileSize,
  checkEntityCount,
  checkVertexCount,
} from "./dxfSecurityLimits";
import type {
  ImportedPatternPiece,
  ImportedPatternSet,
  CadUnitState,
  ImportedNotch,
  ImportedDrillPoint,
  ImportedGrainline,
  ImportedInternalLine,
} from "./importedPatternSetTypes";

export interface DxfImportPieceResult {
  readonly piece: ImportedPatternPiece | null;
  readonly validation: ImportValidationResult;
}

export interface DxfImportResult {
  readonly success: boolean;
  /** Populated only when success is true. */
  readonly patternSet: ImportedPatternSet | null;
  readonly pieceResults: ReadonlyArray<DxfImportPieceResult>;
  readonly fatalError: string | null;
}

function buildGrainlineResult(
  raw: { start: RawCadPoint; end: RawCadPoint } | null,
  unit: NonNullable<CadUnitState["unit"]>,
  referenceBounds: { minX: number; minY: number; maxY: number }
): ImportedGrainline | undefined {
  if (!raw) {
    return undefined;
  }

  const canonical = canonicalisePoints([raw.start, raw.end], unit, referenceBounds);

  if (canonical.points.length < 2) {
    return undefined;
  }

  const [start, end] = canonical.points;
  const vector = { x: end.x - start.x, y: end.y - start.y };
  const angleDegrees = (Math.atan2(vector.y, vector.x) * 180) / Math.PI;

  return { start, end, vector, angleDegrees, source: "layerConvention" };
}

function buildPiece(
  outerContourRaw: OuterContourCandidate,
  drawing: ExtractedDrawing,
  unit: NonNullable<CadUnitState["unit"]>,
  pieceIndex: number
): { piece: ImportedPatternPiece; issues: string[] } {
  const bounds = computeRawBounds(outerContourRaw.points);

  const canonicalOuter = canonicalisePoints(outerContourRaw.points, unit);

  const referenceBounds = {
    minX: bounds.minX,
    minY: bounds.minY,
    maxY: bounds.maxY,
  };

  const classifiedPoints = classifyPoints(drawing.points, outerContourRaw);
  const grainlineRaw = findGrainline(drawing);
  const textEvidence = extractTextEvidence(drawing.texts, outerContourRaw);
  const pairMirror = classifyPairMirror(textEvidence, drawing.inserts);
  const quantityEvidence = classifyQuantity(textEvidence);

  const notches: ImportedNotch[] = classifiedPoints.notches.map((point) => ({
    position: canonicalisePoints([point.position], unit, referenceBounds).points[0],
    source: "layerConvention",
  }));

  const drillPoints: ImportedDrillPoint[] = classifiedPoints.drillPoints.map(
    (point) => ({
      position: canonicalisePoints([point.position], unit, referenceBounds).points[0],
      source: "layerConvention",
    })
  );

  const internalLines: ImportedInternalLine[] = drawing.polylines
    .filter((polyline) => polyline.points !== outerContourRaw.points)
    .filter((polyline) => polyline.layer !== outerContourRaw.layer)
    .map((polyline) => ({
      vertices: canonicalisePoints(polyline.points, unit, referenceBounds).points,
      layer: polyline.layer,
    }));

  const grainLine = buildGrainlineResult(grainlineRaw, unit, referenceBounds);

  const piece: ImportedPatternPiece = {
    pieceId: `piece-${pieceIndex + 1}`,
    pieceCode: undefined,
    pieceName: textEvidence.pieceName,
    size: textEvidence.size,
    cutQuantity: quantityEvidence.cutQuantity,
    outerContour: canonicalOuter.points,
    internalLines,
    notches,
    drillPoints,
    grainLine,
    pairMirror,
    sourceMetadata: {
      layer: outerContourRaw.layer,
      nearbyAnnotations: textEvidence.allNearbyText,
    },
    widthCm: canonicalOuter.widthCm,
    heightCm: canonicalOuter.heightCm,
    areaCm2: polygonAreaCm2(canonicalOuter.points),
  };

  return { piece, issues: [] };
}

function polygonAreaCm2(points: ReadonlyArray<{ x: number; y: number }>): number {
  let doubled = 0;

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    doubled += current.x * next.y - next.x * current.y;
  }

  return Math.abs(doubled) / 2;
}

export interface DxfImportOptions {
  readonly fileName: string;
  readonly fileSizeBytes: number;
}

export function importDxfPatternFile(
  dxfText: string,
  options: DxfImportOptions
): DxfImportResult {
  const sizeViolation = checkFileSize(options.fileSizeBytes);

  if (sizeViolation) {
    return {
      success: false,
      patternSet: null,
      pieceResults: [],
      fatalError: sizeViolation.message,
    };
  }

  let dxf: IDxf | null;

  try {
    const parser = new DxfParser();
    dxf = parser.parseSync(dxfText);
  } catch (error) {
    return {
      success: false,
      patternSet: null,
      pieceResults: [],
      fatalError: `DXF parsing failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }

  if (!dxf) {
    return {
      success: false,
      patternSet: null,
      pieceResults: [],
      fatalError: "DXF parser returned no result (malformed file).",
    };
  }

  const entityCountViolation = checkEntityCount(dxf.entities?.length ?? 0);

  if (entityCountViolation) {
    return {
      success: false,
      patternSet: null,
      pieceResults: [],
      fatalError: entityCountViolation.message,
    };
  }

  const drawing = extractDrawing(dxf);

  for (const polyline of drawing.polylines) {
    const violation = checkVertexCount(
      `A ${polyline.closed ? "closed" : "open"} polyline on layer "${polyline.layer}"`,
      polyline.points.length
    );

    if (violation) {
      return {
        success: false,
        patternSet: null,
        pieceResults: [],
        fatalError: violation.message,
      };
    }
  }

  const unit = detectUnitFromDxfHeader(dxf.header as Record<string, unknown>);

  const outerContour = selectOuterContour(drawing);

  if (!outerContour) {
    const validation = validateImportedPiece({
      outerContour: null,
      unit,
      widthCm: 0,
      heightCm: 0,
    });

    return {
      success: false,
      patternSet: null,
      pieceResults: [{ piece: null, validation }],
      fatalError: null,
    };
  }

  // Unit must be resolved to build canonical centimetre geometry at all.
  // When unit confidence is not "detected", canonicalisation still runs
  // using a 1:1 passthrough (treated as already-centimetre) SOLELY so the
  // validation gate can report real (if provisionally-scaled) dimensions
  // alongside the unitUnconfirmed issue — the gate result, not this
  // fallback, is what prevents the piece from being treated as trustworthy.
  const resolvedUnit = unit.unit ?? "cm";

  const { piece } = buildPiece(outerContour, drawing, resolvedUnit, 0);

  const validation = validateImportedPiece({
    outerContour: piece.outerContour,
    unit,
    cutQuantity: piece.cutQuantity,
    widthCm: piece.widthCm,
    heightCm: piece.heightCm,
  });

  if (validation.outcome === "IMPORT_REJECTED") {
    return {
      success: false,
      patternSet: null,
      pieceResults: [{ piece, validation }],
      fatalError: null,
    };
  }

  const patternSet: ImportedPatternSet = {
    sourceFormat: "dxf",
    sourceFileName: options.fileName,
    unit,
    style: undefined,
    pieces: [piece],
    sourceMetadata: {
      dxfVersion: undefined,
      layerNames: drawing.layerNames,
      blockNames: drawing.blockNames,
      totalEntityCount: drawing.totalEntityCount,
    },
  };

  return {
    success: true,
    patternSet,
    pieceResults: [{ piece, validation }],
    fatalError: null,
  };
}
