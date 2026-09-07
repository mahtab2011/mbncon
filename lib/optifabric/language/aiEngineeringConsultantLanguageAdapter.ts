/**
 * OptiFabric AI
 * RC5-003L-004 — AI Engineering Consultant Language Adapter
 *
 * Purpose:
 * - Connect the AI Engineering Consultant to the approved language system.
 * - Protect locked garment and cutting-room terminology.
 * - Build safe bilingual AI prompt packages.
 * - Validate and repair consultant responses when terminology is inconsistent.
 */

import type {
  EngineeringTermKey,
  OptiFabricLanguageCode,
} from "./engineeringDictionary";

import {
  createTerminologySafeFallback,
  findProtectedEngineeringTerms,
  resolveEngineeringTerm,
  resolveProtectedTermsInText,
  validateProtectedTerminology,
} from "./engineeringTermResolver";

import {
  createEngineeringLanguageService,
  normaliseEngineeringLanguage,
  type EngineeringLanguage,
  type EngineeringPromptPackage,
} from "./engineeringLanguageService";

export type AIEngineeringConsultantAudience =
  | "cuttingMaster"
  | "cuttingSupervisor"
  | "industrialEngineer"
  | "productionManager"
  | "factoryManager"
  | "executive";

export type AIEngineeringConsultantResponseStyle =
  | "concise"
  | "standard"
  | "detailed";

export type AIEngineeringConsultantDecision =
  | "recommended"
  | "acceptable"
  | "reviewRequired"
  | "notRecommended";

export interface AIEngineeringConsultantLanguageOptions {
  readonly locale?: string | null;
  readonly language?: EngineeringLanguage;
  readonly audience?: AIEngineeringConsultantAudience;
  readonly responseStyle?: AIEngineeringConsultantResponseStyle;
  readonly preserveNumbers?: boolean;
  readonly preserveUnits?: boolean;
}

export interface AIEngineeringConsultantContext {
  readonly markerId?: string;
  readonly solutionId?: string;
  readonly garmentName?: string;
  readonly garmentQuantity?: number;
  readonly markerQuantity?: number;
  readonly markerLength?: number;
  readonly fabricWidth?: number;
  readonly utilisation?: number;
  readonly waste?: number;
  readonly engineeringScore?: number;
  readonly confidence?: number;
  readonly collisionCount?: number;
  readonly emptySpacePercentage?: number;
  readonly notes?: ReadonlyArray<string>;
}

export interface AIEngineeringConsultantPromptInput {
  readonly request: string;
  readonly context?: AIEngineeringConsultantContext;
  readonly systemInstruction?: string;
  readonly options?: AIEngineeringConsultantLanguageOptions;
}

export interface AIEngineeringConsultantPromptResult {
  readonly language: EngineeringLanguage;
  readonly promptPackage: EngineeringPromptPackage;
  readonly contextBlock: string;
  readonly protectedTerms: ReadonlyArray<EngineeringTermKey>;
}

export interface AIEngineeringConsultantResponseValidation {
  readonly valid: boolean;
  readonly language: EngineeringLanguage;
  readonly originalResponse: string;
  readonly approvedResponse: string;
  readonly requiredTerms: ReadonlyArray<EngineeringTermKey>;
  readonly missingTerms: ReadonlyArray<EngineeringTermKey>;
  readonly repaired: boolean;
}

export interface AIEngineeringConsultantRecommendation {
  readonly decision: AIEngineeringConsultantDecision;
  readonly title: string;
  readonly summary: string;
  readonly reasons: ReadonlyArray<string>;
  readonly actions: ReadonlyArray<string>;
  readonly confidenceLabel: string;
}

const DEFAULT_AUDIENCE: AIEngineeringConsultantAudience =
  "industrialEngineer";

const DEFAULT_RESPONSE_STYLE: AIEngineeringConsultantResponseStyle =
  "standard";

/**
 * Resolves the consultant language from either a direct language
 * or a browser/application locale.
 */
export function resolveAIConsultantLanguage(
  options: AIEngineeringConsultantLanguageOptions = {},
): EngineeringLanguage {
  if (options.language) {
    return options.language;
  }

  return normaliseEngineeringLanguage(options.locale);
}

/**
 * Returns the professional instruction for the selected audience.
 */
function createAudienceInstruction(
  audience: AIEngineeringConsultantAudience,
  language: EngineeringLanguage,
): string {
  const englishInstructions: Record<
    AIEngineeringConsultantAudience,
    string
  > = {
    cuttingMaster:
      "Explain the engineering decision in practical cutting-room language suitable for a Cutting Master.",
    cuttingSupervisor:
      "Explain the result as clear operational guidance for a Cutting Supervisor.",
    industrialEngineer:
      "Explain the result using precise industrial engineering and marker-planning logic.",
    productionManager:
      "Explain the production impact, fabric risk and recommended operational action.",
    factoryManager:
      "Explain the commercial and operational impact in clear factory-management language.",
    executive:
      "Provide a brief executive decision focused on savings, risk, capacity and implementation.",
  };

  const banglaInstructions: Record<
    AIEngineeringConsultantAudience,
    string
  > = {
    cuttingMaster:
      "কাটিং মাস্টারের জন্য ব্যবহারিক কাটিং-রুম ভাষায় ইঞ্জিনিয়ারিং সিদ্ধান্ত ব্যাখ্যা করুন।",
    cuttingSupervisor:
      "কাটিং সুপারভাইজারের জন্য পরিষ্কার কার্যকরী নির্দেশনা দিন।",
    industrialEngineer:
      "সুনির্দিষ্ট ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং ও মার্কার পরিকল্পনার যুক্তি ব্যবহার করুন।",
    productionManager:
      "উৎপাদন প্রভাব, কাপড়ের ঝুঁকি এবং প্রয়োজনীয় কার্যক্রম ব্যাখ্যা করুন।",
    factoryManager:
      "কারখানা ব্যবস্থাপনার জন্য বাণিজ্যিক ও কার্যকরী প্রভাব পরিষ্কারভাবে ব্যাখ্যা করুন।",
    executive:
      "সাশ্রয়, ঝুঁকি, সক্ষমতা ও বাস্তবায়নকে কেন্দ্র করে সংক্ষিপ্ত নির্বাহী সিদ্ধান্ত দিন।",
  };

  return language === "bn"
    ? banglaInstructions[audience]
    : englishInstructions[audience];
}

/**
 * Returns the required response-depth instruction.
 */
function createResponseStyleInstruction(
  style: AIEngineeringConsultantResponseStyle,
  language: EngineeringLanguage,
): string {
  if (language === "bn") {
    switch (style) {
      case "concise":
        return "উত্তর সংক্ষিপ্ত রাখুন এবং সর্বোচ্চ তিনটি মূল কারণ দিন।";

      case "detailed":
        return "সিদ্ধান্ত, কারণ, ঝুঁকি, গণনার প্রভাব এবং পরবর্তী কার্যক্রম বিস্তারিতভাবে দিন।";

      default:
        return "সিদ্ধান্ত, প্রধান কারণ এবং সুপারিশকৃত পরবর্তী কার্যক্রম পরিষ্কারভাবে দিন।";
    }
  }

  switch (style) {
    case "concise":
      return "Keep the response concise and provide no more than three principal reasons.";

    case "detailed":
      return "Provide the decision, reasons, risks, calculation impact and next actions in detail.";

    default:
      return "Provide a clear decision, principal reasons and recommended next actions.";
  }
}

/**
 * Formats numerical values without changing engineering calculations.
 */
function formatNumber(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat("en-GB", {
    maximumFractionDigits,
  }).format(value);
}

/**
 * Converts the supplied engineering context into a deterministic prompt block.
 */
export function createAIConsultantContextBlock(
  context: AIEngineeringConsultantContext = {},
  language: EngineeringLanguage = "en",
): string {
  const rows: string[] = [];

  const addRow = (
    key: EngineeringTermKey | string,
    value: string | number | undefined,
  ): void => {
    if (value === undefined || value === "") {
      return;
    }

    const label =
      typeof key === "string" &&
      ![
        "markerId",
        "solutionId",
        "garmentName",
        "collisionCount",
        "emptySpacePercentage",
        "notes",
      ].includes(key)
        ? resolveEngineeringTerm(key as EngineeringTermKey, language)
        : key;

    rows.push(`${label}: ${value}`);
  };

  addRow("markerId", context.markerId);
  addRow("solutionId", context.solutionId);
  addRow("garmentName", context.garmentName);

  addRow(
    "garmentQuantity",
    context.garmentQuantity === undefined
      ? undefined
      : formatNumber(context.garmentQuantity, 0),
  );

  addRow(
    "markerQuantity",
    context.markerQuantity === undefined
      ? undefined
      : formatNumber(context.markerQuantity, 0),
  );

  addRow(
    "markerLength",
    context.markerLength === undefined
      ? undefined
      : formatNumber(context.markerLength),
  );

  addRow(
    "fabricWidth",
    context.fabricWidth === undefined
      ? undefined
      : formatNumber(context.fabricWidth),
  );

  addRow(
    "utilisation",
    context.utilisation === undefined
      ? undefined
      : `${formatNumber(context.utilisation)}%`,
  );

  addRow(
    "waste",
    context.waste === undefined
      ? undefined
      : `${formatNumber(context.waste)}%`,
  );

  addRow(
    "engineeringScore",
    context.engineeringScore === undefined
      ? undefined
      : formatNumber(context.engineeringScore),
  );

  addRow(
    "confidence",
    context.confidence === undefined
      ? undefined
      : `${formatNumber(context.confidence)}%`,
  );

  addRow(
    "collisionCount",
    context.collisionCount === undefined
      ? undefined
      : formatNumber(context.collisionCount, 0),
  );

  addRow(
    "emptySpacePercentage",
    context.emptySpacePercentage === undefined
      ? undefined
      : `${formatNumber(context.emptySpacePercentage)}%`,
  );

  if (context.notes?.length) {
    rows.push(
      `${language === "bn" ? "নোট" : "Notes"}: ${context.notes.join(
        " | ",
      )}`,
    );
  }

  if (rows.length === 0) {
    return language === "bn"
      ? "কোনো অতিরিক্ত ইঞ্জিনিয়ারিং তথ্য প্রদান করা হয়নি।"
      : "No additional engineering context was provided.";
  }

  const heading =
    language === "bn"
      ? "OptiFabric ইঞ্জিনিয়ারিং তথ্য"
      : "OptiFabric Engineering Context";

  return [heading, ...rows].join("\n");
}

/**
 * Builds the full protected prompt package for the AI Engineering Consultant.
 */
export function createAIEngineeringConsultantPrompt(
  input: AIEngineeringConsultantPromptInput,
): AIEngineeringConsultantPromptResult {
  const language = resolveAIConsultantLanguage(input.options);

  const audience =
    input.options?.audience ?? DEFAULT_AUDIENCE;

  const responseStyle =
    input.options?.responseStyle ?? DEFAULT_RESPONSE_STYLE;

  const service = createEngineeringLanguageService({
    language,
  });

  const contextBlock = createAIConsultantContextBlock(
    input.context,
    language,
  );

  const audienceInstruction = createAudienceInstruction(
    audience,
    language,
  );

  const responseStyleInstruction =
    createResponseStyleInstruction(responseStyle, language);

  const preservationInstructions = [
    input.options?.preserveNumbers !== false
      ? language === "bn"
        ? "সমস্ত সংখ্যা ও গণনার ফল অপরিবর্তিত রাখুন।"
        : "Preserve all numbers and calculation results exactly."
      : "",
    input.options?.preserveUnits !== false
      ? language === "bn"
        ? "সমস্ত পরিমাপের একক অপরিবর্তিত রাখুন।"
        : "Preserve every measurement unit exactly."
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const systemInstruction = [
    input.systemInstruction?.trim(),
    "You are the OptiFabric AI Engineering Consultant.",
    audienceInstruction,
    responseStyleInstruction,
    preservationInstructions,
    language === "bn"
      ? "সিদ্ধান্তটি পেশাদার, সহজবোধ্য এবং কারখানায় সরাসরি ব্যবহারযোগ্য হতে হবে।"
      : "The decision must be professional, understandable and directly usable in a factory.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const userPrompt = [
    contextBlock,
    "",
    language === "bn" ? "ইঞ্জিনিয়ারিং অনুরোধ:" : "Engineering Request:",
    input.request.trim(),
  ].join("\n");

  const promptPackage = service.createPromptPackage(
    userPrompt,
    systemInstruction,
  );

  const protectedTerms = findProtectedEngineeringTerms(
    [
      input.request,
      contextBlock,
      input.systemInstruction ?? "",
    ].join(" "),
  );

  return {
    language,
    promptPackage,
    contextBlock,
    protectedTerms,
  };
}

/**
 * Validates a generated consultant response against the approved dictionary.
 */
export function validateAIEngineeringConsultantResponse(
  sourcePrompt: string,
  response: string,
  language: OptiFabricLanguageCode,
): AIEngineeringConsultantResponseValidation {
  const validation = validateProtectedTerminology(
    sourcePrompt,
    response,
    language,
  );

  if (validation.valid) {
    return {
      valid: true,
      language,
      originalResponse: response,
      approvedResponse: response,
      requiredTerms: validation.requiredTerms,
      missingTerms: [],
      repaired: false,
    };
  }

  const resolvedResponse = resolveProtectedTermsInText(response, {
    language,
  }).resolvedText;

  const secondValidation = validateProtectedTerminology(
    sourcePrompt,
    resolvedResponse,
    language,
  );

  if (secondValidation.valid) {
    return {
      valid: true,
      language,
      originalResponse: response,
      approvedResponse: resolvedResponse,
      requiredTerms: secondValidation.requiredTerms,
      missingTerms: [],
      repaired: resolvedResponse !== response,
    };
  }

  const fallback = createTerminologySafeFallback(
    sourcePrompt,
    language,
  );

  return {
    valid: false,
    language,
    originalResponse: response,
    approvedResponse: fallback,
    requiredTerms: secondValidation.requiredTerms,
    missingTerms: secondValidation.missingTerms,
    repaired: true,
  };
}

/**
 * Applies approved terminology to an already generated AI response.
 *
 * This is useful when the existing consultant engine returns a plain string.
 */
export function protectAIEngineeringConsultantResponse(
  response: string,
  language: OptiFabricLanguageCode,
): string {
  return resolveProtectedTermsInText(response, {
    language,
  }).resolvedText;
}

/**
 * Builds a deterministic recommendation object for UI cards.
 */
export function createAIEngineeringRecommendation(
  decision: AIEngineeringConsultantDecision,
  title: string,
  summary: string,
  reasons: ReadonlyArray<string>,
  actions: ReadonlyArray<string>,
  confidence: number,
  language: EngineeringLanguage = "en",
): AIEngineeringConsultantRecommendation {
  const protectedTitle = protectAIEngineeringConsultantResponse(
    title,
    language,
  );

  const protectedSummary = protectAIEngineeringConsultantResponse(
    summary,
    language,
  );

  const protectedReasons = reasons.map((reason) =>
    protectAIEngineeringConsultantResponse(reason, language),
  );

  const protectedActions = actions.map((action) =>
    protectAIEngineeringConsultantResponse(action, language),
  );

  const confidenceLabel = [
    resolveEngineeringTerm("confidence", language),
    `${formatNumber(Math.max(0, Math.min(100, confidence)))}%`,
  ].join(": ");

  return {
    decision,
    title: protectedTitle,
    summary: protectedSummary,
    reasons: protectedReasons,
    actions: protectedActions,
    confidenceLabel,
  };
}

/**
 * Returns the default consultant decision label.
 */
export function getAIEngineeringDecisionLabel(
  decision: AIEngineeringConsultantDecision,
  language: EngineeringLanguage = "en",
): string {
  const labels: Record<
    EngineeringLanguage,
    Record<AIEngineeringConsultantDecision, string>
  > = {
    en: {
      recommended: "Recommended",
      acceptable: "Acceptable",
      reviewRequired: "Engineering Review Required",
      notRecommended: "Not Recommended",
    },

    bn: {
      recommended: "AI সুপারিশ",
      acceptable: "গ্রহণযোগ্য",
      reviewRequired: "ইঞ্জিনিয়ারিং পর্যালোচনা প্রয়োজন",
      notRecommended: "সুপারিশযোগ্য নয়",
    },
  };

  return labels[language][decision];
}