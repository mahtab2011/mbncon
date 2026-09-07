/**
 * OptiFabric AI
 * RC5-005-011 — DXF Fixture Builder (Step 5B §12)
 *
 * ============================================================
 * ENGINEERING TEST FIXTURES — NOT REAL FACTORY CAD.
 * ============================================================
 * Every DXF string produced by this file and its sibling fixture files is
 * a hand-authored, standards-compliant ASCII DXF used ONLY to exercise the
 * parser/canonicalisation/validation code paths in lib/optifabric/cadImport.
 * None of it is a digitised real pattern, and none of it proves
 * compatibility with any commercial CAD system (Gerber, Lectra, Optitex,
 * TUKAcad, Gemini, Richpeace, or any other) — see the Step 5B report.
 */

export interface DxfPoint {
  readonly x: number;
  readonly y: number;
  readonly bulge?: number;
}

const INSUNITS_CODES = {
  mm: 4,
  cm: 5,
  in: 1,
} as const;

export function dxfHeaderSection(insunits?: keyof typeof INSUNITS_CODES): string {
  if (insunits === undefined) {
    return ["0", "SECTION", "2", "HEADER", "0", "ENDSEC"].join("\n");
  }

  return [
    "0",
    "SECTION",
    "2",
    "HEADER",
    "9",
    "$INSUNITS",
    "70",
    String(INSUNITS_CODES[insunits]),
    "0",
    "ENDSEC",
  ].join("\n");
}

export function dxfLwpolyline(
  points: ReadonlyArray<DxfPoint>,
  closed: boolean,
  layer = "0"
): string {
  const lines: string[] = ["0", "LWPOLYLINE", "8", layer, "90", String(points.length), "70", closed ? "1" : "0"];

  for (const point of points) {
    lines.push("10", String(point.x), "20", String(point.y));

    if (point.bulge) {
      lines.push("42", String(point.bulge));
    }
  }

  return lines.join("\n");
}

export function dxfLine(
  start: DxfPoint,
  end: DxfPoint,
  layer = "0"
): string {
  return [
    "0",
    "LINE",
    "8",
    layer,
    "10",
    String(start.x),
    "20",
    String(start.y),
    "11",
    String(end.x),
    "21",
    String(end.y),
  ].join("\n");
}

export function dxfArc(
  center: DxfPoint,
  radius: number,
  startAngleDegrees: number,
  endAngleDegrees: number,
  layer = "0"
): string {
  return [
    "0",
    "ARC",
    "8",
    layer,
    "10",
    String(center.x),
    "20",
    String(center.y),
    "40",
    String(radius),
    "50",
    String(startAngleDegrees),
    "51",
    String(endAngleDegrees),
  ].join("\n");
}

export function dxfCircle(center: DxfPoint, radius: number, layer = "0"): string {
  return [
    "0",
    "CIRCLE",
    "8",
    layer,
    "10",
    String(center.x),
    "20",
    String(center.y),
    "40",
    String(radius),
  ].join("\n");
}

export function dxfPoint(position: DxfPoint, layer = "0"): string {
  return [
    "0",
    "POINT",
    "8",
    layer,
    "10",
    String(position.x),
    "20",
    String(position.y),
  ].join("\n");
}

export function dxfText(text: string, position: DxfPoint, layer = "0"): string {
  return [
    "0",
    "TEXT",
    "8",
    layer,
    "10",
    String(position.x),
    "20",
    String(position.y),
    "40",
    "2.5",
    "1",
    text,
  ].join("\n");
}

export function dxfMtext(text: string, position: DxfPoint, layer = "0"): string {
  return [
    "0",
    "MTEXT",
    "8",
    layer,
    "10",
    String(position.x),
    "20",
    String(position.y),
    "40",
    "2.5",
    "1",
    text,
  ].join("\n");
}

export function dxfInsert(
  blockName: string,
  position: DxfPoint,
  xScale: number,
  yScale: number,
  layer = "0"
): string {
  return [
    "0",
    "INSERT",
    "8",
    layer,
    "2",
    blockName,
    "10",
    String(position.x),
    "20",
    String(position.y),
    "41",
    String(xScale),
    "42",
    String(yScale),
  ].join("\n");
}

/** Non-rational cubic B-spline: degree 3, 5 control points, clamped uniform knot vector. */
export function dxfSpline(controlPoints: ReadonlyArray<DxfPoint>, layer = "0"): string {
  const degree = 3;
  const n = controlPoints.length;
  const knotCount = n + degree + 1;

  const knots: number[] = [];

  for (let index = 0; index < knotCount; index += 1) {
    if (index <= degree) {
      knots.push(0);
    } else if (index >= knotCount - degree - 1) {
      knots.push(n - degree);
    } else {
      knots.push(index - degree);
    }
  }

  const lines: string[] = [
    "0",
    "SPLINE",
    "8",
    layer,
    "70",
    "0",
    "71",
    String(degree),
    "72",
    String(knots.length),
    "73",
    String(n),
  ];

  for (const knot of knots) {
    lines.push("40", String(knot));
  }

  for (const point of controlPoints) {
    lines.push("10", String(point.x), "20", String(point.y));
  }

  return lines.join("\n");
}

/** Minimal 3-point SOLID — used only as a deliberately UNSUPPORTED entity type for coverage testing (see the Step 5B entity support matrix). */
export function dxfSolid(
  p1: DxfPoint,
  p2: DxfPoint,
  p3: DxfPoint,
  layer = "0"
): string {
  return [
    "0",
    "SOLID",
    "8",
    layer,
    "10",
    String(p1.x),
    "20",
    String(p1.y),
    "11",
    String(p2.x),
    "21",
    String(p2.y),
    "12",
    String(p3.x),
    "22",
    String(p3.y),
  ].join("\n");
}

export function dxfDocument(
  entityBlocks: ReadonlyArray<string>,
  insunits?: keyof typeof INSUNITS_CODES
): string {
  return [
    dxfHeaderSection(insunits),
    "0",
    "SECTION",
    "2",
    "ENTITIES",
    ...entityBlocks,
    "0",
    "ENDSEC",
    "0",
    "EOF",
  ].join("\n");
}
