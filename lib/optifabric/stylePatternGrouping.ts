export type StylePatternMaterialCategory =
  | "Main Fabric"
  | "Contrast Fabric"
  | "Lining"
  | "Interlining"
  | "Fusible"
  | "Reinforcement"
  | "Decorative"
  | "Accessory"
  | "Guide Only"
  | "Other";

export type StylePatternGroupId =
  | "main-fabric"
  | "contrast-fabric"
  | "lining"
  | "interlining"
  | "fusible"
  | "reinforcement"
  | "decorative"
  | "accessory"
  | "guide-only"
  | "custom"
  | "other";

export interface StylePatternGroupingSource {
  id: string;
  name: string;

  sequence?: number;
  description?: string;

  custom?: boolean;
  required?: boolean;
  uploaded?: boolean;
  recognised?: boolean;

  cutQuantity?: number;
  cutOnFold?: boolean;

  materialCategory?: string;

  includedInStyle?: boolean;
  includeInMarker?: boolean;

  styleMaterialCategory?: string;
  styleCutQuantity?: number;
  styleCutOnFold?: boolean;
  styleRequired?: boolean;
  styleSelectionNotes?: string;

  validationPassed?: boolean;
}

export interface StylePatternGroupTheme {
  borderClass: string;
  backgroundClass: string;
  headerBackgroundClass: string;
  titleClass: string;
  badgeClass: string;
  buttonClass: string;
  accentClass: string;
}

export interface StylePatternGroupDefinition {
  id: StylePatternGroupId;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  order: number;
  materialCategory?: StylePatternMaterialCategory;
  theme: StylePatternGroupTheme;
}

export interface StylePatternGroupStatistics {
  totalPatterns: number;
  uploadedPatterns: number;
  validatedPatterns: number;
  includedPatterns: number;
  excludedPatterns: number;
  markerPatterns: number;
  nonMarkerPatterns: number;
  requiredPatterns: number;
  optionalPatterns: number;
  customPatterns: number;
  cutOnFoldPatterns: number;
  totalCutQuantity: number;
  missingUploadPatterns: number;
  invalidQuantityPatterns: number;
  readyForMarkerPatterns: number;
  completionPercentage: number;
}

export interface StylePatternGroup<
  TPattern extends StylePatternGroupingSource =
    StylePatternGroupingSource,
> {
  definition: StylePatternGroupDefinition;
  patterns: TPattern[];
  statistics: StylePatternGroupStatistics;
}

export interface GroupStylePatternsOptions {
  includeEmptyGroups?: boolean;
  separateCustomPatterns?: boolean;
  customGroupFirst?: boolean;
  sortPatterns?: boolean;
}

export interface StylePatternWorkspaceStatistics {
  totalPatterns: number;
  totalGroups: number;
  nonEmptyGroups: number;

  uploadedPatterns: number;
  validatedPatterns: number;

  includedPatterns: number;
  excludedPatterns: number;

  markerPatterns: number;
  nonMarkerPatterns: number;

  mainFabricPatterns: number;
  contrastFabricPatterns: number;
  liningPatterns: number;
  interliningPatterns: number;
  fusiblePatterns: number;
  reinforcementPatterns: number;
  decorativePatterns: number;
  accessoryPatterns: number;
  guidePatterns: number;
  customPatterns: number;
  otherPatterns: number;

  totalCutQuantity: number;
  missingUploadPatterns: number;
  invalidQuantityPatterns: number;
  completionPercentage: number;
}

export const stylePatternMaterialCategories:
  StylePatternMaterialCategory[] = [
    "Main Fabric",
    "Contrast Fabric",
    "Lining",
    "Interlining",
    "Fusible",
    "Reinforcement",
    "Decorative",
    "Accessory",
    "Guide Only",
    "Other",
  ];

export const stylePatternGroupDefinitions:
  StylePatternGroupDefinition[] = [
    {
      id: "main-fabric",
      label: "Main Fabric",
      shortLabel: "Main",
      description:
        "Primary shell pattern pieces that consume the garment's principal fabric.",
      icon: "🟢",
      order: 10,
      materialCategory: "Main Fabric",
      theme: {
        borderClass: "border-emerald-400/30",
        backgroundClass: "bg-emerald-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-emerald-950/60 to-slate-950",
        titleClass: "text-emerald-300",
        badgeClass:
          "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
        buttonClass:
          "border-emerald-400/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/40",
        accentClass: "accent-emerald-400",
      },
    },
    {
      id: "contrast-fabric",
      label: "Contrast Fabric",
      shortLabel: "Contrast",
      description:
        "Pattern pieces cut from contrast, secondary or colour-block fabric.",
      icon: "🔵",
      order: 20,
      materialCategory: "Contrast Fabric",
      theme: {
        borderClass: "border-blue-400/30",
        backgroundClass: "bg-blue-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-blue-950/60 to-slate-950",
        titleClass: "text-blue-300",
        badgeClass:
          "border-blue-400/30 bg-blue-500/10 text-blue-300",
        buttonClass:
          "border-blue-400/30 bg-blue-950/30 text-blue-300 hover:bg-blue-900/40",
        accentClass: "accent-blue-400",
      },
    },
    {
      id: "lining",
      label: "Lining",
      shortLabel: "Lining",
      description:
        "Pattern pieces belonging to garment lining or internal covering materials.",
      icon: "🩵",
      order: 30,
      materialCategory: "Lining",
      theme: {
        borderClass: "border-cyan-400/30",
        backgroundClass: "bg-cyan-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-cyan-950/60 to-slate-950",
        titleClass: "text-cyan-300",
        badgeClass:
          "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
        buttonClass:
          "border-cyan-400/30 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/40",
        accentClass: "accent-cyan-400",
      },
    },
    {
      id: "interlining",
      label: "Interlining",
      shortLabel: "Interlining",
      description:
        "Structural internal pieces that support shape, stability and garment construction.",
      icon: "🟡",
      order: 40,
      materialCategory: "Interlining",
      theme: {
        borderClass: "border-amber-400/30",
        backgroundClass: "bg-amber-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-amber-950/60 to-slate-950",
        titleClass: "text-amber-300",
        badgeClass:
          "border-amber-400/30 bg-amber-500/10 text-amber-300",
        buttonClass:
          "border-amber-400/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40",
        accentClass: "accent-amber-400",
      },
    },
    {
      id: "fusible",
      label: "Fusible",
      shortLabel: "Fusible",
      description:
        "Components cut from fusible material and bonded to garment pattern pieces.",
      icon: "🟠",
      order: 50,
      materialCategory: "Fusible",
      theme: {
        borderClass: "border-orange-400/30",
        backgroundClass: "bg-orange-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-orange-950/60 to-slate-950",
        titleClass: "text-orange-300",
        badgeClass:
          "border-orange-400/30 bg-orange-500/10 text-orange-300",
        buttonClass:
          "border-orange-400/30 bg-orange-950/30 text-orange-300 hover:bg-orange-900/40",
        accentClass: "accent-orange-400",
      },
    },
    {
      id: "reinforcement",
      label: "Reinforcement",
      shortLabel: "Reinforcement",
      description:
        "Support pieces used to strengthen stress areas, hems, openings or attachment points.",
      icon: "🟥",
      order: 60,
      materialCategory: "Reinforcement",
      theme: {
        borderClass: "border-red-400/30",
        backgroundClass: "bg-red-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-red-950/60 to-slate-950",
        titleClass: "text-red-300",
        badgeClass:
          "border-red-400/30 bg-red-500/10 text-red-300",
        buttonClass:
          "border-red-400/30 bg-red-950/30 text-red-300 hover:bg-red-900/40",
        accentClass: "accent-red-400",
      },
    },
    {
      id: "decorative",
      label: "Decorative",
      shortLabel: "Decorative",
      description:
        "Visible design components used for styling, decoration or premium detailing.",
      icon: "🩷",
      order: 70,
      materialCategory: "Decorative",
      theme: {
        borderClass: "border-pink-400/30",
        backgroundClass: "bg-pink-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-pink-950/60 to-slate-950",
        titleClass: "text-pink-300",
        badgeClass:
          "border-pink-400/30 bg-pink-500/10 text-pink-300",
        buttonClass:
          "border-pink-400/30 bg-pink-950/30 text-pink-300 hover:bg-pink-900/40",
        accentClass: "accent-pink-400",
      },
    },
    {
      id: "accessory",
      label: "Accessory",
      shortLabel: "Accessory",
      description:
        "Pattern-controlled accessory, trim or supporting components associated with the style.",
      icon: "🟤",
      order: 80,
      materialCategory: "Accessory",
      theme: {
        borderClass: "border-yellow-700/40",
        backgroundClass: "bg-yellow-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-yellow-950/60 to-slate-950",
        titleClass: "text-yellow-200",
        badgeClass:
          "border-yellow-700/40 bg-yellow-500/10 text-yellow-200",
        buttonClass:
          "border-yellow-700/40 bg-yellow-950/30 text-yellow-200 hover:bg-yellow-900/40",
        accentClass: "accent-yellow-600",
      },
    },
    {
      id: "guide-only",
      label: "Guides and Placement Templates",
      shortLabel: "Guides",
      description:
        "Non-consuming placement, marking or construction guides excluded from fabric markers.",
      icon: "🟣",
      order: 90,
      materialCategory: "Guide Only",
      theme: {
        borderClass: "border-violet-400/30",
        backgroundClass: "bg-violet-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-violet-950/60 to-slate-950",
        titleClass: "text-violet-300",
        badgeClass:
          "border-violet-400/30 bg-violet-500/10 text-violet-300",
        buttonClass:
          "border-violet-400/30 bg-violet-950/30 text-violet-300 hover:bg-violet-900/40",
        accentClass: "accent-violet-400",
      },
    },
    {
      id: "custom",
      label: "Custom Pattern Pieces",
      shortLabel: "Custom",
      description:
        "Style-specific pieces added beyond the standard garment pattern master.",
      icon: "⭐",
      order: 100,
      theme: {
        borderClass: "border-fuchsia-400/30",
        backgroundClass: "bg-fuchsia-950/10",
        headerBackgroundClass:
          "bg-gradient-to-r from-fuchsia-950/60 to-slate-950",
        titleClass: "text-fuchsia-300",
        badgeClass:
          "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-300",
        buttonClass:
          "border-fuchsia-400/30 bg-fuchsia-950/30 text-fuchsia-300 hover:bg-fuchsia-900/40",
        accentClass: "accent-fuchsia-400",
      },
    },
    {
      id: "other",
      label: "Other Pattern Pieces",
      shortLabel: "Other",
      description:
        "Unclassified or specialist pieces requiring engineering review.",
      icon: "⚪",
      order: 110,
      materialCategory: "Other",
      theme: {
        borderClass: "border-slate-500/40",
        backgroundClass: "bg-slate-900/70",
        headerBackgroundClass:
          "bg-gradient-to-r from-slate-800 to-slate-950",
        titleClass: "text-slate-300",
        badgeClass:
          "border-slate-500/40 bg-slate-700/30 text-slate-300",
        buttonClass:
          "border-slate-500/40 bg-slate-900 text-slate-300 hover:bg-slate-800",
        accentClass: "accent-slate-400",
      },
    },
  ];

const groupDefinitionMap = new Map<
  StylePatternGroupId,
  StylePatternGroupDefinition
>(
  stylePatternGroupDefinitions.map((definition) => [
    definition.id,
    definition,
  ])
);

export function normaliseStylePatternMaterialCategory(
  category?: string
): StylePatternMaterialCategory {
  const cleanCategory = category?.trim().toLowerCase();

  if (!cleanCategory) {
    return "Main Fabric";
  }

  const matchedCategory =
    stylePatternMaterialCategories.find(
      (materialCategory) =>
        materialCategory.toLowerCase() === cleanCategory
    );

  return matchedCategory ?? "Other";
}

export function getStylePatternMaterialCategory(
  pattern: StylePatternGroupingSource
): StylePatternMaterialCategory {
  return normaliseStylePatternMaterialCategory(
    pattern.styleMaterialCategory ??
      pattern.materialCategory
  );
}

export function getStylePatternGroupDefinition(
  groupId: StylePatternGroupId
): StylePatternGroupDefinition {
  return (
    groupDefinitionMap.get(groupId) ??
    groupDefinitionMap.get("other")!
  );
}

export function getStylePatternGroupId(
  pattern: StylePatternGroupingSource,
  options: Pick<
    GroupStylePatternsOptions,
    "separateCustomPatterns"
  > = {}
): StylePatternGroupId {
  const separateCustomPatterns =
    options.separateCustomPatterns ?? true;

  if (separateCustomPatterns && pattern.custom) {
    return "custom";
  }

  const materialCategory =
    getStylePatternMaterialCategory(pattern);

  switch (materialCategory) {
    case "Main Fabric":
      return "main-fabric";

    case "Contrast Fabric":
      return "contrast-fabric";

    case "Lining":
      return "lining";

    case "Interlining":
      return "interlining";

    case "Fusible":
      return "fusible";

    case "Reinforcement":
      return "reinforcement";

    case "Decorative":
      return "decorative";

    case "Accessory":
      return "accessory";

    case "Guide Only":
      return "guide-only";

    case "Other":
    default:
      return "other";
  }
}

export function isStylePatternIncluded(
  pattern: StylePatternGroupingSource
): boolean {
  return (
    pattern.includedInStyle ??
    pattern.uploaded ??
    pattern.required ??
    false
  );
}

export function isStylePatternInMarker(
  pattern: StylePatternGroupingSource
): boolean {
  if (!isStylePatternIncluded(pattern)) {
    return false;
  }

  if (
    getStylePatternMaterialCategory(pattern) ===
    "Guide Only"
  ) {
    return false;
  }

  return pattern.includeInMarker ?? true;
}

export function isStylePatternRequired(
  pattern: StylePatternGroupingSource
): boolean {
  return (
    pattern.styleRequired ??
    pattern.required ??
    false
  );
}

export function isStylePatternCutOnFold(
  pattern: StylePatternGroupingSource
): boolean {
  return (
    pattern.styleCutOnFold ??
    pattern.cutOnFold ??
    false
  );
}

export function getStylePatternCutQuantity(
  pattern: StylePatternGroupingSource
): number {
  return (
    pattern.styleCutQuantity ??
    pattern.cutQuantity ??
    1
  );
}

export function isValidStylePatternCutQuantity(
  pattern: StylePatternGroupingSource
): boolean {
  const quantity =
    getStylePatternCutQuantity(pattern);

  return (
    Number.isInteger(quantity) &&
    quantity >= 1 &&
    quantity <= 99
  );
}

export function isStylePatternReadyForMarker(
  pattern: StylePatternGroupingSource
): boolean {
  return (
    isStylePatternIncluded(pattern) &&
    isStylePatternInMarker(pattern) &&
    pattern.uploaded === true &&
    isValidStylePatternCutQuantity(pattern)
  );
}

export function sortStylePatterns<
  TPattern extends StylePatternGroupingSource,
>(patterns: TPattern[]): TPattern[] {
  return [...patterns].sort((first, second) => {
    const firstSequence =
      first.sequence ??
      Number.MAX_SAFE_INTEGER;

    const secondSequence =
      second.sequence ??
      Number.MAX_SAFE_INTEGER;

    if (firstSequence !== secondSequence) {
      return firstSequence - secondSequence;
    }

    return first.name.localeCompare(
      second.name,
      undefined,
      {
        numeric: true,
        sensitivity: "base",
      }
    );
  });
}

export function calculateStylePatternGroupStatistics<
  TPattern extends StylePatternGroupingSource,
>(
  patterns: TPattern[]
): StylePatternGroupStatistics {
  const totalPatterns = patterns.length;

  const uploadedPatterns =
    patterns.filter(
      (pattern) => pattern.uploaded === true
    ).length;

  const validatedPatterns =
    patterns.filter(
      (pattern) =>
        pattern.validationPassed === true
    ).length;

  const includedPatterns =
    patterns.filter(isStylePatternIncluded);

  const markerPatterns =
    includedPatterns.filter(
      isStylePatternInMarker
    );

  const requiredPatterns =
    includedPatterns.filter(
      isStylePatternRequired
    );

  const customPatterns =
    patterns.filter(
      (pattern) => pattern.custom === true
    ).length;

  const cutOnFoldPatterns =
    markerPatterns.filter(
      isStylePatternCutOnFold
    ).length;

  const totalCutQuantity =
    markerPatterns.reduce(
      (total, pattern) =>
        total +
        (isValidStylePatternCutQuantity(pattern)
          ? getStylePatternCutQuantity(pattern)
          : 0),
      0
    );

  const missingUploadPatterns =
    includedPatterns.filter(
      (pattern) => pattern.uploaded !== true
    ).length;

  const invalidQuantityPatterns =
    markerPatterns.filter(
      (pattern) =>
        !isValidStylePatternCutQuantity(pattern)
    ).length;

  const readyForMarkerPatterns =
    markerPatterns.filter(
      isStylePatternReadyForMarker
    ).length;

  const completionPercentage =
    includedPatterns.length > 0
      ? Math.round(
          ((includedPatterns.length -
            missingUploadPatterns) /
            includedPatterns.length) *
            100
        )
      : 0;

  return {
    totalPatterns,
    uploadedPatterns,
    validatedPatterns,
    includedPatterns:
      includedPatterns.length,
    excludedPatterns:
      totalPatterns - includedPatterns.length,
    markerPatterns: markerPatterns.length,
    nonMarkerPatterns:
      includedPatterns.length -
      markerPatterns.length,
    requiredPatterns:
      requiredPatterns.length,
    optionalPatterns:
      includedPatterns.length -
      requiredPatterns.length,
    customPatterns,
    cutOnFoldPatterns,
    totalCutQuantity,
    missingUploadPatterns,
    invalidQuantityPatterns,
    readyForMarkerPatterns,
    completionPercentage,
  };
}

export function groupStylePatterns<
  TPattern extends StylePatternGroupingSource,
>(
  patterns: TPattern[],
  options: GroupStylePatternsOptions = {}
): StylePatternGroup<TPattern>[] {
  const {
    includeEmptyGroups = false,
    separateCustomPatterns = true,
    customGroupFirst = false,
    sortPatterns = true,
  } = options;

  const groupedPatterns = new Map<
    StylePatternGroupId,
    TPattern[]
  >();

  stylePatternGroupDefinitions.forEach(
    (definition) => {
      groupedPatterns.set(definition.id, []);
    }
  );

  patterns.forEach((pattern) => {
    const groupId =
      getStylePatternGroupId(pattern, {
        separateCustomPatterns,
      });

    const currentGroup =
      groupedPatterns.get(groupId) ?? [];

    currentGroup.push(pattern);
    groupedPatterns.set(groupId, currentGroup);
  });

  return stylePatternGroupDefinitions
    .map((definition) => {
      const groupPatterns =
        groupedPatterns.get(definition.id) ?? [];

      const preparedPatterns =
        sortPatterns
          ? sortStylePatterns(groupPatterns)
          : [...groupPatterns];

      return {
        definition,
        patterns: preparedPatterns,
        statistics:
          calculateStylePatternGroupStatistics(
            preparedPatterns
          ),
      };
    })
    .filter(
      (group) =>
        includeEmptyGroups ||
        group.patterns.length > 0
    )
    .sort((first, second) => {
      if (customGroupFirst) {
        if (
          first.definition.id === "custom" &&
          second.definition.id !== "custom"
        ) {
          return -1;
        }

        if (
          second.definition.id === "custom" &&
          first.definition.id !== "custom"
        ) {
          return 1;
        }
      }

      return (
        first.definition.order -
        second.definition.order
      );
    });
}

export function calculateStylePatternWorkspaceStatistics<
  TPattern extends StylePatternGroupingSource,
>(
  patterns: TPattern[],
  groups?: StylePatternGroup<TPattern>[]
): StylePatternWorkspaceStatistics {
  const preparedGroups =
    groups ??
    groupStylePatterns(patterns, {
      includeEmptyGroups: false,
      separateCustomPatterns: true,
    });

  const overallStatistics =
    calculateStylePatternGroupStatistics(patterns);

  const countByGroup = (
    groupId: StylePatternGroupId
  ) =>
    preparedGroups.find(
      (group) =>
        group.definition.id === groupId
    )?.statistics.totalPatterns ?? 0;

  return {
    totalPatterns:
      overallStatistics.totalPatterns,

    totalGroups:
      stylePatternGroupDefinitions.length,

    nonEmptyGroups:
      preparedGroups.filter(
        (group) => group.patterns.length > 0
      ).length,

    uploadedPatterns:
      overallStatistics.uploadedPatterns,

    validatedPatterns:
      overallStatistics.validatedPatterns,

    includedPatterns:
      overallStatistics.includedPatterns,

    excludedPatterns:
      overallStatistics.excludedPatterns,

    markerPatterns:
      overallStatistics.markerPatterns,

    nonMarkerPatterns:
      overallStatistics.nonMarkerPatterns,

    mainFabricPatterns:
      countByGroup("main-fabric"),

    contrastFabricPatterns:
      countByGroup("contrast-fabric"),

    liningPatterns:
      countByGroup("lining"),

    interliningPatterns:
      countByGroup("interlining"),

    fusiblePatterns:
      countByGroup("fusible"),

    reinforcementPatterns:
      countByGroup("reinforcement"),

    decorativePatterns:
      countByGroup("decorative"),

    accessoryPatterns:
      countByGroup("accessory"),

    guidePatterns:
      countByGroup("guide-only"),

    customPatterns:
      countByGroup("custom"),

    otherPatterns:
      countByGroup("other"),

    totalCutQuantity:
      overallStatistics.totalCutQuantity,

    missingUploadPatterns:
      overallStatistics.missingUploadPatterns,

    invalidQuantityPatterns:
      overallStatistics.invalidQuantityPatterns,

    completionPercentage:
      overallStatistics.completionPercentage,
  };
}

export function findStylePatternGroup<
  TPattern extends StylePatternGroupingSource,
>(
  groups: StylePatternGroup<TPattern>[],
  groupId: StylePatternGroupId
): StylePatternGroup<TPattern> | undefined {
  return groups.find(
    (group) =>
      group.definition.id === groupId
  );
}

export function getStylePatternIds<
  TPattern extends StylePatternGroupingSource,
>(
  group: StylePatternGroup<TPattern>
): string[] {
  return group.patterns.map(
    (pattern) => pattern.id
  );
}

export function getMarkerEligibleStylePatterns<
  TPattern extends StylePatternGroupingSource,
>(
  patterns: TPattern[]
): TPattern[] {
  return sortStylePatterns(
    patterns.filter(isStylePatternInMarker)
  );
}

export function getIncludedStylePatterns<
  TPattern extends StylePatternGroupingSource,
>(
  patterns: TPattern[]
): TPattern[] {
  return sortStylePatterns(
    patterns.filter(isStylePatternIncluded)
  );
}

export function getGuideOnlyStylePatterns<
  TPattern extends StylePatternGroupingSource,
>(
  patterns: TPattern[]
): TPattern[] {
  return sortStylePatterns(
    patterns.filter(
      (pattern) =>
        getStylePatternMaterialCategory(
          pattern
        ) === "Guide Only"
    )
  );
}

export function getCustomStylePatterns<
  TPattern extends StylePatternGroupingSource,
>(
  patterns: TPattern[]
): TPattern[] {
  return sortStylePatterns(
    patterns.filter(
      (pattern) => pattern.custom === true
    )
  );
}

export function getStylePatternGroupSummary(
  statistics: StylePatternGroupStatistics
): string {
  return [
    `${statistics.totalPatterns} pattern type${
      statistics.totalPatterns === 1
        ? ""
        : "s"
    }`,
    `${statistics.includedPatterns} included`,
    `${statistics.markerPatterns} marker`,
    `${statistics.uploadedPatterns} uploaded`,
  ].join(" · ");
}

export default groupStylePatterns;