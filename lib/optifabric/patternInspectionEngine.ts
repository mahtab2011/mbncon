export interface PatternInspectionInput {
  boundaryPoints: number;
  pixelArea: number;
  areaSqInches: number;
  scalePixels: number;
}

export interface PatternInspectionResult {
  patternClosed: boolean;
  areaStatus: "Ready" | "Too small" | "Missing";
  scaleStatus: "Ready" | "Needs calibration";
  tracingStatus: "Ready for nesting" | "Continue tracing";
  warnings: string[];
}

export function inspectTracedPattern(
  input: PatternInspectionInput
): PatternInspectionResult {
  const patternClosed = input.boundaryPoints >= 3;
  const areaReady = input.areaSqInches > 0;
  const scaleReady = input.scalePixels > 0;

  const warnings: string[] = [];

  if (!patternClosed) {
    warnings.push("Add at least 3 boundary points to form a closed pattern.");
  }

  if (!areaReady) {
    warnings.push("Pattern area is not ready yet.");
  }

  if (!scaleReady) {
    warnings.push("Scale calibration is missing.");
  }

  return {
    patternClosed,
    areaStatus: areaReady ? "Ready" : "Missing",
    scaleStatus: scaleReady ? "Ready" : "Needs calibration",
    tracingStatus:
      patternClosed && areaReady && scaleReady
        ? "Ready for nesting"
        : "Continue tracing",
    warnings,
  };
}