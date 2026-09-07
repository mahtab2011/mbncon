import type {
  MarkerLayout,
  MarkerStatistics,
} from "./markerTypes";

export function calculateMarkerStatistics(
  layout: MarkerLayout
): MarkerStatistics {
  const usedPatternAreaSqCm =
    layout.placedPieces.reduce(
      (total, piece) =>
        total + piece.areaSqCm,
      0
    );

  const markerAreaSqCm =
    layout.markerAreaSqCm;

  const markerEfficiencyPercent =
    markerAreaSqCm > 0
      ? (usedPatternAreaSqCm /
          markerAreaSqCm) *
        100
      : 0;

  const wastePercent =
    100 - markerEfficiencyPercent;

  const endLossSqCm =
    Math.max(
      markerAreaSqCm -
        usedPatternAreaSqCm,
      0
    );

  const averageGapCm =
    layout.placedPieces.length > 1
      ? endLossSqCm /
        layout.placedPieces.length
      : 0;

  let efficiencyGrade:
    MarkerStatistics["efficiencyGrade"];

  if (
    markerEfficiencyPercent >=
    90
  ) {
    efficiencyGrade = "A";
  } else if (
    markerEfficiencyPercent >=
    85
  ) {
    efficiencyGrade = "B";
  } else if (
    markerEfficiencyPercent >=
    80
  ) {
    efficiencyGrade = "C";
  } else {
    efficiencyGrade = "D";
  }

  let engineeringRecommendation =
    "";

  switch (efficiencyGrade) {
    case "A":
      engineeringRecommendation =
        "Excellent marker. Ready for production.";
      break;

    case "B":
      engineeringRecommendation =
        "Very good marker. Minor optimisation may improve utilisation.";
      break;

    case "C":
      engineeringRecommendation =
        "Marker acceptable. Review spacing and placement.";
      break;

    default:
      engineeringRecommendation =
        "Marker efficiency is low. AI nesting optimisation recommended.";
  }

  return {
    patternCount:
      layout.placedPieces.length,

    placedPieceCount:
      layout.placedPieces.length,

    unplacedPieceCount:
      layout.unplacedPieceIds.length,

    fabricWidthCm:
      layout.fabricWidthCm,

    markerLengthCm:
      layout.markerLengthCm,

    markerAreaSqCm,

    usedPatternAreaSqCm,

    markerEfficiencyPercent:
      Number(
        markerEfficiencyPercent.toFixed(
          2
        )
      ),

    wastePercent: Number(
      wastePercent.toFixed(2)
    ),

    endLossSqCm: Number(
      endLossSqCm.toFixed(2)
    ),

    averageGapCm: Number(
      averageGapCm.toFixed(2)
    ),

    efficiencyGrade,

    engineeringRecommendation,
  };
}