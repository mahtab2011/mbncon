"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  calculateBoundingBoxUtilisation,
  generateProjectGeometry,
  getValidGeometryPatterns,
  PatternGeometryInput,
  sortPatternsForPacking,
} from "@/lib/optifabric/patternGeometryEngine";

import {
  GeometryPoint,
  GeometryProjectSummary,
  GeometryRotation,
  PatternGeometryResult,
} from "@/lib/optifabric/patternGeometryTypes";

import {
  EngineeringProject,
  PatternStatus,
} from "@/lib/optifabric/projectMaster";

import {
  updateProjectRegistryEntry,
} from "@/lib/optifabric/projectRegistry";

import {
  MarkerRotationRule,
  RecognisedPatternPiece,
} from "@/lib/optifabric/patternRecognitionTypes";

import {
  MarkerWorkspacePanel,
} from "@/components/marker";

import GeometryCompletionPanel from "@/components/optifabric/geometry/GeometryCompletionPanel";

import {
  createGeometryCompletionSummary,
} from "@/lib/optifabric/geometry/geometryCompletionEngine";

interface ProjectPatternStatus extends PatternStatus {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;

  scaleVisible?: boolean;
  grainLineVisible?: boolean;
  notchesVisible?: boolean;
  validationPassed?: boolean;

  materialCategory?: string;

  includedInStyle?: boolean;
  includeInMarker?: boolean;
  styleMaterialCategory?: string;
  styleCutQuantity?: number;
  styleCutOnFold?: boolean;
  styleRequired?: boolean;
  styleSelectionNotes?: string;

  imageUrl?: string;

  detectedWidthPixels?: number;
  detectedHeightPixels?: number;

  calibratedWidthCm?: number;
  calibratedHeightCm?: number;
  calibratedAreaSqCm?: number;
  calibratedPerimeterCm?: number;

  geometryVertices?: GeometryPoint[];
  polygonVertices?: GeometryPoint[];
  tracedVertices?: GeometryPoint[];
  tracedPoints?: GeometryPoint[];
  boundaryPoints?: GeometryPoint[];
  points?: GeometryPoint[];

  pixelsPerCm?: number;
  pixelsPerInch?: number;
}

interface SavedRecognitionData {
  completed: boolean;
  completedAt?: string;

  averageConfidence: number;
  totalPatterns: number;
  recognisedPatterns: number;
  reviewRequired: number;
  rejectedPatterns: number;
  markerEligiblePatterns: number;

  patterns: RecognisedPatternPiece[];
}

interface PendingGeometryPattern {
  patternId: string;
  recognisedName: string;
  originalName: string;

  markerEligible: boolean;
  reason: string;

  uploaded: boolean;
  validationPassed: boolean;

  hasCalibration: boolean;
  hasBoundary: boolean;

  cutQuantity: number;
  cutOnFold: boolean;

  materialCategory: string;
}

interface SavedGeometryData {
  completed: boolean;
  completedAt?: string;

  totalRecognitionPatterns: number;
  geometryReadyPatterns: number;
  geometryPendingPatterns: number;
  validGeometryPatterns: number;
  markerReadyPatterns: number;

  summary: GeometryProjectSummary;

  patterns: PatternGeometryResult[];
  pendingPatterns: PendingGeometryPattern[];
}

interface GeometryProject
  extends Omit<EngineeringProject, "patterns"> {
  patterns: ProjectPatternStatus[];

  patternValidationCompleted?: boolean;
  patternValidationCompletedAt?: string;

  stylePatternSelectionCompleted?: boolean;
  stylePatternSelectionCompletedAt?: string;
  stylePatternSelectionLocked?: boolean;
  stylePatternSelectionLockedAt?: string;

  aiRecognition?: SavedRecognitionData;
  aiGeometry?: SavedGeometryData;

  updatedAt?: string;
}

type GeometryFilter =
  | "all"
  | "ready"
  | "pending"
  | "marker"
  | "fold"
  | "paired";

interface GeometrySourceRecord {
  recognition: RecognisedPatternPiece;
  projectPattern?: ProjectPatternStatus;
}

function formatNumber(
  value: number | undefined,
  decimals = 2
): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value.toFixed(decimals);
}

function formatPercentage(value: number): string {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${Math.round(value * 100)}%`;
}

function formatLabel(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function normalisePointArray(
  value: unknown
): GeometryPoint[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is GeometryPoint => {
      if (
        typeof item !== "object" ||
        item === null
      ) {
        return false;
      }

      const candidate =
        item as Partial<GeometryPoint>;

      return (
        typeof candidate.x === "number" &&
        Number.isFinite(candidate.x) &&
        typeof candidate.y === "number" &&
        Number.isFinite(candidate.y)
      );
    })
    .map((point) => ({
      x: point.x,
      y: point.y,
    }));
}

function extractPatternVertices(
  pattern?: ProjectPatternStatus
): GeometryPoint[] {
  if (!pattern) {
    return [];
  }

  const possibleSources: unknown[] = [
    pattern.geometryVertices,
    pattern.polygonVertices,
    pattern.tracedVertices,
    pattern.tracedPoints,
    pattern.boundaryPoints,
    pattern.points,
  ];

  for (const source of possibleSources) {
    const points =
      normalisePointArray(source);

    if (points.length >= 3) {
      return points;
    }
  }

  return [];
}

function calculatePixelsPerCm(
  pattern?: ProjectPatternStatus
): number | undefined {
  if (!pattern) {
    return undefined;
  }

  if (
    typeof pattern.pixelsPerCm === "number" &&
    pattern.pixelsPerCm > 0
  ) {
    return pattern.pixelsPerCm;
  }

  if (
    typeof pattern.pixelsPerInch === "number" &&
    pattern.pixelsPerInch > 0
  ) {
    return pattern.pixelsPerInch / 2.54;
  }

  if (
    typeof pattern.detectedWidthPixels === "number" &&
    pattern.detectedWidthPixels > 0 &&
    typeof pattern.calibratedWidthCm === "number" &&
    pattern.calibratedWidthCm > 0
  ) {
    return (
      pattern.detectedWidthPixels /
      pattern.calibratedWidthCm
    );
  }

  if (
    typeof pattern.detectedHeightPixels === "number" &&
    pattern.detectedHeightPixels > 0 &&
    typeof pattern.calibratedHeightCm === "number" &&
    pattern.calibratedHeightCm > 0
  ) {
    return (
      pattern.detectedHeightPixels /
      pattern.calibratedHeightCm
    );
  }

  return undefined;
}

function convertRecognitionRotation(
  rotation: MarkerRotationRule
): GeometryRotation {
  if (rotation === "rotate-180") {
    return "rotate-180";
  }

  if (rotation === "rotate-90") {
    return "rotate-90";
  }

  if (rotation === "free-rotation") {
    return "free";
  }

  return "fixed";
}

function createGeometryInput(
  record: GeometrySourceRecord
): PatternGeometryInput | null {
  const {
    recognition,
    projectPattern,
  } = record;

  const vertices =
    extractPatternVertices(projectPattern);

  if (vertices.length < 3) {
    return null;
  }

  const pixelsPerCm =
    calculatePixelsPerCm(projectPattern);

  return {
    patternId: recognition.patternId,
    recognisedName:
      recognition.recognisedName,

    vertices,

    widthCm:
      projectPattern?.calibratedWidthCm ??
      recognition.dimensions.widthCm,

    heightCm:
      projectPattern?.calibratedHeightCm ??
      recognition.dimensions.heightCm,

    widthPixels:
      projectPattern?.detectedWidthPixels ??
      recognition.dimensions.boundingBox
        ?.widthPixels,

    heightPixels:
      projectPattern?.detectedHeightPixels ??
      recognition.dimensions.boundingBox
        ?.heightPixels,

    pixelsPerCm,

    grainControlled:
      recognition.grainDirection !== "any" &&
      recognition.grainDirection !== "unknown",

    cutOnFold:
      recognition.cutOnFold,

    mirroredPair:
      recognition.requiresPair,

    rotation:
      convertRecognitionRotation(
        recognition.rotationRule
      ),

    directionalFabric:
      recognition.rotationRule === "fixed",

    stripeMatch:
      recognition.restrictions.some(
        (restriction) =>
          restriction.type === "stripe"
      ),

    checkMatch:
      recognition.restrictions.some(
        (restriction) =>
          restriction.type === "check"
      ),

    napDirection:
      recognition.restrictions.some(
        (restriction) =>
          restriction.type ===
          "directional-fabric"
      ),

    cutQuantity:
      recognition.cutQuantity,

    markerEligible:
      recognition.markerEligible,
  };
}

function createPendingGeometryPattern(
  record: GeometrySourceRecord
): PendingGeometryPattern {
  const {
    recognition,
    projectPattern,
  } = record;

  const vertices =
    extractPatternVertices(projectPattern);

  const hasBoundary =
    vertices.length >= 3;

  const pixelsPerCm =
    calculatePixelsPerCm(projectPattern);

  const hasCalibration =
    typeof pixelsPerCm === "number" &&
    pixelsPerCm > 0;

  let reason =
    "Pattern geometry requires engineering review.";

  if (!projectPattern?.uploaded) {
    reason =
      "The source pattern file is not available.";
  } else if (!hasBoundary) {
    reason =
      "No traced polygon boundary is stored for this pattern.";
  } else if (!hasCalibration) {
    reason =
      "The polygon exists, but real-size calibration is not available.";
  }

  return {
    patternId:
      recognition.patternId,

    recognisedName:
      recognition.recognisedName,

    originalName:
      recognition.originalName,

    markerEligible:
      recognition.markerEligible,

    reason,

    uploaded:
      projectPattern?.uploaded === true,

    validationPassed:
      projectPattern?.validationPassed ===
      true,

    hasCalibration,
    hasBoundary,

    cutQuantity:
      recognition.cutQuantity,

    cutOnFold:
      recognition.cutOnFold,

    materialCategory:
      recognition.materialCategory,
  };
}

function getPatternGeometryStatus(
  pattern: PatternGeometryResult
): "ready" | "review" {
  const realAreaAvailable =
    typeof pattern.polygon.area.squareCm ===
      "number" &&
    pattern.polygon.area.squareCm > 0;

  const validPolygon =
    pattern.polygon.closed &&
    pattern.polygon.vertexCount >= 3 &&
    pattern.polygon.area.squarePixels > 0 &&
    pattern.polygon.perimeter.pixels > 0;

  return validPolygon && realAreaAvailable
    ? "ready"
    : "review";
}

function getGeometryStatusClasses(
  status: "ready" | "review"
): string {
  if (status === "ready") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
  }

  return "border-amber-400/30 bg-amber-500/10 text-amber-300";
}

export default function ProjectGeometryPage() {
  const params = useParams<{
    projectId: string;
  }>();

  const projectId = params.projectId;

  const [project, setProject] =
    useState<GeometryProject | null>(null);

  const [geometryPatterns, setGeometryPatterns] =
    useState<PatternGeometryResult[]>([]);

  const [geometrySummary, setGeometrySummary] =
    useState<GeometryProjectSummary | null>(
      null
    );

  const [
    pendingGeometryPatterns,
    setPendingGeometryPatterns,
  ] = useState<PendingGeometryPattern[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [loadError, setLoadError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [filter, setFilter] =
    useState<GeometryFilter>("all");

  const projectStorageKey =
    `optifabric-project-${projectId}`;

  useEffect(() => {
    if (!projectId) {
      return;
    }

    try {
      const storedProject =
        localStorage.getItem(
          projectStorageKey
        );

      if (!storedProject) {
        setLoadError(
          "The engineering project could not be found in this browser."
        );

        return;
      }

      const parsedProject =
        JSON.parse(
          storedProject
        ) as GeometryProject;

      setProject(parsedProject);

      if (parsedProject.aiGeometry) {
        setGeometryPatterns(
          parsedProject.aiGeometry.patterns ??
            []
        );

        setGeometrySummary(
          parsedProject.aiGeometry.summary ??
            null
        );

        setPendingGeometryPatterns(
          parsedProject.aiGeometry
            .pendingPatterns ?? []
        );
      }

      setLoadError("");
    } catch (error) {
      console.error(
        "Unable to load the geometry project:",
        error
      );

      setLoadError(
        "The saved engineering project data is invalid."
      );
    } finally {
      setLoading(false);
    }
  }, [
    projectId,
    projectStorageKey,
  ]);

  const recognitionPatterns =
    useMemo(() => {
      return (
        project?.aiRecognition
          ?.patterns ?? []
      );
    }, [project]);

  const sourceRecords =
    useMemo<GeometrySourceRecord[]>(() => {
      if (!project) {
        return [];
      }

      return recognitionPatterns.map(
        (recognition) => ({
          recognition,

          projectPattern:
            project.patterns.find(
              (pattern) =>
                pattern.id ===
                recognition.patternId
            ),
        })
      );
    }, [
      project,
      recognitionPatterns,
    ]);

  const geometryInputs =
    useMemo(() => {
      return sourceRecords
        .map(createGeometryInput)
        .filter(
          (
            input
          ): input is PatternGeometryInput =>
            input !== null
        );
    }, [sourceRecords]);

  const currentPendingPatterns =
    useMemo(() => {
      return sourceRecords
        .filter(
          (record) =>
            createGeometryInput(record) ===
            null
        )
        .map(
          createPendingGeometryPattern
        );
    }, [sourceRecords]);

  const validGeometryPatterns =
    useMemo(() => {
      return getValidGeometryPatterns(
        geometryPatterns
      );
    }, [geometryPatterns]);

  const packingSequence =
    useMemo(() => {
      return sortPatternsForPacking(
        validGeometryPatterns
      );
    }, [validGeometryPatterns]);

  const markerReadyPatterns =
    useMemo(() => {
      return validGeometryPatterns.filter(
        (pattern) => {
          const recognition =
            recognitionPatterns.find(
              (item) =>
                item.patternId ===
                pattern.patternId
            );

          return (
            recognition?.markerEligible ===
            true
          );
        }
      );
    }, [
      recognitionPatterns,
      validGeometryPatterns,
    ]);

  const geometryCompleted =
    project?.aiGeometry?.completed ===
      true &&
    geometryPatterns.length > 0;

  const allMarkerGeometryReady =
    useMemo(() => {
      const markerRecognitionPatterns =
        recognitionPatterns.filter(
          (pattern) =>
            pattern.markerEligible
        );

      if (
        markerRecognitionPatterns.length ===
        0
      ) {
        return false;
      }

      return markerRecognitionPatterns.every(
        (recognition) =>
          markerReadyPatterns.some(
            (geometry) =>
              geometry.patternId ===
              recognition.patternId
          )
      );
    }, [
      markerReadyPatterns,
      recognitionPatterns,
    ]);
const geometryCompletionSummary =
  useMemo(() => {
    return createGeometryCompletionSummary({
      projectId,

      pieces: sourceRecords.map(
        ({
          recognition,
          projectPattern,
        }) => {
          const generatedGeometry =
            geometryPatterns.find(
              (pattern) =>
                pattern.patternId ===
                recognition.patternId
            );

          const storedVertices =
            extractPatternVertices(
              projectPattern
            );

          const storedPixelsPerCm =
            calculatePixelsPerCm(
              projectPattern
            );

          const generatedGeometryValid =
            generatedGeometry
              ? getPatternGeometryStatus(
                  generatedGeometry
                ) === "ready"
              : false;

          const storedGeometryValid =
            storedVertices.length >= 3 &&
            typeof storedPixelsPerCm ===
              "number" &&
            storedPixelsPerCm > 0;

          return {
            patternId:
              recognition.patternId,

            patternName:
              recognition.recognisedName,

            pieceType:
              recognition.originalName,

            markerEligible:
              recognition.markerEligible,

            geometryAvailable:
              generatedGeometry !==
                undefined ||
              storedVertices.length >= 3,

            geometryValid:
              generatedGeometryValid ||
              storedGeometryValid,

            vertexCount:
              generatedGeometry
                ?.polygon.vertexCount ??
              storedVertices.length,
          };
        }
      ),
    });
  }, [
    geometryPatterns,
    projectId,
    sourceRecords,
  ]);

  const filteredReadyPatterns =
    useMemo(() => {
      const cleanSearch =
        searchText
          .trim()
          .toLowerCase();

      return geometryPatterns.filter(
        (pattern) => {
          const recognition =
            recognitionPatterns.find(
              (item) =>
                item.patternId ===
                pattern.patternId
            );

          const matchesSearch =
            cleanSearch.length === 0 ||
            pattern.recognisedName
              .toLowerCase()
              .includes(cleanSearch) ||
            recognition?.originalName
              .toLowerCase()
              .includes(cleanSearch);

          const matchesFilter =
            filter === "all" ||
            filter === "ready" ||
            (filter === "marker" &&
              recognition?.markerEligible ===
                true) ||
            (filter === "fold" &&
              pattern.constraints.cutOnFold) ||
            (filter === "paired" &&
              pattern.constraints
                .mirroredPair);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      filter,
      geometryPatterns,
      recognitionPatterns,
      searchText,
    ]);

  const filteredPendingPatterns =
    useMemo(() => {
      const pendingSource =
        pendingGeometryPatterns.length > 0
          ? pendingGeometryPatterns
          : currentPendingPatterns;

      const cleanSearch =
        searchText
          .trim()
          .toLowerCase();

      return pendingSource.filter(
        (pattern) =>
          cleanSearch.length === 0 ||
          pattern.recognisedName
            .toLowerCase()
            .includes(cleanSearch) ||
          pattern.originalName
            .toLowerCase()
            .includes(cleanSearch)
      );
    }, [
      currentPendingPatterns,
      pendingGeometryPatterns,
      searchText,
    ]);

  function saveGeometryResult(
    patterns: PatternGeometryResult[],
    summary: GeometryProjectSummary,
    pendingPatterns: PendingGeometryPattern[],
    successMessage: string
  ) {
    if (!project) {
      return;
    }

    const completedAt =
      new Date().toISOString();

    const validPatterns =
      getValidGeometryPatterns(patterns);

    const markerReadyCount =
      validPatterns.filter((pattern) => {
        const recognition =
          recognitionPatterns.find(
            (item) =>
              item.patternId ===
              pattern.patternId
          );

        return (
          recognition?.markerEligible ===
          true
        );
      }).length;

    const savedGeometry: SavedGeometryData =
      {
        completed:
          patterns.length > 0,

        completedAt,

        totalRecognitionPatterns:
          recognitionPatterns.length,

        geometryReadyPatterns:
          patterns.length,

        geometryPendingPatterns:
          pendingPatterns.length,

        validGeometryPatterns:
          validPatterns.length,

        markerReadyPatterns:
          markerReadyCount,

        summary,

        patterns,
        pendingPatterns,
      };

    const updatedProject: GeometryProject =
      {
        ...project,

        aiGeometry:
          savedGeometry,

        updatedAt:
          completedAt,
      };

    setProject(updatedProject);
    setGeometryPatterns(patterns);
    setGeometrySummary(summary);

    setPendingGeometryPatterns(
      pendingPatterns
    );

    localStorage.setItem(
      projectStorageKey,
      JSON.stringify(updatedProject)
    );

    try {
      updateProjectRegistryEntry(
        updatedProject
      );
    } catch (error) {
      console.error(
        "Unable to synchronise geometry status with the project registry:",
        error
      );
    }

    setMessage(successMessage);
  }

  function runProjectGeometry() {
    if (!project) {
      return;
    }

    if (
      !project.aiRecognition?.completed
    ) {
      setMessage(
        "Complete AI Pattern Recognition before generating project geometry."
      );

      return;
    }

    if (geometryInputs.length === 0) {
      setPendingGeometryPatterns(
        currentPendingPatterns
      );

      setMessage(
        "No recognised pattern currently contains a traced polygon boundary. Complete boundary tracing or AI edge extraction first."
      );

      return;
    }

    setGenerating(true);
    setMessage("");

    window.setTimeout(() => {
      try {
        const result =
          generateProjectGeometry(
            project.id,
            geometryInputs
          );

        saveGeometryResult(
          result.patterns,
          result.summary,
          currentPendingPatterns,
          `Geometry generated for ${result.patterns.length} pattern piece(s). ${currentPendingPatterns.length} pattern piece(s) remain pending.`
        );
      } catch (error) {
        console.error(
          "Project geometry generation failed:",
          error
        );

        setMessage(
          "Project geometry could not be generated. Review the stored polygon and calibration data."
        );
      } finally {
        setGenerating(false);
      }
    }, 500);
  }

  function rerunProjectGeometry() {
    const confirmed =
      window.confirm(
        "Generate project geometry again? Existing saved geometry calculations will be replaced."
      );

    if (!confirmed) {
      return;
    }

    runProjectGeometry();
  }

  function clearFilters() {
    setSearchText("");
    setFilter("all");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="rounded-3xl border border-violet-400/20 bg-slate-900 px-10 py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-violet-400" />

          <p className="mt-5 text-lg font-black">
            Loading Pattern Geometry...
          </p>
        </section>
      </main>
    );
  }

  if (loadError || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-2xl rounded-3xl border border-red-400/30 bg-red-950/20 p-8 text-center">
          <h1 className="text-3xl font-black">
            Engineering project unavailable
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            {loadError}
          </p>

          <Link
            href="/optifabric/projects"
            className="mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
          >
            Open Project Registry
          </Link>
        </section>
      </main>
    );
  }

  const recognitionCompleted =
    project.aiRecognition?.completed ===
    true;

  const pendingDisplayPatterns =
    pendingGeometryPatterns.length > 0
      ? pendingGeometryPatterns
      : currentPendingPatterns;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-slate-900 via-violet-950 to-blue-950 p-7 shadow-2xl shadow-violet-950/30 sm:p-10">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-violet-300">
                OptiFabric AI · Module 04
              </p>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                Pattern Geometry
              </h1>

              <p className="mt-4 text-2xl font-black">
                {project.projectName}
              </p>

              <p className="mt-3 max-w-4xl leading-7 text-slate-300">
                Convert recognised garment
                pieces into measurable polygons
                containing area, perimeter,
                dimensions, centroid, packing
                priority and marker constraints.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
              <Link
                href={`/optifabric/project/${project.id}/ai-pattern-recognition`}
                className="inline-flex items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-950/30 px-5 py-3 font-black text-cyan-200 transition hover:bg-cyan-900/40"
              >
                ← AI Recognition
              </Link>

              <Link
                href={`/optifabric/project/${project.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-violet-400/40 bg-violet-950/30 px-5 py-3 font-black text-violet-200 transition hover:bg-violet-900/40"
              >
                Command Centre
              </Link>
            </div>
          </div>
        </header>

        {!recognitionCompleted ? (
          <section className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-950/20 px-5 py-5">
            <h2 className="font-black text-amber-300">
              AI recognition is incomplete
            </h2>

            <p className="mt-2 leading-7 text-amber-100/80">
              Module 04 requires saved
              recognition results. Complete AI
              Pattern Recognition before
              processing geometry.
            </p>

            <Link
              href={`/optifabric/project/${project.id}/ai-pattern-recognition`}
              className="mt-4 inline-flex rounded-xl border border-amber-400/30 bg-slate-950 px-4 py-2 font-black text-amber-300 transition hover:bg-amber-950"
            >
              Return to AI Recognition
            </Link>
          </section>
        ) : (
          <section className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-950/20 px-5 py-5">
            <h2 className="font-black text-emerald-300">
              Recognition results received
            </h2>

            <p className="mt-2 leading-7 text-emerald-100/80">
              {recognitionPatterns.length} recognised
              pattern piece(s) are available.
              Currently, {geometryInputs.length} have
              polygon boundaries and{" "}
              {currentPendingPatterns.length} require
              tracing or geometry preparation.
            </p>
          </section>
        )}

        {message ? (
          <section className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 font-bold text-cyan-100">
            {message}
          </section>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Recognised Patterns"
            value={String(
              recognitionPatterns.length
            )}
            detail="Received from Module 03"
          />

          <MetricCard
            label="Geometry Sources"
            value={String(
              geometryInputs.length
            )}
            detail="Polygon boundaries available"
          />

          <MetricCard
            label="Geometry Pending"
            value={String(
              pendingDisplayPatterns.length
            )}
            detail="Require tracing or extraction"
          />

          <MetricCard
            label="Marker Geometry Ready"
            value={String(
              markerReadyPatterns.length
            )}
            detail="Valid marker-eligible polygons"
          />
        </section>

        <section className="mt-8 rounded-3xl border border-violet-400/20 bg-gradient-to-br from-slate-900 to-violet-950/50 p-6 sm:p-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
                Geometry control
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Generate Project Geometry
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-300">
                OptiFabric will calculate
                geometry only where a real
                polygon boundary exists. It will
                not invent pattern outlines,
                measurements or fabric
                consumption for pending pieces.
              </p>
            </div>

            <div className="min-w-72">
              {!geometryCompleted ? (
                <button
                  type="button"
                  onClick={runProjectGeometry}
                  disabled={
                    !recognitionCompleted ||
                    geometryInputs.length === 0 ||
                    generating
                  }
                  className="w-full rounded-2xl bg-violet-400 px-7 py-4 text-lg font-black text-slate-950 transition enabled:hover:bg-violet-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {generating
                    ? "Generating Geometry..."
                    : "Generate Project Geometry"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={rerunProjectGeometry}
                  disabled={generating}
                  className="w-full rounded-2xl border border-amber-400/30 bg-amber-950/20 px-7 py-4 text-lg font-black text-amber-300 transition enabled:hover:bg-amber-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {generating
                    ? "Regenerating Geometry..."
                    : "Re-run Project Geometry"}
                </button>
              )}

              <p className="mt-3 text-center text-sm leading-6 text-slate-500">
                Geometry results are saved
                inside this engineering project.
              </p>
            </div>
          </div>
        </section>

        {geometrySummary ? (
          <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
              Project geometry summary
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Engineering Calculation Results
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label="Geometry Patterns"
                value={String(
                  geometrySummary.totalPatterns
                )}
              />

              <SummaryCard
                label="Total Real Area"
                value={`${formatNumber(
                  geometrySummary.totalAreaCm2
                )} cm²`}
              />

              <SummaryCard
                label="Total Perimeter"
                value={`${formatNumber(
                  geometrySummary.totalPerimeterCm
                )} cm`}
              />

              <SummaryCard
                label="Engineering Score"
                value={`${formatNumber(
                  geometrySummary
                    .averageEngineeringScore,
                  1
                )}%`}
              />

              <SummaryCard
                label="Average Compactness"
                value={formatPercentage(
                  geometrySummary
                    .averageCompactness
                )}
              />

              <SummaryCard
                label="Valid Polygons"
                value={String(
                  validGeometryPatterns.length
                )}
              />

              <SummaryCard
                label="Marker Ready"
                value={String(
                  markerReadyPatterns.length
                )}
              />

              <SummaryCard
                label="Pending Pieces"
                value={String(
                  pendingDisplayPatterns.length
                )}
              />
            </div>
          </section>
        ) : null}

        {(geometryPatterns.length > 0 ||
          pendingDisplayPatterns.length >
            0) ? (
          <section className="mt-8 rounded-3xl border border-violet-400/20 bg-violet-950/10 p-5 sm:p-7">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
                  Geometry workspace
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Search and Filter Pattern
                  Geometry
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Current view
                </p>

                <p className="mt-1 text-2xl font-black text-violet-300">
                  {filter === "pending"
                    ? filteredPendingPatterns.length
                    : filteredReadyPatterns.length}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <label>
                <span className="text-sm font-black text-slate-300">
                  Search pattern geometry
                </span>

                <input
                  type="search"
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(
                      event.target.value
                    )
                  }
                  placeholder="Example: front, sleeve, collar"
                  className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400"
                />
              </label>

              <label>
                <span className="text-sm font-black text-slate-300">
                  Geometry status
                </span>

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(
                      event.target
                        .value as GeometryFilter
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400"
                >
                  <option value="all">
                    All ready geometry
                  </option>

                  <option value="ready">
                    Geometry ready
                  </option>

                  <option value="pending">
                    Geometry pending
                  </option>

                  <option value="marker">
                    Marker eligible
                  </option>

                  <option value="fold">
                    Cut-on-fold pieces
                  </option>

                  <option value="paired">
                    Paired pieces
                  </option>
                </select>
              </label>
            </div>

            {searchText.trim().length > 0 ||
            filter !== "all" ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-violet-400/30 bg-slate-950 px-4 py-2 font-black text-violet-300 transition hover:bg-violet-950"
              >
                Clear Filters
              </button>
            ) : null}
          </section>
        ) : null}

        {filter === "pending" ? (
          <PendingGeometrySection
            patterns={filteredPendingPatterns}
            projectId={project.id}
          />
        ) : geometryPatterns.length > 0 ? (
          <section className="mt-8">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
              Pattern-by-pattern analysis
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Measurable Geometry Results
            </h2>

            {filteredReadyPatterns.length >
            0 ? (
              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                {filteredReadyPatterns.map(
                  (pattern) => {
                    const recognition =
                      recognitionPatterns.find(
                        (item) =>
                          item.patternId ===
                          pattern.patternId
                      );

                    return (
                      <GeometryPatternCard
                        key={
                          pattern.patternId
                        }
                        pattern={pattern}
                        recognition={
                          recognition
                        }
                      />
                    );
                  }
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-dashed border-violet-400/30 bg-violet-950/10 px-6 py-12 text-center">
                <p className="text-5xl">
                  🔎
                </p>

                <h3 className="mt-4 text-2xl font-black">
                  No geometry results match
                  these filters
                </h3>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-violet-400 px-5 py-3 font-black text-slate-950"
                >
                  Show All Geometry
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="mt-8 rounded-3xl border border-dashed border-violet-400/30 bg-violet-950/10 px-6 py-14 text-center">
            <p className="text-6xl">
              📐
            </p>

            <h2 className="mt-5 text-3xl font-black">
              No Measurable Geometry Yet
            </h2>

            <p className="mx-auto mt-3 max-w-3xl leading-7 text-slate-400">
              The project recognition results
              are available, but the uploaded
              patterns do not yet contain stored
              polygon boundaries. Complete
              manual tracing or connect AI
              boundary extraction before
              calculating production geometry.
            </p>

            <Link
              href={`/optifabric/project/${project.id}/patterns`}
              className="mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Open Pattern Workspace
            </Link>
          </section>
        )}

        {filter !== "pending" &&
        pendingDisplayPatterns.length > 0 ? (
          <PendingGeometrySection
            patterns={
              pendingDisplayPatterns
            }
            projectId={project.id}
          />
        ) : null}

        {packingSequence.length > 0 ? (
          <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-950/10 p-6 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">
              Preliminary packing sequence
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Recommended Marker Priority
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-300">
              This is an engineering
              preparation sequence, not the
              final nesting result. Large,
              constrained and difficult pieces
              are prioritised before smaller
              gap-filling components.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {packingSequence.map(
                (pattern, index) => (
                  <article
                    key={
                      pattern.patternId
                    }
                    className="rounded-2xl border border-amber-400/20 bg-slate-950/60 p-5"
                  >
                    <p className="text-sm font-black uppercase tracking-wider text-amber-300">
                      Priority {index + 1}
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      {
                        pattern.recognisedName
                      }
                    </h3>

                    <p className="mt-3 text-sm text-slate-400">
                      Packing score:{" "}
                      <span className="font-black text-white">
                        {
                          pattern.packingPriority
                        }
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Marker weight:{" "}
                      <span className="font-black text-white">
                        {formatNumber(
                          pattern.markerWeight,
                          0
                        )}
                      </span>
                    </p>
                  </article>
                )
              )}
            </div>
          </section>
       ) : null}

<GeometryCompletionPanel
  summary={geometryCompletionSummary}
  projectName={project.projectName}
/>

{geometryCompleted ? (
  <MarkerWorkspacePanel
    projectId={project.id}
    projectName={project.projectName}
    geometryReady={allMarkerGeometryReady}
    patternIds={markerReadyPatterns.map(
      (pattern) => pattern.patternId
    )}
  />
) : null}

<section className="mt-10 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-blue-950 p-6 sm:p-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Module completion
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Prepare for Marker Planning
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-300">
                Marker planning requires
                measurable polygons for every
                marker-eligible piece. Pending
                geometry must be traced,
                calibrated and validated before
                an accurate production marker
                or fabric-consumption result can
                be approved.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <ReadinessItem
                  label="Geometry saved"
                  passed={geometryCompleted}
                  detail={
                    geometryCompleted
                      ? "Project geometry calculations are stored."
                      : "Generate and save project geometry."
                  }
                />

                <ReadinessItem
                  label="Valid polygons"
                  passed={
                    validGeometryPatterns.length >
                    0
                  }
                  detail={`${validGeometryPatterns.length} valid measurable polygon(s) are available.`}
                />

                <ReadinessItem
                  label="Complete marker set"
                  passed={
                    allMarkerGeometryReady
                  }
                  detail={
                    allMarkerGeometryReady
                      ? "Every marker-eligible piece has valid geometry."
                      : `${pendingDisplayPatterns.filter(
                          (pattern) =>
                            pattern.markerEligible
                        ).length} marker-eligible piece(s) still require geometry.`
                  }
                />
              </div>
            </div>

            <div className="flex min-w-72 flex-col gap-3">
              {allMarkerGeometryReady ? (
                <Link
                  href={`/optifabric/project/${project.id}/marker-planning`}
                  className="rounded-2xl bg-cyan-400 px-7 py-4 text-center text-lg font-black text-slate-950 transition hover:bg-cyan-300"
                >
                  Continue to Marker Planning →
                </Link>
              ) : (
                <div className="rounded-2xl border border-amber-400/30 bg-amber-950/20 px-7 py-4 text-center">
                  <p className="font-black text-amber-300">
                    Marker Planning Locked
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Complete every
                    marker-eligible polygon
                    before continuing.
                  </p>
                </div>
              )}

              <Link
                href={`/optifabric/project/${project.id}/patterns`}
                className="rounded-2xl border border-slate-600 bg-slate-950 px-7 py-4 text-center font-black text-slate-300 transition hover:bg-slate-800"
              >
                Review Pattern Sources
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-xl font-black text-violet-300">
            Why does OptiFabric refuse to
            estimate missing pattern geometry?
          </h2>

          <p className="mt-3 max-w-5xl leading-7 text-slate-300">
            A guessed outline may appear
            visually reasonable but can produce
            incorrect fabric consumption,
            collisions, fold placement and
            cutting instructions. OptiFabric
            therefore separates recognised
            pattern identity from verified
            mathematical geometry. Production
            calculations begin only after a
            real boundary and scale calibration
            are available.
          </p>
        </section>
      </div>
    </main>
  );
}

function GeometryPatternCard({
  pattern,
  recognition,
}: {
  pattern: PatternGeometryResult;
  recognition?: RecognisedPatternPiece;
}) {
  const status =
    getPatternGeometryStatus(pattern);

  const boxUtilisation =
    calculateBoundingBoxUtilisation(
      pattern.polygon.area.squarePixels,
      pattern.polygon.boundingBox
    );

  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Original:{" "}
            {recognition?.originalName ??
              pattern.recognisedName}
          </p>

          <h3 className="mt-1 text-2xl font-black">
            {pattern.recognisedName}
          </h3>
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${getGeometryStatusClasses(
            status
          )}`}
        >
          {status === "ready"
            ? "Geometry Ready"
            : "Geometry Review"}
        </span>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-4">
        <PolygonPreview
          pattern={pattern}
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <EngineeringValue
          label="Vertices"
          value={String(
            pattern.polygon.vertexCount
          )}
        />

        <EngineeringValue
          label="Area"
          value={`${formatNumber(
            pattern.polygon.area.squareCm
          )} cm²`}
        />

        <EngineeringValue
          label="Perimeter"
          value={`${formatNumber(
            pattern.polygon.perimeter.cm
          )} cm`}
        />

        <EngineeringValue
          label="Dimensions"
          value={`${formatNumber(
            pattern.dimensions.widthCm
          )} × ${formatNumber(
            pattern.dimensions.heightCm
          )} cm`}
        />

        <EngineeringValue
          label="Aspect Ratio"
          value={formatNumber(
            pattern.aspectRatio,
            3
          )}
        />

        <EngineeringValue
          label="Compactness"
          value={formatPercentage(
            pattern.compactness
          )}
        />

        <EngineeringValue
          label="Box Utilisation"
          value={formatPercentage(
            boxUtilisation
          )}
        />

        <EngineeringValue
          label="Packing Priority"
          value={String(
            pattern.packingPriority
          )}
        />

        <EngineeringValue
          label="Engineering Score"
          value={`${pattern.engineeringScore}%`}
        />

        <EngineeringValue
          label="Rotation"
          value={formatLabel(
            pattern.constraints.rotation
          )}
        />

        <EngineeringValue
          label="Cut on Fold"
          value={
            pattern.constraints.cutOnFold
              ? "Yes"
              : "No"
          }
        />

        <EngineeringValue
          label="Marker Eligible"
          value={
            recognition?.markerEligible
              ? "Yes"
              : "No"
          }
        />
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
        <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
          Marker engineering interpretation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          This polygon has a packing
          priority of{" "}
          <strong>
            {pattern.packingPriority}
          </strong>
          . Its permitted rotation is{" "}
          <strong>
            {formatLabel(
              pattern.constraints.rotation
            )}
          </strong>
          {pattern.constraints.cutOnFold
            ? ", and it must be placed against the fabric fold"
            : ""}
          {pattern.constraints.mirroredPair
            ? ", with paired or mirrored cutting control"
            : ""}
          .
        </p>
      </div>
    </article>
  );
}

function PolygonPreview({
  pattern,
}: {
  pattern: PatternGeometryResult;
}) {
  const box =
    pattern.polygon.boundingBox;

  const padding = 20;

  const viewBoxWidth =
    Math.max(box.width, 1) +
    padding * 2;

  const viewBoxHeight =
    Math.max(box.height, 1) +
    padding * 2;

  const pointString =
    pattern.polygon.vertices
      .map(
        (point) =>
          `${point.x - box.minX + padding},${
            point.y - box.minY + padding
          }`
      )
      .join(" ");

  const centroidX =
    pattern.polygon.centroid.x -
    box.minX +
    padding;

  const centroidY =
    pattern.polygon.centroid.y -
    box.minY +
    padding;

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      className="h-72 w-full"
      role="img"
      aria-label={`${pattern.recognisedName} polygon preview`}
    >
      <polygon
        points={pointString}
        fill="rgba(139, 92, 246, 0.14)"
        stroke="rgb(167, 139, 250)"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />

      {pattern.polygon.vertices.map(
        (point, index) => (
          <circle
            key={`${pattern.patternId}-${index}`}
            cx={
              point.x -
              box.minX +
              padding
            }
            cy={
              point.y -
              box.minY +
              padding
            }
            r="4"
            fill="rgb(34, 211, 238)"
            vectorEffect="non-scaling-stroke"
          />
        )
      )}

      <circle
        cx={centroidX}
        cy={centroidY}
        r="6"
        fill="rgb(251, 191, 36)"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function PendingGeometrySection({
  patterns,
  projectId,
}: {
  patterns: PendingGeometryPattern[];
  projectId: string;
}) {
  return (
    <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-950/10 p-6 sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">
        Geometry preparation queue
      </p>

      <h2 className="mt-2 text-3xl font-black">
        {patterns.length} Pattern
        {patterns.length === 1
          ? ""
          : "s"}{" "}
        Require Geometry
      </h2>

      <p className="mt-3 max-w-4xl leading-7 text-amber-100/80">
        These recognised pieces remain in
        the engineering project, but they
        cannot enter accurate marker or
        fabric-consumption calculations
        until their boundaries and real
        dimensions are available.
      </p>

      {patterns.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {patterns.map((pattern) => (
            <article
              key={pattern.patternId}
              className="rounded-2xl border border-amber-400/20 bg-slate-950/60 p-5"
            >
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${
                    pattern.markerEligible
                      ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-600 bg-slate-800 text-slate-400"
                  }`}
                >
                  {pattern.markerEligible
                    ? "Marker Piece"
                    : "Non-marker"}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${
                    pattern.hasBoundary
                      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                      : "border-amber-400/30 bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {pattern.hasBoundary
                    ? "Boundary Available"
                    : "Boundary Missing"}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-black">
                {pattern.recognisedName}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Original:{" "}
                {pattern.originalName}
              </p>

              <p className="mt-4 text-sm leading-6 text-amber-100">
                {pattern.reason}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <SmallStatus
                  label="Uploaded"
                  passed={pattern.uploaded}
                />

                <SmallStatus
                  label="Validated"
                  passed={
                    pattern.validationPassed
                  }
                />

                <SmallStatus
                  label="Boundary"
                  passed={
                    pattern.hasBoundary
                  }
                />

                <SmallStatus
                  label="Calibrated"
                  passed={
                    pattern.hasCalibration
                  }
                />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-950/10 p-6 text-center font-black text-emerald-300">
          No geometry preparation items
          remain.
        </div>
      )}

      <Link
        href={`/optifabric/project/${projectId}/patterns`}
        className="mt-6 inline-flex rounded-xl border border-amber-400/30 bg-slate-950 px-5 py-3 font-black text-amber-300 transition hover:bg-amber-950"
      >
        Open Pattern Tracing Workspace
      </Link>
    </section>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-violet-300">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {detail}
      </p>
    </article>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
      <p className="text-sm font-bold text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value}
      </p>
    </article>
  );
}

function EngineeringValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-100">
        {value}
      </p>
    </div>
  );
}

function ReadinessItem({
  label,
  passed,
  detail,
}: {
  label: string;
  passed: boolean;
  detail: string;
}) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        passed
          ? "border-emerald-400/30 bg-emerald-950/20"
          : "border-amber-400/30 bg-amber-950/20"
      }`}
    >
      <p
        className={`font-black ${
          passed
            ? "text-emerald-300"
            : "text-amber-300"
        }`}
      >
        {passed ? "✓" : "!"} {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {detail}
      </p>
    </article>
  );
}

function SmallStatus({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 text-xs font-black ${
        passed
          ? "border-emerald-400/20 bg-emerald-950/20 text-emerald-300"
          : "border-amber-400/20 bg-amber-950/20 text-amber-300"
      }`}
    >
      {passed ? "✓" : "!"} {label}
    </div>
  );
}