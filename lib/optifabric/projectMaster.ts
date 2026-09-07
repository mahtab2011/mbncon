import {
  createProjectPatternSet,
  getPatternLibrary,
} from "@/lib/optifabric/patternLibrary";

import type {
  ProjectPatternItem,
} from "@/lib/optifabric/patternLibrary";

/**
 * Main commercial garment divisions shown in the project selector.
 */
export type GarmentMainCategory =
  | "knitwear"
  | "woven"
  | "denim"
  | "outerwear"
  | "workwear"
  | "fully-fashioned-knitwear"
  | "hosiery"
  | "children"
  | "other";

/**
 * Engineering subcategories shown after the user selects
 * a main garment category.
 */
export type GarmentSubcategory =
  | "tops"
  | "bottoms"
  | "dresses"
  | "tailoring"
  | "casualwear"
  | "work-trousers"
  | "denim-bottoms"
  | "protective-outerwear"
  | "casual-outerwear"
  | "industrial-uniforms"
  | "knitted-garments"
  | "knitted-accessories"
  | "legwear"
  | "babywear"
  | "children-tops"
  | "children-dresses"
  | "custom";

/**
 * Every standard garment master currently supported by OptiFabric.
 *
 * Older identifiers such as jacket, dress and uniform are retained
 * so that previously created projects continue to work.
 */
export type GarmentCategory =
  | "shirt"
  | "trouser"
  | "polo"
  | "jacket"
  | "dress"
  | "tshirt"
  | "vest"
  | "tank-top"
  | "thermal-top"
  | "thermal-legging"
  | "hoodie"
  | "uniform"
  | "industrial-coverall"
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
 * One selectable garment inside the category hierarchy.
 */
export interface GarmentSelectionItem {
  id: GarmentCategory;
  name: string;
  description: string;
}

/**
 * One garment subcategory and its selectable garments.
 */
export interface GarmentSubcategoryItem {
  id: GarmentSubcategory;
  name: string;
  description: string;
  garments: GarmentSelectionItem[];
}

/**
 * One main garment category and its subcategories.
 */
export interface GarmentMainCategoryItem {
  id: GarmentMainCategory;
  name: string;
  description: string;
  subcategories: GarmentSubcategoryItem[];
}

/**
 * Full project-level pattern status.
 *
 * It retains all engineering master properties together with upload,
 * recognition and validation information.
 */
export interface PatternStatus extends ProjectPatternItem {}

/**
 * OptiFabric engineering project structure.
 *
 * garmentMainCategory and garmentSubcategory are optional so older
 * locally stored projects remain valid.
 */
export interface EngineeringProject {
  id: string;
  projectName: string;
  customer: string;
  styleNumber: string;

  garmentCategory: GarmentCategory;
  garmentMainCategory?: GarmentMainCategory;
  garmentSubcategory?: GarmentSubcategory;

  fabricWidth: number;
  orderQuantity: number;
  scaleLength: number;

  createdAt: string;

  patterns: PatternStatus[];
}

/**
 * Complete commercial garment-selection hierarchy.
 *
 * The project creation page will use this structure to display:
 *
 * Main Category
 * → Subcategory
 * → Garment
 */
export const garmentSelectionHierarchy: GarmentMainCategoryItem[] = [
  {
    id: "knitwear",
    name: "Knitwear",
    description:
      "Cut-and-sew knitted garments manufactured from jersey, rib, interlock, fleece and related knitted fabrics.",
    subcategories: [
      {
        id: "tops",
        name: "Knit Tops",
        description:
          "Knitted upper-body garments including T-shirts, polos, vests and thermal tops.",
        garments: [
          {
            id: "tshirt",
            name: "T-Shirt",
            description:
              "Standard short-sleeve, long-sleeve, raglan and panelled knitted T-shirts.",
          },
          {
            id: "polo",
            name: "Polo Shirt",
            description:
              "Knitted polo shirts with collars, plackets, cuffs and optional pocket details.",
          },
          {
            id: "hoodie",
            name: "Hoodie",
            description:
              "Pullover and zip-front hoodies with pockets, hoods, cuffs and hem bands.",
          },
          {
            id: "vest",
            name: "Vest",
            description:
              "Sleeveless knitted vests with multiple neckline and finishing options.",
          },
          {
            id: "tank-top",
            name: "Tank Top",
            description:
              "Sleeveless tank tops, athletic singlets and fitted knitted tops.",
          },
          {
            id: "thermal-top",
            name: "Thermal Top",
            description:
              "Long-sleeve thermal and base-layer upper garments.",
          },
        ],
      },
      {
        id: "bottoms",
        name: "Knit Bottoms",
        description:
          "Knitted lower-body garments and thermal base-layer bottoms.",
        garments: [
          {
            id: "thermal-legging",
            name: "Thermal Leggings",
            description:
              "Thermal leggings and fitted knitted base-layer bottoms.",
          },
        ],
      },
    ],
  },

  {
    id: "woven",
    name: "Woven",
    description:
      "Shirts, trousers, dresses, tailoring and other garments manufactured from woven fabrics.",
    subcategories: [
      {
        id: "tops",
        name: "Woven Tops",
        description:
          "Woven shirts and structured upper-body garments.",
        garments: [
          {
            id: "shirt",
            name: "Shirt",
            description:
              "Formal, casual and utility shirts with comprehensive collar, cuff, placket and pocket options.",
          },
        ],
      },
      {
        id: "bottoms",
        name: "Woven Bottoms",
        description:
          "Formal and casual woven trousers, chinos, cargo trousers, shorts and skirts.",
        garments: [
          {
            id: "trouser",
            name: "Trouser",
            description:
              "Formal and standard woven trousers with waistband, fly and pocket constructions.",
          },
          {
            id: "chino",
            name: "Chino",
            description:
              "Casual woven chinos with slant pockets, back pockets and waistband details.",
          },
          {
            id: "cargo-trouser",
            name: "Cargo Trouser",
            description:
              "Utility trousers with cargo pockets, flaps, reinforcements and adjustable details.",
          },
          {
            id: "shorts",
            name: "Shorts",
            description:
              "Formal, casual, cargo and utility shorts.",
          },
          {
            id: "skirt",
            name: "Skirt",
            description:
              "Straight, A-line, flared, pleated, panelled and lined skirts.",
          },
        ],
      },
      {
        id: "tailoring",
        name: "Tailoring",
        description:
          "Structured and semi-structured formal garments.",
        garments: [
          {
            id: "jacket",
            name: "Tailored Jacket",
            description:
              "Tailored jackets and blazers with lapels, facings, linings and internal structural components.",
          },
          {
            id: "waistcoat",
            name: "Waistcoat",
            description:
              "Formal and casual waistcoats with facings, linings, pockets and adjustment details.",
          },
        ],
      },
      {
        id: "dresses",
        name: "Women's Dresses",
        description:
          "Structured and fashion dresses manufactured from woven or blended fabrics.",
        garments: [
          {
            id: "dress",
            name: "Women's Fit-and-Flare Dress",
            description:
              "Fit-and-flare dresses with bodice, skirt, sleeve, collar, lining and decorative variations.",
          },
        ],
      },
    ],
  },

  {
    id: "denim",
    name: "Denim",
    description:
      "Garments requiring denim-specific panel, pocket, yoke and reinforcement engineering.",
    subcategories: [
      {
        id: "denim-bottoms",
        name: "Denim Bottoms",
        description:
          "Five-pocket and alternative denim bottom constructions.",
        garments: [
          {
            id: "jeans",
            name: "Jeans",
            description:
              "Five-pocket jeans with fly, waistband, yokes, coin pocket, belt loops and reinforcement components.",
          },
        ],
      },
    ],
  },

  {
    id: "outerwear",
    name: "Outerwear",
    description:
      "Weather-protective, insulated, wind-resistant and heavy-duty outer garments.",
    subcategories: [
      {
        id: "protective-outerwear",
        name: "Protective Outerwear",
        description:
          "Outer garments designed to protect against rain, wind and cold.",
        garments: [
          {
            id: "raincoat",
            name: "Raincoat",
            description:
              "Raincoats with hoods, storm flaps, waterproof closures and protective details.",
          },
          {
            id: "waterproof-jacket",
            name: "Waterproof Jacket",
            description:
              "Technical waterproof jackets with shell, membrane, hood, seam and ventilation components.",
          },
          {
            id: "parka",
            name: "Parka",
            description:
              "Insulated and weather-resistant parkas with hoods, linings, pockets and storm protection.",
          },
          {
            id: "windbreaker",
            name: "Windbreaker",
            description:
              "Lightweight wind-resistant jackets with elasticated or adjustable finishing components.",
          },
        ],
      },
      {
        id: "casual-outerwear",
        name: "Casual and Utility Outerwear",
        description:
          "Durable casual and utility jackets.",
        garments: [
          {
            id: "canvas-jacket",
            name: "Canvas Jacket",
            description:
              "Heavy-duty canvas jackets with reinforced panels, pockets, collars and lining options.",
          },
        ],
      },
    ],
  },

  {
    id: "workwear",
    name: "Workwear",
    description:
      "Industrial uniforms and protective garments designed for workplace use.",
    subcategories: [
      {
        id: "industrial-uniforms",
        name: "Industrial Uniforms",
        description:
          "Industrial garments requiring utility, safety and reinforcement components.",
        garments: [
          {
            id: "uniform",
            name: "Industrial Coverall",
            description:
              "Industrial coveralls with action backs, utility pockets, reinforcement panels and safety options.",
          },
        ],
      },
    ],
  },

  {
    id: "fully-fashioned-knitwear",
    name: "Fully Fashioned Knitwear",
    description:
      "Knitted garments and accessories produced from shaped knitted panels or knitted components.",
    subcategories: [
      {
        id: "knitted-garments",
        name: "Knitted Garments",
        description:
          "Fully fashioned sweaters and cardigans.",
        garments: [
          {
            id: "sweater",
            name: "Sweater",
            description:
              "Crew-neck, V-neck, turtleneck and panelled fully fashioned sweaters.",
          },
          {
            id: "cardigan",
            name: "Cardigan",
            description:
              "Button-front, zip-front and open-front cardigans with knitted trims and pockets.",
          },
        ],
      },
      {
        id: "knitted-accessories",
        name: "Knitted Accessories",
        description:
          "Fully fashioned knitted headwear and neckwear.",
        garments: [
          {
            id: "knitted-cap",
            name: "Knitted Cap",
            description:
              "Beanies, cuffed caps, panelled caps and lined knitted headwear.",
          },
          {
            id: "knitted-scarf",
            name: "Knitted Scarf",
            description:
              "Straight, tubular, fringed, lined and decorative knitted scarves.",
          },
        ],
      },
    ],
  },

  {
    id: "hosiery",
    name: "Hosiery",
    description:
      "Knitted legwear, foot coverings and related shaped hosiery products.",
    subcategories: [
      {
        id: "legwear",
        name: "Hosiery and Legwear",
        description:
          "Socks, tights and knitted leg-warming garments.",
        garments: [
          {
            id: "socks",
            name: "Socks",
            description:
              "Ankle, crew, sports, formal and specialist sock constructions.",
          },
          {
            id: "tights",
            name: "Tights",
            description:
              "Footed, footless, reinforced and shaped tights.",
          },
          {
            id: "leg-warmers",
            name: "Leg Warmers",
            description:
              "Knitted leg warmers with cuff, stirrup, lining and shaping options.",
          },
        ],
      },
    ],
  },

  {
    id: "children",
    name: "Children's Garments",
    description:
      "Baby and children's garments with age-appropriate openings, safety reinforcements and comfort components.",
    subcategories: [
      {
        id: "babywear",
        name: "Babywear",
        description:
          "Garments designed for babies and infants.",
        garments: [
          {
            id: "baby-romper",
            name: "Baby Romper",
            description:
              "Baby rompers with envelope necks, crotch openings, feet, mittens and snap reinforcements.",
          },
        ],
      },
      {
        id: "children-tops",
        name: "Children's Tops",
        description:
          "Children's knitted upper-body garments.",
        garments: [
          {
            id: "children-hoodie",
            name: "Children's Hoodie",
            description:
              "Children's hoodies with child-safe hood, pocket, cuff and opening constructions.",
          },
          {
            id: "children-tshirt",
            name: "Children's T-Shirt",
            description:
              "Children's T-shirts with multiple sleeves, neck openings, plackets and decorative options.",
          },
        ],
      },
      {
        id: "children-dresses",
        name: "Children's Dresses",
        description:
          "Casual, school, party, pinafore and special-occasion children's dresses.",
        garments: [
          {
            id: "children-dress",
            name: "Children's Dress",
            description:
              "Children's dresses with bodice, skirt, sleeve, collar, lining, ruffle and decorative variations.",
          },
        ],
      },
    ],
  },

  {
    id: "other",
    name: "Other",
    description:
      "Custom garments that are not yet represented by a standard OptiFabric master.",
    subcategories: [
      {
        id: "custom",
        name: "Custom Garment",
        description:
          "Begin with an empty pattern set and manually add the required pattern pieces.",
        garments: [
          {
            id: "other",
            name: "Other Garment",
            description:
              "Create a custom garment project and add pattern pieces manually.",
          },
        ],
      },
    ],
  },
];

/**
 * Creates a fresh project-level copy of one standard garment library.
 */
function createDefaultPatternSet(
  garmentCategory: GarmentCategory
): PatternStatus[] {
  return createProjectPatternSet(
    getPatternLibrary(garmentCategory)
  );
}

/**
 * Complete default pattern library used when a new project is created.
 *
 * Every entry receives a separate project-level copy containing upload,
 * recognition and validation status fields.
 */
export const defaultPatternLibrary: Record<
  GarmentCategory,
  PatternStatus[]
> = {
  shirt: createDefaultPatternSet("shirt"),

  trouser: createDefaultPatternSet("trouser"),

  polo: createDefaultPatternSet("polo"),

  jacket: createDefaultPatternSet("jacket"),

  dress: createDefaultPatternSet("dress"),

  tshirt: createDefaultPatternSet("tshirt"),

  vest: createDefaultPatternSet("vest"),

  "tank-top": createDefaultPatternSet("tank-top"),

  "thermal-top": createDefaultPatternSet("thermal-top"),

  "thermal-legging": createDefaultPatternSet(
    "thermal-legging"
  ),

  hoodie: createDefaultPatternSet("hoodie"),

  uniform: createDefaultPatternSet("uniform"),

  "industrial-coverall": createDefaultPatternSet(
    "industrial-coverall"
  ),

  waistcoat: createDefaultPatternSet("waistcoat"),

  chino: createDefaultPatternSet("chino"),

  "cargo-trouser": createDefaultPatternSet(
    "cargo-trouser"
  ),

  jeans: createDefaultPatternSet("jeans"),

  shorts: createDefaultPatternSet("shorts"),

  skirt: createDefaultPatternSet("skirt"),

  raincoat: createDefaultPatternSet("raincoat"),

  "waterproof-jacket": createDefaultPatternSet(
    "waterproof-jacket"
  ),

  "canvas-jacket": createDefaultPatternSet(
    "canvas-jacket"
  ),

  parka: createDefaultPatternSet("parka"),

  windbreaker: createDefaultPatternSet("windbreaker"),

  sweater: createDefaultPatternSet("sweater"),

  cardigan: createDefaultPatternSet("cardigan"),

  "knitted-cap": createDefaultPatternSet(
    "knitted-cap"
  ),

  "knitted-scarf": createDefaultPatternSet(
    "knitted-scarf"
  ),

  socks: createDefaultPatternSet("socks"),

  tights: createDefaultPatternSet("tights"),

  "leg-warmers": createDefaultPatternSet(
    "leg-warmers"
  ),

  "baby-romper": createDefaultPatternSet(
    "baby-romper"
  ),

  "children-hoodie": createDefaultPatternSet(
    "children-hoodie"
  ),

  "children-dress": createDefaultPatternSet(
    "children-dress"
  ),

  "children-tshirt": createDefaultPatternSet(
    "children-tshirt"
  ),

  other: [],
};

/**
 * Finds the hierarchy location of a selected garment.
 */
export function getGarmentHierarchyLocation(
  garmentCategory: GarmentCategory
): {
  mainCategory?: GarmentMainCategory;
  subcategory?: GarmentSubcategory;
} {
  for (const mainCategory of garmentSelectionHierarchy) {
    for (const subcategory of mainCategory.subcategories) {
      const garmentExists = subcategory.garments.some(
        (garment) => garment.id === garmentCategory
      );

      if (garmentExists) {
        return {
          mainCategory: mainCategory.id,
          subcategory: subcategory.id,
        };
      }
    }
  }

  return {};
}

/**
 * Returns all subcategories belonging to one main category.
 */
export function getGarmentSubcategories(
  mainCategoryId: GarmentMainCategory
): GarmentSubcategoryItem[] {
  const selectedMainCategory =
    garmentSelectionHierarchy.find(
      (mainCategory) =>
        mainCategory.id === mainCategoryId
    );

  return selectedMainCategory?.subcategories ?? [];
}

/**
 * Returns all garments belonging to one subcategory.
 */
export function getGarmentsBySubcategory(
  mainCategoryId: GarmentMainCategory,
  subcategoryId: GarmentSubcategory
): GarmentSelectionItem[] {
  const selectedMainCategory =
    garmentSelectionHierarchy.find(
      (mainCategory) =>
        mainCategory.id === mainCategoryId
    );

  const selectedSubcategory =
    selectedMainCategory?.subcategories.find(
      (subcategory) =>
        subcategory.id === subcategoryId
    );

  return selectedSubcategory?.garments ?? [];
}

/**
 * Returns the user-facing name of one garment.
 */
export function getGarmentDisplayName(
  garmentCategory: GarmentCategory
): string {
  for (const mainCategory of garmentSelectionHierarchy) {
    for (const subcategory of mainCategory.subcategories) {
      const selectedGarment = subcategory.garments.find(
        (garment) => garment.id === garmentCategory
      );

      if (selectedGarment) {
        return selectedGarment.name;
      }
    }
  }

  return "Other Garment";
}

/**
 * Generates an engineering project ID.
 */
function createEngineeringProjectId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `optifabric-project-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/**
 * Creates a new OptiFabric engineering project.
 *
 * The function signature remains compatible with the existing project
 * creation page.
 */
export function createEngineeringProject(
  projectName: string,
  customer: string,
  styleNumber: string,
  garmentCategory: GarmentCategory,
  fabricWidth: number,
  orderQuantity: number,
  scaleLength: number
): EngineeringProject {
  const selectedPatterns =
    defaultPatternLibrary[garmentCategory] ?? [];

  const hierarchyLocation =
    getGarmentHierarchyLocation(garmentCategory);

  return {
    id: createEngineeringProjectId(),

    projectName: projectName.trim(),

    customer: customer.trim(),

    styleNumber: styleNumber.trim(),

    garmentCategory,

    garmentMainCategory:
      hierarchyLocation.mainCategory,

    garmentSubcategory:
      hierarchyLocation.subcategory,

    fabricWidth,

    orderQuantity,

    scaleLength,

    createdAt: new Date().toISOString(),

    patterns: selectedPatterns.map((pattern) => ({
      ...pattern,
    })),
  };
}