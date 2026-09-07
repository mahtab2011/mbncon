import {
  WhyAiAsksExplanation,
} from "@/lib/optifabric/masters";

type WhyAiAsksPanelProps = {
  explanation: WhyAiAsksExplanation;
  language?: "en" | "bn";
  compact?: boolean;
};

function getLocalizedText(
  text: {
    en: string;
    bn?: string;
    [languageCode: string]: string | undefined;
  },
  language: "en" | "bn"
): string {
  if (language === "bn" && text.bn) {
    return text.bn;
  }

  return text.en;
}

export default function WhyAiAsksPanel({
  explanation,
  language = "en",
  compact = false,
}: WhyAiAsksPanelProps) {
  const title = getLocalizedText(
    explanation.title,
    language
  );

  const explanationText = getLocalizedText(
    explanation.explanation,
    language
  );

  const engineeringImpact = getLocalizedText(
    explanation.engineeringImpact,
    language
  );

  return (
    <section
      className={`rounded-2xl border border-cyan-400/30 bg-cyan-950/30 ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-xl">
          🤖
        </div>

        <div className="min-w-0">
          <h3
            className={`font-black text-cyan-300 ${
              compact ? "text-base" : "text-lg"
            }`}
          >
            {title}
          </h3>

          <p
            className={`mt-2 leading-relaxed text-slate-300 ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {explanationText}
          </p>

          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
              {language === "bn"
                ? "ইঞ্জিনিয়ারিং প্রভাব"
                : "Engineering Impact"}
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {engineeringImpact}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}