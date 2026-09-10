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

// Server response -> a local working EngineeringProject cache, used to
// reconstruct a server-backed project on a device/browser with no existing
// optifabric-project-{id} entry (see app/optifabric/project/[projectId]/
// page.tsx). Deliberately does not fabricate anything: patterns come only
// from serverProject.patternPieces (never invented), and no geometry/marker
// state is created — those remain local-only until a later stage.
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
