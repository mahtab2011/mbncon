import { GPAMotionEconomyInput } from "./gpaMotionEconomyEngine";

export const gpaSampleMotionEconomyData: GPAMotionEconomyInput[] = [
  {
    operationId: "ME-001",
    operationName: "Shoulder Join",

    leftHandMotions: 28,
    rightHandMotions: 31,

    bodyTurns: 4,

    walkingDistanceMeters: 2.5,

    unnecessaryReaches: 6,

    toolSearchSeconds: 5,

    fatigueLevel: "MEDIUM",
  },

  {
    operationId: "ME-002",
    operationName: "Sleeve Attach",

    leftHandMotions: 24,
    rightHandMotions: 25,

    bodyTurns: 1,

    walkingDistanceMeters: 0.5,

    unnecessaryReaches: 2,

    toolSearchSeconds: 1,

    fatigueLevel: "LOW",
  },

  {
    operationId: "ME-003",
    operationName: "Bottom Hem",

    leftHandMotions: 35,
    rightHandMotions: 39,

    bodyTurns: 7,

    walkingDistanceMeters: 4.2,

    unnecessaryReaches: 9,

    toolSearchSeconds: 8,

    fatigueLevel: "HIGH",
  },

  {
    operationId: "ME-004",
    operationName: "Final Inspection",

    leftHandMotions: 18,
    rightHandMotions: 20,

    bodyTurns: 2,

    walkingDistanceMeters: 1.2,

    unnecessaryReaches: 2,

    toolSearchSeconds: 2,

    fatigueLevel: "LOW",
  },
];