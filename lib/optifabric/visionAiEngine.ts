export interface VisionAiInput {
  fileName: string;
  fabricType: string;
  hasScaleVisible: boolean;
  hasClearBoundary: boolean;
}

export interface VisionAiResult {
  imageAccepted: boolean;
  boundaryStatus: "Ready" | "Needs clearer image" | "Not detected";
  scaleStatus: "Calibrated" | "Scale visible" | "Scale missing";
  fabricRisk: "Low" | "Medium" | "High";
  tracingRecommendation: string;
  aiNotes: string[];
}

export function inspectPatternImage(
  input: VisionAiInput
): VisionAiResult {
  const fabricRisk =
    input.fabricType === "solid" ? "Low" : "Medium";

  return {
    imageAccepted: input.hasClearBoundary,

    boundaryStatus: input.hasClearBoundary
      ? "Ready"
      : "Needs clearer image",

    scaleStatus: input.hasScaleVisible
      ? "Scale visible"
      : "Scale missing",

    fabricRisk,

    tracingRecommendation: input.hasClearBoundary
      ? "Proceed with manual-assisted tracing."
      : "Retake photo with better contrast and full pattern boundary visible.",

    aiNotes: [
      "Pattern image received.",
      "Boundary readiness checked.",
      "Scale visibility checked.",
      "Fabric type rule selected.",
      "Ready for polygon tracing workflow.",
    ],
  };
}