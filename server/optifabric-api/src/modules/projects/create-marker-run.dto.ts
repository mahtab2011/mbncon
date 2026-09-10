// The backend never computes a marker/nesting layout itself (no algorithm
// changes in Stage 1) — this just records what the client's own
// markerLayoutProjectEngine already computed.
export class CreateMarkerRunDto {
  snapshot!: unknown;
  result!: unknown;
}
