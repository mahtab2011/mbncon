"use client";

import DashboardShell from "@/components/software/DashboardShell";

const intelligenceAreas = [
  "Bank branch productivity",
  "Customer service waiting time",
  "Loan application bottleneck",
  "Insurance claim processing delay",
  "Fraud risk signals",
  "KYC / compliance risk",
  "Staff workload balancing",
  "Customer retention risk",
  "Digital channel adoption",
  "Revenue and cost leakage",
];

const kpis = [
  { label: "Customer Waiting Risk", value: "High", note: "Queue and service delay visible" },
  { label: "Claim Delay Risk", value: "Medium", note: "Pending claims need escalation" },
  { label: "Fraud Signal", value: "Watch", note: "Unusual transaction patterns" },
  { label: "Cost Leakage", value: "12%", note: "Process waste and rework risk" },
];

const actions = [
  "Identify branch and service bottlenecks",
  "Track loan and claim turnaround time",
  "Flag suspicious or unusual activity",
  "Monitor compliance and KYC gaps",
  "Improve staff deployment by demand pattern",
  "Reduce rework, delay and customer complaints",
];

export default function AIBankingInsuranceIntelligencePage() {
  return (
    <DashboardShell title="AI Banking & Insurance Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm font-semibold text-cyan-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              AI Banking & Insurance Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              This module helps banks, insurance companies and financial service
              providers identify operational bottlenecks, customer service delays,
              fraud signals, compliance risk, claim processing gaps and productivity
              improvement opportunities.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {kpis.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <h2 className="mt-2 text-3xl font-bold text-cyan-300">
                  {item.value}
                </h2>
                <p className="mt-2 text-sm text-slate-300">{item.note}</p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Intelligence Areas
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {intelligenceAreas.map((area) => (
                  <div
                    key={area}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-200"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                AI Recommended Actions
              </h2>

              <div className="mt-5 space-y-3">
                {actions.map((action, index) => (
                  <div
                    key={action}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4"
                  >
                    <p className="text-sm text-cyan-200">
                      {index + 1}. {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Executive Summary
            </h2>

            <p className="mt-4 max-w-5xl text-slate-300">
              MBNCON AI Banking & Insurance Intelligence supports leadership teams
              by converting daily service, claim, compliance and operational data into
              clear management signals. It helps executives detect risk early, reduce
              customer dissatisfaction, improve turnaround time and protect profitability.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}