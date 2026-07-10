export type PhotoQualityResult = {
  score: number;
  level: "EXCELLENT" | "GOOD" | "ACCEPTABLE" | "POOR";
  canContinue: boolean;
  englishMessage: string;
  banglaMessage: string;
  suggestionsEn: string[];
  suggestionsBn: string[];
};

export type PhotoQualityInput = {
  imageWidth: number;
  imageHeight: number;

  hasRuler: boolean;
  goodLighting: boolean;
  imageBlur: number; // 0 = sharp, 100 = unusable
  patternVisible: number; // percentage visible
};

export function evaluatePhotoQuality(
  input: PhotoQualityInput
): PhotoQualityResult {
  let score = 100;

  if (!input.hasRuler) score -= 20;

  if (!input.goodLighting) score -= 10;

  score -= Math.min(input.imageBlur, 40);

  if (input.patternVisible < 100) {
    score -= Math.floor((100 - input.patternVisible) / 2);
  }

  score = Math.max(0, Math.min(score, 100));

  const suggestionsEn: string[] = [];
  const suggestionsBn: string[] = [];

  if (!input.hasRuler) {
    suggestionsEn.push(
      "Place a 12-inch ruler beside the pattern."
    );

    suggestionsBn.push(
      "প্যাটার্নের পাশে ১২ ইঞ্চি স্কেল রাখুন।"
    );
  }

  if (!input.goodLighting) {
    suggestionsEn.push(
      "Improve the lighting."
    );

    suggestionsBn.push(
      "পর্যাপ্ত আলো ব্যবহার করুন।"
    );
  }

  if (input.imageBlur > 25) {
    suggestionsEn.push(
      "Hold the camera steady."
    );

    suggestionsBn.push(
      "ক্যামেরা স্থির রাখুন।"
    );
  }

  if (input.patternVisible < 95) {
    suggestionsEn.push(
      "Keep the complete pattern inside the photograph."
    );

    suggestionsBn.push(
      "সম্পূর্ণ প্যাটার্ন ছবির মধ্যে রাখুন।"
    );
  }

  if (score >= 90) {
    return {
      score,
      level: "EXCELLENT",
      canContinue: true,
      englishMessage:
        "Excellent! Your photo is ideal for AI analysis.",
      banglaMessage:
        "চমৎকার! আপনার ছবি AI বিশ্লেষণের জন্য উপযুক্ত।",
      suggestionsEn,
      suggestionsBn,
    };
  }

  if (score >= 75) {
    return {
      score,
      level: "GOOD",
      canContinue: true,
      englishMessage:
        "Good photo. AI analysis can continue.",
      banglaMessage:
        "ছবিটি ভালো। AI বিশ্লেষণ চালিয়ে যাওয়া যাবে।",
      suggestionsEn,
      suggestionsBn,
    };
  }

  if (score >= 55) {
    return {
      score,
      level: "ACCEPTABLE",
      canContinue: true,
      englishMessage:
        "The photo is acceptable. Accuracy may be slightly reduced.",
      banglaMessage:
        "ছবিটি গ্রহণযোগ্য। ফলাফল সামান্য কম নির্ভুল হতে পারে।",
      suggestionsEn,
      suggestionsBn,
    };
  }

  return {
    score,
    level: "POOR",
    canContinue: false,
    englishMessage:
      "The image quality is too poor for reliable analysis.",
    banglaMessage:
      "ছবির মান খুবই কম। নির্ভরযোগ্য বিশ্লেষণ করা সম্ভব নয়।",
    suggestionsEn,
    suggestionsBn,
  };
}