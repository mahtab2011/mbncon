export type ScaleDetectionInput = {
  imageHasScale: boolean;
  scaleType: "12-inch-ruler" | "measuring-tape" | "grid" | "unknown" | "none";
  visibleScaleLengthInches: number;
  measuredPixelLength: number;
  photoQuality: "clear" | "slanted" | "blurred" | "low-light" | "unknown";
};

export type ScaleDetectionResult = {
  status: "ok" | "warning" | "critical";
  pixelsPerInch: number;
  message: string;
  aiReason: string;
  recommendations: string[];
};

export function analyzeScaleDetection(
  input: ScaleDetectionInput
): ScaleDetectionResult {
  const recommendations: string[] = [];

  if (!input.imageHasScale || input.scaleType === "none") {
    return {
      status: "critical",
      pixelsPerInch: 0,
      message: "No measurement scale was detected in the image.",
      aiReason:
        "AI asks for a 12-inch scale because pattern size cannot be converted from pixels to real cutting measurements without calibration.",
      recommendations: [
        "Place a 12-inch ruler beside the pattern piece.",
        "Keep the ruler flat and visible in the photo.",
        "Retake the image before calculating pattern area.",
      ],
    };
  }

  if (
    input.visibleScaleLengthInches <= 0 ||
    input.measuredPixelLength <= 0
  ) {
    return {
      status: "critical",
      pixelsPerInch: 0,
      message: "Scale is visible, but calibration values are missing.",
      aiReason:
        "AI asks this because it must know how many pixels represent one real inch.",
      recommendations: [
        "Measure the visible ruler length in the image.",
        "Enter the matching pixel length detected from the photo.",
        "Use 12 inches where possible for better accuracy.",
      ],
    };
  }

  const pixelsPerInch =
    input.measuredPixelLength / input.visibleScaleLengthInches;

  if (input.photoQuality === "blurred" || input.photoQuality === "low-light") {
    return {
      status: "warning",
      pixelsPerInch,
      message:
        "Scale calibration is possible, but photo quality may reduce accuracy.",
      aiReason:
        "AI asks about photo quality because blurred or dark images can distort boundary and scale detection.",
      recommendations: [
        "Retake the photo in better light.",
        "Keep the camera directly above the pattern.",
        "Avoid shadows over the ruler and pattern edge.",
      ],
    };
  }

  if (input.photoQuality === "slanted") {
    return {
      status: "warning",
      pixelsPerInch,
      message:
        "Scale calibration is possible, but the image angle may create measurement distortion.",
      aiReason:
        "AI asks this because angled photos can make real pattern dimensions inaccurate.",
      recommendations: [
        "Take the photo from directly above.",
        "Keep the pattern and ruler on a flat surface.",
        "Avoid perspective distortion before final calculation.",
      ],
    };
  }

  return {
    status: "ok",
    pixelsPerInch,
    message: "Scale calibration is ready for pattern measurement.",
    aiReason:
      "AI asks this because accurate scale calibration allows real area, consumption, and marker planning calculations.",
    recommendations: [
      `Use ${pixelsPerInch.toFixed(2)} pixels per inch for this image.`,
      "Continue with boundary tracing and area calculation.",
    ],
  };
}