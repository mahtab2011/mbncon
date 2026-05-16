"use client";

import { useMemo, useState } from "react";

type DailyRow = {
  department: string;
  targetOutput: number;
  actualOutput: number;
  rejectionRate: number;
  absenteeism: number;
  downtimeMinutes: number;
  safetyIssue: "No" | "Yes";
  mainIssue: string;
  owner: string;
  status: "Open" | "In Progress" | "Closed";
};

export default function DailyManagementSystemPage() {
  const [rows, setRows] = useState<DailyRow[]>([
    {
      department: "Cutting",
      targetOutput: 1000,
      actualOutput: 920,
      rejectionRate: 2.1,
      absenteeism: 1,
      downtimeMinutes: 20,
      safetyIssue: "No",
      mainIssue: "Material identification delay",
      owner: "Cutting Supervisor",
      status: "Open",
    },
    {
      department: "Stitching",
      targetOutput: 1000,
      actualOutput: 760,
      rejectionRate: 5.4,
      absenteeism: 3,
      downtimeMinutes: 65,
      safetyIssue: "No",
      mainIssue: "Skill gap and machine downtime",
      owner: "Production Manager",
      status: "In Progress",
    },
  ]);

  const [form, setForm] = useState<DailyRow>({
    department: "",
    targetOutput: 0,
    actualOutput: 0,
    rejectionRate: 0,
    absenteeism: 0,
    downtimeMinutes: 0,
    safetyIssue: "No",
    mainIssue: "",
    owner: "",
    status: "Open",
  });

  const analysedRows = useMemo(() => {
    return rows.map((row) => {
      const achievement =
        row.targetOutput > 0 ? (row.actualOutput / row.targetOutput) * 100 : 0;

      let priority = "Monitor";
      if (
        achievement < 80 ||
        row.rejectionRate > 5 ||
        row.downtimeMinutes > 60 ||
        row.safetyIssue === "Yes"
      ) {
        priority = "Urgent";
      } else if (
        achievement < 90 ||
        row.rejectionRate > 3 ||
        row.downtimeMinutes > 30
      ) {
        priority = "High";
      }

      return { ...row, achievement, priority };
    });
  }, [rows]);

  const addRow = () => {
    if (!form.department || !form.mainIssue || !form.owner) {
      alert("Please complete department, main issue, and owner.");
      return;
    }

    setRows([...rows, form]);

    setForm({
      department: "",
      targetOutput: 0,
      actualOutput: 0,
      rejectionRate: 0,
      absenteeism: 0,
      downtimeMinutes: 0,
      safetyIssue: "No",
      mainIssue: "",
      owner: "",
      status: "Open",
    });
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-slate-950 via-blue-900 to-violet-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Digital Daily Management System
          </p>

          <h1 className="max-w-6xl text-5xl font-extrabold leading-tight">
            Factory Daily Review, Escalation, Accountability & Action Board
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-relaxed text-white/85">
            This module creates a daily operational management board for shift
            review, production performance, rejection, absenteeism, downtime,
            safety issues, escalation, ownership, and improvement follow-up.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              "Yesterday performance",
              "Today priority",
              "Escalation owner",
              "Follow-up discipline",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-blue-100 p-6 shadow-md">
                <h2 className="text-xl font-extrabold text-blue-950">
                  {item}
                </h2>
                <p className="mt-4 text-blue-950">
                  Daily management discipline helps factories identify issues
                  early and assign accountable actions before problems repeat.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-blue-950">
                Daily Board Entry
              </h2>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="font-bold text-slate-700">Department</span>
                  <input
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Example: Stitching"
                  />
                </label>

                {[
                  ["targetOutput", "Target Output"],
                  ["actualOutput", "Actual Output"],
                  ["rejectionRate", "Rejection Rate (%)"],
                  ["absenteeism", "Absenteeism"],
                  ["downtimeMinutes", "Downtime Minutes"],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="font-bold text-slate-700">{label}</span>
                    <input
                      type="number"
                      value={Number(form[key as keyof DailyRow])}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]: Number(e.target.value),
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    />
                  </label>
                ))}

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Safety Issue
                  </span>
                  <select
                    value={form.safetyIssue}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        safetyIssue: e.target.value as DailyRow["safetyIssue"],
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">Main Issue</span>
                  <input
                    value={form.mainIssue}
                    onChange={(e) =>
                      setForm({ ...form, mainIssue: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Example: machine downtime"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Action Owner
                  </span>
                  <input
                    value={form.owner}
                    onChange={(e) =>
                      setForm({ ...form, owner: e.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Example: Production Manager"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">Status</span>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as DailyRow["status"],
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Closed</option>
                  </select>
                </label>

                <button
                  onClick={addRow}
                  className="w-full rounded-2xl bg-blue-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-blue-800"
                >
                  Add Daily Board Item
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md xl:col-span-2">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Live Daily Management Board
              </h2>

              <div className="mt-8 space-y-6">
                {analysedRows.map((row, index) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900">
                          {row.department}
                        </h3>
                        <p className="mt-1 text-lg text-slate-700">
                          Main Issue: {row.mainIssue}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-900 px-6 py-4 text-white">
                        <p className="text-sm font-bold uppercase text-cyan-300">
                          Achievement
                        </p>
                        <p className="text-3xl font-extrabold">
                          {row.achievement.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-5">
                      <div className="rounded-2xl bg-blue-100 p-4">
                        <p className="text-sm font-bold uppercase text-blue-700">
                          Target
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-blue-950">
                          {row.targetOutput}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-100 p-4">
                        <p className="text-sm font-bold uppercase text-emerald-700">
                          Actual
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-emerald-950">
                          {row.actualOutput}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-red-100 p-4">
                        <p className="text-sm font-bold uppercase text-red-700">
                          Rejection
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-red-950">
                          {row.rejectionRate}%
                        </p>
                      </div>

                      <div className="rounded-2xl bg-orange-100 p-4">
                        <p className="text-sm font-bold uppercase text-orange-700">
                          Downtime
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-orange-950">
                          {row.downtimeMinutes}m
                        </p>
                      </div>

                      <div className="rounded-2xl bg-violet-100 p-4">
                        <p className="text-sm font-bold uppercase text-violet-700">
                          Priority
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-violet-950">
                          {row.priority}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl bg-yellow-50 p-5">
                      <p className="text-lg text-yellow-950">
                        <strong>Owner:</strong> {row.owner}
                      </p>
                      <p className="mt-2 text-lg text-yellow-950">
                        <strong>Status:</strong> {row.status}
                      </p>
                      <p className="mt-2 text-lg text-yellow-950">
                        <strong>Safety Issue:</strong> {row.safetyIssue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-slate-900 p-8 text-white shadow-md">
            <h2 className="text-3xl font-extrabold text-cyan-300">
              Daily Management Routine
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {[
                "Review yesterday",
                "Identify gaps",
                "Assign owner",
                "Escalate urgent issues",
                "Close actions",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-6">
                  <h3 className="text-xl font-extrabold text-yellow-300">
                    {item}
                  </h3>
                  <p className="mt-4 text-slate-300">
                    Daily operational discipline to support accountability,
                    teamwork, transparency, and measurable improvement.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}