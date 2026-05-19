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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  const topCards = [
    {
      title: "Recruitment Support",
      text:
        "Assess whether new recruits have the basic capability, discipline, focus, coordination, and learning ability required for operational success.",
      color: "bg-blue-100 text-blue-950",
    },
    {
      title: "Skill Development",
      text:
        "Identify who needs coaching, multi-skilling, retraining, or leadership development through measurable operational data.",
      color: "bg-emerald-100 text-emerald-950",
    },
    {
      title: "Productivity Intelligence",
      text:
        "Link worker capability to bottlenecks, quality loss, productivity trends, training need, and future succession planning.",
      color: "bg-violet-100 text-violet-950",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Staff Skill Matrix & Trainability System
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Measure Skill, Trainability, Quality, Attendance &
            Leadership Potential
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
          {/* TOP CARDS */}
          <div className="grid gap-6 md:grid-cols-3">
            {topCards.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className={`scroll-mt-28 rounded-3xl p-8 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${item.color}`}
                >
                  <h2
                    id={id}
                    className="text-2xl font-extrabold"
                  >
                    {item.title}
                  </h2>

                  <p className="mt-5 text-lg leading-relaxed">
                    {item.text}
                  </p>
                </a>
              );
            })}
          </div>

          {/* ENTRY + TABLE */}
          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            {/* ENTRY */}
            <section
              id={slugify("Staff Assessment Entry")}
              className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-md"
            >
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
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-600 focus:bg-white"
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
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-600 focus:bg-white"
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
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-600 focus:bg-white"
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
                ].map((item) => {
                  const id = slugify(item.label);

                  return (
                    <label
                      key={item.label}
                      id={id}
                      className="scroll-mt-28 block"
                    >
                      <span className="font-bold text-slate-700">
                        {item.label} (%)
                      </span>

                      <input
                        value={item.value}
                        onChange={(e) =>
                          item.setValue(e.target.value)
                        }
                        type="number"
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-600 focus:bg-white"
                        placeholder={`Enter ${item.label.toLowerCase()}`}
                      />
                    </label>
                  );
                })}

                <button
                  onClick={addStaff}
                  className="w-full rounded-2xl bg-violet-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition duration-300 hover:bg-violet-800 hover:shadow-xl"
                >
                  Add Staff Assessment
                </button>
              </div>
            </section>

            {/* TABLE */}
            <section className="rounded-3xl bg-white p-8 shadow-md xl:col-span-2">
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
                        className="border-b border-slate-200 transition duration-300 hover:bg-violet-50"
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
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}