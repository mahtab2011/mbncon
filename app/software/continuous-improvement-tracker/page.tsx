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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ContinuousImprovementTrackerPage() {
  const kpiCards = [
    {
      label: "Active Projects",
      value: "4",
      href: "#improvement-project-tracker",
    },
    {
      label: "Kaizen Focus",
      value: "High",
      href: "#executive-improvement-assessment",
    },
    {
      label: "Savings Potential",
      value: "Strong",
      href: "#consultancy-application",
    },
    {
      label: "Management Visibility",
      value: "Live",
      href: "#improvement-project-tracker",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
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

        <section
          id="enterprise-kpis"
          className="mt-10 grid scroll-mt-28 gap-6 md:grid-cols-4"
        >
          {kpiCards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-lime-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-2xl font-bold text-lime-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review improvement intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-improvement-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-lime-400/30 bg-lime-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-lime-300">
            Executive Improvement Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-lime-100">
            Kaizen Visibility Active · Savings Potential Strong
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment recommends tracking ownership, implementation status,
            expected impact, savings potential, operational bottleneck removal,
            and weekly management follow-up for every improvement project.
          </p>
        </section>

        <section
          id="improvement-project-tracker"
          className="mt-10 scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
        >
          <h2 className="text-2xl font-bold">
            Improvement Project Tracker
          </h2>

          <div className="mt-6 space-y-4">
            {improvementProjects.map((project, index) => {
              const sectionId = slugify(project.title);

              return (
                <a
                  key={project.title}
                  id={sectionId}
                  href="#consultancy-application"
                  className="block scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-lime-400/70 hover:shadow-xl"
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

                  <p className="mt-4 text-xs text-slate-500">
                    Click to review consultancy application
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-lime-400/30 bg-lime-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-lime-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps management teams and consultants track whether
            improvement actions are actually implemented and whether they are
            delivering measurable operational and financial benefits.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-lime-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Management should review improvement ownership, implementation
              status, measurable impact, savings evidence, obstacle escalation,
              and weekly progress discipline. Kaizen projects should only be
              considered successful when measurable operational or financial
              benefits are confirmed.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}