/**
 * OptiFabric AI
 * RC5-005-006 — DXF Entity Extraction (Step 5B §4)
 *
 * Purpose:
 * - Wrap dxf-parser's raw IDxf output into a flat, garment-agnostic
 *   "ExtractedDrawing" — every supported entity converted to a simple
 *   point-based shape, still in RAW DXF units/axes (no canonicalisation
 *   here — see coordinateCanonicalisation.ts for the one place that
 *   happens).
 * - Every entity type dxf-parser can produce is classified below. Unknown
 *   or unhandled entity types are recorded in `unsupportedEntityTypes`
 *   and otherwise ignored — they must never throw or crash the importer.
 *
 * Entity support matrix (see the Step 5B report for the full table):
 *   LINE          SUPPORTED
 *   LWPOLYLINE    SUPPORTED (bulge/arc segments flattened via curveFlattening)
 *   POLYLINE      SUPPORTED (via VERTEX children; bulge flattened)
 *   ARC           SUPPORTED
 *   CIRCLE        SUPPORTED
 *   ELLIPSE       PARTIALLY SUPPORTED (major/minor axis flattened as an
 *                 ellipse via parametric sampling; elliptical arcs with a
 *                 restricted start/end angle are supported, rotation of the
 *                 major axis is respected)
 *   SPLINE        PARTIALLY SUPPORTED (non-rational only — see
 *                 curveFlattening.ts header)
 *   POINT         SUPPORTED (candidate notch/drill marker — classified by
 *                 garmentSemanticsExtraction.ts, not here)
 *   TEXT          SUPPORTED (preserved verbatim as an annotation)
 *   MTEXT         SUPPORTED (preserved verbatim as an annotation)
 *   INSERT        PRESERVED BUT NOT YET INTERPRETED (name/position/rotation
 *                 recorded; block geometry is deliberately NOT expanded —
 *                 see the Step 5B report's security/robustness section)
 *   3DFACE, SOLID, DIMENSION, ATTDEF, MLEADER  UNSUPPORTED (recorded in
 *                 unsupportedEntityTypes, otherwise ignored)
 */

import type { IDxf, IEntity } from "dxf-parser";

import {
  flattenArc,
  flattenSpline,
  type FlatPoint,
} from "./curveFlattening";

export interface ExtractedLine {
  readonly start: FlatPoint;
  readonly end: FlatPoint;
  readonly layer: string;
}

export interface ExtractedPolyline {
  readonly points: ReadonlyArray<FlatPoint>;
  readonly closed: boolean;
  readonly layer: string;
}

export interface ExtractedPoint {
  readonly position: FlatPoint;
  readonly layer: string;
}

export interface ExtractedText {
  readonly text: string;
  readonly position: FlatPoint;
  readonly layer: string;
}

export interface ExtractedInsert {
  readonly blockName: string;
  readonly position: FlatPoint;
  readonly rotationDegrees: number;
  readonly xScale: number;
  readonly yScale: number;
  readonly layer: string;
}

export interface ExtractedDrawing {
  readonly lines: ReadonlyArray<ExtractedLine>;
  readonly polylines: ReadonlyArray<ExtractedPolyline>;
  readonly points: ReadonlyArray<ExtractedPoint>;
  readonly texts: ReadonlyArray<ExtractedText>;
  readonly inserts: ReadonlyArray<ExtractedInsert>;

  readonly layerNames: ReadonlyArray<string>;
  readonly blockNames: ReadonlyArray<string>;
  readonly totalEntityCount: number;
  readonly unsupportedEntityTypes: ReadonlyArray<string>;
};

function flattenEllipse(
  center: FlatPoint,
  majorAxisEndPoint: FlatPoint,
  axisRatio: number,
  startAngleRadians: number,
  endAngleRadians: number
): FlatPoint[] {
  const majorRadius = Math.hypot(majorAxisEndPoint.x, majorAxisEndPoint.y);

  if (!(majorRadius > 0)) {
    return [];
  }

  const rotation = Math.atan2(majorAxisEndPoint.y, majorAxisEndPoint.x);
  const minorRadius = majorRadius * axisRatio;

  let sweep = endAngleRadians - startAngleRadians;

  while (sweep <= 0) {
    sweep += 2 * Math.PI;
  }

  const segmentCount = Math.max(16, Math.min(720, Math.ceil((sweep / (2 * Math.PI)) * 180)));

  const points: FlatPoint[] = [];

  for (let index = 0; index <= segmentCount; index += 1) {
    const angle = startAngleRadians + (sweep * index) / segmentCount;

    const localX = majorRadius * Math.cos(angle);
    const localY = minorRadius * Math.sin(angle);

    points.push({
      x: center.x + localX * Math.cos(rotation) - localY * Math.sin(rotation),
      y: center.y + localX * Math.sin(rotation) + localY * Math.cos(rotation),
    });
  }

  return points;
}

/**
 * Flattens a signed-sweep arc (used for bulge segments, where the sweep
 * direction — CW or CCW — is meaningful and must not be normalised away,
 * unlike flattenArc() which always sweeps CCW from start to end for plain
 * ARC entities per the DXF ARC definition).
 */
function flattenSignedSweepArc(
  center: FlatPoint,
  radius: number,
  startAngleRadians: number,
  sweepRadians: number
): FlatPoint[] {
  const tolerance = 0.05; // cm, matches DEFAULT_CURVE_TOLERANCE

  const clampedRatio = Math.min(1, Math.max(0, tolerance / radius));
  const maxThetaPerSegment =
    clampedRatio >= 1 ? Math.abs(sweepRadians) : 2 * Math.acos(1 - clampedRatio);

  const segmentCount = Math.max(
    1,
    Math.min(2000, Math.ceil(Math.abs(sweepRadians) / Math.max(maxThetaPerSegment, 1e-6)))
  );

  const points: FlatPoint[] = [];

  for (let index = 0; index <= segmentCount; index += 1) {
    const angle = startAngleRadians + (sweepRadians * index) / segmentCount;

    points.push({
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    });
  }

  return points;
}

/**
 * Reconstructs a closed/open polyline from LWPOLYLINE/POLYLINE vertices,
 * flattening any bulge (arc) segments.
 *
 * DXF bulge definition: bulge = tan(includedAngle / 4); positive = the arc
 * sweeps counter-clockwise from the current vertex to the next. Derivation
 * used here (verified against the bulge = 1 exact-semicircle case, and
 * cross-checked in dxfImportValidationSuite.ts):
 *   theta  = 4 * atan(bulge)                       (signed included angle)
 *   R      = chordLength / (2 * sin(theta / 2))     (signed)
 *   apothem = R * cos(theta / 2)                    (signed distance from
 *             the chord midpoint to the arc centre, along the chord's
 *             clockwise-rotated normal)
 * The signed R/apothem combination is what lets one formula correctly place
 * the centre for both CW (negative bulge) and CCW (positive bulge) arcs
 * without a separate case split.
 */
function flattenBulgePolyline(
  vertices: ReadonlyArray<{ x: number; y: number; bulge?: number }>,
  closed: boolean
): FlatPoint[] {
  if (vertices.length === 0) {
    return [];
  }

  const points: FlatPoint[] = [{ x: vertices[0].x, y: vertices[0].y }];

  const segmentCount = closed ? vertices.length : vertices.length - 1;

  for (let index = 0; index < segmentCount; index += 1) {
    const current = vertices[index];
    const next = vertices[(index + 1) % vertices.length];

    const bulge = current.bulge ?? 0;

    if (!bulge) {
      points.push({ x: next.x, y: next.y });
      continue;
    }

    const theta = 4 * Math.atan(bulge);
    const phi = theta / 2;

    const chordDx = next.x - current.x;
    const chordDy = next.y - current.y;
    const chordLength = Math.hypot(chordDx, chordDy);

    if (chordLength === 0) {
      continue;
    }

    const signedRadius = chordLength / (2 * Math.sin(phi));
    const signedApothem = signedRadius * Math.cos(phi);

    const chordDirX = chordDx / chordLength;
    const chordDirY = chordDy / chordLength;

    // Clockwise-rotated chord normal — see derivation note above.
    const perpX = chordDirY;
    const perpY = -chordDirX;

    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;

    const centerX = midX + signedApothem * perpX;
    const centerY = midY + signedApothem * perpY;

    const startAngle = Math.atan2(current.y - centerY, current.x - centerX);

    const arcPoints = flattenSignedSweepArc(
      { x: centerX, y: centerY },
      Math.abs(signedRadius),
      startAngle,
      theta
    );

    // Skip the first point (duplicate of `current`, already pushed).
    points.push(...arcPoints.slice(1));
  }

  return points;
}

export function extractDrawing(dxf: IDxf): ExtractedDrawing {
  const lines: ExtractedLine[] = [];
  const polylines: ExtractedPolyline[] = [];
  const points: ExtractedPoint[] = [];
  const texts: ExtractedText[] = [];
  const inserts: ExtractedInsert[] = [];
  const unsupportedEntityTypes = new Set<string>();

  const entities: ReadonlyArray<IEntity> = dxf.entities ?? [];

  for (const entity of entities) {
    switch (entity.type) {
      case "LINE": {
        const line = entity as unknown as {
          vertices?: { x: number; y: number }[];
          start?: { x: number; y: number };
          end?: { x: number; y: number };
        };

        // dxf-parser's LINE entity exposes two vertices via `.vertices`.
        const [start, end] = line.vertices ?? [];

        if (start && end) {
          lines.push({ start, end, layer: entity.layer ?? "0" });
        }

        break;
      }

      case "LWPOLYLINE": {
        const poly = entity as unknown as {
          vertices: { x: number; y: number; bulge?: number }[];
          shape?: boolean;
        };

        const flattened = flattenBulgePolyline(
          poly.vertices ?? [],
          Boolean(poly.shape)
        );

        polylines.push({
          points: flattened,
          closed: Boolean(poly.shape),
          layer: entity.layer ?? "0",
        });

        break;
      }

      case "POLYLINE": {
        const poly = entity as unknown as {
          vertices: { x: number; y: number; bulge?: number }[];
          shape?: boolean;
        };

        const flattened = flattenBulgePolyline(
          poly.vertices ?? [],
          Boolean(poly.shape)
        );

        polylines.push({
          points: flattened,
          closed: Boolean(poly.shape),
          layer: entity.layer ?? "0",
        });

        break;
      }

      case "ARC": {
        const arc = entity as unknown as {
          center: { x: number; y: number };
          radius: number;
          // dxf-parser converts DXF's native degrees to RADIANS during
          // parsing (see its arc.ts: `Math.PI / 180 * value`) — must be
          // converted back to degrees for flattenArc()'s degree-based API.
          startAngle: number;
          endAngle: number;
        };

        const flattened = flattenArc(
          arc.center,
          arc.radius,
          (arc.startAngle * 180) / Math.PI,
          (arc.endAngle * 180) / Math.PI
        );

        polylines.push({
          points: flattened,
          closed: false,
          layer: entity.layer ?? "0",
        });

        break;
      }

      case "CIRCLE": {
        const circle = entity as unknown as {
          center: { x: number; y: number };
          radius: number;
        };

        const flattened = flattenArc(circle.center, circle.radius, 0, 360);

        polylines.push({
          points: flattened,
          closed: true,
          layer: entity.layer ?? "0",
        });

        break;
      }

      case "ELLIPSE": {
        const ellipse = entity as unknown as {
          center: { x: number; y: number };
          majorAxisEndPoint: { x: number; y: number };
          axisRatio: number;
          startAngle: number;
          endAngle: number;
        };

        const flattened = flattenEllipse(
          ellipse.center,
          ellipse.majorAxisEndPoint,
          ellipse.axisRatio,
          ellipse.startAngle,
          ellipse.endAngle
        );

        const isFullEllipse =
          Math.abs((ellipse.endAngle - ellipse.startAngle + 360) % 360) < 1e-6;

        polylines.push({
          points: flattened,
          closed: isFullEllipse,
          layer: entity.layer ?? "0",
        });

        break;
      }

      case "SPLINE": {
        const spline = entity as unknown as {
          controlPoints?: { x: number; y: number }[];
          fitPoints?: { x: number; y: number }[];
          degreeOfSplineCurve?: number;
          knotValues?: number[];
          closed?: boolean;
          rational?: boolean;
        };

        let flattened: FlatPoint[] = [];

        if (spline.fitPoints && spline.fitPoints.length >= 2) {
          // Fit points lie on the curve by DXF definition — use directly.
          flattened = spline.fitPoints.map((p) => ({ x: p.x, y: p.y }));
        } else if (
          spline.controlPoints &&
          spline.controlPoints.length >= 2 &&
          spline.knotValues &&
          spline.degreeOfSplineCurve
        ) {
          flattened = flattenSpline(
            spline.degreeOfSplineCurve,
            spline.knotValues,
            spline.controlPoints
          );
        }

        polylines.push({
          points: flattened,
          closed: Boolean(spline.closed),
          layer: entity.layer ?? "0",
        });

        break;
      }

      case "POINT": {
        const point = entity as unknown as { position: { x: number; y: number } };

        if (point.position) {
          points.push({ position: point.position, layer: entity.layer ?? "0" });
        }

        break;
      }

      case "TEXT": {
        const text = entity as unknown as {
          text: string;
          startPoint: { x: number; y: number };
        };

        if (text.text) {
          texts.push({
            text: text.text,
            position: text.startPoint ?? { x: 0, y: 0 },
            layer: entity.layer ?? "0",
          });
        }

        break;
      }

      case "MTEXT": {
        const mtext = entity as unknown as {
          text: string;
          position: { x: number; y: number };
        };

        if (mtext.text) {
          texts.push({
            text: mtext.text,
            position: mtext.position ?? { x: 0, y: 0 },
            layer: entity.layer ?? "0",
          });
        }

        break;
      }

      case "INSERT": {
        const insert = entity as unknown as {
          name: string;
          position: { x: number; y: number };
          rotation?: number;
          xScale?: number;
          yScale?: number;
        };

        inserts.push({
          blockName: insert.name ?? "",
          position: insert.position ?? { x: 0, y: 0 },
          rotationDegrees: insert.rotation ?? 0,
          xScale: insert.xScale ?? 1,
          yScale: insert.yScale ?? 1,
          layer: entity.layer ?? "0",
        });

        break;
      }

      default: {
        unsupportedEntityTypes.add(entity.type);
      }
    }
  }

  const layerNames = Object.keys(dxf.tables?.layer?.layers ?? {});
  const blockNames = Object.keys(dxf.blocks ?? {});

  return {
    lines,
    polylines,
    points,
    texts,
    inserts,
    layerNames,
    blockNames,
    totalEntityCount: entities.length,
    unsupportedEntityTypes: [...unsupportedEntityTypes],
  };
}
