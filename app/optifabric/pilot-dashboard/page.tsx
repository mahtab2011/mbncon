"use client";

import Link from "next/link";

const completedModules = [
  {
    title: "Live Pattern Tracing",
    href: "/optifabric/mini-pilot/live-tracing",
    description: "Trace garment pattern boundaries from uploaded images.",
  },
  {
    title: "Polygon Nesting",
    href: "/optifabric/mini-pilot/polygon-nesting",
    description: "Estimate marker layout and fabric utilization.",
  },
  {
    title: "Vision AI Inspection",
    href: "/optifabric/pattern-analysis",
    description: "Inspect uploaded patterns using AI rules.",
  },
  {
    title: "Stripe & Check Matching",
    href: "/optifabric/stripe-matching",
    description: "Evaluate stripe alignment before cutting.",
  },
  {
    title: "Pattern Area Calculator",
    href: "/optifabric/pattern-area",
    description: "Calculate pattern area from traced polygons.",
  },
];

const comingSoon = [
  "Fabric Repeat Detection",
  "Grain Line Detection",
  "Notch Detection",
  "Scale Detection",
  "Fabric Consumption Advisor",
  "Pattern Piece Relationship",
  "Size & Assortment Planner",
  "AI Marker Optimization",
];

export default function PilotDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-blue-900 p-8 text-white">

          <div className="text-sm uppercase tracking-widest text-cyan-300">
            OptiFabric AI RC1
          </div>

          <h1 className="mt-3 text-5xl font-bold">
            AI Digital Cutting Master
          </h1>

          <p className="mt-5 max-w-3xl text-xl text-slate-200">
            Commercial pilot for garment factories.
            Every module exists to reduce fabric consumption,
            improve engineering decisions and shorten cutting-room preparation time.
          </p>

        </div>

        <div className="mt-10">

          <h2 className="text-3xl font-bold">
            Available Engineering Modules
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {completedModules.map((module) => (

              <div
                key={module.title}
                className="rounded-2xl bg-white p-6 shadow"
              >

                <div className="flex items-center justify-between">

                  <h3 className="text-xl font-semibold">
                    {module.title}
                  </h3>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    READY
                  </span>

                </div>

                <p className="mt-4 text-slate-600">
                  {module.description}
                </p>

                <Link
                  href={module.href}
                  className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Open Module
                </Link>

              </div>

            ))}

          </div>

        </div>

        <div className="mt-14">

          <h2 className="text-3xl font-bold">
            Next AI Engineering Modules
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {comingSoon.map((item) => (

              <div
                key={item}
                className="rounded-xl border bg-white p-5"
              >

                <div className="flex justify-between">

                  <span className="font-semibold">
                    {item}
                  </span>

                  <span className="text-amber-600 font-bold">
                    RC1
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="mt-14 rounded-2xl bg-blue-50 p-8">

          <h2 className="text-2xl font-bold">
            Why does AI ask these questions?
          </h2>

          <p className="mt-4 text-lg text-slate-700">

            Every engineering question inside OptiFabric AI has a business purpose.

            The objective is never to collect unnecessary information.

            Each input improves one or more of these:

          </p>

          <ul className="mt-6 space-y-3 text-lg">

            <li>✔ Improve marker efficiency</li>

            <li>✔ Reduce fabric waste</li>

            <li>✔ Improve cutting accuracy</li>

            <li>✔ Reduce recutting</li>

            <li>✔ Reduce engineering time</li>

            <li>✔ Improve buyer quality compliance</li>

            <li>✔ Increase factory profitability</li>

          </ul>

        </div>

      </div>
    </main>
  );
}