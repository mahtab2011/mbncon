import Link from "next/link";
import type { ReactNode } from "react";

const fabricTypes = [
  ["single-jersey", "Single Jersey", "Single Jersey"],
  ["interlock", "Interlock", "Interlock"],
  ["rib", "Rib", "Rib"],
  ["pique", "Pique", "Pique"],
  ["woven", "Woven", "Woven"],
  ["denim", "Denim", "Denim"],
  ["fleece", "Fleece", "Fleece"],
];

const shadeOptions = [
  ["single-shade", "Single Shade", "একটি shade"],
  ["multiple-shades", "Multiple Shades", "একাধিক shade"],
];

export default function FabricSpecsPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/optifabric/cutting-assistant/upload"
          className="inline-block text-cyan-300 transition hover:text-cyan-200"
        >
          <span className="block">← Back to Pattern Upload</span>
          <span className="mt-1 block text-sm text-slate-400">
            ← Pattern Upload-এ ফিরে যান
          </span>
        </Link>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-8">
          <p className="font-semibold text-cyan-300">
            Block 003 · Fabric &amp; Lay Specification
          </p>
          <p className="mt-2 font-bold text-cyan-200">
            ব্লক ০০৩ · Fabric ও Lay Specification
          </p>

          <h1 className="mt-5 text-4xl font-bold">
            Fabric &amp; Lay Specification
          </h1>
          <h2 className="mt-3 text-2xl font-black text-cyan-300">
            Fabric ও lay specification
          </h2>

          <p className="mt-5 max-w-3xl leading-8 text-slate-300">
            These engineering parameters allow OptiFabric AI to estimate marker
            efficiency, fabric utilisation and cutting behaviour.
          </p>
          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            এই engineering parameter-গুলো OptiFabric AI-কে marker efficiency,
            fabric utilisation এবং cutting behaviour অনুমান করতে সহায়তা করে।
          </p>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <FieldCard
            titleEnglish="Fabric Width"
            titleBangla="কাপড়ের প্রস্থ"
            whyEnglish="Fabric width determines how many pattern pieces can fit across the marker and directly affects fabric consumption."
            whyBangla="Fabric width নির্ধারণ করে marker-এর প্রস্থ জুড়ে কতটি pattern piece বসানো যাবে এবং এটি সরাসরি fabric consumption-কে প্রভাবিত করে।"
          >
            <BilingualLabel
              english="Usable fabric width in inches"
              bangla="ব্যবহারযোগ্য fabric width, inch-এ"
            />
            <input
              type="number"
              min="1"
              step="0.1"
              inputMode="decimal"
              placeholder="Example: 60 · উদাহরণ: ৬০"
              className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-white placeholder:text-slate-500"
            />
          </FieldCard>

          <FieldCard
            titleEnglish="Fabric GSM"
            titleBangla="Fabric GSM"
            whyEnglish="GSM influences spreading behaviour, compression, lay height and production planning."
            whyBangla="GSM spreading behaviour, compression, lay height এবং production planning-কে প্রভাবিত করে।"
          >
            <BilingualLabel
              english="Fabric weight in grams per square metre"
              bangla="প্রতি square metre-এ fabric weight"
            />
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="Example: 180 · উদাহরণ: ১৮০"
              className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-white placeholder:text-slate-500"
            />
          </FieldCard>

          <FieldCard
            titleEnglish="Fabric Type"
            titleBangla="Fabric-এর ধরন"
            whyEnglish="Different fabrics require different cutting rules, relaxation controls and marker optimisation logic."
            whyBangla="ভিন্ন fabric-এর জন্য ভিন্ন cutting rule, relaxation control এবং marker optimisation logic প্রয়োজন।"
          >
            <BilingualLabel
              english="Select the fabric construction"
              bangla="Fabric construction নির্বাচন করুন"
            />
            <select className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-white">
              {fabricTypes.map(([value, english, bangla]) => (
                <option key={value} value={value}>
                  {english} · {bangla}
                </option>
              ))}
            </select>
          </FieldCard>

          <FieldCard
            titleEnglish="Shade Lot"
            titleBangla="Shade lot"
            whyEnglish="Shade grouping affects spreading sequence, bundle integrity and colour consistency across cut components."
            whyBangla="Shade grouping spreading sequence, bundle integrity এবং cut component-এর colour consistency-কে প্রভাবিত করে।"
          >
            <BilingualLabel
              english="Select the shade arrangement"
              bangla="Shade arrangement নির্বাচন করুন"
            />
            <select className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-white">
              {shadeOptions.map(([value, english, bangla]) => (
                <option key={value} value={value}>
                  {english} · {bangla}
                </option>
              ))}
            </select>
          </FieldCard>

          <FieldCard
            titleEnglish="Lay Length"
            titleBangla="Lay-এর দৈর্ঘ্য"
            whyEnglish="Lay length is required to compare the available cutting-table area with the planned marker length."
            whyBangla="Planned marker length-এর সঙ্গে available cutting-table area তুলনা করার জন্য lay length প্রয়োজন।"
          >
            <BilingualLabel
              english="Available lay length in yards"
              bangla="ব্যবহারযোগ্য lay length, yard-এ"
            />
            <input
              type="number"
              min="0.1"
              step="0.1"
              inputMode="decimal"
              placeholder="Example: 12 · উদাহরণ: ১২"
              className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-white placeholder:text-slate-500"
            />
          </FieldCard>

          <FieldCard
            titleEnglish="Number of Layers"
            titleBangla="Layer-এর সংখ্যা"
            whyEnglish="Layer count helps AI assess lay height, compression risk and cutting-machine suitability."
            whyBangla="Layer count AI-কে lay height, compression risk এবং cutting-machine suitability যাচাই করতে সহায়তা করে।"
          >
            <BilingualLabel
              english="Planned number of fabric layers"
              bangla="পরিকল্পিত fabric layer-এর সংখ্যা"
            />
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="Example: 80 · উদাহরণ: ৮০"
              className="mt-3 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-white placeholder:text-slate-500"
            />
          </FieldCard>
        </section>

        <section className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-950/20 p-6">
          <h2 className="text-xl font-bold text-amber-300">
            Engineering Check Before Continuing
          </h2>
          <h3 className="mt-2 text-lg font-black text-amber-200">
            পরবর্তী ধাপে যাওয়ার আগে engineering check
          </h3>
          <p className="mt-4 leading-8 text-slate-300">
            Use the actual usable fabric width, not the supplier&apos;s nominal
            width. Confirm the lay length against the cutting table and keep
            different shade lots separate.
          </p>
          <p className="mt-3 leading-8 text-slate-400">
            Supplier-এর nominal width নয়, actual usable fabric width ব্যবহার
            করুন। Cutting table-এর সঙ্গে lay length যাচাই করুন এবং ভিন্ন shade
            lot আলাদা রাখুন।
          </p>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            href="/optifabric/cutting-assistant/pattern-analysis"
            className="rounded-2xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            <span className="block">Continue to Pattern Analysis →</span>
            <span className="mt-1 block text-sm">
              Pattern Analysis-এ এগিয়ে যান →
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}

function BilingualLabel({
  english,
  bangla,
}: {
  english: string;
  bangla: string;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-300">
      <span className="block">{english}</span>
      <span className="mt-1 block text-slate-400">{bangla}</span>
    </label>
  );
}

function FieldCard({
  titleEnglish,
  titleBangla,
  whyEnglish,
  whyBangla,
  children,
}: {
  titleEnglish: string;
  titleBangla: string;
  whyEnglish: string;
  whyBangla: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="text-xl font-bold text-white">{titleEnglish}</h2>
      <h3 className="mt-2 text-lg font-black text-cyan-300">
        {titleBangla}
      </h3>

      <div className="mt-5">{children}</div>

      <div className="mt-5 rounded-xl border border-cyan-800 bg-cyan-950/40 p-4">
        <p className="text-sm font-semibold text-cyan-300">
          Why does AI ask this?
        </p>
        <p className="mt-1 text-sm font-bold text-cyan-200">
          AI কেন এই তথ্য চায়?
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {whyEnglish}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {whyBangla}
        </p>
      </div>
    </article>
  );
}