export interface MarkerQualityInput {
  utilisation: number;

  waste: number;

  collisions: number;

  markerLength: number;

  fabricWidth: number;
}

export interface MarkerQualityResult {
  grade: string;

  score: number;

  recommendations: string[];
}

export function evaluateMarkerQuality(
  input: MarkerQualityInput
): MarkerQualityResult {

  let score = 100;

  const recommendations: string[] = [];

  if (input.collisions > 0) {
    score -= 40;

    recommendations.push(
      "Resolve overlapping pattern pieces."
    );
  }

  if (input.utilisation < 85) {
    score -= 20;

    recommendations.push(
      "Improve marker utilisation."
    );
  }

  if (input.waste > 15) {
    score -= 15;

    recommendations.push(
      "Reduce marker waste."
    );
  }

  if (input.markerLength <= 0) {
    score -= 25;

    recommendations.push(
      "Marker length calculation is invalid."
    );
  }

  const grade =
    score >= 95
      ? "A+"
      : score >= 90
      ? "A"
      : score >= 80
      ? "B"
      : score >= 70
      ? "C"
      : "Needs Improvement";

  return {
    grade,

    score,

    recommendations,
  };
}