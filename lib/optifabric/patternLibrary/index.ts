export interface PatternLibraryItem {
  id: string;
  name: string;
  required: boolean;

  /**
   * Number of physical pattern pieces expected for the garment.
   * Example: Front = 2, Back on fold = 1.
   */
  cutQuantity: number;

  /**
   * Indicates whether the piece is normally cut on fold.
   */
  cutOnFold?: boolean;

  /**
   * Indicates whether the piece comes from the standard garment master
   * or was added manually by the user.
   */
  custom: boolean;

  /**
   * Optional engineering description shown to the user.
   */
  description?: string;

  /**
   * Display order inside the pattern-set dashboard.
   */
  sequence: number;
}

export interface ProjectPatternItem extends PatternLibraryItem {
  uploaded: boolean;
  recognised: boolean;

  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;

  scaleVisible?: boolean;
  grainLineVisible?: boolean;
  notchesVisible?: boolean;

  validationPassed?: boolean;
}

export type SupportedPatternCategory =
  | "shirt"
  | "trouser"
  | "polo"
  | "jacket"
  | "dress"
  | "tshirt"
  | "hoodie"
  | "uniform"
  | "industrial-coverall"
  | "vest"
  | "tank-top"
  | "thermal-top"
  | "thermal-legging"
  | "waistcoat"
  | "chino"
  | "cargo-trouser"
  | "jeans"
  | "shorts"
  | "skirt"
  | "raincoat"
  | "waterproof-jacket"
  | "canvas-jacket"
  | "parka"
  | "windbreaker"
  | "sweater"
  | "cardigan"
  | "knitted-cap"
  | "knitted-scarf"
  | "socks"
  | "tights"
  | "leg-warmers"
  | "baby-romper"
  | "children-hoodie"
  | "children-dress"
  | "children-tshirt"
  | "other";

/**
 * Creates a safe copy of a garment pattern master for use inside
 * an individual engineering project.
 *
 * This prevents one project from changing the original master library.
 */
export function createProjectPatternSet(
  patternLibrary: PatternLibraryItem[]
): ProjectPatternItem[] {
  return patternLibrary
    .map((pattern) => ({
      ...pattern,

      uploaded: false,
      recognised: false,

      scaleVisible: false,
      grainLineVisible: false,
      notchesVisible: false,

      validationPassed: false,
    }))
    .sort((firstPattern, secondPattern) => {
      return firstPattern.sequence - secondPattern.sequence;
    });
}

/**
 * Creates a safe copy of a pattern library.
 */
export function clonePatternLibrary(
  patternLibrary: PatternLibraryItem[]
): PatternLibraryItem[] {
  return patternLibrary
    .map((pattern) => ({
      ...pattern,
    }))
    .sort((firstPattern, secondPattern) => {
      return firstPattern.sequence - secondPattern.sequence;
    });
}

/**
 * Generates a safe ID for a custom user-added pattern piece.
 */
export function createCustomPatternId(patternName: string): string {
  const safeName = patternName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const timeStamp = Date.now();

  return `custom-${safeName || "pattern"}-${timeStamp}`;
}

/**
 * Creates a custom pattern piece using the same structure as
 * the standard engineering pattern masters.
 */
export function createCustomPatternPiece({
  name,
  required,
  cutQuantity,
  sequence,
  description,
}: {
  name: string;
  required: boolean;
  cutQuantity: number;
  sequence: number;
  description?: string;
}): ProjectPatternItem {
  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("A custom pattern piece must have a name.");
  }

  if (!Number.isFinite(cutQuantity) || cutQuantity < 1) {
    throw new Error("Custom pattern cut quantity must be at least 1.");
  }

  if (!Number.isFinite(sequence) || sequence < 1) {
    throw new Error("Custom pattern sequence must be at least 1.");
  }

  return {
    id: createCustomPatternId(cleanName),
    name: cleanName,
    required,
    cutQuantity,
    cutOnFold: false,
    custom: true,
    sequence,
    description: description?.trim() || undefined,

    uploaded: false,
    recognised: false,

    scaleVisible: false,
    grainLineVisible: false,
    notchesVisible: false,

    validationPassed: false,
  };
}

/**
 * Existing core pattern masters.
 *
 * These earlier files currently use named exports.
 */
export { shirtPatternMaster } from "./shirtPatternMaster";
export { trouserPatternMaster } from "./trouserPatternMaster";
export { poloPatternMaster } from "./poloPatternMaster";
export { jacketPatternMaster } from "./jacketPatternMaster";

export {
  womenFitAndFlareDressPatternMaster,
} from "./womenFitAndFlareDressPatternMaster";

export { hoodiePatternMaster } from "./hoodiePatternMaster";

export {
  industrialCoverallPatternMaster,
} from "./industrialCoverallPatternMaster";

export { tshirtPatternMaster } from "./tshirtPatternMaster";
export { tankTopPatternMaster } from "./tankTopPatternMaster";

/**
 * Pattern masters using default exports.
 */
export { default as vestPatternMaster } from "./vestPatternMaster";

export {
  default as thermalTopPatternMaster,
} from "./thermalTopPatternMaster";

export {
  default as thermalLeggingPatternMaster,
} from "./thermalLeggingPatternMaster";

export {
  default as waistcoatPatternMaster,
} from "./waistcoatPatternMaster";

export { default as chinoPatternMaster } from "./chinoPatternMaster";

export {
  default as cargoTrouserPatternMaster,
} from "./cargoTrouserPatternMaster";

export { default as jeansPatternMaster } from "./jeansPatternMaster";
export { default as shortsPatternMaster } from "./shortsPatternMaster";
export { default as skirtPatternMaster } from "./skirtPatternMaster";

export {
  default as raincoatPatternMaster,
} from "./raincoatPatternMaster";

export {
  default as waterproofJacketPatternMaster,
} from "./waterproofJacketPatternMaster";

export {
  default as canvasJacketPatternMaster,
} from "./canvasJacketPatternMaster";

export { default as parkaPatternMaster } from "./parkaPatternMaster";

export {
  default as windbreakerPatternMaster,
} from "./windbreakerPatternMaster";

export {
  default as sweaterPatternMaster,
} from "./sweaterPatternMaster";

export {
  default as cardiganPatternMaster,
} from "./cardiganPatternMaster";

export {
  default as knittedCapPatternMaster,
} from "./knittedCapPatternMaster";

export {
  default as knittedScarfPatternMaster,
} from "./knittedScarfPatternMaster";

export { default as socksPatternMaster } from "./socksPatternMaster";
export { default as tightsPatternMaster } from "./tightsPatternMaster";

export {
  default as legWarmersPatternMaster,
} from "./legWarmersPatternMaster";

export {
  default as babyRomperPatternMaster,
} from "./babyRomperPatternMaster";

export {
  default as childrenHoodiePatternMaster,
} from "./childrenHoodiePatternMaster";

export {
  default as childrenDressPatternMaster,
} from "./childrenDressPatternMaster";

export {
  default as childrenTshirtPatternMaster,
} from "./childrenTshirtPatternMaster";

/**
 * Pattern-library selection engine.
 */
export { getPatternLibrary } from "./getPatternLibrary";