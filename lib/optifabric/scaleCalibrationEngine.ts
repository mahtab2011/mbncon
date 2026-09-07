import {
  GeometryPoint,
} from "@/lib/optifabric/patternGeometryTypes";

import {
  PatternScaleCalibration,
} from "@/lib/optifabric/patternTracingTypes";

import {
  analyzeScaleDetection,
  ScaleDetectionResult,
} from "@/lib/optifabric/scaleDetectionEngine";

export type ScaleCalibrationStatus =
  | "detected"
  | "requires-review"
  | "failed";

export interface ScaleCalibrationSettings {
  expectedLengthInches: number;
  searchStartRatioX: number;
  searchEndRatioX: number;
  searchStartRatioY: number;
  searchEndRatioY: number;
  darknessThreshold: number;
  minimumBaselineCoverage: number;
  tickSearchRadiusPixels: number;
  minimumMajorTickSpacingPixels: number;
  minimumConfidence: number;
}

export interface ScaleCalibrationInput {
  imageData: ImageData;
  expectedLengthInches?: number;
  settings?: Partial<ScaleCalibrationSettings>;
}

export interface DetectedScaleLine {
  orientation: "vertical";
  firstPoint: GeometryPoint;
  secondPoint: GeometryPoint;
  measuredPixelLength: number;
  axisCoordinate: number;
  detectedMajorTicks: number[];
}

export interface ScaleCalibrationQuality {
  confidence: number;
  baselineCoverage: number;
  tickRegularity: number;
  endpointStrength: number;
  requiresManualReview: boolean;
}

export interface ScaleCalibrationResult {
  status: ScaleCalibrationStatus;
  calibration: PatternScaleCalibration;
  scaleLine?: DetectedScaleLine;
  quality: ScaleCalibrationQuality;
  warnings: string[];
  explanation: string;
  legacyScaleAssessment: ScaleDetectionResult;
  analysedAt: string;
}

interface SearchRegion {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

interface ColumnCandidate {
  x: number;
  coverage: number;
}

interface TickCandidate {
  y: number;
  strength: number;
}

const DEFAULT_SETTINGS: ScaleCalibrationSettings = {
  expectedLengthInches: 12,
  searchStartRatioX: 0.12,
  searchEndRatioX: 0.42,
  searchStartRatioY: 0.08,
  searchEndRatioY: 0.96,
  darknessThreshold: 105,
  minimumBaselineCoverage: 0.42,
  tickSearchRadiusPixels: 28,
  minimumMajorTickSpacingPixels: 12,
  minimumConfidence: 0.68,
};

function clampValue(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundValue(
  value: number,
  decimals = 4
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

function calculateBrightness(
  red: number,
  green: number,
  blue: number
): number {
  return red * 0.299 + green * 0.587 + blue * 0.114;
}

function mergeSettings(
  settings?: Partial<ScaleCalibrationSettings>,
  expectedLengthInches?: number
): ScaleCalibrationSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    expectedLengthInches:
      expectedLengthInches ??
      settings?.expectedLengthInches ??
      DEFAULT_SETTINGS.expectedLengthInches,
  };
}

function buildSearchRegion(
  width: number,
  height: number,
  settings: ScaleCalibrationSettings
): SearchRegion {
  const minX = Math.round(
    clampValue(settings.searchStartRatioX, 0, 0.95) * width
  );

  const maxX = Math.round(
    clampValue(
      settings.searchEndRatioX,
      settings.searchStartRatioX,
      1
    ) * width
  );

  const minY = Math.round(
    clampValue(settings.searchStartRatioY, 0, 0.95) * height
  );

  const maxY = Math.round(
    clampValue(
      settings.searchEndRatioY,
      settings.searchStartRatioY,
      1
    ) * height
  );

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(1, maxX - minX + 1),
    height: Math.max(1, maxY - minY + 1),
  };
}

function isDarkPixel(
  imageData: ImageData,
  x: number,
  y: number,
  threshold: number
): boolean {
  const { width, height, data } = imageData;

  if (
    x < 0 ||
    y < 0 ||
    x >= width ||
    y >= height
  ) {
    return false;
  }

  const index = (y * width + x) * 4;

  if (data[index + 3] < 20) {
    return false;
  }

  return (
    calculateBrightness(
      data[index],
      data[index + 1],
      data[index + 2]
    ) <= threshold
  );
}

function scoreVerticalColumns(
  imageData: ImageData,
  region: SearchRegion,
  settings: ScaleCalibrationSettings
): ColumnCandidate[] {
  const candidates: ColumnCandidate[] = [];

  for (let x = region.minX; x <= region.maxX; x += 1) {
    let darkCount = 0;

    for (let y = region.minY; y <= region.maxY; y += 1) {
      if (
        isDarkPixel(
          imageData,
          x,
          y,
          settings.darknessThreshold
        )
      ) {
        darkCount += 1;
      }
    }

    candidates.push({
      x,
      coverage: darkCount / region.height,
    });
  }

  return candidates.sort(
    (first, second) => second.coverage - first.coverage
  );
}

function chooseBaselineColumn(
  candidates: ColumnCandidate[],
  settings: ScaleCalibrationSettings
): ColumnCandidate | null {
  const plausible = candidates.filter(
    (candidate) =>
      candidate.coverage >=
      settings.minimumBaselineCoverage
  );

  if (plausible.length === 0) {
    return null;
  }

  let best: ColumnCandidate | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const candidate of plausible) {
    const neighbourSupport = plausible
      .filter(
        (other) =>
          other.x !== candidate.x &&
          Math.abs(other.x - candidate.x) <= 4
      )
      .reduce(
        (total, other) => total + other.coverage,
        0
      );

    const score =
      candidate.coverage * 2 +
      neighbourSupport;

    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}

function calculateTickStrength(
  imageData: ImageData,
  baselineX: number,
  y: number,
  settings: ScaleCalibrationSettings
): number {
  let strength = 0;

  for (
    let x =
      baselineX -
      settings.tickSearchRadiusPixels;
    x <= baselineX + 2;
    x += 1
  ) {
    if (
      isDarkPixel(
        imageData,
        x,
        y,
        settings.darknessThreshold
      )
    ) {
      strength += 1;
    }
  }

  return strength;
}

function collectTickCandidates(
  imageData: ImageData,
  region: SearchRegion,
  baselineX: number,
  settings: ScaleCalibrationSettings
): TickCandidate[] {
  const raw: TickCandidate[] = [];

  for (let y = region.minY; y <= region.maxY; y += 1) {
    const strength =
      calculateTickStrength(
        imageData,
        baselineX,
        y,
        settings
      );

    if (strength >= 4) {
      raw.push({ y, strength });
    }
  }

  if (raw.length === 0) {
    return [];
  }

  const merged: TickCandidate[] = [];
  let group: TickCandidate[] = [raw[0]];

  for (let index = 1; index < raw.length; index += 1) {
    const current = raw[index];
    const previous = raw[index - 1];

    if (current.y - previous.y <= 2) {
      group.push(current);
      continue;
    }

    merged.push(
      group.reduce((best, candidate) =>
        candidate.strength > best.strength
          ? candidate
          : best
      )
    );

    group = [current];
  }

  merged.push(
    group.reduce((best, candidate) =>
      candidate.strength > best.strength
        ? candidate
        : best
    )
  );

  return merged;
}

function selectMajorTicks(
  candidates: TickCandidate[],
  settings: ScaleCalibrationSettings
): TickCandidate[] {
  if (candidates.length === 0) {
    return [];
  }

  const sortedByStrength = [...candidates].sort(
    (first, second) => second.strength - first.strength
  );

  const sample = sortedByStrength.slice(
    0,
    Math.max(
      3,
      Math.ceil(sortedByStrength.length * 0.3)
    )
  );

  const averageStrongTick =
    sample.reduce(
      (total, candidate) =>
        total + candidate.strength,
      0
    ) / Math.max(1, sample.length);

  const strengthThreshold =
    Math.max(5, averageStrongTick * 0.58);

  const filtered = candidates.filter(
    (candidate) =>
      candidate.strength >= strengthThreshold
  );

  const selected: TickCandidate[] = [];

  for (const candidate of filtered) {
    const previous = selected[selected.length - 1];

    if (
      !previous ||
      candidate.y - previous.y >=
        settings.minimumMajorTickSpacingPixels
    ) {
      selected.push(candidate);
      continue;
    }

    if (candidate.strength > previous.strength) {
      selected[selected.length - 1] = candidate;
    }
  }

  return selected;
}

function chooseScaleEndpointFallback(
  candidates: TickCandidate[],
  settings: ScaleCalibrationSettings
): TickCandidate[] | null {
  if (candidates.length < 2) {
    return null;
  }

  const maximumStrength = Math.max(
    1,
    ...candidates.map(
      (candidate) =>
        candidate.strength
    )
  );

  const strengthThreshold =
    Math.max(
      5,
      maximumStrength * 0.7
    );

  const strongCandidates =
    candidates.filter(
      (candidate) =>
        candidate.strength >=
        strengthThreshold
    );

  if (strongCandidates.length < 2) {
    return null;
  }

  const mergedCandidates:
    TickCandidate[] = [];

  let currentGroup:
    TickCandidate[] = [
      strongCandidates[0],
    ];

  for (
    let index = 1;
    index <
    strongCandidates.length;
    index += 1
  ) {
    const current =
      strongCandidates[index];

    const previous =
      strongCandidates[
        index - 1
      ];

    if (
      current.y -
        previous.y <=
      4
    ) {
      currentGroup.push(
        current
      );

      continue;
    }

    mergedCandidates.push(
      currentGroup.reduce(
        (strongest, candidate) =>
          candidate.strength >
          strongest.strength
            ? candidate
            : strongest
      )
    );

    currentGroup = [
      current,
    ];
  }

  mergedCandidates.push(
    currentGroup.reduce(
      (strongest, candidate) =>
        candidate.strength >
        strongest.strength
          ? candidate
          : strongest
    )
  );

  if (
    mergedCandidates.length <
    2
  ) {
    return null;
  }

  const firstCandidate =
    mergedCandidates[0];

  const lastCandidate =
    mergedCandidates[
      mergedCandidates.length - 1
    ];

  const measuredSpan =
    lastCandidate.y -
    firstCandidate.y;

  const minimumAcceptableSpan =
    settings
      .minimumMajorTickSpacingPixels *
    Math.max(
      6,
      settings
        .expectedLengthInches *
        0.55
    );

  if (
    measuredSpan <
    minimumAcceptableSpan
  ) {
    return null;
  }

  return [
    firstCandidate,
    lastCandidate,
  ];
}

function detectBaselineExtentFallback(
  imageData: ImageData,
  region: SearchRegion,
  baselineX: number,
  settings: ScaleCalibrationSettings
): TickCandidate[] | null {
  const rowHasBaselineInk = (
    y: number
  ): boolean => {
    let darkCount = 0;

    for (
      let x = baselineX - 2;
      x <= baselineX + 2;
      x += 1
    ) {
      if (
        isDarkPixel(
          imageData,
          x,
          y,
          settings.darknessThreshold
        )
      ) {
        darkCount += 1;
      }
    }

    return darkCount >= 1;
  };

  const segments: Array<{
    startY: number;
    endY: number;
    inkRows: number;
  }> = [];

  const maximumGapPixels = Math.max(
    8,
    Math.round(
      settings.minimumMajorTickSpacingPixels *
        0.75
    )
  );

  let activeStart: number | null = null;
  let lastInkY: number | null = null;
  let inkRows = 0;

  for (
    let y = region.minY;
    y <= region.maxY;
    y += 1
  ) {
    if (rowHasBaselineInk(y)) {
      if (activeStart === null) {
        activeStart = y;
        inkRows = 0;
      }

      lastInkY = y;
      inkRows += 1;
      continue;
    }

    if (
      activeStart !== null &&
      lastInkY !== null &&
      y - lastInkY > maximumGapPixels
    ) {
      segments.push({
        startY: activeStart,
        endY: lastInkY,
        inkRows,
      });

      activeStart = null;
      lastInkY = null;
      inkRows = 0;
    }
  }

  if (
    activeStart !== null &&
    lastInkY !== null
  ) {
    segments.push({
      startY: activeStart,
      endY: lastInkY,
      inkRows,
    });
  }

  if (segments.length === 0) {
    return null;
  }

  const bestSegment = segments.reduce(
    (best, candidate) => {
      const bestSpan =
        best.endY - best.startY;

      const candidateSpan =
        candidate.endY -
        candidate.startY;

      const bestDensity =
        best.inkRows /
        Math.max(1, bestSpan + 1);

      const candidateDensity =
        candidate.inkRows /
        Math.max(
          1,
          candidateSpan + 1
        );

      const bestScore =
        bestSpan * bestDensity;

      const candidateScore =
        candidateSpan *
        candidateDensity;

      return candidateScore > bestScore
        ? candidate
        : best;
    }
  );

  const measuredSpan =
    bestSegment.endY -
    bestSegment.startY;

  const minimumSpan =
    region.height * 0.45;

  const density =
    bestSegment.inkRows /
    Math.max(1, measuredSpan + 1);

  if (
    measuredSpan < minimumSpan ||
    density < 0.55
  ) {
    return null;
  }

  return [
    {
      y: bestSegment.startY,
      strength: Math.max(
        1,
        calculateTickStrength(
          imageData,
          baselineX,
          bestSegment.startY,
          settings
        )
      ),
    },
    {
      y: bestSegment.endY,
      strength: Math.max(
        1,
        calculateTickStrength(
          imageData,
          baselineX,
          bestSegment.endY,
          settings
        )
      ),
    },
  ];
}

function calculateSpacingRegularity(
  ticks: TickCandidate[]
): number {
  if (ticks.length < 3) {
    return 0;
  }

  const spacings: number[] = [];

  for (let index = 1; index < ticks.length; index += 1) {
    spacings.push(
      ticks[index].y -
      ticks[index - 1].y
    );
  }

  const average =
    spacings.reduce(
      (total, spacing) => total + spacing,
      0
    ) / spacings.length;

  if (average <= 0) {
    return 0;
  }

  const variance =
    spacings.reduce(
      (total, spacing) =>
        total +
        (spacing - average) ** 2,
      0
    ) / spacings.length;

  return clampValue(
    1 - Math.sqrt(variance) / average,
    0,
    1
  );
}

function chooseScaleEndpoints(
  ticks: TickCandidate[],
  expectedLengthInches: number
): TickCandidate[] | null {
  const requiredTickCount =
    Math.round(expectedLengthInches) + 1;

  if (
    ticks.length <
    Math.max(2, requiredTickCount - 2)
  ) {
    return null;
  }

  const windowSize =
    Math.min(ticks.length, requiredTickCount);

  let bestWindow: TickCandidate[] | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (
    let start = 0;
    start + windowSize <= ticks.length;
    start += 1
  ) {
    const window = ticks.slice(
      start,
      start + windowSize
    );

    const regularity =
      calculateSpacingRegularity(window);

    const span =
      window[window.length - 1].y -
      window[0].y;

    const endpointStrength =
      (
        window[0].strength +
        window[window.length - 1].strength
      ) / 2;

    const score =
      regularity * 1000 +
      span +
      endpointStrength * 4;

    if (score > bestScore) {
      bestScore = score;
      bestWindow = window;
    }
  }

  return bestWindow;
}

function createFailedQuality():
  ScaleCalibrationQuality {
  return {
    confidence: 0,
    baselineCoverage: 0,
    tickRegularity: 0,
    endpointStrength: 0,
    requiresManualReview: true,
  };
}

export function calculatePixelsPerInch(
  measuredPixelLength: number,
  visibleScaleLengthInches: number
): number {
  if (
    measuredPixelLength <= 0 ||
    visibleScaleLengthInches <= 0
  ) {
    return 0;
  }

  return roundValue(
    measuredPixelLength /
      visibleScaleLengthInches,
    6
  );
}

export function calculatePixelsPerCm(
  pixelsPerInch: number
): number {
  if (pixelsPerInch <= 0) {
    return 0;
  }

  return roundValue(
    pixelsPerInch / 2.54,
    6
  );
}

export function convertPixelsToCm(
  pixelLength: number,
  pixelsPerCm: number
): number {
  if (pixelLength < 0 || pixelsPerCm <= 0) {
    return 0;
  }

  return roundValue(
    pixelLength / pixelsPerCm,
    6
  );
}

export function convertPixelsToInches(
  pixelLength: number,
  pixelsPerInch: number
): number {
  if (pixelLength < 0 || pixelsPerInch <= 0) {
    return 0;
  }

  return roundValue(
    pixelLength / pixelsPerInch,
    6
  );
}

export function detectPrintedScale(
  input: ScaleCalibrationInput
): ScaleCalibrationResult {
  const { imageData } = input;

  const settings = mergeSettings(
    input.settings,
    input.expectedLengthInches
  );

  const analysedAt =
    new Date().toISOString();

  const createLegacyResult = (
    imageHasScale: boolean,
    measuredPixelLength: number
  ) =>
    analyzeScaleDetection({
      imageHasScale,
      scaleType: imageHasScale
        ? "12-inch-ruler"
        : "none",
      visibleScaleLengthInches:
        settings.expectedLengthInches,
      measuredPixelLength,
      photoQuality: "unknown",
    });

  if (
    imageData.width <= 0 ||
    imageData.height <= 0
  ) {
    return {
      status: "failed",
      calibration: {
        referenceLengthCm:
          settings.expectedLengthInches *
          2.54,
        calibrated: false,
      },
      quality: createFailedQuality(),
      warnings: [
        "The image does not contain valid dimensions for scale analysis.",
      ],
      explanation:
        "Automatic ruler calibration could not run because image dimensions were unavailable.",
      legacyScaleAssessment:
        createLegacyResult(false, 0),
      analysedAt,
    };
  }

  const region = buildSearchRegion(
    imageData.width,
    imageData.height,
    settings
  );

  const baseline = chooseBaselineColumn(
    scoreVerticalColumns(
      imageData,
      region,
      settings
    ),
    settings
  );

  if (!baseline) {
    return {
      status: "failed",
      calibration: {
        referenceLengthCm:
          settings.expectedLengthInches *
          2.54,
        calibrated: false,
      },
      quality: createFailedQuality(),
      warnings: [
        "No reliable vertical printed ruler baseline was detected.",
      ],
      explanation:
        "The AI could not isolate the ruler baseline. Manual scale selection remains available.",
      legacyScaleAssessment:
        createLegacyResult(false, 0),
      analysedAt,
    };
  }

  const tickCandidates =
  collectTickCandidates(
    imageData,
    region,
    baseline.x,
    settings
  );

const majorTicks =
  selectMajorTicks(
    tickCandidates,
    settings
  );

const regularEndpointWindow =
  chooseScaleEndpoints(
    majorTicks,
    settings.expectedLengthInches
  );

const fallbackEndpointWindow =
  regularEndpointWindow
    ? null
    : chooseScaleEndpointFallback(
        tickCandidates,
        settings
      );

const baselineExtentEndpointWindow =
  regularEndpointWindow ||
  fallbackEndpointWindow
    ? null
    : detectBaselineExtentFallback(
        imageData,
        region,
        baseline.x,
        settings
      );

const usedEndpointFallback =
  !regularEndpointWindow &&
  Boolean(
    fallbackEndpointWindow
  );

const usedBaselineExtentFallback =
  !regularEndpointWindow &&
  !fallbackEndpointWindow &&
  Boolean(
    baselineExtentEndpointWindow
  );

const endpointWindow =
  regularEndpointWindow ??
  fallbackEndpointWindow ??
  baselineExtentEndpointWindow;

  if (!endpointWindow) {
    return {
      status: "failed",
      calibration: {
        referenceLengthCm:
          settings.expectedLengthInches *
          2.54,
        calibrated: false,
      },
      quality: {
        ...createFailedQuality(),
        baselineCoverage:
          roundValue(
            baseline.coverage,
            4
          ),
      },
      warnings: [
        "The ruler baseline was found, but its major tick sequence could not be isolated reliably.",
      ],
      explanation:
        "Automatic calibration could not determine trustworthy ruler endpoints.",
      legacyScaleAssessment:
        createLegacyResult(true, 0),
      analysedAt,
    };
  }

  const firstTick = endpointWindow[0];
  const lastTick =
    endpointWindow[
      endpointWindow.length - 1
    ];

  const measuredPixelLength =
    lastTick.y - firstTick.y;

  const pixelsPerInch =
    calculatePixelsPerInch(
      measuredPixelLength,
      settings.expectedLengthInches
    );

  const pixelsPerCm =
    calculatePixelsPerCm(
      pixelsPerInch
    );

  const tickRegularity =
    calculateSpacingRegularity(
      endpointWindow
    );

  const maximumStrength =
    Math.max(
      1,
      ...majorTicks.map(
        (tick) => tick.strength
      )
    );

  const endpointStrength =
    clampValue(
      (
        firstTick.strength +
        lastTick.strength
      ) /
        2 /
        maximumStrength,
      0,
      1
    );

  const tickCountScore =
    clampValue(
      endpointWindow.length /
        (
          Math.round(
            settings.expectedLengthInches
          ) + 1
        ),
      0,
      1
    );

  const confidence =
    clampValue(
      baseline.coverage * 0.28 +
        tickRegularity * 0.38 +
        endpointStrength * 0.18 +
        tickCountScore * 0.16,
      0,
      1
    );

  const quality:
    ScaleCalibrationQuality = {
      confidence:
        roundValue(confidence, 4),
      baselineCoverage:
        roundValue(
          baseline.coverage,
          4
        ),
      tickRegularity:
        roundValue(
          tickRegularity,
          4
        ),
      endpointStrength:
        roundValue(
          endpointStrength,
          4
        ),
      requiresManualReview:
        confidence <
        settings.minimumConfidence,
  };

  const warnings: string[] = [];
if (usedEndpointFallback) {
  warnings.push(
    "The AI calibrated the ruler using its detected upper and lower tick endpoints because the complete major-tick sequence was not sufficiently clear."
  );
}

if (usedBaselineExtentFallback) {
  warnings.push(
    "The AI calibrated the ruler from the detected vertical baseline extent. Verify that the highlighted endpoints align with 0 inches and 12 inches before production use."
  );
}
  if (quality.baselineCoverage < 0.55) {
    warnings.push(
      "The printed ruler baseline is only partially visible."
    );
  }

  if (quality.tickRegularity < 0.72) {
    warnings.push(
      "Major ruler ticks are not evenly spaced enough for high-confidence automatic calibration."
    );
  }

  if (
    endpointWindow.length <
    Math.round(
      settings.expectedLengthInches
    ) + 1
  ) {
    warnings.push(
      `Only ${endpointWindow.length} major ticks were isolated.`
    );
  }

  if (quality.requiresManualReview) {
    warnings.push(
      "Review the automatic scale endpoints before approving production geometry."
    );
  }

  const calibrated =
    measuredPixelLength > 0 &&
    pixelsPerInch > 0 &&
    pixelsPerCm > 0;

  const status: ScaleCalibrationStatus =
    !calibrated
      ? "failed"
      : quality.requiresManualReview
        ? "requires-review"
        : "detected";

  const firstPoint: GeometryPoint = {
    x: baseline.x,
    y: firstTick.y,
  };

  const secondPoint: GeometryPoint = {
    x: baseline.x,
    y: lastTick.y,
  };

  const calibration:
    PatternScaleCalibration = {
      firstPoint,
      secondPoint,
      referenceLengthCm:
        roundValue(
          settings.expectedLengthInches *
            2.54,
          4
        ),
      measuredPixels:
        roundValue(
          measuredPixelLength,
          3
        ),
      pixelsPerCm,
      pixelsPerInch,
      calibrated,
      calibratedAt:
        calibrated
          ? analysedAt
          : undefined,
  };

  return {
    status,
    calibration,
    scaleLine: {
      orientation: "vertical",
      firstPoint,
      secondPoint,
      measuredPixelLength:
        roundValue(
          measuredPixelLength,
          3
        ),
      axisCoordinate:
        baseline.x,
      detectedMajorTicks:
        endpointWindow.map(
          (tick) => tick.y
        ),
    },
    quality,
    warnings,
    explanation:
  usedBaselineExtentFallback
    ? `The AI detected the vertical extent of the ${settings.expectedLengthInches}-inch ruler baseline and calculated ${pixelsPerInch.toFixed(
        4
      )} pixels per inch (${pixelsPerCm.toFixed(
        4
      )} pixels per centimetre). Confirm that the endpoints align with the printed 0-inch and 12-inch marks before production approval.`
    : usedEndpointFallback
      ? `The AI detected the upper and lower tick endpoints of the ${settings.expectedLengthInches}-inch ruler and calculated ${pixelsPerInch.toFixed(
          4
        )} pixels per inch (${pixelsPerCm.toFixed(
          4
        )} pixels per centimetre). Review the detected endpoints before approving production geometry.`
      : status === "detected"
        ? `The AI detected a ${settings.expectedLengthInches}-inch ruler and calculated ${pixelsPerInch.toFixed(
            4
          )} pixels per inch (${pixelsPerCm.toFixed(
            4
          )} pixels per centimetre).`
        : "The AI detected a likely ruler and calculated provisional scale values, but engineering review is required.",
    legacyScaleAssessment:
      createLegacyResult(
        calibrated,
        measuredPixelLength
      ),
    analysedAt,
  };
}

export function findMajorTicks(
  input: ScaleCalibrationInput
): number[] {
  const settings = mergeSettings(
    input.settings,
    input.expectedLengthInches
  );

  const region = buildSearchRegion(
    input.imageData.width,
    input.imageData.height,
    settings
  );

  const baseline = chooseBaselineColumn(
    scoreVerticalColumns(
      input.imageData,
      region,
      settings
    ),
    settings
  );

  if (!baseline) {
    return [];
  }

  return selectMajorTicks(
    collectTickCandidates(
      input.imageData,
      region,
      baseline.x,
      settings
    ),
    settings
  ).map((tick) => tick.y);
}

export function isScaleCalibrationUsable(
  result: ScaleCalibrationResult
): boolean {
  return (
    result.status !== "failed" &&
    result.calibration.calibrated &&
    typeof
      result.calibration
        .pixelsPerCm ===
      "number" &&
    result.calibration
      .pixelsPerCm > 0 &&
    typeof
      result.calibration
        .pixelsPerInch ===
      "number" &&
    result.calibration
      .pixelsPerInch > 0
  );
}

export function requiresScaleCalibrationReview(
  result: ScaleCalibrationResult
): boolean {
  return (
    result.status ===
      "requires-review" ||
    result.quality
      .requiresManualReview ||
    result.warnings.length > 0
  );
}

export const scaleCalibrationEngine = {
  detectPrintedScale,
  findMajorTicks,
  calculatePixelsPerInch,
  calculatePixelsPerCm,
  convertPixelsToCm,
  convertPixelsToInches,
  isScaleCalibrationUsable,
  requiresScaleCalibrationReview,
};

export default scaleCalibrationEngine;