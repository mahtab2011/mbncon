/*
==========================================================

MBNCON AI Global Translation Engine

languages.ts

Version : RC1

Purpose

Master language definitions shared by all
MBNCON AI applications.

Products

✓ OptiFabric AI
✓ OptiLeather AI
✓ OptiShoes AI
✓ OptiSew AI
✓ OptiFinish AI
✓ GPA Enterprise

==========================================================
*/

export interface SupportedLanguage {

  code: string;

  englishName: string;

  nativeName: string;

  direction: "ltr" | "rtl";

  enabled: boolean;

}

export const supportedLanguages: SupportedLanguage[] = [

  {
    code: "en",
    englishName: "English",
    nativeName: "English",
    direction: "ltr",
    enabled: true,
  },

  {
    code: "bn",
    englishName: "Bangla",
    nativeName: "বাংলা",
    direction: "ltr",
    enabled: true,
  },

  {
    code: "ur",
    englishName: "Urdu",
    nativeName: "اردو",
    direction: "rtl",
    enabled: true,
  },

  {
    code: "ar",
    englishName: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    enabled: true,
  },

  {
    code: "es",
    englishName: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    enabled: true,
  },

  {
    code: "id",
    englishName: "Bahasa Indonesia",
    nativeName: "Bahasa Indonesia",
    direction: "ltr",
    enabled: true,
  },

  {
    code: "am",
    englishName: "Amharic",
    nativeName: "አማርኛ",
    direction: "ltr",
    enabled: true,
  },

  {
    code: "ti",
    englishName: "Tigrinya",
    nativeName: "ትግርኛ",
    direction: "ltr",
    enabled: true,
  },

];