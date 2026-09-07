import {
  SavedGeometryRecord,
} from "@/lib/optifabric/geometrySaveTypes";

interface CreateSavedGeometryInput {
  projectId: string;

  patternId: string;

  garmentType: string;

  patternPiece: string;

  widthCm: number;

  heightCm: number;

  areaSqCm: number;

  perimeterCm: number;

  pixelArea: number;

  pixelsPerCm: number;

  boundaryClosed: boolean;

  boundaryQualityScore: number;

  boundingBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };

  grainLineLengthCm?: number;

  polygon: {
    x: number;
    y: number;
  }[];
}

export interface GeometryValidationResult {
  valid: boolean;

  errors: string[];
}

const GEOMETRY_VERSION = "RC4-013";

function createRecordId(
  projectId: string,
  patternId: string
): string {
  return [
    projectId,
    patternId,
    "geometry",
  ].join("-");
}

function calculateOrientation(
  widthCm: number,
  heightCm: number
): "portrait" | "landscape" {
  return heightCm >= widthCm
    ? "portrait"
    : "landscape";
}

export function validateSavedGeometry(
  record: SavedGeometryRecord
): GeometryValidationResult {
  const errors: string[] = [];

  if (!record.projectId.trim()) {
    errors.push(
      "Project ID is required."
    );
  }

  if (!record.patternId.trim()) {
    errors.push(
      "Pattern ID is required."
    );
  }

  if (!record.garmentType.trim()) {
    errors.push(
      "Garment type is required."
    );
  }

  if (!record.patternPiece.trim()) {
    errors.push(
      "Pattern piece name is required."
    );
  }

  if (!record.boundaryClosed) {
    errors.push(
      "The pattern boundary must be closed."
    );
  }

  if (record.vertexCount < 3) {
    errors.push(
      "At least three polygon vertices are required."
    );
  }

  if (
    record.polygon.length !==
    record.vertexCount
  ) {
    errors.push(
      "Polygon vertex count does not match the saved geometry record."
    );
  }

  if (
    !Number.isFinite(
      record.pixelsPerCm
    ) ||
    record.pixelsPerCm <= 0
  ) {
    errors.push(
      "A valid scale calibration is required."
    );
  }

  if (
    !Number.isFinite(
      record.widthCm
    ) ||
    record.widthCm <= 0
  ) {
    errors.push(
      "Pattern width must be greater than zero."
    );
  }

  if (
    !Number.isFinite(
      record.heightCm
    ) ||
    record.heightCm <= 0
  ) {
    errors.push(
      "Pattern height must be greater than zero."
    );
  }

  if (
    !Number.isFinite(
      record.areaSqCm
    ) ||
    record.areaSqCm <= 0
  ) {
    errors.push(
      "Pattern area must be greater than zero."
    );
  }

  if (
    !Number.isFinite(
      record.perimeterCm
    ) ||
    record.perimeterCm <= 0
  ) {
    errors.push(
      "Pattern perimeter must be greater than zero."
    );
  }

  if (
    !Number.isFinite(
      record.pixelArea
    ) ||
    record.pixelArea <= 0
  ) {
    errors.push(
      "Pixel area must be greater than zero."
    );
  }

  if (
    !Number.isFinite(
      record.boundaryQualityScore
    ) ||
    record.boundaryQualityScore < 0 ||
    record.boundaryQualityScore > 100
  ) {
    errors.push(
      "Boundary quality score must be between 0 and 100."
    );
  }

  if (
    record.boundingBox.width <= 0 ||
    record.boundingBox.height <= 0
  ) {
    errors.push(
      "Bounding box dimensions must be greater than zero."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function createSavedGeometryRecord(
  input: CreateSavedGeometryInput
): SavedGeometryRecord {
  const savedAt =
    new Date().toISOString();

  const record:
    SavedGeometryRecord = {
      id: createRecordId(
        input.projectId,
        input.patternId
      ),

      projectId: input.projectId,

      patternId: input.patternId,

      garmentType:
        input.garmentType,

      patternPiece:
        input.patternPiece,

      widthCm: input.widthCm,

      heightCm: input.heightCm,

      areaSqCm: input.areaSqCm,

      perimeterCm:
        input.perimeterCm,

      pixelArea: input.pixelArea,

      pixelsPerCm:
        input.pixelsPerCm,

      vertexCount:
        input.polygon.length,

      boundaryClosed:
        input.boundaryClosed,

      boundaryQualityScore:
        input.boundaryQualityScore,

      boundingBox: {
        left:
          input.boundingBox.left,

        top:
          input.boundingBox.top,

        width:
          input.boundingBox.width,

        height:
          input.boundingBox.height,
      },

      grainLineLengthCm:
        input.grainLineLengthCm,

      orientation:
        calculateOrientation(
          input.widthCm,
          input.heightCm
        ),

      geometryVersion:
        GEOMETRY_VERSION,

      savedAt,

      polygon: input.polygon.map(
        (point) => ({
          x: point.x,
          y: point.y,
        })
      ),
    };

  const validation =
    validateSavedGeometry(record);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join(" ")
    );
  }

  return record;
}

export function saveGeometryRecord(
  record: SavedGeometryRecord
): void {
  const validation =
    validateSavedGeometry(record);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join(" ")
    );
  }

  const storageKey =
    createGeometryStorageKey(
      record.projectId,
      record.patternId
    );

  localStorage.setItem(
    storageKey,
    JSON.stringify(record)
  );
}

export function loadGeometryRecord(
  projectId: string,
  patternId: string
): SavedGeometryRecord | null {
  const storageKey =
    createGeometryStorageKey(
      projectId,
      patternId
    );

  const storedValue =
    localStorage.getItem(
      storageKey
    );

  if (!storedValue) {
    return null;
  }

  try {
    const record =
      JSON.parse(
        storedValue
      ) as SavedGeometryRecord;

    const validation =
      validateSavedGeometry(record);

    if (!validation.valid) {
      return null;
    }

    return record;
  } catch {
    return null;
  }
}

export function deleteGeometryRecord(
  projectId: string,
  patternId: string
): void {
  localStorage.removeItem(
    createGeometryStorageKey(
      projectId,
      patternId
    )
  );
}

export function createGeometryStorageKey(
  projectId: string,
  patternId: string
): string {
  return [
    "optifabric",
    "geometry",
    projectId,
    patternId,
  ].join("-");
}

export const geometrySaveEngine = {
  createSavedGeometryRecord,

  validateSavedGeometry,

  saveGeometryRecord,

  loadGeometryRecord,

  deleteGeometryRecord,

  createGeometryStorageKey,
};

export default geometrySaveEngine;