export interface FabricCuttingKnowledge {
  id: string;

  category: string;

  title: string;

  description: string;

  aiRecommendation: string;
}

export const fabricCuttingKnowledgeMaster: FabricCuttingKnowledge[] = [

  {
    id: "FC-001",

    category: "Fabric Grain",

    title: "Grain Line Alignment",

    description:
      "Pattern grain line must always remain parallel to the fabric selvedge unless specifically engineered otherwise.",

    aiRecommendation:
      "Reject marker if grain deviation exceeds allowable tolerance.",
  },

  {
    id: "FC-002",

    category: "Fabric Relaxation",

    title: "Fabric Relaxation Time",

    description:
      "Knitted fabrics should be relaxed before spreading to minimize post-cut shrinkage and distortion.",

    aiRecommendation:
      "Automatically flag rolls that have not completed the required relaxation period.",
  },

  {
    id: "FC-003",

    category: "Marker Efficiency",

    title: "Marker Optimization",

    description:
      "Improve marker efficiency by optimizing pattern placement while maintaining grain, nap and quality requirements.",

    aiRecommendation:
      "Target marker efficiency above 85% wherever technically achievable.",
  },

  {
    id: "FC-004",

    category: "Fabric Width",

    title: "Actual Fabric Width",

    description:
      "Always calculate markers using actual cuttable width rather than nominal supplier width.",

    aiRecommendation:
      "Measure every roll before marker planning.",
  },

  {
    id: "FC-005",

    category: "Pattern Verification",

    title: "Photo Dimension Verification",

    description:
      "Capture every pattern piece on a white background with a 30 cm (12 inch) scale placed beside the pattern for AI-assisted dimension validation.",

    aiRecommendation:
      "Reject patterns showing dimensional deviation outside approved tolerance.",
  },

  {
    id: "FC-006",

    category: "Bundle Control",

    title: "Bundle Integrity",

    description:
      "Bundles must maintain size, shade and ply integrity throughout cutting and sewing.",

    aiRecommendation:
      "Use barcode or QR identification for every bundle.",
  },

];