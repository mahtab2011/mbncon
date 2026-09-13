import Link from "next/link";

import {
  calculateFabricConsumption,
} from "@/lib/optifabric/fabricConsumptionEngine";

export default function FabricConsumptionPage() {
  const result = calculateFabricConsumption({
    garmentAreaSqInches: 168,
    markerAreaSqInches: 188.16,
    fabricWidthInches: 60,
    garmentsPerMarker: 8,
    orderQuantity: 5000,
    fabricPricePerYard: 2.5,
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/optifabric/cutting-assistant/marker-layout"
          className="inline-block text-cyan-300 transition hover:text-cyan-200"
        >
          <span className="block">← Back to Marker Layout</span>
          <span className="mt-1 block text-sm text-slate-400">
            ← Marker Layout-এ ফিরে যান
          </span>
        </Link>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-8">
          <p className="font-semibold text-cyan-300">
            Block 007A · Engineering Fabric Intelligence
          </p>

          <p className="mt-2 font-bold text-cyan-200">
            ব্লক ০০৭A · Engineering Fabric Intelligence
          </p>

          <h1 className="mt-5 text-4xl font-bold">
            AI Fabric Consumption Intelligence
          </h1>

          <h2 className="mt-3 text-2xl font-black text-cyan-300">
            AI কাপড় ব্যবহার বিশ্লেষণ
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-slate-300">
            OptiFabric AI calculates consumption from garment area, marker
            area, utilisation, unused space, fabric width, order quantity and
            fabric cost.
          </p>

          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            OptiFabric AI garment area, marker area, utilisation, unused
            space, fabric width, order quantity এবং fabric cost ব্যবহার করে
            কাপড়ের consumption হিসাব করে।
          </p>
        </section>

        {/* Stage 2D-3 — this page's calculation uses fixed example numbers
            below, not any project's persisted MarkerRun/FabricProfile. See
            app/optifabric/project/[projectId]/marker/page.tsx's Fabric
            Planning section (Stage 2D-2) for the real, Marker-Based Fabric
            Consumption feature. */}
        <section className="mt-8 rounded-2xl border border-amber-400/40 bg-amber-950/20 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
            Legacy Demo
          </p>

          <h2 className="mt-2 text-xl font-black text-amber-100">
            This is a legacy/demo Cutting Assistant calculation
          </h2>

          <p className="mt-3 leading-7 text-slate-300">
            The figures below use fixed example numbers — they do not use
            this or any project&apos;s persisted Marker Run or Fabric
            Profile. For real project fabric consumption, use Marker-Based
            Fabric Consumption in the Project → Marker workflow.
          </p>

          <Link
            href="/optifabric/projects"
            className="mt-4 inline-block rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Go to your projects →
          </Link>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Area-Based Result
            </h2>

            <h3 className="mt-2 text-xl font-black text-cyan-300">
              Area-ভিত্তিক ফলাফল
            </h3>

            <div className="mt-6 space-y-4">
              <ResultRow
                labelEnglish="Garment Area"
                labelBangla="Garment area"
                value={`${result.garmentAreaSqInches} sq inches`}
              />

              <ResultRow
                labelEnglish="Marker Area"
                labelBangla="Marker area"
                value={`${result.markerAreaSqInches} sq inches`}
              />

              <ResultRow
                labelEnglish="Air Area / Unused Space"
                labelBangla="খালি area / অব্যবহৃত জায়গা"
                value={`${result.airAreaSqInches} sq inches`}
              />

              <ResultRow
                labelEnglish="Marker Efficiency"
                labelBangla="Marker efficiency"
                value={`${result.markerEfficiency}%`}
              />

              <ResultRow
                labelEnglish="Fabric Utilisation"
                labelBangla="Fabric utilisation"
                value={`${result.utilizationPercent}%`}
              />

              <ResultRow
                labelEnglish="Linear Length Per Marker"
                labelBangla="প্রতি marker-এর linear length"
                value={`${result.linearLengthPerMarkerInches} inches`}
              />

              <ResultRow
                labelEnglish="Consumption Per Garment"
                labelBangla="প্রতি garment-এর consumption"
                value={`${result.consumptionPerGarmentYards} yards`}
              />

              <ResultRow
                labelEnglish="Total Order Fabric"
                labelBangla="মোট order fabric"
                value={`${result.totalOrderYards} yards`}
                highlighted
              />

              <ResultRow
                labelEnglish="Estimated Fabric Cost"
                labelBangla="আনুমানিক fabric cost"
                value={`$${result.estimatedFabricCost}`}
                highlighted
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              AI Engineering Notes
            </h2>

            <h3 className="mt-2 text-xl font-black text-cyan-300">
              AI Engineering পরামর্শ
            </h3>

            <ul className="mt-6 space-y-3 text-slate-300">
              {result.notes.map((note) => (
                <li
                  key={note}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 leading-7"
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
                এই notes-গুলো marker efficiency, unused area এবং fabric
                consumption-এর engineering interpretation প্রদান করে। Bulk
                cutting-এর আগে factory-approved marker এবং trial result-এর
                সঙ্গে তুলনা করুন।
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-cyan-800 bg-cyan-950/40 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            Why does AI calculate consumption in square inches?
          </h2>

          <h3 className="mt-2 text-lg font-black text-cyan-200">
            AI কেন square inch-এ consumption হিসাব করে?
          </h3>

          <p className="mt-4 leading-8 text-slate-300">
            Pattern and marker geometry are area-based. AI first calculates
            square inches, then converts that area into linear fabric length by
            dividing it by the usable fabric width. This creates a more
            professional and auditable cutting calculation.
          </p>

          <p className="mt-3 leading-8 text-slate-400">
            Pattern এবং marker geometry area-ভিত্তিক। AI প্রথমে square
            inch-এ area হিসাব করে, এরপর usable fabric width দিয়ে ভাগ করে
            linear fabric length নির্ণয় করে। এতে cutting calculation আরও
            পেশাদার, স্বচ্ছ এবং যাচাইযোগ্য হয়।
          </p>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            href="/optifabric/pilot-dashboard"
            className="rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            <span className="block">Continue to Pilot Dashboard →</span>
            <span className="mt-1 block text-sm">
              Pilot Dashboard-এ এগিয়ে যান →
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
      <p
        className={
          highlighted
            ? "font-bold text-cyan-300"
            : "font-bold text-white"
        }
      >
        {labelEnglish}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {labelBangla}
      </p>

      <p className="mt-3 text-lg font-black text-white">
        {value}
      </p>
    </div>
  );
}