export interface CountryKnowledgePack {
  countryCode: string;

  countryName: string;

  language: string;

  labourLawApplicable: boolean;

  environmentalRegulationApplicable: boolean;

  fireSafetyStandardApplicable: boolean;

  sustainabilityFrameworkApplicable: boolean;

  defaultComplianceLibraries: string[];

  defaultBuyerLibraries: string[];

  version: string;

  lastReviewed: string;

  isActive: boolean;
}

export const countryKnowledgePackLibrary: CountryKnowledgePack[] = [
  {
    countryCode: "BD",

    countryName: "Bangladesh",

    language: "Bangla / English",

    labourLawApplicable: true,

    environmentalRegulationApplicable: true,

    fireSafetyStandardApplicable: true,

    sustainabilityFrameworkApplicable: true,

    defaultComplianceLibraries: [
      "garmentComplianceKnowledgeLibrary",
      "globalComplianceKnowledgeLibrary",
      "needlePolicyKnowledgeLibrary",
    ],

    defaultBuyerLibraries: [
      "buyerRequirementKnowledgeLibrary",
    ],

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    countryCode: "VN",

    countryName: "Vietnam",

    language: "Vietnamese / English",

    labourLawApplicable: true,

    environmentalRegulationApplicable: true,

    fireSafetyStandardApplicable: true,

    sustainabilityFrameworkApplicable: true,

    defaultComplianceLibraries: [
      "garmentComplianceKnowledgeLibrary",
      "globalComplianceKnowledgeLibrary",
    ],

    defaultBuyerLibraries: [
      "buyerRequirementKnowledgeLibrary",
    ],

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },

  {
    countryCode: "JO",

    countryName: "Jordan",

    language: "Arabic / English",

    labourLawApplicable: true,

    environmentalRegulationApplicable: true,

    fireSafetyStandardApplicable: true,

    sustainabilityFrameworkApplicable: true,

    defaultComplianceLibraries: [
      "garmentComplianceKnowledgeLibrary",
      "globalComplianceKnowledgeLibrary",
    ],

    defaultBuyerLibraries: [
      "buyerRequirementKnowledgeLibrary",
    ],

    version: "1.0",

    lastReviewed: "2026-06-27",

    isActive: true,
  },
];