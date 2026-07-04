import { GPAMethodStudyInput } from "./gpaMethodStudyEngine";

export const gpaSampleMethodStudyData: GPAMethodStudyInput[] = [
  {
    operationId: "MS-001",
    operationName: "Shoulder Join",

    currentMethod:
      "Operator reaches to the left for bundle, aligns panels manually and stitches.",

    proposedMethod:
      "Introduce gravity feeder, place bundle within ergonomic reach and use folder guide.",

    unnecessaryMotions: 6,

    transportationSteps: 2,

    inspectionSteps: 1,

    delayMinutes: 4,

    operatorFatigue: "MEDIUM",
  },

  {
    operationId: "MS-002",
    operationName: "Sleeve Attach",

    currentMethod:
      "Operator manually rotates garment several times during sewing.",

    proposedMethod:
      "Modify workplace layout and introduce standard handling sequence.",

    unnecessaryMotions: 8,

    transportationSteps: 1,

    inspectionSteps: 2,

    delayMinutes: 6,

    operatorFatigue: "HIGH",
  },

  {
    operationId: "MS-003",
    operationName: "Bottom Hem",

    currentMethod:
      "Operator performs smooth continuous sewing using standard guide.",

    proposedMethod:
      "Maintain current method with periodic monitoring.",

    unnecessaryMotions: 1,

    transportationSteps: 0,

    inspectionSteps: 1,

    delayMinutes: 1,

    operatorFatigue: "LOW",
  },
];