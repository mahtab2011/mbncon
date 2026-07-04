export interface BuyerKnowledgePack {
  buyerCode: string;

  buyerName: string;

  headquarters: string;

  sustainabilityRequired: boolean;

  chemicalComplianceRequired: boolean;

  socialComplianceRequired: boolean;

  qualityComplianceRequired: boolean;

  packagingComplianceRequired: boolean;

  linkedKnowledgeLibraries: string[];

  version: string;

  lastReviewed: string;

  isActive: boolean;
}

export const buyerKnowledgePackLibrary: BuyerKnowledgePack[] = [
  {
    buyerCode: "HNM",

    buyerName: "H&M",

    headquarters: "Sweden",

    sustainabilityRequired: true,

    chemicalComplianceRequired: true,

    socialComplianceRequired: true,

    qualityComplianceRequired: true,

    packagingComplianceRequired: true,

    linkedKnowledgeLibraries: [
      "buyerRequirementKnowledgeLibrary",
      "globalComplianceKnowledgeLibrary",
      "chemicalManagementKnowledgeLibrary",
      "esgKnowledgeLibrary",
    ],

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    buyerCode: "IND",

    buyerName: "Inditex (Zara)",

    headquarters: "Spain",

    sustainabilityRequired: true,

    chemicalComplianceRequired: true,

    socialComplianceRequired: true,

    qualityComplianceRequired: true,

    packagingComplianceRequired: true,

    linkedKnowledgeLibraries: [
      "buyerRequirementKnowledgeLibrary",
      "chemicalManagementKnowledgeLibrary",
      "garmentComplianceKnowledgeLibrary",
      "esgKnowledgeLibrary",
    ],

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    buyerCode: "PVH",

    buyerName: "PVH",

    headquarters: "USA",

    sustainabilityRequired: true,

    chemicalComplianceRequired: true,

    socialComplianceRequired: true,

    qualityComplianceRequired: true,

    packagingComplianceRequired: true,

    linkedKnowledgeLibraries: [
      "buyerRequirementKnowledgeLibrary",
      "needlePolicyKnowledgeLibrary",
      "chemicalManagementKnowledgeLibrary",
      "esgKnowledgeLibrary",
    ],

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },
];