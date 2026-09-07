"use client";

interface AIRecommendationPanelProps {
  recommendations: string[];
  nextStep: string;
  ready: boolean;
}

export default function AIRecommendationPanel({
  recommendations,
  nextStep,
  ready,
}: AIRecommendationPanelProps) {
  return (
    <section className="rounded-3xl border border-violet-400/20 bg-violet-950/10 p-6">

      <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
        AI Engineering Recommendation
      </p>

      <h2 className="mt-2 text-2xl font-black text-white">
        AI Engineering Assistant
      </h2>

      <div className="mt-6 space-y-3">

        {recommendations.map((item) => (
          <RecommendationRow
            key={item}
            text={item}
          />
        ))}

      </div>

      <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">

        <p className="text-xs font-black uppercase tracking-wider text-slate-500">
          Recommended Next Step
        </p>

        <p className="mt-2 text-lg font-black text-white">
          {nextStep}
        </p>

      </div>

      <div
        className={`mt-6 rounded-xl px-4 py-3 text-center font-black ${
          ready
            ? "bg-emerald-600 text-white"
            : "bg-amber-500 text-slate-950"
        }`}
      >
        {ready
          ? "AI Recommendation: Continue"
          : "AI Recommendation: Complete Remaining Engineering Checks"}
      </div>

    </section>
  );
}

function RecommendationRow({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3">

      <span className="text-emerald-400 font-black">
        ✓
      </span>

      <p className="text-sm leading-6 text-slate-200">
        {text}
      </p>

    </div>
  );
}