/**
 * OptiFabric AI
 * RC5-005-001 — CAD Import Domain Model (Step 5B)
 *
 * Purpose:
 * - Define ImportedPatternSet, the isolated domain model a DXF/AAMA import
 *   pipeline produces, per the Step 5A architecture design.
 * - This is INPUT-SIDE geometry only. Nothing here is consumed by the live
 *   marker page, the nesting engines, the rotation policy engine, or the
 *   Production Safety Gate — none of those are touched by Step 5B.
 * - Every field the source file does not actually supply is `undefined`,
 *   never fabricated. A field being present means the importer found real
 *   evidence for it in the CAD file; it is not a guess.
 *
 * Coordinate/unit contract:
 * - All coordinates on ImportedPatternPiece and its sub-shapes are in the
 *   CANONICAL post-canonicalisation convention: centimetres, piece-local
 *   origin at the outer contour's own bounding-box minimum (matching
 *   patternGeometryEngine.ts's existing convention exactly), Y increasing
 *   toward the piece's hem/lower edge (see coordinateCanonicalisation.ts for
 *   the single place this is decided and why).
 * - Raw/pre-canonicalisation entity data never appears in this type; see
 *   dxfEntityExtraction.ts for the intermediate representation.
 */

export type CadSourceFormat = "dxf";

export type CadUnit = "mm" | "cm" | "in";

export type CadUnitConfidence =
  | "detected"
  | "userConfirmationRequired"
  | "unsupported";

export interface CadUnitState {
  /** The resolved unit ImportedPatternSet's coordinates are expressed in — only meaningful when confidence is "detected". */
  readonly unit: CadUnit | null;

  readonly confidence: CadUnitConfidence;

  /** Raw DXF $INSUNITS numeric code, when the header carried one, for audit/debugging. */
  readonly sourceInsUnitsCode?: number;

  readonly note: string;
}

export interface CanonicalPoint {
  readonly x: number;
  readonly y: number;
}

/** A single notch mark on the outer contour — a point plus the contour direction it was cut from, when known. */
export interface ImportedNotch {
  readonly position: CanonicalPoint;
  readonly source: "layerConvention" | "blockConvention" | "unknown";
}

/** An internal drill/awl mark — not on the outer contour. */
export interface ImportedDrillPoint {
  readonly position: CanonicalPoint;
  readonly source: "layerConvention" | "blockConvention" | "unknown";
}

export interface ImportedGrainline {
  readonly start: CanonicalPoint;
  readonly end: CanonicalPoint;

  /** Derived, not stored redundantly by the source file: end - start. */
  readonly vector: CanonicalPoint;

  /** Derived angle in degrees, 0 = pointing along +X, measured counter-clockwise. */
  readonly angleDegrees: number;

  readonly source: "layerConvention" | "blockConvention" | "unknown";
}

export type CadPairRole =
  | "single"
  | "symmetric"
  | "left"
  | "right"
  | "mirroredPairUnspecifiedSide";

export interface CadPairMirrorMetadata {
  readonly role: CadPairRole;

  /**
   * True only when the source file gave explicit evidence (a mirrored block
   * insert, an explicit left/right layer or text annotation). False does
   * NOT mean "definitely not mirrored" — it means no evidence was found,
   * which is why `role` defaults to "single" rather than guessing.
   */
  readonly evidenced: boolean;

  readonly note: string;
}

export interface ImportedInternalLine {
  readonly vertices: ReadonlyArray<CanonicalPoint>;
  readonly layer: string;
}

export interface CadSourceMetadata {
  readonly layer?: string;
  readonly blockName?: string;
  readonly dxfHandle?: string;
  /** Raw TEXT/MTEXT strings found near or inside this piece — preserved verbatim, not interpreted. */
  readonly nearbyAnnotations: ReadonlyArray<string>;
}

export interface ImportedPatternPiece {
  readonly pieceId: string;

  /** From TEXT/MTEXT/layer/block-name heuristics — undefined when no evidence exists. */
  readonly pieceCode?: string;
  readonly pieceName?: string;
  readonly size?: string;

  /** Undefined, never assumed to be 1 — see Step 4C's cutQuantity honesty precedent. */
  readonly cutQuantity?: number;

  readonly outerContour: ReadonlyArray<CanonicalPoint>;

  readonly internalLines: ReadonlyArray<ImportedInternalLine>;
  readonly notches: ReadonlyArray<ImportedNotch>;
  readonly drillPoints: ReadonlyArray<ImportedDrillPoint>;

  readonly grainLine?: ImportedGrainline;

  readonly pairMirror: CadPairMirrorMetadata;

  readonly sourceMetadata: CadSourceMetadata;

  /** Physical bounding dimensions of outerContour, in centimetres, for quick sanity display. */
  readonly widthCm: number;
  readonly heightCm: number;
  readonly areaCm2: number;
}

export interface ImportedPatternSet {
  readonly sourceFormat: CadSourceFormat;
  readonly sourceFileName: string;

  readonly unit: CadUnitState;

  /** Style/garment name, when a document-level TEXT/MTEXT or block name suggests one. Never fabricated. */
  readonly style?: string;

  readonly pieces: ReadonlyArray<ImportedPatternPiece>;

  readonly sourceMetadata: {
    readonly dxfVersion?: string;
    readonly layerNames: ReadonlyArray<string>;
    readonly blockNames: ReadonlyArray<string>;
    readonly totalEntityCount: number;
  };
}
