"use client";

import Link from "next/link";

const cashflowAreas = [
  "Receivable ageing",
  "Overdue buyer payment",
  "Buyer payment pattern",
  "LC opening status",
  "LC maturity / payment date",
  "Supplier payable pressure",
  "Bank loan exposure",
  "Interest cost",
  "Working capital blockage",
  "Cash flow forecast risk",
];

const financialRisks = [
  "Delayed buyer payment",
  "High receivable ageing",
  "Supplier payment pressure",
  "Increased bank interest cost",
  "Blocked working capital",
  "Cash flow stress",
];

export default function AccountsReceivableCashflowIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-300">
            MBNCON Financial Control Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Accounts Receivable & Cashflow Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track receivable ageing, overdue buyer payments, LC status, supplier
            payment pressure, bank loan exposure, interest cost, working capital
            blockage, and cash flow risk.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Receivable Ageing", "Tracked"],
            ["Payment Delay", "Visible"],
            ["Interest Cost", "Measured"],
            ["Cashflow Risk", "Monitored"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-emerald-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-emerald-200">
              Cashflow Control Areas
            </h2>

            <div className="mt-6 space-y-3">
              {cashflowAreas.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-emerald-200">
              Financial Risks
            </h2>

            <div className="mt-6 space-y-4">
              {financialRisks.map((item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-semibold text-white">
                    {index + 1}. {item}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Track buyer, amount, due date, overdue days, interest
                    impact, follow-up owner, and recovery action.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8">
          <h2 className="text-2xl font-bold text-emerald-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories understand how delayed payments,
            receivable ageing, LC delays, supplier pressure, loan exposure, and
            interest cost affect working capital and business stability.
          </p>
        </section>
      </section>
    </main>
  );
}