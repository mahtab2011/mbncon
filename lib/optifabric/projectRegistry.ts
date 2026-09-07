export const PROJECT_REGISTRY_STORAGE_KEY =
  "optifabric-project-registry";

export const PROJECT_STORAGE_KEY_PREFIX =
  "optifabric-project-";

export type ProjectRegistryStatus =
  | "draft"
  | "pattern-upload"
  | "pattern-validation"
  | "pattern-recognition"
  | "geometry"
  | "marker-planning"
  | "fabric-consumption"
  | "report-ready"
  | "completed"
  | "archived";

export interface ProjectRegistryProgress {
  totalPatterns: number;
  requiredPatterns: number;
  uploadedPatterns: number;
  uploadedRequiredPatterns: number;
  recognisedPatterns: number;
  geometryPatterns: number;
  markerReadyPatterns: number;
  completionPercentage: number;
}

export interface ProjectRegistryEntry {
  projectId: string;
  projectCode: string;
  projectName: string;

  customerFactory: string;
  buyerName?: string;

  styleNumber: string;
  orderNumber?: string;

  mainCategory: string;
  subcategory: string;
  garmentType: string;

  orderQuantity?: number;
  fabricWidth?: number;
  calibrationScale?: number;

  status: ProjectRegistryStatus;
  currentStage: string;

  progress: ProjectRegistryProgress;

  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;

  archived: boolean;
  archivedAt?: string;
}

export interface ProjectRegistrySearchOptions {
  query?: string;
  status?: ProjectRegistryStatus | "all";
  mainCategory?: string;
  garmentType?: string;
  createdFrom?: string;
  createdTo?: string;
  archived?: boolean | "all";
}

type UnknownRecord = Record<string, unknown>;

const EMPTY_PROGRESS: ProjectRegistryProgress = {
  totalPatterns: 0,
  requiredPatterns: 0,
  uploadedPatterns: 0,
  uploadedRequiredPatterns: 0,
  recognisedPatterns: 0,
  geometryPatterns: 0,
  markerReadyPatterns: 0,
  completionPercentage: 0,
};

function canUseBrowserStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function isRecord(value: unknown): value is UnknownRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readString(
  source: UnknownRecord,
  keys: string[],
  fallback = ""
) {
  for (const key of keys) {
    const value = source[key];

    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      return value.trim();
    }
  }

  return fallback;
}

function readNumber(
  source: UnknownRecord,
  keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = source[key];

    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim().length > 0
    ) {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return undefined;
}

function readBoolean(
  source: UnknownRecord,
  keys: string[],
  fallback = false
) {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === "boolean") {
      return value;
    }
  }

  return fallback;
}

function normaliseDate(
  value: unknown,
  fallback = new Date().toISOString()
) {
  if (typeof value !== "string" || !value.trim()) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toISOString();
}

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}
function formatProjectLabel(
  value: string,
  fallback = "Not specified"
) {
  const cleanValue = value.trim();

  if (!cleanValue) {
    return fallback;
  }

  return cleanValue
    .split("-")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}
function sortRegistryEntries(
  entries: ProjectRegistryEntry[]
) {
  return [...entries].sort((first, second) => {
    return (
      new Date(second.updatedAt).getTime() -
      new Date(first.updatedAt).getTime()
    );
  });
}

function calculateProjectProgress(
  project: UnknownRecord
): ProjectRegistryProgress {
  const rawPatterns = project.patterns;

  if (!Array.isArray(rawPatterns)) {
    return { ...EMPTY_PROGRESS };
  }

  const patterns = rawPatterns.filter(isRecord);

  const totalPatterns = patterns.length;

  const requiredPatterns = patterns.filter((pattern) =>
    readBoolean(pattern, ["required"], false)
  );

  const uploadedPatterns = patterns.filter((pattern) => {
    const uploaded = readBoolean(
      pattern,
      ["uploaded"],
      false
    );

    const fileName = readString(
      pattern,
      ["fileName", "uploadedFileName"]
    );

    return uploaded || fileName.length > 0;
  });

  const uploadedRequiredPatterns =
    requiredPatterns.filter((pattern) => {
      const uploaded = readBoolean(
        pattern,
        ["uploaded"],
        false
      );

      const fileName = readString(
        pattern,
        ["fileName", "uploadedFileName"]
      );

      return uploaded || fileName.length > 0;
    });

  const recognisedPatterns = patterns.filter((pattern) =>
    readBoolean(
      pattern,
      ["recognised", "recognized"],
      false
    )
  );

  const geometryPatterns = patterns.filter((pattern) => {
    return (
      readBoolean(
        pattern,
        [
          "geometryCompleted",
          "geometryReady",
          "geometryCreated",
        ],
        false
      ) ||
      isRecord(pattern.geometry)
    );
  });

  const markerReadyPatterns = patterns.filter((pattern) =>
    readBoolean(
      pattern,
      ["markerReady", "readyForMarker"],
      false
    )
  );

  const projectCreatedScore = 10;

  const patternUploadScore =
    totalPatterns > 0
      ? (uploadedPatterns.length / totalPatterns) * 25
      : 0;

  const recognitionScore =
    totalPatterns > 0
      ? (recognisedPatterns.length / totalPatterns) * 20
      : 0;

  const geometryScore =
    totalPatterns > 0
      ? (geometryPatterns.length / totalPatterns) * 20
      : 0;

  const markerScore =
    totalPatterns > 0
      ? (markerReadyPatterns.length / totalPatterns) * 15
      : 0;

  const reportScore =
    readBoolean(
      project,
      [
        "engineeringReportCompleted",
        "reportCompleted",
        "reportReady",
      ],
      false
    )
      ? 10
      : 0;

  const completionPercentage = clampPercentage(
    projectCreatedScore +
      patternUploadScore +
      recognitionScore +
      geometryScore +
      markerScore +
      reportScore
  );

  return {
    totalPatterns,
    requiredPatterns: requiredPatterns.length,
    uploadedPatterns: uploadedPatterns.length,
    uploadedRequiredPatterns:
      uploadedRequiredPatterns.length,
    recognisedPatterns: recognisedPatterns.length,
    geometryPatterns: geometryPatterns.length,
    markerReadyPatterns: markerReadyPatterns.length,
    completionPercentage,
  };
}

function determineProjectStatus(
  project: UnknownRecord,
  progress: ProjectRegistryProgress
): ProjectRegistryStatus {
  if (
    readBoolean(project, ["archived"], false)
  ) {
    return "archived";
  }

  if (
    readBoolean(
      project,
      ["projectCompleted", "completed"],
      false
    )
  ) {
    return "completed";
  }

  if (
    readBoolean(
      project,
      [
        "engineeringReportCompleted",
        "reportCompleted",
        "reportReady",
      ],
      false
    )
  ) {
    return "report-ready";
  }

  if (
    readBoolean(
      project,
      [
        "fabricConsumptionCompleted",
        "consumptionCompleted",
      ],
      false
    )
  ) {
    return "fabric-consumption";
  }

  if (
    readBoolean(
      project,
      [
        "markerPlanningCompleted",
        "markerCompleted",
        "markerReady",
      ],
      false
    ) ||
    progress.markerReadyPatterns > 0
  ) {
    return "marker-planning";
  }

  if (
    readBoolean(
      project,
      ["geometryCompleted"],
      false
    ) ||
    progress.geometryPatterns > 0
  ) {
    return "geometry";
  }

  if (
    readBoolean(
      project,
      [
        "patternRecognitionCompleted",
        "recognitionCompleted",
      ],
      false
    ) ||
    progress.recognisedPatterns > 0
  ) {
    return "pattern-recognition";
  }

  if (
    readBoolean(
      project,
      ["patternValidationCompleted"],
      false
    )
  ) {
    return "pattern-validation";
  }

  if (progress.uploadedPatterns > 0) {
    return "pattern-upload";
  }

  return "draft";
}

export function getProjectStageLabel(
  status: ProjectRegistryStatus
) {
  const labels: Record<
    ProjectRegistryStatus,
    string
  > = {
    draft: "Project Created",
    "pattern-upload": "Pattern Upload",
    "pattern-validation": "Pattern Validation",
    "pattern-recognition": "AI Pattern Recognition",
    geometry: "Pattern Geometry",
    "marker-planning": "Marker Planning",
    "fabric-consumption": "Fabric Consumption",
    "report-ready": "Engineering Report Ready",
    completed: "Completed",
    archived: "Archived",
  };

  return labels[status];
}

export function getProjectRegistry(): ProjectRegistryEntry[] {
  if (!canUseBrowserStorage()) {
    return [];
  }

  try {
    const storedRegistry =
      window.localStorage.getItem(
        PROJECT_REGISTRY_STORAGE_KEY
      );

    if (!storedRegistry) {
      return [];
    }

    const parsedRegistry: unknown =
      JSON.parse(storedRegistry);

    if (!Array.isArray(parsedRegistry)) {
      return [];
    }

    const validEntries =
      parsedRegistry.filter(
        (entry): entry is ProjectRegistryEntry =>
          isRecord(entry) &&
          typeof entry.projectId === "string" &&
          typeof entry.projectCode === "string"
      );

    return sortRegistryEntries(validEntries);
  } catch (error) {
    console.error(
      "Unable to read OptiFabric project registry:",
      error
    );

    return [];
  }
}

export function saveProjectRegistry(
  entries: ProjectRegistryEntry[]
) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(
    PROJECT_REGISTRY_STORAGE_KEY,
    JSON.stringify(sortRegistryEntries(entries))
  );
}

function extractProjectSequence(
  projectCode: string
) {
  const match = projectCode.match(
    /^OF-\d{4}-(\d+)$/
  );

  if (!match) {
    return 0;
  }

  const sequence = Number(match[1]);

  return Number.isFinite(sequence)
    ? sequence
    : 0;
}

export function generateProjectCode(
  registry = getProjectRegistry(),
  date = new Date()
) {
  const year = date.getFullYear();

  const currentYearSequences = registry
    .filter((entry) =>
      entry.projectCode.startsWith(`OF-${year}-`)
    )
    .map((entry) =>
      extractProjectSequence(entry.projectCode)
    );

  const highestSequence =
    currentYearSequences.length > 0
      ? Math.max(...currentYearSequences)
      : 0;

  const nextSequence = highestSequence + 1;

  return `OF-${year}-${String(
    nextSequence
  ).padStart(6, "0")}`;
}

export function createRegistryEntryFromProject(
  projectData: unknown,
  existingProjectCode?: string
): ProjectRegistryEntry {
  if (!isRecord(projectData)) {
    throw new Error(
      "A valid OptiFabric engineering project is required."
    );
  }

  const projectId = readString(
    projectData,
    ["id", "projectId"]
  );

  if (!projectId) {
    throw new Error(
      "The engineering project does not contain a project ID."
    );
  }

  const existingEntry = getProjectRegistry().find(
    (entry) => entry.projectId === projectId
  );

  const now = new Date().toISOString();

  const createdAt = normaliseDate(
    projectData.createdAt,
    existingEntry?.createdAt ?? now
  );

  const updatedAt = normaliseDate(
    projectData.updatedAt,
    now
  );

  const progress =
    calculateProjectProgress(projectData);

  const status =
    determineProjectStatus(projectData, progress);

  const projectCode =
    existingProjectCode ||
    readString(projectData, ["projectCode"]) ||
    existingEntry?.projectCode ||
    generateProjectCode();

  return {
    projectId,
    projectCode,
    projectName: readString(
      projectData,
      ["projectName", "name"],
      "Untitled Engineering Project"
    ),

    customerFactory: readString(
  projectData,
  [
    "customer",
    "customerFactory",
    "customerOrFactory",
    "factoryName",
    "customerName",
  ],
  "Not specified"
),

    buyerName:
      readString(
        projectData,
        ["buyerName", "buyer"]
      ) || undefined,

    styleNumber: readString(
      projectData,
      ["styleNumber", "styleNo"],
      "Not specified"
    ),

    orderNumber:
      readString(
        projectData,
        ["orderNumber", "orderNo", "poNumber"]
      ) || undefined,

    mainCategory: formatProjectLabel(
  readString(
    projectData,
    [
      "garmentMainCategory",
      "mainCategory",
      "category",
    ]
  )
),

subcategory: formatProjectLabel(
  readString(
    projectData,
    [
      "garmentSubcategory",
      "subcategory",
      "subCategory",
    ]
  )
),

garmentType: formatProjectLabel(
  readString(
    projectData,
    [
      "garmentCategory",
      "garmentType",
      "garment",
      "productType",
    ]
  )
),

    orderQuantity: readNumber(
      projectData,
      ["orderQuantity", "quantity"]
    ),

    fabricWidth: readNumber(
      projectData,
      ["fabricWidth", "fabricWidthInches"]
    ),

    calibrationScale: readNumber(
  projectData,
  [
    "scaleLength",
    "calibrationScale",
    "calibrationScaleInches",
    "scaleInches",
  ]
),

    status,
    currentStage: getProjectStageLabel(status),

    progress,

    createdAt,
    updatedAt,
    lastOpenedAt:
      existingEntry?.lastOpenedAt,

    archived: status === "archived",
    archivedAt:
      status === "archived"
        ? existingEntry?.archivedAt ?? now
        : undefined,
  };
}

export function registerProject(
  projectData: unknown
) {
  const registry = getProjectRegistry();

  if (!isRecord(projectData)) {
    throw new Error(
      "Unable to register invalid project data."
    );
  }

  const projectId = readString(
    projectData,
    ["id", "projectId"]
  );

  const existingEntry = registry.find(
    (entry) => entry.projectId === projectId
  );

  const registryEntry =
    createRegistryEntryFromProject(
      projectData,
      existingEntry?.projectCode
    );

  const updatedRegistry = existingEntry
    ? registry.map((entry) =>
        entry.projectId === registryEntry.projectId
          ? registryEntry
          : entry
      )
    : [...registry, registryEntry];

  saveProjectRegistry(updatedRegistry);

  return registryEntry;
}

export function updateProjectRegistryEntry(
  projectData: unknown
) {
  return registerProject(projectData);
}

export function markProjectAsOpened(
  projectId: string
) {
  const registry = getProjectRegistry();
  const now = new Date().toISOString();

  const updatedRegistry = registry.map((entry) =>
    entry.projectId === projectId
      ? {
          ...entry,
          lastOpenedAt: now,
          updatedAt: now,
        }
      : entry
  );

  saveProjectRegistry(updatedRegistry);

  return updatedRegistry.find(
    (entry) => entry.projectId === projectId
  );
}

export function archiveProject(
  projectId: string
) {
  const registry = getProjectRegistry();
  const now = new Date().toISOString();

  const updatedRegistry = registry.map((entry) =>
    entry.projectId === projectId
      ? {
          ...entry,
          status: "archived" as const,
          currentStage:
            getProjectStageLabel("archived"),
          archived: true,
          archivedAt: now,
          updatedAt: now,
        }
      : entry
  );

  saveProjectRegistry(updatedRegistry);

  return updatedRegistry.find(
    (entry) => entry.projectId === projectId
  );
}

export function restoreProject(
  projectId: string
) {
  if (!canUseBrowserStorage()) {
    return undefined;
  }

  const storedProject =
    window.localStorage.getItem(
      `${PROJECT_STORAGE_KEY_PREFIX}${projectId}`
    );

  if (!storedProject) {
    return undefined;
  }

  try {
    const parsedProject: unknown =
      JSON.parse(storedProject);

    if (!isRecord(parsedProject)) {
      return undefined;
    }

    const restoredProject = {
      ...parsedProject,
      archived: false,
      archivedAt: undefined,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      `${PROJECT_STORAGE_KEY_PREFIX}${projectId}`,
      JSON.stringify(restoredProject)
    );

    return registerProject(restoredProject);
  } catch (error) {
    console.error(
      "Unable to restore OptiFabric project:",
      error
    );

    return undefined;
  }
}

export function removeProjectFromRegistry(
  projectId: string
) {
  const registry = getProjectRegistry();

  const updatedRegistry = registry.filter(
    (entry) => entry.projectId !== projectId
  );

  saveProjectRegistry(updatedRegistry);
}

export function permanentlyDeleteProject(
  projectId: string
) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(
    `${PROJECT_STORAGE_KEY_PREFIX}${projectId}`
  );

  removeProjectFromRegistry(projectId);
}

export function getRegistryProject(
  projectId: string
) {
  return getProjectRegistry().find(
    (entry) => entry.projectId === projectId
  );
}

export function searchProjectRegistry(
  options: ProjectRegistrySearchOptions = {}
) {
  const {
    query = "",
    status = "all",
    mainCategory = "all",
    garmentType = "all",
    createdFrom,
    createdTo,
    archived = "all",
  } = options;

  const normalisedQuery =
    query.trim().toLowerCase();

  return getProjectRegistry().filter((entry) => {
    const searchableValues = [
      entry.projectCode,
      entry.projectId,
      entry.projectName,
      entry.customerFactory,
      entry.buyerName,
      entry.styleNumber,
      entry.orderNumber,
      entry.mainCategory,
      entry.subcategory,
      entry.garmentType,
      entry.currentStage,
    ]
      .filter(
        (value): value is string =>
          typeof value === "string"
      )
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      normalisedQuery.length === 0 ||
      searchableValues.includes(normalisedQuery);

    const matchesStatus =
      status === "all" ||
      entry.status === status;

    const matchesMainCategory =
      mainCategory === "all" ||
      entry.mainCategory === mainCategory;

    const matchesGarmentType =
      garmentType === "all" ||
      entry.garmentType === garmentType;

    const matchesArchived =
      archived === "all" ||
      entry.archived === archived;

    const createdTime =
      new Date(entry.createdAt).getTime();

    const matchesCreatedFrom =
      !createdFrom ||
      createdTime >=
        new Date(createdFrom).getTime();

    const matchesCreatedTo =
      !createdTo ||
      createdTime <=
        new Date(
          `${createdTo}T23:59:59.999`
        ).getTime();

    return (
      matchesQuery &&
      matchesStatus &&
      matchesMainCategory &&
      matchesGarmentType &&
      matchesArchived &&
      matchesCreatedFrom &&
      matchesCreatedTo
    );
  });
}

export function migrateExistingProjectsToRegistry() {
  if (!canUseBrowserStorage()) {
    return [];
  }

  const migratedEntries: ProjectRegistryEntry[] = [];

  for (
    let index = 0;
    index < window.localStorage.length;
    index += 1
  ) {
    const storageKey =
      window.localStorage.key(index);

    if (
      !storageKey ||
      !storageKey.startsWith(
        PROJECT_STORAGE_KEY_PREFIX
      ) ||
      storageKey ===
        PROJECT_REGISTRY_STORAGE_KEY
    ) {
      continue;
    }

    const storedProject =
      window.localStorage.getItem(storageKey);

    if (!storedProject) {
      continue;
    }

    try {
      const parsedProject: unknown =
        JSON.parse(storedProject);

      if (!isRecord(parsedProject)) {
        continue;
      }

      const registryEntry =
        registerProject(parsedProject);

      migratedEntries.push(registryEntry);
    } catch (error) {
      console.error(
        `Unable to migrate project from ${storageKey}:`,
        error
      );
    }
  }

  return sortRegistryEntries(migratedEntries);
}

export function getProjectRegistryStatistics() {
  const registry = getProjectRegistry();

  const activeProjects = registry.filter(
    (entry) => !entry.archived
  );

  const today = new Date();

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);

  const monthStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  ).getTime();

  return {
    totalProjects: registry.length,

    activeProjects: activeProjects.length,

    archivedProjects: registry.filter(
      (entry) => entry.archived
    ).length,

    projectsToday: registry.filter(
      (entry) =>
        new Date(entry.createdAt).getTime() >=
        todayStart
    ).length,

    projectsThisWeek: registry.filter(
      (entry) =>
        new Date(entry.createdAt).getTime() >=
        weekStart.getTime()
    ).length,

    projectsThisMonth: registry.filter(
      (entry) =>
        new Date(entry.createdAt).getTime() >=
        monthStart
    ).length,

    drafts: activeProjects.filter(
      (entry) => entry.status === "draft"
    ).length,

    patternUpload: activeProjects.filter(
      (entry) =>
        entry.status === "pattern-upload" ||
        entry.status === "pattern-validation"
    ).length,

    recognition: activeProjects.filter(
      (entry) =>
        entry.status === "pattern-recognition"
    ).length,

    geometry: activeProjects.filter(
      (entry) => entry.status === "geometry"
    ).length,

    markerPlanning: activeProjects.filter(
      (entry) =>
        entry.status === "marker-planning"
    ).length,

    completed: activeProjects.filter(
      (entry) =>
        entry.status === "completed" ||
        entry.status === "report-ready"
    ).length,
  };
}