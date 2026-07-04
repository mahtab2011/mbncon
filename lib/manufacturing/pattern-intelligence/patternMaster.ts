export interface PatternMaster {
  id: string;

  buyer: string;

  style: string;

  garmentPart: string;

  size: string;

  fabricType: string;

  lengthMm: number;

  widthMm: number;

  areaSqCm: number;

  seamAllowanceMm: number;

  grainLine: "STRAIGHT" | "BIAS";

  patternRevision: string;

  patternPhoto: string;

  scalePhoto: string;

  aiMeasuredLengthMm: number;

  aiMeasuredWidthMm: number;

  toleranceMm: number;

  status:
    | "APPROVED"
    | "UNDER_REVIEW"
    | "REJECTED";
}

export const patternMaster: PatternMaster[] = [

  {
    id: "PAT-001",

    buyer: "H&M",

    style: "HNM-2401",

    garmentPart: "Front",

    size: "M",

    fabricType: "100% Cotton Jersey",

    lengthMm: 720,

    widthMm: 590,

    areaSqCm: 4210,

    seamAllowanceMm: 10,

    grainLine: "STRAIGHT",

    patternRevision: "Rev-03",

    patternPhoto: "/patterns/front.jpg",

    scalePhoto: "/patterns/front-scale.jpg",

    aiMeasuredLengthMm: 719,

    aiMeasuredWidthMm: 591,

    toleranceMm: 2,

    status: "APPROVED",
  },

  {
    id: "PAT-002",

    buyer: "H&M",

    style: "HNM-2401",

    garmentPart: "Back",

    size: "M",

    fabricType: "100% Cotton Jersey",

    lengthMm: 724,

    widthMm: 595,

    areaSqCm: 4275,

    seamAllowanceMm: 10,

    grainLine: "STRAIGHT",

    patternRevision: "Rev-03",

    patternPhoto: "/patterns/back.jpg",

    scalePhoto: "/patterns/back-scale.jpg",

    aiMeasuredLengthMm: 725,

    aiMeasuredWidthMm: 594,

    toleranceMm: 2,

    status: "APPROVED",
  },

  {
    id: "PAT-003",

    buyer: "Zara",

    style: "ZRA-1188",

    garmentPart: "Sleeve",

    size: "L",

    fabricType: "Cotton Spandex",

    lengthMm: 645,

    widthMm: 275,

    areaSqCm: 1850,

    seamAllowanceMm: 10,

    grainLine: "STRAIGHT",

    patternRevision: "Rev-01",

    patternPhoto: "/patterns/sleeve.jpg",

    scalePhoto: "/patterns/sleeve-scale.jpg",

    aiMeasuredLengthMm: 648,

    aiMeasuredWidthMm: 276,

    toleranceMm: 2,

    status: "UNDER_REVIEW",
  },

];