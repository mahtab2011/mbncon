export type BoundaryQualitySeverity =
  | "pass"
  | "warning"
  | "critical";

export interface BoundaryQualityRuleResult {
  id: string;

  label: string;

  severity:
    BoundaryQualitySeverity;

  passed: boolean;

  message: string;

  recommendation?: string;
}

export const MINIMUM_BOUNDARY_VERTICES = 3;

export const RECOMMENDED_MINIMUM_VERTICES = 12;

export const RECOMMENDED_MAXIMUM_VERTICES = 500;

export const DUPLICATE_POINT_TOLERANCE_PX = 1;

export const SHARP_ANGLE_WARNING_DEGREES = 18;

export const VERY_SHORT_EDGE_TOLERANCE_PX = 2;

export const BOUNDARY_QUALITY_WEIGHTS = {
  polygonClosed: 25,

  minimumVertices: 15,

  duplicateVertices: 15,

  selfIntersection: 25,

  shortEdges: 10,

  sharpAngles: 10,
} as const;

export function createBoundaryQualityRuleResult({
  id,

  label,

  severity,

  passed,

  message,

  recommendation,
}: {
  id: string;

  label: string;

  severity:
    BoundaryQualitySeverity;

  passed: boolean;

  message: string;

  recommendation?: string;
}): BoundaryQualityRuleResult {
  return {
    id,

    label,

    severity,

    passed,

    message,

    recommendation,
  };
}