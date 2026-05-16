"use client";

import { useMemo, useState } from "react";

type AuditRow = {
  area: string;
  auditor: string;
  score5s: number;
  scoreSafety: number;
  scoreStandardWork: number;
  scoreQuality: number;
  issue: string;
  actionOwner: string;
  status: "Open" | "In Progress" | "Closed";
};

export default function GembaAuditSystemPage() {
  const [rows, setRows] = useState<AuditRow[]>([
    {
      area: "Stitching Line A",
      auditor: "Production Manager",
      score5s: 72,
      scoreSafety: 80,
      scoreStandardWork: 68,
      scoreQuality: 75,
      issue: "Tools not returned to marked location",
      actionOwner: "Line Supervisor",
      status: "In Progress",
    },
    {
      area: "Cutting Section",
      auditor: "Quality Manager",
      score5s: 86,
      scoreSafety: 90,
      scoreStandardWork: 82,
      scoreQuality: 88,
      issue: "Minor material identification gap",
      actionOwner: "Cutting Supervisor",
      status: "Open",
    },
  ]);

  const [form, setForm] = useState<AuditRow>({
    area: "",
    auditor: "",
    score5s: 0,
    scoreSafety: 0,
    scoreStandardWork: 0,
    scoreQuality: 0,
    issue: "",
    actionOwner: "",
    status: "Open",
  });

  const analysedRows = useMemo(() => {
    return rows.map((row) => {
      const overall =
        (row.score5s +
          row.scoreSafety +
          row.scoreStandardWork +
          row.scoreQuality) /
        4;

      let priority = "Monitor";

      if (overall < 60) priority = "Urgent";
      else if (overall < 75) priority = "High";
      else if (overall < 85) priority = "Medium";

      return {
        ...row,
        overall,
        priority,
      };
    });
  }, [rows]);

  const addAudit = () => {
    if (!form.area || !form.auditor || !form.issue || !form.actionOwner) {
      alert("Please complete area, auditor, issue, and action owner.");
      return;
    }

    setRows([...rows, form]);

    setForm({
      area: "",
      auditor: "",
      score5s: 0,
      scoreSafety: 0,
      scoreStandardWork: 0,
      scoreQuality: 0,
      issue: "",
      actionOwner: "",
      status: "Open",
    });
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-emerald-950 via-blue-900 to-violet-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Gemba Walk & Quality Audit System
          </p>

          <h1 className="max-w-6xl text-5xl font-extrabold leading-tight">
            Go to the Actual Place, Observe the Work, and Sustain Operational Discipline
          </h1>

          <p className="mt-6 max-w-5xl text-xl leading-relaxed text-white/85">
            This module supports Gemba walks, 5S audits, safety checks,
            standard work verification, quality discipline, corrective action,
            and supervisor accountability across production areas.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-4">
            {[
              "Go to the actual place",
              "Observe real work",
              "Ask respectful questions",
              "Record facts and actions",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-blue-100 p-6 shadow-md">
                <h2 className="text-xl font-extrabold text-blue-950">
                  {item}
                </h2>
                <p className="mt-4 text-blue-950">
                  Gemba discipline helps leaders understand real operational
                  conditions instead of relying only on office reports.
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-emerald-950">
                Audit Entry Form
              </h2>

              <div className="mt-8 space-y-5">
                {[
                  ["area", "Area / Line"],
                  ["auditor", "Auditor"],
                  ["issue", "Issue Observed"],
                  ["actionOwner", "Action Owner"],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="font-bold text-slate-700">{label}</span>
                    <input
                      value={String(form[key as keyof AuditRow])}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]: e.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-600"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </label>
                ))}

                {[
                  ["score5s", "5S Score"],
                  ["scoreSafety", "Safety Score"],
                  ["scoreStandardWork", "Standard Work Score"],
                  ["scoreQuality", "Quality Discipline Score"],
                ].map(([key, label]) => (
                  <label key={key} className="block">
                    <span className="font-bold text-slate-700">
                      {label} (%)
                    </span>
                    <input
                      type="number"
                      value={Number(form[key as keyof AuditRow])}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [key]: Number(e.target.value),
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-600"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </label>
                ))}

                <label className="block">
                  <span className="font-bold text-slate-700">Status</span>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as AuditRow["status"],
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-600"
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Closed</option>
                  </select>
                </label>

                <button
                  onClick={addAudit}
                  className="w-full rounded-2xl bg-emerald-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-emerald-800"
                >
                  Save Gemba Audit
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md xl:col-span-2">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Live Gemba Audit Dashboard
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
                          {row.area}
                        </h3>
                        <p className="mt-1 text-lg text-slate-700">
                          Auditor: {row.auditor}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-900 px-6 py-4 text-white">
                        <p className="text-sm font-bold uppercase text-cyan-300">
                          Overall Score
                        </p>
                        <p className="text-3xl font-extrabold">
                          {row.overall.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                      <div className="rounded-2xl bg-emerald-100 p-4">
                        <p className="text-sm font-bold uppercase text-emerald-700">
                          5S
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-emerald-950">
                          {row.score5s}%
                        </p>
                      </div>

                      <div className="rounded-2xl bg-blue-100 p-4">
                        <p className="text-sm font-bold uppercase text-blue-700">
                          Safety
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-blue-950">
                          {row.scoreSafety}%
                        </p>
                      </div>

                      <div className="rounded-2xl bg-violet-100 p-4">
                        <p className="text-sm font-bold uppercase text-violet-700">
                          Standard Work
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-violet-950">
                          {row.scoreStandardWork}%
                        </p>
                      </div>

                      <div className="rounded-2xl bg-red-100 p-4">
                        <p className="text-sm font-bold uppercase text-red-700">
                          Quality
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-red-950">
                          {row.scoreQuality}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl bg-yellow-50 p-5">
                      <p className="text-lg text-yellow-950">
                        <strong>Issue:</strong> {row.issue}
                      </p>
                      <p className="mt-2 text-lg text-yellow-950">
                        <strong>Owner:</strong> {row.actionOwner}
                      </p>
                      <p className="mt-2 text-lg text-yellow-950">
                        <strong>Status:</strong> {row.status} |{" "}
                        <strong>Priority:</strong> {row.priority}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-slate-900 p-8 text-white shadow-md">
            <h2 className="text-3xl font-extrabold text-cyan-300">
              Standard Gemba Walk Procedure
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              {[
                "Go to shop floor",
                "Observe actual process",
                "Compare with standard work",
                "Record abnormality",
                "Assign corrective action",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-6">
                  <h3 className="text-xl font-extrabold text-yellow-300">
                    {item}
                  </h3>
                  <p className="mt-4 text-slate-300">
                    Practical Gemba discipline for sustaining Lean, TQM,
                    Kaizen, 5S, safety, and quality culture.
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