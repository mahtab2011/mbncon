"use client";

import Link from "next/link";

const demoSteps = [
  {
    step: "01",
    title: "Executive Welcome",
    description:
      "Start with the MD/CEO morning briefing, factory health, AI alerts and critical priorities.",
    href: "/manufacturing/executive-welcome",
    focus: "Opening screen",
  },
  {
    step: "02",
    title: "Global Executive Dashboard",
    description:
      "Show complete factory intelligence across production, quality, maintenance, cutting and shipment.",
    href: "/manufacturing/global-executive-dashboard",
    focus: "Executive overview",
  },
  {
    step: "03",
    title: "Executive Command Centre",
    description:
      "Explain AI decisions, risk areas and recommended management actions.",
    href: "/manufacturing/executive-command-centre",
    focus: "Decision support",
  },
  {
    step: "04",
    title: "Cutting Command Centre",
    description:
      "Show cutting KPIs, marker efficiency, bundles, fabric utilization and AI alerts.",
    href: "/manufacturing/cutting-command-centre",
    focus: "Cutting control",
  },
  {
    step: "05",
    title: "Fabric Inspection",
    description:
      "Demonstrate 4-point inspection, defects, GSM, width variance and AI suitability.",
    href: "/manufacturing/fabric-inspection",
    focus: "Fabric quality",
  },
  {
    step: "06",
    title: "AI Fabric Optimizer",
    description:
      "Show AI recommendations for marker, roll, lay plan and fabric savings.",
    href: "/manufacturing/fabric-optimizer",
    focus: "Cost saving",
  },
  {
    step: "07",
    title: "Roll & Bundle Traceability",
    description:
      "Trace fabric roll to lay, marker, bundle and sewing line.",
    href: "/manufacturing/roll-bundle-traceability",
    focus: "Traceability",
  },
];

export default function BGMEADemoPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="mb-8 rounded-2xl bg-blue-700 p-8 text-white shadow">
        <h1 className="text-4xl font-bold">
          BGMEA Pilot Demonstration Mode
        </h1>

        <p className="mt-3 text-blue-100">
          A guided demonstration flow for GPA — Garments Productivity App,
          showing executive intelligence, cutting intelligence, fabric
          optimization and traceability.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/manufacturing/executive-welcome"
            className="rounded-lg bg-white px-5 py-3 font-semibold text-blue-700"
          >
            Start Demo
          </Link>

          <Link
            href="/manufacturing"
            className="rounded-lg bg-blue-900 px-5 py-3 font-semibold text-white"
          >
            Back to Suite
          </Link>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Recommended Demo Script
        </h2>

        <p className="mt-3 text-gray-700">
          Begin with the Executive Welcome screen, then move through the
          executive dashboard, command centre and cutting intelligence modules.
          End by showing fabric savings and roll-to-bundle traceability.
        </p>
      </section>

      <div className="grid gap-6">
        {demoSteps.map((item) => (
          <Link
            key={item.step}
            href={item.href}
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-blue-600">
                  Step {item.step} · {item.focus}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-blue-700">
                  {item.title}
                </h2>

                <p className="mt-2 text-gray-600">
                  {item.description}
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                Open →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}