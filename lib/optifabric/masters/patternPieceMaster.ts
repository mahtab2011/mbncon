import { PatternPieceDefinition } from "./optifabricMasterTypes";

export const patternPieceMaster: PatternPieceDefinition[] = [
  {
    id: "piece-shirt-front",
    code: "PCS-SH-FRT",
    slug: "shirt-front",

    name: {
      en: "Shirt Front",
      bn: "শার্ট ফ্রন্ট",
    },

    aliases: {
      en: "Front, Front Body, Shirt Front Panel",
      bn: "ফ্রন্ট, ফ্রন্ট বডি, শার্ট ফ্রন্ট প্যানেল",
    },

    description: {
      en: "The main front body component of a shirt.",
      bn: "শার্টের প্রধান সামনের বডি অংশ।",
    },

    applicableGarmentCategoryIds: ["garment-mens-basic-shirt"],

    side: "pair",
    cutInstruction: "cut-one-pair",
    grainLineRequirement: "required",

    defaultPlacementRules: ["two-way"],

    canBeCutOnFold: false,
    canBeMirrored: true,
    requiresPairMatching: true,
    requiresNotchDetection: true,
    requiresDrillMarkDetection: false,

    active: true,
    sortOrder: 10,

    whyAiAsks: {
      title: {
        en: "Why does AI identify the shirt front?",
        bn: "AI কেন শার্ট ফ্রন্ট শনাক্ত করে?",
      },
      explanation: {
        en: "The shirt front normally forms a left and right pair and may require matching around the placket, pocket, stripe or check.",
        bn: "শার্ট ফ্রন্ট সাধারণত বাম ও ডান জোড়া হিসেবে থাকে এবং প্ল্যাকেট, পকেট, স্ট্রাইপ বা চেক মিলানোর প্রয়োজন হতে পারে।",
      },
      engineeringImpact: {
        en: "Correct identification controls pair quantity, mirroring and fabric-matching rules.",
        bn: "সঠিক শনাক্তকরণ জোড়ার পরিমাণ, মিররিং এবং ফেব্রিক ম্যাচিংয়ের নিয়ম নিয়ন্ত্রণ করে।",
      },
    },
  },

  {
    id: "piece-shirt-back",
    code: "PCS-SH-BCK",
    slug: "shirt-back",

    name: {
      en: "Shirt Back",
      bn: "শার্ট ব্যাক",
    },

    aliases: {
      en: "Back, Back Body, Shirt Back Panel",
      bn: "ব্যাক, ব্যাক বডি, শার্ট ব্যাক প্যানেল",
    },

    description: {
      en: "The main back body component of a shirt.",
      bn: "শার্টের প্রধান পেছনের বডি অংশ।",
    },

    applicableGarmentCategoryIds: ["garment-mens-basic-shirt"],

    side: "centre",
    cutInstruction: "cut-one",
    grainLineRequirement: "required",

    defaultPlacementRules: ["two-way"],

    canBeCutOnFold: true,
    canBeMirrored: false,
    requiresPairMatching: false,
    requiresNotchDetection: true,
    requiresDrillMarkDetection: false,

    active: true,
    sortOrder: 20,

    whyAiAsks: {
      title: {
        en: "Why does AI identify the shirt back?",
        bn: "AI কেন শার্ট ব্যাক শনাক্ত করে?",
      },
      explanation: {
        en: "The back may be a full piece, a fold piece or part of a yoke construction.",
        bn: "ব্যাক পিসটি সম্পূর্ণ পিস, ফোল্ড পিস অথবা ইয়োক নির্মাণের অংশ হতে পারে।",
      },
      engineeringImpact: {
        en: "The cut-on-fold status changes the required marker width and piece quantity.",
        bn: "কাট-অন-ফোল্ড অবস্থার কারণে প্রয়োজনীয় মার্কার প্রস্থ এবং পিসের পরিমাণ পরিবর্তিত হয়।",
      },
    },
  },

  {
    id: "piece-left-sleeve",
    code: "PCS-SH-SLV-L",
    slug: "left-sleeve",

    name: {
      en: "Left Sleeve",
      bn: "বাম স্লিভ",
    },

    aliases: {
      en: "Left Sleeve, Sleeve Left",
      bn: "বাম স্লিভ, স্লিভ বাম",
    },

    description: {
      en: "The left sleeve component of a shirt.",
      bn: "শার্টের বাম স্লিভ অংশ।",
    },

    applicableGarmentCategoryIds: ["garment-mens-basic-shirt"],

    side: "left",
    cutInstruction: "cut-one",
    grainLineRequirement: "required",

    defaultPlacementRules: ["two-way"],

    canBeCutOnFold: false,
    canBeMirrored: true,
    requiresPairMatching: true,
    requiresNotchDetection: true,
    requiresDrillMarkDetection: false,

    active: true,
    sortOrder: 30,

    whyAiAsks: {
      title: {
        en: "Why does AI identify the sleeve side?",
        bn: "AI কেন স্লিভের দিক শনাক্ত করে?",
      },
      explanation: {
        en: "Left and right sleeves must form a correct pair and may contain different notch positions.",
        bn: "বাম ও ডান স্লিভকে সঠিক জোড়া তৈরি করতে হয় এবং এগুলোতে আলাদা নচ অবস্থান থাকতে পারে।",
      },
      engineeringImpact: {
        en: "Incorrect sleeve pairing can create sewing defects and replacement cutting.",
        bn: "ভুল স্লিভ জোড়া সেলাই ত্রুটি এবং পুনরায় কাটিংয়ের প্রয়োজন তৈরি করতে পারে।",
      },
    },
  },

  {
    id: "piece-right-sleeve",
    code: "PCS-SH-SLV-R",
    slug: "right-sleeve",

    name: {
      en: "Right Sleeve",
      bn: "ডান স্লিভ",
    },

    aliases: {
      en: "Right Sleeve, Sleeve Right",
      bn: "ডান স্লিভ, স্লিভ ডান",
    },

    description: {
      en: "The right sleeve component of a shirt.",
      bn: "শার্টের ডান স্লিভ অংশ।",
    },

    applicableGarmentCategoryIds: ["garment-mens-basic-shirt"],

    side: "right",
    cutInstruction: "cut-one",
    grainLineRequirement: "required",

    defaultPlacementRules: ["two-way"],

    canBeCutOnFold: false,
    canBeMirrored: true,
    requiresPairMatching: true,
    requiresNotchDetection: true,
    requiresDrillMarkDetection: false,

    active: true,
    sortOrder: 40,

    whyAiAsks: {
      title: {
        en: "Why does AI identify the sleeve side?",
        bn: "AI কেন স্লিভের দিক শনাক্ত করে?",
      },
      explanation: {
        en: "Left and right sleeves must form a correct pair and may contain different notch positions.",
        bn: "বাম ও ডান স্লিভকে সঠিক জোড়া তৈরি করতে হয় এবং এগুলোতে আলাদা নচ অবস্থান থাকতে পারে।",
      },
      engineeringImpact: {
        en: "Correct sleeve recognition prevents pair shortages and assembly errors.",
        bn: "সঠিক স্লিভ শনাক্তকরণ জোড়ার ঘাটতি এবং অ্যাসেম্বলি ত্রুটি প্রতিরোধ করে।",
      },
    },
  },

  {
    id: "piece-shirt-collar",
    code: "PCS-SH-COL",
    slug: "shirt-collar",

    name: {
      en: "Collar",
      bn: "কলার",
    },

    aliases: {
      en: "Collar, Shirt Collar, Collar Leaf",
      bn: "কলার, শার্ট কলার, কলার লিফ",
    },

    description: {
      en: "The upper collar component attached to the collar stand.",
      bn: "কলার স্ট্যান্ডের সঙ্গে সংযুক্ত উপরের কলার অংশ।",
    },

    applicableGarmentCategoryIds: ["garment-mens-basic-shirt"],

    side: "centre",
    cutInstruction: "cut-two",
    grainLineRequirement: "required",

    defaultPlacementRules: ["two-way"],

    canBeCutOnFold: true,
    canBeMirrored: false,
    requiresPairMatching: false,
    requiresNotchDetection: true,
    requiresDrillMarkDetection: false,

    active: true,
    sortOrder: 50,

    whyAiAsks: {
      title: {
        en: "Why does AI identify the collar?",
        bn: "AI কেন কলার শনাক্ত করে?",
      },
      explanation: {
        en: "Collar components require accurate grain direction, symmetry and matching.",
        bn: "কলার পিসে সঠিক গ্রেইন দিক, সমতা এবং ম্যাচিং প্রয়োজন।",
      },
      engineeringImpact: {
        en: "Incorrect collar placement can cause twisting, imbalance and appearance defects.",
        bn: "ভুল কলার প্লেসমেন্টের কারণে মোচড়, ভারসাম্যহীনতা এবং বাহ্যিক ত্রুটি হতে পারে।",
      },
    },
  },

  {
    id: "piece-shirt-collar-stand",
    code: "PCS-SH-CST",
    slug: "shirt-collar-stand",

    name: {
      en: "Collar Stand",
      bn: "কলার স্ট্যান্ড",
    },

    aliases: {
      en: "Collar Stand, Neck Band",
      bn: "কলার স্ট্যান্ড, নেক ব্যান্ড",
    },

    description: {
      en: "The shaped neck component connecting the collar to the shirt body.",
      bn: "কলারকে শার্ট বডির সঙ্গে যুক্ত করা আকৃতিযুক্ত নেক অংশ।",
    },

    applicableGarmentCategoryIds: ["garment-mens-basic-shirt"],

    side: "centre",
    cutInstruction: "cut-two",
    grainLineRequirement: "required",

    defaultPlacementRules: ["two-way"],

    canBeCutOnFold: false,
    canBeMirrored: false,
    requiresPairMatching: false,
    requiresNotchDetection: true,
    requiresDrillMarkDetection: false,

    active: true,
    sortOrder: 60,

    whyAiAsks: {
      title: {
        en: "Why does AI identify the collar stand?",
        bn: "AI কেন কলার স্ট্যান্ড শনাক্ত করে?",
      },
      explanation: {
        en: "The collar stand is a separate shaped component with its own quantity and grain requirements.",
        bn: "কলার স্ট্যান্ড একটি আলাদা আকৃতির পিস, যার নিজস্ব পরিমাণ এবং গ্রেইনের প্রয়োজন রয়েছে।",
      },
      engineeringImpact: {
        en: "Missing collar-stand pieces can stop sewing production even when all larger pieces are available.",
        bn: "বড় সব পিস পাওয়া গেলেও কলার স্ট্যান্ড না থাকলে সেলাই উৎপাদন বন্ধ হয়ে যেতে পারে।",
      },
    },
  },

  {
    id: "piece-shirt-pocket",
    code: "PCS-SH-PKT",
    slug: "shirt-pocket",

    name: {
      en: "Pocket",
      bn: "পকেট",
    },

    aliases: {
      en: "Pocket, Chest Pocket, Shirt Pocket",
      bn: "পকেট, চেস্ট পকেট, শার্ট পকেট",
    },

    description: {
      en: "The external shirt pocket component.",
      bn: "শার্টের বাইরের পকেট অংশ।",
    },

    applicableGarmentCategoryIds: ["garment-mens-basic-shirt"],

    side: "not-applicable",
    cutInstruction: "cut-one",
    grainLineRequirement: "required",

    defaultPlacementRules: ["two-way"],

    canBeCutOnFold: false,
    canBeMirrored: false,
    requiresPairMatching: false,
    requiresNotchDetection: false,
    requiresDrillMarkDetection: true,

    active: true,
    sortOrder: 70,

    whyAiAsks: {
      title: {
        en: "Why does AI identify the pocket?",
        bn: "AI কেন পকেট শনাক্ত করে?",
      },
      explanation: {
        en: "Pocket positioning and stripe or check matching can influence the usable placement area.",
        bn: "পকেটের অবস্থান এবং স্ট্রাইপ বা চেক ম্যাচিং ব্যবহারযোগ্য প্লেসমেন্ট এরিয়াকে প্রভাবিত করতে পারে।",
      },
      engineeringImpact: {
        en: "Pocket matching allowances may increase consumption but improve garment appearance.",
        bn: "পকেট ম্যাচিং অ্যালাউন্স ফেব্রিক কনজাম্পশন বাড়াতে পারে, তবে পোশাকের বাহ্যিক মান উন্নত করে।",
      },
    },
  },

  {
    id: "piece-shirt-cuff",
    code: "PCS-SH-CUF",
    slug: "shirt-cuff",

    name: {
      en: "Cuff",
      bn: "কাফ",
    },

    aliases: {
      en: "Cuff, Sleeve Cuff, Shirt Cuff",
      bn: "কাফ, স্লিভ কাফ, শার্ট কাফ",
    },

    description: {
      en: "The lower sleeve finishing component.",
      bn: "স্লিভের নিচের ফিনিশিং অংশ।",
    },

    applicableGarmentCategoryIds: ["garment-mens-basic-shirt"],

    side: "pair",
    cutInstruction: "cut-two",
    grainLineRequirement: "required",

    defaultPlacementRules: ["two-way"],

    canBeCutOnFold: false,
    canBeMirrored: true,
    requiresPairMatching: true,
    requiresNotchDetection: true,
    requiresDrillMarkDetection: false,

    active: true,
    sortOrder: 80,

    whyAiAsks: {
      title: {
        en: "Why does AI identify the cuff?",
        bn: "AI কেন কাফ শনাক্ত করে?",
      },
      explanation: {
        en: "Cuffs require paired quantities, symmetry and appropriate grain direction.",
        bn: "কাফের জন্য জোড়া পরিমাণ, সমতা এবং উপযুক্ত গ্রেইন দিক প্রয়োজন।",
      },
      engineeringImpact: {
        en: "Incorrect cuff quantity creates incomplete garment bundles.",
        bn: "ভুল কাফের পরিমাণ অসম্পূর্ণ গার্মেন্ট বান্ডেল তৈরি করে।",
      },
    },
  },

  {
    id: "piece-shirt-facing",
    code: "PCS-SH-FAC",
    slug: "shirt-facing",

    name: {
      en: "Facing",
      bn: "ফেসিং",
    },

    aliases: {
      en: "Facing, Front Facing, Shirt Facing",
      bn: "ফেসিং, ফ্রন্ট ফেসিং, শার্ট ফেসিং",
    },

    description: {
      en: "An internal finishing component used around garment openings or front edges.",
      bn: "পোশাকের ওপেনিং বা সামনের প্রান্তে ব্যবহৃত একটি অভ্যন্তরীণ ফিনিশিং পিস।",
    },

    applicableGarmentCategoryIds: ["garment-mens-basic-shirt"],

    side: "pair",
    cutInstruction: "cut-one-pair",
    grainLineRequirement: "required",

    defaultPlacementRules: ["two-way"],

    canBeCutOnFold: false,
    canBeMirrored: true,
    requiresPairMatching: true,
    requiresNotchDetection: true,
    requiresDrillMarkDetection: false,

    active: true,
    sortOrder: 90,

    whyAiAsks: {
      title: {
        en: "Why does AI identify the facing?",
        bn: "AI কেন ফেসিং শনাক্ত করে?",
      },
      explanation: {
        en: "Facing pieces may be narrow or irregular and can easily be omitted during manual pattern checking.",
        bn: "ফেসিং পিস সরু বা অনিয়মিত হতে পারে এবং হাতে প্যাটার্ন যাচাইয়ের সময় সহজেই বাদ পড়ে যেতে পারে।",
      },
      engineeringImpact: {
        en: "Automatic recognition reduces the risk of incomplete cutting sets.",
        bn: "স্বয়ংক্রিয় শনাক্তকরণ অসম্পূর্ণ কাটিং সেটের ঝুঁকি কমায়।",
      },
    },
  },
];

export function getActivePatternPieces(): PatternPieceDefinition[] {
  return patternPieceMaster
    .filter((piece) => piece.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPatternPieceById(
  id: string
): PatternPieceDefinition | undefined {
  return patternPieceMaster.find((piece) => piece.id === id);
}

export function getPatternPieceByCode(
  code: string
): PatternPieceDefinition | undefined {
  return patternPieceMaster.find(
    (piece) => piece.code.toLowerCase() === code.toLowerCase()
  );
}

export function getPatternPiecesForGarment(
  garmentCategoryId: string
): PatternPieceDefinition[] {
  return patternPieceMaster
    .filter(
      (piece) =>
        piece.active &&
        piece.applicableGarmentCategoryIds.includes(garmentCategoryId)
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function searchPatternPieces(
  searchTerm: string
): PatternPieceDefinition[] {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return getActivePatternPieces();
  }

  return patternPieceMaster.filter((piece) => {
    const searchableText = [
      piece.code,
      piece.slug,
      piece.name.en,
      piece.name.bn ?? "",
      piece.aliases.en,
      piece.aliases.bn ?? "",
      piece.description.en,
      piece.description.bn ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });
}