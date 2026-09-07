"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  calculateBoundingBox,
  calculatePolygonAreaPixels,
  calculatePolygonPerimeterPixels,
  convertPixelAreaToSquareCm,
  convertPixelLengthToCm,
} from "@/lib/optifabric/patternGeometryEngine";

import {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

import {
  createEmptyPatternBoundary,
  createEmptyScaleCalibration,
  DEFAULT_REFERENCE_LENGTH_CM,
  PatternScaleCalibration,
  PatternTracingBoundary,
  PatternTracingProjectFields,
  PatternTracingTool,
  SavedPatternTracingData,
} from "@/lib/optifabric/patternTracingTypes";

import {
  EngineeringProject,
  PatternStatus,
} from "@/lib/optifabric/projectMaster";

import {
  updateProjectRegistryEntry,
} from "@/lib/optifabric/projectRegistry";

import {
  analysePatternImageBoundary,
} from "@/lib/optifabric/aiBoundaryImageAdapter";

import {
  detectPrintedScale,
} from "@/lib/optifabric/scaleCalibrationEngine";

import {
  BoundaryCanvas,
  GeometryReadinessPanel,
  MeasurementPanel,
  ScaleCalibrationPanel,
  TracingHeader,
  TracingToolbar,
  GeometrySavePanel,
  EngineeringDecisionPanel,
  AIRecommendationPanel,
  WarningPanel,
} from "@/components/optifabric/tracing";

import BoundaryQualityPanel from "@/components/optifabric/tracing/BoundaryQualityPanel";

import {
  evaluateBoundaryQuality,
} from "@/components/optifabric/tracing/BoundaryQualityEngine";

import EngineeringSummaryPanel from "@/components/optifabric/tracing/EngineeringSummaryPanel";

import {
  createSavedGeometryRecord,
  loadGeometryRecord,
  saveGeometryRecord,
} from "@/lib/optifabric/geometrySaveEngine";

import type {
  SavedGeometryRecord,
} from "@/lib/optifabric/geometrySaveTypes";


interface TraceablePatternStatus
  extends PatternStatus,
    PatternTracingProjectFields {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;

  scaleVisible?: boolean;
  grainLineVisible?: boolean;
  notchesVisible?: boolean;
  validationPassed?: boolean;

  materialCategory?: string;

  imageUrl?: string;
}

interface TracingProject
  extends Omit<EngineeringProject, "patterns"> {
  patterns: TraceablePatternStatus[];

  patternValidationCompleted?: boolean;
  patternValidationCompletedAt?: string;

  stylePatternSelectionCompleted?: boolean;
  stylePatternSelectionCompletedAt?: string;
  stylePatternSelectionLocked?: boolean;
  stylePatternSelectionLockedAt?: string;

  updatedAt?: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

interface ViewportState {
  zoom: number;
  centreX: number;
  centreY: number;
}

const MINIMUM_VERTICES = 3;
const MINIMUM_ZOOM = 0.25;
const MAXIMUM_ZOOM = 5;

function roundValue(
  value: number,
  decimals = 2
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const multiplier = 10 ** decimals;

  return (
    Math.round(value * multiplier) /
    multiplier
  );
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

function distanceBetweenPoints(
  firstPoint: GeometryPoint,
  secondPoint: GeometryPoint
): number {
  const differenceX =
    secondPoint.x - firstPoint.x;

  const differenceY =
    secondPoint.y - firstPoint.y;

  return Math.sqrt(
    differenceX ** 2 +
      differenceY ** 2
  );
}

function buildPointString(
  points: GeometryPoint[]
): string {
  return points
    .map(
      (point) =>
        `${point.x},${point.y}`
    )
    .join(" ");
}

async function loadImageDataFromSource(
  sourceUrl: string
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const width =
        image.naturalWidth ||
        image.width;

      const height =
        image.naturalHeight ||
        image.height;

      if (width <= 0 || height <= 0) {
        reject(
          new Error(
            "The tracing image has invalid dimensions."
          )
        );

        return;
      }

      const canvas =
        document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const context =
        canvas.getContext(
          "2d",
          {
            willReadFrequently: true,
          }
        );

      if (!context) {
        reject(
          new Error(
            "The browser could not create an image-analysis canvas."
          )
        );

        return;
      }

      context.drawImage(
        image,
        0,
        0,
        width,
        height
      );

      try {
        resolve(
          context.getImageData(
            0,
            0,
            width,
            height
          )
        );
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error(
                "The browser could not read the tracing image pixels."
              )
        );
      }
    };

    image.onerror = () => {
      reject(
        new Error(
          "The tracing image could not be loaded for scale analysis."
        )
      );
    };

    image.src = sourceUrl;
  });
}

function clampValue(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}

function calculateTracingStatus(
  boundary: PatternTracingBoundary,
  calibration: PatternScaleCalibration
):
  | "not-started"
  | "in-progress"
  | "boundary-closed"
  | "calibrated"
  | "ready"
  | "requires-review" {
  if (boundary.vertices.length === 0) {
    return "not-started";
  }

  if (!boundary.closed) {
    return "in-progress";
  }

  if (
    boundary.closed &&
    !calibration.calibrated
  ) {
    return "boundary-closed";
  }

  if (
    boundary.closed &&
    calibration.calibrated &&
    boundary.vertices.length >=
      MINIMUM_VERTICES
  ) {
    return "ready";
  }

  return "requires-review";
}

function getToolButtonClasses(
  active: boolean
): string {
  return active
    ? "border-cyan-300 bg-cyan-400 text-slate-950"
    : "border-slate-600 bg-slate-900 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-200";
}

export default function PatternTracingPage() {
  const params = useParams<{
    projectId: string;
    patternId: string;
  }>();

  const projectId = params.projectId;
  const patternId = params.patternId;

  const svgRef =
    useRef<SVGSVGElement | null>(null);

  const [project, setProject] =
    useState<TracingProject | null>(null);

  const [pattern, setPattern] =
    useState<TraceablePatternStatus | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [activeTool, setActiveTool] =
    useState<PatternTracingTool>("trace");

  const [imageSource, setImageSource] =
    useState("");

  const [
    temporaryImageSource,
    setTemporaryImageSource,
  ] = useState("");

  const [imageDimensions, setImageDimensions] =
    useState<ImageDimensions>({
      width: 1200,
      height: 800,
    });

  const [boundary, setBoundary] =
    useState<PatternTracingBoundary>(
      createEmptyPatternBoundary()
    );

  const [calibration, setCalibration] =
    useState<PatternScaleCalibration>(
      createEmptyScaleCalibration()
    );

  const [viewport, setViewport] =
    useState<ViewportState>({
      zoom: 1,
      centreX: 600,
      centreY: 400,
    });

  const [hasUnsavedChanges, setHasUnsavedChanges] =
    useState(false);
const [aiBusy, setAiBusy] = useState(false);

const [aiConfidence, setAiConfidence] =
  useState<number | null>(null);

const [aiWarnings, setAiWarnings] =
  useState<string[]>([]);

const [aiDetectionMessage, setAiDetectionMessage] =
  useState("");

const [aiVertexCount, setAiVertexCount] =
  useState(0);

const [scaleBusy, setScaleBusy] =
  useState(false);

const [scaleConfidence, setScaleConfidence] =
  useState<number | null>(null);

const [scaleWarnings, setScaleWarnings] =
  useState<string[]>([]);

const [scaleDetectionMessage, setScaleDetectionMessage] =
  useState("");

  const [
  savedGeometry,
  setSavedGeometry,
] = useState<SavedGeometryRecord | null>(
  null
);

const [
  geometrySaveError,
  setGeometrySaveError,
] = useState("");
  const projectStorageKey =
    `optifabric-project-${projectId}`;

  useEffect(() => {
    if (!projectId || !patternId) {
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
        ) as TracingProject;

      const selectedPattern =
        parsedProject.patterns.find(
          (item) =>
            item.id === patternId
        );

      if (!selectedPattern) {
        setLoadError(
          "The selected pattern piece could not be found in this project."
        );

        return;
      }

      setProject(parsedProject);
      setPattern(selectedPattern);

      const storedVertices =
        selectedPattern.polygonVertices ??
        selectedPattern.geometryVertices ??
        selectedPattern.patternTracing
          ?.boundary.vertices ??
        [];

      const storedBoundaryClosed =
        selectedPattern.patternTracing
          ?.boundary.closed ??
        storedVertices.length >=
          MINIMUM_VERTICES;


      setBoundary({
        vertices: storedVertices,
        closed: storedBoundaryClosed,
        vertexCount:
          storedVertices.length,
        startedAt:
          selectedPattern.patternTracing
            ?.boundary.startedAt,
        closedAt:
          selectedPattern.patternTracing
            ?.boundary.closedAt,
      });

      const storedPixelsPerCm =
        selectedPattern.pixelsPerCm ??
        selectedPattern.patternTracing
          ?.calibration.pixelsPerCm;

      setCalibration({
        firstPoint:
          selectedPattern.patternTracing
            ?.calibration.firstPoint,
        secondPoint:
          selectedPattern.patternTracing
            ?.calibration.secondPoint,

        referenceLengthCm:
          selectedPattern.patternTracing
            ?.calibration
            .referenceLengthCm ??
          DEFAULT_REFERENCE_LENGTH_CM,

        measuredPixels:
          selectedPattern.patternTracing
            ?.calibration.measuredPixels,

        pixelsPerCm:
          storedPixelsPerCm,

        pixelsPerInch:
          selectedPattern.pixelsPerInch ??
          selectedPattern.patternTracing
            ?.calibration.pixelsPerInch,

        calibrated:
          typeof storedPixelsPerCm ===
            "number" &&
          storedPixelsPerCm > 0,

        calibratedAt:
          selectedPattern.patternTracing
            ?.calibration.calibratedAt,
      });

      if (selectedPattern.imageUrl) {
        setImageSource(
          selectedPattern.imageUrl
        );
      }

      setLoadError("");
    } catch (error) {
      console.error(
        "Unable to load pattern tracing project:",
        error
      );

      setLoadError(
        "The saved engineering project data is invalid."
      );
    } finally {
      setLoading(false);
    }
  }, [
    patternId,
    projectId,
    projectStorageKey,
  ]);

  useEffect(() => {
    return () => {
      if (temporaryImageSource) {
        URL.revokeObjectURL(
          temporaryImageSource
        );
      }
    };
  }, [temporaryImageSource]);

  useEffect(() => {
  if (!projectId || !patternId) {
    return;
  }

  const existingGeometry =
    loadGeometryRecord(
      projectId,
      patternId
    );

  setSavedGeometry(
    existingGeometry
  );
}, [
  projectId,
  patternId,
]);

  const boundingBox = useMemo(() => {
    return calculateBoundingBox(
      boundary.vertices
    );
  }, [boundary.vertices]);

  const areaSquarePixels =
    useMemo(() => {
      return calculatePolygonAreaPixels(
        boundary.vertices
      );
    }, [boundary.vertices]);

  const perimeterPixels =
    useMemo(() => {
      return calculatePolygonPerimeterPixels(
        boundary.vertices
      );
    }, [boundary.vertices]);

  const areaSquareCm =
    useMemo(() => {
      return convertPixelAreaToSquareCm(
        areaSquarePixels,
        calibration.pixelsPerCm
      );
    }, [
      areaSquarePixels,
      calibration.pixelsPerCm,
    ]);

  const perimeterCm =
    useMemo(() => {
      return convertPixelLengthToCm(
        perimeterPixels,
        calibration.pixelsPerCm
      );
    }, [
      calibration.pixelsPerCm,
      perimeterPixels,
    ]);

  const widthCm = useMemo(() => {
    return convertPixelLengthToCm(
      boundingBox.width,
      calibration.pixelsPerCm
    );
  }, [
    boundingBox.width,
    calibration.pixelsPerCm,
  ]);

  const heightCm = useMemo(() => {
    return convertPixelLengthToCm(
      boundingBox.height,
      calibration.pixelsPerCm
    );
  }, [
    boundingBox.height,
    calibration.pixelsPerCm,
  ]);

  const tracingStatus =
    calculateTracingStatus(
      boundary,
      calibration
    );

  const geometryReady =
    boundary.closed &&
    boundary.vertices.length >=
      MINIMUM_VERTICES &&
    calibration.calibrated &&
    typeof calibration.pixelsPerCm ===
      "number" &&
    calibration.pixelsPerCm > 0 &&
    areaSquarePixels > 0 &&
    perimeterPixels > 0;
const boundaryQuality =
  useMemo(() => {
    return evaluateBoundaryQuality({
      vertices: boundary.vertices,

      closed: boundary.closed,
    });
  }, [
    boundary.vertices,
    boundary.closed,
  ]);
  const nextEngineeringStep =
  
  useMemo(() => {
    if (!imageSource) {
      return "Load a pattern image.";
    }

    if (
      boundary.vertices.length <
      MINIMUM_VERTICES
    ) {
      return "Trace the pattern boundary.";
    }

    if (!boundary.closed) {
      return "Close the traced polygon.";
    }

    if (!calibration.calibrated) {
      return "Calibrate the 12-inch reference scale.";
    }

    if (!geometryReady) {
      return "Review engineering measurements.";
    }

    return "Geometry is ready. Save and continue to Module 04.";
  }, [
    imageSource,
    boundary.vertices.length,
    boundary.closed,
    calibration.calibrated,
    geometryReady,
  ]);

const warnings = useMemo(() => {
  const items: string[] = [];

  if (!imageSource) {
    items.push(
      "Load an image before tracing."
    );
  }

  if (
    boundary.vertices.length <
    MINIMUM_VERTICES
  ) {
    items.push(
      "At least three boundary points are required."
    );
  }

  if (
    boundary.vertices.length >=
      MINIMUM_VERTICES &&
    !boundary.closed
  ) {
    items.push(
      "Close the polygon boundary."
    );
  }

  if (!calibration.calibrated) {
    items.push(
      "Select both ends of the 12-inch reference scale."
    );
  }

  return items;
}, [
  boundary.closed,
  boundary.vertices.length,
  calibration.calibrated,
  imageSource,
]);

const viewBox = useMemo(() => {
  const visibleWidth =
    imageDimensions.width /
    viewport.zoom;

  const visibleHeight =
    imageDimensions.height /
    viewport.zoom;

  const minimumX = clampValue(
    viewport.centreX -
      visibleWidth / 2,
    0,
    Math.max(
      0,
      imageDimensions.width -
        visibleWidth
    )
  );

  const minimumY = clampValue(
    viewport.centreY -
      visibleHeight / 2,
    0,
    Math.max(
      0,
      imageDimensions.height -
        visibleHeight
    )
  );

  return {
    x: minimumX,
    y: minimumY,
    width: visibleWidth,
    height: visibleHeight,
  };
}, [
  imageDimensions.height,
  imageDimensions.width,
  viewport.centreX,
  viewport.centreY,
  viewport.zoom,
]);

  function loadTracingImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      setMessage(
        "The tracing workspace currently requires a PNG, JPG or JPEG image. Convert PDF pages to images before tracing."
      );

      event.target.value = "";
      return;
    }

    if (temporaryImageSource) {
      URL.revokeObjectURL(
        temporaryImageSource
      );
    }

    const objectUrl =
      URL.createObjectURL(file);

    setTemporaryImageSource(objectUrl);
    setImageSource(objectUrl);
    setMessage(
      `${file.name} was loaded into the tracing workspace.`
    );
  }

  function handleImageLoaded(
    event: ChangeEvent<HTMLImageElement>
  ) {
    const image = event.currentTarget;

    const naturalWidth =
      image.naturalWidth || 1200;

    const naturalHeight =
      image.naturalHeight || 800;

    setImageDimensions({
      width: naturalWidth,
      height: naturalHeight,
    });

    setViewport({
      zoom: 1,
      centreX: naturalWidth / 2,
      centreY: naturalHeight / 2,
    });
  }

  function getSvgPoint(
    event: MouseEvent<SVGSVGElement>
  ): GeometryPoint | null {
    const svg = svgRef.current;

    if (!svg) {
      return null;
    }

    const transformation =
      svg.getScreenCTM();

    if (!transformation) {
      return null;
    }

    const point =
      svg.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    const transformedPoint =
      point.matrixTransform(
        transformation.inverse()
      );

    return {
      x: roundValue(
        transformedPoint.x,
        3
      ),

      y: roundValue(
        transformedPoint.y,
        3
      ),
    };
  }

  function handleWorkspaceClick(
    event: MouseEvent<SVGSVGElement>
  ) {
    if (!imageSource) {
      setMessage(
        "Load the pattern image before adding engineering points."
      );

      return;
    }

    const point =
      getSvgPoint(event);

    if (!point) {
      return;
    }

    if (activeTool === "trace") {
      if (boundary.closed) {
        setMessage(
          "The polygon is already closed. Clear or reopen it before adding more points."
        );

        return;
      }

      setBoundary((current) => {
        const vertices = [
          ...current.vertices,
          point,
        ];

        return {
          vertices,
          closed: false,
          vertexCount:
            vertices.length,

          startedAt:
            current.startedAt ??
            new Date().toISOString(),

          closedAt: undefined,
        };
      });

      setHasUnsavedChanges(true);
      setMessage("");
      return;
    }

    if (activeTool === "calibrate") {
      setCalibration((current) => {
        if (!current.firstPoint) {
          return {
            ...current,
            firstPoint: point,
            secondPoint: undefined,
            measuredPixels: undefined,
            pixelsPerCm: undefined,
            pixelsPerInch: undefined,
            calibrated: false,
            calibratedAt: undefined,
          };
        }

        if (!current.secondPoint) {
          const measuredPixels =
            distanceBetweenPoints(
              current.firstPoint,
              point
            );

          const pixelsPerCm =
            measuredPixels /
            current.referenceLengthCm;

          return {
            ...current,

            secondPoint: point,

            measuredPixels:
              roundValue(
                measuredPixels,
                3
              ),

            pixelsPerCm:
              roundValue(
                pixelsPerCm,
                6
              ),

            pixelsPerInch:
              roundValue(
                pixelsPerCm * 2.54,
                6
              ),

            calibrated:
              pixelsPerCm > 0,

            calibratedAt:
              new Date().toISOString(),
          };
        }

        return {
          ...current,

          firstPoint: point,
          secondPoint: undefined,

          measuredPixels: undefined,
          pixelsPerCm: undefined,
          pixelsPerInch: undefined,

          calibrated: false,
          calibratedAt: undefined,
        };
      });

      setHasUnsavedChanges(true);
      setMessage("");
    }
  }

  function undoLastPoint() {
    if (
      boundary.vertices.length === 0
    ) {
      return;
    }

    setBoundary((current) => {
      const vertices =
        current.vertices.slice(0, -1);

      return {
        ...current,
        vertices,
        vertexCount:
          vertices.length,
        closed: false,
        closedAt: undefined,
      };
    });

    setHasUnsavedChanges(true);
    setMessage(
      "The last boundary point was removed."
    );
  }

  function clearBoundary() {
    if (
      boundary.vertices.length === 0
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear all traced boundary points for this pattern?"
      );

    if (!confirmed) {
      return;
    }

    setBoundary(
      createEmptyPatternBoundary()
    );

    setHasUnsavedChanges(true);
    setMessage(
      "The traced polygon was cleared."
    );
  }

  function closeBoundary() {
    if (
      boundary.vertices.length <
      MINIMUM_VERTICES
    ) {
      setMessage(
        "Add at least three boundary points before closing the polygon."
      );

      return;
    }

    setBoundary((current) => ({
      ...current,
      closed: true,
      vertexCount:
        current.vertices.length,
      closedAt:
        new Date().toISOString(),
    }));

    setHasUnsavedChanges(true);
    setMessage(
      "The pattern polygon was closed."
    );
  }

  function resetCalibration() {
  setCalibration(
    createEmptyScaleCalibration()
  );

  setScaleConfidence(null);
  setScaleWarnings([]);
  setScaleDetectionMessage("");

  setHasUnsavedChanges(true);

  setMessage(
    "Scale calibration was cleared."
  );
}

function createClampedViewport(
  zoom: number,
  centreX: number,
  centreY: number
): ViewportState {
  const safeZoom = clampValue(
    zoom,
    MINIMUM_ZOOM,
    MAXIMUM_ZOOM
  );

  const visibleWidth =
    imageDimensions.width /
    safeZoom;

  const visibleHeight =
    imageDimensions.height /
    safeZoom;

  const imageCentreX =
    imageDimensions.width / 2;

  const imageCentreY =
    imageDimensions.height / 2;

  const minimumCentreX =
    visibleWidth >=
    imageDimensions.width
      ? imageCentreX
      : visibleWidth / 2;

  const maximumCentreX =
    visibleWidth >=
    imageDimensions.width
      ? imageCentreX
      : imageDimensions.width -
        visibleWidth / 2;

  const minimumCentreY =
    visibleHeight >=
    imageDimensions.height
      ? imageCentreY
      : visibleHeight / 2;

  const maximumCentreY =
    visibleHeight >=
    imageDimensions.height
      ? imageCentreY
      : imageDimensions.height -
        visibleHeight / 2;

  return {
    zoom: safeZoom,

    centreX: clampValue(
      centreX,
      minimumCentreX,
      maximumCentreX
    ),

    centreY: clampValue(
      centreY,
      minimumCentreY,
      maximumCentreY
    ),
  };
}

function zoomIn() {
  setViewport((current) => {
    return createClampedViewport(
      current.zoom * 1.25,
      current.centreX,
      current.centreY
    );
  });
}

function zoomOut() {
  setViewport((current) => {
    return createClampedViewport(
      current.zoom / 1.25,
      current.centreX,
      current.centreY
    );
  });
}

function fitImage() {
  setViewport({
    zoom: 1,

    centreX:
      imageDimensions.width / 2,

    centreY:
      imageDimensions.height / 2,
  });
}

function panViewport(
  direction:
    | "left"
    | "right"
    | "up"
    | "down"
) {
  setViewport((current) => {
    const visibleWidth =
      imageDimensions.width /
      current.zoom;

    const visibleHeight =
      imageDimensions.height /
      current.zoom;

    const horizontalMovement =
      visibleWidth / 8;

    const verticalMovement =
      visibleHeight / 8;

    let nextCentreX =
      current.centreX;

    let nextCentreY =
      current.centreY;

    if (direction === "left") {
      nextCentreX -=
        horizontalMovement;
    }

    if (direction === "right") {
      nextCentreX +=
        horizontalMovement;
    }

    if (direction === "up") {
      nextCentreY -=
        verticalMovement;
    }

    if (direction === "down") {
      nextCentreY +=
        verticalMovement;
    }

    return createClampedViewport(
      current.zoom,
      nextCentreX,
      nextCentreY
    );
  });
}

  function saveGeometry() {
    if (
      !project ||
      !pattern
    ) {
      return;
    }

    if (!geometryReady) {
      setMessage(
        "Complete and close the polygon, then calibrate the 12-inch scale before saving geometry."
      );

      return;
    }

    const savedAt =
      new Date().toISOString();
setGeometrySaveError("");

try {
  const polygonLeft = Math.min(
    ...boundary.vertices.map(
      (point) => point.x
    )
  );

  const polygonTop = Math.min(
    ...boundary.vertices.map(
      (point) => point.y
    )
  );

  const geometryRecord =
    createSavedGeometryRecord({
      projectId:
        project.id,

      patternId:
        pattern.id,

      garmentType:
        project.projectName,

      patternPiece:
        pattern.name,

      widthCm:
        widthCm ?? 0,

      heightCm:
        heightCm ?? 0,

      areaSqCm:
        areaSquareCm ?? 0,

      perimeterCm:
        perimeterCm ?? 0,

      pixelArea:
        areaSquarePixels,

      pixelsPerCm:
        calibration.pixelsPerCm ??
        0,

      boundaryClosed:
        boundary.closed,

      boundaryQualityScore:
        boundaryQuality.score,

      boundingBox: {
        left:
          polygonLeft,

        top:
          polygonTop,

        width:
          boundingBox.width,

        height:
          boundingBox.height,
      },

      polygon:
        boundary.vertices.map(
          (point) => ({
            x: point.x,
            y: point.y,
          })
        ),
    });

  saveGeometryRecord(
    geometryRecord
  );

  setSavedGeometry(
    geometryRecord
  );
} catch (error) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Engineering geometry could not be saved.";

  setGeometrySaveError(
    errorMessage
  );

  setMessage(
    `Geometry save failed: ${errorMessage}`
  );

  return;
}
    const savedTracing:
      SavedPatternTracingData = {
        patternId:
          pattern.id,

        projectId:
          project.id,

        patternName:
          pattern.name,

        status:
          tracingStatus,

        image: {
          fileName:
            pattern.fileName,

          fileType:
            pattern.fileType ===
            "image/png"
              ? "image/png"
              : pattern.fileType ===
                  "image/jpeg"
                ? "image/jpeg"
                : pattern.fileType ===
                    "application/pdf"
                  ? "application/pdf"
                  : "unknown",

          sourceUrl:
            pattern.imageUrl,

          naturalWidth:
            imageDimensions.width,

          naturalHeight:
            imageDimensions.height,
        },

        boundary,

        calibration,

        measurement: {
          widthPixels:
            boundingBox.width,

          heightPixels:
            boundingBox.height,

          widthCm,
          heightCm,

          areaSquarePixels,

          areaSquareCm,

          perimeterPixels,

          perimeterCm,
        },

        validation: {
          hasImage:
            Boolean(imageSource),

          hasMinimumVertices:
            boundary.vertices.length >=
            MINIMUM_VERTICES,

          boundaryClosed:
            boundary.closed,

          scalePointCount:
            [
              calibration.firstPoint,
              calibration.secondPoint,
            ].filter(Boolean).length,

          calibrationCompleted:
            calibration.calibrated,

          measurementAvailable:
            areaSquarePixels > 0 &&
            perimeterPixels > 0,

          geometryReady,

          warnings,
        },

        createdAt:
          pattern.patternTracing
            ?.createdAt ??
          savedAt,

        updatedAt:
          savedAt,
      };

    const updatedPatterns =
      project.patterns.map(
        (projectPattern) => {
          if (
            projectPattern.id !==
            pattern.id
          ) {
            return projectPattern;
          }

          return {
            ...projectPattern,

            geometryVertices:
              boundary.vertices,

            polygonVertices:
              boundary.vertices,

            pixelsPerCm:
              calibration.pixelsPerCm,

            pixelsPerInch:
              calibration.pixelsPerInch,

            detectedWidthPixels:
              boundingBox.width,

            detectedHeightPixels:
              boundingBox.height,

            calibratedWidthCm:
              widthCm,

            calibratedHeightCm:
              heightCm,

            calibratedAreaSqCm:
              areaSquareCm,

            calibratedPerimeterCm:
              perimeterCm,

            geometryTracingCompleted:
              true,

            geometryTracingCompletedAt:
              savedAt,

            patternTracing:
              savedTracing,
          };
        }
      );

    const updatedPattern =
      updatedPatterns.find(
        (item) =>
          item.id === pattern.id
      );

    const updatedProject:
      TracingProject = {
        ...project,

        patterns:
          updatedPatterns,

        updatedAt:
          savedAt,
      };

    setProject(updatedProject);

    if (updatedPattern) {
      setPattern(updatedPattern);
    }

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
        "Unable to synchronise tracing status with the project registry:",
        error
      );
    }

    setHasUnsavedChanges(false);

    setMessage(
      `${pattern.name} geometry was saved successfully. Return to Module 04 to generate project geometry.`
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 px-10 py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-5 text-lg font-black">
            Loading Pattern Tracing Workspace...
          </p>
        </section>
      </main>
    );
  }
async function handleAiBoundaryDetection() {
  if (!imageSource) {
    setAiDetectionMessage(
      "Please load a pattern image before running AI boundary detection."
    );
    return;
  }

  try {
    setAiBusy(true);
    setAiConfidence(null);
    setAiWarnings([]);
    setAiVertexCount(0);
    setAiDetectionMessage(
      "AI is analysing the pattern boundary..."
    );

    const result =
      await analysePatternImageBoundary({
        sourceUrl: imageSource,
        imageWidth:
          imageDimensions.width,
        imageHeight:
          imageDimensions.height,
      });

    const aiPoints: GeometryPoint[] =
      result.detection.vertices.map(
        (vertex) => ({
          x: roundValue(vertex.x, 3),
          y: roundValue(vertex.y, 3),
        })
      );

    const detectedConfidence =
      result.detection.quality.confidence;

    const confidencePercentage =
      detectedConfidence <= 1
        ? detectedConfidence * 100
        : detectedConfidence;

    setAiConfidence(
      roundValue(
        confidencePercentage,
        2
      )
    );

    setAiWarnings(
      result.detection.warnings.map(
        (warning) => warning.message
      )
    );

    setAiVertexCount(
      result.detection.vertexCount
    );

    if (
      result.detection.status ===
        "failed" ||
      aiPoints.length <
        MINIMUM_VERTICES
    ) {
      setBoundary(
        createEmptyPatternBoundary()
      );

      setAiDetectionMessage(
        result.detection.explanation ||
          "AI could not isolate reliable garment geometry."
      );

      return;
    }

    setBoundary({
      vertices: aiPoints,
      closed:
        result.detection.closed &&
        aiPoints.length >=
          MINIMUM_VERTICES,
      vertexCount:
        aiPoints.length,
      startedAt:
        new Date().toISOString(),
      closedAt:
        result.detection.closed
          ? new Date().toISOString()
          : undefined,
    });

    setHasUnsavedChanges(true);

    setAiDetectionMessage(
      result.detection.explanation ||
        `AI detected ${aiPoints.length} ordered boundary vertices.`
    );
  } catch (error) {
    console.error(
      "AI boundary detection failed:",
      error
    );

    setBoundary(
      createEmptyPatternBoundary()
    );

    setAiConfidence(null);
    setAiWarnings([]);
    setAiVertexCount(0);

    setAiDetectionMessage(
      error instanceof Error
        ? `AI boundary detection failed: ${error.message}`
        : "AI boundary detection failed because of an unexpected error."
    );
  } finally {
    setAiBusy(false);
  }
}

async function handleAutomaticScaleDetection() {
  if (!imageSource) {
    setScaleDetectionMessage(
      "Please load a pattern image before running automatic scale calibration."
    );
    return;
  }

  try {
    setScaleBusy(true);
    setScaleConfidence(null);
    setScaleWarnings([]);
    setScaleDetectionMessage(
      "AI is locating the printed 12-inch ruler..."
    );

    const imageData =
      await loadImageDataFromSource(
        imageSource
      );

    const result =
      detectPrintedScale({
        imageData,
        expectedLengthInches: 12,
      });

    setScaleConfidence(
      roundValue(
        result.quality.confidence *
          100,
        2
      )
    );

    setScaleWarnings(
      result.warnings
    );

    if (
      result.status === "failed" ||
      !result.calibration.calibrated ||
      !result.calibration.pixelsPerCm ||
      result.calibration.pixelsPerCm <= 0
    ) {
      setCalibration(
        createEmptyScaleCalibration()
      );

      setScaleDetectionMessage(
        result.explanation ||
          "AI could not isolate a reliable printed scale. Use manual calibration."
      );

      return;
    }

    setCalibration(
      result.calibration
    );

    setHasUnsavedChanges(true);

    setScaleDetectionMessage(
      result.explanation
    );

    setMessage(
      result.status ===
        "requires-review"
        ? "Automatic scale calibration completed provisionally. Review the amber ruler endpoints before saving geometry."
        : "Automatic scale calibration completed successfully. Real pattern measurements are now available."
    );
  } catch (error) {
    console.error(
      "Automatic scale calibration failed:",
      error
    );

    setCalibration(
      createEmptyScaleCalibration()
    );

    setScaleConfidence(null);
    setScaleWarnings([]);

    setScaleDetectionMessage(
      error instanceof Error
        ? `Automatic scale calibration failed: ${error.message}`
        : "Automatic scale calibration failed because of an unexpected error."
    );
  } finally {
    setScaleBusy(false);
  }
}
  if (
    loadError ||
    !project ||
    !pattern
  ) {
   
   
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-2xl rounded-3xl border border-red-400/30 bg-red-950/20 p-8 text-center">
          <h1 className="text-3xl font-black">
            Pattern tracing unavailable
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            {loadError}
          </p>

          <Link
            href={`/optifabric/project/${projectId}/patterns`}
            className="mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
          >
            Return to Pattern Workspace
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-[1600px]">
        <TracingHeader
  projectName={`Project: ${project.projectName}`}
  patternName={pattern.name}
  status={
    geometryReady
      ? "Geometry Ready"
      : tracingStatus
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          )
  }
/>

<section className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 sm:flex-row sm:flex-wrap sm:justify-end">
  <Link
    href={`/optifabric/project/${project.id}/patterns`}
    className="rounded-xl border border-cyan-400/30 bg-slate-950/50 px-5 py-3 text-center font-black text-cyan-200 transition hover:border-cyan-300 hover:text-white"
  >
    ← Pattern List
  </Link>

  <Link
    href={`/optifabric/project/${project.id}/geometry`}
    className="rounded-xl border border-violet-400/30 bg-violet-950/30 px-5 py-3 text-center font-black text-violet-200 transition hover:border-violet-300 hover:text-white"
  >
    Module 04 Geometry
  </Link>
</section>

        {message ? (
          <section className="mt-5 rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 font-bold text-cyan-100">
            {message}
          </section>
        ) : null}

        <TracingToolbar
  activeTool={activeTool}

  onLoadImage={() => {
    setMessage(
      "Use the Load or Replace Tracing Image button directly above the pattern canvas."
    );
  }}

  onSelectTraceTool={() =>
    setActiveTool("trace")
  }

  onSelectCalibrationTool={() =>
    setActiveTool("calibrate")
  }

  onSelectTool={() =>
    setActiveTool("select")
  }

  onSelectPanTool={() =>
    setActiveTool("pan")
  }

  onUndoPoint={undoLastPoint}

  onClosePolygon={closeBoundary}

  onClearTrace={clearBoundary}

  onDetectBoundary={
    handleAiBoundaryDetection
  }

  onDetectScale={
    handleAutomaticScaleDetection
  }

  onResetScale={
    resetCalibration
  }

  onZoomIn={zoomIn}

  onZoomOut={zoomOut}

  onFitImage={fitImage}

  onResetView={fitImage}

  onPanLeft={() =>
    panViewport("left")
  }

  onPanRight={() =>
    panViewport("right")
  }

  onPanUp={() =>
    panViewport("up")
  }

  onPanDown={() =>
    panViewport("down")
  }

  onSaveGeometry={saveGeometry}

  onResetWorkspace={() => {
    clearBoundary();
    resetCalibration();

    setMessage(
      "The tracing boundary and scale calibration were reset."
    );
  }}

  imageLoaded={Boolean(imageSource)}

  boundaryDetected={
    boundary.vertices.length > 0
  }

  boundaryClosed={
    boundary.closed
  }

  calibrationComplete={
    calibration.calibrated
  }

  boundaryEnabled={
    Boolean(imageSource)
  }

  scaleEnabled={
    Boolean(imageSource) &&
    !aiBusy
  }

  saveEnabled={
    geometryReady
  }

  canUndo={
    boundary.vertices.length > 0
  }

  canClosePolygon={
    boundary.vertices.length >=
      MINIMUM_VERTICES &&
    !boundary.closed
  }

  canClearTrace={
    boundary.vertices.length > 0
  }

  canResetScale={
    Boolean(
      calibration.firstPoint ||
        calibration.secondPoint ||
        calibration.calibrated
    )
  }

  canZoom={
    Boolean(imageSource)
  }

  canPan={
    Boolean(imageSource)
  }

  detectingBoundary={
    aiBusy
  }

  detectingScale={
    scaleBusy
  }

  savingGeometry={false}
/>

        {(aiDetectionMessage ||
          scaleDetectionMessage) ? (
          <section className="mt-5 grid gap-4 lg:grid-cols-2">
            {aiDetectionMessage ? (
              <div className="rounded-2xl border border-cyan-400/25 bg-cyan-950/20 p-5">
                <p className="font-black text-cyan-300">
                  AI Boundary Detection
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {aiDetectionMessage}
                </p>

                <p className="mt-3 text-sm font-bold text-slate-400">
                  Confidence: {aiConfidence === null
                    ? "—"
                    : `${formatNumber(aiConfidence, 2)}%`} · Vertices: {aiVertexCount}
                </p>

                {aiWarnings.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {aiWarnings.map((warning) => (
                      <p
                        key={warning}
                        className="rounded-lg border border-amber-400/20 bg-slate-950/50 px-3 py-2 text-xs leading-5 text-amber-100"
                      >
                        {warning}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {scaleDetectionMessage ? (
              <div className="rounded-2xl border border-amber-400/25 bg-amber-950/15 p-5">
                <p className="font-black text-amber-300">
                  Automatic Scale Calibration
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {scaleDetectionMessage}
                </p>

                <p className="mt-3 text-sm font-bold text-slate-400">
                  Confidence: {scaleConfidence === null
                    ? "—"
                    : `${formatNumber(scaleConfidence, 2)}%`}
                </p>

                {scaleWarnings.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {scaleWarnings.map((warning) => (
                      <p
                        key={warning}
                        className="rounded-lg border border-amber-400/20 bg-slate-950/50 px-3 py-2 text-xs leading-5 text-amber-100"
                      >
                        {warning}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
  <BoundaryCanvas
    svgRef={svgRef}
    patternName={pattern.name}
    imageSource={imageSource}
    imageDimensions={imageDimensions}
    viewport={viewport}
    viewBox={viewBox}
    activeTool={activeTool}
    boundary={boundary}
    calibration={calibration}
    onImageFileChange={
  loadTracingImage
}
    onWorkspaceClick={handleWorkspaceClick}
    onImageLoaded={handleImageLoaded}
    onZoomIn={zoomIn}
    onZoomOut={zoomOut}
    onFitImage={fitImage}
    onPanLeft={() =>
      panViewport("left")
    }
    onPanRight={() =>
      panViewport("right")
    }
    onPanUp={() =>
      panViewport("up")
    }
    onPanDown={() =>
      panViewport("down")
    }
  />

  <aside className="space-y-6">
    <GeometryReadinessPanel
      geometryReady={geometryReady}
      tracingStatus={tracingStatus}
      vertexCount={
        boundary.vertices.length
      }
      boundaryClosed={
        boundary.closed
      }
      pixelsPerCm={
        calibration.pixelsPerCm
      }
      scaleCalibrated={
        calibration.calibrated
      }
    />

    <MeasurementPanel
      widthCm={widthCm}
      heightCm={heightCm}
      areaSquareCm={
        areaSquareCm
      }
      perimeterCm={
        perimeterCm
      }
      areaSquarePixels={
        areaSquarePixels
      }
    />
<EngineeringSummaryPanel
  widthCm={widthCm}
  heightCm={heightCm}
  areaSqCm={areaSquareCm}
  perimeterCm={perimeterCm}
  pixelArea={areaSquarePixels}
  vertexCount={boundary.vertices.length}
  boundaryClosed={boundary.closed}
  scaleCalibrated={calibration.calibrated}
  geometryReady={geometryReady}
  markerReady={geometryReady}
/>
    <ScaleCalibrationPanel
      referenceLengthCm={
        calibration.referenceLengthCm
      }
      calibrated={
        calibration.calibrated
      }
      pixelsPerCm={
        calibration.pixelsPerCm
      }
      pixelsPerInch={
        calibration.pixelsPerInch
      }
      measuredPixels={
        calibration.measuredPixels
      }
      firstPointSelected={Boolean(
        calibration.firstPoint
      )}
      secondPointSelected={Boolean(
        calibration.secondPoint
      )}
      automaticStatus={
        calibration.calibrated
          ? scaleWarnings.length > 0
            ? "requires-review"
            : "detected"
          : scaleBusy
            ? "in-progress"
            : "not-started"
      }
      automaticConfidence={
        scaleConfidence
      }
      automaticMessage={
        scaleDetectionMessage
      }
      warnings={scaleWarnings}
      busy={scaleBusy}
      onDetectScale={
        handleAutomaticScaleDetection
      }
      onResetScale={
        resetCalibration
      }
    />
<BoundaryQualityPanel
  score={boundaryQuality.score}
  grade={boundaryQuality.grade}
  rules={boundaryQuality.rules}
/>
<EngineeringDecisionPanel
  boundaryReady={
    boundary.closed &&
    boundary.vertices.length >=
      MINIMUM_VERTICES
  }
  qualityPassed={
    boundaryQuality.score >= 75
  }
  scaleReady={
    calibration.calibrated
  }
  geometryReady={
    geometryReady
  }
  nextStep={
    nextEngineeringStep
  }
/>
<AIRecommendationPanel
  recommendations={[
    boundary.closed
      ? "The traced boundary is closed."
      : "Close the traced polygon before continuing.",

    boundaryQuality.score >= 75
      ? `Boundary quality is acceptable at ${boundaryQuality.score}%.`
      : `Boundary quality is ${boundaryQuality.score}%. Review the detected geometry.`,

    calibration.calibrated
      ? "Scale calibration is complete."
      : "Calibrate the 12-inch reference scale.",

    geometryReady
      ? "Pattern geometry is ready for the next engineering stage."
      : "Complete the remaining geometry checks before marker planning.",
  ]}
  nextStep={nextEngineeringStep}
  ready={geometryReady}
/>
<GeometrySavePanel
  geometryReady={geometryReady}
  saved={Boolean(savedGeometry)}
  savedAt={
    savedGeometry
      ? new Date(
          savedGeometry.savedAt
        ).toLocaleString()
      : undefined
  }
  onSave={saveGeometry}
/>
{geometrySaveError ? (
  <div className="rounded-2xl border border-red-400/30 bg-red-950/20 p-4 text-sm leading-6 text-red-200">
    {geometrySaveError}
  </div>
) : null}
    <WarningPanel
      title="Engineering Checks"
      warnings={warnings}
    />
  </aside>
</div>

        </div>
    </main>
  );
}

function ToolButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 font-black transition ${getToolButtonClasses(
        active
      )}`}
    >
      {label}
    </button>
  );
}

function ToolbarButton({
  label,
  onClick,
  disabled = false,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl border px-4 py-3 font-black transition disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-600 ${
        danger
          ? "border-red-400/30 bg-red-950/20 text-red-300 enabled:hover:bg-red-950/40"
          : "border-slate-600 bg-slate-950 text-slate-300 enabled:hover:border-cyan-400/40 enabled:hover:text-cyan-200"
      }`}
    >
      {label}
    </button>
  );
}

function PanButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 font-black text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
    >
      {label}
    </button>
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

      <p className="mt-1 font-black text-white">
        {value}
      </p>
    </div>
  );
}

function MeasurementRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3">
      <span className="text-sm font-bold text-slate-400">
        {label}
      </span>

      <span className="font-black text-white">
        {value}
      </span>
    </div>
  );
}