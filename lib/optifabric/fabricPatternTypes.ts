export interface FabricPatternType {
  id: string;
  name: string;
  description: string;
  aiLogic: string;
}

export const fabricPatternTypes: FabricPatternType[] = [
  {
    id: "solid",
    name: "Solid Fabric",
    description:
      "Plain fabric without stripes, checks or printed repeat.",
    aiLogic:
      "Maximum nesting freedom. Rotation allowed according to grain direction.",
  },

  {
    id: "stripe",
    name: "Striped Fabric",
    description:
      "Vertical or horizontal striped fabric requiring stripe matching.",
    aiLogic:
      "AI maintains stripe continuity across garment components.",
  },

  {
    id: "check",
    name: "Check Fabric",
    description:
      "Check or plaid fabric requiring pattern matching.",
    aiLogic:
      "AI keeps checks aligned on important seams and panels.",
  },

  {
    id: "printed",
    name: "Printed Fabric",
    description:
      "Printed fabric with repeat or engineered design.",
    aiLogic:
      "AI respects print direction and motif placement.",
  },

  {
    id: "directional",
    name: "Directional / One-way Fabric",
    description:
      "Fabric with nap or one-way appearance.",
    aiLogic:
      "AI prevents invalid 180° rotation and keeps all pieces in one direction.",
  },
];