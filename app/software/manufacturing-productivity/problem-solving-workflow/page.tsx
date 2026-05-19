"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProblemSolvingWorkflowPage() {
  const workflow = [
    {
      title: "Main Problem",
      text: "Low production efficiency identified by management KPI review.",
      color: "bg-red-100 border-red-300 text-red-950",
    },
    {
      title: "Secondary Problems",
      text: "Machine downtime, operator skill gaps, material waiting, and workflow imbalance.",
      color: "bg-orange-100 border-orange-300 text-orange-950",
    },
    {
      title: "Tertiary Problems",
      text: "Weak maintenance planning, inadequate coaching, communication gaps, and unclear accountability.",
      color: "bg-blue-100 border-blue-300 text-blue-950",
    },
    {
      title: "Brainstorming",
      text: "Cross-functional teams generate practical improvement ideas and operational suggestions.",
      color: "bg-violet-100 border-violet-300 text-violet-950",
    },
    {
      title: "Top 3 Solutions",
      text: "Priority actions selected based on practicality, measurable impact, and operational feasibility.",
      color: "bg-emerald-100 border-emerald-300 text-emerald-950",
    },
    {
      title: "Pilot Improvement",
      text: "Selected solutions are tested in controlled operational pilot environments.",
      color: "bg-cyan-100 border-cyan-300 text-cyan-950",
    },
    {
      title: "Measurement & Review",
      text: "Results are measured using KPI tracking, rejection analysis, productivity visibility, and workflow observation.",
      color: "bg-yellow-100 border-yellow-300 text-yellow-950",
    },
    {
      title: "Control & Sustain",
      text: "Successful improvements are standardised, monitored, coached, and integrated into continuous improvement culture.",
      color: "bg-pink-100 border-pink-300 text-pink-950",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Problem-Solving Workflow Demo
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Structured Root-Cause & Continuous Improvement Workflow
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            A practical operational framework for expanding problems,
            identifying root causes, generating solutions, testing
            improvements, and sustaining measurable productivity gains.
          </p>
        </div>
      </section>

      {/* FLOW */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-8">
            {workflow.map((item, index) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className={`scroll-mt-28 block rounded-3xl border p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.color}`}
                >
                  <div
                    id={id}
                    className="flex flex-col gap-6 md:flex-row md:items-start"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-extrabold shadow-md">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h2 className="text-3xl font-extrabold">
                        {item.title}
                      </h2>

                      <p className="mt-5 text-xl leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* GROW MODEL */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Coaching & Leadership Support
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              GROW Coaching Integration
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              Managers and supervisors can use structured coaching
              conversations to guide improvement teams through
              operational challenges and measurable action planning.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                letter: "G",
                title: "Goal",
                text: "Define measurable productivity improvement objectives.",
                color: "bg-blue-100 border-blue-300 text-blue-950",
              },
              {
                letter: "R",
                title: "Reality",
                text: "Understand current workflow conditions and operational constraints.",
                color: "bg-red-100 border-red-300 text-red-950",
              },
              {
                letter: "O",
                title: "Options",
                text: "Generate practical improvement possibilities through brainstorming.",
                color: "bg-emerald-100 border-emerald-300 text-emerald-950",
              },
              {
                letter: "W",
                title: "Way Forward",
                text: "Select actions, responsibilities, timelines, and measurable follow-up.",
                color: "bg-violet-100 border-violet-300 text-violet-950",
              },
            ].map((item) => {
              const id = slugify(item.title);

              return (
                <section
                  key={item.letter}
                  id={id}
                  className={`scroll-mt-28 rounded-3xl border p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.color}`}
                >
                  <div className="text-6xl font-extrabold opacity-80">
                    {item.letter}
                  </div>

                  <h3 className="mt-5 text-3xl font-extrabold">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-lg leading-relaxed">
                    {item.text}
                  </p>

                  <div className="mt-6 rounded-2xl bg-white/60 p-4">
                    <p className="text-sm font-bold uppercase tracking-wide">
                      Standard Procedures
                    </p>

                    <ul className="mt-3 space-y-2 text-base leading-relaxed">
                      {item.letter === "G" && (
                        <>
                          <li>• Define measurable objectives</li>
                          <li>• Identify stakeholders</li>
                          <li>• Clarify operational expectations</li>
                          <li>• Establish KPI baseline</li>
                        </>
                      )}

                      {item.letter === "R" && (
                        <>
                          <li>• Collect operational data</li>
                          <li>• Analyse bottlenecks</li>
                          <li>• Observe workflow conditions</li>
                          <li>• Identify root causes</li>
                        </>
                      )}

                      {item.letter === "O" && (
                        <>
                          <li>• Conduct brainstorming sessions</li>
                          <li>• Expand secondary problems</li>
                          <li>• Identify tertiary problems</li>
                          <li>• Generate practical solutions</li>
                        </>
                      )}

                      {item.letter === "W" && (
                        <>
                          <li>• Select top 3 solutions</li>
                          <li>• Launch pilot projects</li>
                          <li>• Measure operational results</li>
                          <li>• Standardise successful improvements</li>
                        </>
                      )}
                    </ul>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* IMPLEMENTATION GOVERNANCE */}
      <section className="bg-slate-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Implementation Governance
            </p>

            <h2 className="text-4xl font-extrabold">
              Practical Improvement Management Methodology
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-300">
              Sustainable productivity transformation requires structured
              implementation discipline, leadership visibility, employee
              involvement, realistic planning, operational flexibility,
              and continuous improvement culture.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Bottleneck Identification",
                color: "text-cyan-300",
                text:
                  "Identify operational bottlenecks through production analysis, rejection reports, customer complaints, downtime tracking, workflow observation, activity sampling, value stream mapping, and capacity utilisation review.",
              },
              {
                title: "Employee Involvement",
                color: "text-emerald-300",
                text:
                  "Employees participate through brainstorming, teamwork, operational feedback, improvement suggestions, small-group problem solving, and ownership-based engagement.",
              },
              {
                title: "Resistance Management",
                color: "text-yellow-300",
                text:
                  "Resistance is managed through communication, transparency, training, leadership support, realistic targets, and showing employees how operational improvement strengthens long-term organisational stability and career growth.",
              },
              {
                title: "Goal Setting & Ownership",
                color: "text-pink-300",
                text:
                  "Improvement goals should be measurable, achievable, time-bound, visible, and jointly owned by management and operational teams.",
              },
              {
                title: "Failure & Contingency Planning",
                color: "text-violet-300",
                text:
                  "If targets are not achieved, organisations should reassess workflow assumptions, revise budgets, reset milestones, strengthen training, and deploy contingency plans rather than abandoning improvement initiatives.",
              },
              {
                title: "Continuous Improvement Culture",
                color: "text-rose-300",
                text:
                  "Sustainable productivity requires ongoing measurement, leadership commitment, regular review meetings, coaching, performance visibility, and continuous small-step operational improvement.",
              },
            ].map((item) => {
              const id = slugify(item.title);

              return (
                <section
                  key={item.title}
                  id={id}
                  className="scroll-mt-28 rounded-2xl bg-slate-800 p-6 transition duration-300 hover:-translate-y-1 hover:bg-slate-700 hover:shadow-xl"
                >
                  <h3 className={`text-2xl font-bold ${item.color}`}>
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-relaxed text-slate-300">
                    {item.text}
                  </p>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}