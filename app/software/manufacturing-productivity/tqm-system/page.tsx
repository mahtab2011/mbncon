"use client";

const tqmPrinciples = [
  {
    title: "Customer Focus",
    color: "border-blue-300 bg-blue-100 text-blue-950",
    text: "Quality improvement starts with understanding customer requirements, complaints, expectations, returns, and satisfaction trends.",
  },
  {
    title: "Leadership Commitment",
    color: "border-red-300 bg-red-100 text-red-950",
    text: "Top management must visibly support quality improvement, remove barriers, provide resources, and review progress regularly.",
  },
  {
    title: "Employee Involvement",
    color: "border-emerald-300 bg-emerald-100 text-emerald-950",
    text: "Operators, supervisors, quality teams, maintenance, stores, HR, and managers all participate in identifying and solving quality problems.",
  },
  {
    title: "Process Approach",
    color: "border-violet-300 bg-violet-100 text-violet-950",
    text: "Quality is managed through process control, standard methods, training, measurement, and continuous workflow improvement.",
  },
  {
    title: "Fact-Based Decisions",
    color: "border-yellow-300 bg-yellow-100 text-yellow-950",
    text: "Decisions are based on rejection data, Pareto analysis, root cause analysis, inspection results, customer complaints, and audit findings.",
  },
  {
    title: "Continuous Improvement",
    color: "border-pink-300 bg-pink-100 text-pink-950",
    text: "TQM builds a culture where every team continuously improves quality, productivity, cost, delivery, safety, and morale.",
  },
];

const tqmTeam = [
  "Top Management Sponsor",
  "Production Manager",
  "Quality Manager",
  "HR / Training Representative",
  "Maintenance Representative",
  "Store / Material Representative",
  "Line Supervisors",
  "Senior Operators",
  "Customer / Buyer Feedback Owner",
];

export default function TQMSystemPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-blue-950 via-violet-900 to-red-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            TQM Manufacturing System
          </p>

          <h1 className="max-w-6xl text-5xl font-extrabold leading-tight">
            Total Quality Management for Manufacturing Excellence
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-relaxed text-white/85">
            A practical TQM framework for building quality culture, reducing
            defects, improving customer satisfaction, involving employees,
            strengthening process control, and sustaining continuous
            improvement across manufacturing operations.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-10 shadow-md">
            <h2 className="text-4xl font-extrabold text-blue-950">
              What TQM Means in This System
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              Total Quality Management is a company-wide quality improvement
              approach where management, supervisors, operators, support
              departments, and improvement teams work together to prevent
              defects, improve processes, solve root causes, reduce waste, and
              satisfy customers through continuous improvement.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tqmPrinciples.map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl border p-8 shadow-md ${item.color}`}
              >
                <h3 className="text-2xl font-extrabold">{item.title}</h3>

                <p className="mt-5 text-lg leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-3xl bg-slate-900 p-10 text-white shadow-md">
            <h2 className="text-4xl font-extrabold text-cyan-300">
              TQM Team Formation
            </h2>

            <p className="mt-6 max-w-5xl text-xl leading-relaxed text-slate-300">
              A TQM team should include both decision-makers and people close to
              the work. The purpose is to combine authority, technical
              knowledge, production experience, quality data, training support,
              maintenance insight, and customer feedback.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tqmTeam.map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-6">
                  <h3 className="text-xl font-extrabold text-yellow-300">
                    {item}
                  </h3>

                  <p className="mt-4 text-slate-300">
                    Participates in quality improvement, root-cause review,
                    corrective action, training support, and sustainment.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-white p-10 shadow-md">
            <h2 className="text-4xl font-extrabold text-slate-900">
              Scope of TQM Work
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                "Customer complaints",
                "Rejection reduction",
                "Rework control",
                "Process standardisation",
                "Training effectiveness",
                "Supplier quality",
                "Inspection discipline",
                "Corrective actions",
                "Preventive actions",
                "Quality audits",
                "Employee suggestions",
                "Continuous improvement",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {item}
                  </h3>

                  <p className="mt-4 text-slate-700">
                    Quality improvement scope area monitored by TQM teams,
                    managers, supervisors, and operational improvement groups.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-linear-to-r from-blue-100 via-violet-100 to-emerald-100 p-10 shadow-md">
            <h2 className="text-4xl font-extrabold text-violet-950">
              TQM Problem-Solving Cycle
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Plan",
                  text: "Define the quality problem, collect data, identify root causes, and agree measurable objectives.",
                },
                {
                  title: "Do",
                  text: "Run pilot improvements, train employees, implement corrective actions, and test process changes.",
                },
                {
                  title: "Check",
                  text: "Measure results using rejection data, customer complaints, audit findings, and productivity impact.",
                },
                {
                  title: "Act",
                  text: "Standardise successful improvements, update training, revise procedures, and sustain the gains.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl bg-white p-7 shadow-md">
                  <h3 className="text-3xl font-extrabold text-blue-950">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-lg leading-relaxed text-slate-700">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-orange-100 p-10 shadow-md">
            <h2 className="text-4xl font-extrabold text-orange-950">
              Meeting, Review & Accountability
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-orange-950">
              TQM teams should meet regularly to review rejection trends,
              customer complaints, Pareto priorities, corrective actions,
              training needs, supplier issues, and improvement progress.
              Actions should have owners, deadlines, evidence, follow-up dates,
              and measurable results.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}