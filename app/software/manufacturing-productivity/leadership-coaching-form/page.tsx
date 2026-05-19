"use client";

import { useState } from "react";

type CoachingForm = {
  leaderName: string;
  department: string;
  coachingDate: string;
  situation: string;
  balconyObservation: string;
  adaptiveChallenge: string;
  technicalProblem: string;
  stakeholders: string;
  conflictPoints: string;
  trustActions: string;
  authorityApproach: string;
  questionsAsked: string;
  employeeResponse: string;
  learningPoint: string;
  nextAction: string;
  owner: string;
  followUpDate: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function LeadershipCoachingFormPage() {
  const [form, setForm] = useState<CoachingForm>({
    leaderName: "",
    department: "",
    coachingDate: "",
    situation: "",
    balconyObservation: "",
    adaptiveChallenge: "",
    technicalProblem: "",
    stakeholders: "",
    conflictPoints: "",
    trustActions: "",
    authorityApproach: "",
    questionsAsked: "",
    employeeResponse: "",
    learningPoint: "",
    nextAction: "",
    owner: "",
    followUpDate: "",
  });

  const sections = [
    {
      title: "Get on the Balcony",
      text:
        "Step back from the pressure of daily operations and observe the pattern, behaviour, resistance, gaps, and system problem.",
    },
    {
      title: "Identify the Work to Be Done",
      text:
        "Separate technical problems from adaptive challenges so leaders do not solve the wrong problem.",
    },
    {
      title: "Lead With and Beyond Authority",
      text:
        "Use role authority responsibly while building ownership, trust, participation, and shared responsibility.",
    },
    {
      title: "Orchestrate Conflict",
      text:
        "Surface real issues respectfully, manage tension, and convert conflict into learning and improvement.",
    },
  ];

  const updateField = (field: keyof CoachingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Adaptive Leadership Coaching
          </p>

          <h1 className="max-w-6xl text-5xl font-extrabold leading-tight">
            Leadership Coaching Form for Factory Managers, Supervisors and Team Leaders
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-relaxed text-white/85">
            This form helps leaders observe from the balcony, identify the real
            adaptive work, build trust, ask better coaching questions, and turn
            operational tension into learning, ownership, and measurable improvement.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {sections.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <h2 className="text-xl font-extrabold text-blue-950">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-slate-700">{item.text}</p>
                </a>
              );
            })}
          </div>

          <section className="mt-12 rounded-3xl bg-white p-8 shadow-md">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Leadership Coaching Entry Form
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["leaderName", "Leader / Coach Name"],
                ["department", "Department / Line"],
                ["coachingDate", "Coaching Date"],
                ["owner", "Action Owner"],
                ["followUpDate", "Follow-up Date"],
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="font-bold text-slate-700">{label}</span>
                  <input
                    type={key.toLowerCase().includes("date") ? "date" : "text"}
                    value={form[key as keyof CoachingForm]}
                    onChange={(e) =>
                      updateField(key as keyof CoachingForm, e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </label>
              ))}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[
                ["situation", "Current Operational Situation"],
                ["balconyObservation", "Balcony Observation"],
                ["adaptiveChallenge", "Adaptive Challenge"],
                ["technicalProblem", "Technical Problem"],
                ["stakeholders", "People / Stakeholders Involved"],
                ["conflictPoints", "Conflict, Tension or Avoided Issue"],
                ["trustActions", "Trust-Building Action"],
                ["authorityApproach", "How Leadership Authority Was Used"],
                ["questionsAsked", "Coaching Questions Asked"],
                ["employeeResponse", "Employee / Team Response"],
                ["learningPoint", "Leadership Learning Point"],
                ["nextAction", "Next Improvement Action"],
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="font-bold text-slate-700">{label}</span>
                  <textarea
                    value={form[key as keyof CoachingForm]}
                    onChange={(e) =>
                      updateField(key as keyof CoachingForm, e.target.value)
                    }
                    className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </label>
              ))}
            </div>

            <button className="mt-8 rounded-2xl bg-blue-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-blue-800 hover:shadow-xl">
              Save Leadership Coaching Record
            </button>
          </section>

          <section className="mt-12 rounded-3xl bg-slate-900 p-8 text-white shadow-md">
            <h2 className="text-3xl font-extrabold text-cyan-300">
              Coaching Review Questions
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                "What pattern did I observe from the balcony?",
                "Is this a technical problem or adaptive challenge?",
                "Who must take ownership of the work?",
                "What uncomfortable issue needs respectful discussion?",
                "How did I build trust before giving direction?",
                "What behaviour must change to sustain improvement?",
                "What will I follow up next?",
                "What did I learn about my own leadership?",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-5 transition duration-300 hover:bg-white/20"
                >
                  <p className="font-bold leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}