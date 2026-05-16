"use client";

import { useMemo, useState } from "react";

type StaffRow = {
  name: string;
  department: string;
  operation: string;
  skill: number;
  trainability: number;
  quality: number;
  attendance: number;
};

export default function StaffSkillMatrixPage() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [operation, setOperation] = useState("");
  const [skill, setSkill] = useState("");
  const [trainability, setTrainability] = useState("");
  const [quality, setQuality] = useState("");
  const [attendance, setAttendance] = useState("");

  const [rows, setRows] = useState<StaffRow[]>([
    {
      name: "Rahim",
      department: "Stitching",
      operation: "Upper Stitching",
      skill: 82,
      trainability: 91,
      quality: 88,
      attendance: 96,
    },
    {
      name: "Karim",
      department: "Cutting",
      operation: "Leather Cutting",
      skill: 72,
      trainability: 65,
      quality: 78,
      attendance: 84,
    },
    {
      name: "Salma",
      department: "Finishing",
      operation: "Final Inspection",
      skill: 93,
      trainability: 89,
      quality: 95,
      attendance: 98,
    },
  ]);

  const analysedRows = useMemo(() => {
    return rows.map((row) => {
      const overall =
        (row.skill +
          row.trainability +
          row.quality +
          row.attendance) /
        4;

      let recommendation = "Monitor Development";
      let category = "Developing";

      if (overall >= 90) {
        recommendation =
          "Leadership / Trainer Potential";
        category = "High Potential";
      } else if (overall >= 80) {
        recommendation =
          "Advanced Skill Development";
        category = "Skilled";
      } else if (overall >= 65) {
        recommendation =
          "Focused Coaching & Multi-Skilling";
        category = "Moderate";
      } else {
        recommendation =
          "Basic Training & Close Support";
        category = "Needs Support";
      }

      return {
        ...row,
        overall,
        recommendation,
        category,
      };
    });
  }, [rows]);

  const addStaff = () => {
    if (
      !name ||
      !department ||
      !operation ||
      !skill ||
      !trainability ||
      !quality ||
      !attendance
    ) {
      alert("Please complete all fields.");
      return;
    }

    setRows([
      ...rows,
      {
        name,
        department,
        operation,
        skill: Number(skill),
        trainability: Number(trainability),
        quality: Number(quality),
        attendance: Number(attendance),
      },
    ]);

    setName("");
    setDepartment("");
    setOperation("");
    setSkill("");
    setTrainability("");
    setQuality("");
    setAttendance("");
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-violet-950 via-blue-900 to-emerald-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Staff Skill Matrix & Trainability System
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Measure Skill, Trainability, Quality, Attendance & Leadership Potential
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            This module helps organisations assess new recruits and existing
            employees through operational skill level, learning ability,
            quality consistency, attendance behaviour, and trainability
            analysis.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-blue-100 p-8 shadow-md">
              <h2 className="text-2xl font-extrabold text-blue-950">
                Recruitment Support
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                Assess whether new recruits have the basic capability,
                discipline, focus, coordination, and learning ability
                required for operational success.
              </p>
            </div>

            <div className="rounded-3xl bg-emerald-100 p-8 shadow-md">
              <h2 className="text-2xl font-extrabold text-emerald-950">
                Skill Development
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                Identify who needs coaching, multi-skilling, retraining,
                or leadership development through measurable operational
                data.
              </p>
            </div>

            <div className="rounded-3xl bg-violet-100 p-8 shadow-md">
              <h2 className="text-2xl font-extrabold text-violet-950">
                Productivity Intelligence
              </h2>

              <p className="mt-5 text-lg leading-relaxed text-violet-950">
                Link worker capability to bottlenecks, quality loss,
                productivity trends, training need, and future
                succession planning.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">

            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-violet-950">
                Staff Assessment Entry
              </h2>

              <div className="mt-8 space-y-5">

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Employee Name
                  </span>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-violet-600"
                    placeholder="Enter employee name"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Department
                  </span>

                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-violet-600"
                    placeholder="Example: Stitching"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Operation
                  </span>

                  <input
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-violet-600"
                    placeholder="Example: Upper Stitching"
                  />
                </label>

                {[
                  {
                    label: "Skill Level",
                    value: skill,
                    setValue: setSkill,
                  },
                  {
                    label: "Trainability",
                    value: trainability,
                    setValue: setTrainability,
                  },
                  {
                    label: "Quality Consistency",
                    value: quality,
                    setValue: setQuality,
                  },
                  {
                    label: "Attendance Reliability",
                    value: attendance,
                    setValue: setAttendance,
                  },
                ].map((item) => (
                  <label key={item.label} className="block">
                    <span className="font-bold text-slate-700">
                      {item.label} (%)
                    </span>

                    <input
                      value={item.value}
                      onChange={(e) =>
                        item.setValue(e.target.value)
                      }
                      type="number"
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-violet-600"
                      placeholder={`Enter ${item.label.toLowerCase()}`}
                    />
                  </label>
                ))}

                <button
                  onClick={addStaff}
                  className="w-full rounded-2xl bg-violet-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-violet-800"
                >
                  Add Staff Assessment
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md xl:col-span-2">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Live Skill Matrix
              </h2>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-200 text-left">
                      <th className="rounded-l-xl p-4">
                        Employee
                      </th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Operation</th>
                      <th className="p-4">Skill</th>
                      <th className="p-4">Trainability</th>
                      <th className="p-4">Quality</th>
                      <th className="p-4">Attendance</th>
                      <th className="p-4">Overall</th>
                      <th className="p-4">Category</th>
                      <th className="rounded-r-xl p-4">
                        Recommendation
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {analysedRows.map((row) => (
                      <tr
                        key={row.name + row.operation}
                        className="border-b border-slate-200"
                      >
                        <td className="p-4 font-bold">
                          {row.name}
                        </td>

                        <td className="p-4">
                          {row.department}
                        </td>

                        <td className="p-4">
                          {row.operation}
                        </td>

                        <td className="p-4">
                          {row.skill}%
                        </td>

                        <td className="p-4">
                          {row.trainability}%
                        </td>

                        <td className="p-4">
                          {row.quality}%
                        </td>

                        <td className="p-4">
                          {row.attendance}%
                        </td>

                        <td className="p-4 font-bold">
                          {row.overall.toFixed(1)}%
                        </td>

                        <td className="p-4">
                          {row.category}
                        </td>

                        <td className="p-4">
                          {row.recommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-slate-900 p-8 text-white shadow-md">
            <h2 className="text-3xl font-extrabold text-cyan-300">
              Trainability Assessment Concepts
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="text-2xl font-extrabold text-yellow-300">
                  Learning Speed
                </h3>

                <p className="mt-4 text-slate-300">
                  Measure how quickly employees understand and apply
                  operational instructions and standard methods.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="text-2xl font-extrabold text-yellow-300">
                  Repetition Stability
                </h3>

                <p className="mt-4 text-slate-300">
                  Assess consistency, repeatability, and quality
                  stability during repeated operational tasks.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="text-2xl font-extrabold text-yellow-300">
                  Coaching Response
                </h3>

                <p className="mt-4 text-slate-300">
                  Observe whether performance improves after coaching,
                  demonstration, or correction.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="text-2xl font-extrabold text-yellow-300">
                  Leadership Potential
                </h3>

                <p className="mt-4 text-slate-300">
                  Identify employees with communication ability,
                  discipline, teamwork, ownership, and future
                  supervisory potential.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>
            {/* PRACTICAL TRAINABILITY TEST */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-5xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-violet-700">
              Practical Trainability Assessment
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Structured Operational Learning & Skill Evaluation
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              New recruits, existing employees, or transferred workers can be
              assessed through practical operational demonstrations and repeated
              task execution under supervision of highly skilled operators or
              supervisors.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl border border-blue-300 bg-blue-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-blue-950">
                Step 1 — Demonstration
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                A highly skilled worker or supervisor demonstrates the complete
                operation including machine startup, setup, handling method,
                safety, workflow sequence, and quality expectation.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-300 bg-emerald-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-emerald-950">
                Step 2 — Repeated Observation
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                The trainee observes the operation repeatedly — normally five
                or six demonstrations — until the trainee confirms confidence
                and understanding.
              </p>
            </div>

            <div className="rounded-3xl border border-yellow-300 bg-yellow-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-yellow-950">
                Step 3 — Practical Execution
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-yellow-950">
                The trainee performs the actual operation three times using
                proper production material while the trainer observes
                coordination, learning ability, confidence, speed, and quality.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-300 bg-violet-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-violet-950">
                Step 4 — Assessment
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-violet-950">
                The trainer scores the trainee using a structured scale to
                determine training requirement, deployment readiness,
                supervision level, and estimated time before production floor
                release.
              </p>
            </div>

          </div>

          <div className="mt-14 rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
            <h3 className="text-3xl font-extrabold text-cyan-300">
              Trainability Scoring Bands
            </h3>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl bg-emerald-500/20 p-6">
                <h4 className="text-3xl font-extrabold text-emerald-300">
                  8–10
                </h4>

                <p className="mt-4 text-lg leading-relaxed text-slate-300">
                  High trainability. Fast learner. Ready for accelerated
                  training and early production deployment.
                </p>
              </div>

              <div className="rounded-2xl bg-blue-500/20 p-6">
                <h4 className="text-3xl font-extrabold text-blue-300">
                  6–7
                </h4>

                <p className="mt-4 text-lg leading-relaxed text-slate-300">
                  Moderate trainability. Requires structured coaching and
                  controlled production exposure.
                </p>
              </div>

              <div className="rounded-2xl bg-yellow-500/20 p-6">
                <h4 className="text-3xl font-extrabold text-yellow-300">
                  4–5
                </h4>

                <p className="mt-4 text-lg leading-relaxed text-slate-300">
                  Requires extended practical training, close supervision,
                  repetition, and slower deployment pace.
                </p>
              </div>

              <div className="rounded-2xl bg-red-500/20 p-6">
                <h4 className="text-3xl font-extrabold text-red-300">
                  3 or Less
                </h4>

                <p className="mt-4 text-lg leading-relaxed text-slate-300">
                  Not suitable for the tested operation currently. Consider
                  reassignment, alternative operations, or additional basic
                  development support.
                </p>
              </div>

            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-orange-100 p-8 shadow-md">
            <h3 className="text-3xl font-extrabold text-orange-950">
              Training Planning Intelligence
            </h3>

            <p className="mt-5 text-xl leading-relaxed text-orange-950">
              The assessment results help management design structured training
              programmes, assign resource persons, estimate coaching duration,
              determine deployment readiness, and plan safe transition to
              actual production floor operations.
            </p>
          </div>

        </div>
      </section>
            {/* SOCIAL SKILLS & INTEGRITY ASSESSMENT */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="max-w-5xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-700">
              Social Skills & Integrity Assessment
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              Behavioural, Teamwork & Consistency Evaluation
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              In addition to technical skill assessment, organisations can
              evaluate teamwork, empathy, communication, cooperation,
              consistency, integrity awareness, and behavioural suitability
              for operational environments.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl border border-blue-300 bg-blue-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-blue-950">
                Team Problem Solving
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                Candidates work in groups to solve operational problems while
                observers assess communication, cooperation, listening,
                participation, leadership behaviour, and teamwork attitude.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-300 bg-emerald-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-emerald-950">
                Empathy & Respect
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                Supervisors observe whether candidates show patience,
                respect, understanding, emotional control, and positive
                interaction with other team members.
              </p>
            </div>

            <div className="rounded-3xl border border-violet-300 bg-violet-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-violet-950">
                Consistency Questions
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-violet-950">
                Similar operational or behavioural questions may be asked in
                different ways to observe response consistency, honesty
                awareness, and reliability of communication.
              </p>
            </div>

            <div className="rounded-3xl border border-yellow-300 bg-yellow-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-yellow-950">
                Development-Oriented Review
              </h3>

              <p className="mt-5 text-lg leading-relaxed text-yellow-950">
                Assessment results should support coaching, development,
                supervision planning, and role suitability rather than relying
                on a single behavioural factor alone.
              </p>
            </div>

          </div>

          <div className="mt-14 rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
            <h3 className="text-3xl font-extrabold text-cyan-300">
              Behavioural Assessment Indicators
            </h3>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {[
                "Teamwork",
                "Listening Ability",
                "Respect for Others",
                "Communication Clarity",
                "Conflict Handling",
                "Empathy",
                "Integrity Awareness",
                "Discipline",
                "Leadership Potential",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/10 p-6"
                >
                  <h4 className="text-2xl font-extrabold text-yellow-300">
                    {item}
                  </h4>

                  <p className="mt-4 text-slate-300">
                    Behavioural observation area used during teamwork,
                    operational exercises, and supervised assessment.
                  </p>
                </div>
              ))}

            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-orange-100 p-8 shadow-md">
            <h3 className="text-3xl font-extrabold text-orange-950">
              Responsible Use Guidance
            </h3>

            <p className="mt-5 text-xl leading-relaxed text-orange-950">
              Behavioural and integrity-related assessments should be used
              responsibly, fairly, transparently, and alongside operational,
              technical, and coaching evaluations. Final recruitment or
              deployment decisions should consider the overall capability and
              development potential of the individual.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}