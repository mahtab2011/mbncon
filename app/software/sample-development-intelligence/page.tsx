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

const sampleStages = [
  "Proto sample",
  "Fit sample",
  "Salesman sample",
  "Size set sample",
  "Pre-production sample",
  "Shipment sample",
];

const trackingAreas = [
  "Buyer comments and revisions",
  "Sample rejection reason",
  "Approval cycle time",
  "Material issue during sampling",
  "Pattern or fitting issue",
  "Colour / shade issue",
  "Development cost tracking",
  "Sample courier and shipment delay",
  "Communication delay",
  "Final approval readiness",
];

const kpiCards = [
  {
    title: "Sample Stages",
    value: "6",
    description:
      "Track proto, fit, salesman, size set, pre-production, and shipment samples.",
    target: "Sample Stages",
    className: "border-pink-400/30 bg-pink-400/10 text-pink-200",
  },
  {
    title: "Approval Risk",
    value: "Tracked",
    description:
      "Monitor sample rejection, buyer revision cycles, and final approval readiness.",
    target: "Tracking & Risk Areas",
    className: "border-red-400/30 bg-red-400/10 text-red-200",
  },
  {
    title: "Development Cost",
    value: "Measured",
    description:
      "Measure sampling cost pressure, courier delay, material issue, and rework cost.",
    target: "Sample Development Intelligence",
    className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  {
    title: "Buyer Feedback",
    value: "Visible",
    description:
      "Make buyer comments and revision history visible for executive review.",
    target: "Consultancy Application",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
];

export default function SampleDevelopmentIntelligencePage() {
  return (
    <DashboardShell title="Sample Development Intelligence">
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-pink-300">
              MBNCON Sample Development Intelligence
            </p>

            <h1 className="text-4xl font-bold md:text-5xl">
              Sample Development Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
              Track sample stages, buyer comments, rejection reasons, approval
              cycle time, material problems, development cost, communication
              delays, and final approval readiness in garments and footwear
              manufacturing.
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

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <section
              id={slugify("Sample Stages")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-pink-200">
                Sample Stages
              </h2>

              <div className="mt-6 space-y-3">
                {sampleStages.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-pink-400 hover:bg-pink-400/10 hover:shadow-lg"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-400 text-sm font-bold text-slate-950">
                        {index + 1}
                      </span>

                      <span className="text-sm leading-6 text-slate-200">
                        {item}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>

            <section
              id={slugify("Tracking & Risk Areas")}
              className="scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold text-pink-200">
                Tracking & Risk Areas
              </h2>

              <div className="mt-6 space-y-3">
                {trackingAreas.map((item, index) => {
                  const itemId = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${itemId}`}
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-pink-400 hover:bg-pink-400/10 hover:shadow-lg"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-400 text-sm font-bold text-slate-950">
                        {index + 1}
                      </span>

                      <span className="text-sm leading-6 text-slate-200">
                        {item}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          </section>

          <section
            id={slugify("Sample Development Intelligence")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-pink-400/30 bg-slate-900 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300">
              Sample Development Intelligence
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-white">
              Buyer Approval, Revision & Sampling Risk Control
            </h2>

            <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
              This module helps merchandising, product development, technical,
              sourcing, and production teams control the full sample approval
              cycle, reduce repeated rejections, improve buyer communication,
              track development cost, and protect production start dates.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...sampleStages, ...trackingAreas].map((item) => {
                const itemId = slugify(item);

                return (
                  <section
                    key={item}
                    id={itemId}
                    className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-pink-400 hover:bg-pink-400/10 hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-white">{item}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Intelligence focus prepared for buyer approval tracking,
                      revision control, sample rejection analysis, and
                      development-cycle recovery.
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          <section
            id={slugify("Consultancy Application")}
            className="mt-10 scroll-mt-28 rounded-3xl border border-pink-400/30 bg-pink-400/10 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold text-pink-200">
              Consultancy Application
            </h2>

            <p className="mt-4 max-w-5xl leading-8 text-slate-200">
              This module helps factories reduce sample rejection, shorten
              approval cycle time, improve buyer confidence, reduce development
              cost, and protect production and shipment schedules through better
              sample management.
            </p>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                "Buyer approval cycle control",
                "Sample rejection reduction",
                "Production readiness protection",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:shadow-lg"
                >
                  <p className="font-semibold text-white">{item}</p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Consultancy-demo executive UX prepared for manufacturing
                    product development and merchandising intelligence.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#top"
                className="text-sm font-semibold text-pink-300 transition duration-300 hover:text-pink-100"
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