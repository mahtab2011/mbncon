/*
==========================================================

MBNCON AI Global Translation Engine

translationEngine.ts

Version : RC1

Purpose

Returns translated manufacturing terminology and UI text
from the shared dictionary.

==========================================================
*/

import {
  dictionaries,
  TranslationKey,
} from "./dictionary";

import {
  supportedLanguages,
} from "./language";

export type SupportedLanguageCode =
  typeof supportedLanguages[number]["code"];

export function getLanguageDirection(
  languageCode: string
): "ltr" | "rtl" {
  const language =
    supportedLanguages.find(
      (item) => item.code === languageCode
    );

  return language?.direction ?? "ltr";
}

export function translate(
  key: TranslationKey,
  languageCode: string = "en"
): string {
  const dictionary =
    dictionaries[
      languageCode as keyof typeof dictionaries
    ] ?? dictionaries.en;

  return dictionary[key] ?? dictionaries.en[key] ?? key;
}