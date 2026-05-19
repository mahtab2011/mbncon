"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const supplierAreas = [
  "Material quality performance",
  "On-time delivery reliability",
  "Price stability",
  "Lead time consistency",
  "Rejection and return rate",
  "Shortage risk",
  "Communication responsiveness",
  "Dependency risk",
  "Corrective action response",
  "Overall supplier scorecard",
];

const kpiCards = [
  {
    title: "Supplier Risk",
    value: "Medium",
    description:
      "Supplier risk visibility prepared for sourcing, quality, and production control.",
    target: "Supplier Scorecard Areas",
    className: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200",
  },
  {
    title: "Quality Concern",
    value: "Monitor",
    description:
      "Material quality performance, rejection, return rate, and corrective action are tracked.",
    target: "Supplier Scorecard Areas",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
  {
    title: "Delivery Reliability",
    value: "Developing",
    description:
      "On-time delivery, lead time consistency, shortage risk, and dependency risk are visible.",
    target: "Supplier Performance Layer",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  {
    title: "Scorecard Status",
    value: "Ready",
    description:
      "Supplier scorecard structure is ready for executive review and improvement action.",
    target: "Consultancy Application",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
];

export default function SupplierPerformanceIntelligencePage() {
  return (
    <DashboardShell title="Supplier Performance Intelligence">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div id="top" />

          <Link
            href="/software"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition duration-300 hover:bg-white/10"
          >
            ← Back to Dashboard
          </Link>

          <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-fuchsia-300">
              MBNCON Supplier Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Supplier Performance Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Analyse supplier quality, delivery reliability, price stability,
              lead time, rejection rate, shortage risk, dependency risk, and
              corrective action performance.
            </p>
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map((card) => {
              const targetId = slugify(card.target);

              return (
                <a
                  key={card.title}
                  href={`#${targetId}`}
                  className={`rounded-3xl border p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${card.className}`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                    {card.title}
                  </p>

                  <p className="mt-3 text-3xl font-extrabold">
                    {card.value}
                  </p>

                  <p className="mt-4 text-sm leading-7 opacity-90">
                    {card.description}
                  </p>

                  <p className="mt-5 text-sm font-semibold opacity-80">
                    View section →
                  </p>
                </a>
              );
            })}
          </section>

          <section
            id={slugify("Supplier Scorecard Areas")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-fuchsia-200">
              Supplier Scorecard Areas
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {supplierAreas.map((item, index) => {
                const itemId = slugify(item);

                return (
                  <a
                    key={item}
                    href={`#${itemId}`}
                    className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-fuchsia-400 hover:bg-fuchsia-400/10 hover:shadow-lg"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-400 font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <div>
                      <p className="font-semibold text-white">{item}</p>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Track score, trend, risk level, supplier response, and
                        improvement action.
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Supplier Performance Layer")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-fuchsia-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-300">
              Supplier Performance Layer
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Quality, Delivery, Price & Dependency Intelligence
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module helps factory leadership compare supplier quality,
              delivery reliability, price stability, lead time consistency,
              rejection and return rate, shortage risk, communication
              responsiveness, dependency exposure, corrective action response,
              and overall supplier scorecard performance.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {supplierAreas.map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-400 hover:bg-fuchsia-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for supplier scorecard review,
                      risk visibility, sourcing decision support, and corrective
                      action follow-up.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-fuchsia-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps factories evaluate which suppliers support
              performance and which suppliers create hidden cost, production
              delay, quality failure, shortage, and delivery risk.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Supplier scorecard visibility",
                "Corrective action follow-up",
                "Sourcing risk reduction",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for supplier
                    performance review and sourcing decision support.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-fuchsia-300 transition duration-300 hover:text-fuchsia-100"
              >
                Back to top ↑
              </a>
            </div>
          </section>
        </section>
      </main>
    </DashboardShell>
  );
}