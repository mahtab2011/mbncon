"use client";

import Link from "next/link";

const modules = [
  {
    title: "Global Executive Dashboard",
    description: "One-screen executive view for BGMEA pilot.",
    href: "/manufacturing/global-executive-dashboard",
    tag: "Executive",
  },
  {
    title: "Executive Command Centre",
    description: "Factory health, risks, actions and AI decisions.",
    href: "/manufacturing/executive-command-centre",
    tag: "Executive",
  },
  {
    title: "AI Assistant",
    description: "Ask operational questions using manufacturing intelligence.",
    href: "/manufacturing/ai-assistant",
    tag: "AI",
  },
  {
    title: "Cutting Command Centre",
    description: "Cutting KPIs, bundles, fabric usage and AI alerts.",
    href: "/manufacturing/cutting-command-centre",
    tag: "Cutting",
  },
  {
    title: "Fabric Inspection",
    description: "4-point inspection, defects, GSM, width and AI risk.",
    href: "/manufacturing/fabric-inspection",
    tag: "Fabric",
  },
  {
    title: "Fabric Shade Management",
    description: "Shade grouping, lay assignment and shade-mixing prevention.",
    href: "/manufacturing/fabric-shade-management",
    tag: "Fabric",
  },
  {
    title: "Pattern Intelligence",
    description: "Pattern dimensions, AI measurement and tolerance review.",
    href: "/manufacturing/pattern-intelligence",
    tag: "Pattern",
  },
  {
    title: "Marker Intelligence",
    description: "Marker efficiency, fabric utilization and wastage.",
    href: "/manufacturing/marker-intelligence",
    tag: "Marker",
  },
  {
    title: "AI Fabric Optimizer",
    description: "Best marker, roll and lay plan recommendations.",
    href: "/manufacturing/fabric-optimizer",
    tag: "AI Fabric",
  },
  {
    title: "Fabric Consumption Predictor",
    description: "Fabric requirement, wastage, buffer and shortage risk.",
    href: "/manufacturing/fabric-consumption",
    tag: "Cost",
  },
  {
    title: "Roll & Bundle Traceability",
    description: "Roll to lay to bundle to sewing line traceability.",
    href: "/manufacturing/roll-bundle-traceability",
    tag: "Traceability",
  },
];

export default function PilotNavigationHubPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          GPA Pilot Navigation Hub
        </h1>

        <p className="mt-2 text-gray-600">
          BGMEA pilot-ready navigation for executive, cutting, fabric,
          pattern, marker and AI intelligence modules.
        </p>
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Pilot Demo Flow
        </h2>

        <p className="mt-3 text-gray-700">
          Start with the Global Executive Dashboard, then drill down into
          cutting, fabric inspection, shade management, pattern intelligence,
          marker efficiency and AI fabric optimization.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {module.tag}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-blue-700">
              {module.title}
            </h2>

            <p className="mt-3 text-gray-600">
              {module.description}
            </p>

            <p className="mt-5 font-semibold text-blue-600">
              Open Module →
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}