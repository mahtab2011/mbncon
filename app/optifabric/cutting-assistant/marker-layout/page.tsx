import Link from "next/link";

import {
  generateMarkerLayout,
} from "@/lib/optifabric/markerLayoutEngine";

export default function MarkerLayoutPage() {
  const result = generateMarkerLayout({
    fabricWidth: 60,
    patternPieces: 8,
    totalAreaSqInches: 168,
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/optifabric/cutting-assistant/pattern-area"
          className="inline-block text-cyan-300 transition hover:text-cyan-200"
        >
          <span className="block">← Back to Pattern Area</span>
          <span className="mt-1 block text-sm text-slate-400">
            ← Pattern Area-এ ফিরে যান
          </span>
        </Link>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-8">
          <p className="font-semibold text-cyan-300">
            Block 006 · AI Marker Layout
          </p>

          <p className="mt-2 font-bold text-cyan-200">
            ব্লক ০০৬ · AI Marker Layout
          </p>

          <h1 className="mt-5 text-4xl font-bold">
            AI Marker Recommendation
          </h1>

          <h2 className="mt-3 text-2xl font-black text-cyan-300">
            AI Marker Recommendation
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-slate-300">
            OptiFabric AI prepares an initial cutting marker using the pattern
            geometry, pattern-piece count and usable fabric width.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            OptiFabric AI pattern geometry, pattern-piece count এবং usable
            fabric width ব্যবহার করে একটি প্রাথমিক cutting marker প্রস্তুত
            করে।
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Marker Results
            </h2>

            <h3 className="mt-2 text-xl font-black text-cyan-300">
              Marker ফলাফল
            </h3>

            <div className="mt-6 space-y-4">
              <ResultRow
                labelEnglish="Estimated Marker Length"
                labelBangla="আনুমানিক marker length"
                value={`${result.estimatedMarkerLength} inches`}
              />

              <ResultRow
                labelEnglish="Marker Efficiency"
                labelBangla="Marker efficiency"
                value={`${result.markerEfficiency}%`}
                highlighted
              />

              <ResultRow
                labelEnglish="Estimated Waste"
                labelBangla="আনুমানিক waste"
                value={`${result.estimatedWaste}%`}
              />

              <ResultRow
                labelEnglish="Confidence"
                labelBangla="AI confidence"
                value={`${result.confidence}%`}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              AI Recommendation
            </h2>

            <h3 className="mt-2 text-xl font-black text-cyan-300">
              AI পরামর্শ
            </h3>

            <div className="mt-6 rounded-xl border border-cyan-800 bg-cyan-950/30 p-4">
              <p className="leading-7 text-slate-300">
                {result.recommendedLayout}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                এই recommendation pattern piece-গুলোর প্রাথমিক placement,
                marker length এবং available fabric width-এর ওপর ভিত্তি করে
                তৈরি করা হয়েছে।
              </p>
            </div>

            <ul className="mt-5 space-y-3 text-slate-300">
              {result.notes.map((note) => (
                <li
                  key={note}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 leading-7"
                >
                  • {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-cyan-800 bg-cyan-950/40 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            Why does AI generate a marker?
          </h2>

          <h3 className="mt-2 text-lg font-black text-cyan-200">
            AI কেন marker তৈরি করে?
          </h3>

          <p className="mt-4 leading-8 text-slate-300">
            The marker determines fabric utilisation, waste percentage,
            production cost and cutting efficiency. A better marker can
            directly improve factory profitability.
          </p>

          <p className="mt-3 leading-8 text-slate-400">
            Marker fabric utilisation, waste percentage, production cost এবং
            cutting efficiency নির্ধারণ করে। উন্নত marker সরাসরি factory
            profitability বাড়াতে সহায়তা করতে পারে।
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
            Check grain direction, one-way restrictions, stripe or check
            matching, nap direction, knife clearance and safe spacing before
            approving the marker for trial cutting.
          </p>

          <p className="mt-3 leading-8 text-slate-400">
            Trial cutting approve করার আগে grain direction, one-way
            restriction, stripe বা check matching, nap direction, knife
            clearance এবং safe spacing যাচাই করুন।
          </p>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            href="/optifabric/cutting-assistant/fabric-consumption"
            className="rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            <span className="block">Continue to Fabric Consumption →</span>
            <span className="mt-1 block text-sm">
              Fabric Consumption-এ এগিয়ে যান →
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
  highlighted = false,
}: {
  labelEnglish: string;
  labelBangla: string;
  value: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlighted
          ? "border-cyan-400/30 bg-cyan-950/30"
          : "border-slate-800 bg-slate-950/60"
      }`}
    >
      <p className="font-bold text-white">
        {labelEnglish}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {labelBangla}
      </p>

      <p
        className={`mt-3 text-lg font-black ${
          highlighted ? "text-cyan-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}