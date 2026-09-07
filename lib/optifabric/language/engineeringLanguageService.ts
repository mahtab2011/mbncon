/**
 * OptiFabric AI
 * RC5-003L-003 — Engineering Language Service
 *
 * Purpose:
 * - Provide one commercial-grade language gateway for OptiFabric.
 * - Keep approved engineering terminology deterministic.
 * - Support UI labels, engineering messages, AI prompts and reports.
 * - Prepare the architecture for future global language packs.
 */

import {
  getEngineeringTerm,
  getEngineeringTermKeys,
  type EngineeringTermKey,
  type OptiFabricLanguageCode,
} from "./engineeringDictionary";

import {
  createEngineeringLabelResolver,
  createEngineeringTextResolver,
  getEngineeringResolverInstruction,
  resolveProtectedTermsInText,
  validateProtectedTerminology,
  type EngineeringTermResolverOptions,
  type ResolvedEngineeringText,
} from "./engineeringTermResolver";

export type EngineeringLanguage = OptiFabricLanguageCode;

export type EngineeringLanguageFallbackMode =
  | "english"
  | "preserve"
  | "empty";

export interface EngineeringLanguageServiceOptions {
  readonly language?: EngineeringLanguage;
  readonly fallbackLanguage?: EngineeringLanguage;
  readonly fallbackMode?: EngineeringLanguageFallbackMode;
  readonly caseSensitiveTerms?: boolean;
}

export interface EngineeringMessageDefinition {
  readonly en: string;
  readonly bn: string;
}

export type EngineeringMessageDictionary = Readonly<
  Record<string, EngineeringMessageDefinition>
>;

export interface EngineeringTranslationValidationResult {
  readonly valid: boolean;
  readonly sourceText: string;
  readonly translatedText: string;
  readonly language: EngineeringLanguage;
  readonly requiredTerms: ReadonlyArray<EngineeringTermKey>;
  readonly missingTerms: ReadonlyArray<EngineeringTermKey>;
}

export interface EngineeringLanguageSnapshot {
  readonly language: EngineeringLanguage;
  readonly fallbackLanguage: EngineeringLanguage;
  readonly registeredTerms: number;
  readonly protectedTermInstruction: string;
}

export interface EngineeringPromptPackage {
  readonly language: EngineeringLanguage;
  readonly systemInstruction: string;
  readonly terminologyInstruction: string;
  readonly userPrompt: string;
}

export interface EngineeringLanguageService {
  readonly language: EngineeringLanguage;
  readonly fallbackLanguage: EngineeringLanguage;

  term(key: EngineeringTermKey): string;

  terms(
    keys: ReadonlyArray<EngineeringTermKey>,
  ): Readonly<Record<EngineeringTermKey, string>>;

  resolveText(text: string): ResolvedEngineeringText;

  message(
    key: string,
    dictionary: EngineeringMessageDictionary,
    variables?: Readonly<Record<string, string | number>>,
  ): string;

  validateTranslation(
    sourceText: string,
    translatedText: string,
  ): EngineeringTranslationValidationResult;

  createPromptPackage(
    userPrompt: string,
    systemInstruction?: string,
  ): EngineeringPromptPackage;

  snapshot(): EngineeringLanguageSnapshot;
}

const DEFAULT_LANGUAGE: EngineeringLanguage = "en";
const DEFAULT_FALLBACK_LANGUAGE: EngineeringLanguage = "en";

/**
 * Checks whether a value is a supported OptiFabric language code.
 */
export function isEngineeringLanguage(
  value: string,
): value is EngineeringLanguage {
  return value === "en" || value === "bn";
}

/**
 * Normalises a supplied language value.
 *
 * Examples:
 * "en-GB" → "en"
 * "bn-BD" → "bn"
 * "EN" → "en"
 */
export function normaliseEngineeringLanguage(
  value: string | null | undefined,
  fallback: EngineeringLanguage = DEFAULT_LANGUAGE,
): EngineeringLanguage {
  if (!value) {
    return fallback;
  }

  const normalised = value.trim().toLowerCase();

  if (normalised.startsWith("bn")) {
    return "bn";
  }

  if (normalised.startsWith("en")) {
    return "en";
  }

  return fallback;
}

/**
 * Replaces template variables inside controlled language messages.
 *
 * Example:
 * "Marker {markerNumber} saved."
 */
export function interpolateEngineeringMessage(
  message: string,
  variables: Readonly<Record<string, string | number>> = {},
): string {
  return message.replace(
    /\{([a-zA-Z0-9_]+)\}/g,
    (match, variableName: string) => {
      const value = variables[variableName];

      if (value === undefined || value === null) {
        return match;
      }

      return String(value);
    },
  );
}

/**
 * Resolves a controlled message from a bilingual message dictionary.
 */
export function resolveEngineeringMessage(
  key: string,
  dictionary: EngineeringMessageDictionary,
  language: EngineeringLanguage,
  fallbackLanguage: EngineeringLanguage = DEFAULT_FALLBACK_LANGUAGE,
  fallbackMode: EngineeringLanguageFallbackMode = "english",
  variables: Readonly<Record<string, string | number>> = {},
): string {
  const entry = dictionary[key];

  if (!entry) {
    if (fallbackMode === "empty") {
      return "";
    }

    return fallbackMode === "preserve" ? key : key;
  }

  const translatedMessage =
    entry[language] ||
    entry[fallbackLanguage] ||
    (fallbackMode === "english" ? entry.en : "");

  return interpolateEngineeringMessage(
    translatedMessage,
    variables,
  );
}

/**
 * Applies approved engineering terminology after a controlled message
 * has been selected.
 */
export function resolveTerminologySafeMessage(
  message: string,
  language: EngineeringLanguage,
  options: Omit<EngineeringTermResolverOptions, "language"> = {},
): string {
  return resolveProtectedTermsInText(message, {
    ...options,
    language,
  }).resolvedText;
}

/**
 * Creates one reusable Engineering Language Service instance.
 */
export function createEngineeringLanguageService(
  options: EngineeringLanguageServiceOptions = {},
): EngineeringLanguageService {
  const language = options.language ?? DEFAULT_LANGUAGE;

  const fallbackLanguage =
    options.fallbackLanguage ?? DEFAULT_FALLBACK_LANGUAGE;

  const fallbackMode = options.fallbackMode ?? "english";

  const resolveLabel = createEngineeringLabelResolver(language);

  const resolveText = createEngineeringTextResolver(language, {
    caseSensitive: options.caseSensitiveTerms ?? false,
  });

  return {
    language,
    fallbackLanguage,

    term(key: EngineeringTermKey): string {
      return resolveLabel(key);
    },

    terms(
      keys: ReadonlyArray<EngineeringTermKey>,
    ): Readonly<Record<EngineeringTermKey, string>> {
      return keys.reduce(
        (result, key) => {
          result[key] = resolveLabel(key);
          return result;
        },
        {} as Record<EngineeringTermKey, string>,
      );
    },

    resolveText(text: string): ResolvedEngineeringText {
      return resolveText(text);
    },

    message(
      key: string,
      dictionary: EngineeringMessageDictionary,
      variables: Readonly<Record<string, string | number>> = {},
    ): string {
      const selectedMessage = resolveEngineeringMessage(
        key,
        dictionary,
        language,
        fallbackLanguage,
        fallbackMode,
        variables,
      );

      return resolveTerminologySafeMessage(
        selectedMessage,
        language,
        {
          caseSensitive: options.caseSensitiveTerms ?? false,
        },
      );
    },

    validateTranslation(
      sourceText: string,
      translatedText: string,
    ): EngineeringTranslationValidationResult {
      const result = validateProtectedTerminology(
        sourceText,
        translatedText,
        language,
      );

      return {
        valid: result.valid,
        sourceText,
        translatedText,
        language,
        requiredTerms: result.requiredTerms,
        missingTerms: result.missingTerms,
      };
    },

    createPromptPackage(
      userPrompt: string,
      systemInstruction = "",
    ): EngineeringPromptPackage {
      const terminologyInstruction =
        getEngineeringResolverInstruction(language);

      const languageInstruction =
        language === "bn"
          ? [
              "Respond in clear professional Bangla.",
              "Use English only where an approved OptiFabric engineering term requires it.",
              "Do not alter locked garment and cutting-room terminology.",
            ].join(" ")
          : [
              "Respond in clear professional English.",
              "Use approved OptiFabric engineering terminology exactly.",
              "Do not paraphrase locked garment and cutting-room terminology.",
            ].join(" ");

      const combinedSystemInstruction = [
        systemInstruction.trim(),
        languageInstruction,
        terminologyInstruction,
      ]
        .filter(Boolean)
        .join("\n\n");

      return {
        language,
        systemInstruction: combinedSystemInstruction,
        terminologyInstruction,
        userPrompt,
      };
    },

    snapshot(): EngineeringLanguageSnapshot {
      return {
        language,
        fallbackLanguage,
        registeredTerms: getEngineeringTermKeys().length,
        protectedTermInstruction:
          getEngineeringResolverInstruction(language),
      };
    },
  };
}

/**
 * Default English language service.
 */
export const englishEngineeringLanguageService =
  createEngineeringLanguageService({
    language: "en",
  });

/**
 * Default Bangla language service.
 */
export const banglaEngineeringLanguageService =
  createEngineeringLanguageService({
    language: "bn",
  });

/**
 * Returns a ready-to-use language service from a raw locale.
 */
export function getEngineeringLanguageService(
  locale: string | null | undefined,
): EngineeringLanguageService {
  const language = normaliseEngineeringLanguage(locale);

  return language === "bn"
    ? banglaEngineeringLanguageService
    : englishEngineeringLanguageService;
}

/**
 * Convenience resolver for one term without manually creating a service.
 */
export function engineeringTerm(
  key: EngineeringTermKey,
  language: EngineeringLanguage = DEFAULT_LANGUAGE,
): string {
  return getEngineeringTerm(key, language);
}

/**
 * Creates a complete language map for administration,
 * validation and future dictionary-management screens.
 */
export function createEngineeringLanguageMap(
  language: EngineeringLanguage,
): Readonly<Record<EngineeringTermKey, string>> {
  return getEngineeringTermKeys().reduce(
    (result, key) => {
      result[key] = getEngineeringTerm(key, language);
      return result;
    },
    {} as Record<EngineeringTermKey, string>,
  );
}