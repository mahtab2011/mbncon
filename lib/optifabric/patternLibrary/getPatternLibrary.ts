import type { PatternLibraryItem } from "./index";

import { shirtPatternMaster } from "./shirtPatternMaster";
import { trouserPatternMaster } from "./trouserPatternMaster";
import { poloPatternMaster } from "./poloPatternMaster";
import { jacketPatternMaster } from "./jacketPatternMaster";
import {
  womenFitAndFlareDressPatternMaster,
} from "./womenFitAndFlareDressPatternMaster";
import { hoodiePatternMaster } from "./hoodiePatternMaster";
import {
  industrialCoverallPatternMaster,
} from "./industrialCoverallPatternMaster";
import { tshirtPatternMaster } from "./tshirtPatternMaster";
import { tankTopPatternMaster } from "./tankTopPatternMaster";

import vestPatternMaster from "./vestPatternMaster";
import thermalTopPatternMaster from "./thermalTopPatternMaster";
import thermalLeggingPatternMaster from "./thermalLeggingPatternMaster";
import waistcoatPatternMaster from "./waistcoatPatternMaster";
import chinoPatternMaster from "./chinoPatternMaster";
import cargoTrouserPatternMaster from "./cargoTrouserPatternMaster";
import jeansPatternMaster from "./jeansPatternMaster";
import shortsPatternMaster from "./shortsPatternMaster";
import skirtPatternMaster from "./skirtPatternMaster";
import raincoatPatternMaster from "./raincoatPatternMaster";
import waterproofJacketPatternMaster from "./waterproofJacketPatternMaster";
import canvasJacketPatternMaster from "./canvasJacketPatternMaster";
import parkaPatternMaster from "./parkaPatternMaster";
import windbreakerPatternMaster from "./windbreakerPatternMaster";
import sweaterPatternMaster from "./sweaterPatternMaster";
import cardiganPatternMaster from "./cardiganPatternMaster";
import knittedCapPatternMaster from "./knittedCapPatternMaster";
import knittedScarfPatternMaster from "./knittedScarfPatternMaster";
import socksPatternMaster from "./socksPatternMaster";
import tightsPatternMaster from "./tightsPatternMaster";
import legWarmersPatternMaster from "./legWarmersPatternMaster";
import babyRomperPatternMaster from "./babyRomperPatternMaster";
import childrenHoodiePatternMaster from "./childrenHoodiePatternMaster";
import childrenDressPatternMaster from "./childrenDressPatternMaster";
import childrenTshirtPatternMaster from "./childrenTshirtPatternMaster";

/**
 * Converts user-entered or stored garment names into a consistent format.
 *
 * Examples:
 * "Children's T-Shirt" becomes "childrens-tshirt".
 * "Cargo Trouser" becomes "cargo-trouser".
 * "Polo_Shirt" becomes "polo-shirt".
 */
function normaliseGarmentType(garmentType: string): string {
  return garmentType
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns a safe, sequence-sorted copy of the selected garment master.
 *
 * Returning a copy prevents a project or interface component from changing
 * the original engineering pattern library.
 */
function preparePatternLibrary(
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
 * Selects the correct OptiFabric engineering pattern library.
 *
 * The aliases allow older projects, user-entered garment names and the new
 * category-based garment selector to use the same pattern masters safely.
 */
export function getPatternLibrary(
  garmentType: string
): PatternLibraryItem[] {
  const normalisedGarmentType = normaliseGarmentType(garmentType);

  let selectedPatternLibrary: PatternLibraryItem[];

  switch (normalisedGarmentType) {
    /**
     * Woven shirts.
     */
    case "shirt":
    case "shirts":
    case "woven-shirt":
    case "formal-shirt":
    case "mens-shirt":
    case "mens-formal-shirt":
    case "womens-shirt":
      selectedPatternLibrary = shirtPatternMaster;
      break;

    /**
     * Formal and standard trousers.
     */
    case "trouser":
    case "trousers":
    case "pant":
    case "pants":
    case "formal-trouser":
    case "formal-trousers":
    case "woven-trouser":
    case "woven-trousers":
      selectedPatternLibrary = trouserPatternMaster;
      break;

    /**
     * Polo shirts.
     */
    case "polo":
    case "polo-shirt":
    case "polo-shirts":
    case "children-polo":
    case "children-polo-shirt":
      selectedPatternLibrary = poloPatternMaster;
      break;

    /**
     * Tailored jackets.
     */
    case "jacket":
    case "tailored-jacket":
    case "formal-jacket":
    case "suit-jacket":
    case "blazer":
      selectedPatternLibrary = jacketPatternMaster;
      break;

    /**
     * Women's fit-and-flare dresses.
     */
    case "dress":
    case "womens-dress":
    case "women-dress":
    case "fit-and-flare-dress":
    case "women-fit-and-flare-dress":
    case "womens-fit-and-flare-dress":
      selectedPatternLibrary =
        womenFitAndFlareDressPatternMaster;
      break;

    /**
     * Standard T-shirts.
     */
    case "tshirt":
    case "t-shirt":
    case "tee":
    case "tee-shirt":
    case "adult-tshirt":
    case "adult-t-shirt":
      selectedPatternLibrary = tshirtPatternMaster;
      break;

    /**
     * Standard hoodies.
     */
    case "hoodie":
    case "hoodies":
    case "adult-hoodie":
    case "pullover-hoodie":
    case "zip-hoodie":
      selectedPatternLibrary = hoodiePatternMaster;
      break;

    /**
     * Industrial coveralls and work uniforms.
     */
    case "industrial-coverall":
    case "industrial-coveralls":
    case "coverall":
    case "coveralls":
    case "boilersuit":
    case "boiler-suit":
    case "workwear-coverall":
    case "uniform":
    case "industrial-uniform":
      selectedPatternLibrary =
        industrialCoverallPatternMaster;
      break;

    /**
     * Vests.
     */
    case "vest":
    case "vests":
    case "knit-vest":
    case "jersey-vest":
    case "sleeveless-vest":
      selectedPatternLibrary = vestPatternMaster;
      break;

    /**
     * Tank tops.
     */
    case "tank-top":
    case "tank-tops":
    case "tanktop":
    case "singlet":
    case "sleeveless-top":
      selectedPatternLibrary = tankTopPatternMaster;
      break;

    /**
     * Thermal garments.
     */
    case "thermal-top":
    case "thermal-tops":
    case "thermal-shirt":
    case "thermal-upper":
    case "base-layer-top":
      selectedPatternLibrary = thermalTopPatternMaster;
      break;

    case "thermal-legging":
    case "thermal-leggings":
    case "thermal-bottom":
    case "thermal-bottoms":
    case "base-layer-legging":
    case "base-layer-leggings":
      selectedPatternLibrary = thermalLeggingPatternMaster;
      break;

    /**
     * Waistcoats.
     */
    case "waistcoat":
    case "waistcoats":
    case "formal-waistcoat":
    case "suit-waistcoat":
      selectedPatternLibrary = waistcoatPatternMaster;
      break;

    /**
     * Chinos.
     */
    case "chino":
    case "chinos":
    case "chino-trouser":
    case "chino-trousers":
    case "chino-pant":
    case "chino-pants":
      selectedPatternLibrary = chinoPatternMaster;
      break;

    /**
     * Cargo trousers.
     */
    case "cargo":
    case "cargo-trouser":
    case "cargo-trousers":
    case "cargo-pant":
    case "cargo-pants":
      selectedPatternLibrary = cargoTrouserPatternMaster;
      break;

    /**
     * Denim jeans.
     */
    case "jean":
    case "jeans":
    case "denim-jean":
    case "denim-jeans":
    case "denim-trouser":
    case "denim-trousers":
      selectedPatternLibrary = jeansPatternMaster;
      break;

    /**
     * Shorts.
     */
    case "short":
    case "shorts":
    case "woven-shorts":
    case "casual-shorts":
    case "cargo-shorts":
      selectedPatternLibrary = shortsPatternMaster;
      break;

    /**
     * Skirts.
     */
    case "skirt":
    case "skirts":
    case "womens-skirt":
    case "women-skirt":
    case "woven-skirt":
      selectedPatternLibrary = skirtPatternMaster;
      break;

    /**
     * Outerwear.
     */
    case "raincoat":
    case "rain-coat":
    case "rainwear":
    case "rain-jacket":
      selectedPatternLibrary = raincoatPatternMaster;
      break;

    case "waterproof-jacket":
    case "waterproof-coat":
    case "waterproof-shell":
    case "shell-jacket":
      selectedPatternLibrary =
        waterproofJacketPatternMaster;
      break;

    case "canvas-jacket":
    case "canvas-coat":
    case "workwear-canvas-jacket":
      selectedPatternLibrary = canvasJacketPatternMaster;
      break;

    case "parka":
    case "parkas":
    case "parka-jacket":
    case "winter-parka":
      selectedPatternLibrary = parkaPatternMaster;
      break;

    case "windbreaker":
    case "wind-breaker":
    case "windbreaker-jacket":
    case "wind-jacket":
      selectedPatternLibrary = windbreakerPatternMaster;
      break;

    /**
     * Fully fashioned knitwear.
     */
    case "sweater":
    case "sweaters":
    case "jumper":
    case "jumpers":
    case "pullover":
    case "knitted-sweater":
      selectedPatternLibrary = sweaterPatternMaster;
      break;

    case "cardigan":
    case "cardigans":
    case "knitted-cardigan":
    case "button-cardigan":
      selectedPatternLibrary = cardiganPatternMaster;
      break;

    case "knitted-cap":
    case "knit-cap":
    case "woollen-cap":
    case "wool-cap":
    case "beanie":
    case "knitted-beanie":
      selectedPatternLibrary = knittedCapPatternMaster;
      break;

    case "knitted-scarf":
    case "knit-scarf":
    case "woollen-scarf":
    case "wool-scarf":
    case "scarf":
      selectedPatternLibrary = knittedScarfPatternMaster;
      break;

    /**
     * Hosiery.
     */
    case "sock":
    case "socks":
    case "hosiery-socks":
    case "knitted-socks":
      selectedPatternLibrary = socksPatternMaster;
      break;

    case "tight":
    case "tights":
    case "hosiery-tights":
    case "pantyhose":
      selectedPatternLibrary = tightsPatternMaster;
      break;

    case "leg-warmer":
    case "leg-warmers":
    case "legwarmer":
    case "legwarmers":
    case "knitted-leg-warmers":
      selectedPatternLibrary = legWarmersPatternMaster;
      break;

    /**
     * Children's garments.
     */
    case "baby-romper":
    case "baby-rompers":
    case "romper":
    case "rompers":
    case "infant-romper":
    case "baby-onesie":
      selectedPatternLibrary = babyRomperPatternMaster;
      break;

    case "children-hoodie":
    case "childrens-hoodie":
    case "child-hoodie":
    case "kids-hoodie":
    case "kid-hoodie":
      selectedPatternLibrary =
        childrenHoodiePatternMaster;
      break;

    case "children-dress":
    case "childrens-dress":
    case "child-dress":
    case "kids-dress":
    case "kid-dress":
    case "girls-dress":
    case "girl-dress":
      selectedPatternLibrary =
        childrenDressPatternMaster;
      break;

    case "children-tshirt":
    case "children-t-shirt":
    case "childrens-tshirt":
    case "childrens-t-shirt":
    case "child-tshirt":
    case "child-t-shirt":
    case "kids-tshirt":
    case "kids-t-shirt":
    case "kid-tshirt":
    case "kid-t-shirt":
      selectedPatternLibrary =
        childrenTshirtPatternMaster;
      break;

    /**
     * Unknown garments begin with an empty master.
     * Users can add their own custom pattern pieces.
     */
    case "other":
    default:
      selectedPatternLibrary = [];
      break;
  }

  return preparePatternLibrary(selectedPatternLibrary);
}

export default getPatternLibrary;