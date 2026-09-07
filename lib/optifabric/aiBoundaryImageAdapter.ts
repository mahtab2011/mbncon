import {
  BoundaryDetectionEngineInput,
  BoundaryDetectionResult,
} from "@/lib/optifabric/aiBoundaryDetectionTypes";

import {
  detectPatternBoundary,
} from "@/lib/optifabric/aiBoundaryDetectionEngine";

export interface BoundaryImageAnalysisInput {
  sourceUrl: string;

  fileName?: string;

  imageWidth?: number;
  imageHeight?: number;

  maximumAnalysisDimension?: number;

  backgroundExpected?:
    | "light"
    | "dark"
    | "unknown";

  /**
   * When true, OptiFabric excludes the information
   * panel and ruler area before boundary analysis.
   *
   * Default: true
   */
  isolatePatternWorkspace?: boolean;

  /**
   * Portion removed from the left side of the image.
   *
   * The current Engineering Demonstration Dataset
   * normally places the pattern workspace after
   * approximately 38% of the total image width.
   */
  workspaceLeftRatio?: number;

  /**
   * Small margins remove page borders and labels
   * touching the outside edges.
   */
  workspaceTopRatio?: number;
  workspaceRightRatio?: number;
  workspaceBottomRatio?: number;
}

export interface BoundaryImageAnalysisResult {
  detection: BoundaryDetectionResult;

  analysedImageWidth: number;
  analysedImageHeight: number;

  originalImageWidth: number;
  originalImageHeight: number;

  scaleX: number;
  scaleY: number;

  workspaceIsolated: boolean;

  workspaceOriginalX: number;
  workspaceOriginalY: number;

  workspaceOriginalWidth: number;
  workspaceOriginalHeight: number;
}

interface WorkspaceRectangle {
  x: number;
  y: number;

  width: number;
  height: number;
}

const DEFAULT_MAXIMUM_ANALYSIS_DIMENSION =
  1600;

/**
 * The demonstration sheets contain:
 *
 * left information panel
 * ruler
 * pattern workspace
 *
 * The pattern workspace normally begins at around
 * 38% of the original image width.
 */
const DEFAULT_WORKSPACE_LEFT_RATIO =
  0.38;

const DEFAULT_WORKSPACE_TOP_RATIO =
  0.015;

const DEFAULT_WORKSPACE_RIGHT_RATIO =
  0.015;

const DEFAULT_WORKSPACE_BOTTOM_RATIO =
  0.015;

function clampRatio(
  value: number,
  minimum: number,
  maximum: number
): number {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}

function roundCoordinate(
  value: number
): number {
  return (
    Math.round(value * 1000) /
    1000
  );
}

function loadHtmlImage(
  sourceUrl: string
): Promise<HTMLImageElement> {
  return new Promise(
    (resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        resolve(image);
      };

      image.onerror = () => {
        reject(
          new Error(
            "The pattern image could not be loaded for AI boundary detection."
          )
        );
      };

      /*
       * Blob URLs and data URLs do not need CORS.
       * HTTP images may require cross-origin access
       * before their pixels can be read by canvas.
       */
      if (
        sourceUrl.startsWith(
          "http://"
        ) ||
        sourceUrl.startsWith(
          "https://"
        )
      ) {
        image.crossOrigin =
          "anonymous";
      }

      image.src = sourceUrl;
    }
  );
}

function calculateAnalysisDimensions(
  width: number,
  height: number,
  maximumDimension: number
): {
  width: number;
  height: number;
} {
  if (
    width <= maximumDimension &&
    height <= maximumDimension
  ) {
    return {
      width,
      height,
    };
  }

  const longestDimension =
    Math.max(width, height);

  const scale =
    maximumDimension /
    longestDimension;

  return {
    width: Math.max(
      1,
      Math.round(width * scale)
    ),

    height: Math.max(
      1,
      Math.round(height * scale)
    ),
  };
}

function calculateWorkspaceRectangle({
  imageWidth,
  imageHeight,
  isolatePatternWorkspace,
  leftRatio,
  topRatio,
  rightRatio,
  bottomRatio,
}: {
  imageWidth: number;
  imageHeight: number;

  isolatePatternWorkspace: boolean;

  leftRatio: number;
  topRatio: number;
  rightRatio: number;
  bottomRatio: number;
}): WorkspaceRectangle {
  if (!isolatePatternWorkspace) {
    return {
      x: 0,
      y: 0,

      width: imageWidth,
      height: imageHeight,
    };
  }

  const safeLeftRatio =
    clampRatio(
      leftRatio,
      0,
      0.7
    );

  const safeTopRatio =
    clampRatio(
      topRatio,
      0,
      0.15
    );

  const safeRightRatio =
    clampRatio(
      rightRatio,
      0,
      0.15
    );

  const safeBottomRatio =
    clampRatio(
      bottomRatio,
      0,
      0.15
    );

  const x =
    Math.round(
      imageWidth *
        safeLeftRatio
    );

  const y =
    Math.round(
      imageHeight *
        safeTopRatio
    );

  const rightMargin =
    Math.round(
      imageWidth *
        safeRightRatio
    );

  const bottomMargin =
    Math.round(
      imageHeight *
        safeBottomRatio
    );

  const width =
    Math.max(
      1,
      imageWidth -
        x -
        rightMargin
    );

  const height =
    Math.max(
      1,
      imageHeight -
        y -
        bottomMargin
    );

  return {
    x,
    y,
    width,
    height,
  };
}

function createWorkspaceCanvas({
  image,
  workspace,
  analysisWidth,
  analysisHeight,
}: {
  image: HTMLImageElement;

  workspace: WorkspaceRectangle;

  analysisWidth: number;
  analysisHeight: number;
}): HTMLCanvasElement {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    analysisWidth;

  canvas.height =
    analysisHeight;

  const context =
    canvas.getContext(
      "2d",
      {
        willReadFrequently:
          true,
      }
    );

  if (!context) {
    throw new Error(
      "The browser could not create an image-analysis canvas."
    );
  }

  /*
   * Transparent areas must be interpreted as
   * white background rather than dark pixels.
   */
  context.fillStyle =
    "#ffffff";

  context.fillRect(
    0,
    0,
    analysisWidth,
    analysisHeight
  );

  /*
   * Crop the original sheet to the pattern workspace
   * and resize that workspace for image analysis.
   */
  context.drawImage(
    image,

    workspace.x,
    workspace.y,
    workspace.width,
    workspace.height,

    0,
    0,
    analysisWidth,
    analysisHeight
  );

  return canvas;
}

function extractCanvasImageData(
  canvas: HTMLCanvasElement
): ImageData {
  const context =
    canvas.getContext(
      "2d",
      {
        willReadFrequently:
          true,
      }
    );

  if (!context) {
    throw new Error(
      "The browser could not read the image-analysis canvas."
    );
  }

  try {
    return context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
  } catch (error) {
    console.error(
      "Unable to extract pattern image pixels:",
      error
    );

    throw new Error(
      "The image pixels could not be inspected. This may be caused by cross-origin image restrictions."
    );
  }
}

function remapDetectionToOriginalImage({
  result,
  workspace,
  scaleX,
  scaleY,
}: {
  result:
    BoundaryDetectionResult;

  workspace:
    WorkspaceRectangle;

  scaleX: number;
  scaleY: number;
}): BoundaryDetectionResult {
  const vertices =
    result.vertices.map(
      (point) => ({
        x: roundCoordinate(
          workspace.x +
            point.x *
              scaleX
        ),

        y: roundCoordinate(
          workspace.y +
            point.y *
              scaleY
        ),
      })
    );

  return {
    ...result,

    vertices,

    vertexCount:
      vertices.length,
  };
}

export async function analysePatternImageBoundary(
  input: BoundaryImageAnalysisInput
): Promise<BoundaryImageAnalysisResult> {
  if (!input.sourceUrl) {
    throw new Error(
      "Load a pattern image before running AI boundary detection."
    );
  }

  const image =
    await loadHtmlImage(
      input.sourceUrl
    );

  const originalImageWidth =
    input.imageWidth ??
    image.naturalWidth;

  const originalImageHeight =
    input.imageHeight ??
    image.naturalHeight;

  if (
    originalImageWidth <= 0 ||
    originalImageHeight <= 0
  ) {
    throw new Error(
      "The pattern image dimensions are invalid."
    );
  }

  const isolatePatternWorkspace =
    input
      .isolatePatternWorkspace ??
    true;

  const workspace =
    calculateWorkspaceRectangle({
      imageWidth:
        originalImageWidth,

      imageHeight:
        originalImageHeight,

      isolatePatternWorkspace,

      leftRatio:
        input
          .workspaceLeftRatio ??
        DEFAULT_WORKSPACE_LEFT_RATIO,

      topRatio:
        input
          .workspaceTopRatio ??
        DEFAULT_WORKSPACE_TOP_RATIO,

      rightRatio:
        input
          .workspaceRightRatio ??
        DEFAULT_WORKSPACE_RIGHT_RATIO,

      bottomRatio:
        input
          .workspaceBottomRatio ??
        DEFAULT_WORKSPACE_BOTTOM_RATIO,
    });

  if (
    workspace.width < 50 ||
    workspace.height < 50
  ) {
    throw new Error(
      "The calculated pattern workspace is too small for boundary analysis."
    );
  }

  const maximumAnalysisDimension =
    Math.max(
      500,
      input
        .maximumAnalysisDimension ??
        DEFAULT_MAXIMUM_ANALYSIS_DIMENSION
    );

  const analysisDimensions =
    calculateAnalysisDimensions(
      workspace.width,
      workspace.height,
      maximumAnalysisDimension
    );

  const canvas =
    createWorkspaceCanvas({
      image,

      workspace,

      analysisWidth:
        analysisDimensions.width,

      analysisHeight:
        analysisDimensions.height,
    });

  const imageData =
    extractCanvasImageData(
      canvas
    );

  const engineInput:
    BoundaryDetectionEngineInput = {
      image: {
        imageWidth:
          analysisDimensions.width,

        imageHeight:
          analysisDimensions.height,

        sourceUrl:
          input.sourceUrl,

        fileName:
          input.fileName,

        backgroundExpected:
          input
            .backgroundExpected ??
          "light",
      },

      imageData,
    };

  const analysisDetection =
    detectPatternBoundary(
      engineInput
    );

  /*
   * Converts analysed-workspace coordinates back to
   * coordinates on the complete original image.
   */
  const scaleX =
    workspace.width /
    analysisDimensions.width;

  const scaleY =
    workspace.height /
    analysisDimensions.height;

  const detection =
    remapDetectionToOriginalImage({
      result:
        analysisDetection,

      workspace,

      scaleX,
      scaleY,
    });

  return {
    detection,

    analysedImageWidth:
      analysisDimensions.width,

    analysedImageHeight:
      analysisDimensions.height,

    originalImageWidth,
    originalImageHeight,

    scaleX,
    scaleY,

    workspaceIsolated:
      isolatePatternWorkspace,

    workspaceOriginalX:
      workspace.x,

    workspaceOriginalY:
      workspace.y,

    workspaceOriginalWidth:
      workspace.width,

    workspaceOriginalHeight:
      workspace.height,
  };
}

export const aiBoundaryImageAdapter = {
  analysePatternImageBoundary,
};

export default aiBoundaryImageAdapter;