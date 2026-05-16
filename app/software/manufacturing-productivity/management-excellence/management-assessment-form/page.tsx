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

export default function ManagementAssessmentFormPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 to-indigo-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-4xl">
          <span className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-300">
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

        {/* SCORE CARDS */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Leadership Score",
              value: "84%",
            },
            {
              title: "Communication",
              value: "79%",
            },
            {
              title: "Coaching",
              value: "88%",
            },
            {
              title: "Problem Solving",
              value: "82%",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-indigo-800 bg-slate-900 p-8 shadow-2xl"
            >
              <p className="text-slate-400">{item.title}</p>

              <h2 className="mt-4 text-5xl font-extrabold text-indigo-300">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div className="mt-20 rounded-3xl border border-indigo-800 bg-slate-900 p-10 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-4xl font-bold">
              Leadership Behaviour Assessment
            </h2>

            <div className="rounded-full bg-emerald-500/20 px-5 py-2 text-sm font-semibold text-emerald-300">
              Assessment Scale: 1–5
            </div>
          </div>

          <form className="mt-12 space-y-14">
            <div className="grid gap-6 md:grid-cols-2">
              <input
                className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white"
                placeholder="Manager / Supervisor Name"
              />

              <input
                className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white"
                placeholder="Department"
              />

              <input
                className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white"
                placeholder="Evaluator Name"
              />

              <input
                type="date"
                className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white"
              />
            </div>

            {assessmentAreas.map((area) => (
              <div
                key={area.title}
                className="rounded-3xl border border-slate-700 bg-slate-950 p-8"
              >
                <h3 className="text-2xl font-bold text-indigo-300">
                  {area.title}
                </h3>

                <div className="mt-8 space-y-6">
                  {area.questions.map((question) => (
                    <div
                      key={question}
                      className="rounded-2xl bg-slate-900 p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <p className="max-w-2xl text-lg text-slate-200">
                          {question}
                        </p>

                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              className="h-12 w-12 rounded-full border border-indigo-700 bg-indigo-950 font-bold text-indigo-200 transition hover:bg-indigo-600"
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* COMMENTS */}
            <div className="rounded-3xl border border-slate-700 bg-slate-950 p-8">
              <h3 className="text-2xl font-bold text-indigo-300">
                Leadership Feedback & Recommendations
              </h3>

              <textarea
                className="mt-8 min-h-40 w-full rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white"
                placeholder="Write strengths, behavioural observations, coaching recommendations, and development opportunities..."
              />
            </div>

            {/* ACTIONS */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-indigo-900/40 p-8">
                <h3 className="text-2xl font-bold">
                  Behavioural Change Focus
                </h3>

                <ul className="mt-6 space-y-4 text-lg leading-8 text-indigo-100">
                  <li>• Respect self-esteem of others</li>
                  <li>• Focus on behaviour, not personality</li>
                  <li>• Reinforce positive actions</li>
                  <li>• Improve active listening</li>
                  <li>• Encourage continuous follow-up</li>
                </ul>
              </div>

              <div className="rounded-3xl bg-emerald-700 p-8">
                <h3 className="text-2xl font-bold">
                  Expected Outcomes
                </h3>

                <ul className="mt-6 space-y-4 text-lg leading-8 text-emerald-100">
                  <li>• Stronger leadership culture</li>
                  <li>• Better team communication</li>
                  <li>• Higher accountability</li>
                  <li>• Improved employee engagement</li>
                  <li>• Better operational discipline</li>
                </ul>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="rounded-full bg-linear-to-r from-indigo-500 to-cyan-500 px-12 py-5 text-xl font-bold text-white shadow-2xl transition hover:scale-105"
              >
                Submit Leadership Assessment
              </button>

              {submitted ? (
                <p className="mt-6 text-lg text-emerald-300">
                  Assessment submitted successfully.
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}