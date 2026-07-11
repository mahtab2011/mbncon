"use client";

interface AIExplanationCardProps {
  title: string;
  titleBn: string;
  purpose: string;
  purposeBn: string;
  why: string;
  whyBn: string;
  bestPractice: string;
  bestPracticeBn: string;
  commonMistake: string;
  commonMistakeBn: string;
}

export default function AIExplanationCard({
  title,
  titleBn,
  purpose,
  purposeBn,
  why,
  whyBn,
  bestPractice,
  bestPracticeBn,
  commonMistake,
  commonMistakeBn,
}: AIExplanationCardProps) {
  return (
    <section className="mt-8 rounded-3xl border border-cyan-500/30 bg-slate-900 p-8 shadow-xl">

      <div className="mb-8">
        <h2 className="text-3xl font-black text-cyan-300">
          {title}
        </h2>

        <p className="mt-2 text-lg text-slate-300">
          {titleBn}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
          <h3 className="mb-3 text-xl font-bold text-cyan-300">
            Purpose
          </h3>

          <p className="text-slate-300">
            {purpose}
          </p>

          <div className="mt-5 border-t border-slate-700 pt-4">
            <h4 className="font-bold text-cyan-200">
              উদ্দেশ্য
            </h4>

            <p className="mt-2 text-slate-300">
              {purposeBn}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
          <h3 className="mb-3 text-xl font-bold text-cyan-300">
            Why AI asks for this?
          </h3>

          <p className="text-slate-300">
            {why}
          </p>

          <div className="mt-5 border-t border-slate-700 pt-4">
            <h4 className="font-bold text-cyan-200">
              AI এই তথ্য কেন চায়?
            </h4>

            <p className="mt-2 text-slate-300">
              {whyBn}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-green-600/30 bg-green-950/20 p-6">
          <h3 className="mb-3 text-xl font-bold text-green-300">
            Best Practice
          </h3>

          <p className="text-slate-300">
            {bestPractice}
          </p>

          <div className="mt-5 border-t border-green-700 pt-4">
            <h4 className="font-bold text-green-300">
              সর্বোত্তম পদ্ধতি
            </h4>

            <p className="mt-2 text-slate-300">
              {bestPracticeBn}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6">
          <h3 className="mb-3 text-xl font-bold text-amber-300">
            Common Mistakes
          </h3>

          <p className="text-slate-300">
            {commonMistake}
          </p>

          <div className="mt-5 border-t border-amber-700 pt-4">
            <h4 className="font-bold text-amber-300">
              সাধারণ ভুল
            </h4>

            <p className="mt-2 text-slate-300">
              {commonMistakeBn}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}