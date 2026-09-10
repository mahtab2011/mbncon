// The frontend currently has two non-interchangeable in-flight geometry
// shapes (see PatternGeometry model comment in schema.prisma) — this DTO is
// deliberately shape-agnostic on the contents of each field rather than
// picking one, and just requires that a polygon is present.
export class UpsertPatternGeometryDto {
  polygon!: unknown;
  calibration?: unknown;
  grainLine?: unknown;
  measurements?: unknown;
}
