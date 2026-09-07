import {
  BOUNDARY_QUALITY_WEIGHTS,
  createBoundaryQualityRuleResult,
  DUPLICATE_POINT_TOLERANCE_PX,
  MINIMUM_BOUNDARY_VERTICES,
  RECOMMENDED_MAXIMUM_VERTICES,
  RECOMMENDED_MINIMUM_VERTICES,
  SHARP_ANGLE_WARNING_DEGREES,
  VERY_SHORT_EDGE_TOLERANCE_PX,
  BoundaryQualityRuleResult,
} from "./BoundaryQualityRules";

import {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

export interface BoundaryQualityInput {
  vertices: GeometryPoint[];
  closed: boolean;
}

export interface BoundaryQualityResult {
  score: number;
  grade: "A" | "B" | "C" | "D";
  rules: BoundaryQualityRuleResult[];
}

export function evaluateBoundaryQuality(
  input: BoundaryQualityInput
): BoundaryQualityResult {
  const rules: BoundaryQualityRuleResult[] = [];

  let score = 100;

  rules.push(checkClosed(input));
  rules.push(checkVertexCount(input));
  rules.push(checkDuplicateVertices(input));
  rules.push(checkShortEdges(input));
  rules.push(checkSharpAngles(input));

  rules.forEach((rule) => {
    if (rule.passed) return;

    switch (rule.id) {
      case "closed":
        score -=
          BOUNDARY_QUALITY_WEIGHTS.polygonClosed;
        break;

      case "vertices":
        score -=
          BOUNDARY_QUALITY_WEIGHTS.minimumVertices;
        break;

      case "duplicates":
        score -=
          BOUNDARY_QUALITY_WEIGHTS.duplicateVertices;
        break;

      case "shortEdges":
        score -=
          BOUNDARY_QUALITY_WEIGHTS.shortEdges;
        break;

      case "sharpAngles":
        score -=
          BOUNDARY_QUALITY_WEIGHTS.sharpAngles;
        break;
    }
  });

  score = Math.max(0, Math.min(100, score));

  let grade: "A" | "B" | "C" | "D";

  if (score >= 90) {
    grade = "A";
  } else if (score >= 75) {
    grade = "B";
  } else if (score >= 60) {
    grade = "C";
  } else {
    grade = "D";
  }

  return {
    score,
    grade,
    rules,
  };
}

function checkClosed(
  input: BoundaryQualityInput
): BoundaryQualityRuleResult {
  return createBoundaryQualityRuleResult({
    id: "closed",

    label: "Polygon Closed",

    severity: "critical",

    passed: input.closed,

    message: input.closed
      ? "Boundary is closed."
      : "Boundary remains open.",

    recommendation:
      "Close the polygon before geometry calculation.",
  });
}

function checkVertexCount(
  input: BoundaryQualityInput
): BoundaryQualityRuleResult {
  const count = input.vertices.length;

  const passed =
    count >=
      RECOMMENDED_MINIMUM_VERTICES &&
    count <=
      RECOMMENDED_MAXIMUM_VERTICES;

  let message = `${count} vertices detected.`;

  if (count < MINIMUM_BOUNDARY_VERTICES) {
    message =
      "Polygon requires at least three vertices.";
  }

  return createBoundaryQualityRuleResult({
    id: "vertices",

    label: "Vertex Density",

    severity: "warning",

    passed,

    message,

    recommendation:
      "Trace more consistently around curves.",
  });
}

function checkDuplicateVertices(
  input: BoundaryQualityInput
): BoundaryQualityRuleResult {
  let duplicateFound = false;

  for (
    let i = 0;
    i < input.vertices.length - 1;
    i++
  ) {
    const a = input.vertices[i];
    const b = input.vertices[i + 1];

    if (
      Math.abs(a.x - b.x) <=
        DUPLICATE_POINT_TOLERANCE_PX &&
      Math.abs(a.y - b.y) <=
        DUPLICATE_POINT_TOLERANCE_PX
    ) {
      duplicateFound = true;
      break;
    }
  }

  return createBoundaryQualityRuleResult({
    id: "duplicates",

    label: "Duplicate Vertices",

    severity: "warning",

    passed: !duplicateFound,

    message: duplicateFound
      ? "Duplicate tracing points detected."
      : "No duplicate points.",

    recommendation:
      "Remove accidental repeated clicks.",
  });
}

function checkShortEdges(
  input: BoundaryQualityInput
): BoundaryQualityRuleResult {
  let shortEdge = false;

  for (
    let i = 1;
    i < input.vertices.length;
    i++
  ) {
    const dx =
      input.vertices[i].x -
      input.vertices[i - 1].x;

    const dy =
      input.vertices[i].y -
      input.vertices[i - 1].y;

    const distance =
      Math.sqrt(dx * dx + dy * dy);

    if (
      distance <
      VERY_SHORT_EDGE_TOLERANCE_PX
    ) {
      shortEdge = true;
      break;
    }
  }

  return createBoundaryQualityRuleResult({
    id: "shortEdges",

    label: "Short Edges",

    severity: "warning",

    passed: !shortEdge,

    message: shortEdge
      ? "Very short edge detected."
      : "Edge lengths look normal.",

    recommendation:
      "Avoid repeated clicks close together.",
  });
}

function checkSharpAngles(
  input: BoundaryQualityInput
): BoundaryQualityRuleResult {
  if (input.vertices.length < 3) {
    return createBoundaryQualityRuleResult({
      id: "sharpAngles",

      label: "Sharp Angles",

      severity: "warning",

      passed: true,

      message: "Not enough vertices.",
    });
  }

  let sharp = false;

  for (
    let i = 1;
    i < input.vertices.length - 1;
    i++
  ) {
    const p0 = input.vertices[i - 1];
    const p1 = input.vertices[i];
    const p2 = input.vertices[i + 1];

    const a = Math.atan2(
      p0.y - p1.y,
      p0.x - p1.x
    );

    const b = Math.atan2(
      p2.y - p1.y,
      p2.x - p1.x
    );

    let angle =
      Math.abs((a - b) * 180 / Math.PI);

    if (angle > 180) {
      angle = 360 - angle;
    }

    if (
      angle <
      SHARP_ANGLE_WARNING_DEGREES
    ) {
      sharp = true;
      break;
    }
  }

  return createBoundaryQualityRuleResult({
    id: "sharpAngles",

    label: "Sharp Angles",

    severity: "warning",

    passed: !sharp,

    message: sharp
      ? "Sharp angles detected."
      : "Angle transitions are smooth.",

    recommendation:
      "Increase tracing accuracy around curves.",
  });
}