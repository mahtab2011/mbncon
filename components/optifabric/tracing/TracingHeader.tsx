"use client";

interface TracingHeaderProps {
  projectName?: string;
  patternName?: string;
  status?: string;
}

export default function TracingHeader({
  projectName = "OptiFabric AI",
  patternName = "Pattern Tracing Workspace",
  status = "RC4 Engineering",
}: TracingHeaderProps) {
  return (
    <section className="mb-6 rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 shadow-lg">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">
            {patternName}
          </h1>

          <p className="mt-2 text-slate-300">
            {projectName}
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-5 py-3">
          <p className="text-sm uppercase tracking-widest text-cyan-300">
            Status
          </p>

          <p className="text-lg font-bold text-white">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}