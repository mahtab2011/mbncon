import type {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

import {
  calculateMarkerStatistics,
} from "./markerStatistics";

import type {
  MarkerGenerationInput,
  MarkerGenerationResult,
  MarkerLayout,
  MarkerPiece,
  MarkerRotation,
  MarkerSettings,
  PlacedMarkerPiece,
} from "./markerTypes";

const ENGINE_VERSION =
  "RC4-013-BOTTOM-LEFT-V1";

interface PieceInstance {
  piece: MarkerPiece;
  instanceNumber: number;
}

interface PlacementCandidate {
  xCm: number;
  yCm: number;
  rotation: MarkerRotation;
  widthCm: number;
  heightCm: number;
  transformedPolygon:
    GeometryPoint[];
}

function roundValue(
  value: number,
  decimals = 4
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const multiplier =
    10 ** decimals;

  return (
    Math.round(
      value * multiplier
    ) / multiplier
  );
}

function validateSettings(
  settings: MarkerSettings
): string[] {
  const warnings: string[] = [];

  if (
    !Number.isFinite(
      settings.fabricWidthCm
    ) ||
    settings.fabricWidthCm <= 0
  ) {
    warnings.push(
      "Fabric width must be greater than zero."
    );
  }

  if (
    !Number.isFinite(
      settings.pieceSpacingCm
    ) ||
    settings.pieceSpacingCm < 0
  ) {
    warnings.push(
      "Piece spacing cannot be negative."
    );
  }

  if (
    !Number.isFinite(
      settings.edgeAllowanceCm
    ) ||
    settings.edgeAllowanceCm < 0
  ) {
    warnings.push(
      "Edge allowance cannot be negative."
    );
  }

  return warnings;
}

function expandPieceInstances(
  pieces: MarkerPiece[]
): PieceInstance[] {
  const instances:
    PieceInstance[] = [];

  for (const piece of pieces) {
    const quantity =
      Math.max(
        0,
        Math.floor(
          piece.quantity
        )
      );

    for (
      let instanceNumber = 1;
      instanceNumber <= quantity;
      instanceNumber += 1
    ) {
      instances.push({
        piece,
        instanceNumber,
      });
    }
  }

  return instances.sort(
    (first, second) => {
      const firstLargestSide =
        Math.max(
          first.piece.widthCm,
          first.piece.heightCm
        );

      const secondLargestSide =
        Math.max(
          second.piece.widthCm,
          second.piece.heightCm
        );

      if (
        secondLargestSide !==
        firstLargestSide
      ) {
        return (
          secondLargestSide -
          firstLargestSide
        );
      }

      return (
        second.piece.areaSqCm -
        first.piece.areaSqCm
      );
    }
  );
}

function getAllowedRotations(
  piece: MarkerPiece,
  settings: MarkerSettings
): MarkerRotation[] {
  if (
    !settings.allowRotation ||
    !piece.rotationAllowed
  ) {
    return [0];
  }

  const allowed: MarkerRotation[] =
  piece.allowedRotations.length > 0
    ? piece.allowedRotations
    : [0];
  return Array.from(
    new Set(
      allowed
    )
  );
}

function getRotatedDimensions(
  piece: MarkerPiece,
  rotation: MarkerRotation
): {
  widthCm: number;
  heightCm: number;
} {
  if (
    rotation === 90 ||
    rotation === 270
  ) {
    return {
      widthCm:
        piece.heightCm,
      heightCm:
        piece.widthCm,
    };
  }

  return {
    widthCm:
      piece.widthCm,
    heightCm:
      piece.heightCm,
  };
}

function rotatePoint(
  point: GeometryPoint,
  rotation: MarkerRotation,
  piece: MarkerPiece
): GeometryPoint {
  switch (rotation) {
    case 90:
      return {
        x:
          piece.heightCm -
          point.y,
        y:
          point.x,
      };

    case 180:
      return {
        x:
          piece.widthCm -
          point.x,
        y:
          piece.heightCm -
          point.y,
      };

    case 270:
      return {
        x:
          point.y,
        y:
          piece.widthCm -
          point.x,
      };

    default:
      return {
        x:
          point.x,
        y:
          point.y,
      };
  }
}

function transformPolygon(
  piece: MarkerPiece,
  rotation: MarkerRotation,
  xCm: number,
  yCm: number
): GeometryPoint[] {
  return piece.polygon.map(
    (point) => {
      const rotated =
        rotatePoint(
          point,
          rotation,
          piece
        );

      return {
        x:
          roundValue(
            rotated.x + xCm
          ),
        y:
          roundValue(
            rotated.y + yCm
          ),
      };
    }
  );
}

function rectanglesOverlap(
  first: {
    xCm: number;
    yCm: number;
    widthCm: number;
    heightCm: number;
  },
  second: {
    xCm: number;
    yCm: number;
    widthCm: number;
    heightCm: number;
  },
  spacingCm: number
): boolean {
  return !(
    first.xCm +
      first.widthCm +
      spacingCm <=
      second.xCm ||
    second.xCm +
      second.widthCm +
      spacingCm <=
      first.xCm ||
    first.yCm +
      first.heightCm +
      spacingCm <=
      second.yCm ||
    second.yCm +
      second.heightCm +
      spacingCm <=
      first.yCm
  );
}

function canPlaceCandidate(
  candidate:
    PlacementCandidate,
  placedPieces:
    PlacedMarkerPiece[],
  settings:
    MarkerSettings
): boolean {
  const usableWidth =
    settings.fabricWidthCm -
    settings.edgeAllowanceCm *
      2;

  if (
    candidate.widthCm >
    usableWidth
  ) {
    return false;
  }

  if (
    candidate.xCm <
      settings.edgeAllowanceCm ||
    candidate.xCm +
      candidate.widthCm >
      settings.fabricWidthCm -
        settings.edgeAllowanceCm
  ) {
    return false;
  }

  if (
    candidate.yCm <
    settings.edgeAllowanceCm
  ) {
    return false;
  }

  if (
    typeof
      settings.maximumMarkerLengthCm ===
      "number" &&
    settings.maximumMarkerLengthCm >
      0 &&
    candidate.yCm +
      candidate.heightCm >
      settings.maximumMarkerLengthCm
  ) {
    return false;
  }

  return placedPieces.every(
    (placedPiece) =>
      !rectanglesOverlap(
        {
          xCm:
            candidate.xCm,
          yCm:
            candidate.yCm,
          widthCm:
            candidate.widthCm,
          heightCm:
            candidate.heightCm,
        },
        {
          xCm:
            placedPiece.xCm,
          yCm:
            placedPiece.yCm,
          widthCm:
            placedPiece.widthCm,
          heightCm:
            placedPiece.heightCm,
        },
        settings.pieceSpacingCm
      )
  );
}

function createCandidateCoordinates(
  placedPieces:
    PlacedMarkerPiece[],
  settings:
    MarkerSettings
): {
  xCm: number;
  yCm: number;
}[] {
  const coordinates = [
    {
      xCm:
        settings.edgeAllowanceCm,
      yCm:
        settings.edgeAllowanceCm,
    },
  ];

  for (
    const placedPiece
    of placedPieces
  ) {
    coordinates.push({
      xCm:
        placedPiece.xCm +
        placedPiece.widthCm +
        settings.pieceSpacingCm,
      yCm:
        placedPiece.yCm,
    });

    coordinates.push({
      xCm:
        placedPiece.xCm,
      yCm:
        placedPiece.yCm +
        placedPiece.heightCm +
        settings.pieceSpacingCm,
    });
  }

  return coordinates
    .map((coordinate) => ({
      xCm:
        roundValue(
          coordinate.xCm
        ),
      yCm:
        roundValue(
          coordinate.yCm
        ),
    }))
    .filter(
      (
        coordinate,
        index,
        allCoordinates
      ) =>
        allCoordinates.findIndex(
          (other) =>
            other.xCm ===
              coordinate.xCm &&
            other.yCm ===
              coordinate.yCm
        ) === index
    )
    .sort(
      (first, second) =>
        first.yCm -
          second.yCm ||
        first.xCm -
          second.xCm
    );
}

function findPlacementCandidate(
  piece: MarkerPiece,
  placedPieces:
    PlacedMarkerPiece[],
  settings:
    MarkerSettings
): PlacementCandidate | null {
  const coordinates =
    createCandidateCoordinates(
      placedPieces,
      settings
    );

  const rotations =
    getAllowedRotations(
      piece,
      settings
    );

  for (
    const coordinate
    of coordinates
  ) {
    for (
      const rotation
      of rotations
    ) {
      const dimensions =
        getRotatedDimensions(
          piece,
          rotation
        );

      const candidate:
        PlacementCandidate = {
        xCm:
          coordinate.xCm,
        yCm:
          coordinate.yCm,
        rotation,
        widthCm:
          dimensions.widthCm,
        heightCm:
          dimensions.heightCm,
        transformedPolygon:
          transformPolygon(
            piece,
            rotation,
            coordinate.xCm,
            coordinate.yCm
          ),
      };

      if (
        canPlaceCandidate(
          candidate,
          placedPieces,
          settings
        )
      ) {
        return candidate;
      }
    }
  }

  return null;
}

function calculateMarkerLength(
  placedPieces:
    PlacedMarkerPiece[],
  edgeAllowanceCm: number
): number {
  if (
    placedPieces.length === 0
  ) {
    return 0;
  }

  const maximumBottom =
    Math.max(
      ...placedPieces.map(
        (piece) =>
          piece.yCm +
          piece.heightCm
      )
    );

  return roundValue(
    maximumBottom +
      edgeAllowanceCm,
    4
  );
}

function createEmptyLayout(
  input:
    MarkerGenerationInput
): MarkerLayout {
  return {
    id: [
      input.projectId,
      "marker",
      Date.now(),
    ].join("-"),

    projectId:
      input.projectId,

    fabricWidthCm:
      input.settings
        .fabricWidthCm,

    markerLengthCm: 0,

    markerAreaSqCm: 0,

    placedPieces: [],

    unplacedPieceIds:
      input.pieces.map(
        (piece) => piece.id
      ),

    createdAt:
      new Date().toISOString(),

    engineVersion:
      ENGINE_VERSION,
  };
}

export function generatePolygonMarkerLayout(
  input:
    MarkerGenerationInput
): MarkerGenerationResult {
  const warnings =
    validateSettings(
      input.settings
    );

  if (
    warnings.length > 0 ||
    input.pieces.length === 0
  ) {
    if (
      input.pieces.length === 0
    ) {
      warnings.push(
        "At least one pattern piece is required."
      );
    }

    const layout =
      createEmptyLayout(
        input
      );

    return {
      success: false,
      layout,
      statistics:
        calculateMarkerStatistics(
          layout
        ),
      warnings,
      explanation:
        "Marker generation could not begin because the input data is incomplete.",
    };
  }

  const instances =
    expandPieceInstances(
      input.pieces
    );

  const placedPieces:
    PlacedMarkerPiece[] = [];

  const unplacedPieceIds:
    string[] = [];

  for (
    const instance
    of instances
  ) {
    const candidate =
      findPlacementCandidate(
        instance.piece,
        placedPieces,
        input.settings
      );

    if (!candidate) {
      unplacedPieceIds.push(
        [
          instance.piece.id,
          instance.instanceNumber,
        ].join("-")
      );

      continue;
    }

    placedPieces.push({
      id: [
        instance.piece.id,
        instance.instanceNumber,
      ].join("-"),

      sourcePieceId:
        instance.piece.id,

      patternId:
        instance.piece
          .patternId,

      name:
        instance.piece.name,

      instanceNumber:
        instance.instanceNumber,

      xCm:
        candidate.xCm,

      yCm:
        candidate.yCm,

      rotation:
        candidate.rotation,

      widthCm:
        candidate.widthCm,

      heightCm:
        candidate.heightCm,

      areaSqCm:
        instance.piece
          .areaSqCm,

      transformedPolygon:
        candidate
          .transformedPolygon,
    });
  }

  const markerLengthCm =
    calculateMarkerLength(
      placedPieces,
      input.settings
        .edgeAllowanceCm
    );

  const layout:
    MarkerLayout = {
    id: [
      input.projectId,
      "marker",
      Date.now(),
    ].join("-"),

    projectId:
      input.projectId,

    fabricWidthCm:
      input.settings
        .fabricWidthCm,

    markerLengthCm,

    markerAreaSqCm:
      roundValue(
        input.settings
          .fabricWidthCm *
          markerLengthCm,
        4
      ),

    placedPieces,

    unplacedPieceIds,

    createdAt:
      new Date().toISOString(),

    engineVersion:
      ENGINE_VERSION,
  };

  const statistics =
    calculateMarkerStatistics(
      layout
    );

  if (
    unplacedPieceIds.length > 0
  ) {
    warnings.push(
      `${unplacedPieceIds.length} piece instance(s) could not be placed within the marker constraints.`
    );
  }

  return {
    success:
      placedPieces.length > 0 &&
      unplacedPieceIds.length ===
        0,

    layout,

    statistics,

    warnings,

    explanation:
      unplacedPieceIds.length ===
      0
        ? "The RC4-013 bottom-left placement engine generated a complete first-stage marker layout from the saved engineering polygons."
        : "The marker engine produced a partial layout. Review fabric width, rotation permissions, spacing and maximum marker length.",
  };
}

export {
  generateMarkerLayout,
} from "./markerLayoutEngineLegacy";