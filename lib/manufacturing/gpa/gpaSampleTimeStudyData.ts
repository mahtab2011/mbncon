import { GPATimeStudyInput } from "./gpaTimeStudyEngine";

export const gpaSampleTimeStudyData: GPATimeStudyInput[] = [
  {
    operationId: "TS-001",
    operationName: "Shoulder Join",
    operatorName: "Rahim",

    performanceRating: 95,

    allowancePercent: 15,

    observations: [
      { observationNo: 1, observedTime: 0.88 },
      { observationNo: 2, observedTime: 0.91 },
      { observationNo: 3, observedTime: 0.90 },
      { observationNo: 4, observedTime: 0.92 },
      { observationNo: 5, observedTime: 0.89 },
    ],
  },

  {
    operationId: "TS-002",
    operationName: "Sleeve Attach",
    operatorName: "Karim",

    performanceRating: 100,

    allowancePercent: 15,

    observations: [
      { observationNo: 1, observedTime: 0.84 },
      { observationNo: 2, observedTime: 0.86 },
      { observationNo: 3, observedTime: 0.87 },
      { observationNo: 4, observedTime: 0.85 },
      { observationNo: 5, observedTime: 0.86 },
    ],
  },

  {
    operationId: "TS-003",
    operationName: "Bottom Hem",
    operatorName: "Nasima",

    performanceRating: 85,

    allowancePercent: 18,

    observations: [
      { observationNo: 1, observedTime: 1.15 },
      { observationNo: 2, observedTime: 1.20 },
      { observationNo: 3, observedTime: 1.17 },
      { observationNo: 4, observedTime: 1.22 },
      { observationNo: 5, observedTime: 1.18 },
    ],
  },
];