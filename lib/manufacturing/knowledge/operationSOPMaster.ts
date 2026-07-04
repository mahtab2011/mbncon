export type SOPDepartment =
  | "CUTTING"
  | "SEWING"
  | "FINISHING"
  | "QUALITY"
  | "MAINTENANCE"
  | "WAREHOUSE";

export interface OperationSOP {
  code: string;

  operationName: string;

  department: SOPDepartment;

  objective: string;

  requiredMachines: string[];

  requiredTools: string[];

  safetyPrecautions: string[];

  procedureSteps: string[];

  qualityCheckpoints: string[];

  commonMistakes: string[];

  correctiveActions: string[];
}

export const operationSOPLibrary: OperationSOP[] = [
  {
    code: "SOP001",

    operationName: "Single Needle Lockstitch",

    department: "SEWING",

    objective:
      "Produce consistent lockstitch with required SPI and seam quality.",

    requiredMachines: [
      "Single Needle Lockstitch Machine",
    ],

    requiredTools: [
      "Scissors",
      "Thread Nipper",
      "SPI Gauge",
    ],

    safetyPrecautions: [
      "Wear finger guard if required",
      "Switch off machine before maintenance",
      "Follow needle policy",
    ],

    procedureSteps: [
      "Verify operation bulletin",
      "Check machine setting",
      "Check needle",
      "Check thread",
      "Perform trial stitch",
      "Start production",
    ],

    qualityCheckpoints: [
      "Correct SPI",
      "No skipped stitch",
      "No puckering",
      "Correct seam allowance",
    ],

    commonMistakes: [
      "Wrong SPI",
      "Uneven seam",
      "Open seam",
      "Back stitch missing",
    ],

    correctiveActions: [
      "Reset machine",
      "Replace needle",
      "Retrain operator",
    ],
  },

  {
    code: "SOP002",

    operationName: "Fabric Spreading",

    department: "CUTTING",

    objective:
      "Spread fabric without tension or shade variation.",

    requiredMachines: [
      "Spreading Table",
    ],

    requiredTools: [
      "End Cutter",
      "Shade Band",
    ],

    safetyPrecautions: [
      "Keep hands clear of cutter",
      "Use PPE where applicable",
    ],

    procedureSteps: [
      "Verify marker",
      "Check fabric roll",
      "Check shade",
      "Spread evenly",
      "Inspect lay",
    ],

    qualityCheckpoints: [
      "No tension",
      "No wrinkles",
      "Correct ply count",
    ],

    commonMistakes: [
      "Fabric tension",
      "Incorrect ply",
      "Shade mix",
    ],

    correctiveActions: [
      "Relay fabric",
      "Correct shade segregation",
    ],
  },
];