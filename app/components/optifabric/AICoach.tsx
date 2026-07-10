type AICoachProps = {
  stepNumber: number;
  totalSteps: number;
  stepTitleEn: string;
  stepTitleBn: string;
  instructionEn: string;
  instructionBn: string;
  whyEn: string;
  whyBn: string;
  checklistEn: string[];
  checklistBn: string[];
};

export default function AICoach({
  stepNumber,
  totalSteps,
  stepTitleEn,
  stepTitleBn,
  instructionEn,
  instructionBn,
  whyEn,
  whyBn,
  checklistEn,
  checklistBn,
}: AICoachProps) {
  const progressPercent = Math.round((stepNumber / totalSteps) * 100);

  return (
    <aside className="rounded-3xl border border-cyan-700 bg-slate-900 p-6 text-white shadow-xl">
      <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
        🤖 OptiFabric AI Coach
      </p>

      <h2 className="mt-3 text-2xl font-black">{stepTitleEn}</h2>
      <p className="mt-1 text-lg text-cyan-100">{stepTitleBn}</p>

      <div className="mt-5">
        <div className="flex justify-between text-sm text-slate-300">
          <span>
            Step {stepNumber} of {totalSteps}
          </span>
          <span>{progressPercent}%</span>
        </div>

        <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-blue-950 p-5">
        <h3 className="font-bold text-green-300">🇬🇧 What should I do?</h3>
        <p className="mt-2 text-slate-200">{instructionEn}</p>

        <h3 className="mt-5 font-bold text-green-300">🇧🇩 কী করবেন?</h3>
        <p className="mt-2 text-slate-200">{instructionBn}</p>
      </div>

      <div className="mt-5 rounded-2xl bg-yellow-950 p-5">
        <h3 className="font-bold text-yellow-300">Why does AI ask this?</h3>
        <p className="mt-2 text-slate-200">{whyEn}</p>

        <h3 className="mt-5 font-bold text-yellow-300">
          AI কেন এটি জানতে চায়?
        </h3>
        <p className="mt-2 text-slate-200">{whyBn}</p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-800 p-5">
          <h3 className="font-bold text-cyan-300">Checklist</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {checklistEn.map((item) => (
              <li key={item}>✔ {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-slate-800 p-5">
          <h3 className="font-bold text-cyan-300">চেকলিস্ট</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            {checklistBn.map((item) => (
              <li key={item}>✔ {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-green-950 p-5">
        <h3 className="text-lg font-black text-green-300">
          No CAD Experience Required
        </h3>
        <p className="mt-2 text-green-100">
          OptiFabric AI guides you step by step.
        </p>

        <h3 className="mt-5 text-lg font-black text-green-300">
          CAD সফটওয়্যারের পূর্ব অভিজ্ঞতা প্রয়োজন নেই
        </h3>
        <p className="mt-2 text-green-100">
          অপটিফ্যাব্রিক AI প্রতিটি ধাপে আপনাকে সহজ ভাষায় নির্দেশনা দেবে।
        </p>
      </div>
    </aside>
  );
}