import type {
  EngineeringProject,
  PatternStatus,
} from "@/lib/optifabric/projectMaster";

import {
  createEmptyPatternGeometry,
} from "@/lib/optifabric/geometry/patternGeometry";

import type {
  PatternDirectionRule,
  PatternGeometry,
  PatternMirrorRule,
  PatternRotationRule,
} from "@/lib/optifabric/geometry/patternGeometry";

/**
 * OptiFabric AI Geometry Project Adapter
 *
 * This module connects the existing OptiFabric project and pattern-upload
 * structure to the new AI Pattern Geometry system.
 *
 * It allows the existing project patterns to become geometry records without
 * changing projectMaster.ts or the garment pattern libraries.
 *
 * Main responsibilities:
 *
 * - Read existing project patterns
 * - Detect uploaded patterns
 * - Create one geometry object per selected pattern
 * - Carry cut quantity and fold rules into geometry
 * - Attach temporary browser preview URLs
 * - Preserve previously created geometry
 * - Save and load geometry records from localStorage
 * - Produce geometry-project summary information
 */

/**
 * Existing uploaded pattern information currently added by the pattern-upload
 * page.
 *
 * These fields are kept here instead of modifying projectMaster.ts during the
 * first RC4 geometry test.
 */
export interface GeometrySourcePattern
  extends PatternStatus {
  uploaded: boolean;

  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;

  scaleVisible?: boolean;
  grainLineVisible?: boolean;
  notchesVisible?: boolean;

  validationPassed?: boolean;

  materialCategory?: string;
}

/**
 * Existing engineering project together with the extended upload-pattern
 * information.
 */
export interface GeometrySourceProject
  extends Omit<EngineeringProject, "patterns"> {
  patterns: GeometrySourcePattern[];

  patternValidationCompleted?: boolean;
  patternValidationCompletedAt?: string;
}

/**
 * Browser preview map used by the current upload page.
 *
 * Example:
 *
 * {
 *   "front-body": "blob:http://localhost:3000/...",
 *   "back-body": "blob:http://localhost:3000/..."
 * }
 */
export type PatternPreviewMap = Record<
  string,
  string
>;

/**
 * Controls which project patterns should enter the geometry workflow.
 */
export type GeometryPatternSelection =
  | "uploaded-only"
  | "required-only"
  | "all-patterns";

/**
 * Optional engineering rules supplied while creating geometry records.
 */
export interface GeometryPatternRuleOverride {
  patternId: string;

  rotationRule?: PatternRotationRule;
  mirrorRule?: PatternMirrorRule;
  directionRule?: PatternDirectionRule;
}

/**
 * Input used to convert an OptiFabric project into a geometry project.
 */
export interface CreateProjectGeometryInput {
  project: GeometrySourceProject;

  previews?: PatternPreviewMap;

  existingGeometries?: PatternGeometry[];

  selection?: GeometryPatternSelection;

  ruleOverrides?: GeometryPatternRuleOverride[];
}

/**
 * Complete geometry dataset belonging to one OptiFabric project.
 */
export interface ProjectGeometryDataset {
  id: string;
  projectId: string;

  projectName: string;
  customer: string;
  styleNumber: string;

  garmentCategory: string;

  geometries: PatternGeometry[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Summary shown by the future geometry dashboard.
 */
export interface ProjectGeometryAdapterSummary {
  projectId: string;

  totalProjectPatterns: number;
  uploadedProjectPatterns: number;
  requiredProjectPatterns: number;

  selectedGeometryPatterns: number;

  geometryWithImage: number;
  geometryWithoutImage: number;

  geometryNotStarted: number;
  geometryImageReady: number;
  geometryCalibrated: number;
  geometryTraced: number;
  geometryValidated: number;
  geometryWarning: number;
  geometryFailed: number;

  markerReady: number;

  readinessPercentage: number;
}

/**
 * Creates the localStorage key used for one project's geometry dataset.
 */
export function getProjectGeometryStorageKey(
  projectId: string
): string {
  return `optifabric-project-${projectId}-geometry`;
}

/**
 * Checks whether browser localStorage is available.
 */
function canUseBrowserStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

/**
 * Safely converts an unknown cut quantity into a positive integer.
 */
function normaliseCutQuantity(
  cutQuantity?: number
): number {
  if (
    !Number.isFinite(cutQuantity) ||
    !cutQuantity ||
    cutQuantity < 1
  ) {
    return 1;
  }

  return Math.max(
    1,
    Math.round(cutQuantity)
  );
}

/**
 * Determines whether one project pattern should be included in the geometry
 * dataset.
 */
export function shouldIncludePatternInGeometry(
  pattern: GeometrySourcePattern,
  selection: GeometryPatternSelection
): boolean {
  switch (selection) {
    case "uploaded-only":
      return pattern.uploaded === true;

    case "required-only":
      return pattern.required === true;

    case "all-patterns":
      return true;

    default:
      return pattern.uploaded === true;
  }
}

/**
 * Finds an existing geometry record for one pattern.
 */
function findExistingPatternGeometry(
  geometries: PatternGeometry[],
  patternId: string
): PatternGeometry | undefined {
  return geometries.find(
    (geometry) =>
      geometry.patternId === patternId
  );
}

/**
 * Finds any engineering rule override for one pattern.
 */
function findPatternRuleOverride(
  overrides: GeometryPatternRuleOverride[],
  patternId: string
): GeometryPatternRuleOverride | undefined {
  return overrides.find(
    (override) =>
      override.patternId === patternId
  );
}

/**
 * Returns a temporary source image URL for a pattern.
 *
 * The current upload page keeps browser previews separately from the stored
 * pattern record, so the preview map is passed into this adapter.
 */
function getPatternSourceImageUrl(
  pattern: GeometrySourcePattern,
  previews: PatternPreviewMap
): string | undefined {
  const previewUrl = previews[pattern.id];

  if (
    typeof previewUrl === "string" &&
    previewUrl.trim().length > 0
  ) {
    return previewUrl;
  }

  return undefined;
}

/**
 * Creates a new geometry record from one existing project pattern.
 */
export function createGeometryFromProjectPattern(
  project: GeometrySourceProject,
  pattern: GeometrySourcePattern,
  previews: PatternPreviewMap = {},
  override?: GeometryPatternRuleOverride
): PatternGeometry {
  const sourceImageUrl =
    getPatternSourceImageUrl(
      pattern,
      previews
    );

  const directionRule =
    override?.directionRule ??
    "non-directional";

  const geometry =
    createEmptyPatternGeometry({
      projectId: project.id,

      patternId: pattern.id,
      patternName: pattern.name,

      sourceImageUrl,
      sourceFileName: pattern.fileName,

      cutQuantity:
        normaliseCutQuantity(
          pattern.cutQuantity
        ),

      cutOnFold:
        pattern.cutOnFold === true,

      rotationRule:
        override?.rotationRule ??
        "180-only",

      mirrorRule:
        override?.mirrorRule ??
        "none",

      directionRule,
    });

  /**
   * The upload page already asks the user whether the grain line is visible.
   *
   * This does not yet mean that AI has measured the actual grain-line angle.
   * Therefore grainLine.detected remains false until the tracing page records
   * real grain-line coordinates.
   */
  geometry.engineeringNotes = [
    pattern.uploaded
      ? "Pattern file has been uploaded."
      : "Pattern file has not been uploaded.",

    pattern.scaleVisible
      ? "The user confirmed that a scale reference is visible."
      : "A visible scale reference has not been confirmed.",

    pattern.grainLineVisible
      ? "The user confirmed that a grain line is visible."
      : "A visible grain line has not been confirmed.",

    pattern.notchesVisible
      ? "The user confirmed that pattern notches are visible."
      : "Visible pattern notches have not been confirmed.",

    pattern.validationPassed
      ? "The upload-stage pattern validation passed."
      : "The upload-stage pattern validation has not passed.",

    pattern.materialCategory
      ? `Material category: ${pattern.materialCategory}.`
      : "Material category has not been assigned.",
  ];

  return geometry;
}

/**
 * Updates an existing geometry with the latest pattern-upload information.
 *
 * Existing polygon, calibration, measurements, validation and AI confidence
 * are preserved.
 */
export function synchroniseExistingPatternGeometry(
  existingGeometry: PatternGeometry,
  pattern: GeometrySourcePattern,
  previews: PatternPreviewMap = {},
  override?: GeometryPatternRuleOverride
): PatternGeometry {
  const previewUrl =
    getPatternSourceImageUrl(
      pattern,
      previews
    );

  const updatedSourceImageUrl =
    previewUrl ??
    existingGeometry.sourceImageUrl;

  let updatedStatus =
    existingGeometry.status;

  if (
    updatedStatus === "not-started" &&
    updatedSourceImageUrl
  ) {
    updatedStatus = "image-ready";
  }

  return {
    ...existingGeometry,

    patternName: pattern.name,

    sourceImageUrl:
      updatedSourceImageUrl,

    sourceFileName:
      pattern.fileName ??
      existingGeometry.sourceFileName,

    status: updatedStatus,

    cutQuantity:
      normaliseCutQuantity(
        pattern.cutQuantity
      ),

    cutOnFold:
      pattern.cutOnFold === true,

    rotationRule:
      override?.rotationRule ??
      existingGeometry.rotationRule,

    mirrorRule:
      override?.mirrorRule ??
      existingGeometry.mirrorRule,

    directionRule:
      override?.directionRule ??
      existingGeometry.directionRule,

    grainLine: {
      ...existingGeometry.grainLine,

      directionRule:
        override?.directionRule ??
        existingGeometry.grainLine
          .directionRule,
    },

    engineeringNotes: [
      pattern.uploaded
        ? "Pattern file has been uploaded."
        : "Pattern file has not been uploaded.",

      pattern.scaleVisible
        ? "The user confirmed that a scale reference is visible."
        : "A visible scale reference has not been confirmed.",

      pattern.grainLineVisible
        ? "The user confirmed that a grain line is visible."
        : "A visible grain line has not been confirmed.",

      pattern.notchesVisible
        ? "The user confirmed that pattern notches are visible."
        : "Visible pattern notches have not been confirmed.",

      pattern.validationPassed
        ? "The upload-stage pattern validation passed."
        : "The upload-stage pattern validation has not passed.",

      pattern.materialCategory
        ? `Material category: ${pattern.materialCategory}.`
        : "Material category has not been assigned.",
    ],

    updatedAt: new Date().toISOString(),
  };
}

/**
 * Converts a complete existing OptiFabric project into a geometry dataset.
 *
 * The default behaviour includes uploaded patterns only. Therefore, when the
 * current test project contains 16 uploaded patterns, this function creates
 * 16 geometry records.
 */
export function createProjectGeometryDataset(
  input: CreateProjectGeometryInput
): ProjectGeometryDataset {
  const {
    project,
    previews = {},
    existingGeometries = [],
    selection = "uploaded-only",
    ruleOverrides = [],
  } = input;

  const now = new Date().toISOString();

  const selectedPatterns =
    project.patterns.filter((pattern) =>
      shouldIncludePatternInGeometry(
        pattern,
        selection
      )
    );

  const geometries =
    selectedPatterns.map((pattern) => {
      const existingGeometry =
        findExistingPatternGeometry(
          existingGeometries,
          pattern.id
        );

      const ruleOverride =
        findPatternRuleOverride(
          ruleOverrides,
          pattern.id
        );

      if (existingGeometry) {
        return synchroniseExistingPatternGeometry(
          existingGeometry,
          pattern,
          previews,
          ruleOverride
        );
      }

      return createGeometryFromProjectPattern(
        project,
        pattern,
        previews,
        ruleOverride
      );
    });

  const oldestExistingCreatedAt =
    existingGeometries
      .map((geometry) => geometry.createdAt)
      .filter(Boolean)
      .sort()[0];

  return {
    id: `${project.id}-geometry-dataset`,

    projectId: project.id,

    projectName: project.projectName,
    customer: project.customer,
    styleNumber: project.styleNumber,

    garmentCategory:
      project.garmentCategory,

    geometries,

    createdAt:
      oldestExistingCreatedAt ?? now,

    updatedAt: now,
  };
}

/**
 * Saves one project geometry dataset to localStorage.
 */
export function saveProjectGeometryDataset(
  dataset: ProjectGeometryDataset
): boolean {
  if (!canUseBrowserStorage()) {
    return false;
  }

  try {
    const storageKey =
      getProjectGeometryStorageKey(
        dataset.projectId
      );

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...dataset,
        updatedAt:
          new Date().toISOString(),
      })
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to save OptiFabric geometry dataset:",
      error
    );

    return false;
  }
}

/**
 * Loads one project geometry dataset from localStorage.
 */
export function loadProjectGeometryDataset(
  projectId: string
): ProjectGeometryDataset | null {
  if (!canUseBrowserStorage()) {
    return null;
  }

  try {
    const storageKey =
      getProjectGeometryStorageKey(
        projectId
      );

    const storedValue =
      window.localStorage.getItem(
        storageKey
      );

    if (!storedValue) {
      return null;
    }

    const parsedValue =
      JSON.parse(
        storedValue
      ) as ProjectGeometryDataset;

    if (
      !parsedValue ||
      parsedValue.projectId !== projectId ||
      !Array.isArray(
        parsedValue.geometries
      )
    ) {
      return null;
    }

    return parsedValue;
  } catch (error) {
    console.error(
      "Unable to load OptiFabric geometry dataset:",
      error
    );

    return null;
  }
}

/**
 * Deletes one project's locally stored geometry dataset.
 */
export function deleteProjectGeometryDataset(
  projectId: string
): boolean {
  if (!canUseBrowserStorage()) {
    return false;
  }

  try {
    window.localStorage.removeItem(
      getProjectGeometryStorageKey(
        projectId
      )
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to delete OptiFabric geometry dataset:",
      error
    );

    return false;
  }
}

/**
 * Creates or refreshes the geometry dataset and saves it.
 */
export function initialiseProjectGeometry(
  input: Omit<
    CreateProjectGeometryInput,
    "existingGeometries"
  >
): ProjectGeometryDataset {
  const existingDataset =
    loadProjectGeometryDataset(
      input.project.id
    );

  const dataset =
    createProjectGeometryDataset({
      ...input,

      existingGeometries:
        existingDataset?.geometries ?? [],
    });

  saveProjectGeometryDataset(dataset);

  return dataset;
}

/**
 * Returns one geometry by its pattern ID.
 */
export function getPatternGeometryByPatternId(
  dataset: ProjectGeometryDataset,
  patternId: string
): PatternGeometry | undefined {
  return dataset.geometries.find(
    (geometry) =>
      geometry.patternId === patternId
  );
}

/**
 * Replaces one geometry inside the dataset.
 */
export function updatePatternGeometryInDataset(
  dataset: ProjectGeometryDataset,
  updatedGeometry: PatternGeometry
): ProjectGeometryDataset {
  const geometryExists =
    dataset.geometries.some(
      (geometry) =>
        geometry.patternId ===
        updatedGeometry.patternId
    );

  const geometries = geometryExists
    ? dataset.geometries.map((geometry) =>
        geometry.patternId ===
        updatedGeometry.patternId
          ? updatedGeometry
          : geometry
      )
    : [
        ...dataset.geometries,
        updatedGeometry,
      ];

  return {
    ...dataset,

    geometries,

    updatedAt: new Date().toISOString(),
  };
}

/**
 * Updates and immediately saves one pattern geometry.
 */
export function updateAndSavePatternGeometry(
  dataset: ProjectGeometryDataset,
  updatedGeometry: PatternGeometry
): ProjectGeometryDataset {
  const updatedDataset =
    updatePatternGeometryInDataset(
      dataset,
      updatedGeometry
    );

  saveProjectGeometryDataset(
    updatedDataset
  );

  return updatedDataset;
}

/**
 * Removes geometry records that no longer belong to the project's selected
 * pattern set.
 */
export function removeOrphanedPatternGeometries(
  project: GeometrySourceProject,
  dataset: ProjectGeometryDataset,
  selection: GeometryPatternSelection =
    "uploaded-only"
): ProjectGeometryDataset {
  const validPatternIds =
    new Set(
      project.patterns
        .filter((pattern) =>
          shouldIncludePatternInGeometry(
            pattern,
            selection
          )
        )
        .map((pattern) => pattern.id)
    );

  return {
    ...dataset,

    geometries:
      dataset.geometries.filter(
        (geometry) =>
          validPatternIds.has(
            geometry.patternId
          )
      ),

    updatedAt: new Date().toISOString(),
  };
}

/**
 * Produces a project-level geometry summary.
 */
export function getProjectGeometryAdapterSummary(
  project: GeometrySourceProject,
  dataset: ProjectGeometryDataset
): ProjectGeometryAdapterSummary {
  const totalProjectPatterns =
    project.patterns.length;

  const uploadedProjectPatterns =
    project.patterns.filter(
      (pattern) => pattern.uploaded
    ).length;

  const requiredProjectPatterns =
    project.patterns.filter(
      (pattern) => pattern.required
    ).length;

  const geometryWithImage =
    dataset.geometries.filter(
      (geometry) =>
        Boolean(geometry.sourceImageUrl)
    ).length;

  const geometryWithoutImage =
    dataset.geometries.length -
    geometryWithImage;

  const geometryNotStarted =
    dataset.geometries.filter(
      (geometry) =>
        geometry.status === "not-started"
    ).length;

  const geometryImageReady =
    dataset.geometries.filter(
      (geometry) =>
        geometry.status === "image-ready"
    ).length;

  const geometryCalibrated =
    dataset.geometries.filter(
      (geometry) =>
        geometry.status === "calibrated"
    ).length;

  const geometryTraced =
    dataset.geometries.filter(
      (geometry) =>
        geometry.status === "traced"
    ).length;

  const geometryValidated =
    dataset.geometries.filter(
      (geometry) =>
        geometry.status === "validated"
    ).length;

  const geometryWarning =
    dataset.geometries.filter(
      (geometry) =>
        geometry.status === "warning"
    ).length;

  const geometryFailed =
    dataset.geometries.filter(
      (geometry) =>
        geometry.status === "failed"
    ).length;

  const markerReady =
    dataset.geometries.filter(
      (geometry) =>
        geometry.markerReady
    ).length;

  const readinessPercentage =
    dataset.geometries.length > 0
      ? Math.round(
          (markerReady /
            dataset.geometries.length) *
            100
        )
      : 0;

  return {
    projectId: project.id,

    totalProjectPatterns,
    uploadedProjectPatterns,
    requiredProjectPatterns,

    selectedGeometryPatterns:
      dataset.geometries.length,

    geometryWithImage,
    geometryWithoutImage,

    geometryNotStarted,
    geometryImageReady,
    geometryCalibrated,
    geometryTraced,
    geometryValidated,
    geometryWarning,
    geometryFailed,

    markerReady,

    readinessPercentage,
  };
}

/**
 * Returns a simple test result confirming whether the expected number of
 * geometry records was created.
 */
export function testProjectGeometryCount(
  dataset: ProjectGeometryDataset,
  expectedCount: number
): {
  passed: boolean;
  expectedCount: number;
  actualCount: number;
  message: string;
} {
  const actualCount =
    dataset.geometries.length;

  const passed =
    actualCount === expectedCount;

  return {
    passed,
    expectedCount,
    actualCount,

    message: passed
      ? `Geometry adapter test passed. ${actualCount} pattern geometry records were created.`
      : `Geometry adapter test failed. Expected ${expectedCount} records but created ${actualCount}.`,
  };
}

export default {
  createGeometryFromProjectPattern,
  createProjectGeometryDataset,
  deleteProjectGeometryDataset,
  getPatternGeometryByPatternId,
  getProjectGeometryAdapterSummary,
  getProjectGeometryStorageKey,
  initialiseProjectGeometry,
  loadProjectGeometryDataset,
  removeOrphanedPatternGeometries,
  saveProjectGeometryDataset,
  shouldIncludePatternInGeometry,
  synchroniseExistingPatternGeometry,
  testProjectGeometryCount,
  updateAndSavePatternGeometry,
  updatePatternGeometryInDataset,
};