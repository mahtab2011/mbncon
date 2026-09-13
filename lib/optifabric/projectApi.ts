// Stage 2A — thin adapter over OptiFabric's persistence backend
// (server/optifabric-api's /projects routes). Deliberately does NOT
// duplicate any auth/token logic — every call goes through the existing
// apiFetch (lib/optifabric/apiClient.ts), which already owns the Bearer
// token, 401 handling and JSON parsing.
//
// Field names here mirror the backend's CreateProjectDto/UpdateProjectDto/
// Project response exactly (server/optifabric-api/src/modules/projects) —
// see that module for the authoritative shape. mainCategory/subcategory are
// optional, mirroring EngineeringProject's own garmentMainCategory?/
// garmentSubcategory? (lib/optifabric/projectMaster.ts).
import { apiFetch } from "./apiClient";
import type { EngineeringProject, PatternStatus } from "./projectMaster";
import type { GeometryPoint } from "./patternGeometryTypes";
import { calculateBoundingBox } from "./patternGeometryEngine";
import type { SavedGeometryRecord } from "./geometrySaveTypes";
import type { PatternTracingProjectFields } from "./patternTracingTypes";

// A PatternGeometry row as returned by the backend (server/optifabric-api
// PatternGeometry model) — the four Json fields are opaque/shape-agnostic
// there (see that model's own schema.prisma comment), so they're typed
// `unknown` here too rather than assuming one particular frontend shape.
export interface ServerPatternGeometry {
  id: string;
  patternPieceId: string;
  polygonJson: unknown;
  calibrationJson: unknown;
  grainLineJson: unknown;
  measurementJson: unknown;
  createdAt: string;
  updatedAt: string;
}

// PatternPiece core fields as returned by the backend (server/optifabric-api
// PatternPiece model) — deliberately narrower than the frontend's
// PatternStatus: no uploaded/recognised/file*/visibility flags, since Stage
// 1 only persists engineering-ownership fields, not upload/UI state.
export interface ServerPatternPiece {
  id: string;
  projectId: string;
  patternId: string;
  name: string;
  sequence: number;
  cutQuantity: number;
  cutOnFold: boolean;
  required: boolean;
  custom: boolean;
  createdAt: string;
  updatedAt: string;
  // Present on GET /projects/:id (Stage 2B-1); null when no geometry has
  // been saved for this piece yet.
  geometry?: ServerPatternGeometry | null;
}

export interface ServerProject {
  id: string;
  factoryId: string;
  createdByUserId: string;
  code: string;
  name: string;
  customer: string;
  styleNumber: string;
  garmentCategory: string;
  mainCategory: string | null;
  subcategory: string | null;
  fabricWidth: number;
  orderQuantity: number;
  scaleLength: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Present on POST /projects (the pieces just created) and GET
  // /projects/:id (all persisted pieces) — absent on the list endpoint.
  patternPieces?: ServerPatternPiece[];
}

// The subset of PatternPiece fields POST /projects accepts for bulk initial
// creation — mirrors UpdatePatternPieceDto plus the patternId that endpoint
// normally takes from the URL (see server/optifabric-api's
// InitialPatternPieceDto).
export interface InitialPatternPieceInput {
  patternId: string;
  name: string;
  sequence?: number;
  cutQuantity?: number;
  cutOnFold?: boolean;
  required?: boolean;
  custom?: boolean;
}

export interface CreateProjectInput {
  name: string;
  customer: string;
  styleNumber: string;
  garmentCategory: string;
  mainCategory?: string;
  subcategory?: string;
  fabricWidth: number;
  orderQuantity: number;
  scaleLength: number;
  patterns?: InitialPatternPieceInput[];
}

export function createProject(input: CreateProjectInput): Promise<ServerProject> {
  return apiFetch<ServerProject>("/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function listProjects(options?: { archived?: boolean }): Promise<ServerProject[]> {
  const query = options?.archived ? "?archived=true" : "";
  return apiFetch<ServerProject[]>(`/projects${query}`);
}

export function getProject(id: string): Promise<ServerProject> {
  return apiFetch<ServerProject>(`/projects/${id}`);
}

// Mirrors the backend's UpsertPatternGeometryDto exactly (server/
// optifabric-api's PUT /projects/:projectId/patterns/:patternId/geometry) —
// polygon is required, the rest optional. `patternId` here is always the
// plain client-side pattern id (e.g. "front-body"); the backend derives its
// own composite primary key internally — callers never need to know it.
export interface SavePatternGeometryInput {
  polygon: unknown;
  calibration?: unknown;
  grainLine?: unknown;
  measurements?: unknown;
}

export function savePatternGeometry(
  projectId: string,
  patternId: string,
  geometry: SavePatternGeometryInput,
): Promise<ServerPatternGeometry> {
  return apiFetch<ServerPatternGeometry>(
    `/projects/${projectId}/patterns/${encodeURIComponent(patternId)}/geometry`,
    { method: "PUT", body: JSON.stringify(geometry) },
  );
}

// The server-authoritative fields carried alongside a cached
// EngineeringProject once a project is backed by the server — presence of
// this key is how the frontend distinguishes a server-backed project from a
// legacy local-only one (see app/optifabric/project/new/page.tsx and
// app/optifabric/projects/page.tsx). Deliberately narrow: only identity/
// core-field metadata, never patterns/geometry — those stay local-only
// until a later stage migrates them.
export interface ServerProjectMeta {
  code: string;
  updatedAt: string;
  archivedAt: string | null;
}

export type CachedProject = EngineeringProject & {
  _server?: ServerProjectMeta;
};

// apiFetch throws a plain Error("API request failed (${status}): ${body}")
// — this pulls the status back out without needing apiClient.ts itself to
// change (not in Stage 2A's allowed file list) or a second HTTP layer.
export function extractStatusCode(error: unknown): number | null {
  if (!(error instanceof Error)) return null;
  const match = error.message.match(/^API request failed \((\d+)\)/);
  return match ? Number(match[1]) : null;
}

// Frontend PatternStatus -> the backend's initial-pattern-piece shape, used
// by the create flow to persist the standard garment pattern set
// (createEngineeringProject's own patterns[]) atomically with the project.
// Only the core ownership fields the backend actually stores are sent —
// upload/recognition/visibility state is UI-only and never existed
// server-side (see ServerPatternPiece).
export function mapPatternsToInitialPatterns(
  patterns: PatternStatus[],
): InitialPatternPieceInput[] {
  return patterns.map((pattern) => ({
    patternId: pattern.id,
    name: pattern.name,
    sequence: pattern.sequence,
    cutQuantity: pattern.cutQuantity,
    cutOnFold: pattern.cutOnFold,
    required: pattern.required,
    custom: pattern.custom,
  }));
}

// -- Stage 2B-1: finalized PatternGeometry reconstruction --------------------
//
// PatternGeometry's Json fields are opaque/shape-agnostic on the backend, so
// these readers defensively pick out only the fields this codebase's own
// save path (see the trace page's saveGeometry()) is known to write, and
// return undefined for anything absent/malformed rather than guessing.
function readNumberField(source: unknown, key: string): number | undefined {
  if (!source || typeof source !== "object") return undefined;
  const value = (source as Record<string, unknown>)[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readOrientationField(source: unknown): "portrait" | "landscape" | undefined {
  if (!source || typeof source !== "object") return undefined;
  const value = (source as Record<string, unknown>).orientation;
  return value === "portrait" || value === "landscape" ? value : undefined;
}

// Same two tolerated polygon shapes the backend's own validation accepts
// (see ProjectsService.polygonPointCount) — a plain point array, or an
// object carrying its points under `.points`.
function readPolygonPoints(polygon: unknown): GeometryPoint[] {
  const isPoint = (value: unknown): value is GeometryPoint =>
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as { x?: unknown }).x === "number" &&
    typeof (value as { y?: unknown }).y === "number";

  const candidate = Array.isArray(polygon)
    ? polygon
    : polygon && typeof polygon === "object" && Array.isArray((polygon as { points?: unknown }).points)
      ? (polygon as { points: unknown[] }).points
      : [];

  return candidate.filter(isPoint).map((point) => ({ x: point.x, y: point.y }));
}

// One ServerPatternPiece's geometry -> the flat local fallback fields the
// pattern-tracing page (app/optifabric/project/[projectId]/patterns/
// [patternId]/trace/page.tsx) already reads as first-priority fields on a
// project's pattern entry (its own polygonVertices ?? geometryVertices ??
// patternTracing?.boundary.vertices chain, etc.) — so a reconstructed
// project "just works" there without that page needing any changes.
// Deliberately does NOT fabricate a full patternTracing/
// SavedPatternTracingData object: that requires image metadata (fileName,
// naturalWidth, ...) which is never persisted server-side, and inventing it
// would violate "reconstruct only what is supported by actual persisted
// server data."
function mapGeometryToTracingProjectFields(
  geometry: ServerPatternGeometry,
): Partial<PatternTracingProjectFields> {
  const polygon = readPolygonPoints(geometry.polygonJson);
  if (polygon.length === 0) return {};

  const pixelsPerCm =
    readNumberField(geometry.measurementJson, "pixelsPerCm") ??
    readNumberField(geometry.calibrationJson, "pixelsPerCm");
  const pixelsPerInch = readNumberField(geometry.calibrationJson, "pixelsPerInch");

  return {
    polygonVertices: polygon,
    geometryVertices: polygon,
    ...(pixelsPerCm !== undefined ? { pixelsPerCm } : {}),
    ...(pixelsPerInch !== undefined ? { pixelsPerInch } : {}),
    calibratedWidthCm: readNumberField(geometry.measurementJson, "widthCm"),
    calibratedHeightCm: readNumberField(geometry.measurementJson, "heightCm"),
    calibratedAreaSqCm: readNumberField(geometry.measurementJson, "areaSqCm"),
    calibratedPerimeterCm: readNumberField(geometry.measurementJson, "perimeterCm"),
    geometryTracingCompleted: true,
    geometryTracingCompletedAt: geometry.updatedAt,
  };
}

// One ServerPatternPiece's geometry -> a SavedGeometryRecord, matching
// exactly what lib/optifabric/geometrySaveEngine.ts's own
// createSavedGeometryRecord()/saveGeometryRecord() would have produced
// locally — so the trace page's independent
// loadGeometryRecord(projectId, patternId) call (a SEPARATE localStorage key
// from the main project object) finds it and shows "Saved: YES" on a fresh
// device, exactly as it would if this browser had saved it originally.
// geometryVersion is set to a distinct marker (not a fabricated RC4-013
// client-engine tag) since this record was assembled from server data, not
// produced by a specific local tracing session.
function mapPieceGeometryToSavedGeometryRecord(
  serverProject: ServerProject,
  piece: ServerPatternPiece,
): SavedGeometryRecord | null {
  if (!piece.geometry) return null;

  const polygon = readPolygonPoints(piece.geometry.polygonJson);
  if (polygon.length === 0) return null;

  const boundingBoxSource = calculateBoundingBox(polygon);
  const pixelsPerCm =
    readNumberField(piece.geometry.measurementJson, "pixelsPerCm") ??
    readNumberField(piece.geometry.calibrationJson, "pixelsPerCm") ??
    0;

  return {
    id: `${serverProject.id}-${piece.patternId}-geometry`,
    projectId: serverProject.id,
    patternId: piece.patternId,
    garmentType: serverProject.name,
    patternPiece: piece.name,
    widthCm: readNumberField(piece.geometry.measurementJson, "widthCm") ?? 0,
    heightCm: readNumberField(piece.geometry.measurementJson, "heightCm") ?? 0,
    areaSqCm: readNumberField(piece.geometry.measurementJson, "areaSqCm") ?? 0,
    perimeterCm: readNumberField(piece.geometry.measurementJson, "perimeterCm") ?? 0,
    pixelArea: readNumberField(piece.geometry.measurementJson, "pixelArea") ?? 0,
    pixelsPerCm,
    vertexCount: readNumberField(piece.geometry.measurementJson, "vertexCount") ?? polygon.length,
    // Only ever true here: the trace page only PUTs geometry once its own
    // geometryReady check (which requires a closed boundary) has passed.
    boundaryClosed: true,
    boundaryQualityScore: readNumberField(piece.geometry.measurementJson, "boundaryQualityScore") ?? 0,
    boundingBox: {
      left: boundingBoxSource.minX,
      top: boundingBoxSource.minY,
      width: boundingBoxSource.width,
      height: boundingBoxSource.height,
    },
    orientation: readOrientationField(piece.geometry.measurementJson) ?? "portrait",
    geometryVersion: "server-reconstructed",
    savedAt: piece.geometry.updatedAt,
    polygon,
  };
}

// GET /projects/:id's patternPieces -> the SavedGeometryRecord[] this
// project's saved pieces would produce, for the caller to persist under
// each piece's own optifabric-geometry-{projectId}-{patternId} key (via
// geometrySaveEngine's saveGeometryRecord) alongside the main project cache
// — see app/optifabric/project/[projectId]/page.tsx's fresh-device branch.
// Used for genuinely fresh devices (no prior local cache at all); an
// already-cached server project instead goes through
// reconcileCachedPatternsWithServer below, which is more conservative about
// not overwriting local work.
export function extractSavedGeometryRecords(serverProject: ServerProject): SavedGeometryRecord[] {
  const records: SavedGeometryRecord[] = [];
  for (const piece of serverProject.patternPieces ?? []) {
    const record = mapPieceGeometryToSavedGeometryRecord(serverProject, piece);
    if (record) records.push(record);
  }
  return records;
}

// -- Stage 2B-2: already-cached project reconciliation -----------------------
//
// Stage 2B-1 (extractSavedGeometryRecords / mapServerProjectToCachedProject
// above) only ever runs for a genuinely fresh device with no local cache at
// all. A server-backed project that IS already cached locally previously
// refreshed only its project-level identity fields on load (see
// app/optifabric/project/[projectId]/page.tsx) and never touched
// patterns/geometry — so geometry saved on another device never appeared
// here. This closes that gap by reconciling the existing local patterns[]
// against the same GET /projects/:id response, reusing
// mapGeometryToTracingProjectFields / mapPieceGeometryToSavedGeometryRecord
// rather than a second reconstruction system.
//
// Merge policy:
//  - A piece present on both sides has its core ownership fields
//    (name/sequence/cutQuantity/cutOnFold/required/custom) always follow the
//    server, same as the project-level identity fields the refresh branch
//    already overwrites unconditionally elsewhere. Its geometry-derived
//    fields only follow the server when the server's saved geometry is
//    strictly newer than this browser's own geometryTracingCompletedAt (or
//    this browser has none yet) — a local trace at least as recent as the
//    server's copy is left untouched rather than clobbered, which is what
//    protects unsaved/in-progress local tracing work. patternTracing (image
//    metadata, never persisted server-side) is never touched here, same
//    restriction as the fresh-device path.
//  - A piece present on the server but not locally (a pattern piece added
//    on another device) is appended, built the same way a brand-new
//    fresh-device piece is built.
//  - A piece present locally but not on the server is left exactly as-is —
//    this stage never deletes a local pattern piece.
export function reconcileCachedPatternsWithServer(
  serverProject: ServerProject,
  localPatterns: PatternStatus[],
): {
  patterns: PatternStatus[];
  geometryRecordsToPersist: SavedGeometryRecord[];
} {
  const localById = new Map(localPatterns.map((pattern) => [pattern.id, pattern]));
  const serverPatternIds = new Set(
    (serverProject.patternPieces ?? []).map((piece) => piece.patternId),
  );
  const geometryRecordsToPersist: SavedGeometryRecord[] = [];

  const reconciledFromServer: PatternStatus[] = (serverProject.patternPieces ?? []).map(
    (piece) => {
      const serverCoreFields = {
        name: piece.name,
        required: piece.required,
        cutQuantity: piece.cutQuantity,
        cutOnFold: piece.cutOnFold,
        custom: piece.custom,
        sequence: piece.sequence,
      };

      const local = localById.get(piece.patternId) as
        | (PatternStatus & Partial<PatternTracingProjectFields>)
        | undefined;

      if (!local) {
        const geometryRecord = piece.geometry
          ? mapPieceGeometryToSavedGeometryRecord(serverProject, piece)
          : null;
        if (geometryRecord) geometryRecordsToPersist.push(geometryRecord);

        return {
          id: piece.patternId,
          uploaded: false,
          recognised: false,
          ...serverCoreFields,
          ...(piece.geometry ? mapGeometryToTracingProjectFields(piece.geometry) : {}),
        } as PatternStatus;
      }

      const localGeometryAt = local.geometryTracingCompletedAt
        ? Date.parse(local.geometryTracingCompletedAt)
        : NaN;
      const serverGeometryAt = piece.geometry ? Date.parse(piece.geometry.updatedAt) : NaN;

      const serverGeometryIsNewer =
        Boolean(piece.geometry) &&
        !Number.isNaN(serverGeometryAt) &&
        (Number.isNaN(localGeometryAt) || serverGeometryAt > localGeometryAt);

      if (!serverGeometryIsNewer) {
        return { ...local, ...serverCoreFields };
      }

      const geometryRecord = mapPieceGeometryToSavedGeometryRecord(serverProject, piece);
      if (geometryRecord) geometryRecordsToPersist.push(geometryRecord);

      return {
        ...local,
        ...serverCoreFields,
        ...mapGeometryToTracingProjectFields(piece.geometry as ServerPatternGeometry),
      };
    },
  );

  const localOnlyPatterns = localPatterns.filter(
    (pattern) => !serverPatternIds.has(pattern.id),
  );

  return {
    patterns: [...reconciledFromServer, ...localOnlyPatterns],
    geometryRecordsToPersist,
  };
}

// Server response -> a local working EngineeringProject cache, used to
// reconstruct a server-backed project on a device/browser with no existing
// optifabric-project-{id} entry (see app/optifabric/project/[projectId]/
// page.tsx). Patterns come only from serverProject.patternPieces (never
// invented); each pattern's finalized geometry (Stage 2B-1), when present,
// is reconstructed via mapGeometryToTracingProjectFields — never marker/AI
// results, which are never persisted server-side at all.
//
// Important id mapping: a ServerPatternPiece's own `id` is the backend's
// composite primary key (`${projectId}-${patternId}`) — NOT what the rest
// of the frontend addresses a pattern by. Every existing page identifies a
// pattern piece by the plain `patternId` (e.g. "front-body"), so the
// reconstructed PatternStatus.id must be `patternId`, not the composite id.
export function mapServerProjectToCachedProject(
  serverProject: ServerProject,
): CachedProject {
  const patterns: PatternStatus[] = (serverProject.patternPieces ?? []).map(
    (piece) => ({
      id: piece.patternId,
      name: piece.name,
      required: piece.required,
      cutQuantity: piece.cutQuantity,
      cutOnFold: piece.cutOnFold,
      custom: piece.custom,
      sequence: piece.sequence,
      uploaded: false,
      recognised: false,
      ...(piece.geometry ? mapGeometryToTracingProjectFields(piece.geometry) : {}),
    }),
  );

  return {
    id: serverProject.id,
    projectName: serverProject.name,
    customer: serverProject.customer,
    styleNumber: serverProject.styleNumber,
    garmentCategory:
      serverProject.garmentCategory as EngineeringProject["garmentCategory"],
    garmentMainCategory:
      (serverProject.mainCategory as
        | EngineeringProject["garmentMainCategory"]
        | null) ?? undefined,
    garmentSubcategory:
      (serverProject.subcategory as
        | EngineeringProject["garmentSubcategory"]
        | null) ?? undefined,
    fabricWidth: serverProject.fabricWidth,
    orderQuantity: serverProject.orderQuantity,
    scaleLength: serverProject.scaleLength,
    createdAt: serverProject.createdAt,
    patterns,
    _server: {
      code: serverProject.code,
      updatedAt: serverProject.updatedAt,
      archivedAt: serverProject.archivedAt,
    },
  };
}
