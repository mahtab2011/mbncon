/**
 * OptiFabric AI
 * RC5-003L-002 — Engineering Term Resolver
 *
 * Purpose:
 * - Enforce approved engineering terminology across UI, AI and reports.
 * - Replace protected English terms with approved language equivalents.
 * - Prevent inconsistent translations of locked garment terminology.
 */

import {
  createEngineeringTerminologyInstruction,
  engineeringDictionary,
  getEngineeringTerm,
  getEngineeringTermKeys,
  type EngineeringTermKey,
  type OptiFabricLanguageCode,
} from "./engineeringDictionary";

export interface EngineeringTermResolverOptions {
  readonly language?: OptiFabricLanguageCode;
  readonly caseSensitive?: boolean;
  readonly preserveUnknownText?: boolean;
}

export interface ResolvedEngineeringText {
  readonly originalText: string;
  readonly resolvedText: string;
  readonly language: OptiFabricLanguageCode;
  readonly replacedTerms: ReadonlyArray<EngineeringTermKey>;
}

interface ProtectedTermEntry {
  readonly key: EngineeringTermKey;
  readonly source: string;
  readonly approved: string;
}

/**
 * Escapes text before inserting it into a regular expression.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Sorts longer phrases first.
 *
 * This prevents shorter terms such as "Marker" from being replaced
 * before longer terms such as "Marker Length" or "Marker Efficiency".
 */
function sortTermsBySpecificity(
  entries: ReadonlyArray<ProtectedTermEntry>,
): ProtectedTermEntry[] {
  return [...entries].sort((first, second) => {
    if (second.source.length !== first.source.length) {
      return second.source.length - first.source.length;
    }

    return first.source.localeCompare(second.source);
  });
}

/**
 * Returns all protected terminology mappings for a selected language.
 */
export function getProtectedTermEntries(
  language: OptiFabricLanguageCode = "en",
): ReadonlyArray<ProtectedTermEntry> {
  const entries = getEngineeringTermKeys().map((key) => ({
    key,
    source: engineeringDictionary[key].en,
    approved: getEngineeringTerm(key, language),
  }));

  return sortTermsBySpecificity(entries);
}

/**
 * Resolves a single engineering term.
 */
export function resolveEngineeringTerm(
  key: EngineeringTermKey,
  language: OptiFabricLanguageCode = "en",
): string {
  return getEngineeringTerm(key, language);
}

/**
 * Resolves multiple engineering terms in the same order supplied.
 */
export function resolveEngineeringTerms(
  keys: ReadonlyArray<EngineeringTermKey>,
  language: OptiFabricLanguageCode = "en",
): ReadonlyArray<string> {
  return keys.map((key) => resolveEngineeringTerm(key, language));
}

/**
 * Replaces protected English engineering terms inside free text.
 *
 * Example:
 * Input:
 * "Marker Length is reduced and Fabric Utilisation has improved."
 *
 * Bangla output:
 * "মার্কারের দৈর্ঘ্য is reduced and কাপড় ব্যবহারের দক্ষতা has improved."
 *
 * The surrounding sentence is intentionally preserved.
 * Natural-language translation should occur separately.
 */
export function resolveProtectedTermsInText(
  text: string,
  options: EngineeringTermResolverOptions = {},
): ResolvedEngineeringText {
  const {
    language = "en",
    caseSensitive = false,
    preserveUnknownText = true,
  } = options;

  if (!text.trim()) {
    return {
      originalText: text,
      resolvedText: text,
      language,
      replacedTerms: [],
    };
  }

  const entries = getProtectedTermEntries(language);
  const replacedTerms = new Set<EngineeringTermKey>();

  let resolvedText = text;

  for (const entry of entries) {
    const flags = caseSensitive ? "g" : "gi";

    const expression = new RegExp(
      `(?<![\\p{L}\\p{N}_])${escapeRegExp(entry.source)}(?![\\p{L}\\p{N}_])`,
      `${flags}u`,
    );

    resolvedText = resolvedText.replace(expression, () => {
      replacedTerms.add(entry.key);
      return entry.approved;
    });
  }

  return {
    originalText: text,
    resolvedText: preserveUnknownText ? resolvedText : resolvedText.trim(),
    language,
    replacedTerms: [...replacedTerms],
  };
}

/**
 * Resolves protected terminology inside every string in a collection.
 */
export function resolveProtectedTermsInList(
  values: ReadonlyArray<string>,
  options: EngineeringTermResolverOptions = {},
): ReadonlyArray<ResolvedEngineeringText> {
  return values.map((value) =>
    resolveProtectedTermsInText(value, options),
  );
}

/**
 * Resolves protected terminology inside string values of a plain object.
 *
 * Non-string values are preserved unchanged.
 */
export function resolveProtectedTermsInRecord<
  TRecord extends Readonly<Record<string, unknown>>,
>(
  record: TRecord,
  options: EngineeringTermResolverOptions = {},
): TRecord {
  const resolvedEntries = Object.entries(record).map(([key, value]) => {
    if (typeof value !== "string") {
      return [key, value];
    }

    return [
      key,
      resolveProtectedTermsInText(value, options).resolvedText,
    ];
  });

  return Object.fromEntries(resolvedEntries) as TRecord;
}

/**
 * Returns a safe label resolver for UI components.
 *
 * Example:
 * const term = createEngineeringLabelResolver("bn");
 * term("markerLength") // মার্কারের দৈর্ঘ্য
 */
export function createEngineeringLabelResolver(
  language: OptiFabricLanguageCode,
): (key: EngineeringTermKey) => string {
  return (key) => resolveEngineeringTerm(key, language);
}

/**
 * Returns a safe text resolver for engineering explanations.
 */
export function createEngineeringTextResolver(
  language: OptiFabricLanguageCode,
  options: Omit<EngineeringTermResolverOptions, "language"> = {},
): (text: string) => ResolvedEngineeringText {
  return (text) =>
    resolveProtectedTermsInText(text, {
      ...options,
      language,
    });
}

/**
 * Creates the locked terminology instruction for AI prompts.
 *
 * This should be appended to the AI Engineering Consultant system prompt.
 */
export function getEngineeringResolverInstruction(
  language: OptiFabricLanguageCode,
): string {
  return createEngineeringTerminologyInstruction(language);
}

/**
 * Checks whether a supplied text contains any protected English term.
 */
export function containsProtectedEngineeringTerm(text: string): boolean {
  if (!text.trim()) {
    return false;
  }

  return getProtectedTermEntries("en").some((entry) => {
    const expression = new RegExp(
      `(?<![\\p{L}\\p{N}_])${escapeRegExp(entry.source)}(?![\\p{L}\\p{N}_])`,
      "iu",
    );

    return expression.test(text);
  });
}

/**
 * Returns the protected keys found inside a supplied text.
 */
export function findProtectedEngineeringTerms(
  text: string,
): ReadonlyArray<EngineeringTermKey> {
  if (!text.trim()) {
    return [];
  }

  const foundTerms = new Set<EngineeringTermKey>();

  for (const entry of getProtectedTermEntries("en")) {
    const expression = new RegExp(
      `(?<![\\p{L}\\p{N}_])${escapeRegExp(entry.source)}(?![\\p{L}\\p{N}_])`,
      "iu",
    );

    if (expression.test(text)) {
      foundTerms.add(entry.key);
    }
  }

  return [...foundTerms];
}

/**
 * Verifies that a translated text contains the approved terminology
 * for every protected term found in the English source text.
 */
export function validateProtectedTerminology(
  sourceText: string,
  translatedText: string,
  language: OptiFabricLanguageCode,
): {
  readonly valid: boolean;
  readonly requiredTerms: ReadonlyArray<EngineeringTermKey>;
  readonly missingTerms: ReadonlyArray<EngineeringTermKey>;
} {
  const requiredTerms = findProtectedEngineeringTerms(sourceText);

  const missingTerms = requiredTerms.filter((key) => {
    const approvedTerm = resolveEngineeringTerm(key, language);
    return !translatedText.includes(approvedTerm);
  });

  return {
    valid: missingTerms.length === 0,
    requiredTerms,
    missingTerms,
  };
}

/**
 * Repairs missing protected terms by resolving the source text directly.
 *
 * This is a deterministic fallback and should not replace full translation.
 */
export function createTerminologySafeFallback(
  sourceText: string,
  language: OptiFabricLanguageCode,
): string {
  return resolveProtectedTermsInText(sourceText, {
    language,
  }).resolvedText;
}