"use client";

export default function ExecutiveHeader() {
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 p-6 shadow-2xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            Commercial Demonstration
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            OptiFabric AI RC1 Commercial Pilot
          </h2>

          <p className="mt-3 max-w-3xl text-slate-300">
            AI-powered engineering for garment pattern digitisation,
            intelligent nesting and commercial fabric optimisation.
          </p>

          <p className="mt-2 text-slate-400">
            গার্মেন্টস প্যাটার্ন ডিজিটাইজেশন, AI নেস্টিং এবং
            কাপড় সাশ্রয়ের জন্য বাণিজ্যিক প্রকৌশল সমাধান।
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/30 bg-slate-900/70 px-6 py-5 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Version
          </p>

          <p className="mt-2 text-3xl font-black text-white">
            RC1
          </p>

          <p className="mt-1 text-green-400 font-semibold">
            Commercial Pilot
          </p>
        </div>

      </div>
    </section>
  );
}