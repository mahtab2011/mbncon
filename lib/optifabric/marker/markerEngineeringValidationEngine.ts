import {
  detectMarkerCollisions,
  type MarkerRectangle,
} from "./markerCollisionEngine";

import {
  evaluateMarkerQuality,
} from "./markerQualityEngine";

import {
  calculateMarkerStatistics,
} from "@/lib/optifabric/markerStatistics";

import type {
  MarkerLayout,
  PlacedMarkerPiece,
} from "@/lib/optifabric/markerTypes";

export interface MarkerCollisionRecord {
  firstPieceId: string;

  firstPieceName: string;

  secondPieceId: string;

  secondPieceName: string;
}

export interface MarkerEngineeringValidationResult {
  valid: boolean;

  productionReady: boolean;

  collisionCount: number;

  outsideMarkerCount: number;

  unplacedPieceCount: number;

  utilisationPercent: number;

  wastePercent: number;

  qualityGrade: string;

  qualityScore: number;

  collisions:
    MarkerCollisionRecord[];

  recommendations: string[];

  warnings: string[];

  explanation: string;
}

function createMarkerRectangle(
  piece: PlacedMarkerPiece
): MarkerRectangle {
  return {
    id: piece.id,

    x: piece.xCm,

    y: piece.yCm,

    width: piece.widthCm,

    height: piece.heightCm,
  };
}

function isPieceOutsideMarker({
  piece,
  layout,
}: {
  piece: PlacedMarkerPiece;

  layout: MarkerLayout;
}): boolean {
  return (
    piece.xCm < 0 ||
    piece.yCm < 0 ||
    piece.xCm +
      piece.widthCm >
      layout.fabricWidthCm ||
    piece.yCm +
      piece.heightCm >
      layout.markerLengthCm
  );
}

function findPieceById(
  layout: MarkerLayout,
  pieceId: string
): PlacedMarkerPiece | null {
  return (
    layout.placedPieces.find(
      (piece) =>
        piece.id === pieceId
    ) ?? null
  );
}

function createCollisionRecords(
  layout: MarkerLayout
): MarkerCollisionRecord[] {
  const rectangles =
    layout.placedPieces.map(
      createMarkerRectangle
    );

  const collisionPairs =
    detectMarkerCollisions(
      rectangles
    );

  return collisionPairs.map(
    ([first, second]) => {
      const firstPiece =
        findPieceById(
          layout,
          first.id
        );

      const secondPiece =
        findPieceById(
          layout,
          second.id
        );

      return {
        firstPieceId:
          first.id,

        firstPieceName:
          firstPiece?.name ??
          first.id,

        secondPieceId:
          second.id,

        secondPieceName:
          secondPiece?.name ??
          second.id,
      };
    }
  );
}

function createWarnings({
  collisionCount,
  outsideMarkerCount,
  unplacedPieceCount,
}: {
  collisionCount: number;

  outsideMarkerCount: number;

  unplacedPieceCount: number;
}): string[] {
  const warnings: string[] = [];

  if (collisionCount > 0) {
    warnings.push(
      `${collisionCount} marker collision(s) were detected.`
    );
  }

  if (outsideMarkerCount > 0) {
    warnings.push(
      `${outsideMarkerCount} placed piece(s) extend outside the marker boundary.`
    );
  }

  if (unplacedPieceCount > 0) {
    warnings.push(
      `${unplacedPieceCount} requested piece instance(s) remain unplaced.`
    );
  }

  return warnings;
}

export function validateMarkerEngineering(
  layout: MarkerLayout
): MarkerEngineeringValidationResult {
  const statistics =
    calculateMarkerStatistics(
      layout
    );

  const collisions =
    createCollisionRecords(
      layout
    );

  const outsideMarkerCount =
    layout.placedPieces.filter(
      (piece) =>
        isPieceOutsideMarker({
          piece,
          layout,
        })
    ).length;

  const unplacedPieceCount =
    layout.unplacedPieceIds.length;

  const quality =
    evaluateMarkerQuality({
      utilisation:
        statistics
          .markerEfficiencyPercent,

      waste:
        statistics.wastePercent,

      collisions:
        collisions.length,

      markerLength:
        layout.markerLengthCm,

      fabricWidth:
        layout.fabricWidthCm,
    });

  const warnings =
    createWarnings({
      collisionCount:
        collisions.length,

      outsideMarkerCount,

      unplacedPieceCount,
    });

  const valid =
    layout.placedPieces.length >
      0 &&
    layout.markerLengthCm > 0 &&
    layout.fabricWidthCm > 0;

  const productionReady =
    valid &&
    collisions.length === 0 &&
    outsideMarkerCount === 0 &&
    unplacedPieceCount === 0 &&
    quality.score >= 80;

  const recommendations = [
    ...quality.recommendations,
  ];

  if (
    outsideMarkerCount > 0
  ) {
    recommendations.push(
      "Move all pattern pieces fully inside the fabric and marker boundaries."
    );
  }

  if (
    unplacedPieceCount > 0
  ) {
    recommendations.push(
      "Review fabric width, spacing, rotation permissions and maximum marker length."
    );
  }

  if (
    recommendations.length ===
      0 &&
    productionReady
  ) {
    recommendations.push(
      "The marker passed engineering validation and may proceed to fabric-consumption analysis."
    );
  }

  return {
    valid,

    productionReady,

    collisionCount:
      collisions.length,

    outsideMarkerCount,

    unplacedPieceCount,

    utilisationPercent:
      statistics
        .markerEfficiencyPercent,

    wastePercent:
      statistics.wastePercent,

    qualityGrade:
      quality.grade,

    qualityScore:
      quality.score,

    collisions,

    recommendations,

    warnings,

    explanation:
      productionReady
        ? "The generated marker passed collision, boundary, placement and quality validation."
        : "The generated marker requires engineering review before production approval.",
  };
}

export const markerEngineeringValidationEngine = {
  validateMarkerEngineering,
};

export default markerEngineeringValidationEngine;