import {
  loadGeometryRecord,
} from "@/lib/optifabric/geometrySaveEngine";

import type {
  SavedGeometryRecord,
} from "@/lib/optifabric/geometrySaveTypes";

import {
  generatePolygonMarkerLayout,
} from "@/lib/optifabric/markerLayoutEngine";

import type {
  MarkerGenerationResult,
  MarkerPiece,
  MarkerRotation,
  MarkerSettings,
} from "@/lib/optifabric/markerTypes";

export interface GenerateProjectMarkerInput {
  projectId: string;

  patternIds: string[];

  fabricWidthCm: number;

  quantityPerPattern?: number;

  pieceSpacingCm?: number;

  edgeAllowanceCm?: number;

  allowRotation?: boolean;

  maximumMarkerLengthCm?: number;
}

export interface ProjectMarkerPreparationResult {
  success: boolean;

  pieces: MarkerPiece[];

  missingPatternIds: string[];

  warnings: string[];
}

function normalizePolygon(
  geometry: SavedGeometryRecord
): {
  x: number;
  y: number;
}[] {
  if (
    geometry.polygon.length === 0
  ) {
    return [];
  }

  const minimumX = Math.min(
    ...geometry.polygon.map(
      (point) => point.x
    )
  );

  const minimumY = Math.min(
    ...geometry.polygon.map(
      (point) => point.y
    )
  );

  const pixelsPerCm =
    geometry.pixelsPerCm;

  return geometry.polygon.map(
    (point) => ({
      x:
        (point.x - minimumX) /
        pixelsPerCm,

      y:
        (point.y - minimumY) /
        pixelsPerCm,
    })
  );
}

function createMarkerPiece(
  geometry: SavedGeometryRecord,
  quantity: number,
  allowRotation: boolean
): MarkerPiece {
  const allowedRotations:
    MarkerRotation[] =
    allowRotation
      ? [0, 180]
      : [0];

  return {
    id:
      `${geometry.patternId}-marker-piece`,

    patternId:
      geometry.patternId,

    name:
      geometry.patternPiece,

    quantity:
      Math.max(
        1,
        Math.floor(quantity)
      ),

    widthCm:
      geometry.widthCm,

    heightCm:
      geometry.heightCm,

    areaSqCm:
      geometry.areaSqCm,

    polygon:
      normalizePolygon(
        geometry
      ),

    grainDirection:
      "vertical",

    rotationAllowed:
      allowRotation,

    allowedRotations,
  };
}

export function prepareProjectMarkerPieces({
  projectId,
  patternIds,
  quantityPerPattern = 1,
  allowRotation = true,
}: {
  projectId: string;

  patternIds: string[];

  quantityPerPattern?: number;

  allowRotation?: boolean;
}): ProjectMarkerPreparationResult {
  const pieces: MarkerPiece[] = [];

  const missingPatternIds:
    string[] = [];

  const warnings: string[] = [];

  for (
    const patternId
    of patternIds
  ) {
    const geometry =
      loadGeometryRecord(
        projectId,
        patternId
      );

    if (!geometry) {
      missingPatternIds.push(
        patternId
      );

      continue;
    }

    if (
      !geometry.boundaryClosed ||
      geometry.vertexCount < 3 ||
      geometry.polygon.length < 3
    ) {
      missingPatternIds.push(
        patternId
      );

      warnings.push(
        `${geometry.patternPiece} does not contain valid saved polygon geometry.`
      );

      continue;
    }

    pieces.push(
      createMarkerPiece(
        geometry,
        quantityPerPattern,
        allowRotation
      )
    );
  }

  if (
    missingPatternIds.length > 0
  ) {
    warnings.push(
      `${missingPatternIds.length} pattern geometry record(s) could not be loaded.`
    );
  }

  if (pieces.length === 0) {
    warnings.push(
      "No marker-ready saved geometry records were available."
    );
  }

  return {
    success:
      pieces.length > 0,

    pieces,

    missingPatternIds,

    warnings,
  };
}

function createMarkerSettings(
  input:
    GenerateProjectMarkerInput
): MarkerSettings {
  return {
    fabricWidthCm:
      input.fabricWidthCm,

    pieceSpacingCm:
      input.pieceSpacingCm ??
      0.5,

    edgeAllowanceCm:
      input.edgeAllowanceCm ??
      1,

    allowRotation:
      input.allowRotation ??
      true,

    grainDirection:
      "vertical",

    maximumMarkerLengthCm:
      input.maximumMarkerLengthCm,
  };
}

export function generateProjectMarkerLayout(
  input:
    GenerateProjectMarkerInput
): MarkerGenerationResult {
  const preparation =
    prepareProjectMarkerPieces({
      projectId:
        input.projectId,

      patternIds:
        input.patternIds,

      quantityPerPattern:
        input.quantityPerPattern,

      allowRotation:
        input.allowRotation,
    });

  const settings =
    createMarkerSettings(
      input
    );

  if (
    !preparation.success
  ) {
    const emptyResult =
      generatePolygonMarkerLayout({
        projectId:
          input.projectId,

        pieces: [],

        settings,
      });

    return {
      ...emptyResult,

      warnings: [
        ...preparation.warnings,
        ...emptyResult.warnings,
      ],

      explanation:
        "Project marker generation could not begin because no valid saved pattern geometry was available.",
    };
  }

  const result =
    generatePolygonMarkerLayout({
      projectId:
        input.projectId,

      pieces:
        preparation.pieces,

      settings,
    });

  return {
    ...result,

    warnings: [
      ...preparation.warnings,
      ...result.warnings,
    ],

    explanation:
      result.success
        ? "Saved engineering geometry was converted into marker-ready centimetre polygons and successfully transferred to the RC4-013 placement engine."
        : result.explanation,
  };
}

export const markerLayoutProjectEngine = {
  prepareProjectMarkerPieces,

  generateProjectMarkerLayout,
};

export default markerLayoutProjectEngine;