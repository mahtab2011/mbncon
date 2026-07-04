import {
  GPAActivitySamplingInput,
} from "./gpaActivitySamplingEngine";

export const gpaSampleActivitySamplingData: GPAActivitySamplingInput[] = [
  {
    operatorId: "OP-001",
    operatorName: "Rahim",
    operationName: "Shoulder Join",

    observations: [
      { observationNo: 1, activity: "WORKING" },
      { observationNo: 2, activity: "WORKING" },
      { observationNo: 3, activity: "WAITING" },
      { observationNo: 4, activity: "WORKING" },
      { observationNo: 5, activity: "WORKING" },
      { observationNo: 6, activity: "SEARCHING" },
      { observationNo: 7, activity: "WORKING" },
      { observationNo: 8, activity: "WORKING" },
      { observationNo: 9, activity: "IDLE" },
      { observationNo: 10, activity: "WORKING" },
    ],
  },

  {
    operatorId: "OP-002",
    operatorName: "Karim",
    operationName: "Sleeve Attach",

    observations: [
      { observationNo: 1, activity: "WORKING" },
      { observationNo: 2, activity: "WORKING" },
      { observationNo: 3, activity: "WORKING" },
      { observationNo: 4, activity: "WORKING" },
      { observationNo: 5, activity: "WORKING" },
      { observationNo: 6, activity: "WORKING" },
      { observationNo: 7, activity: "WORKING" },
      { observationNo: 8, activity: "WAITING" },
      { observationNo: 9, activity: "WORKING" },
      { observationNo: 10, activity: "WORKING" },
    ],
  },

  {
    operatorId: "OP-003",
    operatorName: "Nasima",
    operationName: "Bottom Hem",

    observations: [
      { observationNo: 1, activity: "WORKING" },
      { observationNo: 2, activity: "IDLE" },
      { observationNo: 3, activity: "WAITING" },
      { observationNo: 4, activity: "SEARCHING" },
      { observationNo: 5, activity: "WORKING" },
      { observationNo: 6, activity: "WORKING" },
      { observationNo: 7, activity: "WAITING" },
      { observationNo: 8, activity: "WORKING" },
      { observationNo: 9, activity: "BREAK" },
      { observationNo: 10, activity: "WORKING" },
    ],
  },
];