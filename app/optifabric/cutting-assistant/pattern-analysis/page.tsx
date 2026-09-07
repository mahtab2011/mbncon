import Link from "next/link";

import {
  detectPatternBoundary,
} from "@/lib/optifabric/patternBoundaryEngine";

export default function PatternAnalysisPage() {
  const result = detectPatternBoundary("sample-pattern.pdf");

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/optifabric/cutting-assistant/fabric-specs"
          className="inline-block text-cyan-300 transition hover:text-cyan-200"
        >
          <span className="block">← Back to Fabric Specs</span>
          <span className="mt-1 block text-sm text-slate-400">
            ← Fabric Specs-এ ফিরে যান
          </span>
        </Link>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-8">
          <p className="font-semibold text-cyan-300">
            Block 004 · AI Pattern Analysis
          </p>

          <p className="mt-2 font-bold text-cyan-200">
            ব্লক ০০৪ · AI Pattern Analysis
          </p>

          <h1 className="mt-5 text-4xl font-bold">
            AI Pattern Boundary Detection
          </h1>

          <h2 className="mt-3 text-2xl font-black text-cyan-300">
            AI Pattern Boundary শনাক্তকরণ
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-slate-300">
            OptiFabric AI analyses the uploaded pattern and prepares the
            detected outline for area calculation, marker planning and fabric
            consumption analysis.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            OptiFabric AI upload করা pattern বিশ্লেষণ করে এবং শনাক্ত করা
            outline-কে area calculation, marker planning ও fabric consumption
            analysis-এর জন্য প্রস্তুত করে।
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Detection Result
            </h2>

            <h3 className="mt-2 text-xl font-black text-cyan-300">
              শনাক্তকরণের ফলাফল
            </h3>

            <div className="mt-6 space-y-4">
              <ResultRow
                labelEnglish="Boundary Found"
                labelBangla="Boundary পাওয়া গেছে"
                value={result.detected ? "YES · হ্যাঁ" : "NO · না"}
                positive={result.detected}
              />

              <ResultRow
                labelEnglish="Confidence"
                labelBangla="AI confidence"
                value={`${result.confidence}%`}
              />

              <ResultRow
                labelEnglish="Estimated Pattern Pieces"
                labelBangla="আনুমানিক pattern piece"
                value={String(result.estimatedPieces)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              AI Analysis
            </h2>

            <h3 className="mt-2 text-xl font-black text-cyan-300">
              AI বিশ্লেষণ
            </h3>

            <ul className="mt-6 space-y-3">
              {result.notes.map((note) => (
                <li
                  key={note}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 leading-7 text-slate-300"
                >
                  • {note}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-950/20 p-4">
              <p className="font-bold text-amber-300">
                বাংলা ব্যাখ্যা
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                AI notes-গুলো pattern image-এর quality, boundary clarity এবং
                সম্ভাব্য engineering risk সম্পর্কে নির্দেশনা দেয়। Final
                result ব্যবহারের আগে Cutting Master-এর visual verification
                প্রয়োজন।
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-cyan-700 bg-cyan-950 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            Why does AI perform boundary detection?
          </h2>

          <h3 className="mt-2 text-lg font-black text-cyan-200">
            AI কেন pattern boundary শনাক্ত করে?
          </h3>

          <p className="mt-4 leading-8 text-slate-300">
            AI must identify the exact outline of every pattern piece before it
            can calculate pattern area, generate an efficient marker, estimate
            fabric consumption or recommend potential savings.
          </p>

          <p className="mt-3 leading-8 text-slate-400">
            Pattern area হিসাব করা, efficient marker তৈরি করা, fabric
            consumption অনুমান করা অথবা সম্ভাব্য saving recommendation দেওয়ার
            আগে AI-কে প্রতিটি pattern piece-এর সঠিক outline শনাক্ত করতে হয়।
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-6">
          <h2 className="text-xl font-bold text-amber-300">
            Engineering Verification Required
          </h2>

          <h3 className="mt-2 text-lg font-black text-amber-200">
            Engineering verification প্রয়োজন
          </h3>

          <p className="mt-4 leading-8 text-slate-300">
            Confirm that the detected outline follows the actual cutting edge,
            not the seam line or an internal marking. Curves, corners and
            notches should be checked before continuing.
          </p>

          <p className="mt-3 leading-8 text-slate-400">
            শনাক্ত করা outline actual cutting edge অনুসরণ করছে কি না নিশ্চিত
            করুন; seam line অথবা internal marking যেন boundary হিসেবে ধরা না
            হয়। পরবর্তী ধাপে যাওয়ার আগে curve, corner এবং notch যাচাই করুন।
          </p>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            href="/optifabric/cutting-assistant/pattern-area"
            className="rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            <span className="block">Continue to Pattern Area →</span>
            <span className="mt-1 block text-sm">
              Pattern Area-এ এগিয়ে যান →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

function ResultRow({
  labelEnglish,
  labelBangla,
  value,
  positive = false,
}: {
  labelEnglish: string;
  labelBangla: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="font-bold text-white">{labelEnglish}</p>
      <p className="mt-1 text-sm text-slate-400">{labelBangla}</p>
      <p
        className={`mt-3 text-lg font-black ${
          positive ? "text-green-300" : "text-cyan-300"
        }`}
      >
        {value}
      </p>
    </div>
  );
}