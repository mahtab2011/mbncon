import { GPASMVInput } from "./gpaSMVIntelligenceEngine";

export const gpaSampleSMVData: GPASMVInput[] = [
  {
    operationId: "SMV-001",
    operationName: "Shoulder Join",
    operatorName: "Rahim",

    standardMinuteValue: 0.72,

    actualCycleTime: 0.93,

    hourlyTarget: 83,

    hourlyOutput: 64,
  },

  {
    operationId: "SMV-002",
    operationName: "Sleeve Attach",
    operatorName: "Karim",

    standardMinuteValue: 0.88,

    actualCycleTime: 0.86,

    hourlyTarget: 69,

    hourlyOutput: 70,
  },

  {
    operationId: "SMV-003",
    operationName: "Side Seam",
    operatorName: "Fatema",

    standardMinuteValue: 0.65,

    actualCycleTime: 0.55,

    hourlyTarget: 92,

    hourlyOutput: 109,
  },

  {
    operationId: "SMV-004",
    operationName: "Bottom Hem",
    operatorName: "Nasima",

    standardMinuteValue: 0.80,

    actualCycleTime: 1.20,

    hourlyTarget: 75,

    hourlyOutput: 49,
  },

  {
    operationId: "SMV-005",
    operationName: "Final Inspection",
    operatorName: "Jamal",

    standardMinuteValue: 1.10,

    actualCycleTime: 1.05,

    hourlyTarget: 54,

    hourlyOutput: 55,
  },
];