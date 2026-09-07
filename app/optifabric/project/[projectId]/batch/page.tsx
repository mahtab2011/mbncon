"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ChangeEvent,
  DragEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { analysePatternImageBoundary } from "@/lib/optifabric/aiBoundaryImageAdapter";

import {
  generatePatternGeometry,
  getValidGeometryPatterns,
} from "@/lib/optifabric/patternGeometryEngine";

import type {
  GeometryPoint,
  GeometryProjectSummary,
  GeometryRotation,
  PatternGeometryResult,
} from "@/lib/optifabric/patternGeometryTypes";

import { updateProjectRegistryEntry } from "@/lib/optifabric/projectRegistry";

/* ============================================================================
 * OptiFabric AI — RC5-003 Batch Engineering Command Centre
 *
 * WORKFLOW (unchanged):
 *   Upload Folder -> AI Boundary Detection -> Project Scale Application
 *   -> Automatic Geometry Calculation -> Engineering Validation
 *   -> Inspect Pattern (exceptions only) -> Save Geometry -> Marker Layout
 *
 * ENGINEERING FIREWALL (Design Principle 5)
 *   AI confidence decides ONE thing only: whether an engineer must review the
 *   piece. It must never reach generatePatternGeometry(), and must never
 *   influence dimensions, area, perimeter, fabric consumption or marker
 *   layout. The geometry input object below is deliberately free of every
 *   confidence-derived value. Do not add one.
 *
 * DETERMINISM (Design Principle 4)
 *   Same image + same scale + same settings must produce the same engineering
 *   result. Piece identity is therefore derived from file identity, never
 *   from Date.now() or Math.random().
 * ========================================================================== */

/* --------------------------------- Tuning --------------------------------- */

/**
 * Boundary confidence at or above which a piece is auto-approved.
 *
 * CALIBRATION WARNING: this value must be calibrated against the real output
 * distribution of aiBoundaryDetectionEngine on production factory scans. If
 * the engine's typical confidence sits below this number, every pattern routes
 * to manual review and the exception-based workflow collapses. Value preserved
 * from the previous implementation — do not change without measured data.
 */
const AUTO_APPROVAL_CONFIDENCE = 82;

/** Minimum geometry engineering score for auto-approval. */
const MINIMUM_ENGINEERING_SCORE = 80;

/**
 * Plausible project calibration bounds. Scale converts pixels into fabric, so
 * an out-of-range value produces confidently wrong consumption figures. Adjust
 * these to match your scanner and photographic capture setups.
 */
const MIN_PIXELS_PER_CM = 5;
const MAX_PIXELS_PER_CM = 400;

/** One pathological image must not hang an entire production batch. */
const BOUNDARY_ANALYSIS_TIMEOUT_MS = 60_000;

/** Longest image edge passed to the detector. */
const MAXIMUM_ANALYSIS_DIMENSION = 1600;

/** Minimum text-match score required to bind a file to a project pattern. */
const PATTERN_MATCH_MINIMUM_SCORE = 30;

/** Filename match scoring weights. */
const MATCH_SCORE_EXACT = 150;
const MATCH_SCORE_PATTERN_NUMBER = 120;
const MATCH_SCORE_SUBSTRING = 70;
const MATCH_SCORE_PER_TOKEN = 15;

/** Progress checkpoints for each pipeline phase. */
const PROGRESS_BOUNDARY_END = 35;
const PROGRESS_SCALE_END = 50;
const PROGRESS_GEOMETRY_END = 80;
const PROGRESS_VALIDATION_END = 95;

const REFERENCE_LENGTH_INCHES = 12;
const REFERENCE_LENGTH_CM = 30.48;
const CM_PER_INCH = 2.54;

const NAVIGATION_DELAY_MS = 900;

/* ---------------------------------- Types --------------------------------- */

type BatchPieceStatus =
  | "uploaded"
  | "boundary"
  | "scale"
  | "geometry"
  | "ready"
  | "review"
  | "failed"
  | "saved";

interface ProjectPatternStatus {
  id: string;
  name: string;

  status?: string;

  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;

  imageUrl?: string;

  validationPassed?: boolean;
  scaleVisible?: boolean;
  grainLineVisible?: boolean;
  notchesVisible?: boolean;

  includedInStyle?: boolean;
  includeInMarker?: boolean;

  styleRequired?: boolean;
  styleCutQuantity?: number;
  styleCutOnFold?: boolean;
  styleMaterialCategory?: string;

  materialCategory?: string;

  geometryVertices?: GeometryPoint[];
  polygonVertices?: GeometryPoint[];
  tracedVertices?: GeometryPoint[];
  tracedPoints?: GeometryPoint[];
  boundaryPoints?: GeometryPoint[];
  points?: GeometryPoint[];

  pixelsPerCm?: number;
  pixelsPerInch?: number;

  detectedWidthPixels?: number;
  detectedHeightPixels?: number;

  calibratedWidthCm?: number;
  calibratedHeightCm?: number;
  calibratedAreaSqCm?: number;
  calibratedPerimeterCm?: number;

  geometryTracingCompleted?: boolean;
  geometryTracingCompletedAt?: string;

  patternTracing?: {
    boundary?: {
      vertices: GeometryPoint[];
      closed: boolean;
      vertexCount: number;
      startedAt?: string;
      closedAt?: string;
    };

    calibration?: {
      referenceLengthInches: number;
      referenceLengthCm: number;
      measuredPixels: number;
      pixelsPerCm: number;
      pixelsPerInch: number;
      calibrated: boolean;
      calibratedAt: string;
    };

    savedAt?: string;
  };

  // NOTE: this index signature disables excess-property checking on the whole
  // interface — `pattern.calibratedWidhtCm` (typo) compiles clean. Retained
  // only because other modules read arbitrary fields from stored patterns.
  // Removing it is a recommended future hardening step.
  [key: string]: unknown;
}

interface RecognitionPattern {
  patternId: string;

  recognisedName: string;
  originalName: string;

  markerEligible: boolean;

  confidence?: number;

  cutQuantity?: number;
  cutOnFold?: boolean;

  mirroredPair?: boolean;
  grainControlled?: boolean;

  rotationRule?: string;

  materialCategory?: string;

  directionalFabric?: boolean;
  stripeMatch?: boolean;
  checkMatch?: boolean;
  napDirection?: boolean;

  [key: string]: unknown;
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

  patterns: RecognitionPattern[];
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

type FabricCostCurrency =
  | "GBP"
  | "USD"
  | "EUR"
  | "BDT";

interface ProjectFabricCost {
  currency: FabricCostCurrency;

  costPerMetre: number;

  supplier?: string;

  fabricLot?: string;

  updatedAt: string;
}

interface BatchEngineeringProject {
  id: string;

  projectName?: string;
  name?: string;

  patterns: ProjectPatternStatus[];
orderQuantity?: number;
  fabricCost?: ProjectFabricCost;

  aiRecognition?: SavedRecognitionData;

  aiGeometry?: SavedGeometryData;

  updatedAt?: string;

  [key: string]: unknown;
}

interface BatchPatternPiece {
  id: string;

  file: File;

  name: string;
  previewUrl: string;

  projectPatternId: string | null;

  recognition: RecognitionPattern | null;

  status: BatchPieceStatus;

  selected: boolean;

  boundaryReady: boolean;
  scaleReady: boolean;
  geometryReady: boolean;

  confidence: number | null;

  warning?: string;
  error?: string;

  vertices: GeometryPoint[];

  originalImageWidth: number;
  originalImageHeight: number;

  geometryResult: PatternGeometryResult | null;

  engineerApproved: boolean;

  /** Audit metadata — when the engineer accepted this exception. */
  approvedAt?: string;
}

interface ActivityEntry {
  id: string;
  time: string;
  message: string;
  type: "info" | "success" | "warning";
}

/** Result of the engineering validation gate for a single piece. */
interface AcceptanceDecision {
  requiresReview: boolean;
  reason?: string;
}

interface EngineeringRiskAssessment {
  decision:
    | "ready"
    | "review"
    | "failed";

  engineeringGrade:
    | "A+"
    | "A"
    | "B"
    | "C"
    | "D";

  engineeringRisk:
    | "very-low"
    | "low"
    | "medium"
    | "high"
    | "very-high";

  businessRisk:
    | "very-low"
    | "low"
    | "medium"
    | "high";

  recommendation: string;

  potentialRisks: string[];

  consequencesWithoutCorrection: string[];

  estimatedReviewTime: string;
}
function buildEngineeringRiskAssessment(
  piece: BatchPatternPiece
): EngineeringRiskAssessment {

  if (piece.status === "failed") {
    return {
      decision: "failed",
      engineeringGrade: "D",
      engineeringRisk: "very-high",
      businessRisk: "high",

      recommendation:
        "Do not include this pattern in marker planning until engineering inspection is completed.",

      potentialRisks: [
        "Incorrect boundary",
        "Marker collision",
        "Fabric consumption may increase",
        "Cutting inaccuracies",
        "Production delays",
      ],

      consequencesWithoutCorrection: [
        "Incorrect garment dimensions",
        "Possible fabric waste",
        "Re-cut requirements",
        "Quality rejection",
      ],

      estimatedReviewTime: "2–5 minutes",
    };
  }

  if (piece.status === "review") {
    return {
      decision: "review",
      engineeringGrade: "B",
      engineeringRisk: "medium",
      businessRisk: "low",

      recommendation:
        "Engineering review recommended before production approval.",

      potentialRisks: [
        "Minor geometry deviation",
        "Boundary confidence below threshold",
      ],

      consequencesWithoutCorrection: [
        "Small increase in marker waste",
        "Possible nesting inefficiency",
      ],

      estimatedReviewTime: "30–60 seconds",
    };
  }

  return {
    decision: "ready",
    engineeringGrade: "A",

    engineeringRisk: "very-low",

    businessRisk: "very-low",

    recommendation:
      "Pattern approved for automatic marker optimisation.",

    potentialRisks: [],

    consequencesWithoutCorrection: [],

    estimatedReviewTime: "None",
  };
}

interface EngineeringDecisionSummary {
  decision: string;
  reviewer: string;
 impact: string;
}

function buildEngineeringDecisionSummary(
  risk: EngineeringRiskAssessment
): EngineeringDecisionSummary {
  switch (risk.decision) {
    case "ready":
      return {
        decision: "Approved for Automatic Marker Optimisation",
        reviewer: "Not Required",
        impact:
          "Pattern can safely continue to Module 04 with minimum engineering risk.",
      };

    case "review":
      return {
        decision: "Manual Engineering Review Required",
        reviewer: "Cutting Master",
        impact:
          "Engineering verification recommended before marker optimisation.",
      };

    case "failed":
      return {
        decision: "Pattern Rejected",
        reviewer: "Senior Cutting Engineer",
        impact:
          "Incorrect geometry may cause marker errors, fabric waste and production defects.",
      };

    default:
      return {
        decision: "Pending",
        reviewer: "Engineer",
        impact: "Awaiting engineering decision.",
      };
  }
}
/* ------------------------------- Constants -------------------------------- */

/**
 * Deliberately narrower than `image/*`. Formats outside this list (SVG, TIFF,
 * animated GIF) either cannot be rasterised reliably or carry no meaningful
 * pattern boundary, and previously reached the detector where they failed with
 * an opaque error.
 */
const ACCEPTED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

const PROCESSING_STEPS = [
  "Files received",
  "Boundary detection",
  "Project-scale application",
  "Geometry calculation",
  "Engineering validation",
  "Marker preparation",
] as const;

/* -------------------------------- Utilities ------------------------------- */

/**
 * Deterministic piece identity derived from file identity (Principle 4).
 * The same folder processed twice yields the same identifiers, so geometry
 * results are reproducible and comparable across runs.
 */
function createPieceId(file: File): string {
  const stem = file.name.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
  return `piece-${stem}-${file.size}-${file.lastModified}`;
}

function createActivityId(): string {
  // Activity entries are display-only and never persisted, so a non-
  // deterministic key here does not affect engineering reproducibility.
  return `activity-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function fileKeyOf(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function cleanPatternName(fileName: string): string {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normaliseText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/\b(cut|piece|pattern|image|photo|png|jpg|jpeg|webp)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractPatternNumber(value: string): number | null {
  const match = value.match(/(?:pattern\s*)?0*(\d{1,3})\b/i);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);

  return Number.isFinite(parsed) ? parsed : null;
}

function createSearchTokens(value: string): string[] {
  return normaliseText(value)
    .split(" ")
    .filter((token) => token.length >= 2);
}

function calculateTextMatchScore(
  fileName: string,
  pattern: ProjectPatternStatus,
  recognition?: RecognitionPattern
): number {
  const source = normaliseText(fileName);

  const rawCandidates = [
    pattern.name,
    pattern.fileName ?? "",
    recognition?.recognisedName ?? "",
    recognition?.originalName ?? "",
  ];

  const candidates = rawCandidates.filter(Boolean).map(normaliseText);

  let score = 0;

  const sourceNumber = extractPatternNumber(fileName);

  const candidateNumbers = rawCandidates
    .map(extractPatternNumber)
    .filter((value): value is number => value !== null);

  if (sourceNumber !== null && candidateNumbers.includes(sourceNumber)) {
    score += MATCH_SCORE_PATTERN_NUMBER;
  }

  const sourceTokens = createSearchTokens(source);

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    if (source === candidate) {
      score += MATCH_SCORE_EXACT;
      continue;
    }

    if (source.includes(candidate) || candidate.includes(source)) {
      score += MATCH_SCORE_SUBSTRING;
    }

    const candidateTokens = createSearchTokens(candidate);

    const overlap = sourceTokens.filter((token) =>
      candidateTokens.includes(token)
    ).length;

    score += overlap * MATCH_SCORE_PER_TOKEN;
  }

  return score;
}

function isAcceptedImage(file: File): boolean {
  if ((ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return true;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  return (ACCEPTED_IMAGE_EXTENSIONS as readonly string[]).includes(extension);
}

function getTimeLabel(): string {
  return new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function roundValue(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const multiplier = 10 ** decimals;

  return Math.round(value * multiplier) / multiplier;
}

function isCalibrationPlausible(pixelsPerCm: number | null): boolean {
  return (
    typeof pixelsPerCm === "number" &&
    Number.isFinite(pixelsPerCm) &&
    pixelsPerCm >= MIN_PIXELS_PER_CM &&
    pixelsPerCm <= MAX_PIXELS_PER_CM
  );
}

/** Yields to the browser so progress and status updates actually paint. */
function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

/** Bounds a promise so a single pathological image cannot hang the batch. */
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

function getRecognitionForPattern(
  project: BatchEngineeringProject,
  patternId: string
): RecognitionPattern | undefined {
  return project.aiRecognition?.patterns.find(
    (item) => item.patternId === patternId
  );
}

function findBestProjectPattern({
  fileName,
  project,
  unavailablePatternIds,
}: {
  fileName: string;
  project: BatchEngineeringProject;
  unavailablePatternIds: Set<string>;
}): {
  pattern: ProjectPatternStatus | null;
  recognition: RecognitionPattern | null;
} {
  let bestPattern: ProjectPatternStatus | null = null;
  let bestRecognition: RecognitionPattern | null = null;
  let bestScore = 0;

  for (const pattern of project.patterns) {
    if (unavailablePatternIds.has(pattern.id)) {
      continue;
    }

    const recognition = getRecognitionForPattern(project, pattern.id);

    const score = calculateTextMatchScore(fileName, pattern, recognition);

    if (score > bestScore) {
      bestScore = score;
      bestPattern = pattern;
      bestRecognition = recognition ?? null;
    }
  }

  if (bestPattern && bestScore >= PATTERN_MATCH_MINIMUM_SCORE) {
    return { pattern: bestPattern, recognition: bestRecognition };
  }

  return { pattern: null, recognition: null };
}

function normaliseRotation(value: unknown): GeometryRotation {
  if (value === "rotate-180" || value === "180-only") {
    return "rotate-180";
  }

  if (value === "rotate-90" || value === "90-allowed") {
    return "rotate-90";
  }

  if (value === "free-rotation" || value === "free") {
    return "free";
  }

  return "fixed";
}

function calculateGeometrySummary(
  projectId: string,
  patterns: PatternGeometryResult[]
): GeometryProjectSummary {
  const totalAreaCm2 = patterns.reduce(
    (total, pattern) => total + (pattern.polygon.area.squareCm ?? 0),
    0
  );

  const totalPerimeterCm = patterns.reduce(
    (total, pattern) => total + (pattern.polygon.perimeter.cm ?? 0),
    0
  );

  const averageCompactness =
    patterns.length > 0
      ? patterns.reduce((total, pattern) => total + pattern.compactness, 0) /
        patterns.length
      : 0;

  const averageEngineeringScore =
    patterns.length > 0
      ? patterns.reduce(
          (total, pattern) => total + pattern.engineeringScore,
          0
        ) / patterns.length
      : 0;

  return {
    projectId,
    totalPatterns: patterns.length,
    totalAreaCm2: roundValue(totalAreaCm2, 2),
    totalPerimeterCm: roundValue(totalPerimeterCm, 2),
    averageCompactness: roundValue(averageCompactness, 4),
    averageEngineeringScore: roundValue(averageEngineeringScore, 1),
    generatedAt: new Date().toISOString(),
  };
}

function mergeGeometryPatterns(
  existing: PatternGeometryResult[],
  incoming: PatternGeometryResult[]
): PatternGeometryResult[] {
  const resultMap = new Map<string, PatternGeometryResult>();

  for (const pattern of existing) {
    resultMap.set(pattern.patternId, pattern);
  }

  for (const pattern of incoming) {
    resultMap.set(pattern.patternId, pattern);
  }

  return Array.from(resultMap.values());
}

function createPendingPatterns({
  project,
  savedPatterns,
}: {
  project: BatchEngineeringProject;
  savedPatterns: PatternGeometryResult[];
}): PendingGeometryPattern[] {
  const savedIds = new Set(savedPatterns.map((pattern) => pattern.patternId));

  const recognitionPatterns = project.aiRecognition?.patterns ?? [];

  return recognitionPatterns
    .filter((recognition) => !savedIds.has(recognition.patternId))
    .map((recognition) => {
      const projectPattern = project.patterns.find(
        (pattern) => pattern.id === recognition.patternId
      );

      const vertices =
        projectPattern?.geometryVertices ??
        projectPattern?.polygonVertices ??
        projectPattern?.tracedVertices ??
        [];

      const hasBoundary = Array.isArray(vertices) && vertices.length >= 3;

      const hasCalibration =
        typeof projectPattern?.pixelsPerCm === "number" &&
        projectPattern.pixelsPerCm > 0;

      return {
        patternId: recognition.patternId,
        recognisedName: recognition.recognisedName,
        originalName: recognition.originalName,
        markerEligible: recognition.markerEligible,

        reason:
          !hasBoundary && !hasCalibration
            ? "Boundary and scale calibration are required."
            : !hasBoundary
              ? "A valid pattern boundary is required."
              : "Scale calibration is required.",

        uploaded: Boolean(projectPattern?.fileName || projectPattern?.imageUrl),

        validationPassed: projectPattern?.validationPassed ?? false,

        hasCalibration,
        hasBoundary,

        cutQuantity:
          recognition.cutQuantity ?? projectPattern?.styleCutQuantity ?? 1,

        cutOnFold:
          recognition.cutOnFold ?? projectPattern?.styleCutOnFold ?? false,

        materialCategory:
          recognition.materialCategory ??
          projectPattern?.styleMaterialCategory ??
          projectPattern?.materialCategory ??
          "self",
      };
    });
}

function calculateConfidencePercent(value: number): number {
  // The detection engine reports 0..1. A value above 1 is treated as an
  // already-scaled percentage for tolerance against upstream changes.
  const normalised = value <= 1 ? value * 100 : value;

  return roundValue(Math.min(100, Math.max(0, normalised)), 1);
}

/**
 * Single source of truth for the engineering validation gate.
 *
 * Previously this logic existed in three places with two different confidence
 * thresholds, so the engineer could be shown a reason that did not match the
 * condition that actually failed. The reason returned here is always the
 * condition that actually triggered the exception.
 */
function evaluateAcceptance({
  confidence,
  engineeringScore,
  hasProjectMatch,
}: {
  confidence: number;
  engineeringScore: number;
  hasProjectMatch: boolean;
}): AcceptanceDecision {
  if (!hasProjectMatch) {
    return {
      requiresReview: true,
      reason: "Project-pattern matching requires engineer confirmation.",
    };
  }

  if (confidence < AUTO_APPROVAL_CONFIDENCE) {
    return {
      requiresReview: true,
      reason: `Boundary confidence ${confidence}% is below the ${AUTO_APPROVAL_CONFIDENCE}% auto-approval threshold.`,
    };
  }

  if (engineeringScore < MINIMUM_ENGINEERING_SCORE) {
    return {
      requiresReview: true,
      reason: `Geometry engineering score ${engineeringScore}% is below the ${MINIMUM_ENGINEERING_SCORE}% threshold.`,
    };
  }

  return { requiresReview: false };
}

/* ================================== Page ================================== */

export default function BatchEngineeringPage() {
    
  const params = useParams<{ projectId: string }>();
  const router = useRouter();

  const projectId = params.projectId;

  const projectStorageKey = `optifabric-project-${projectId}`;

  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const previewUrlsRef = useRef<Set<string>>(new Set());
  const navigationTimerRef = useRef<number | null>(null);

  /** Cancellation flag for an in-flight batch run. */
  const cancelRequestedRef = useRef(false);

  const [project, setProject] = useState<BatchEngineeringProject | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState("");

  const [patternPieces, setPatternPieces] = useState<BatchPatternPiece[]>([]);

  /**
   * Mirror of patternPieces for use inside async processing. Reading state
   * directly there would capture a stale closure — correct today only because
   * the fields read happen to be immutable after import.
   */
  const patternPiecesRef = useRef<BatchPatternPiece[]>([]);

  const [projectPixelsPerCm, setProjectPixelsPerCm] = useState<number | null>(
    null
  );
  const [orderQuantity, setOrderQuantity] =
  useState("");
const [fabricCostCurrency, setFabricCostCurrency] =
  useState<FabricCostCurrency>("GBP");

const [fabricCostPerMetre, setFabricCostPerMetre] =
  useState("");

const [fabricSupplier, setFabricSupplier] =
  useState("");

const [fabricLot, setFabricLot] =
  useState("");
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const [dragActive, setDragActive] = useState(false);

  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  const [reviewingPieceId, setReviewingPieceId] = useState<string | null>(null);

  const [message, setMessage] = useState(
    "Upload a folder or select multiple pattern images to begin."
  );

  useEffect(() => {
    patternPiecesRef.current = patternPieces;
  }, [patternPieces]);

  /* ------------------------------ Project load ---------------------------- */

  useEffect(() => {
    if (!projectId) {
      return;
    }

    try {
      const storedProject = localStorage.getItem(projectStorageKey);

      if (!storedProject) {
        setProjectError(
          "The engineering project could not be found in this browser."
        );
        return;
      }

      const parsedProject = JSON.parse(
        storedProject
      ) as BatchEngineeringProject;

      setProject(parsedProject);
      if (
  typeof parsedProject.orderQuantity ===
    "number" &&
  parsedProject.orderQuantity > 0
) {
  setOrderQuantity(
    String(
      parsedProject.orderQuantity
    )
  );
}
if (parsedProject.fabricCost) {
  setFabricCostCurrency(
    parsedProject.fabricCost.currency
  );

  setFabricCostPerMetre(
    String(
      parsedProject.fabricCost
        .costPerMetre
    )
  );

  setFabricSupplier(
    parsedProject.fabricCost
      .supplier ?? ""
  );

  setFabricLot(
    parsedProject.fabricCost
      .fabricLot ?? ""
  );
}
      const savedPixelsPerCm = parsedProject.patterns.find(
        (pattern) =>
          typeof pattern.pixelsPerCm === "number" && pattern.pixelsPerCm > 0
      )?.pixelsPerCm;

      if (typeof savedPixelsPerCm === "number" && savedPixelsPerCm > 0) {
        setProjectPixelsPerCm(savedPixelsPerCm);

        setMessage(
          `Saved project calibration detected: ${savedPixelsPerCm.toFixed(
            4
          )} pixels/cm. Upload the remaining images and start processing.`
        );
      }
    } catch (error) {
      console.error(
        "Unable to load the batch engineering project:",
        error
      );

      setProjectError("The stored project data could not be read.");
    } finally {
      setProjectLoading(false);
    }
  }, [projectId, projectStorageKey]);

  /* ------------------------------- Teardown ------------------------------- */

  useEffect(() => {
    const urls = previewUrlsRef.current;

    return () => {
      // Stop any in-flight batch from continuing to mutate state.
      cancelRequestedRef.current = true;

      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
      }

      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      urls.clear();
    };
  }, []);

  /* -------------------------------- Derived ------------------------------- */

  const counts = useMemo(() => {
    let boundaries = 0;
    let scale = 0;
    let geometry = 0;
    let ready = 0;
    let review = 0;
    let failed = 0;
    let selected = 0;
    let saved = 0;

    for (const piece of patternPieces) {
      if (piece.boundaryReady) boundaries += 1;
      if (piece.scaleReady) scale += 1;
      if (piece.geometryReady) geometry += 1;
      if (piece.selected) selected += 1;

      if (piece.status === "ready" || piece.status === "saved") ready += 1;
      if (piece.status === "review") review += 1;
      if (piece.status === "failed") failed += 1;
      if (piece.status === "saved") saved += 1;
    }

    return {
      images: patternPieces.length,
      boundaries,
      scale,
      geometry,
      ready,
      review,
      failed,
      selected,
      saved,
    };
  }, [patternPieces]);

  const calibrationPlausible = isCalibrationPlausible(projectPixelsPerCm);

  /**
   * Marker readiness under exception-based engineering: every piece that can
   * be saved has been saved, and nothing is left unresolved. The previous
   * condition required every uploaded image to be auto-ready, which almost
   * never occurs in practice and hid the Continue action.
   */
  const overallReady =
    counts.images > 0 &&
    counts.saved > 0 &&
    counts.review === 0 &&
    counts.failed === 0 &&
    counts.saved === counts.images;

  /* ------------------------------- Activity ------------------------------- */

  const addActivity = useCallback(
    (
      messageText: string,
      type: "info" | "success" | "warning" = "info"
    ) => {
      setActivities((current) => [
        {
          id: createActivityId(),
          time: getTimeLabel(),
          message: messageText,
          type,
        },
        ...current,
      ]);
    },
    []
  );

  /* --------------------------------- Intake ------------------------------- */

  const importFiles = useCallback(
    (incomingFiles: File[] | FileList) => {
      if (!project) {
        setMessage(
          "Wait for the engineering project to load before uploading images."
        );
        return;
      }

      const files = Array.from(incomingFiles).filter(isAcceptedImage);

      if (files.length === 0) {
        setMessage(
          "No supported pattern images were found. Use JPG, JPEG, PNG or WEBP files."
        );

        addActivity(
          "Upload rejected because no supported image files were found.",
          "warning"
        );

        return;
      }

      // All side effects (object URL creation, ref mutation, pattern matching)
      // are performed here, OUTSIDE the state updater. React may invoke an
      // updater more than once; doing this work inside it leaked blob URLs and
      // duplicated matching in StrictMode.
      const currentPieces = patternPiecesRef.current;

      const existingFileKeys = new Set(
        currentPieces.map((piece) => fileKeyOf(piece.file))
      );

      const unavailablePatternIds = new Set(
        currentPieces
          .map((piece) => piece.projectPatternId)
          .filter((value): value is string => Boolean(value))
      );

      const newPieces: BatchPatternPiece[] = [];

      for (const file of files) {
        if (existingFileKeys.has(fileKeyOf(file))) {
          continue;
        }

        existingFileKeys.add(fileKeyOf(file));

        const matched = findBestProjectPattern({
          fileName: file.name,
          project,
          unavailablePatternIds,
        });

        if (matched.pattern) {
          unavailablePatternIds.add(matched.pattern.id);
        }

        const previewUrl = URL.createObjectURL(file);
        previewUrlsRef.current.add(previewUrl);

        newPieces.push({
          id: createPieceId(file),
          file,

          name:
            matched.recognition?.recognisedName ??
            matched.pattern?.name ??
            cleanPatternName(file.name),

          previewUrl,

          projectPatternId: matched.pattern?.id ?? null,
          recognition: matched.recognition,

          status: "uploaded",
          selected: false,

          boundaryReady: false,
          scaleReady: false,
          geometryReady: false,

          confidence: null,

          warning: matched.pattern
            ? undefined
            : "No existing project pattern was confidently matched to this file.",

          vertices: [],

          originalImageWidth: 0,
          originalImageHeight: 0,

          geometryResult: null,
          engineerApproved: false,
        });
      }

      if (newPieces.length === 0) {
        setMessage("Those images are already present in the batch queue.");
        return;
      }

      setPatternPieces((current) => [...current, ...newPieces]);

      setMessage(
        `${newPieces.length} pattern image(s) received. Confirm the project calibration and start real AI processing.`
      );

      addActivity(
        `${newPieces.length} pattern image(s) added to the batch queue.`,
        "success"
      );
    },
    [project, addActivity]
  );

  const handleImageInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        importFiles(event.target.files);
      }

      event.target.value = "";
    },
    [importFiles]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);

      if (event.dataTransfer.files.length > 0) {
        importFiles(event.dataTransfer.files);
      }
    },
    [importFiles]
  );

  /* ------------------------------ Processing ------------------------------ */

  async function startProcessing() {
    if (processing) {
      return;
    }

    const startingPieces = patternPiecesRef.current;

    if (startingPieces.length === 0) {
      setMessage("Upload pattern images before starting AI processing.");
      return;
    }

    if (!projectPixelsPerCm || projectPixelsPerCm <= 0) {
      setMessage(
        "Enter or reuse one valid project calibration before batch geometry processing."
      );

      addActivity(
        "Batch processing paused because project calibration is missing.",
        "warning"
      );

      return;
    }

    if (!isCalibrationPlausible(projectPixelsPerCm)) {
      setMessage(
        `Project calibration of ${projectPixelsPerCm} pixels/cm is outside the plausible range of ${MIN_PIXELS_PER_CM}–${MAX_PIXELS_PER_CM}. Scale converts pixels into fabric — verify the ruler measurement before processing.`
      );

      addActivity(
        `Batch processing blocked: implausible calibration of ${projectPixelsPerCm} pixels/cm.`,
        "warning"
      );

      return;
    }

    const pixelsPerCm = projectPixelsPerCm;

    cancelRequestedRef.current = false;

    setProcessing(true);
    setProgressPercent(0);
    setActiveStep(0);
    setReviewingPieceId(null);

    /**
     * Single working copy for the whole run. Previously every change was
     * written twice — once to a results map, once to component state — which
     * made divergence between displayed and saved data a one-line mistake.
     */
    const working: BatchPatternPiece[] = startingPieces.map((piece) => ({
      ...piece,
      status: "uploaded",
      selected: false,
      boundaryReady: false,
      scaleReady: false,
      geometryReady: false,
      confidence: null,
      warning: piece.projectPatternId
        ? undefined
        : "No existing project pattern was confidently matched to this file.",
      error: undefined,
      vertices: [],
      originalImageWidth: 0,
      originalImageHeight: 0,
      geometryResult: null,
      engineerApproved: false,
      approvedAt: undefined,
    }));

    const commit = () => {
      setPatternPieces(working.map((piece) => ({ ...piece })));
    };

    commit();

    addActivity("Real AI batch processing started.", "info");

    setMessage(
      "OptiFabric AI is detecting real pattern boundaries and calculating real geometry."
    );

    const total = working.length;

    try {
      /* -------- Phase 1: boundary detection -------- */

      setActiveStep(1);

      for (let index = 0; index < total; index += 1) {
        if (cancelRequestedRef.current) break;

        const piece = working[index];

        piece.status = "boundary";
        commit();

        try {
          const analysis = await withTimeout(
            analysePatternImageBoundary({
              sourceUrl: piece.previewUrl,
              fileName: piece.file.name,
              backgroundExpected: "light",
              maximumAnalysisDimension: MAXIMUM_ANALYSIS_DIMENSION,
            }),
            BOUNDARY_ANALYSIS_TIMEOUT_MS,
            "Boundary analysis exceeded the maximum permitted time for a single image."
          );

          const confidence = calculateConfidencePercent(
            analysis.detection.quality.confidence
          );

          const vertices = analysis.detection.vertices;

          const boundaryUsable =
            analysis.detection.closed &&
            vertices.length >= 3 &&
            analysis.detection.status !== "failed";

          if (!boundaryUsable) {
            throw new Error(
              analysis.detection.explanation ||
                "AI could not produce a valid closed pattern boundary."
            );
          }

          piece.boundaryReady = true;
          piece.confidence = confidence;
          piece.vertices = vertices;
          piece.originalImageWidth = analysis.originalImageWidth;
          piece.originalImageHeight = analysis.originalImageHeight;
          piece.warning = analysis.detection.warnings?.[0]?.message;

          addActivity(
            `${piece.name}: real boundary detected with ${vertices.length} vertices at ${confidence}% confidence.`,
            "success"
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Unknown boundary-analysis error.";

          piece.status = "failed";
          piece.boundaryReady = false;
          piece.geometryReady = false;
          piece.error = errorMessage;
          piece.warning = "Manual tracing is required.";

          addActivity(
            `${piece.name}: boundary detection failed — ${errorMessage}`,
            "warning"
          );
        }

        commit();

        setProgressPercent(
          Math.round(((index + 1) / total) * PROGRESS_BOUNDARY_END)
        );

        // Let the browser paint. Boundary detection is heavy synchronous CPU
        // work; without this the progress bar freezes and the page appears
        // hung to the engineer.
        await yieldToBrowser();
      }

      /* -------- Phase 2: project scale application -------- */

      if (!cancelRequestedRef.current) {
        setActiveStep(2);

        for (const piece of working) {
          if (piece.status === "failed") continue;

          piece.status = "scale";
          piece.scaleReady = true;
        }

        commit();
        setProgressPercent(PROGRESS_SCALE_END);

        addActivity(
          `Project calibration of ${pixelsPerCm.toFixed(
            4
          )} pixels/cm applied to every successfully detected pattern.`,
          "success"
        );
      }

      /* -------- Phase 3: geometry calculation -------- */

      if (!cancelRequestedRef.current) {
        setActiveStep(3);

        for (let index = 0; index < total; index += 1) {
          if (cancelRequestedRef.current) break;

          const piece = working[index];

          if (
            piece.status === "failed" ||
            !piece.boundaryReady ||
            piece.vertices.length < 3
          ) {
            continue;
          }

          piece.status = "geometry";
          commit();

          const recognition = piece.recognition;

          const projectPattern = project?.patterns.find(
            (pattern) => pattern.id === piece.projectPatternId
          );

          const patternId = piece.projectPatternId ?? piece.id;

          // ENGINEERING FIREWALL (Principle 5): every input below is a
          // measured or declared engineering value. No confidence-derived
          // value is passed here, and none may be added.
          const geometryResult = generatePatternGeometry({
            patternId,

            recognisedName: recognition?.recognisedName ?? piece.name,

            vertices: piece.vertices,

            widthPixels: piece.originalImageWidth,
            heightPixels: piece.originalImageHeight,

            pixelsPerCm,

            grainControlled:
              recognition?.grainControlled ??
              projectPattern?.grainLineVisible ??
              false,

            cutOnFold:
              recognition?.cutOnFold ??
              projectPattern?.styleCutOnFold ??
              false,

            mirroredPair: recognition?.mirroredPair ?? false,

            rotation: normaliseRotation(recognition?.rotationRule),

            directionalFabric: recognition?.directionalFabric ?? false,
            stripeMatch: recognition?.stripeMatch ?? false,
            checkMatch: recognition?.checkMatch ?? false,
            napDirection: recognition?.napDirection ?? false,

            cutQuantity:
              recognition?.cutQuantity ??
              projectPattern?.styleCutQuantity ??
              1,

            markerEligible:
              recognition?.markerEligible ??
              projectPattern?.includeInMarker ??
              true,
          });

          const geometryValid =
            geometryResult.polygon.closed &&
            geometryResult.polygon.vertexCount >= 3 &&
            geometryResult.polygon.area.squarePixels > 0 &&
            geometryResult.polygon.perimeter.pixels > 0;

          if (!geometryValid) {
            piece.status = "failed";
            piece.geometryReady = false;
            piece.geometryResult = geometryResult;
            piece.error =
              "The detected boundary did not produce valid measurable geometry.";

            commit();
            continue;
          }

          piece.status = "geometry";
          piece.scaleReady = true;
          piece.geometryReady = true;
          piece.geometryResult = geometryResult;

          commit();

          setProgressPercent(
            PROGRESS_SCALE_END +
              Math.round(
                ((index + 1) / total) *
                  (PROGRESS_GEOMETRY_END - PROGRESS_SCALE_END)
              )
          );

          await yieldToBrowser();
        }

        addActivity("Real automatic geometry calculation completed.", "success");
      }

      /* -------- Phase 4: engineering validation -------- */

      if (!cancelRequestedRef.current) {
        setActiveStep(4);

        for (let index = 0; index < total; index += 1) {
          const piece = working[index];

          if (
            piece.status === "failed" ||
            !piece.geometryReady ||
            !piece.geometryResult
          ) {
            continue;
          }

          const decision = evaluateAcceptance({
            confidence: piece.confidence ?? 0,
            engineeringScore: piece.geometryResult.engineeringScore,
            hasProjectMatch: Boolean(piece.projectPatternId),
          });

          piece.status = decision.requiresReview ? "review" : "ready";
          piece.selected = !decision.requiresReview;
          piece.engineerApproved = false;
          piece.approvedAt = undefined;
          piece.warning = decision.reason;

          setProgressPercent(
            PROGRESS_GEOMETRY_END +
              Math.round(
                ((index + 1) / total) *
                  (PROGRESS_VALIDATION_END - PROGRESS_GEOMETRY_END)
              )
          );
        }

        commit();
      }

      /* -------- Phase 5: marker preparation -------- */

      if (cancelRequestedRef.current) {
        setMessage(
          "Batch processing was cancelled by the engineer. Completed pieces are retained; restart processing to continue."
        );

        addActivity("Batch processing cancelled by the engineer.", "warning");
      } else {
        setActiveStep(5);
        setProgressPercent(100);

        addActivity("Real batch engineering validation completed.", "success");

        setMessage(
          "Real batch processing completed. Review flagged pieces, tick the acceptable pieces and save selected geometry."
        );
      }
    } catch (error) {
      console.error("Batch engineering processing failed:", error);

      setMessage(
        "Batch processing stopped because an unexpected engineering error occurred."
      );

      addActivity("Batch processing stopped unexpectedly.", "warning");
    } finally {
      cancelRequestedRef.current = false;
      setProcessing(false);
    }
  }

  function cancelProcessing() {
    if (!processing) return;

    cancelRequestedRef.current = true;

    setMessage("Cancelling after the current pattern completes…");
    addActivity("Cancellation requested by the engineer.", "warning");
  }

  /* ------------------------------- Selection ------------------------------ */

  /**
   * Additive rather than destructive. The previous implementation replaced the
   * whole selection, so selecting review items silently deselected everything
   * the engineer had already accepted.
   */
  const selectAllReady = useCallback(() => {
    setPatternPieces((current) =>
      current.map((piece) =>
        piece.status === "ready" || piece.status === "saved"
          ? { ...piece, selected: true }
          : piece
      )
    );

    addActivity("All engineering-ready pieces selected.", "info");
  }, [addActivity]);

  const selectReviewPieces = useCallback(() => {
    const approvedAt = new Date().toISOString();

    setPatternPieces((current) =>
      current.map((piece) =>
        piece.status === "review"
          ? {
              ...piece,
              selected: true,
              engineerApproved: true,
              approvedAt,
              warning:
                "Engineer approved this review item for project saving.",
            }
          : piece
      )
    );

    addActivity(
      "Review-required pieces approved and selected for project saving.",
      "info"
    );
  }, [addActivity]);

  const clearSelection = useCallback(() => {
    setPatternPieces((current) =>
      current.map((piece) => ({ ...piece, selected: false }))
    );
  }, []);

  const togglePiece = useCallback((pieceId: string) => {
    setPatternPieces((current) =>
      current.map((piece) => {
        if (piece.id !== pieceId) {
          return piece;
        }

        const maySelect =
          piece.status === "ready" ||
          piece.status === "review" ||
          piece.status === "saved";

        if (!maySelect) {
          return piece;
        }

        const selected = !piece.selected;

        const approvingException = piece.status === "review" && selected;

        return {
          ...piece,
          selected,

          engineerApproved: approvingException
            ? true
            : piece.engineerApproved,

          // Audit metadata: records WHEN the exception was accepted. Operator
          // identity requires the auth layer and is a recommended follow-up.
          approvedAt: approvingException
            ? new Date().toISOString()
            : piece.approvedAt,

          warning: approvingException
            ? "Engineer approved this review item for project saving."
            : piece.warning,
        };
      })
    );
  }, []);

  const startReview = useCallback((pieceId: string) => {
    setReviewingPieceId((currentPieceId) =>
      currentPieceId === pieceId ? null : pieceId
    );
  }, []);

  const inspectPiece = useCallback(
    (pieceId: string, projectPatternId: string | null) => {
      const validationUrl = `/optifabric/project/${projectId}/patterns/${
        projectPatternId ?? pieceId
      }/trace`;

      window.open(validationUrl, "_blank", "noopener,noreferrer");
    },
    [projectId]
  );

  /** Removes one piece and releases its blob URL immediately. */
  const removePiece = useCallback(
    (pieceId: string) => {
      setPatternPieces((current) => {
        const target = current.find((piece) => piece.id === pieceId);

        if (target) {
          URL.revokeObjectURL(target.previewUrl);
          previewUrlsRef.current.delete(target.previewUrl);
        }

        return current.filter((piece) => piece.id !== pieceId);
      });

      setReviewingPieceId((currentId) =>
        currentId === pieceId ? null : currentId
      );
    },
    []
  );

  function clearBatch() {
    previewUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    previewUrlsRef.current.clear();

    setPatternPieces([]);
    setActivities([]);
    setReviewingPieceId(null);

    setProgressPercent(0);
    setActiveStep(0);

    setMessage(
      "Batch cleared. Upload a new garment-style folder to continue."
    );
  }
function saveFabricCost() {
  if (!project) {
    setMessage(
      "The engineering project is not available."
    );

    return;
  }

  const parsedCost =
    Number(fabricCostPerMetre);
const parsedOrderQuantity =
  Number(orderQuantity);
  if (
    !Number.isFinite(parsedCost) ||
    parsedCost <= 0
  ) {
    setMessage(
      "Enter a valid fabric cost per metre greater than zero."
    );

    return;
  }
if (
  !Number.isFinite(parsedOrderQuantity) ||
  parsedOrderQuantity <= 0 ||
  !Number.isInteger(parsedOrderQuantity)
) {
  setMessage(
    "Enter a valid whole-number production order quantity greater than zero."
  );

  return;
}
  const updatedAt =
    new Date().toISOString();

  const fabricCost:
    ProjectFabricCost = {
    currency:
      fabricCostCurrency,

    costPerMetre:
      roundValue(
        parsedCost,
        4
      ),

    supplier:
      fabricSupplier.trim() ||
      undefined,

    fabricLot:
      fabricLot.trim() ||
      undefined,

    updatedAt,
  };

  const updatedProject:
  BatchEngineeringProject = {
  ...project,

  orderQuantity:
    parsedOrderQuantity,

  fabricCost,

  updatedAt,
};

  try {
    localStorage.setItem(
      projectStorageKey,
      JSON.stringify(
        updatedProject
      )
    );

    setProject(
      updatedProject
    );

    setMessage(
  `Fabric cost and order quantity saved: ${fabricCost.currency} ${fabricCost.costPerMetre.toFixed(
    4
  )} per metre for ${parsedOrderQuantity.toLocaleString(
    "en-GB"
  )} garments.`
);

    addActivity(
      `Fabric cost saved at ${fabricCost.currency} ${fabricCost.costPerMetre.toFixed(
        4
      )} per metre.`,
      "success"
    );
  } catch (error) {
    console.error(
      "Unable to save fabric cost:",
      error
    );

    setMessage(
      "The fabric cost could not be saved."
    );
  }
}
  /* --------------------------------- Save --------------------------------- */

  function saveSelectedGeometry() {
    if (!project) {
      setMessage("The engineering project is not available for saving.");
      return;
    }

    if (!isCalibrationPlausible(projectPixelsPerCm)) {
      setMessage(
        "Saving blocked: the project calibration is missing or outside the plausible range. Fabric consumption depends entirely on this value."
      );
      return;
    }

    const pixelsPerCm = projectPixelsPerCm as number;

    const selectedPieces = patternPieces.filter(
      (piece) => piece.selected && piece.geometryReady && piece.geometryResult
    );

    if (selectedPieces.length === 0) {
      setMessage(
        "Select at least one valid engineering-ready piece before saving."
      );
      return;
    }

    const unresolvedReview = selectedPieces.filter(
      (piece) => piece.status === "review" && !piece.engineerApproved
    );

    if (unresolvedReview.length > 0) {
      setMessage(
        "Tick each acceptable review item to record engineer approval before saving."
      );
      return;
    }

    const unmatchedPieces = selectedPieces.filter(
      (piece) => !piece.projectPatternId
    );

    if (unmatchedPieces.length > 0) {
      setMessage(
        `${unmatchedPieces.length} selected file(s) could not be matched to existing project pattern IDs. Leave them unselected or correct their file names before saving.`
      );
      return;
    }

    setSaving(true);

    try {
      const savedAt = new Date().toISOString();

      const selectedResults = selectedPieces
        .map((piece) => piece.geometryResult)
        .filter(
          (result): result is PatternGeometryResult => result !== null
        );

      const existingResults = project.aiGeometry?.patterns ?? [];

      const mergedResults = mergeGeometryPatterns(
        existingResults,
        selectedResults
      );

      const validResults = getValidGeometryPatterns(mergedResults);

      const selectedByPatternId = new Map(
        selectedPieces.map((piece) => [
          piece.projectPatternId as string,
          piece,
        ])
      );

      const updatedPatterns = project.patterns.map((pattern) => {
        const batchPiece = selectedByPatternId.get(pattern.id);

        if (!batchPiece || !batchPiece.geometryResult) {
          return pattern;
        }

        const geometry = batchPiece.geometryResult;
        const vertices = geometry.polygon.vertices;

        return {
          ...pattern,

          fileName: batchPiece.file.name,
          fileType: batchPiece.file.type,
          fileSize: batchPiece.file.size,

          uploadedAt: pattern.uploadedAt ?? savedAt,

          validationPassed: true,
          scaleVisible: true,
          includedInStyle: true,

          includeInMarker:
            batchPiece.recognition?.markerEligible ??
            pattern.includeInMarker ??
            true,

          // COMPATIBILITY: six aliases of the same vertex array are retained
          // because downstream modules read different field names. This is the
          // single largest contributor to project storage size and is the
          // first thing to consolidate when migrating off localStorage.
          geometryVertices: vertices,
          polygonVertices: vertices,
          tracedVertices: vertices,
          tracedPoints: vertices,
          boundaryPoints: vertices,
          points: vertices,

          pixelsPerCm,
          pixelsPerInch: pixelsPerCm * CM_PER_INCH,

          detectedWidthPixels: geometry.polygon.boundingBox.width,
          detectedHeightPixels: geometry.polygon.boundingBox.height,

          calibratedWidthCm: geometry.dimensions.widthCm,
          calibratedHeightCm: geometry.dimensions.heightCm,
          calibratedAreaSqCm: geometry.polygon.area.squareCm,
          calibratedPerimeterCm: geometry.polygon.perimeter.cm,

          geometryTracingCompleted: true,
          geometryTracingCompletedAt: savedAt,

          // Audit metadata for exceptions accepted by the engineer.
          engineerApproved: batchPiece.engineerApproved,
          engineerApprovedAt: batchPiece.approvedAt,

          patternTracing: {
            boundary: {
              vertices,
              closed: true,
              vertexCount: vertices.length,
              startedAt: savedAt,
              closedAt: savedAt,
            },

            calibration: {
              referenceLengthInches: REFERENCE_LENGTH_INCHES,
              referenceLengthCm: REFERENCE_LENGTH_CM,
              measuredPixels: pixelsPerCm * REFERENCE_LENGTH_CM,
              pixelsPerCm,
              pixelsPerInch: pixelsPerCm * CM_PER_INCH,
              calibrated: true,
              calibratedAt: savedAt,
            },

            savedAt,
          },
        };
      });

      const projectWithPatterns: BatchEngineeringProject = {
        ...project,
        patterns: updatedPatterns,
      };

      const pendingPatterns = createPendingPatterns({
        project: projectWithPatterns,
        savedPatterns: validResults,
      });

      const summary = calculateGeometrySummary(projectId, validResults);

      const recognitionPatterns = project.aiRecognition?.patterns ?? [];

      const markerReadyCount = validResults.filter((geometry) => {
        const recognition = recognitionPatterns.find(
          (item) => item.patternId === geometry.patternId
        );

        return recognition?.markerEligible ?? true;
      }).length;

      const savedGeometry: SavedGeometryData = {
        completed: validResults.length > 0,
        completedAt: savedAt,

        totalRecognitionPatterns:
          recognitionPatterns.length > 0
            ? recognitionPatterns.length
            : updatedPatterns.length,

        geometryReadyPatterns: validResults.length,
        geometryPendingPatterns: pendingPatterns.length,
        validGeometryPatterns: validResults.length,
        markerReadyPatterns: markerReadyCount,

        summary,
        patterns: validResults,
        pendingPatterns,
      };

      const updatedRecognition = project.aiRecognition
        ? {
            ...project.aiRecognition,

            reviewRequired: patternPieces.filter(
              (piece) =>
                piece.status === "review" && !piece.engineerApproved
            ).length,

            recognisedPatterns: Math.max(
              project.aiRecognition.recognisedPatterns,
              validResults.length
            ),

            completedAt: savedAt,
          }
        : undefined;

      const updatedProject: BatchEngineeringProject = {
        ...project,
        patterns: updatedPatterns,
        aiRecognition: updatedRecognition,
        aiGeometry: savedGeometry,
        updatedAt: savedAt,
      };

      try {
        localStorage.setItem(
          projectStorageKey,
          JSON.stringify(updatedProject)
        );
      } catch (storageError) {
        // Quota exhaustion is a realistic failure at factory scale and needs
        // an actionable message, not a generic "save failed".
        const quotaExceeded =
          storageError instanceof DOMException &&
          (storageError.name === "QuotaExceededError" ||
            storageError.name === "NS_ERROR_DOM_QUOTA_REACHED");

        if (quotaExceeded) {
          setMessage(
            "Browser storage is full — this project has exceeded the local storage limit. Export or archive completed styles before saving further geometry."
          );

          addActivity(
            "Geometry saving failed: browser storage quota exceeded.",
            "warning"
          );

          setSaving(false);
          return;
        }

        throw storageError;
      }

      try {
        updateProjectRegistryEntry(
          updatedProject as unknown as Parameters<
            typeof updateProjectRegistryEntry
          >[0]
        );
      } catch (error) {
        console.error(
          "Unable to synchronise the batch geometry with the project registry:",
          error
        );
      }

      setProject(updatedProject);

      const savedIds = new Set(selectedPieces.map((piece) => piece.id));

      setPatternPieces((current) =>
        current.map((piece) =>
          savedIds.has(piece.id)
            ? {
                ...piece,
                status: "saved",
                selected: false,
                engineerApproved: true,
                approvedAt: piece.approvedAt ?? savedAt,
                warning: "Geometry saved to Module 04.",
              }
            : piece
        )
      );

      addActivity(
        `${selectedResults.length} real pattern geometries were saved into the Module 04 project store.`,
        "success"
      );

      setMessage(
        `${selectedResults.length} real geometries saved successfully. Module 04 is being opened with the updated project data.`
      );

      navigationTimerRef.current = window.setTimeout(() => {
        navigationTimerRef.current = null;
        router.push(`/optifabric/project/${projectId}/geometry`);
      }, NAVIGATION_DELAY_MS);
    } catch (error) {
      console.error("Batch geometry saving failed:", error);

      setMessage(
        "The real batch geometry could not be saved. Review the browser console for the exact engineering error."
      );

      addActivity("Batch geometry saving failed.", "warning");
    } finally {
      setSaving(false);
    }
  }

  /* --------------------------------- Render -------------------------------- */

  if (projectLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 px-10 py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-5 text-lg font-black">
            Loading Batch Engineering Project...
          </p>
        </section>
      </main>
    );
  }

  if (projectError || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="max-w-xl rounded-3xl border border-red-400/30 bg-red-950/20 p-8 text-center">
          <p className="text-5xl">⚠️</p>

          <h1 className="mt-4 text-2xl font-black">
            Batch Project Unavailable
          </h1>

          <p className="mt-4 leading-7 text-red-100">
            {projectError || "The project could not be loaded."}
          </p>

          <Link
            href="/optifabric"
            className="mt-6 inline-block rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950"
          >
            Return to OptiFabric
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <input
        ref={folderInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageInput}
        className="hidden"
        {...({
          webkitdirectory: "",
          directory: "",
        } as React.InputHTMLAttributes<HTMLInputElement>)}
      />

      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageInput}
        className="hidden"
      />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
        <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 p-7 sm:p-9">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
            OptiFabric AI · RC5-003
          </p>

          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Real AI Batch Engineering
          </h1>

          <p className="mt-3 text-xl font-black text-cyan-100">
            {project.projectName ?? project.name ?? "Engineering Project"}
          </p>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 sm:text-xl">
            Detect real boundaries, calculate real geometry, approve exceptions
            and save the complete style directly into Module 04.
          </p>

          <p className="mt-5 font-black text-cyan-200">
            The engineer makes the decisions. OptiFabric performs the repetitive
            engineering work.
          </p>
        </section>

        {message ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 px-5 py-4 font-bold leading-6 text-cyan-100">
            {message}
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatusCard title="Images" current={counts.images} />

          <StatusCard
            title="Boundaries"
            current={counts.boundaries}
            total={counts.images}
          />

          <StatusCard
            title="Scale"
            current={counts.scale}
            total={counts.images}
          />

          <StatusCard
            title="Geometry"
            current={counts.geometry}
            total={counts.images}
          />

          <StatusCard
            title="Ready"
            current={counts.ready}
            total={counts.images}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Project intake
              </p>

              <h2 className="mt-2 text-3xl font-black">Batch Upload</h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Drop a folder or upload multiple pattern images in one
                operation.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
                disabled={processing || saving}
                className="rounded-xl border border-cyan-400/30 bg-cyan-950/30 px-5 py-3 font-black text-cyan-200 disabled:opacity-40"
              >
                Select Folder
              </button>

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={processing || saving}
                className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 disabled:opacity-40"
              >
                Upload Images
              </button>
            </div>
          </div>

          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`mt-7 rounded-3xl border-2 border-dashed p-14 text-center transition ${
              dragActive
                ? "border-cyan-300 bg-cyan-950/30"
                : "border-cyan-500/30 bg-slate-950/40"
            }`}
          >
            <p className="text-5xl">📂</p>

            <p className="mt-4 text-2xl font-black text-cyan-300">
              Drag Folder or Pattern Images Here
            </p>

            <p className="mt-3 text-slate-400">JPG, JPEG, PNG and WEBP</p>
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
            <label>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Project calibration — pixels/cm
              </span>

              <input
                type="number"
                min={MIN_PIXELS_PER_CM}
                max={MAX_PIXELS_PER_CM}
                step="0.0001"
                value={projectPixelsPerCm ?? ""}
                onChange={(event) => {
                  const value = Number(event.target.value);

                  setProjectPixelsPerCm(
                    Number.isFinite(value) && value > 0 ? value : null
                  );
                }}
                placeholder="Saved project calibration or one verified ruler value"
                className={`mt-2 w-full rounded-xl border bg-slate-950 px-4 py-3 font-black text-white outline-none ${
                  projectPixelsPerCm !== null && !calibrationPlausible
                    ? "border-amber-400 focus:border-amber-300"
                    : "border-slate-700 focus:border-cyan-400"
                }`}
              />

              {projectPixelsPerCm !== null && !calibrationPlausible ? (
                <p className="mt-2 text-xs font-bold leading-5 text-amber-300">
                  This calibration is outside the plausible range of{" "}
                  {MIN_PIXELS_PER_CM}–{MAX_PIXELS_PER_CM} pixels/cm. Scale
                  converts pixels into fabric — verify the ruler measurement
                  before processing.
                </p>
              ) : (
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  OptiFabric automatically reuses an existing valid calibration
                  saved in this project. Automatic batch ruler detection will
                  follow after this integration is verified.
                </p>
              )}
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={startProcessing}
                disabled={
                  processing || saving || patternPieces.length === 0
                }
                className="rounded-xl bg-violet-500 px-7 py-4 font-black text-white transition enabled:hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {processing
                  ? "Real AI Processing..."
                  : "Start Real AI Processing"}
              </button>

              {processing ? (
                <button
                  type="button"
                  onClick={cancelProcessing}
                  className="rounded-xl border border-red-400/40 bg-red-950/20 px-6 py-4 font-black text-red-300 transition hover:bg-red-950/40"
                >
                  Stop
                </button>
              ) : null}
            </div>
          </div>
        </section>
<section className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-950/10 p-6">
  <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
    Fabric Cost Intelligence
  </p>

  <h2 className="mt-2 text-2xl font-black text-white">
    Project Fabric Cost
  </h2>

  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
    Enter the current fabric cost for this project. OptiFabric will use it
    later to estimate the financial exposure caused by marker waste,
    geometry errors and production risk.
  </p>

  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        Currency
      </span>

      <select
        value={fabricCostCurrency}
        onChange={(event) =>
          setFabricCostCurrency(
            event.target.value as FabricCostCurrency
          )
        }
        disabled={processing || saving}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold text-white outline-none transition focus:border-emerald-400 disabled:opacity-50"
      >
        <option value="GBP">GBP — £</option>
        <option value="USD">USD — $</option>
        <option value="EUR">EUR — €</option>
        <option value="BDT">BDT — ৳</option>
      </select>
    </label>

    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        Cost per Metre
      </span>

      <input
        type="number"
        min="0"
        step="0.0001"
        value={fabricCostPerMetre}
        onChange={(event) =>
          setFabricCostPerMetre(
            event.target.value
          )
        }
        placeholder="Example: 3.8500"
        disabled={processing || saving}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-400 disabled:opacity-50"
      />
    </label>
<label>
  <span className="text-xs font-black uppercase tracking-wide text-slate-400">
    Production Order Quantity
  </span>

  <input
    type="number"
    min={1}
    step={1}
    value={orderQuantity}
    onChange={(event) =>
      setOrderQuantity(event.target.value)
    }
    placeholder="Example: 25000"
    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none focus:border-cyan-400"
  />
</label>
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        Supplier
      </span>

      <input
        type="text"
        value={fabricSupplier}
        onChange={(event) =>
          setFabricSupplier(
            event.target.value
          )
        }
        placeholder="Optional"
        disabled={processing || saving}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-400 disabled:opacity-50"
      />
    </label>

    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-500">
        Fabric Lot
      </span>

      <input
        type="text"
        value={fabricLot}
        onChange={(event) =>
          setFabricLot(
            event.target.value
          )
        }
        placeholder="Optional"
        disabled={processing || saving}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold text-white outline-none transition placeholder:text-slate-700 focus:border-emerald-400 disabled:opacity-50"
      />
    </label>
  </div>

  <div className="mt-5 flex flex-wrap items-center gap-4">
    <button
      type="button"
      onClick={saveFabricCost}
      disabled={processing || saving}
      className="rounded-xl bg-emerald-500 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-40"
    >
      Save Fabric Cost
    </button>

    {project.fabricCost ? (
      <p className="text-sm font-bold text-emerald-300">
        Saved:{" "}
        {project.fabricCost.currency}{" "}
        {project.fabricCost.costPerMetre.toFixed(
          4
        )} per metre
      </p>
    ) : (
      <p className="text-sm text-slate-500">
        No fabric cost saved for this project.
      </p>
    )}
  </div>
</section>
        <section className="mt-8 rounded-3xl border border-violet-400/20 bg-violet-950/10 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
            Live processing pipeline
          </p>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-violet-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-sm font-bold">
            <span className="text-slate-400">
              {PROCESSING_STEPS[activeStep]}
            </span>

            <span className="text-violet-300">{progressPercent}%</span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {PROCESSING_STEPS.map((step, index) => (
              <PipelineStep
                key={step}
                label={step}
                complete={progressPercent === 100 || index < activeStep}
                active={index === activeStep && progressPercent < 100}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <BatchMetric label="Uploaded" value={counts.images} />
          <BatchMetric label="AI Ready" value={counts.ready} />
          <BatchMetric label="Manual Review" value={counts.review} />
          <BatchMetric label="Failed" value={counts.failed} />
          <BatchMetric label="Selected" value={counts.selected} />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Engineering queue
              </p>

              <h2 className="mt-2 text-3xl font-black">Real Pattern Review</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={selectAllReady}
                disabled={processing || saving}
                className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 px-4 py-3 font-black text-emerald-300 disabled:opacity-40"
              >
                Select All Ready
              </button>

              <button
                type="button"
                onClick={selectReviewPieces}
                disabled={processing || saving || counts.review === 0}
                className="rounded-xl border border-amber-400/30 bg-amber-950/20 px-4 py-3 font-black text-amber-300 disabled:opacity-40"
              >
                Approve All Review
              </button>

              <button
                type="button"
                onClick={clearSelection}
                disabled={processing || saving || counts.selected === 0}
                className="rounded-xl border border-slate-600 bg-slate-950/40 px-4 py-3 font-black text-slate-300 disabled:opacity-40"
              >
                Clear Selection
              </button>

              <button
                type="button"
                onClick={saveSelectedGeometry}
                disabled={processing || saving || counts.selected === 0}
                className="rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? "Saving Real Geometry..."
                  : "Save Selected Geometry"}
              </button>

              <button
                type="button"
                onClick={clearBatch}
                disabled={processing || saving}
                className="rounded-xl border border-red-400/30 bg-red-950/20 px-4 py-3 font-black text-red-300 disabled:opacity-40"
              >
                Clear Batch
              </button>
            </div>
          </div>

          {patternPieces.length > 0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {patternPieces.map((piece) => (
                <PatternQueueCard
                  key={piece.id}
                  piece={piece}
                  reviewOpen={reviewingPieceId === piece.id}
                  disabled={processing || saving}
                  fabricCost={
  project.fabricCost ?? null
}
                  onReview={startReview}
                  onApprove={togglePiece}
                  onInspect={inspectPiece}
                  onRemove={removePiece}
                />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-10 text-center text-slate-500">
              The engineering queue will appear after pattern images are
              uploaded.
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">
            Engineering activity log
          </p>

          {activities.length > 0 ? (
            <div className="mt-5 space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="grid gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 sm:grid-cols-[100px_1fr]"
                >
                  <span className="font-mono text-xs text-slate-500">
                    {activity.time}
                  </span>

                  <span
                    className={
                      activity.type === "success"
                        ? "text-emerald-300"
                        : activity.type === "warning"
                          ? "text-amber-300"
                          : "text-slate-300"
                    }
                  >
                    {activity.message}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-slate-500">
              Real processing activity will be recorded here.
            </p>
          )}
        </section>

        <section className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/optifabric/project/${projectId}/geometry`}
            className="rounded-xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-3 font-black text-cyan-300"
          >
            Open Project Geometry
          </Link>

          <Link
            href={`/optifabric/project/${projectId}`}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-black text-slate-300"
          >
            Project Dashboard
          </Link>

          {overallReady ? (
            <Link
              href={`/optifabric/project/${projectId}/geometry`}
              className="rounded-xl bg-emerald-400 px-5 py-3 font-black text-slate-950"
            >
              Continue to Marker
            </Link>
          ) : null}
        </section>
      </div>
    </main>
  );
}

/* ============================== Presentation ============================== */

function StatusCard({
  title,
  current,
  total,
}: {
  title: string;
  current: number;
  /** Omit for absolute counts — a card reading "N / N" carries no signal. */
  total?: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-black">
        {typeof total === "number" ? `${current} / ${total}` : current}
      </p>
    </div>
  );
}

function BatchMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function PipelineStep({
  label,
  complete,
  active,
}: {
  label: string;
  complete: boolean;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 text-center text-xs font-black ${
        complete
          ? "border-emerald-400/30 bg-emerald-950/20 text-emerald-300"
          : active
            ? "border-violet-400/30 bg-violet-950/30 text-violet-200"
            : "border-slate-700 bg-slate-950/50 text-slate-500"
      }`}
    >
      {complete ? "✓ " : active ? "● " : "○ "}
      {label}
    </div>
  );
}

interface PatternQueueCardProps {
  piece: BatchPatternPiece;
  reviewOpen: boolean;
  disabled: boolean;
  fabricCost: ProjectFabricCost | null;
  onReview: (pieceId: string) => void;
  onApprove: (pieceId: string) => void;
  onInspect: (pieceId: string, projectPatternId: string | null) => void;
  onRemove: (pieceId: string) => void;
}

/**
 * Memoised: at 200 pieces the queue previously re-rendered every card on every
 * per-piece progress update, turning batch processing into O(N²) card renders.
 */
const PatternQueueCard = memo(function PatternQueueCard({
  piece,
  reviewOpen,
  disabled,
  fabricCost,
  onReview,
  onApprove,
  onInspect,
  onRemove,
}: PatternQueueCardProps) {
  const riskAssessment =
    buildEngineeringRiskAssessment(piece);

  const decisionSummary =
    buildEngineeringDecisionSummary(
      riskAssessment
    );

  const maySelect =
    piece.status === "ready" ||
    piece.status === "review" ||
    piece.status === "saved";

  const mayReview =
    piece.status === "review" ||
    piece.status === "failed";

  const vertexCount =
    piece.geometryResult?.polygon.vertexCount ??
    null;

  return (
    <article
      className={`rounded-2xl border p-4 ${
        piece.status === "failed"
          ? "border-red-400/30 bg-red-950/10"
          : piece.status === "review"
            ? "border-amber-400/30 bg-amber-950/10"
            : piece.status === "saved"
              ? "border-emerald-400/30 bg-emerald-950/10"
              : "border-slate-700 bg-slate-950/60"
      }`}
    >
      <div className="flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- blob: object
            URLs cannot be served through the Next.js image optimiser. */}
        <img
          src={piece.previewUrl}
          alt={`Pattern preview for ${piece.name}`}
          className="h-20 w-20 rounded-xl border border-slate-700 bg-white object-contain"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-black text-white">
                {piece.name}
              </p>

              <p className="mt-1 truncate text-xs text-slate-500">
                {piece.file.name}
              </p>

              <p className="mt-1 truncate text-xs text-slate-600">
                Project ID:{" "}
                {piece.projectPatternId ??
                  "Not matched"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                aria-label={`Select ${piece.name} for saving`}
                checked={piece.selected}
                onChange={() =>
                  onApprove(piece.id)
                }
                disabled={
                  !maySelect || disabled
                }
                className="h-5 w-5 accent-cyan-400 disabled:opacity-30"
              />

              <button
                type="button"
                aria-label={`Remove ${piece.name} from the batch`}
                onClick={() =>
                  onRemove(piece.id)
                }
                disabled={disabled}
                className="rounded-lg border border-slate-700 px-2 py-1 text-xs font-black text-slate-500 transition hover:border-red-400/40 hover:text-red-300 disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge
              status={piece.status}
            />

            {piece.confidence !== null ? (
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-black text-slate-300">
                Confidence{" "}
                {piece.confidence.toFixed(1)}%
              </span>
            ) : null}

            {vertexCount !== null ? (
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-black text-violet-300">
                {vertexCount} vertices
              </span>
            ) : null}
          </div>

          {piece.engineerApproved ? (
            <p className="mt-3 text-xs font-black text-emerald-300">
              ✓ Engineer approved
              {piece.approvedAt
                ? ` · ${new Date(
                    piece.approvedAt
                  ).toLocaleString("en-GB")}`
                : ""}
            </p>
          ) : null}

          {piece.warning ? (
            <p className="mt-3 text-xs font-bold leading-5 text-amber-300">
              {piece.warning}
            </p>
          ) : null}

          {piece.status === "failed" &&
          piece.error ? (
            <p className="mt-3 text-xs font-bold leading-5 text-red-300">
              {piece.error}
            </p>
          ) : null}

          {mayReview ? (
            <button
              type="button"
              onClick={() =>
                onReview(piece.id)
              }
              className={`mt-4 w-full rounded-xl border px-4 py-3 font-black transition ${
                piece.status === "failed"
                  ? "border-red-400/40 bg-red-950/20 text-red-300 hover:bg-red-950/40"
                  : "border-cyan-400/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40"
              }`}
            >
              {reviewOpen
                ? "Close Review Details"
                : piece.status === "failed"
                  ? "Review Failure Details"
                  : "Review Details"}
            </button>
          ) : null}

          {mayReview ? (
            <button
              type="button"
              onClick={() =>
                onInspect(
                  piece.id,
                  piece.projectPatternId
                )
              }
              className="mt-3 w-full rounded-xl border border-violet-400/40 bg-violet-950/20 px-4 py-3 font-black text-violet-300 transition hover:bg-violet-950/40"
            >
              Inspect Pattern
            </button>
          ) : null}

          {reviewOpen ? (
            <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-slate-950/60 p-5">
              <h4 className="text-lg font-black text-cyan-300">
                Engineering Review
              </h4>

              <p className="mt-2 text-sm text-slate-300">
                {piece.status === "failed"
                  ? "Review the failure, production risks and required engineering action."
                  : "Review the detected geometry before approving this pattern."}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <ReviewValue
                  label="Confidence"
                  value={
                    typeof piece.confidence ===
                    "number"
                      ? `${piece.confidence.toFixed(
                          1
                        )}%`
                      : "—"
                  }
                />

                <ReviewValue
                  label="Vertices"
                  value={
                    vertexCount !== null
                      ? String(vertexCount)
                      : "—"
                  }
                />

                <ReviewValue
                  label="Engineering Score"
                  value={
                    piece.geometryResult
                      ? `${piece.geometryResult.engineeringScore}%`
                      : "—"
                  }
                />

                <ReviewValue
                  label="Width"
                  value={
                    typeof piece.geometryResult
                      ?.dimensions.widthCm ===
                    "number"
                      ? `${piece.geometryResult.dimensions.widthCm.toFixed(
                          2
                        )} cm`
                      : "—"
                  }
                />

                <ReviewValue
                  label="Height"
                  value={
                    typeof piece.geometryResult
                      ?.dimensions.heightCm ===
                    "number"
                      ? `${piece.geometryResult.dimensions.heightCm.toFixed(
                          2
                        )} cm`
                      : "—"
                  }
                />

                <ReviewValue
                  label="Area"
                  value={
                    typeof piece.geometryResult
                      ?.polygon.area
                      .squareCm === "number"
                      ? `${piece.geometryResult.polygon.area.squareCm.toFixed(
                          2
                        )} cm²`
                      : "—"
                  }
                />

                <ReviewValue
                  label="Project Match"
                  value={
                    piece.projectPatternId ??
                    "Not matched"
                  }
                />

                <ReviewValue
                  label="Status"
                  value={piece.status}
                />
              </div>

              {piece.warning ? (
                <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
                  <p className="font-bold text-amber-300">
                    Exception Reason
                  </p>

                  <p className="mt-2 text-sm leading-6 text-amber-200">
                    {piece.warning}
                  </p>
                </div>
              ) : null}

              {piece.error ? (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/20 p-3">
                  <p className="font-bold text-red-300">
                    Detection Failure
                  </p>

                  <p className="mt-2 text-sm leading-6 text-red-200">
                    {piece.error}
                  </p>
                </div>
              ) : null}

              <div className="mt-4 rounded-2xl border border-violet-500/30 bg-violet-950/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                  AI Engineering Risk
                  Assessment
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <RiskMiniValue
                    label="Engineering Grade"
                    value={
                      riskAssessment.engineeringGrade
                    }
                  />

                  <RiskMiniValue
                    label="Engineering Risk"
                    value={formatRiskLevel(
                      riskAssessment.engineeringRisk
                    )}
                  />

                  <RiskMiniValue
                    label="Business Risk"
                    value={formatRiskLevel(
                      riskAssessment.businessRisk
                    )}
                  />

                  <RiskMiniValue
                    label="Estimated Review Time"
                    value={
                      riskAssessment.estimatedReviewTime
                    }
                  />
                </div>

                <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Recommended Action
                  </p>

                  <p className="mt-2 text-sm font-bold leading-6 text-white">
                    {
                      riskAssessment.recommendation
                    }
                  </p>
                </div>

                {riskAssessment
                  .potentialRisks.length >
                0 ? (
                  <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                      Potential Risks
                    </p>

                    <div className="mt-3 space-y-2">
                      {riskAssessment.potentialRisks.map(
                        (risk) => (
                          <p
                            key={risk}
                            className="text-sm font-semibold leading-6 text-amber-100"
                          >
                            ⚠ {risk}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                    <p className="text-sm font-bold leading-6 text-emerald-200">
                      ✓ No significant
                      engineering risks
                      detected.
                    </p>
                  </div>
                )}

                {riskAssessment
                  .consequencesWithoutCorrection
                  .length > 0 ? (
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">
                      If Used Without
                      Correction
                    </p>

                    <div className="mt-3 space-y-2">
                      {riskAssessment.consequencesWithoutCorrection.map(
                        (consequence) => (
                          <p
                            key={consequence}
                            className="text-sm font-semibold leading-6 text-red-100"
                          >
                            • {consequence}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  Engineering Decision
                </p>
<div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4">
  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
    Engineering Financial Exposure
  </p>

  {fabricCost ? (
    <>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <RiskMiniValue
          label="Fabric Cost"
          value={`${fabricCost.currency} ${fabricCost.costPerMetre.toFixed(
            4
          )} per metre`}
        />

        <RiskMiniValue
          label="Exposure Level"
          value={
            riskAssessment.businessRisk === "high"
              ? "High"
              : riskAssessment.businessRisk === "medium"
                ? "Medium"
                : riskAssessment.businessRisk === "low"
                  ? "Low"
                  : "Very Low"
          }
        />
      </div>

      <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          Exact Financial Value
        </p>

        <p className="mt-2 text-sm font-bold leading-6 text-white">
          Pending Marker Layout and Order Quantity
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/10 p-3">
        <p className="text-xs font-black uppercase tracking-wide text-amber-300">
          Why It Is Pending
        </p>

        <p className="mt-2 text-sm font-semibold leading-6 text-amber-100">
          The exact additional cost can only be calculated after Module 04
          determines the real marker consumption and the production order
          quantity is available.
        </p>
      </div>
    </>
  ) : (
    <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
      <p className="text-sm font-bold leading-6 text-slate-300">
        Fabric cost has not been saved for this project.
      </p>
    </div>
  )}
</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <RiskMiniValue
                    label="Decision"
                    value={
                      decisionSummary.decision
                    }
                  />

                  <RiskMiniValue
                    label="Recommended Reviewer"
                    value={
                      decisionSummary.reviewer
                    }
                  />

                  <RiskMiniValue
                    label="Estimated Time"
                    value={
                      riskAssessment.estimatedReviewTime
                    }
                  />

                  <RiskMiniValue
                    label="Engineering Grade"
                    value={
                      riskAssessment.engineeringGrade
                    }
                  />
                </div>

                <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Expected Impact
                  </p>

                  <p className="mt-2 text-sm font-bold leading-6 text-white">
                    {decisionSummary.impact}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {piece.status === "review" &&
                piece.geometryReady &&
                piece.geometryResult ? (
                  <button
                    type="button"
                    onClick={() => {
                      onApprove(piece.id);
                      onReview(piece.id);
                    }}
                    disabled={disabled}
                    className="rounded-xl bg-emerald-500 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-40"
                  >
                    ✓ Approve Geometry
                  </button>
                ) : null}

                {piece.status === "failed" ? (
                  <button
                    type="button"
                    onClick={() =>
                      onInspect(
                        piece.id,
                        piece.projectPatternId
                      )
                    }
                    className="rounded-xl bg-violet-500 px-5 py-3 font-black text-white transition hover:bg-violet-400"
                  >
                    Inspect and Retrace
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() =>
                    onReview(piece.id)
                  }
                  className="rounded-xl border border-slate-600 px-5 py-3 font-black text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}

          {piece.geometryResult &&
          !reviewOpen ? (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <GeometryMiniValue
                label="Width"
                value={
                  typeof piece.geometryResult
                    .dimensions.widthCm ===
                  "number"
                    ? `${piece.geometryResult.dimensions.widthCm.toFixed(
                        2
                      )} cm`
                    : "—"
                }
              />

              <GeometryMiniValue
                label="Height"
                value={
                  typeof piece.geometryResult
                    .dimensions.heightCm ===
                  "number"
                    ? `${piece.geometryResult.dimensions.heightCm.toFixed(
                        2
                      )} cm`
                    : "—"
                }
              />

              <GeometryMiniValue
                label="Area"
                value={
                  typeof piece.geometryResult
                    .polygon.area.squareCm ===
                  "number"
                    ? `${piece.geometryResult.polygon.area.squareCm.toFixed(
                        2
                      )} cm²`
                    : "—"
                }
              />

              <GeometryMiniValue
                label="Score"
                value={`${piece.geometryResult.engineeringScore}%`}
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
});

  function ReviewValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words font-black capitalize text-white">
        {value}
      </p>
    </div>
  );
}

function formatRiskLevel(
  level:
    | EngineeringRiskAssessment["engineeringRisk"]
    | EngineeringRiskAssessment["businessRisk"]
): string {
  const labels: Record<
    | EngineeringRiskAssessment["engineeringRisk"]
    | EngineeringRiskAssessment["businessRisk"],
    string
  > = {
    "very-low": "Very Low",
    low: "Low",
    medium: "Medium",
    high: "High",
    "very-high": "Very High",
  };

  return labels[level];
}

function RiskMiniValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words font-black text-white">
        {value}
      </p>
    </div>
  );
}

function GeometryMiniValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2">
      <p className="font-black uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 font-black text-slate-300">
        {value}
      </p>
    </div>
  );
}

const STATUS_LABELS: Record<
  BatchPieceStatus,
  string
> = {
  uploaded: "Uploaded",
  boundary: "Boundary",
  scale: "Scale",
  geometry: "Geometry",
  ready: "Ready",
  review: "Review",
  failed: "Failed",
  saved: "Saved",
};

function StatusBadge({
  status,
}: {
  status: BatchPieceStatus;
}) {
  const classes =
    status === "ready"
      ? "bg-emerald-500/15 text-emerald-300"
      : status === "saved"
        ? "bg-emerald-400/20 text-emerald-200"
        : status === "review"
          ? "bg-amber-500/15 text-amber-300"
          : status === "failed"
            ? "bg-red-500/15 text-red-300"
            : status === "uploaded"
              ? "bg-slate-700/50 text-slate-300"
              : "bg-cyan-500/15 text-cyan-300";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${classes}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}