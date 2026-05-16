"use client";

import Link from "next/link";

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

export default function SampleDevelopmentIntelligencePage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-pink-300">
            MBNCON Sample Development Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Sample Development Intelligence
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track sample stages, buyer comments, rejection reasons, approval
            cycle time, material problems, development cost, communication
            delays, and final approval readiness in garments and footwear
            manufacturing.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Sample Stages", "6"],
            ["Approval Risk", "Tracked"],
            ["Development Cost", "Measured"],
            ["Buyer Feedback", "Visible"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-pink-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-pink-200">
              Sample Stages
            </h2>

            <div className="mt-6 space-y-3">
              {sampleStages.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <h2 className="text-2xl font-bold text-pink-200">
              Tracking & Risk Areas
            </h2>

            <div className="mt-6 space-y-3">
              {trackingAreas.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-400 text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>

                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-pink-400/30 bg-pink-400/10 p-8">
          <h2 className="text-2xl font-bold text-pink-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps factories reduce sample rejection, shorten
            approval cycle time, improve buyer confidence, reduce development
            cost, and protect production and shipment schedules through better
            sample management.
          </p>
        </section>
      </section>
    </main>
  );
}