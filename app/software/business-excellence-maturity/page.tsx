"use client";

import Link from "next/link";

const maturityAreas = [
  {
    area: "Leadership & Strategy",
    level: "Developing",
  },
  {
    area: "Operational Discipline",
    level: "Moderate",
  },
  {
    area: "Lean Manufacturing",
    level: "Emerging",
  },
  {
    area: "Quality Management",
    level: "Stable",
  },
  {
    area: "Digital Readiness",
    level: "Developing",
  },
  {
    area: "People Development",
    level: "Moderate",
  },
  {
    area: "Continuous Improvement",
    level: "Growing",
  },
  {
    area: "Customer Focus",
    level: "Stable",
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

function getRecommendation(level: string) {
  if (level === "Emerging") {
    return "Build basic process discipline, standard work, and visible improvement routines.";
  }

  if (level === "Developing") {
    return "Strengthen leadership ownership, measurement discipline, and repeatable operating systems.";
  }

  if (level === "Moderate") {
    return "Move from functional control to cross-functional improvement and weekly performance review.";
  }

  if (level === "Growing") {
    return "Scale continuous improvement ownership with Kaizen tracking and management follow-up.";
  }

  return "Maintain maturity through audit discipline, digital tracking, and leadership review.";
}

export default function BusinessExcellenceMaturityPage() {
  const kpiCards = [
    {
      label: "Overall Maturity",
      value: "Developing",
      href: "#executive-maturity-assessment",
    },
    {
      label: "Improvement Potential",
      value: "High",
      href: "#maturity-assessment-areas",
    },
    {
      label: "Operational Stability",
      value: "Moderate",
      href: "#operational-risk-assessment",
    },
    {
      label: "Transformation Readiness",
      value: "Growing",
      href: "#consultancy-application",
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-300">
            MBNCON Business Excellence Intelligence
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Business Excellence Maturity
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Evaluate how mature an organisation is across leadership,
            operational excellence, Lean systems, quality management, digital
            readiness, people development, and continuous improvement.
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
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-teal-400/70 hover:shadow-xl"
            >
              <p className="text-sm text-slate-400">{card.label}</p>

              <p className="mt-3 text-2xl font-bold text-teal-300">
                {card.value}
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Click to review maturity intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-maturity-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-teal-400/30 bg-teal-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-teal-300">
            Executive Maturity Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold text-teal-100">
            Developing Maturity · High Improvement Potential
          </h2>

          <p className="mt-4 text-slate-200">
            AI assessment indicates the organisation has a strong opportunity to
            improve leadership alignment, process discipline, Lean adoption,
            digital visibility, people capability, and continuous improvement
            culture.
          </p>
        </section>

        <section
          id="operational-risk-assessment"
          className="mt-10 scroll-mt-28 rounded-3xl border border-orange-400/30 bg-orange-400/10 p-8"
        >
          <p className="text-sm uppercase tracking-widest text-orange-300">
            Operational Risk Assessment
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Moderate Stability Requires Stronger Discipline
          </h2>

          <p className="mt-4 text-slate-200">
            The organisation should prioritise standard work, daily management,
            supervisor capability, measurable improvement ownership, and digital
            tracking to reduce inconsistency and hidden operational losses.
          </p>
        </section>

        <section
          id="maturity-assessment-areas"
          className="mt-10 scroll-mt-28 rounded-3xl border border-white/10 bg-slate-900 p-8"
        >
          <h2 className="text-2xl font-bold">
            Maturity Assessment Areas
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {maturityAreas.map((item, index) => {
              const sectionId = slugify(item.area);

              return (
                <a
                  key={item.area}
                  id={sectionId}
                  href="#consultancy-application"
                  className="scroll-mt-28 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-teal-400/70 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-400 font-bold text-slate-950">
                      {index + 1}
                    </span>

                    <div>
                      <p className="font-semibold text-white">
                        {item.area}
                      </p>

                      <p className="text-sm text-slate-400">
                        {getRecommendation(item.level)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-full border border-teal-400/40 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200">
                    {item.level}
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        <section
          id="consultancy-application"
          className="mt-10 scroll-mt-28 rounded-3xl border border-teal-400/30 bg-teal-400/10 p-8"
        >
          <h2 className="text-2xl font-bold text-teal-200">
            Consultancy Application
          </h2>

          <p className="mt-4 text-slate-200">
            This module helps MBNCON determine how advanced an organisation is
            and where future investment, leadership focus, process discipline,
            digital systems, and operational improvement should be prioritised.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
            <p className="text-sm uppercase tracking-widest text-teal-300">
              AI Recommendation
            </p>

            <p className="mt-3 text-slate-200">
              Begin with leadership alignment, daily visual management,
              operational discipline, Lean basics, quality ownership, digital
              readiness, and Kaizen routines. This creates a practical maturity
              roadmap for measurable transformation.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}