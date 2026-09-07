"use client";

import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  analysePatternImageBoundary,
} from "@/lib/optifabric/aiBoundaryImageAdapter";

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

import {
  updateProjectRegistryEntry,
} from "@/lib/optifabric/projectRegistry";

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

  pendingPatterns:
    PendingGeometryPattern[];
}

interface BatchEngineeringProject {
  id: string;

  projectName?: string;
  name?: string;

  patterns: ProjectPatternStatus[];

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

  projectPatternId:
    | string
    | null;

  recognition:
    | RecognitionPattern
    | null;

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

  geometryResult:
    | PatternGeometryResult
    | null;

  engineerApproved: boolean;
}

interface ActivityEntry {
  id: string;

  time: string;

  message: string;

  type:
    | "info"
    | "success"
    | "warning";
}

const acceptedImageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "webp",
];

const processingSteps = [
  "Files received",
  "Boundary detection",
  "Project-scale application",
  "Geometry calculation",
  "Engineering validation",
  "Marker preparation",
];

function createId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function cleanPatternName(
  fileName: string
): string {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function normaliseText(
  value: string
): string {
  return value
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(
      /\b(cut|piece|pattern|image|photo|png|jpg|jpeg|webp)\b/g,
      " "
    )
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractPatternNumber(
  value: string
): number | null {
  const match =
    value.match(
      /(?:pattern\s*)?0*(\d{1,3})\b/i
    );

  if (!match) {
    return null;
  }

  const parsed =
    Number(match[1]);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function createSearchTokens(
  value: string
): string[] {
  return normaliseText(value)
    .split(" ")
    .filter(
      (token) =>
        token.length >= 2
    );
}

function calculateTextMatchScore(
  fileName: string,
  pattern: ProjectPatternStatus,
  recognition?:
    RecognitionPattern
): number {
  const source =
    normaliseText(fileName);

  const candidates = [
    pattern.name,
    pattern.fileName ?? "",
    recognition?.recognisedName ?? "",
    recognition?.originalName ?? "",
  ]
    .filter(Boolean)
    .map(normaliseText);

  let score = 0;

  const sourceNumber =
    extractPatternNumber(
      fileName
    );

  const candidateNumbers =
    [
      pattern.name,
      pattern.fileName ?? "",
      recognition?.recognisedName ??
        "",
      recognition?.originalName ?? "",
    ]
      .map(extractPatternNumber)
      .filter(
        (
          value
        ): value is number =>
          value !== null
      );

  if (
    sourceNumber !== null &&
    candidateNumbers.includes(
      sourceNumber
    )
  ) {
    score += 120;
  }

  for (
    const candidate
    of candidates
  ) {
    if (!candidate) {
      continue;
    }

    if (
      source === candidate
    ) {
      score += 150;

      continue;
    }

    if (
      source.includes(candidate) ||
      candidate.includes(source)
    ) {
      score += 70;
    }

    const sourceTokens =
      createSearchTokens(source);

    const candidateTokens =
      createSearchTokens(
        candidate
      );

    const overlap =
      sourceTokens.filter(
        (token) =>
          candidateTokens.includes(
            token
          )
      ).length;

    score += overlap * 15;
  }

  return score;
}

function isAcceptedImage(
  file: File
): boolean {
  if (
    file.type.startsWith(
      "image/"
    )
  ) {
    return true;
  }

  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ?? "";

  return acceptedImageExtensions.includes(
    extension
  );
}

function getTimeLabel(): string {
  return new Date().toLocaleTimeString(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }
  );
}

function roundValue(
  value: number,
  decimals = 2
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const multiplier =
    10 ** decimals;

  return (
    Math.round(
      value * multiplier
    ) / multiplier
  );
}

function getRecognitionForPattern(
  project:
    BatchEngineeringProject,
  patternId: string
):
  | RecognitionPattern
  | undefined {
  return project.aiRecognition
    ?.patterns.find(
      (item) =>
        item.patternId ===
        patternId
    );
}

function findBestProjectPattern({
  fileName,
  project,
  unavailablePatternIds,
}: {
  fileName: string;

  project:
    BatchEngineeringProject;

  unavailablePatternIds:
    Set<string>;
}): {
  pattern:
    ProjectPatternStatus | null;

  recognition:
    RecognitionPattern | null;
} {
  let bestPattern:
    ProjectPatternStatus | null =
    null;

  let bestRecognition:
    RecognitionPattern | null =
    null;

  let bestScore = 0;

  for (
    const pattern
    of project.patterns
  ) {
    if (
      unavailablePatternIds.has(
        pattern.id
      )
    ) {
      continue;
    }

    const recognition =
      getRecognitionForPattern(
        project,
        pattern.id
      );

    const score =
      calculateTextMatchScore(
        fileName,
        pattern,
        recognition
      );

    if (score > bestScore) {
      bestScore = score;

      bestPattern = pattern;

      bestRecognition =
        recognition ?? null;
    }
  }

  if (
    bestPattern &&
    bestScore >= 30
  ) {
    return {
      pattern: bestPattern,
      recognition:
        bestRecognition,
    };
  }

  return {
    pattern: null,
    recognition: null,
  };
}

function normaliseRotation(
  value: unknown
): GeometryRotation {
  if (
    value === "rotate-180" ||
    value === "180-only"
  ) {
    return "rotate-180";
  }

  if (
    value === "rotate-90" ||
    value === "90-allowed"
  ) {
    return "rotate-90";
  }

  if (
    value === "free-rotation" ||
    value === "free"
  ) {
    return "free";
  }

  return "fixed";
}

function calculateGeometrySummary(
  projectId: string,
  patterns:
    PatternGeometryResult[]
): GeometryProjectSummary {
  const totalAreaCm2 =
    patterns.reduce(
      (total, pattern) =>
        total +
        (pattern.polygon.area
          .squareCm ?? 0),
      0
    );

  const totalPerimeterCm =
    patterns.reduce(
      (total, pattern) =>
        total +
        (pattern.polygon
          .perimeter.cm ?? 0),
      0
    );

  const averageCompactness =
    patterns.length > 0
      ? patterns.reduce(
          (total, pattern) =>
            total +
            pattern.compactness,
          0
        ) / patterns.length
      : 0;

  const averageEngineeringScore =
    patterns.length > 0
      ? patterns.reduce(
          (total, pattern) =>
            total +
            pattern.engineeringScore,
          0
        ) / patterns.length
      : 0;

  return {
    projectId,

    totalPatterns:
      patterns.length,

    totalAreaCm2:
      roundValue(
        totalAreaCm2,
        2
      ),

    totalPerimeterCm:
      roundValue(
        totalPerimeterCm,
        2
      ),

    averageCompactness:
      roundValue(
        averageCompactness,
        4
      ),

    averageEngineeringScore:
      roundValue(
        averageEngineeringScore,
        1
      ),

    generatedAt:
      new Date().toISOString(),
  };
}

function mergeGeometryPatterns(
  existing:
    PatternGeometryResult[],
  incoming:
    PatternGeometryResult[]
): PatternGeometryResult[] {
  const resultMap =
    new Map<
      string,
      PatternGeometryResult
    >();

  for (
    const pattern
    of existing
  ) {
    resultMap.set(
      pattern.patternId,
      pattern
    );
  }

  for (
    const pattern
    of incoming
  ) {
    resultMap.set(
      pattern.patternId,
      pattern
    );
  }

  return Array.from(
    resultMap.values()
  );
}

function createPendingPatterns({
  project,
  savedPatterns,
}: {
  project:
    BatchEngineeringProject;

  savedPatterns:
    PatternGeometryResult[];
}): PendingGeometryPattern[] {
  const savedIds =
    new Set(
      savedPatterns.map(
        (pattern) =>
          pattern.patternId
      )
    );

  const recognitionPatterns =
    project.aiRecognition
      ?.patterns ?? [];

  return recognitionPatterns
    .filter(
      (recognition) =>
        !savedIds.has(
          recognition.patternId
        )
    )
    .map((recognition) => {
      const projectPattern =
        project.patterns.find(
          (pattern) =>
            pattern.id ===
            recognition.patternId
        );

      const vertices =
        projectPattern
          ?.geometryVertices ??
        projectPattern
          ?.polygonVertices ??
        projectPattern
          ?.tracedVertices ??
        [];

      const hasBoundary =
        Array.isArray(vertices) &&
        vertices.length >= 3;

      const hasCalibration =
        typeof projectPattern
          ?.pixelsPerCm ===
          "number" &&
        projectPattern.pixelsPerCm >
          0;

      return {
        patternId:
          recognition.patternId,

        recognisedName:
          recognition
            .recognisedName,

        originalName:
          recognition.originalName,

        markerEligible:
          recognition
            .markerEligible,

        reason:
          !hasBoundary &&
          !hasCalibration
            ? "Boundary and scale calibration are required."
            : !hasBoundary
              ? "A valid pattern boundary is required."
              : "Scale calibration is required.",

        uploaded:
          Boolean(
            projectPattern
              ?.fileName ||
              projectPattern
                ?.imageUrl
          ),

        validationPassed:
          projectPattern
            ?.validationPassed ??
          false,

        hasCalibration,

        hasBoundary,

        cutQuantity:
          recognition
            .cutQuantity ??
          projectPattern
            ?.styleCutQuantity ??
          1,

        cutOnFold:
          recognition
            .cutOnFold ??
          projectPattern
            ?.styleCutOnFold ??
          false,

        materialCategory:
          recognition
            .materialCategory ??
          projectPattern
            ?.styleMaterialCategory ??
          projectPattern
            ?.materialCategory ??
          "self",
      };
    });
}

function calculateConfidencePercent(
  value: number
): number {
  const normalised =
    value <= 1
      ? value * 100
      : value;

  return roundValue(
    Math.min(
      100,
      Math.max(
        0,
        normalised
      )
    ),
    1
  );
}

export default function BatchEngineeringPage() {
  const params = useParams<{
    projectId: string;
  }>();
const [
  reviewingPieceId,
  setReviewingPieceId,
] = useState<string | null>(null);
  const router = useRouter();

  const projectId =
    params.projectId;

  const projectStorageKey =
    `optifabric-project-${projectId}`;

  const folderInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const imageInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const previewUrlsRef =
    useRef<Set<string>>(
      new Set()
    );

  const [
    project,
    setProject,
  ] =
    useState<BatchEngineeringProject | null>(
      null
    );

  const [
    projectLoading,
    setProjectLoading,
  ] = useState(true);

  const [
    projectError,
    setProjectError,
  ] = useState("");

  const [
    patternPieces,
    setPatternPieces,
  ] = useState<
    BatchPatternPiece[]
  >([]);

  const [
    projectPixelsPerCm,
    setProjectPixelsPerCm,
  ] = useState<number | null>(
    null
  );

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    activeStep,
    setActiveStep,
  ] = useState(0);

  const [
    progressPercent,
    setProgressPercent,
  ] = useState(0);

  const [
    dragActive,
    setDragActive,
  ] = useState(false);

  const [
    activities,
    setActivities,
  ] = useState<ActivityEntry[]>(
    []
  );

  const [
    message,
    setMessage,
  ] = useState(
    "Upload a folder or select multiple pattern images to begin."
  );

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
        setProjectError(
          "The engineering project could not be found in this browser."
        );

        return;
      }

      const parsedProject =
        JSON.parse(
          storedProject
        ) as BatchEngineeringProject;

      setProject(
        parsedProject
      );

      const savedPixelsPerCm =
        parsedProject.patterns.find(
          (pattern) =>
            typeof pattern
              .pixelsPerCm ===
              "number" &&
            pattern.pixelsPerCm > 0
        )?.pixelsPerCm;

      if (
        typeof savedPixelsPerCm ===
          "number" &&
        savedPixelsPerCm > 0
      ) {
        setProjectPixelsPerCm(
          savedPixelsPerCm
        );

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

      setProjectError(
        "The stored project data could not be read."
      );
    } finally {
      setProjectLoading(
        false
      );
    }
  }, [
    projectId,
    projectStorageKey,
  ]);

  
  useEffect(() => {
    const urls =
      previewUrlsRef.current;

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(
          url
        );
      });

      urls.clear();
    };
  }, []);

  const counts = useMemo(() => {
    const images =
      patternPieces.length;

    const boundaries =
      patternPieces.filter(
        (piece) =>
          piece.boundaryReady
      ).length;

    const scale =
      patternPieces.filter(
        (piece) =>
          piece.scaleReady
      ).length;

    const geometry =
      patternPieces.filter(
        (piece) =>
          piece.geometryReady
      ).length;

    const ready =
      patternPieces.filter(
        (piece) =>
          piece.status ===
            "ready" ||
          piece.status ===
            "saved"
      ).length;

    const review =
      patternPieces.filter(
        (piece) =>
          piece.status ===
          "review"
      ).length;

    const failed =
      patternPieces.filter(
        (piece) =>
          piece.status ===
          "failed"
      ).length;

    const selected =
      patternPieces.filter(
        (piece) =>
          piece.selected
      ).length;

    const saved =
      patternPieces.filter(
        (piece) =>
          piece.status ===
          "saved"
      ).length;

    return {
      images,
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

  const overallReady =
    counts.images > 0 &&
    counts.ready ===
      counts.images &&
    counts.failed === 0;

  function addActivity(
    messageText: string,
    type:
      | "info"
      | "success"
      | "warning" = "info"
  ) {
    setActivities(
      (current) => [
        {
          id: createId(),

          time:
            getTimeLabel(),

          message:
            messageText,

          type,
        },

        ...current,
      ]
    );
  }

  function updatePiece(
    pieceId: string,
    update:
      Partial<BatchPatternPiece>
  ) {
    setPatternPieces(
      (current) =>
        current.map((piece) =>
          piece.id === pieceId
            ? {
                ...piece,
                ...update,
              }
            : piece
        )
    );
  }

  function importFiles(
    incomingFiles:
      | File[]
      | FileList
  ) {
    if (!project) {
      setMessage(
        "Wait for the engineering project to load before uploading images."
      );

      return;
    }

    const files =
      Array.from(
        incomingFiles
      ).filter(
        isAcceptedImage
      );

    if (
      files.length === 0
    ) {
      setMessage(
        "No supported pattern images were found. Use JPG, JPEG, PNG or WEBP files."
      );

      addActivity(
        "Upload rejected because no supported image files were found.",
        "warning"
      );

      return;
    }

    setPatternPieces(
      (currentPieces) => {
        const existingFileKeys =
          new Set(
            currentPieces.map(
              (piece) =>
                `${piece.file.name}-${piece.file.size}-${piece.file.lastModified}`
            )
          );

        const unavailablePatternIds =
          new Set(
            currentPieces
              .map(
                (piece) =>
                  piece
                    .projectPatternId
              )
              .filter(
                (
                  value
                ): value is string =>
                  Boolean(value)
              )
          );

        const newPieces:
          BatchPatternPiece[] =
          [];

        for (
          const file
          of files
        ) {
          const fileKey =
            `${file.name}-${file.size}-${file.lastModified}`;

          if (
            existingFileKeys.has(
              fileKey
            )
          ) {
            continue;
          }

          const matched =
            findBestProjectPattern({
              fileName:
                file.name,

              project,

              unavailablePatternIds,
            });

          if (
            matched.pattern
          ) {
            unavailablePatternIds.add(
              matched.pattern.id
            );
          }

          const previewUrl =
            URL.createObjectURL(
              file
            );

          previewUrlsRef.current.add(
            previewUrl
          );

          newPieces.push({
            id: createId(),

            file,

            name:
              matched.recognition
                ?.recognisedName ??
              matched.pattern
                ?.name ??
              cleanPatternName(
                file.name
              ),

            previewUrl,

            projectPatternId:
              matched.pattern
                ?.id ?? null,

            recognition:
              matched.recognition,

            status:
              "uploaded",

            selected: false,

            boundaryReady:
              false,

            scaleReady:
              false,

            geometryReady:
              false,

            confidence: null,

            warning:
              matched.pattern
                ? undefined
                : "No existing project pattern was confidently matched to this file.",

            vertices: [],

            originalImageWidth:
              0,

            originalImageHeight:
              0,

            geometryResult:
              null,

            engineerApproved:
              false,
          });
        }

        return [
          ...currentPieces,
          ...newPieces,
        ];
      }
    );

    setMessage(
      `${files.length} pattern image(s) received. Confirm the project calibration and start real AI processing.`
    );

    addActivity(
      `${files.length} pattern image(s) added to the batch queue.`,
      "success"
    );
  }

  function handleImageInput(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    if (
      event.target.files
    ) {
      importFiles(
        event.target.files
      );
    }

    event.target.value =
      "";
  }

  function handleDrop(
    event:
      DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragActive(false);

    if (
      event.dataTransfer.files
        .length > 0
    ) {
      importFiles(
        event.dataTransfer.files
      );
    }
  }

  async function startProcessing() {
    if (
      patternPieces.length === 0
    ) {
      setMessage(
        "Upload pattern images before starting AI processing."
      );

      return;
    }

    if (
      !projectPixelsPerCm ||
      projectPixelsPerCm <= 0
    ) {
      setMessage(
        "Enter or reuse one valid project calibration before batch geometry processing."
      );

      addActivity(
        "Batch processing paused because project calibration is missing.",
        "warning"
      );

      return;
    }

    setProcessing(true);

    setProgressPercent(0);
    setActiveStep(0);

    setPatternPieces(
      (current) =>
        current.map(
          (piece) => ({
            ...piece,

            status:
              "uploaded",

            selected:
              false,

            boundaryReady:
              false,

            scaleReady:
              false,

            geometryReady:
              false,

            confidence:
              null,

            warning:
              piece
                .projectPatternId
                ? undefined
                : "No existing project pattern was confidently matched to this file.",

            error:
              undefined,

            vertices: [],

            originalImageWidth:
              0,

            originalImageHeight:
              0,

            geometryResult:
              null,

            engineerApproved:
              false,
          })
        )
    );

    addActivity(
      "Real AI batch processing started.",
      "info"
    );

    setMessage(
      "OptiFabric AI is detecting real pattern boundaries and calculating real geometry."
    );

    const processedResults =
      new Map<
        string,
        Partial<BatchPatternPiece>
      >();

    try {
      setActiveStep(1);

      for (
        let index = 0;
        index <
        patternPieces.length;
        index += 1
      ) {
        const piece =
          patternPieces[index];

        updatePiece(
          piece.id,
          {
            status:
              "boundary",
          }
        );

        try {
          const analysis =
            await analysePatternImageBoundary({
              sourceUrl:
                piece.previewUrl,

              fileName:
                piece.file.name,

              backgroundExpected:
                "light",

              maximumAnalysisDimension:
                1600,
            });

          const confidence =
            calculateConfidencePercent(
              analysis.detection
                .quality
                .confidence
            );

          const vertices =
            analysis.detection
              .vertices;

          const boundaryUsable =
            analysis.detection
              .closed &&
            vertices.length >= 3 &&
            analysis.detection
              .status !== "failed";

          if (!boundaryUsable) {
            throw new Error(
              analysis.detection
                .explanation ||
                "AI could not produce a valid closed pattern boundary."
            );
          }

          processedResults.set(
            piece.id,
            {
              boundaryReady:
                true,

              confidence,

              vertices,

              originalImageWidth:
                analysis
                  .originalImageWidth,

              originalImageHeight:
                analysis
                  .originalImageHeight,

              warning:
  analysis.detection
    .warnings?.[0]
    ?.message,
            }
          );

          updatePiece(
            piece.id,
            {
              boundaryReady:
                true,

              confidence,

              vertices,

              originalImageWidth:
                analysis
                  .originalImageWidth,

              originalImageHeight:
                analysis
                  .originalImageHeight,

              warning:
  analysis.detection
    .warnings?.[0]
    ?.message,
            }
          );

          addActivity(
            `${piece.name}: real boundary detected with ${vertices.length} vertices at ${confidence}% confidence.`,
            "success"
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Unknown boundary-analysis error.";

          processedResults.set(
            piece.id,
            {
              status:
                "failed",

              boundaryReady:
                false,

              geometryReady:
                false,

              error:
                errorMessage,

              warning:
                "Manual tracing is required.",
            }
          );

          updatePiece(
            piece.id,
            {
              status:
                "failed",

              boundaryReady:
                false,

              geometryReady:
                false,

              error:
                errorMessage,

              warning:
                "Manual tracing is required.",
            }
          );

          addActivity(
            `${piece.name}: boundary detection failed — ${errorMessage}`,
            "warning"
          );
        }

        setProgressPercent(
          Math.round(
            ((index + 1) /
              patternPieces.length) *
              35
          )
        );
      }

      setActiveStep(2);

      for (
        const piece
        of patternPieces
      ) {
        const processed =
          processedResults.get(
            piece.id
          );

        if (
          processed?.status ===
          "failed"
        ) {
          continue;
        }

        processedResults.set(
          piece.id,
          {
            ...processed,

            status:
              "scale",

            scaleReady:
              true,
          }
        );

        updatePiece(
          piece.id,
          {
            status:
              "scale",

            scaleReady:
              true,
          }
        );
      }

      setProgressPercent(50);

      addActivity(
        `Project calibration of ${projectPixelsPerCm.toFixed(
          4
        )} pixels/cm applied to every successfully detected pattern.`,
        "success"
      );

      setActiveStep(3);

      for (
        let index = 0;
        index <
        patternPieces.length;
        index += 1
      ) {
        const piece =
          patternPieces[index];

        const processed =
          processedResults.get(
            piece.id
          );

        if (
          processed?.status ===
            "failed" ||
          !processed
            ?.boundaryReady ||
          !processed.vertices ||
          processed.vertices
            .length < 3
        ) {
          continue;
        }

        updatePiece(
          piece.id,
          {
            status:
              "geometry",
          }
        );

        const recognition =
          piece.recognition;

        const projectPattern =
          project?.patterns.find(
            (pattern) =>
              pattern.id ===
              piece.projectPatternId
          );

        const patternId =
          piece
            .projectPatternId ??
          piece.id;

        const geometryResult =
          generatePatternGeometry({
            patternId,

            recognisedName:
              recognition
                ?.recognisedName ??
              piece.name,

            vertices:
              processed.vertices,

            widthPixels:
              processed
                .originalImageWidth,

            heightPixels:
              processed
                .originalImageHeight,

            pixelsPerCm:
              projectPixelsPerCm,

            grainControlled:
              recognition
                ?.grainControlled ??
              projectPattern
                ?.grainLineVisible ??
              false,

            cutOnFold:
              recognition
                ?.cutOnFold ??
              projectPattern
                ?.styleCutOnFold ??
              false,

            mirroredPair:
              recognition
                ?.mirroredPair ??
              false,

            rotation:
              normaliseRotation(
                recognition
                  ?.rotationRule
              ),

            directionalFabric:
              recognition
                ?.directionalFabric ??
              false,

            stripeMatch:
              recognition
                ?.stripeMatch ??
              false,

            checkMatch:
              recognition
                ?.checkMatch ??
              false,

            napDirection:
              recognition
                ?.napDirection ??
              false,

            cutQuantity:
              recognition
                ?.cutQuantity ??
              projectPattern
                ?.styleCutQuantity ??
              1,

            markerEligible:
              recognition
                ?.markerEligible ??
              projectPattern
                ?.includeInMarker ??
              true,
          });

        const geometryValid =
          geometryResult
            .polygon.closed &&
          geometryResult
            .polygon.vertexCount >=
            3 &&
          geometryResult
            .polygon.area
            .squarePixels > 0 &&
          geometryResult
            .polygon.perimeter
            .pixels > 0;

        if (!geometryValid) {
          processedResults.set(
            piece.id,
            {
              ...processed,

              status:
                "failed",

              geometryReady:
                false,

              geometryResult,

              error:
                "The detected boundary did not produce valid measurable geometry.",
            }
          );

          updatePiece(
            piece.id,
            {
              status:
                "failed",

              geometryReady:
                false,

              geometryResult,

              error:
                "The detected boundary did not produce valid measurable geometry.",
            }
          );

          continue;
        }

        processedResults.set(
          piece.id,
          {
            ...processed,

            status:
              "geometry",

            scaleReady:
              true,

            geometryReady:
              true,

            geometryResult,
          }
        );

        updatePiece(
          piece.id,
          {
            status:
              "geometry",

            scaleReady:
              true,

            geometryReady:
              true,

            geometryResult,
          }
        );

        setProgressPercent(
          50 +
            Math.round(
              ((index + 1) /
                patternPieces.length) *
                30
            )
        );
      }

      addActivity(
        "Real automatic geometry calculation completed.",
        "success"
      );

      setActiveStep(4);

      for (
        let index = 0;
        index <
        patternPieces.length;
        index += 1
      ) {
        const piece =
          patternPieces[index];

        const processed =
          processedResults.get(
            piece.id
          );

        if (
          processed?.status ===
            "failed" ||
          !processed
            ?.geometryReady ||
          !processed.geometryResult
        ) {
          continue;
        }

        const confidence =
          processed.confidence ??
          0;

        const requiresReview =
  confidence < 82 ||
  !piece.projectPatternId ||
  processed.geometryResult.engineeringScore < 80;
        const status:
          BatchPieceStatus =
          requiresReview
            ? "review"
            : "ready";

        processedResults.set(
          piece.id,
          {
            ...processed,

            status,

            selected:
              !requiresReview,

            engineerApproved:
              false,

            warning:
              requiresReview
                ? !piece
                    .projectPatternId
                  ? "Project-pattern matching requires engineer confirmation."
                  : confidence <
                      95
                    ? `Boundary confidence ${confidence}% is below the 95% auto-approval threshold.`
                    : "Geometry engineering score requires review."
                : undefined,
          }
        );

        updatePiece(
          piece.id,
          {
            status,

            selected:
              !requiresReview,

            engineerApproved:
              false,

            warning:
              requiresReview
                ? !piece
                    .projectPatternId
                  ? "Project-pattern matching requires engineer confirmation."
                  : confidence <
                      95
                    ? `Boundary confidence ${confidence}% is below the 95% auto-approval threshold.`
                    : "Geometry engineering score requires review."
                : undefined,
          }
        );

        setProgressPercent(
          80 +
            Math.round(
              ((index + 1) /
                patternPieces.length) *
                15
            )
        );
      }

      setActiveStep(5);
      setProgressPercent(100);

      addActivity(
        "Real batch engineering validation completed.",
        "success"
      );

      setMessage(
        "Real batch processing completed. Review flagged pieces, tick the acceptable pieces and save selected geometry."
      );
    } catch (error) {
      console.error(
        "Batch engineering processing failed:",
        error
      );

      setMessage(
        "Batch processing stopped because an unexpected engineering error occurred."
      );

      addActivity(
        "Batch processing stopped unexpectedly.",
        "warning"
      );
    } finally {
      setProcessing(false);
    }
  }

  function selectAllReady() {
    setPatternPieces(
      (current) =>
        current.map(
          (piece) => ({
            ...piece,

            selected:
              piece.status ===
                "ready" ||
              piece.status ===
                "saved",
          })
        )
    );

    addActivity(
      "All engineering-ready pieces selected.",
      "info"
    );
  }

  function selectReviewPieces() {
    setPatternPieces(
      (current) =>
        current.map(
          (piece) => ({
            ...piece,

            selected:
              piece.status ===
              "review",
          })
        )
    );

    addActivity(
      "Review-required pieces selected for engineer assessment.",
      "info"
    );
  }

  function togglePiece(
    pieceId: string
  ) {
    setPatternPieces(
      (current) =>
        current.map((piece) => {
          if (
            piece.id !==
            pieceId
          ) {
            return piece;
          }

          const maySelect =
            piece.status ===
              "ready" ||
            piece.status ===
              "review" ||
            piece.status ===
              "saved";

          if (!maySelect) {
            return piece;
          }

          const selected =
            !piece.selected;

          return {
            ...piece,

            selected,

            engineerApproved:
              piece.status ===
                "review" &&
              selected
                ? true
                : piece
                    .engineerApproved,

            warning:
              piece.status ===
                "review" &&
              selected
                ? "Engineer approved this review item for project saving."
                : piece.warning,
          };
        })
    );
  }
function startReview(pieceId: string) {
  setReviewingPieceId(
    (currentPieceId) =>
      currentPieceId === pieceId
        ? null
        : pieceId
  );
}
  function clearBatch() {
    previewUrlsRef.current.forEach(
      (url) => {
        URL.revokeObjectURL(
          url
        );
      }
    );

    previewUrlsRef.current.clear();

    setPatternPieces([]);
    setActivities([]);

    setProgressPercent(0);
    setActiveStep(0);

    setMessage(
      "Batch cleared. Upload a new garment-style folder to continue."
    );
  }

  function saveSelectedGeometry() {
    if (!project) {
      setMessage(
        "The engineering project is not available for saving."
      );

      return;
    }

    const selectedPieces =
      patternPieces.filter(
        (piece) =>
          piece.selected &&
          piece.geometryReady &&
          piece.geometryResult
      );

    if (
      selectedPieces.length ===
      0
    ) {
      setMessage(
        "Select at least one valid engineering-ready piece before saving."
      );

      return;
    }

    const unresolvedReview =
      selectedPieces.filter(
        (piece) =>
          piece.status ===
            "review" &&
          !piece.engineerApproved
      );

    if (
      unresolvedReview.length >
      0
    ) {
      setMessage(
        "Tick each acceptable review item to record engineer approval before saving."
      );

      return;
    }

    const unmatchedPieces =
      selectedPieces.filter(
        (piece) =>
          !piece
            .projectPatternId
      );

    if (
      unmatchedPieces.length >
      0
    ) {
      setMessage(
        `${unmatchedPieces.length} selected file(s) could not be matched to existing project pattern IDs. Leave them unselected or correct their file names before saving.`
      );

      return;
    }

    setSaving(true);

    try {
      const savedAt =
        new Date().toISOString();

      const selectedResults =
        selectedPieces
          .map(
            (piece) =>
              piece.geometryResult
          )
          .filter(
            (
              result
            ): result is PatternGeometryResult =>
              result !== null
          );

      const existingResults =
        project.aiGeometry
          ?.patterns ?? [];

      const mergedResults =
        mergeGeometryPatterns(
          existingResults,
          selectedResults
        );

      const validResults =
        getValidGeometryPatterns(
          mergedResults
        );

      const selectedByPatternId =
        new Map(
          selectedPieces.map(
            (piece) => [
              piece
                .projectPatternId as string,
              piece,
            ]
          )
        );

      const updatedPatterns =
        project.patterns.map(
          (pattern) => {
            const batchPiece =
              selectedByPatternId.get(
                pattern.id
              );

            if (
              !batchPiece ||
              !batchPiece
                .geometryResult
            ) {
              return pattern;
            }

            const geometry =
              batchPiece
                .geometryResult;

            const vertices =
              geometry.polygon
                .vertices;

            const pixelsPerCm =
              projectPixelsPerCm as number;

            const boundarySavedAt =
              savedAt;

            return {
              ...pattern,

              fileName:
                batchPiece
                  .file.name,

              fileType:
                batchPiece
                  .file.type,

              fileSize:
                batchPiece
                  .file.size,

              uploadedAt:
                pattern.uploadedAt ??
                savedAt,

              validationPassed:
                true,

              scaleVisible:
                true,

              includedInStyle:
                true,

              includeInMarker:
                batchPiece
                  .recognition
                  ?.markerEligible ??
                pattern
                  .includeInMarker ??
                true,

              geometryVertices:
                vertices,

              polygonVertices:
                vertices,

              tracedVertices:
                vertices,

              tracedPoints:
                vertices,

              boundaryPoints:
                vertices,

              points:
                vertices,

              pixelsPerCm,

              pixelsPerInch:
                pixelsPerCm *
                2.54,

              detectedWidthPixels:
                geometry
                  .polygon
                  .boundingBox
                  .width,

              detectedHeightPixels:
                geometry
                  .polygon
                  .boundingBox
                  .height,

              calibratedWidthCm:
                geometry
                  .dimensions
                  .widthCm,

              calibratedHeightCm:
                geometry
                  .dimensions
                  .heightCm,

              calibratedAreaSqCm:
                geometry
                  .polygon.area
                  .squareCm,

              calibratedPerimeterCm:
                geometry
                  .polygon
                  .perimeter.cm,

              geometryTracingCompleted:
                true,

              geometryTracingCompletedAt:
                savedAt,

              patternTracing: {
                boundary: {
                  vertices,

                  closed:
                    true,

                  vertexCount:
                    vertices.length,

                  startedAt:
                    boundarySavedAt,

                  closedAt:
                    boundarySavedAt,
                },

                calibration: {
                  referenceLengthInches:
                    12,

                  referenceLengthCm:
                    30.48,

                  measuredPixels:
                    pixelsPerCm *
                    30.48,

                  pixelsPerCm,

                  pixelsPerInch:
                    pixelsPerCm *
                    2.54,

                  calibrated:
                    true,

                  calibratedAt:
                    savedAt,
                },

                savedAt,
              },
            };
          }
        );

      const projectWithPatterns:
        BatchEngineeringProject = {
        ...project,

        patterns:
          updatedPatterns,
      };

      const pendingPatterns =
        createPendingPatterns({
          project:
            projectWithPatterns,

          savedPatterns:
            validResults,
        });

      const summary =
        calculateGeometrySummary(
          projectId,
          validResults
        );

      const recognitionPatterns =
        project.aiRecognition
          ?.patterns ?? [];

      const markerReadyCount =
        validResults.filter(
          (geometry) => {
            const recognition =
              recognitionPatterns.find(
                (item) =>
                  item.patternId ===
                  geometry.patternId
              );

            return (
              recognition
                ?.markerEligible ??
              true
            );
          }
        ).length;

      const savedGeometry:
        SavedGeometryData = {
        completed:
          validResults.length >
          0,

        completedAt:
          savedAt,

        totalRecognitionPatterns:
          recognitionPatterns.length >
          0
            ? recognitionPatterns
                .length
            : updatedPatterns.length,

        geometryReadyPatterns:
          validResults.length,

        geometryPendingPatterns:
          pendingPatterns.length,

        validGeometryPatterns:
          validResults.length,

        markerReadyPatterns:
          markerReadyCount,

        summary,

        patterns:
          validResults,

        pendingPatterns,
      };

      const updatedRecognition =
        project.aiRecognition
          ? {
              ...project.aiRecognition,

              reviewRequired:
                patternPieces.filter(
                  (piece) =>
                    piece.status ===
                      "review" &&
                    !piece
                      .engineerApproved
                ).length,

              recognisedPatterns:
                Math.max(
                  project
                    .aiRecognition
                    .recognisedPatterns,
                  validResults.length
                ),

              completedAt:
                savedAt,
            }
          : undefined;

      const updatedProject:
        BatchEngineeringProject = {
        ...project,

        patterns:
          updatedPatterns,

        aiRecognition:
          updatedRecognition,

        aiGeometry:
          savedGeometry,

        updatedAt:
          savedAt,
      };

      localStorage.setItem(
        projectStorageKey,
        JSON.stringify(
          updatedProject
        )
      );

      try {
        updateProjectRegistryEntry(
          updatedProject as never
        );
      } catch (error) {
        console.error(
          "Unable to synchronise the batch geometry with the project registry:",
          error
        );
      }

      setProject(
        updatedProject
      );

      const savedIds =
        new Set(
          selectedPieces.map(
            (piece) =>
              piece.id
          )
        );

      setPatternPieces(
        (current) =>
          current.map(
            (piece) =>
              savedIds.has(
                piece.id
              )
                ? {
                    ...piece,

                    status:
                      "saved",

                    selected:
                      false,

                    engineerApproved:
                      true,

                    warning:
                      "Geometry saved to Module 04.",
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

      window.setTimeout(
        () => {
          router.push(
            `/optifabric/project/${projectId}/geometry`
          );
        },
        900
      );
    } catch (error) {
      console.error(
        "Batch geometry saving failed:",
        error
      );

      setMessage(
        "The real batch geometry could not be saved. Review the browser console for the exact engineering error."
      );

      addActivity(
        "Batch geometry saving failed.",
        "warning"
      );
    } finally {
      setSaving(false);
    }
  }

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

  if (
    projectError ||
    !project
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="max-w-xl rounded-3xl border border-red-400/30 bg-red-950/20 p-8 text-center">
          <p className="text-5xl">
            ⚠️
          </p>

          <h1 className="mt-4 text-2xl font-black">
            Batch Project Unavailable
          </h1>

          <p className="mt-4 leading-7 text-red-100">
            {projectError ||
              "The project could not be loaded."}
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
  accept="image/*"
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
        accept="image/*"
        onChange={
          handleImageInput
        }
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
            {project.projectName ??
              project.name ??
              "Engineering Project"}
          </p>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 sm:text-xl">
            Detect real boundaries,
            calculate real geometry,
            approve exceptions and save
            the complete style directly
            into Module 04.
          </p>

          <p className="mt-5 font-black text-cyan-200">
            The engineer makes the
            decisions. OptiFabric performs
            the repetitive engineering work.
          </p>
        </section>

        {message ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 px-5 py-4 font-bold leading-6 text-cyan-100">
            {message}
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatusCard
            title="Images"
            current={counts.images}
            total={counts.images}
          />

          <StatusCard
            title="Boundaries"
            current={
              counts.boundaries
            }
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

              <h2 className="mt-2 text-3xl font-black">
                Batch Upload
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Drop a folder or upload
                multiple pattern images in
                one operation.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  folderInputRef.current?.click()
                }
                disabled={
                  processing ||
                  saving
                }
                className="rounded-xl border border-cyan-400/30 bg-cyan-950/30 px-5 py-3 font-black text-cyan-200 disabled:opacity-40"
              >
                Select Folder
              </button>

              <button
                type="button"
                onClick={() =>
                  imageInputRef.current?.click()
                }
                disabled={
                  processing ||
                  saving
                }
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
            onDragLeave={() =>
              setDragActive(false)
            }
            onDrop={handleDrop}
            className={`mt-7 rounded-3xl border-2 border-dashed p-14 text-center transition ${
              dragActive
                ? "border-cyan-300 bg-cyan-950/30"
                : "border-cyan-500/30 bg-slate-950/40"
            }`}
          >
            <p className="text-5xl">
              📂
            </p>

            <p className="mt-4 text-2xl font-black text-cyan-300">
              Drag Folder or Pattern
              Images Here
            </p>

            <p className="mt-3 text-slate-400">
              JPG, JPEG, PNG and WEBP
            </p>
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
            <label>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Project calibration —
                pixels/cm
              </span>

              <input
                type="number"
                min="0.0001"
                step="0.0001"
                value={
                  projectPixelsPerCm ??
                  ""
                }
                onChange={(event) => {
                  const value =
                    Number(
                      event.target
                        .value
                    );

                  setProjectPixelsPerCm(
                    Number.isFinite(
                      value
                    ) &&
                      value > 0
                      ? value
                      : null
                  );
                }}
                placeholder="Saved project calibration or one verified ruler value"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-black text-white outline-none focus:border-cyan-400"
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                OptiFabric automatically
                reuses an existing valid
                calibration saved in this
                project. Automatic batch
                ruler detection will follow
                after this integration is
                verified.
              </p>
            </label>

            <button
              type="button"
              onClick={
                startProcessing
              }
              disabled={
                processing ||
                saving ||
                patternPieces.length ===
                  0
              }
              className="rounded-xl bg-violet-500 px-7 py-4 font-black text-white transition enabled:hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {processing
                ? "Real AI Processing..."
                : "Start Real AI Processing"}
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-violet-400/20 bg-violet-950/10 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
            Live processing pipeline
          </p>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-violet-400 transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-sm font-bold">
            <span className="text-slate-400">
              {
                processingSteps[
                  activeStep
                ]
              }
            </span>

            <span className="text-violet-300">
              {progressPercent}%
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {processingSteps.map(
              (
                step,
                index
              ) => (
                <PipelineStep
                  key={step}
                  label={step}
                  complete={
                    progressPercent ===
                      100 ||
                    index <
                      activeStep
                  }
                  active={
                    index ===
                      activeStep &&
                    progressPercent <
                      100
                  }
                />
              )
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <BatchMetric
            label="Uploaded"
            value={counts.images}
          />

          <BatchMetric
            label="AI Ready"
            value={counts.ready}
          />

          <BatchMetric
            label="Manual Review"
            value={counts.review}
          />

          <BatchMetric
            label="Failed"
            value={counts.failed}
          />

          <BatchMetric
            label="Selected"
            value={counts.selected}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Engineering queue
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Real Pattern Review
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={
                  selectAllReady
                }
                disabled={
                  processing ||
                  saving
                }
                className="rounded-xl border border-emerald-400/30 bg-emerald-950/20 px-4 py-3 font-black text-emerald-300 disabled:opacity-40"
              >
                Select All Ready
              </button>

              <button
                type="button"
                onClick={
                  selectReviewPieces
                }
                disabled={
                  processing ||
                  saving
                }
                className="rounded-xl border border-amber-400/30 bg-amber-950/20 px-4 py-3 font-black text-amber-300 disabled:opacity-40"
              >
                Select Review
              </button>

              <button
                type="button"
                onClick={
                  saveSelectedGeometry
                }
                disabled={
                  processing ||
                  saving ||
                  counts.selected === 0
                }
                className="rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? "Saving Real Geometry..."
                  : "Save Selected Geometry"}
              </button>

              <button
                type="button"
                onClick={clearBatch}
                disabled={
                  processing ||
                  saving
                }
                className="rounded-xl border border-red-400/30 bg-red-950/20 px-4 py-3 font-black text-red-300 disabled:opacity-40"
              >
                Clear Batch
              </button>
            </div>
          </div>

          {patternPieces.length >
          0 ? (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {patternPieces.map(
                (piece) => (
                  <PatternQueueCard
  key={piece.id}
  piece={piece}
  reviewOpen={
    reviewingPieceId ===
    piece.id
  }
  onReview={() =>
    startReview(
      piece.id
    )
  }
  onApprove={() => {
  togglePiece(
    piece.id
  );

  setReviewingPieceId(
    null
  );
}}
onInspect={() => {
  const validationUrl =
    `/optifabric/project/${projectId}/patterns/${
      piece.projectPatternId ??
      piece.id
    }/trace`;

  window.open(
    validationUrl,
    "_blank",
    "noopener,noreferrer"
  );
}}
/>
                )
              )}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-10 text-center text-slate-500">
              The engineering queue will
              appear after pattern images
              are uploaded.
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">
            Engineering activity log
          </p>

          {activities.length >
          0 ? (
            <div className="mt-5 space-y-3">
              {activities.map(
                (activity) => (
                  <div
                    key={
                      activity.id
                    }
                    className="grid gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 sm:grid-cols-[100px_1fr]"
                  >
                    <span className="font-mono text-xs text-slate-500">
                      {
                        activity.time
                      }
                    </span>

                    <span
                      className={
                        activity.type ===
                        "success"
                          ? "text-emerald-300"
                          : activity.type ===
                              "warning"
                            ? "text-amber-300"
                            : "text-slate-300"
                      }
                    >
                      {
                        activity.message
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="mt-5 text-slate-500">
              Real processing activity
              will be recorded here.
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

function StatusCard({
  title,
  current,
  total,
}: {
  title: string;

  current: number;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-black">
        {current} / {total}
      </p>
    </div>
  );
}

function BatchMetric({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">
        {value}
      </p>
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
      {complete
        ? "✓ "
        : active
          ? "● "
          : "○ "}

      {label}
    </div>
  );
}

function PatternQueueCard({
  piece,
  reviewOpen,
  onReview,
  onApprove,
  onInspect,
  
}: {
  piece: BatchPatternPiece;
  reviewOpen: boolean;
  onReview: () => void;
  onApprove: () => void;
  onInspect: () => void;
}) {
  const maySelect =
    piece.status === "ready" ||
    piece.status === "review" ||
    piece.status === "saved";

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
        <img
          src={piece.previewUrl}
          alt={piece.name}
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

            <input
              type="checkbox"
              checked={
                piece.selected
              }
              onChange={onApprove}
              disabled={!maySelect}
              className="h-5 w-5 accent-cyan-400 disabled:opacity-30"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge
              status={
                piece.status
              }
            />

            {piece.confidence !==
            null ? (
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-black text-slate-300">
                Confidence{" "}
                {
                  piece.confidence
                }
                %
              </span>
            ) : null}

            {piece.geometryResult ? (
              <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-black text-violet-300">
                {
                  piece
                    .geometryResult
                    .polygon
                    .vertexCount
                }{" "}
                vertices
              </span>
            ) : null}
          </div>

          {piece.engineerApproved ? (
            <p className="mt-3 text-xs font-black text-emerald-300">
              ✓ Engineer approved
            </p>
          ) : null}

          {piece.warning ? (
            <p className="mt-3 text-xs font-bold leading-5 text-amber-300">
              {piece.warning}
            </p>
          ) : null}

{piece.status === "review" ? (
  <button
    type="button"
    onClick={onReview}
    className="mt-4 w-full rounded-xl border border-cyan-400/40 bg-cyan-950/20 px-4 py-3 font-black text-cyan-300 transition hover:bg-cyan-950/40"
  >
    {reviewOpen
      ? "Close Review Details"
      : "Review Details"}
  </button>
) : null}
{piece.status === "review" ||
piece.status === "failed" ? (
  <button
    type="button"
    onClick={onInspect}
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
      Review the detected geometry before approving this pattern.
    </p>
<div className="mt-4 grid grid-cols-2 gap-3 text-sm">

  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
      Confidence
    </p>

    <p className="mt-1 font-black text-white">
      {typeof piece.confidence === "number"
        ? `${piece.confidence.toFixed(1)}%`
        : "—"}
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
      Vertices
    </p>

    <p className="mt-1 font-black text-white">
      —
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
      Project Match
    </p>

    <p className="mt-1 break-words font-black text-white">
      {piece.projectPatternId ?? "Not matched"}
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
      Status
    </p>

    <p className="mt-1 font-black capitalize text-white">
      {piece.status}
    </p>
  </div>

</div>

    {piece.warning ? (
      <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3">
        <p className="font-bold text-amber-300">
          Detection Warning
        </p>

        <p className="mt-2 text-sm text-amber-200">
          {piece.warning}
        </p>
      </div>
    ) : null}

    <div className="mt-5 flex gap-3">

      <button
        type="button"
        onClick={onApprove}
        className="rounded-xl bg-emerald-500 px-5 py-3 font-black text-slate-950 hover:bg-emerald-400"
      >
        ✓ Approve Geometry
      </button>

      <button
        type="button"
        onClick={onReview}
        className="rounded-xl border border-slate-600 px-5 py-3 font-black text-slate-300"
      >
        Close
      </button>

    </div>

  </div>
) : null}
          {piece.error ? (
            <p className="mt-3 text-xs font-bold leading-5 text-red-300">
              {piece.error}
            </p>
          ) : null}

          {piece.geometryResult ? (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <GeometryMiniValue
                label="Width"
                value={
                  typeof piece
                    .geometryResult
                    .dimensions
                    .widthCm ===
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
                  typeof piece
                    .geometryResult
                    .dimensions
                    .heightCm ===
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
                  typeof piece
                    .geometryResult
                    .polygon.area
                    .squareCm ===
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

function StatusBadge({
  status,
}: {
  status:
    BatchPieceStatus;
}) {
  const labelMap:
    Record<
      BatchPieceStatus,
      string
    > = {
    uploaded:
      "Uploaded",

    boundary:
      "Boundary",

    scale:
      "Scale",

    geometry:
      "Geometry",

    ready:
      "Ready",

    review:
      "Review",

    failed:
      "Failed",

    saved:
      "Saved",
  };

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
      {labelMap[status]}
    </span>
  );
}