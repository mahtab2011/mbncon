"use client";

import Link from "next/link";

const improvementProjects = [
  {
    title: "Reduce Rework in Sewing Line",
    owner: "Production Supervisor",
    status: "In Progress",
    impact: "Expected 18% defect reduction",
  },
  {
    title: "Improve Material Flow",
    owner: "Warehouse Team",
    status: "Planned",
    impact: "Lower waiting and transit delays",
  },
  {
    title: "Machine Downtime Reduction",
    owner: "Maintenance Manager",
    status: "Active",
    impact: "Improve production uptime",
  },
  {
    title: "Packing Process Optimisation",
    owner: "Operations Team",
    status: "Completed",
    impact: "Faster shipment preparation",
  },
];

export default function ContinuousImprovementTrackerPage() {
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-lime-300">
            MBNCON Kaizen Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Continuous Improvement Tracker
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Track Kaizen actions, improvement projects, productivity gains,
            savings, implementation progress, and measurable operational
            improvements across the factory.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            ["Active Projects", "4"],
            ["Kaizen Focus", "High"],
            ["Savings Potential", "Strong"],
            ["Management Visibility", "Live"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-bold text-lime-300">
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold">
            Improvement Project Tracker
          </h2>

          <div className="mt-6 space-y-4">
            {improvementProjects.map((project, index) => (
              <div
                key={project.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 font-bold text-slate-950">
                        {index + 1}
                      </span>

                      <h3 className="text-xl font-bold text-white">
                        {project.title}
                      </h3>
                    </div>

                    <p className="mt-3 text-slate-300">
                      Owner: {project.owner}
                    </p>

                    <p className="mt-1 text-slate-400">
                      {project.impact}
                    </p>
                  </div>

                  <div className="rounded-full border border-lime-400/40 bg-lime-400/10 px-5 py-2 text-sm font-semibold text-lime-200">
                    {project.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-lime-400/30 bg-lime-400/10 p-8">
          <h2 className="text-2xl font-bold text-lime-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps management teams and consultants track whether
            improvement actions are actually implemented and whether they are
            delivering measurable operational and financial benefits.
          </p>
        </section>
      </section>
    </main>
  );
}