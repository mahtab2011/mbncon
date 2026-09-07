import {
  generateMarkerPlacement,
  type MarkerPlacementInput,
} from "./markerPlacementEngine";

import {
  detectMarkerCollisions,
} from "./markerCollisionEngine";

import {
  evaluateMarkerQuality,
} from "./markerQualityEngine";

export interface MarkerOptimisationResult {
  markerLength: number;

  collisions: number;

  qualityGrade: string;

  qualityScore: number;

  recommendations: string[];
}

export function optimiseMarker(
  input: MarkerPlacementInput
): MarkerOptimisationResult {

  const placement =
    generateMarkerPlacement(input);

  const rectangles =
    placement.placements.map(
      (piece, index) => ({
        id: piece.patternId,

        x: piece.x,

        y: piece.y,

        width:
          input.polygons[index]
            ?.boundingBox.width ?? 0,

        height:
          input.polygons[index]
            ?.boundingBox.height ?? 0,
      })
    );

  const collisions =
    detectMarkerCollisions(
      rectangles
    );

  const utilisation = 88;

  const waste = 12;

  const quality =
    evaluateMarkerQuality({
      utilisation,

      waste,

      collisions:
        collisions.length,

      markerLength:
        placement.markerLength,

      fabricWidth:
        input.fabricWidth,
    });

  return {
    markerLength:
      placement.markerLength,

    collisions:
      collisions.length,

    qualityGrade:
      quality.grade,

    qualityScore:
      quality.score,

    recommendations:
      quality.recommendations,
  };
}