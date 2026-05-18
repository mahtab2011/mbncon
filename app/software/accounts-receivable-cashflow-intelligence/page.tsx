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

const kpiCards = [
  ["Receivable Ageing", "Tracked", "#receivable-ageing"],
  ["Payment Delay", "Visible", "#overdue-buyer-payment"],
  ["Interest Cost", "Measured", "#interest-cost"],
  ["Cashflow Risk", "Monitored", "#cash-flow-forecast-risk"],
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AccountsReceivableCashflowIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/software"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          ← Back to Software
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
          {kpiCards.map(([label, value, href], index) => (
            <a
              key={label}
              href={href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-400/10"
            >
              <p className="text-xs font-bold text-emerald-300">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-2 text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-emerald-300">
                {value}
              </p>
            </a>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-emerald-200">
              Cashflow Control Areas
            </h2>

            <div className="mt-6 space-y-3">
              {cashflowAreas.map((item, index) => {
                const id = slugify(item);

                return (
                  <a
                    key={item}
                    href={`#${id}`}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-400/10"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <span className="text-sm text-slate-200">{item}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-emerald-200">
              Financial Risks
            </h2>

            <div className="mt-6 space-y-4">
              {financialRisks.map((item, index) => {
                const id = `risk-${slugify(item)}`;

                return (
                  <a
                    key={item}
                    href={`#${id}`}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-400/10"
                  >
                    <p className="font-semibold text-white">
                      {index + 1}. {item}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Track buyer, amount, due date, overdue days, interest
                      impact, follow-up owner, and recovery action.
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold text-emerald-200">
            Cashflow Control Detail Sections
          </h2>

          <div className="mt-6 space-y-5">
            {cashflowAreas.map((item, index) => {
              const id = slugify(item);

              return (
                <section
                  key={item}
                  id={id}
                  className="scroll-mt-28 rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  <h3 className="text-xl font-bold text-emerald-300">
                    {String(index + 1).padStart(2, "0")} {item}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    This control area helps management review buyer payment
                    behaviour, cash timing, working capital pressure, and
                    financial exposure before business stability is affected.
                  </p>
                </section>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold text-emerald-200">
            Financial Risk Detail Sections
          </h2>

          <div className="mt-6 space-y-5">
            {financialRisks.map((item, index) => {
              const id = `risk-${slugify(item)}`;

              return (
                <section
                  key={item}
                  id={id}
                  className="scroll-mt-28 rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  <h3 className="text-xl font-bold text-emerald-300">
                    {String(index + 1).padStart(2, "0")} {item}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Track buyer, amount, due date, overdue days, interest
                    impact, follow-up owner, and recovery action to reduce
                    financial stress and protect working capital.
                  </p>
                </section>
              );
            })}
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