"use client";

interface CommercialBannerProps {
  compact?: boolean;
}

export default function CommercialBanner({
  compact = false,
}: CommercialBannerProps) {
  return (
    <section
      className={`rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-900 shadow-xl ${
        compact ? "p-5" : "p-6 md:p-8"
      }`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              Commercial Pilot RC1
            </span>

            <span className="rounded-full border border-blue-400/40 bg-blue-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
              BGMEA Demo Ready
            </span>

            <span className="rounded-full border border-green-400/40 bg-green-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
              No CAD Required
            </span>
          </div>

          <h2
            className={`mt-4 font-black text-white ${
              compact ? "text-2xl md:text-3xl" : "text-3xl md:text-5xl"
            }`}
          >
            OptiFabric AI
          </h2>

          <p className="mt-2 text-lg font-bold text-cyan-300 md:text-xl">
            AI Digital Cutting Master & Engineering Assistant
          </p>

          <p className="mt-2 text-base text-slate-300">
            ডিজিটাল কাটিং মাস্টার ও ইঞ্জিনিয়ারিং সহকারী
          </p>

          {!compact && (
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
              Engineering-grade pattern analysis, boundary tracing, polygon
              construction, nesting, fabric-saving and commercial ROI guidance
              for garment factories.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            Designed For
          </p>

          <div className="mt-3 grid gap-2 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-1">
            <p>✓ Cutting Master</p>
            <p>✓ Cutting Supervisor</p>
            <p>✓ Production Officer</p>
            <p>✓ Factory Manager</p>
          </div>

          <div className="mt-4 border-t border-slate-700 pt-4">
            <p className="font-semibold text-white">
              English + বাংলা Guidance
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Simple factory operation with clear AI explanations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}