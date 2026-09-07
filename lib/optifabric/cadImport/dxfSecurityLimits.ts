/**
 * OptiFabric AI
 * RC5-005-002 — DXF Upload Security Limits (Step 5B §14)
 *
 * Purpose:
 * - Sensible, conservative limits checked BEFORE and DURING parsing, so a
 *   malformed or hostile DXF file cannot exhaust memory/CPU or hang the
 *   importer. This is not a full security subsystem — see the Step 5A
 *   report's explicit "do not build a large security subsystem" scope note.
 */

export const DXF_SECURITY_LIMITS = {
  /** Garment pattern DXF files are small text files; 20 MB is already generous. */
  maximumFileSizeBytes: 20 * 1024 * 1024,

  /** A single garment piece set legitimately has hundreds, not hundreds of thousands, of entities. */
  maximumEntityCount: 50_000,

  /** Per-polyline/spline vertex ceiling — guards against a pathological single entity. */
  maximumVerticesPerEntity: 20_000,

  /** INSERT/BLOCK nesting depth — this importer does not expand nested blocks at all (see dxfEntityExtraction.ts), but the limit exists as a defensive ceiling if that changes later. */
  maximumBlockRecursionDepth: 3,

  /** Garment pieces are centimetre/metre-scale, never kilometre-scale — anything past this is almost certainly a unit/parsing error, not a real pattern. */
  maximumCoordinateMagnitudeCm: 100_000,
} as const;

export interface SecurityLimitViolation {
  readonly code:
    | "fileTooLarge"
    | "tooManyEntities"
    | "entityTooLarge"
    | "coordinateMagnitudeExceeded";
  readonly message: string;
}

export function checkFileSize(fileSizeBytes: number): SecurityLimitViolation | null {
  if (fileSizeBytes > DXF_SECURITY_LIMITS.maximumFileSizeBytes) {
    return {
      code: "fileTooLarge",
      message: `File is ${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB, exceeding the ${
        DXF_SECURITY_LIMITS.maximumFileSizeBytes / (1024 * 1024)
      } MB import limit.`,
    };
  }

  return null;
}

export function checkEntityCount(entityCount: number): SecurityLimitViolation | null {
  if (entityCount > DXF_SECURITY_LIMITS.maximumEntityCount) {
    return {
      code: "tooManyEntities",
      message: `File contains ${entityCount} entities, exceeding the ${DXF_SECURITY_LIMITS.maximumEntityCount} import limit.`,
    };
  }

  return null;
}

export function checkVertexCount(
  entityDescription: string,
  vertexCount: number
): SecurityLimitViolation | null {
  if (vertexCount > DXF_SECURITY_LIMITS.maximumVerticesPerEntity) {
    return {
      code: "entityTooLarge",
      message: `${entityDescription} has ${vertexCount} vertices, exceeding the ${DXF_SECURITY_LIMITS.maximumVerticesPerEntity} per-entity limit.`,
    };
  }

  return null;
}

export function checkCoordinateMagnitude(
  valueCm: number
): SecurityLimitViolation | null {
  if (!Number.isFinite(valueCm)) {
    return {
      code: "coordinateMagnitudeExceeded",
      message: "A coordinate resolved to a non-finite value.",
    };
  }

  if (Math.abs(valueCm) > DXF_SECURITY_LIMITS.maximumCoordinateMagnitudeCm) {
    return {
      code: "coordinateMagnitudeExceeded",
      message: `A coordinate magnitude of ${valueCm.toFixed(
        1
      )} cm exceeds the ${DXF_SECURITY_LIMITS.maximumCoordinateMagnitudeCm} cm plausibility limit.`,
    };
  }

  return null;
}
