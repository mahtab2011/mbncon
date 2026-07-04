export interface LanguageKnowledgePack {
  languageCode: string;

  languageName: string;

  nativeName: string;

  countries: string[];

  isDefault: boolean;

  textDirection: "LTR" | "RTL";

  supported: boolean;
}

export const languageKnowledgePackLibrary: LanguageKnowledgePack[] = [
  {
    languageCode: "en",

    languageName: "English",

    nativeName: "English",

    countries: ["Global"],

    isDefault: true,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "bn",

    languageName: "Bangla",

    nativeName: "বাংলা",

    countries: ["Bangladesh"],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "es",

    languageName: "Spanish",

    nativeName: "Español",

    countries: [
      "Honduras",
      "Costa Rica",
      "Mexico",
    ],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "ta",

    languageName: "Tamil",

    nativeName: "தமிழ்",

    countries: [
      "India",
      "Sri Lanka",
    ],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "ur",

    languageName: "Urdu",

    nativeName: "اردو",

    countries: ["Pakistan"],

    isDefault: false,

    textDirection: "RTL",

    supported: true,
  },

  {
    languageCode: "zh",

    languageName: "Chinese",

    nativeName: "中文",

    countries: ["China"],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "am",

    languageName: "Amharic",

    nativeName: "አማርኛ",

    countries: ["Ethiopia"],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "sw",

    languageName: "Swahili",

    nativeName: "Kiswahili",

    countries: [
      "Kenya",
      "Tanzania",
      "Uganda",
    ],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "ar",

    languageName: "Arabic",

    nativeName: "العربية",

    countries: [
      "Jordan",
      "Egypt",
      "Middle East",
    ],

    isDefault: false,

    textDirection: "RTL",

    supported: true,
  },

  {
    languageCode: "km",

    languageName: "Khmer",

    nativeName: "ខ្មែរ",

    countries: ["Cambodia"],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "vi",

    languageName: "Vietnamese",

    nativeName: "Tiếng Việt",

    countries: ["Vietnam"],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "fr",

    languageName: "French",

    nativeName: "Français",

    countries: [
      "Mauritius",
      "Madagascar",
    ],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },

  {
    languageCode: "id",

    languageName: "Indonesian",

    nativeName: "Bahasa Indonesia",

    countries: ["Indonesia"],

    isDefault: false,

    textDirection: "LTR",

    supported: true,
  },
];