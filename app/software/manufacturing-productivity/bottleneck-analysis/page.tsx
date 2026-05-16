"use client";

import { useMemo, useState } from "react";

type ProcessRow = {
  process: string;
  ratedCapacity: number;
  actualOutput: number;
  urgency: "Low" | "Medium" | "High";
};

export default function BottleneckAnalysisPage() {
  const [process, setProcess] = useState("");
  const [ratedCapacity, setRatedCapacity] = useState("");
  const [actualOutput, setActualOutput] = useState("");
  const [urgency, setUrgency] = useState<"Low" | "Medium" | "High">("Medium");

  const [rows, setRows] = useState<ProcessRow[]>([
    {
      process: "Cutting",
      ratedCapacity: 1000,
      actualOutput: 920,
      urgency: "Medium",
    },
    {
      process: "Skiving",
      ratedCapacity: 1000,
      actualOutput: 680,
      urgency: "High",
    },
    {
      process: "Stitching",
      ratedCapacity: 1000,
      actualOutput: 720,
      urgency: "High",
    },
    {
      process: "Finishing",
      ratedCapacity: 1000,
      actualOutput: 860,
      urgency: "Medium",
    },
  ]);

  const analysisRows = useMemo(() => {
    return rows
      .map((row) => {
        const gap = row.ratedCapacity - row.actualOutput;
        const utilisation =
          row.ratedCapacity > 0
            ? (row.actualOutput / row.ratedCapacity) * 100
            : 0;

        const severity =
          row.ratedCapacity > 0 ? (gap / row.ratedCapacity) * 100 : 0;

        let recommendation = "Monitor";
        let priority = "Low";

        if (severity >= 25 || row.urgency === "High") {
          recommendation = "Elevate this bottleneck";
          priority = "High";
        } else if (severity >= 10) {
          recommendation = "Subordinate flow and rebalance work";
          priority = "Medium";
        }

        return {
          ...row,
          gap,
          utilisation,
          severity,
          recommendation,
          priority,
        };
      })
      .sort((a, b) => b.severity - a.severity);
  }, [rows]);

  const topBottleneck = analysisRows[0];

  const addProcess = () => {
    const rated = Number(ratedCapacity);
    const actual = Number(actualOutput);

    if (!process || rated <= 0 || actual < 0) {
      alert("Please enter process name, rated capacity, and actual output.");
      return;
    }

    setRows([
      ...rows,
      {
        process,
        ratedCapacity: rated,
        actualOutput: actual,
        urgency,
      },
    ]);

    setProcess("");
    setRatedCapacity("");
    setActualOutput("");
    setUrgency("Medium");
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-blue-950 via-violet-900 to-red-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Bottleneck Analysis & Capacity Utilisation
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Identify, Prioritise, Elevate, and Subordinate Operational Bottlenecks
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            This module compares rated or assumed capacity against actual
            output, identifies capacity gaps, ranks bottlenecks by severity and
            urgency, and recommends whether to elevate the constraint,
            subordinate surrounding processes, rebalance work, or monitor.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-red-100 p-8 shadow-md">
              <p className="text-sm font-bold uppercase tracking-wide text-red-700">
                Top Bottleneck
              </p>
              <h2 className="mt-4 text-4xl font-extrabold text-red-950">
                {topBottleneck?.process || "No Data"}
              </h2>
            </div>

            <div className="rounded-3xl bg-yellow-100 p-8 shadow-md">
              <p className="text-sm font-bold uppercase tracking-wide text-yellow-700">
                Biggest Capacity Gap
              </p>
              <h2 className="mt-4 text-5xl font-extrabold text-yellow-950">
                {topBottleneck?.gap || 0}
              </h2>
            </div>

            <div className="rounded-3xl bg-blue-100 p-8 shadow-md">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Recommendation
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-blue-950">
                {topBottleneck?.recommendation || "Monitor"}
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-blue-950">
                Add Process Capacity Data
              </h2>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="font-bold text-slate-700">
                    Process / Workstation
                  </span>
                  <input
                    value={process}
                    onChange={(e) => setProcess(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Example: Stitching"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Rated / Assumed Capacity
                  </span>
                  <input
                    value={ratedCapacity}
                    onChange={(e) => setRatedCapacity(e.target.value)}
                    type="number"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Example: 1000"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Actual Output
                  </span>
                  <input
                    value={actualOutput}
                    onChange={(e) => setActualOutput(e.target.value)}
                    type="number"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Example: 720"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Urgency
                  </span>
                  <select
                    value={urgency}
                    onChange={(e) =>
                      setUrgency(e.target.value as "Low" | "Medium" | "High")
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>

                <button
                  onClick={addProcess}
                  className="w-full rounded-2xl bg-blue-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-blue-800"
                >
                  Add to Bottleneck Analysis
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md xl:col-span-2">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Live Bottleneck Ranking
              </h2>

              <div className="mt-8 space-y-6">
                {analysisRows.map((row) => (
                  <div key={row.process}>
                    <div className="mb-2 flex flex-wrap justify-between gap-3 text-lg font-bold">
                      <span>{row.process}</span>
                      <span>
                        Utilisation {row.utilisation.toFixed(1)}% | Gap{" "}
                        {row.gap} | Priority {row.priority}
                      </span>
                    </div>

                    <div className="h-6 rounded-full bg-slate-200">
                      <div
                        className="h-6 rounded-full bg-linear-to-r from-red-700 to-yellow-400"
                        style={{ width: `${Math.min(row.severity, 100)}%` }}
                      />
                    </div>

                    <p className="mt-3 rounded-2xl bg-slate-100 p-4 text-slate-800">
                      <strong>Recommendation:</strong> {row.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-white shadow-md">
            <h2 className="text-3xl font-extrabold text-cyan-300">
              Theory of Constraints Guidance
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="text-xl font-extrabold text-yellow-300">
                  Identify
                </h3>
                <p className="mt-4 text-slate-300">
                  Find the process with the biggest capacity gap, lowest
                  utilisation against required output, or highest urgency.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="text-xl font-extrabold text-yellow-300">
                  Exploit
                </h3>
                <p className="mt-4 text-slate-300">
                  Make the bottleneck work without avoidable waiting, missing
                  materials, unclear instructions, or unnecessary interruptions.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="text-xl font-extrabold text-yellow-300">
                  Subordinate
                </h3>
                <p className="mt-4 text-slate-300">
                  Align upstream and downstream processes to the bottleneck so
                  the whole system supports the constraint instead of creating
                  excess WIP or waiting.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6">
                <h3 className="text-xl font-extrabold text-yellow-300">
                  Elevate
                </h3>
                <p className="mt-4 text-slate-300">
                  Add capacity through training, machine improvement, better
                  staffing, maintenance, method change, layout change, or
                  investment.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto rounded-3xl bg-white p-8 shadow-md">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Bottleneck Analysis Table
            </h2>

            <table className="mt-8 w-full border-collapse">
              <thead>
                <tr className="bg-slate-200 text-left">
                  <th className="rounded-l-xl p-4">Rank</th>
                  <th className="p-4">Process</th>
                  <th className="p-4">Rated Capacity</th>
                  <th className="p-4">Actual Output</th>
                  <th className="p-4">Gap</th>
                  <th className="p-4">Utilisation</th>
                  <th className="p-4">Urgency</th>
                  <th className="p-4">Priority</th>
                  <th className="rounded-r-xl p-4">Recommendation</th>
                </tr>
              </thead>

              <tbody>
                {analysisRows.map((row, index) => (
                  <tr key={row.process} className="border-b border-slate-200">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 font-bold">{row.process}</td>
                    <td className="p-4">{row.ratedCapacity}</td>
                    <td className="p-4">{row.actualOutput}</td>
                    <td className="p-4">{row.gap}</td>
                    <td className="p-4">{row.utilisation.toFixed(1)}%</td>
                    <td className="p-4">{row.urgency}</td>
                    <td className="p-4">{row.priority}</td>
                    <td className="p-4">{row.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
            {/* BOTTLENECK IDENTIFICATION PROCEDURE */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-red-700">
              Bottleneck Identification Methodology
            </p>

            <h2 className="text-4xl font-extrabold text-slate-900">
              How To Identify The Real Bottleneck
            </h2>

            <p className="mt-6 text-xl leading-relaxed text-slate-700">
              Bottlenecks should be identified through structured observation,
              activity sampling, capacity comparison, workflow analysis, and
              actual shop-floor evidence. The system should not depend only on
              assumptions or opinions.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "1. Select Observation Area",
                text: "Choose the line, department, process, workstation, or machine where output is below required capacity.",
                color: "border-blue-300 bg-blue-100 text-blue-950",
              },
              {
                title: "2. Observe for 7 Working Days",
                text: "Collect activity sampling data for seven working days. Ignore the first two days for final analysis because workers may behave differently when they know they are being observed.",
                color: "border-red-300 bg-red-100 text-red-950",
              },
              {
                title: "3. Use Last 5 Days for Analysis",
                text: "Use days 3 to 7 as more reliable data for standard work, non-standard work, idle time, waiting time, and interruption analysis.",
                color: "border-emerald-300 bg-emerald-100 text-emerald-950",
              },
              {
                title: "4. Classify Activities",
                text: "Mark every observed activity as standard work, non-standard work, idle time, waiting for material, waiting for machine, rework, movement, or supervision delay.",
                color: "border-violet-300 bg-violet-100 text-violet-950",
              },
              {
                title: "5. Tally Each Action",
                text: "Use tally marks for each observation. Four right slashes followed by one back slash equals five observations. This makes manual counting simple and reliable.",
                color: "border-yellow-300 bg-yellow-100 text-yellow-950",
              },
              {
                title: "6. Compare With Capacity",
                text: "Compare actual output with rated or assumed capacity. The process with the biggest capacity gap and high idle/waiting impact is a likely bottleneck.",
                color: "border-pink-300 bg-pink-100 text-pink-950",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl border p-8 shadow-md ${item.color}`}
              >
                <h3 className="text-2xl font-extrabold">
                  {item.title}
                </h3>

                <p className="mt-5 text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-3xl bg-slate-900 p-8 text-white shadow-lg">
            <h3 className="text-3xl font-extrabold text-cyan-300">
              Activity Sampling Categories
            </h3>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-emerald-500/20 p-6">
                <h4 className="text-2xl font-extrabold text-emerald-300">
                  Standard Work
                </h4>
                <p className="mt-4 text-slate-300">
                  Productive work done according to the defined method,
                  sequence, quality requirement, and expected cycle.
                </p>
              </div>

              <div className="rounded-2xl bg-yellow-500/20 p-6">
                <h4 className="text-2xl font-extrabold text-yellow-300">
                  Non-Standard Work
                </h4>
                <p className="mt-4 text-slate-300">
                  Rework, unnecessary movement, searching, correction,
                  repeated handling, unclear method, or avoidable extra work.
                </p>
              </div>

              <div className="rounded-2xl bg-red-500/20 p-6">
                <h4 className="text-2xl font-extrabold text-red-300">
                  Idle / Waiting Time
                </h4>
                <p className="mt-4 text-slate-300">
                  Waiting for material, machine, supervisor decision,
                  instruction, maintenance, previous process, or next process.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-3xl bg-yellow-50 p-8 shadow-md">
            <h3 className="text-3xl font-extrabold text-yellow-950">
              Manual Tally Method
            </h3>

            <p className="mt-5 text-xl leading-relaxed text-yellow-950">
              During observation, each activity is recorded using tally marks:
              four right slashes followed by one crossing back slash equals
              five observations. Example: <strong>////</strong> then cross it
              to complete one group of <strong>5</strong>. This allows quick
              manual counting before transferring data into the software.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}