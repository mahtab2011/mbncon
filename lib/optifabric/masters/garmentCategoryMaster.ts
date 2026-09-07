import {
  GarmentCategoryDefinition,
  GarmentConstructionType,
} from "./optifabricMasterTypes";

export const garmentCategoryMaster: GarmentCategoryDefinition[] = [
  {
    id: "garment-mens-basic-shirt",
    code: "GAR-MBS",
    slug: "mens-basic-shirt",

    name: {
      en: "Men's Basic Shirt",
      bn: "পুরুষদের বেসিক শার্ট",
    },

    shortName: {
      en: "Men's Shirt",
      bn: "পুরুষদের শার্ট",
    },

    description: {
      en: "A standard woven men's shirt category used for engineering demonstrations, validation, marker planning and cutting analysis.",
      bn: "ইঞ্জিনিয়ারিং প্রদর্শন, যাচাই, মার্কার পরিকল্পনা এবং কাটিং বিশ্লেষণের জন্য ব্যবহৃত একটি স্ট্যান্ডার্ড ওভেন পুরুষদের শার্ট ক্যাটাগরি।",
    },

    constructionType: "woven",

    productGroups: ["tops", "menswear"],

    defaultPatternPieceIds: [
      "piece-shirt-front",
      "piece-shirt-back",
      "piece-left-sleeve",
      "piece-right-sleeve",
      "piece-shirt-collar",
      "piece-shirt-collar-stand",
      "piece-shirt-pocket",
      "piece-shirt-cuff",
      "piece-shirt-facing",
    ],

    optionalPatternPieceIds: [
      "piece-shirt-yoke",
      "piece-shirt-placket",
      "piece-shirt-sleeve-placket",
    ],

    supportsSizeRatioPlanning: true,
    supportsStripeMatching: true,
    supportsCheckMatching: true,
    supportsNapControl: false,
    supportsDirectionalPrintControl: true,

    active: true,
    sortOrder: 10,

    whyAiAsks: {
      title: {
        en: "Why does AI ask for the garment category?",
        bn: "AI কেন পোশাকের ক্যাটাগরি জানতে চায়?",
      },

      explanation: {
        en: "The garment category helps AI identify the expected pattern pieces, construction rules and cutting requirements.",
        bn: "পোশাকের ক্যাটাগরি AI-কে সম্ভাব্য প্যাটার্ন পিস, নির্মাণের নিয়ম এবং কাটিংয়ের প্রয়োজনীয়তা শনাক্ত করতে সাহায্য করে।",
      },

      engineeringImpact: {
        en: "Incorrect garment classification can cause missing-piece warnings, inaccurate marker rules and incorrect consumption calculations.",
        bn: "ভুল পোশাক শ্রেণিবিন্যাসের কারণে প্যাটার্ন পিস বাদ পড়ার সতর্কতা, ভুল মার্কার নিয়ম এবং ভুল ফেব্রিক কনজাম্পশন হিসাব হতে পারে।",
      },
    },
  },

  {
    id: "garment-basic-trouser",
    code: "GAR-BTR",
    slug: "basic-trouser",

    name: {
      en: "Basic Trouser",
      bn: "বেসিক ট্রাউজার",
    },

    description: {
      en: "A standard trouser category supporting woven, denim, uniform and workwear applications.",
      bn: "ওভেন, ডেনিম, ইউনিফর্ম এবং ওয়ার্কওয়্যার ব্যবহারের উপযোগী একটি স্ট্যান্ডার্ড ট্রাউজার ক্যাটাগরি।",
    },

    constructionType: "woven",

    productGroups: ["bottoms", "menswear", "ladieswear"],

    defaultPatternPieceIds: [
      "piece-trouser-front",
      "piece-trouser-back",
      "piece-trouser-waistband",
      "piece-trouser-pocket",
      "piece-trouser-fly",
    ],

    optionalPatternPieceIds: [
      "piece-trouser-pocket-facing",
      "piece-trouser-belt-loop",
      "piece-trouser-coin-pocket",
    ],

    supportsSizeRatioPlanning: true,
    supportsStripeMatching: true,
    supportsCheckMatching: true,
    supportsNapControl: true,
    supportsDirectionalPrintControl: true,

    active: true,
    sortOrder: 20,

    whyAiAsks: {
      title: {
        en: "Why does AI ask for the garment category?",
        bn: "AI কেন পোশাকের ক্যাটাগরি জানতে চায়?",
      },

      explanation: {
        en: "Trouser patterns require different piece relationships, grain controls and pairing rules from shirts or jackets.",
        bn: "ট্রাউজারের প্যাটার্নে শার্ট বা জ্যাকেটের তুলনায় আলাদা পিস সম্পর্ক, গ্রেইন নিয়ন্ত্রণ এবং জোড়া তৈরির নিয়ম প্রয়োজন।",
      },

      engineeringImpact: {
        en: "The category determines the expected pieces and the marker rules used during optimization.",
        bn: "পোশাকের ক্যাটাগরি প্রত্যাশিত প্যাটার্ন পিস এবং অপ্টিমাইজেশনের সময় ব্যবহৃত মার্কার নিয়ম নির্ধারণ করে।",
      },
    },
  },

  {
    id: "garment-polo-shirt",
    code: "GAR-PLS",
    slug: "polo-shirt",

    name: {
      en: "Polo Shirt",
      bn: "পোলো শার্ট",
    },

    description: {
      en: "A knit polo-shirt category with body, sleeve, collar, placket and optional cuff components.",
      bn: "বডি, স্লিভ, কলার, প্ল্যাকেট এবং ঐচ্ছিক কাফসহ একটি নিট পোলো শার্ট ক্যাটাগরি।",
    },

    constructionType: "knit",

    productGroups: ["tops", "sportswear", "menswear", "ladieswear"],

    defaultPatternPieceIds: [
      "piece-polo-front",
      "piece-polo-back",
      "piece-polo-left-sleeve",
      "piece-polo-right-sleeve",
      "piece-polo-collar",
      "piece-polo-placket",
    ],

    optionalPatternPieceIds: [
      "piece-polo-cuff",
      "piece-polo-pocket",
    ],

    supportsSizeRatioPlanning: true,
    supportsStripeMatching: true,
    supportsCheckMatching: false,
    supportsNapControl: false,
    supportsDirectionalPrintControl: true,

    active: true,
    sortOrder: 30,

    whyAiAsks: {
      title: {
        en: "Why does AI ask for the garment category?",
        bn: "AI কেন পোশাকের ক্যাটাগরি জানতে চায়?",
      },

      explanation: {
        en: "Knit garments require different fabric behaviour, relaxation, shrinkage and marker handling from woven garments.",
        bn: "নিট পোশাকে ওভেন পোশাকের তুলনায় আলাদা ফেব্রিক আচরণ, রিল্যাক্সেশন, সংকোচন এবং মার্কার ব্যবস্থাপনা প্রয়োজন।",
      },

      engineeringImpact: {
        en: "The selected category helps AI apply suitable knit-fabric engineering rules.",
        bn: "নির্বাচিত ক্যাটাগরি AI-কে উপযুক্ত নিট ফেব্রিক ইঞ্জিনিয়ারিং নিয়ম প্রয়োগ করতে সাহায্য করে।",
      },
    },
  },

  {
    id: "garment-basic-jacket",
    code: "GAR-BJK",
    slug: "basic-jacket",

    name: {
      en: "Basic Jacket",
      bn: "বেসিক জ্যাকেট",
    },

    description: {
      en: "A structured outerwear category supporting shell, lining, facing, collar and sleeve pattern components.",
      bn: "শেল, লাই닝, ফেসিং, কলার এবং স্লিভ প্যাটার্ন পিস সমর্থনকারী একটি স্ট্রাকচার্ড আউটারওয়্যার ক্যাটাগরি।",
    },

    constructionType: "woven",

    productGroups: ["outerwear", "menswear", "ladieswear"],

    defaultPatternPieceIds: [
      "piece-jacket-front",
      "piece-jacket-back",
      "piece-jacket-left-sleeve",
      "piece-jacket-right-sleeve",
      "piece-jacket-collar",
      "piece-jacket-facing",
    ],

    optionalPatternPieceIds: [
      "piece-jacket-lining-front",
      "piece-jacket-lining-back",
      "piece-jacket-pocket",
      "piece-jacket-flap",
      "piece-jacket-cuff",
    ],

    supportsSizeRatioPlanning: true,
    supportsStripeMatching: true,
    supportsCheckMatching: true,
    supportsNapControl: true,
    supportsDirectionalPrintControl: true,

    active: true,
    sortOrder: 40,

    whyAiAsks: {
      title: {
        en: "Why does AI ask for the garment category?",
        bn: "AI কেন পোশাকের ক্যাটাগরি জানতে চায়?",
      },

      explanation: {
        en: "Jackets may contain shell, lining, reinforcement and facing components that require separate material and marker plans.",
        bn: "জ্যাকেটে শেল, লাই닝, রিইনফোর্সমেন্ট এবং ফেসিং পিস থাকতে পারে, যেগুলোর জন্য আলাদা ম্যাটেরিয়াল ও মার্কার পরিকল্পনা প্রয়োজন।",
      },

      engineeringImpact: {
        en: "Correct classification prevents shell and lining pieces from being mixed into an unsuitable marker plan.",
        bn: "সঠিক শ্রেণিবিন্যাস শেল এবং লাই닝 পিসকে অনুপযুক্ত একই মার্কার পরিকল্পনায় মিশে যাওয়া থেকে রক্ষা করে।",
      },
    },
  },

  {
    id: "garment-t-shirt",
    code: "GAR-TSH",
    slug: "t-shirt",

    name: {
      en: "T-Shirt",
      bn: "টি-শার্ট",
    },

    description: {
      en: "A knit T-shirt category for basic, fashion, sportswear and promotional garments.",
      bn: "বেসিক, ফ্যাশন, স্পোর্টসওয়্যার এবং প্রচারণামূলক পোশাকের জন্য একটি নিট টি-শার্ট ক্যাটাগরি।",
    },

    constructionType: "knit",

    productGroups: ["tops", "sportswear", "menswear", "ladieswear"],

    defaultPatternPieceIds: [
      "piece-tshirt-front",
      "piece-tshirt-back",
      "piece-tshirt-left-sleeve",
      "piece-tshirt-right-sleeve",
      "piece-tshirt-neck-rib",
    ],

    optionalPatternPieceIds: ["piece-tshirt-pocket"],

    supportsSizeRatioPlanning: true,
    supportsStripeMatching: true,
    supportsCheckMatching: false,
    supportsNapControl: false,
    supportsDirectionalPrintControl: true,

    active: true,
    sortOrder: 50,

    whyAiAsks: {
      title: {
        en: "Why does AI ask for the garment category?",
        bn: "AI কেন পোশাকের ক্যাটাগরি জানতে চায়?",
      },

      explanation: {
        en: "The category helps AI apply the correct knit pattern, shrinkage and fabric relaxation rules.",
        bn: "এই ক্যাটাগরি AI-কে সঠিক নিট প্যাটার্ন, সংকোচন এবং ফেব্রিক রিল্যাক্সেশন নিয়ম প্রয়োগ করতে সাহায্য করে।",
      },

      engineeringImpact: {
        en: "The correct category improves pattern recognition and consumption accuracy.",
        bn: "সঠিক ক্যাটাগরি প্যাটার্ন শনাক্তকরণ এবং ফেব্রিক কনজাম্পশন হিসাবের নির্ভুলতা উন্নত করে।",
      },
    },
  },
];

const plannedGarmentCategories: Array<{
  id: string;
  code: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  constructionType: GarmentConstructionType;
}> = [
  {
    id: "garment-blazer",
    code: "GAR-BLZ",
    slug: "blazer",
    nameEn: "Blazer",
    nameBn: "ব্লেজার",
    constructionType: "woven",
  },
  {
    id: "garment-coat",
    code: "GAR-COT",
    slug: "coat",
    nameEn: "Coat",
    nameBn: "কোট",
    constructionType: "woven",
  },
  {
    id: "garment-dress",
    code: "GAR-DRS",
    slug: "dress",
    nameEn: "Dress",
    nameBn: "ড্রেস",
    constructionType: "woven",
  },
  {
    id: "garment-skirt",
    code: "GAR-SKT",
    slug: "skirt",
    nameEn: "Skirt",
    nameBn: "স্কার্ট",
    constructionType: "woven",
  },
  {
    id: "garment-shorts",
    code: "GAR-SRT",
    slug: "shorts",
    nameEn: "Shorts",
    nameBn: "শর্টস",
    constructionType: "woven",
  },
  {
    id: "garment-hoodie",
    code: "GAR-HOD",
    slug: "hoodie",
    nameEn: "Hoodie",
    nameBn: "হুডি",
    constructionType: "knit",
  },
  {
    id: "garment-sweatshirt",
    code: "GAR-SWT",
    slug: "sweatshirt",
    nameEn: "Sweatshirt",
    nameBn: "সোয়েটশার্ট",
    constructionType: "knit",
  },
  {
    id: "garment-sportswear",
    code: "GAR-SPW",
    slug: "sportswear",
    nameEn: "Sportswear",
    nameBn: "স্পোর্টসওয়্যার",
    constructionType: "mixed",
  },
  {
    id: "garment-workwear",
    code: "GAR-WKW",
    slug: "workwear",
    nameEn: "Workwear",
    nameBn: "ওয়ার্কওয়্যার",
    constructionType: "woven",
  },
  {
    id: "garment-uniform",
    code: "GAR-UNF",
    slug: "uniform",
    nameEn: "Uniform",
    nameBn: "ইউনিফর্ম",
    constructionType: "mixed",
  },
  {
    id: "garment-childrenswear",
    code: "GAR-CHD",
    slug: "childrenswear",
    nameEn: "Children's Garment",
    nameBn: "শিশুদের পোশাক",
    constructionType: "mixed",
  },
  {
    id: "garment-lingerie",
    code: "GAR-LNG",
    slug: "lingerie",
    nameEn: "Lingerie",
    nameBn: "লঞ্জারি",
    constructionType: "knit",
  },
];

export const garmentCategoryRoadmap = plannedGarmentCategories;

export function getActiveGarmentCategories(): GarmentCategoryDefinition[] {
  return garmentCategoryMaster
    .filter((category) => category.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getGarmentCategoryById(
  id: string
): GarmentCategoryDefinition | undefined {
  return garmentCategoryMaster.find((category) => category.id === id);
}

export function getGarmentCategoryByCode(
  code: string
): GarmentCategoryDefinition | undefined {
  return garmentCategoryMaster.find(
    (category) => category.code.toLowerCase() === code.toLowerCase()
  );
}

export function getGarmentCategoryBySlug(
  slug: string
): GarmentCategoryDefinition | undefined {
  return garmentCategoryMaster.find(
    (category) => category.slug.toLowerCase() === slug.toLowerCase()
  );
}

export function searchGarmentCategories(
  searchTerm: string
): GarmentCategoryDefinition[] {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return getActiveGarmentCategories();
  }

  return garmentCategoryMaster.filter((category) => {
    const searchableText = [
      category.code,
      category.slug,
      category.name.en,
      category.name.bn ?? "",
      category.description.en,
      category.description.bn ?? "",
      ...category.productGroups,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });
}