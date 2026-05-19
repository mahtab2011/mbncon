"use client";

import { useState } from "react";

const assessmentAreas = [
  {
    title: "Leadership & Communication",
    questions: [
      "Listens actively to team members",
      "Communicates expectations clearly",
      "Provides constructive feedback",
      "Maintains respectful communication",
    ],
  },
  {
    title: "Operational Discipline",
    questions: [
      "Follows standard procedures",
      "Responds quickly to operational problems",
      "Supports workplace organization",
      "Maintains accountability",
    ],
  },
  {
    title: "Coaching & Team Development",
    questions: [
      "Encourages employee growth",
      "Builds confidence in team members",
      "Supports learning culture",
      "Recognizes good performance",
    ],
  },
  {
    title: "Problem Solving & Improvement",
    questions: [
      "Identifies root causes effectively",
      "Encourages continuous improvement",
      "Uses data for decisions",
      "Supports teamwork in problem solving",
    ],
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

export default function ManagementAssessmentFormPage() {
  const [submitted, setSubmitted] = useState(false);

  const scoreCards = [
    {
      title: "Leadership Score",
      value: "84%",
      color: "bg-indigo-100 text-indigo-950",
    },
    {
      title: "Communication",
      value: "79%",
      color: "bg-cyan-100 text-cyan-950",
    },
    {
      title: "Coaching",
      value: "88%",
      color: "bg-emerald-100 text-emerald-950",
    },
    {
      title: "Problem Solving",
      value: "82%",
      color: "bg-violet-100 text-violet-950",
    },
  ];

  const behaviourFocus = [
    "Respect self-esteem of others",
    "Focus on behaviour, not personality",
    "Reinforce positive actions",
    "Improve active listening",
    "Encourage continuous follow-up",
  ];

  const expectedOutcomes = [
    "Stronger leadership culture",
    "Better team communication",
    "Higher accountability",
    "Improved employee engagement",
    "Better operational discipline",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              Management Excellence • Leadership Assessment
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              Management Assessment & Leadership Evaluation
            </h1>

            <p className="mt-8 text-xl leading-9 text-slate-300">
              Evaluate leadership behaviour, operational discipline,
              communication quality, coaching effectiveness, accountability,
              and continuous improvement culture.
            </p>
          </div>
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {scoreCards.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className={`scroll-mt-28 rounded-3xl p-8 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${item.color}`}
                >
                  <p className="font-semibold opacity-80">
                    {item.title}
                  </p>

                  <h2
                    id={id}
                    className="mt-4 text-5xl font-extrabold"
                  >
                    {item.value}
                  </h2>
                </a>
              );
            })}
          </div>

          {/* FORM */}
          <section className="mt-20 rounded-3xl bg-white p-10 shadow-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-4xl font-bold text-slate-900">
                Leadership Behaviour Assessment
              </h2>

              <div className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
                Assessment Scale: 1–5
              </div>
            </div>

            <form className="mt-12 space-y-14">
              {/* BASIC INFO */}
              <div className="grid gap-6 md:grid-cols-2">
                <input
                  className="rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-indigo-600 focus:bg-white"
                  placeholder="Manager / Supervisor Name"
                />

                <input
                  className="rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-indigo-600 focus:bg-white"
                  placeholder="Department"
                />

                <input
                  className="rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-indigo-600 focus:bg-white"
                  placeholder="Evaluator Name"
                />

                <input
                  type="date"
                  className="rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-indigo-600 focus:bg-white"
                />
              </div>

              {/* ASSESSMENT AREAS */}
              {assessmentAreas.map((area) => {
                const areaId = slugify(area.title);

                return (
                  <section
                    key={area.title}
                    id={areaId}
                    className="scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-50 p-8 transition duration-300 hover:shadow-xl"
                  >
                    <h3 className="text-2xl font-bold text-indigo-700">
                      {area.title}
                    </h3>

                    <div className="mt-8 space-y-6">
                      {area.questions.map((question) => {
                        const questionId = slugify(question);

                        return (
                          <div
                            key={question}
                            id={questionId}
                            className="scroll-mt-28 rounded-2xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg"
                          >
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                              <p className="max-w-2xl text-lg text-slate-700">
                                {question}
                              </p>

                              <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((score) => (
                                  <button
                                    key={score}
                                    type="button"
                                    className="h-12 w-12 rounded-full border border-indigo-300 bg-indigo-50 font-bold text-indigo-700 transition duration-300 hover:scale-105 hover:bg-indigo-600 hover:text-white"
                                  >
                                    {score}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              {/* COMMENTS */}
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                <h3 className="text-2xl font-bold text-indigo-700">
                  Leadership Feedback & Recommendations
                </h3>

                <textarea
                  className="mt-8 min-h-40 w-full rounded-2xl border border-slate-300 bg-white p-6 outline-none transition focus:border-indigo-600"
                  placeholder="Write strengths, behavioural observations, coaching recommendations, and development opportunities..."
                />
              </section>

              {/* ACTION AREAS */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* BEHAVIOUR */}
                <section className="rounded-3xl bg-indigo-100 p-8 shadow-md transition duration-300 hover:shadow-xl">
                  <h3 className="text-2xl font-bold text-indigo-950">
                    Behavioural Change Focus
                  </h3>

                  <ul className="mt-6 space-y-4 text-lg leading-8 text-indigo-900">
                    {behaviourFocus.map((item) => {
                      const id = slugify(item);

                      return (
                        <li
                          key={item}
                          id={id}
                          className="scroll-mt-28 rounded-xl bg-white/70 p-4 transition duration-300 hover:bg-white"
                        >
                          • {item}
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* OUTCOMES */}
                <section className="rounded-3xl bg-emerald-700 p-8 text-white shadow-md transition duration-300 hover:shadow-xl">
                  <h3 className="text-2xl font-bold">
                    Expected Outcomes
                  </h3>

                  <ul className="mt-6 space-y-4 text-lg leading-8 text-emerald-100">
                    {expectedOutcomes.map((item) => {
                      const id = slugify(item);

                      return (
                        <li
                          key={item}
                          id={id}
                          className="scroll-mt-28 rounded-xl bg-white/10 p-4 transition duration-300 hover:bg-white/20"
                        >
                          • {item}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </div>

              {/* SUBMIT */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="rounded-full bg-indigo-700 px-12 py-5 text-xl font-bold text-white shadow-2xl transition duration-300 hover:scale-105 hover:bg-indigo-800 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                >
                  Submit Leadership Assessment
                </button>

                {submitted ? (
                  <p className="mt-6 text-lg font-semibold text-emerald-600">
                    Assessment submitted successfully.
                  </p>
                ) : null}
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}