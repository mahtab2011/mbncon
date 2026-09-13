// Mirrors lib/optifabric/marker/fabricProfileTypes.ts's FabricProfile
// interface field-for-field (same pairing the FabricProfile Prisma model's
// own comment already documents) — every field the client may set.
// Deliberately excludes id/projectId/createdAt/updatedAt: projectId comes
// from the route param, the rest are Prisma-managed and never
// client-writable — see ProjectsService.validateFabricProfileFields, which
// maps each of these fields explicitly rather than spreading this DTO, so
// no unexpected property can ever reach the database.
//
// PUT is a full create-or-replace (same idiom as UpsertPatternGeometryDto) —
// every field below is required except where FabricProfile itself declares
// it optional; an omitted optional field clears that column to null rather
// than leaving a stale value from a previous save.
export class UpsertFabricProfileDto {
  fabricType!: string;
  construction!: string;

  grainControl!: string;
  faceDirection!: string;
  nap!: string;
  allowableRotation!: string;
  stretch!: string;
  knitOrientation?: string;

  lengthWarpShrinkagePercent?: number;
  widthWeftShrinkagePercent?: number;

  matchingRequirement!: string;
  horizontalRepeat?: number;
  verticalRepeat?: number;
  repeatUnit?: string;

  directionalFabric!: string;

  nominalFabricWidthCm?: number;
  usableFabricWidthCm!: number;
  fabricWidthUnit!: string;

  maximumMarkerLengthOption!: string;
  maximumMarkerLengthCm!: number | null;
}
