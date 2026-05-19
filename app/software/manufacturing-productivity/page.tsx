"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ManufacturingProductivityPage() {
  const diagnosisItems = [
    "Problem Definition & KPI Baseline",
    "Historical Data Analysis",
    "Operational Workflow Mapping",
    "Value Stream Mapping",
    "Activity Sampling",
    "Pareto Analysis",
    "Fishbone Root Cause Analysis",
    "Bottleneck Identification",
    "Quality Rejection Analysis",
    "Employee & Supervisor Interviews",
    "Productivity Measurement",
    "Operational Observation",
  ];

  const toolkitItems = [
    {
      title: "Activity Sampling",
      color: "bg-cyan-500",
    },
    {
      title: "Value Stream Mapping",
      color: "bg-blue-500",
    },
    {
      title: "Bottleneck Analysis",
      color: "bg-red-500",
    },
    {
      title: "Workflow Visibility",
      color: "bg-violet-500",
    },
    {
      title: "Downtime Tracking",
      color: "bg-orange-500",
    },
    {
      title: "Rejection Analysis",
      color: "bg-pink-500",
    },
    {
      title: "Wastage Measurement",
      color: "bg-emerald-500",
    },
    {
      title: "Operational KPI Dashboard",
      color: "bg-yellow-500",
    },
  ];

  const modules = [
    {
      title: "Production KPI Dashboard",
      color: "bg-blue-100 border-blue-300 text-blue-950",
    },
    {
      title: "Operator Productivity Tracking",
      color: "bg-red-100 border-red-300 text-red-950",
    },
    {
      title: "Quality Rejection Monitoring",
      color: "bg-pink-100 border-pink-300 text-pink-950",
    },
    {
      title: "Machine Downtime Analysis",
      color: "bg-orange-100 border-orange-300 text-orange-950",
    },
    {
      title: "Bottleneck Management",
      color: "bg-violet-100 border-violet-300 text-violet-950",
    },
    {
      title: "Kaizen & Suggestion System",
      color: "bg-emerald-100 border-emerald-300 text-emerald-950",
    },
    {
      title: "Skill Matrix & Training Tracker",
      color: "bg-cyan-100 border-cyan-300 text-cyan-950",
    },
    {
      title: "Operational Audit System",
      color: "bg-yellow-100 border-yellow-300 text-yellow-950",
    },
    {
      title: "Continuous Improvement Tracker",
      color: "bg-indigo-100 border-indigo-300 text-indigo-950",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-yellow-300">
            Manufacturing Productivity System
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Practical Operational Excellence &
            Productivity Transformation
          </h1>

          <p className="mt-8 max-w-4xl text-xl leading-relaxed text-white/90">
            A practical business transformation framework focused on
            measurable productivity improvement, operational discipline,
            employee engagement, bottleneck reduction, workflow visibility,
            waste reduction, and sustainable continuous improvement.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/contact"
              className="rounded-xl bg-white px-8 py-4 font-bold text-blue-900 shadow-lg transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              Request Consultation
            </a>

            <a
              href="#framework"
              className="rounded-xl border border-white px-8 py-4 font-bold text-white transition duration-300 hover:bg-white hover:text-slate-900"
            >
              Explore Framework
            </a>
          </div>
        </div>
      </section>

      {/* OPERATIONAL DIAGNOSIS */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Operational Diagnosis Framework
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Identify The Right Problems Before Solving Them
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-slate-700">
              Sustainable productivity improvement begins with identifying
              operational bottlenecks, hidden waste, workflow breakdowns,
              quality losses, training gaps, communication barriers, and
              process inefficiencies through structured operational analysis.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {diagnosisItems.map((item) => {
              const id = slugify(item);

              return (
                <a
                  key={item}
                  href={`#${id}`}
                  className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <h3
                    id={id}
                    className="text-xl font-bold text-slate-900"
                  >
                    {item}
                  </h3>

                  <p className="mt-4 text-slate-700">
                    Structured operational analysis designed to identify
                    measurable improvement opportunities and practical
                    transformation priorities.
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section
        id="framework"
        className="scroll-mt-28 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-extrabold text-violet-900">
            People-Centred Productivity Transformation
          </h2>

          <p className="mt-8 max-w-5xl text-xl leading-relaxed text-violet-900">
            Sustainable productivity improvement begins with leadership
            commitment, employee involvement, operational visibility,
            measurable objectives, and continuous improvement culture.
            This system combines operational excellence methodology with
            practical productivity software concepts for manufacturing
            environments.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Leadership Commitment",
                color: "border-red-200 bg-red-100 text-red-950",
                text:
                  "Productivity improvement begins with top management commitment, operational discipline, measurable objectives, and leadership mobilisation across departments.",
              },
              {
                title: "Employee Involvement",
                color: "border-blue-200 bg-blue-100 text-blue-950",
                text:
                  "Employees participate through teamwork, empowerment, operational suggestions, small improvements, ownership, accountability, and continuous engagement.",
              },
              {
                title: "Continuous Improvement",
                color: "border-emerald-200 bg-emerald-100 text-emerald-950",
                text:
                  "Improvement is sustained through measurable controls, operational reviews, KPI visibility, standardisation, training, and continuous improvement culture.",
              },
            ].map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className={`scroll-mt-28 rounded-3xl border p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.color}`}
                >
                  <h3
                    id={id}
                    className="text-2xl font-extrabold"
                  >
                    {item.title}
                  </h3>

                  <p className="mt-5 text-lg leading-relaxed">
                    {item.text}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* TOOLKIT */}
      <section className="bg-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Operational Intelligence Toolkit
            </p>

            <h2 className="text-4xl font-extrabold">
              Practical Productivity Analysis & Decision Support
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-300">
              The system combines operational analysis, productivity
              engineering, workflow visibility, practical analytics,
              and management decision support to identify measurable
              improvement opportunities.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {toolkitItems.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className="scroll-mt-28 rounded-3xl bg-slate-800 p-7 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-slate-700 hover:shadow-xl"
                >
                  <div
                    className={`mb-5 h-4 w-24 rounded-full ${item.color}`}
                  />

                  <h3
                    id={id}
                    className="text-2xl font-extrabold"
                  >
                    {item.title}
                  </h3>

                  <p className="mt-5 text-lg leading-relaxed text-slate-300">
                    Structured operational intelligence tools designed
                    to identify measurable productivity opportunities,
                    hidden operational losses, and workflow inefficiencies.
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Manufacturing Modules
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Practical Productivity Software Components
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              The Manufacturing Productivity System can be developed using
              practical operational modules designed to support workflow
              visibility, productivity analysis, quality improvement,
              operational control, coaching, and continuous improvement.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className={`scroll-mt-28 rounded-3xl border p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.color}`}
                >
                  <h3
                    id={id}
                    className="text-2xl font-extrabold"
                  >
                    {item.title}
                  </h3>

                  <p className="mt-5 text-lg leading-relaxed">
                    Practical operational software support designed for
                    measurable productivity improvement, workflow visibility,
                    accountability, training support, and continuous
                    operational excellence.
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Productivity Transformation Partnership
          </p>

          <h2 className="text-5xl font-extrabold leading-tight">
            Start Building A More Productive Organisation
          </h2>

          <p className="mx-auto mt-8 max-w-4xl text-2xl leading-relaxed text-white/90">
            Explore practical operational excellence, measurable productivity
            improvement, workflow visibility, employee engagement,
            AI-guided operational support, and sustainable continuous
            improvement systems tailored to your organisation.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <a
              href="/contact"
              className="rounded-2xl bg-white px-8 py-5 text-lg font-extrabold text-blue-900 shadow-xl transition duration-300 hover:scale-105"
            >
              Request Consultation
            </a>

            <a
              href="/services"
              className="rounded-2xl border-2 border-white px-8 py-5 text-lg font-extrabold text-white transition duration-300 hover:bg-white hover:text-blue-900"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}