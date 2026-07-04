export type MeasurementArea =
  | "BODY"
  | "SLEEVE"
  | "COLLAR"
  | "BOTTOM"
  | "POCKET"
  | "WAIST"
  | "LEG"
  | "HOOD"
  | "OTHER";

export interface MeasurementPointMaster {
  code: string;

  pointName: string;

  area: MeasurementArea;

  description: string;

  measuringMethod: string;

  toleranceRequired: boolean;
}

export const measurementPointLibrary: MeasurementPointMaster[] = [
  {
    code: "MP001",

    pointName: "Chest Width",

    area: "BODY",

    description:
      "Measured 1 inch below armhole across front.",

    measuringMethod:
      "Lay garment flat without stretching.",

    toleranceRequired: true,
  },

  {
    code: "MP002",

    pointName: "Body Length",

    area: "BODY",

    description:
      "High point shoulder to bottom hem.",

    measuringMethod:
      "Measure along garment center.",

    toleranceRequired: true,
  },

  {
    code: "MP003",

    pointName: "Shoulder Width",

    area: "BODY",

    description:
      "Shoulder seam to shoulder seam.",

    measuringMethod:
      "Lay flat and measure straight.",

    toleranceRequired: true,
  },

  {
    code: "MP004",

    pointName: "Sleeve Length",

    area: "SLEEVE",

    description:
      "Shoulder point to sleeve opening.",

    measuringMethod:
      "Follow sleeve seam.",

    toleranceRequired: true,
  },

  {
    code: "MP005",

    pointName: "Bottom Sweep",

    area: "BOTTOM",

    description:
      "Bottom opening measured flat.",

    measuringMethod:
      "Lay garment naturally without tension.",

    toleranceRequired: true,
  },
];