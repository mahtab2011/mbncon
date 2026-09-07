import {
  BoundaryDetectionEngineInput,
  BoundaryDetectionMethod,
  BoundaryDetectionQuality,
  BoundaryDetectionResult,
  BoundaryDetectionSettings,
  BoundaryDetectionWarning,
  DEFAULT_BOUNDARY_DETECTION_SETTINGS,
} from "@/lib/optifabric/aiBoundaryDetectionTypes";

import {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

interface BinaryMask {
  width: number;
  height: number;
  values: Uint8Array;
}

interface PixelStatistics {
  averageBrightness: number;
  minimumBrightness: number;
  maximumBrightness: number;
  brightnessRange: number;
}

interface BoundingRegion {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  area: number;
}

interface ForegroundMaskResult {
  mask: BinaryMask;
  /*
   * Mean absolute brightness distance between classified foreground pixels
   * and the estimated background colour, normalised to 0..1. This is a real
   * contrast measurement, not a proxy for component size.
   */
  separation: number;
}

interface ConnectedRegionResult {
  mask: BinaryMask;
  region: BoundingRegion;
  pixelCount: number;
  score: number;
  touchesImageEdge: boolean;
}

interface ContourTraceResult {
  points: GeometryPoint[];
  closed: boolean;
  /*
   * Proportion of the silhouette's true boundary pixels that the trace
   * actually walked. A partial walk (step-limit reached, or a boundary split
   * across a one-pixel bridge) produces a value well below 1.
   */
  boundaryCoverageRatio: number;
}

interface PatternWorkspace {
  startX: number;
  width: number;
}

const EPSILON = 0.000001;

/*
 * RC5-004 INTEGRATED WORKSPACE
 *
 * aiBoundaryImageAdapter.ts already isolates the pattern workspace and maps
 * detected vertices back to the complete original image. The engine must
 * therefore analyse the full pixel buffer supplied by the adapter. Keeping
 * this ratio at zero prevents a second crop from removing valid geometry.
 */
const DEMONSTRATION_WORKSPACE_START_RATIO = 0;

/*
 * A true binary closing operation bridges small anti-aliased or dashed gaps.
 * Radius 2 is conservative enough for the current demonstration images while
 * avoiding large mergers between unrelated printed elements.
 */
const MORPHOLOGY_RADIUS = 2;
const MORPHOLOGY_PASSES = 2;

/*
 * RC4-012B CONFIDENCE CALIBRATION
 *
 * Previously the four quality terms could not jointly reach the review
 * threshold, so every result was forced to "requires-review" regardless of
 * how good the trace was. Each term below is now independently reachable at
 * or near 1.0 for a well-detected garment piece, and the threshold reflects
 * the point at which an engineer would normally accept the polygon.
 */
const REVIEW_CONFIDENCE_THRESHOLD = 0.82;

/*
 * A garment piece photographed or scanned with normal margins occupies
 * roughly a third of the working area. Coverage is scored against this
 * expectation rather than against 100% of the sheet.
 */
const EXPECTED_COVERAGE_RATIO = 0.32;
const COVERAGE_PLATEAU_LOWER = 0.12;
const COVERAGE_PLATEAU_UPPER = 0.78;

const EIGHT_NEIGHBOURS: ReadonlyArray<readonly [number, number]> = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
];

const FOUR_NEIGHBOURS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

function roundValue(
  value: number,
  decimals = 4
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

function mergeSettings(
  settings?: Partial<BoundaryDetectionSettings>
): BoundaryDetectionSettings {
  return {
    ...DEFAULT_BOUNDARY_DETECTION_SETTINGS,
    ...settings,
  };
}

function getPatternWorkspace(
  imageWidth: number
): PatternWorkspace {
  const startX = clampValue(
    Math.round(
      imageWidth *
      DEMONSTRATION_WORKSPACE_START_RATIO
    ),
    0,
    Math.max(0, imageWidth - 1)
  );

  return {
    startX,
    width: Math.max(1, imageWidth - startX),
  };
}

function calculateBrightness(
  red: number,
  green: number,
  blue: number
): number {
  return (
    red * 0.299 +
    green * 0.587 +
    blue * 0.114
  );
}

function calculateColourDistance(
  red: number,
  green: number,
  blue: number,
  backgroundRed: number,
  backgroundGreen: number,
  backgroundBlue: number
): number {
  const redDifference = red - backgroundRed;
  const greenDifference = green - backgroundGreen;
  const blueDifference = blue - backgroundBlue;

  return Math.sqrt(
    redDifference ** 2 +
    greenDifference ** 2 +
    blueDifference ** 2
  );
}

/*
 * Contrast statistics are measured over the pattern workspace only. Including
 * the reserved title/ruler panel would let unrelated printed furniture drive
 * the LOW_CONTRAST warning.
 */
function analysePixelStatistics(
  imageData: ImageData,
  workspace: PatternWorkspace
): PixelStatistics {
  const {
    width,
    height,
    data,
  } = imageData;

  let totalBrightness = 0;
  let minimumBrightness = 255;
  let maximumBrightness = 0;
  let pixelCount = 0;

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    for (
      let x = workspace.startX;
      x < width;
      x += 1
    ) {
      const dataIndex = (y * width + x) * 4;

      const brightness =
        calculateBrightness(
          data[dataIndex],
          data[dataIndex + 1],
          data[dataIndex + 2]
        );

      totalBrightness += brightness;
      pixelCount += 1;

      minimumBrightness = Math.min(
        minimumBrightness,
        brightness
      );

      maximumBrightness = Math.max(
        maximumBrightness,
        brightness
      );
    }
  }

  if (pixelCount === 0) {
    return {
      averageBrightness: 0,
      minimumBrightness: 0,
      maximumBrightness: 0,
      brightnessRange: 0,
    };
  }

  return {
    averageBrightness:
      totalBrightness / pixelCount,
    minimumBrightness,
    maximumBrightness,
    brightnessRange:
      maximumBrightness -
      minimumBrightness,
  };
}

function estimateWorkspaceBackgroundColour(
  imageData: ImageData,
  workspace: PatternWorkspace
): {
  red: number;
  green: number;
  blue: number;
  brightness: number;
} {
  const {
    width,
    height,
    data,
  } = imageData;

  const sampleSize = Math.max(
    2,
    Math.round(
      Math.min(workspace.width, height) *
      0.035
    )
  );

  let redTotal = 0;
  let greenTotal = 0;
  let blueTotal = 0;
  let count = 0;

  const addPixel = (
    x: number,
    y: number
  ) => {
    const safeX = clampValue(
      Math.round(x),
      workspace.startX,
      width - 1
    );

    const safeY = clampValue(
      Math.round(y),
      0,
      height - 1
    );

    const index =
      (safeY * width + safeX) * 4;

    redTotal += data[index];
    greenTotal += data[index + 1];
    blueTotal += data[index + 2];
    count += 1;
  };

  for (
    let offsetY = 0;
    offsetY < sampleSize;
    offsetY += 1
  ) {
    for (
      let offsetX = 0;
      offsetX < sampleSize;
      offsetX += 1
    ) {
      addPixel(
        workspace.startX + offsetX,
        offsetY
      );

      addPixel(
        width - 1 - offsetX,
        offsetY
      );

      addPixel(
        workspace.startX + offsetX,
        height - 1 - offsetY
      );

      addPixel(
        width - 1 - offsetX,
        height - 1 - offsetY
      );
    }
  }

  const divisor = Math.max(1, count);
  const red = redTotal / divisor;
  const green = greenTotal / divisor;
  const blue = blueTotal / divisor;

  return {
    red,
    green,
    blue,
    brightness:
      calculateBrightness(
        red,
        green,
        blue
      ),
  };
}

function createForegroundMask(
  imageData: ImageData,
  settings: BoundaryDetectionSettings,
  workspace: PatternWorkspace
): ForegroundMaskResult {
  const {
    width,
    height,
    data,
  } = imageData;

  const values =
    new Uint8Array(width * height);

  const background =
    estimateWorkspaceBackgroundColour(
      imageData,
      workspace
    );

  const colourThreshold = Math.max(
    settings.contrastThreshold * 1.5,
    22
  );

  let foregroundCount = 0;
  let foregroundDistanceTotal = 0;

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    for (
      let x = 0;
      x < width;
      x += 1
    ) {
      const pixelIndex = y * width + x;

      if (x < workspace.startX) {
        values[pixelIndex] = 0;
        continue;
      }

      const dataIndex = pixelIndex * 4;
      const alpha = data[dataIndex + 3];

      if (alpha < 20) {
        values[pixelIndex] = 0;
        continue;
      }

      const red = data[dataIndex];
      const green = data[dataIndex + 1];
      const blue = data[dataIndex + 2];

      const brightness =
        calculateBrightness(
          red,
          green,
          blue
        );

      const brightnessDifference =
        Math.abs(
          brightness -
          background.brightness
        );

      const colourDistance =
        calculateColourDistance(
          red,
          green,
          blue,
          background.red,
          background.green,
          background.blue
        );

      const isForeground =
        brightnessDifference >=
          settings.contrastThreshold ||
        colourDistance >=
          colourThreshold;

      values[pixelIndex] =
        isForeground ? 1 : 0;

      if (isForeground) {
        foregroundCount += 1;
        foregroundDistanceTotal +=
          brightnessDifference;
      }
    }
  }

  /*
   * Normalised against a 128-level brightness gap, which represents a clean
   * dark-line-on-light-paper separation. Values above that saturate at 1.
   */
  const separation =
    foregroundCount > 0
      ? clampValue(
          foregroundDistanceTotal /
            foregroundCount /
            128,
          0,
          1
        )
      : 0;

  return {
    mask: {
      width,
      height,
      values,
    },
    separation,
  };
}

function removeIsolatedPixels(
  mask: BinaryMask
): BinaryMask {
  const {
    width,
    height,
    values,
  } = mask;

  const cleaned =
    new Uint8Array(values);

  for (
    let y = 1;
    y < height - 1;
    y += 1
  ) {
    for (
      let x = 1;
      x < width - 1;
      x += 1
    ) {
      const index = y * width + x;

      if (!values[index]) {
        continue;
      }

      let neighbours = 0;

      for (
        const [offsetX, offsetY]
        of EIGHT_NEIGHBOURS
      ) {
        neighbours +=
          values[
            (y + offsetY) * width +
            (x + offsetX)
          ];
      }

      if (neighbours <= 1) {
        cleaned[index] = 0;
      }
    }
  }

  return {
    width,
    height,
    values: cleaned,
  };
}

/*
 * RC4-012B SEPARABLE MORPHOLOGY
 *
 * A square structuring element is separable, so a horizontal pass followed by
 * a vertical pass gives an identical result at O(w * h * r) instead of
 * O(w * h * r^2). On a 3000 x 2000 scan with radius 2 this is the difference
 * between roughly 600M and 120M operations across the closing passes.
 */
function dilateHorizontal(
  mask: BinaryMask,
  radius: number
): BinaryMask {
  const {
    width,
    height,
    values,
  } = mask;

  const result =
    new Uint8Array(width * height);

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    const rowOffset = y * width;

    for (
      let x = 0;
      x < width;
      x += 1
    ) {
      const start = Math.max(
        0,
        x - radius
      );

      const end = Math.min(
        width - 1,
        x + radius
      );

      let found = 0;

      for (
        let sampleX = start;
        sampleX <= end;
        sampleX += 1
      ) {
        if (values[rowOffset + sampleX]) {
          found = 1;
          break;
        }
      }

      result[rowOffset + x] = found;
    }
  }

  return {
    width,
    height,
    values: result,
  };
}

function dilateVertical(
  mask: BinaryMask,
  radius: number
): BinaryMask {
  const {
    width,
    height,
    values,
  } = mask;

  const result =
    new Uint8Array(width * height);

  for (
    let x = 0;
    x < width;
    x += 1
  ) {
    for (
      let y = 0;
      y < height;
      y += 1
    ) {
      const start = Math.max(
        0,
        y - radius
      );

      const end = Math.min(
        height - 1,
        y + radius
      );

      let found = 0;

      for (
        let sampleY = start;
        sampleY <= end;
        sampleY += 1
      ) {
        if (values[sampleY * width + x]) {
          found = 1;
          break;
        }
      }

      result[y * width + x] = found;
    }
  }

  return {
    width,
    height,
    values: result,
  };
}

/*
 * Out-of-bounds is treated as background, matching the original behaviour, so
 * erosion clears a border band of the structuring-element radius.
 */
function erodeHorizontal(
  mask: BinaryMask,
  radius: number
): BinaryMask {
  const {
    width,
    height,
    values,
  } = mask;

  const result =
    new Uint8Array(width * height);

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    const rowOffset = y * width;

    for (
      let x = 0;
      x < width;
      x += 1
    ) {
      if (
        x - radius < 0 ||
        x + radius > width - 1
      ) {
        result[rowOffset + x] = 0;
        continue;
      }

      let all = 1;

      for (
        let sampleX = x - radius;
        sampleX <= x + radius;
        sampleX += 1
      ) {
        if (!values[rowOffset + sampleX]) {
          all = 0;
          break;
        }
      }

      result[rowOffset + x] = all;
    }
  }

  return {
    width,
    height,
    values: result,
  };
}

function erodeVertical(
  mask: BinaryMask,
  radius: number
): BinaryMask {
  const {
    width,
    height,
    values,
  } = mask;

  const result =
    new Uint8Array(width * height);

  for (
    let x = 0;
    x < width;
    x += 1
  ) {
    for (
      let y = 0;
      y < height;
      y += 1
    ) {
      if (
        y - radius < 0 ||
        y + radius > height - 1
      ) {
        result[y * width + x] = 0;
        continue;
      }

      let all = 1;

      for (
        let sampleY = y - radius;
        sampleY <= y + radius;
        sampleY += 1
      ) {
        if (!values[sampleY * width + x]) {
          all = 0;
          break;
        }
      }

      result[y * width + x] = all;
    }
  }

  return {
    width,
    height,
    values: result,
  };
}

function dilateMask(
  mask: BinaryMask,
  radius: number
): BinaryMask {
  const safeRadius = Math.max(
    1,
    Math.round(radius)
  );

  return dilateVertical(
    dilateHorizontal(mask, safeRadius),
    safeRadius
  );
}

function erodeMask(
  mask: BinaryMask,
  radius: number
): BinaryMask {
  const safeRadius = Math.max(
    1,
    Math.round(radius)
  );

  return erodeVertical(
    erodeHorizontal(mask, safeRadius),
    safeRadius
  );
}

function closeSmallMaskGaps(
  mask: BinaryMask,
  radius = MORPHOLOGY_RADIUS,
  passes = MORPHOLOGY_PASSES
): BinaryMask {
  let result = mask;

  for (
    let pass = 0;
    pass < Math.max(1, passes);
    pass += 1
  ) {
    result = erodeMask(
      dilateMask(result, radius),
      radius
    );
  }

  return result;
}

function calculateComponentBorderOccupancy(
  componentIndexes: number[],
  width: number,
  region: BoundingRegion
): number {
  let borderPixels = 0;

  for (const index of componentIndexes) {
    const x = index % width;
    const y = Math.floor(index / width);

    if (
      x === region.minX ||
      x === region.maxX ||
      y === region.minY ||
      y === region.maxY
    ) {
      borderPixels += 1;
    }
  }

  const approximatePerimeter = Math.max(
    1,
    2 * (region.width + region.height) - 4
  );

  return clampValue(
    borderPixels / approximatePerimeter,
    0,
    1
  );
}

function findBestConnectedRegion(
  mask: BinaryMask,
  workspace: PatternWorkspace
): ConnectedRegionResult | null {
  const {
    width,
    height,
    values,
  } = mask;

  const visited =
    new Uint8Array(width * height);

  const edgeMargin = Math.max(
    2,
    Math.round(
      Math.min(width, height) * 0.006
    )
  );

  const workspaceArea = Math.max(
    1,
    workspace.width * height
  );

  let bestResult:
    | ConnectedRegionResult
    | null = null;

  for (
    let startY = 0;
    startY < height;
    startY += 1
  ) {
    for (
      let startX = workspace.startX;
      startX < width;
      startX += 1
    ) {
      const startIndex =
        startY * width + startX;

      if (
        !values[startIndex] ||
        visited[startIndex]
      ) {
        continue;
      }

      const queue: number[] = [startIndex];
      const componentIndexes: number[] = [];
      visited[startIndex] = 1;

      let queuePosition = 0;
      let minX = startX;
      let minY = startY;
      let maxX = startX;
      let maxY = startY;
      let touchesImageEdge = false;

      while (queuePosition < queue.length) {
        const currentIndex =
          queue[queuePosition];
        queuePosition += 1;

        componentIndexes.push(currentIndex);

        const currentX =
          currentIndex % width;
        const currentY =
          Math.floor(currentIndex / width);

        minX = Math.min(minX, currentX);
        minY = Math.min(minY, currentY);
        maxX = Math.max(maxX, currentX);
        maxY = Math.max(maxY, currentY);

        if (
          currentX <= edgeMargin ||
          currentY <= edgeMargin ||
          currentX >= width - 1 - edgeMargin ||
          currentY >= height - 1 - edgeMargin
        ) {
          touchesImageEdge = true;
        }

        for (
          const [offsetX, offsetY]
          of EIGHT_NEIGHBOURS
        ) {
          const neighbourX =
            currentX + offsetX;
          const neighbourY =
            currentY + offsetY;

          if (
            neighbourX < workspace.startX ||
            neighbourY < 0 ||
            neighbourX >= width ||
            neighbourY >= height
          ) {
            continue;
          }

          const neighbourIndex =
            neighbourY * width + neighbourX;

          if (
            !values[neighbourIndex] ||
            visited[neighbourIndex]
          ) {
            continue;
          }

          visited[neighbourIndex] = 1;
          queue.push(neighbourIndex);
        }
      }

      const componentWidth =
        maxX - minX + 1;
      const componentHeight =
        maxY - minY + 1;
      const boundingArea =
        componentWidth * componentHeight;
      const pixelCount =
        componentIndexes.length;

      const region: BoundingRegion = {
        minX,
        minY,
        maxX,
        maxY,
        width: componentWidth,
        height: componentHeight,
        area: pixelCount,
      };

      const widthRatio =
        componentWidth / workspace.width;
      const heightRatio =
        componentHeight / height;
      const areaRatio =
        boundingArea / workspaceArea;
      const density =
        pixelCount / Math.max(1, boundingArea);
      const aspectRatio =
        componentWidth /
        Math.max(1, componentHeight);

      const centreX =
        minX + componentWidth / 2;
      const centreY =
        minY + componentHeight / 2;

      const workspaceCentreX =
        workspace.startX +
        workspace.width / 2;
      const imageCentreY = height / 2;

      const centreDistance = Math.sqrt(
        ((centreX - workspaceCentreX) /
          workspace.width) ** 2 +
        ((centreY - imageCentreY) /
          height) ** 2
      );

      const borderOccupancy =
        calculateComponentBorderOccupancy(
          componentIndexes,
          width,
          region
        );

      const pageLikeRectangle =
        borderOccupancy > 0.72 &&
        widthRatio > 0.82 &&
        heightRatio > 0.82;

      /*
       * RC4-012B RELAXED SHAPE GATE
       *
       * The previous gate (aspect 0.12..2.2, height ratio > 0.22) silently
       * discarded waistbands, cuffs, collars, plackets, pocket facings and
       * any piece laid out horizontally. The gate now only rejects shapes
       * that cannot plausibly be a pattern piece at all.
       */
      const implausiblyThin =
        widthRatio < 0.05 ||
        heightRatio < 0.05 ||
        aspectRatio < 0.06 ||
        aspectRatio > 16;

      const tooSmall =
        pixelCount < 40 ||
        areaRatio < 0.012;

      if (
        pageLikeRectangle ||
        implausiblyThin ||
        tooSmall
      ) {
        continue;
      }

      const sizeScore =
        clampValue(areaRatio / 0.42, 0, 1);

      const centreScore =
        1 - clampValue(centreDistance / 0.75, 0, 1);

      const densityScore =
        1 - clampValue(
          Math.abs(density - 0.12) / 0.3,
          0,
          1
        );

      /*
       * Shape is scored on plausibility rather than similarity to a bodice.
       * Extreme elongation is mildly penalised; everything between a narrow
       * band and a square scores flat.
       */
      const shapeScore =
        aspectRatio >= 0.2 && aspectRatio <= 5
          ? 1
          : 1 - clampValue(
              aspectRatio < 0.2
                ? (0.2 - aspectRatio) / 0.2
                : (aspectRatio - 5) / 11,
              0,
              1
            );

      const edgePenalty =
        touchesImageEdge ? 0.45 : 0;

      const rectanglePenalty =
        borderOccupancy > 0.55
          ? (borderOccupancy - 0.55) * 1.8
          : 0;

      const score =
        sizeScore * 0.42 +
        centreScore * 0.22 +
        densityScore * 0.16 +
        shapeScore * 0.2 -
        edgePenalty -
        rectanglePenalty;

      if (
        bestResult &&
        score <= bestResult.score
      ) {
        continue;
      }

      const componentValues =
        new Uint8Array(width * height);

      for (const index of componentIndexes) {
        componentValues[index] = 1;
      }

      bestResult = {
        mask: {
          width,
          height,
          values: componentValues,
        },
        region,
        pixelCount,
        score,
        touchesImageEdge,
      };
    }
  }

  return bestResult;
}

/*
 * RC4-012B INTERIOR FILL
 *
 * Convert the selected closed outline into a solid silhouette. Background
 * pixels reachable from outside the component remain background; enclosed
 * pixels become foreground. Internal seam lines, grain lines and text
 * therefore do not create separate contours in the final polygon.
 *
 * FIX: the flood is seeded from a guaranteed-empty one-pixel frame around a
 * padded copy of the region. Previously the seed ring was clamped to the
 * image bounds, so a component touching the image edge could have foreground
 * pixels sitting on the seed ring itself. Those seeds were skipped, the flood
 * could not reach around them, and genuine background was misclassified as
 * enclosed and filled solid.
 */
function fillEnclosedInterior(
  componentMask: BinaryMask,
  region: BoundingRegion
): BinaryMask {
  const {
    width,
    height,
    values,
  } = componentMask;

  /*
   * Work in a local buffer that is two pixels larger than the region on every
   * side. The outermost ring of this buffer is always empty by construction,
   * whatever the component does at the image edge.
   */
  const padding = 2;

  const localMinX = region.minX - padding;
  const localMinY = region.minY - padding;
  const localWidth =
    region.width + padding * 2;
  const localHeight =
    region.height + padding * 2;

  const local =
    new Uint8Array(localWidth * localHeight);

  for (
    let localY = 0;
    localY < localHeight;
    localY += 1
  ) {
    const sourceY = localMinY + localY;

    if (
      sourceY < 0 ||
      sourceY >= height
    ) {
      continue;
    }

    for (
      let localX = 0;
      localX < localWidth;
      localX += 1
    ) {
      const sourceX = localMinX + localX;

      if (
        sourceX < 0 ||
        sourceX >= width
      ) {
        continue;
      }

      local[localY * localWidth + localX] =
        values[sourceY * width + sourceX];
    }
  }

  const outside =
    new Uint8Array(localWidth * localHeight);

  const queue: number[] = [];

  const enqueueBackground = (
    localX: number,
    localY: number
  ) => {
    const index =
      localY * localWidth + localX;

    if (
      local[index] ||
      outside[index]
    ) {
      return;
    }

    outside[index] = 1;
    queue.push(index);
  };

  for (
    let localX = 0;
    localX < localWidth;
    localX += 1
  ) {
    enqueueBackground(localX, 0);
    enqueueBackground(
      localX,
      localHeight - 1
    );
  }

  for (
    let localY = 0;
    localY < localHeight;
    localY += 1
  ) {
    enqueueBackground(0, localY);
    enqueueBackground(
      localWidth - 1,
      localY
    );
  }

  let queuePosition = 0;

  while (queuePosition < queue.length) {
    const currentIndex = queue[queuePosition];
    queuePosition += 1;

    const currentX =
      currentIndex % localWidth;
    const currentY =
      Math.floor(currentIndex / localWidth);

    for (
      const [offsetX, offsetY]
      of FOUR_NEIGHBOURS
    ) {
      const neighbourX = currentX + offsetX;
      const neighbourY = currentY + offsetY;

      if (
        neighbourX < 0 ||
        neighbourY < 0 ||
        neighbourX >= localWidth ||
        neighbourY >= localHeight
      ) {
        continue;
      }

      enqueueBackground(
        neighbourX,
        neighbourY
      );
    }
  }

  const filled = new Uint8Array(values);

  for (
    let localY = 0;
    localY < localHeight;
    localY += 1
  ) {
    const targetY = localMinY + localY;

    if (
      targetY < 0 ||
      targetY >= height
    ) {
      continue;
    }

    for (
      let localX = 0;
      localX < localWidth;
      localX += 1
    ) {
      const targetX = localMinX + localX;

      if (
        targetX < 0 ||
        targetX >= width
      ) {
        continue;
      }

      const localIndex =
        localY * localWidth + localX;

      if (
        !local[localIndex] &&
        !outside[localIndex]
      ) {
        filled[targetY * width + targetX] = 1;
      }
    }
  }

  return {
    width,
    height,
    values: filled,
  };
}

function isBoundaryPixel(
  mask: BinaryMask,
  x: number,
  y: number
): boolean {
  const {
    width,
    height,
    values,
  } = mask;

  const index = y * width + x;

  if (!values[index]) {
    return false;
  }

  return FOUR_NEIGHBOURS.some(
    ([offsetX, offsetY]) => {
      const neighbourX = x + offsetX;
      const neighbourY = y + offsetY;

      if (
        neighbourX < 0 ||
        neighbourY < 0 ||
        neighbourX >= width ||
        neighbourY >= height
      ) {
        return true;
      }

      return (
        values[
          neighbourY * width +
          neighbourX
        ] === 0
      );
    }
  );
}

function countBoundaryPixels(
  mask: BinaryMask,
  region: BoundingRegion
): number {
  let count = 0;

  for (
    let y = region.minY;
    y <= region.maxY;
    y += 1
  ) {
    for (
      let x = region.minX;
      x <= region.maxX;
      x += 1
    ) {
      if (isBoundaryPixel(mask, x, y)) {
        count += 1;
      }
    }
  }

  return count;
}

function findContourStart(
  mask: BinaryMask,
  region: BoundingRegion
): GeometryPoint | null {
  for (
    let y = region.minY;
    y <= region.maxY;
    y += 1
  ) {
    for (
      let x = region.minX;
      x <= region.maxX;
      x += 1
    ) {
      if (isBoundaryPixel(mask, x, y)) {
        return { x, y };
      }
    }
  }

  return null;
}

function pointsEqual(
  firstPoint: GeometryPoint,
  secondPoint: GeometryPoint
): boolean {
  return (
    firstPoint.x === secondPoint.x &&
    firstPoint.y === secondPoint.y
  );
}

function neighbourDirectionIndex(
  centre: GeometryPoint,
  neighbour: GeometryPoint
): number {
  const differenceX =
    clampValue(neighbour.x - centre.x, -1, 1);
  const differenceY =
    clampValue(neighbour.y - centre.y, -1, 1);

  return EIGHT_NEIGHBOURS.findIndex(
    ([offsetX, offsetY]) =>
      offsetX === differenceX &&
      offsetY === differenceY
  );
}

/*
 * Moore-neighbour border following with Jacob's stopping criterion. Unlike
 * angular sorting, this preserves the true sequential order around concave
 * areas such as the neckline, shoulder, armhole, side seam and curved hem.
 *
 * The walk now also reports whether it closed properly and what proportion of
 * the silhouette's boundary pixels it actually visited, so edge continuity
 * can be measured rather than assumed.
 */
function traceOuterContour(
  mask: BinaryMask,
  region: BoundingRegion
): ContourTraceResult {
  const start = findContourStart(mask, region);

  if (!start) {
    return {
      points: [],
      closed: false,
      boundaryCoverageRatio: 0,
    };
  }

  const contour: GeometryPoint[] = [];
  const visited = new Set<number>();

  let current = start;
  let backtrack: GeometryPoint = {
    x: start.x - 1,
    y: start.y,
  };

  const firstBacktrack = { ...backtrack };
  const maximumSteps = Math.max(
    100,
    region.width * region.height * 4
  );

  let closed = false;

  for (
    let step = 0;
    step < maximumSteps;
    step += 1
  ) {
    contour.push({ ...current });
    visited.add(
      current.y * mask.width + current.x
    );

    const backtrackDirection =
      neighbourDirectionIndex(
        current,
        backtrack
      );

    const searchStart =
      backtrackDirection >= 0
        ? (backtrackDirection + 1) % 8
        : 0;

    let nextPoint: GeometryPoint | null = null;
    let nextBacktrack: GeometryPoint | null = null;

    for (
      let offset = 0;
      offset < 8;
      offset += 1
    ) {
      const directionIndex =
        (searchStart + offset) % 8;

      const [offsetX, offsetY] =
        EIGHT_NEIGHBOURS[directionIndex];

      const candidate = {
        x: current.x + offsetX,
        y: current.y + offsetY,
      };

      if (
        candidate.x < 0 ||
        candidate.y < 0 ||
        candidate.x >= mask.width ||
        candidate.y >= mask.height
      ) {
        continue;
      }

      if (
        mask.values[
          candidate.y * mask.width +
          candidate.x
        ]
      ) {
        const previousDirectionIndex =
          (directionIndex + 7) % 8;

        const [previousOffsetX, previousOffsetY] =
          EIGHT_NEIGHBOURS[previousDirectionIndex];

        nextPoint = candidate;
        nextBacktrack = {
          x: current.x + previousOffsetX,
          y: current.y + previousOffsetY,
        };
        break;
      }
    }

    if (!nextPoint || !nextBacktrack) {
      break;
    }

    current = nextPoint;
    backtrack = nextBacktrack;

    if (
      contour.length > 2 &&
      pointsEqual(current, start) &&
      pointsEqual(backtrack, firstBacktrack)
    ) {
      closed = true;
      break;
    }
  }

  if (
    contour.length > 1 &&
    pointsEqual(
      contour[0],
      contour[contour.length - 1]
    )
  ) {
    contour.pop();
  }

  const totalBoundaryPixels =
    countBoundaryPixels(mask, region);

  const boundaryCoverageRatio =
    totalBoundaryPixels > 0
      ? clampValue(
          visited.size / totalBoundaryPixels,
          0,
          1
        )
      : 0;

  return {
    points: contour,
    closed,
    boundaryCoverageRatio,
  };
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

function perpendicularDistance(
  point: GeometryPoint,
  lineStart: GeometryPoint,
  lineEnd: GeometryPoint
): number {
  const lineLength =
    distanceBetweenPoints(
      lineStart,
      lineEnd
    );

  if (lineLength < EPSILON) {
    return distanceBetweenPoints(
      point,
      lineStart
    );
  }

  const numerator = Math.abs(
    (lineEnd.y - lineStart.y) * point.x -
    (lineEnd.x - lineStart.x) * point.y +
    lineEnd.x * lineStart.y -
    lineEnd.y * lineStart.x
  );

  return numerator / lineLength;
}

/*
 * RC4-012B INDEX-PRESERVING SIMPLIFICATION
 *
 * Douglas-Peucker now operates on indices into the raw contour and returns
 * indices, so the mapping from simplified vertex back to its position on the
 * original ordered walk is exact.
 *
 * FIX: the previous implementation recovered that mapping afterwards by
 * searching the raw contour for a matching coordinate. Moore tracing revisits
 * the same pixel whenever it passes through a one-pixel-wide bridge, so a
 * coordinate lookup could return the wrong occurrence and the refinement pass
 * would then inject sampled points taken from the wrong part of the outline.
 */
function simplifyOpenIndexRun(
  points: GeometryPoint[],
  indexRun: number[],
  tolerance: number
): number[] {
  if (indexRun.length <= 2) {
    return indexRun;
  }

  const firstPoint =
    points[indexRun[0]];
  const lastPoint =
    points[indexRun[indexRun.length - 1]];

  let maximumDistance = 0;
  let maximumPosition = 0;

  for (
    let position = 1;
    position < indexRun.length - 1;
    position += 1
  ) {
    const distance =
      perpendicularDistance(
        points[indexRun[position]],
        firstPoint,
        lastPoint
      );

    if (distance > maximumDistance) {
      maximumDistance = distance;
      maximumPosition = position;
    }
  }

  if (maximumDistance > tolerance) {
    const firstSection =
      simplifyOpenIndexRun(
        points,
        indexRun.slice(
          0,
          maximumPosition + 1
        ),
        tolerance
      );

    const secondSection =
      simplifyOpenIndexRun(
        points,
        indexRun.slice(maximumPosition),
        tolerance
      );

    return [
      ...firstSection.slice(0, -1),
      ...secondSection,
    ];
  }

  return [
    indexRun[0],
    indexRun[indexRun.length - 1],
  ];
}

function findFarthestPointIndex(
  points: GeometryPoint[],
  originIndex: number
): number {
  let farthestIndex = originIndex;
  let farthestDistance = -1;

  for (
    let index = 0;
    index < points.length;
    index += 1
  ) {
    const distance =
      distanceBetweenPoints(
        points[originIndex],
        points[index]
      );

    if (distance > farthestDistance) {
      farthestDistance = distance;
      farthestIndex = index;
    }
  }

  return farthestIndex;
}

/*
 * Douglas-Peucker is an open-polyline algorithm. A closed contour is split at
 * two far-apart points, each arc is simplified independently, and the two arcs
 * are then recombined. This prevents the contour collapsing around adjacent
 * first/last points.
 */
function simplifyClosedContourIndices(
  points: GeometryPoint[],
  tolerance: number
): number[] {
  const allIndexes = points.map(
    (_, index) => index
  );

  if (points.length <= 8) {
    return allIndexes;
  }

  const firstIndex = 0;
  const secondIndex =
    findFarthestPointIndex(
      points,
      firstIndex
    );

  if (
    secondIndex <= 0 ||
    secondIndex >= points.length
  ) {
    return allIndexes;
  }

  const firstArcIndexes =
    allIndexes.slice(0, secondIndex + 1);

  const secondArcIndexes = [
    ...allIndexes.slice(secondIndex),
    0,
  ];

  const simplifiedFirstArc =
    simplifyOpenIndexRun(
      points,
      firstArcIndexes,
      tolerance
    );

  const simplifiedSecondArc =
    simplifyOpenIndexRun(
      points,
      secondArcIndexes,
      tolerance
    );

  const combined = [
    ...simplifiedFirstArc.slice(0, -1),
    ...simplifiedSecondArc.slice(0, -1),
  ];

  return combined.length >= 3
    ? combined
    : allIndexes;
}

function collectClosedContourArc(
  points: GeometryPoint[],
  startIndex: number,
  endIndex: number
): GeometryPoint[] {
  if (points.length === 0) {
    return [];
  }

  const arc: GeometryPoint[] = [];
  let index = startIndex;
  let safety = 0;

  while (safety <= points.length) {
    arc.push(points[index]);

    if (index === endIndex) {
      break;
    }

    index = (index + 1) % points.length;
    safety += 1;
  }

  return arc;
}

function calculateArcLength(
  points: GeometryPoint[]
): number {
  let length = 0;

  for (
    let index = 1;
    index < points.length;
    index += 1
  ) {
    length += distanceBetweenPoints(
      points[index - 1],
      points[index]
    );
  }

  return length;
}

function calculateMaximumChordDeviation(
  points: GeometryPoint[]
): number {
  if (points.length <= 2) {
    return 0;
  }

  const start = points[0];
  const end = points[points.length - 1];
  let maximumDeviation = 0;

  for (
    let index = 1;
    index < points.length - 1;
    index += 1
  ) {
    maximumDeviation = Math.max(
      maximumDeviation,
      perpendicularDistance(
        points[index],
        start,
        end
      )
    );
  }

  return maximumDeviation;
}

function sampleArcByLength(
  arc: GeometryPoint[],
  targetSpacing: number
): GeometryPoint[] {
  if (arc.length <= 2) {
    return [];
  }

  const arcLength = calculateArcLength(arc);
  const segmentCount = Math.max(
    1,
    Math.ceil(arcLength / targetSpacing)
  );

  if (segmentCount <= 1) {
    return [];
  }

  const targets = Array.from(
    { length: segmentCount - 1 },
    (_, index) =>
      (arcLength * (index + 1)) /
      segmentCount
  );

  const sampled: GeometryPoint[] = [];
  let accumulated = 0;
  let targetIndex = 0;

  for (
    let index = 1;
    index < arc.length &&
    targetIndex < targets.length;
    index += 1
  ) {
    const previous = arc[index - 1];
    const current = arc[index];
    const segmentLength =
      distanceBetweenPoints(
        previous,
        current
      );

    while (
      targetIndex < targets.length &&
      accumulated + segmentLength >=
        targets[targetIndex]
    ) {
      const localDistance =
        targets[targetIndex] - accumulated;

      const ratio =
        segmentLength > EPSILON
          ? localDistance / segmentLength
          : 0;

      sampled.push({
        x:
          previous.x +
          (current.x - previous.x) *
            ratio,
        y:
          previous.y +
          (current.y - previous.y) *
            ratio,
      });

      targetIndex += 1;
    }

    accumulated += segmentLength;
  }

  return sampled;
}

/*
 * RC4-012 adaptive curve refinement.
 *
 * Straight seams remain economical, while neckline, armhole, shoulder and hem
 * arcs receive extra vertices only where the original ordered contour bends
 * materially away from the simplified chord. This preserves CAD-relevant
 * curvature without returning hundreds of noisy image pixels.
 *
 * Refinement is budgeted so the total never exceeds maximumVertexCount, which
 * means the curvature-preserving work is not thrown away by a later decimation
 * pass.
 */
function refineCurvedContourSections(
  rawContour: GeometryPoint[],
  simplifiedIndexes: number[],
  maximumVertexCount: number,
  simplifyTolerance: number
): GeometryPoint[] {
  const simplifiedContour =
    simplifiedIndexes.map(
      (index) => rawContour[index]
    );

  if (
    rawContour.length < 3 ||
    simplifiedContour.length < 3 ||
    simplifiedContour.length >=
      maximumVertexCount
  ) {
    return simplifiedContour;
  }

  const refined: GeometryPoint[] = [];

  const targetSpacing = Math.max(
    8,
    simplifyTolerance * 4
  );

  const curvatureThreshold = Math.max(
    1,
    simplifyTolerance * 0.65
  );

  for (
    let position = 0;
    position < simplifiedIndexes.length;
    position += 1
  ) {
    const currentPoint =
      simplifiedContour[position];

    const nextPosition =
      (position + 1) %
      simplifiedIndexes.length;

    const nextPoint =
      simplifiedContour[nextPosition];

    refined.push(currentPoint);

    const arc = collectClosedContourArc(
      rawContour,
      simplifiedIndexes[position],
      simplifiedIndexes[nextPosition]
    );

    if (arc.length <= 2) {
      continue;
    }

    const chordLength =
      distanceBetweenPoints(
        currentPoint,
        nextPoint
      );

    const arcLength =
      calculateArcLength(arc);

    const maximumDeviation =
      calculateMaximumChordDeviation(arc);

    const bendsMaterially =
      maximumDeviation >=
        curvatureThreshold ||
      (chordLength > EPSILON &&
        arcLength / chordLength >= 1.025);

    if (!bendsMaterially) {
      continue;
    }

    /*
     * Reserve one slot for each simplified vertex still to be emitted, so the
     * budget can never be exhausted by an early curve.
     */
    const remainingCapacity =
      maximumVertexCount -
      refined.length -
      (simplifiedIndexes.length -
        position -
        1);

    if (remainingCapacity <= 0) {
      continue;
    }

    const additions =
      sampleArcByLength(
        arc,
        targetSpacing
      ).slice(0, remainingCapacity);

    refined.push(...additions);
  }

  return refined.length >= 3
    ? refined
    : simplifiedContour;
}

function triangleArea(
  previousPoint: GeometryPoint,
  currentPoint: GeometryPoint,
  nextPoint: GeometryPoint
): number {
  return (
    Math.abs(
      (currentPoint.x - previousPoint.x) *
        (nextPoint.y - previousPoint.y) -
      (nextPoint.x - previousPoint.x) *
        (currentPoint.y - previousPoint.y)
    ) / 2
  );
}

/*
 * RC4-012B CURVATURE-WEIGHTED REDUCTION
 *
 * FIX: the previous reducer used a uniform stride, discarding curvature
 * vertices on the neckline and armhole at exactly the same rate as redundant
 * vertices on a straight side seam, undoing the refinement pass.
 *
 * This is a Visvalingam-Whyatt reduction: repeatedly drop the vertex whose
 * removal changes the enclosed area least. Straight runs collapse first;
 * tight curves survive. Vertex counts here are in the low hundreds, so the
 * simple O(n^2) form is comfortably fast enough.
 */
function reduceVertexCount(
  points: GeometryPoint[],
  maximumVertexCount: number
): GeometryPoint[] {
  if (
    points.length <= maximumVertexCount ||
    maximumVertexCount < 3
  ) {
    return points;
  }

  const working = [...points];

  while (working.length > maximumVertexCount) {
    let smallestArea = Number.POSITIVE_INFINITY;
    let smallestIndex = -1;

    for (
      let index = 0;
      index < working.length;
      index += 1
    ) {
      const previousPoint =
        working[
          (index - 1 + working.length) %
          working.length
        ];

      const nextPoint =
        working[
          (index + 1) % working.length
        ];

      const area = triangleArea(
        previousPoint,
        working[index],
        nextPoint
      );

      if (area < smallestArea) {
        smallestArea = area;
        smallestIndex = index;
      }
    }

    if (smallestIndex < 0) {
      break;
    }

    working.splice(smallestIndex, 1);
  }

  return working;
}

function calculatePolygonArea(
  vertices: GeometryPoint[]
): number {
  if (vertices.length < 3) {
    return 0;
  }

  let doubledArea = 0;

  for (
    let index = 0;
    index < vertices.length;
    index += 1
  ) {
    const currentPoint = vertices[index];
    const nextPoint =
      vertices[
        (index + 1) % vertices.length
      ];

    doubledArea +=
      currentPoint.x * nextPoint.y -
      nextPoint.x * currentPoint.y;
  }

  return Math.abs(doubledArea) / 2;
}

function calculatePolygonPerimeter(
  vertices: GeometryPoint[]
): number {
  if (vertices.length < 2) {
    return 0;
  }

  let perimeter = 0;

  for (
    let index = 0;
    index < vertices.length;
    index += 1
  ) {
    perimeter +=
      distanceBetweenPoints(
        vertices[index],
        vertices[
          (index + 1) % vertices.length
        ]
      );
  }

  return perimeter;
}

function segmentsIntersect(
  firstStart: GeometryPoint,
  firstEnd: GeometryPoint,
  secondStart: GeometryPoint,
  secondEnd: GeometryPoint
): boolean {
  const orientation = (
    a: GeometryPoint,
    b: GeometryPoint,
    c: GeometryPoint
  ): number => {
    const value =
      (b.y - a.y) * (c.x - b.x) -
      (b.x - a.x) * (c.y - b.y);

    if (Math.abs(value) < EPSILON) {
      return 0;
    }

    return value > 0 ? 1 : 2;
  };

  const firstOrientation = orientation(
    firstStart,
    firstEnd,
    secondStart
  );

  const secondOrientation = orientation(
    firstStart,
    firstEnd,
    secondEnd
  );

  const thirdOrientation = orientation(
    secondStart,
    secondEnd,
    firstStart
  );

  const fourthOrientation = orientation(
    secondStart,
    secondEnd,
    firstEnd
  );

  return (
    firstOrientation !== secondOrientation &&
    thirdOrientation !== fourthOrientation
  );
}

/*
 * A pattern outline must be a simple polygon. Any self-intersection means the
 * traced boundary crossed itself, which is a genuine geometry defect rather
 * than a stylistic concern.
 */
function countSelfIntersections(
  vertices: GeometryPoint[]
): number {
  const count = vertices.length;

  if (count < 4) {
    return 0;
  }

  let intersections = 0;

  for (
    let i = 0;
    i < count;
    i += 1
  ) {
    const firstStart = vertices[i];
    const firstEnd =
      vertices[(i + 1) % count];

    for (
      let j = i + 1;
      j < count;
      j += 1
    ) {
      /*
       * Skip adjacent segments and the wrap-around pair, which legitimately
       * share an endpoint.
       */
      if (
        j === i ||
        j === (i + 1) % count ||
        (j + 1) % count === i
      ) {
        continue;
      }

      const secondStart = vertices[j];
      const secondEnd =
        vertices[(j + 1) % count];

      if (
        segmentsIntersect(
          firstStart,
          firstEnd,
          secondStart,
          secondEnd
        )
      ) {
        intersections += 1;
      }
    }
  }

  return intersections;
}

/*
 * RC4-012B MEASURED QUALITY
 *
 * edgeContinuity and polygonSimplicity were previously hardcoded constants
 * selected by vertex count, and foregroundSeparation restated the same
 * bounding-box size that boundaryCoverage already reported. All four terms
 * are now independent measurements:
 *
 *   boundaryCoverage     - reported as the true polygon-to-workspace ratio
 *   edgeContinuity       - did the walk close, and how much of the real
 *                          silhouette boundary did it visit
 *   foregroundSeparation - measured brightness distance between foreground
 *                          and background pixels
 *   polygonSimplicity    - self-intersection count and vertex efficiency
 */
function calculateQuality(
  vertices: GeometryPoint[],
  imageHeight: number,
  workspace: PatternWorkspace,
  foregroundRegion:
    | BoundingRegion
    | null,
  method: BoundaryDetectionMethod,
  trace: ContourTraceResult,
  measuredSeparation: number
): BoundaryDetectionQuality {
  const workspaceArea =
    workspace.width * imageHeight;

  const polygonArea =
    calculatePolygonArea(vertices);

  const boundaryCoverage =
    workspaceArea > 0
      ? clampValue(
          polygonArea / workspaceArea,
          0,
          1
        )
      : 0;

  /*
   * Coverage is scored against a plausible band rather than against the whole
   * sheet, so a normally-margined piece is not permanently penalised.
   */
  const coverageScore =
    boundaryCoverage >= COVERAGE_PLATEAU_LOWER &&
    boundaryCoverage <= COVERAGE_PLATEAU_UPPER
      ? 1
      : boundaryCoverage < COVERAGE_PLATEAU_LOWER
        ? clampValue(
            boundaryCoverage /
              COVERAGE_PLATEAU_LOWER,
            0,
            1
          )
        : clampValue(
            (1 - boundaryCoverage) /
              (1 - COVERAGE_PLATEAU_UPPER),
            0,
            1
          );

  const perimeter =
    calculatePolygonPerimeter(vertices);

  const geometryValid =
    vertices.length >= 3 &&
    polygonArea > 0 &&
    perimeter > 0;

  const edgeContinuity = geometryValid
    ? clampValue(
        (trace.closed ? 0.4 : 0) +
        trace.boundaryCoverageRatio * 0.6,
        0,
        1
      )
    : 0;

  const foregroundSeparation = clampValue(
    measuredSeparation,
    0,
    1
  );

  const selfIntersections =
    countSelfIntersections(vertices);

  /*
   * Vertex efficiency: how much outline length each vertex is carrying. Very
   * dense polygons are noisy, very sparse ones have lost curvature.
   */
  const spacing =
    vertices.length > 0
      ? perimeter / vertices.length
      : 0;

  const spacingScore =
    spacing >= 4 && spacing <= 90
      ? 1
      : spacing < 4
        ? clampValue(spacing / 4, 0, 1)
        : clampValue(
            1 - (spacing - 90) / 200,
            0,
            1
          );

  const polygonSimplicity = geometryValid
    ? clampValue(
        spacingScore *
        (selfIntersections === 0
          ? 1
          : clampValue(
              1 - selfIntersections * 0.25,
              0,
              1
            )),
        0,
        1
      )
    : 0;

  let confidence =
    coverageScore * 0.18 +
    edgeContinuity * 0.34 +
    foregroundSeparation * 0.18 +
    polygonSimplicity * 0.3;

  if (
    method === "fallback-envelope" ||
    vertices.length < 3
  ) {
    confidence = 0;
  }

  confidence = clampValue(
    confidence,
    0,
    1
  );

  return {
    confidence: roundValue(confidence, 4),
    boundaryCoverage:
      roundValue(boundaryCoverage, 4),
    edgeContinuity:
      roundValue(edgeContinuity, 4),
    foregroundSeparation:
      roundValue(foregroundSeparation, 4),
    polygonSimplicity:
      roundValue(polygonSimplicity, 4),
    requiresManualReview:
      confidence < REVIEW_CONFIDENCE_THRESHOLD ||
      selfIntersections > 0 ||
      !trace.closed,
  };
}

function buildWarnings(
  vertices: GeometryPoint[],
  quality: BoundaryDetectionQuality,
  method: BoundaryDetectionMethod,
  statistics?: PixelStatistics
): BoundaryDetectionWarning[] {
  const warnings:
    BoundaryDetectionWarning[] = [];

  if (quality.confidence < 0.7) {
    warnings.push({
      id: "boundary-low-confidence",
      code: "LOW_CONFIDENCE",
      message:
        "Automatic boundary confidence is below the approval threshold.",
      severity: "warning",
    });
  }

  if (
    statistics &&
    statistics.brightnessRange < 30
  ) {
    warnings.push({
      id: "boundary-low-contrast",
      code: "LOW_CONTRAST",
      message:
        "The pattern workspace has limited contrast between the pattern and its background.",
      severity: "warning",
    });
  }

  if (vertices.length < 8) {
    warnings.push({
      id: "boundary-too-few-vertices",
      code: "TOO_FEW_VERTICES",
      message:
        "The detected polygon contains too few points for detailed pattern geometry.",
      severity: "warning",
    });
  }

  if (vertices.length > 120) {
    warnings.push({
      id: "boundary-too-many-vertices",
      code: "TOO_MANY_VERTICES",
      message:
        "The detected polygon contains too many points and should be simplified.",
      severity: "warning",
    });
  }

  if (quality.edgeContinuity < 0.7) {
    warnings.push({
      id: "boundary-edge-gaps",
      code: "EDGE_GAPS",
      message:
        "The real garment contour could not be confirmed as a continuous closed boundary.",
      severity: "warning",
    });
  }

  if (method === "fallback-envelope") {
    warnings.push({
      id: "boundary-fallback-used",
      code: "FALLBACK_BOUNDARY_USED",
      message:
        "Automatic detection did not isolate a valid garment contour. No rectangular substitute geometry was generated.",
      severity: "critical",
    });
  }

  if (quality.requiresManualReview) {
    warnings.push({
      id: "boundary-review-required",
      code: "MANUAL_REVIEW_REQUIRED",
      message:
        "An engineer must review and correct the detected polygon before production use.",
      severity: "warning",
    });
  }

  return warnings;
}

function describeWorkspaceAssumption(): string {
  return (
    "Detection analysed the complete pixel buffer supplied by the image adapter. " +
    "For the current engineering demonstration sheets, the adapter isolates the pattern workspace before analysis and remaps the detected vertices to the original image coordinates."
  );
}

function createExplanation(
  method: BoundaryDetectionMethod,
  quality: BoundaryDetectionQuality,
  vertices: GeometryPoint[]
): string {
  const confidence = Math.round(
    quality.confidence * 100
  );

  if (
    method === "fallback-envelope" ||
    vertices.length < 3
  ) {
    return (
      "The engine could not isolate a trustworthy garment contour. " +
      "For engineering safety, it returned no substitute rectangle. " +
      "Reload a clearer image or use manual tracing before calibration, nesting, consumption or DXF export. " +
      describeWorkspaceAssumption()
    );
  }

  return (
    `The RC4-012 adaptive contour engine isolated the garment component and traced an ordered closed polygon containing ${vertices.length} vertices. ` +
    `The current confidence is ${confidence}%. ` +
    "The polygon remains subject to engineering review before production approval. " +
    describeWorkspaceAssumption()
  );
}

function createFailedResult(
  message: string,
  warningCode:
    | "IMAGE_NOT_AVAILABLE"
    | "FALLBACK_BOUNDARY_USED"
): BoundaryDetectionResult {
  const method: BoundaryDetectionMethod =
    "fallback-envelope";

  const quality: BoundaryDetectionQuality = {
    confidence: 0,
    boundaryCoverage: 0,
    edgeContinuity: 0,
    foregroundSeparation: 0,
    polygonSimplicity: 0,
    requiresManualReview: true,
  };

  return {
    status: "failed",
    method,
    vertices: [],
    closed: false,
    vertexCount: 0,
    quality,
    warnings: [
      {
        id:
          warningCode === "IMAGE_NOT_AVAILABLE"
            ? "boundary-image-unavailable"
            : "boundary-fallback-used",
        code: warningCode,
        message,
        severity: "critical",
      },
      {
        id: "boundary-review-required",
        code: "MANUAL_REVIEW_REQUIRED",
        message:
          "An engineer must review the image and complete manual tracing before production use.",
        severity: "warning",
      },
    ],
    explanation: `${message} ${describeWorkspaceAssumption()}`,
    analysedAt: new Date().toISOString(),
  };
}

export function detectPatternBoundary(
  input: BoundaryDetectionEngineInput
): BoundaryDetectionResult {
  const settings = mergeSettings(
    input.settings
  );

  const {
    imageWidth,
    imageHeight,
  } = input.image;

  if (
    imageWidth <= 0 ||
    imageHeight <= 0
  ) {
    return createFailedResult(
      "Boundary detection could not run because valid image dimensions were unavailable.",
      "IMAGE_NOT_AVAILABLE"
    );
  }

  if (!input.imageData) {
    return createFailedResult(
      "Boundary detection could not run because decoded image pixel data was unavailable.",
      "IMAGE_NOT_AVAILABLE"
    );
  }

  const workspace =
    getPatternWorkspace(imageWidth);

  const statistics =
    analysePixelStatistics(
      input.imageData,
      workspace
    );

  const foregroundResult =
    createForegroundMask(
      input.imageData,
      settings,
      workspace
    );

  let mask = foregroundResult.mask;

  if (settings.removeSmallRegions) {
    mask = removeIsolatedPixels(mask);
  }

  mask = closeSmallMaskGaps(mask);

  const connectedRegion =
    findBestConnectedRegion(
      mask,
      workspace
    );

  if (!connectedRegion) {
    return createFailedResult(
      "The engine could not isolate a garment-sized connected component. No fallback rectangle was created.",
      "FALLBACK_BOUNDARY_USED"
    );
  }

  const filledSilhouette =
    fillEnclosedInterior(
      connectedRegion.mask,
      connectedRegion.region
    );

  const trace = traceOuterContour(
    filledSilhouette,
    connectedRegion.region
  );

  const rawContour = trace.points;

  if (
    rawContour.length <
    settings.minimumVertexCount
  ) {
    return createFailedResult(
      "A garment candidate was found, but its ordered outer contour could not be traced reliably. No fallback rectangle was created.",
      "FALLBACK_BOUNDARY_USED"
    );
  }

  const simplifyTolerance = Math.max(
    0.5,
    settings.simplifyTolerance
  );

  const simplifiedIndexes =
    simplifyClosedContourIndices(
      rawContour,
      simplifyTolerance
    );

  const adaptivelyRefinedContour =
    refineCurvedContourSections(
      rawContour,
      simplifiedIndexes,
      settings.maximumVertexCount,
      simplifyTolerance
    );

  const reducedContour =
    reduceVertexCount(
      adaptivelyRefinedContour,
      settings.maximumVertexCount
    );

  if (
    reducedContour.length <
    settings.minimumVertexCount
  ) {
    return createFailedResult(
      "The detected contour became too small after engineering simplification. No fallback rectangle was created.",
      "FALLBACK_BOUNDARY_USED"
    );
  }

  const vertices = reducedContour.map(
    (point) => ({
      x: roundValue(point.x, 3),
      y: roundValue(point.y, 3),
    })
  );

  const method: BoundaryDetectionMethod =
    "foreground-estimation";

  const quality = calculateQuality(
    vertices,
    imageHeight,
    workspace,
    connectedRegion.region,
    method,
    trace,
    foregroundResult.separation
  );

  const warnings = buildWarnings(
    vertices,
    quality,
    method,
    statistics
  );

  const status =
    quality.requiresManualReview
      ? "requires-review"
      : "detected";

  return {
    status,
    method,
    vertices,
    closed: vertices.length >= 3,
    vertexCount: vertices.length,
    quality,
    warnings,
    explanation: createExplanation(
      method,
      quality,
      vertices
    ),
    analysedAt: new Date().toISOString(),
  };
}

export function calculateBoundaryConfidencePercentage(
  result: BoundaryDetectionResult
): number {
  return Math.round(
    result.quality.confidence * 100
  );
}

export function isBoundaryDetectionUsable(
  result: BoundaryDetectionResult
): boolean {
  return (
    result.method !== "fallback-envelope" &&
    result.closed &&
    result.vertexCount >= 3 &&
    result.status !== "failed" &&
    !result.warnings.some(
      (warning) =>
        warning.severity === "critical"
    )
  );
}

export function requiresBoundaryReview(
  result: BoundaryDetectionResult
): boolean {
  return (
    result.status === "requires-review" ||
    result.quality.requiresManualReview ||
    result.warnings.some(
      (warning) =>
        warning.severity === "critical"
    )
  );
}

export const aiBoundaryDetectionEngine = {
  detectPatternBoundary,
  calculateBoundaryConfidencePercentage,
  isBoundaryDetectionUsable,
  requiresBoundaryReview,
};

export default aiBoundaryDetectionEngine;