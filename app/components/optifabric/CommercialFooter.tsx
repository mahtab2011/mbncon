"use client";

export default function CommercialFooter() {
  return (
    <footer className="mt-12 rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center">

      <h2 className="text-2xl font-black text-cyan-300">
        OptiFabric AI
      </h2>

      <p className="mt-2 text-lg font-semibold text-white">
        AI Digital Cutting Master & Engineering Assistant
      </p>

      <p className="mt-2 text-slate-300">
        ডিজিটাল কাটিং মাস্টার ও ইঞ্জিনিয়ারিং সহকারী
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-4">

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="font-bold text-cyan-300">
            Commercial Pilot
          </p>

          <p className="text-slate-300">
            RC1
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="font-bold text-cyan-300">
            Languages
          </p>

          <p className="text-slate-300">
            English + বাংলা
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="font-bold text-cyan-300">
            Designed For
          </p>

          <p className="text-slate-300">
            Garment Industry
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="font-bold text-cyan-300">
            Powered By
          </p>

          <p className="text-slate-300">
            MBN Consulting
          </p>
        </div>

      </div>

      <div className="mt-8 border-t border-slate-700 pt-6">

        <p className="text-sm text-slate-400">
          OptiFabric AI Commercial Pilot RC1 demonstrates AI-assisted
          pattern engineering, polygon construction, nesting,
          fabric optimisation and ROI intelligence.
        </p>

      </div>

    </footer>
  );
}