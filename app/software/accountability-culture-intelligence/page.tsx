"use client";

import DashboardShell from "@/components/software/DashboardShell";

import {
  accountabilityCultureKPIs,
  accountabilityCultureSignals,
  accountabilityCultureRisks,
  accountabilityCultureActions,
} from "@/lib/software/accountabilityCultureEngine";

export default function AccountabilityCultureIntelligencePage() {
  return (
    <DashboardShell title="AI Accountability Culture Intelligence Centre">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-cyan-300">
              MBNCON Leadership & Human Intelligence
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              AI Accountability Culture Intelligence Centre
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              This module analyses ownership behaviour, follow-up discipline,
              decision clarity, excuse pressure, corrective action closure, and
              leadership accountability culture.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {accountabilityCultureKPIs.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>
                <p className="mt-2 text-sm text-slate-300">{item.note}</p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Accountability Culture Signals
              </h2>

              <div className="mt-4 space-y-3">
                {accountabilityCultureSignals.map((signal) => (
                  <div
                    key={signal}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300"
                  >
                    {signal}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-6">
              <h2 className="text-2xl font-bold text-red-200">
                Accountability Culture Risks
              </h2>

              <div className="mt-4 space-y-3">
                {accountabilityCultureRisks.map((risk) => (
                  <div
                    key={risk}
                    className="rounded-xl border border-red-500/20 bg-red-900/20 p-4 text-red-100"
                  >
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-500/20 bg-emerald-950/20 p-6">
            <h2 className="text-2xl font-bold text-emerald-200">
              Recommended Leadership Actions
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {accountabilityCultureActions.map((action) => (
                <div
                  key={action.title}
                  className="rounded-2xl border border-emerald-500/20 bg-slate-950 p-5"
                >
                  <h3 className="text-lg font-semibold">{action.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}