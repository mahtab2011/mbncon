type AIGuidancePanelProps = {
  titleEn: string;
  titleBn: string;
  whatEn: string;
  whatBn: string;
  whyEn: string;
  whyBn: string;
  tipsEn: string[];
  tipsBn: string[];
};

export default function AIGuidancePanel({
  titleEn,
  titleBn,
  whatEn,
  whatBn,
  whyEn,
  whyBn,
  tipsEn,
  tipsBn,
}: AIGuidancePanelProps) {
  return (
    <div className="rounded-3xl border border-cyan-700 bg-slate-900 p-6 shadow-xl">
      <div className="rounded-xl bg-cyan-950 p-4">
        <h2 className="text-2xl font-black text-cyan-300">
          {titleEn}
        </h2>

        <p className="mt-2 text-lg text-cyan-100">
          {titleBn}
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        <div>
          <h3 className="text-lg font-bold text-green-300">
            🇬🇧 What should I do?
          </h3>

          <p className="mt-2 text-slate-300">
            {whatEn}
          </p>

          <h3 className="mt-6 text-lg font-bold text-yellow-300">
            Why does AI ask this?
          </h3>

          <p className="mt-2 text-slate-300">
            {whyEn}
          </p>

          <div className="mt-6 rounded-xl bg-slate-800 p-4">
            <h4 className="font-bold text-cyan-300">
              Professional Tips
            </h4>

            <ul className="mt-3 space-y-2 text-slate-300">
              {tipsEn.map((tip) => (
                <li key={tip}>✔ {tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-green-300">
            🇧🇩 কী করবেন?
          </h3>

          <p className="mt-2 text-slate-300">
            {whatBn}
          </p>

          <h3 className="mt-6 text-lg font-bold text-yellow-300">
            AI কেন এটি জানতে চায়?
          </h3>

          <p className="mt-2 text-slate-300">
            {whyBn}
          </p>

          <div className="mt-6 rounded-xl bg-slate-800 p-4">
            <h4 className="font-bold text-cyan-300">
              গুরুত্বপূর্ণ পরামর্শ
            </h4>

            <ul className="mt-3 space-y-2 text-slate-300">
              {tipsBn.map((tip) => (
                <li key={tip}>✔ {tip}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-green-700 bg-green-950 p-5">
        <h3 className="text-xl font-black text-green-300">
          No CAD Experience Required
        </h3>

        <p className="mt-2 text-green-100">
          OptiFabric AI will guide you through every step.
        </p>

        <hr className="my-4 border-green-800" />

        <h3 className="text-xl font-black text-green-300">
          CAD সফটওয়্যারের পূর্ব অভিজ্ঞতা প্রয়োজন নেই
        </h3>

        <p className="mt-2 text-green-100">
          অপটিফ্যাব্রিক AI প্রতিটি ধাপে আপনাকে সহজ ভাষায় নির্দেশনা দেবে।
        </p>
      </div>
    </div>
  );
}