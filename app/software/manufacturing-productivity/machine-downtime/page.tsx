"use client";

import { useMemo, useState } from "react";

type MachineRow = {
  machine: string;
  department: string;
  criticality: "Low" | "Medium" | "High";
  downtimeMinutes: number;
  preventiveStatus: "Completed" | "Due" | "Overdue";
  morningCheck: "Completed" | "Pending";
  endShiftCheck: "Completed" | "Pending";
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function MachineDowntimePage() {
  const [rows, setRows] = useState<MachineRow[]>([
    {
      machine: "Stitching Machine 1",
      department: "Sewing",
      criticality: "High",
      downtimeMinutes: 45,
      preventiveStatus: "Due",
      morningCheck: "Pending",
      endShiftCheck: "Completed",
    },
    {
      machine: "Cutting Machine 2",
      department: "Cutting",
      criticality: "High",
      downtimeMinutes: 20,
      preventiveStatus: "Completed",
      morningCheck: "Completed",
      endShiftCheck: "Completed",
    },
    {
      machine: "Compressor",
      department: "Utility",
      criticality: "High",
      downtimeMinutes: 65,
      preventiveStatus: "Overdue",
      morningCheck: "Pending",
      endShiftCheck: "Pending",
    },
  ]);

  const [machine, setMachine] = useState("");
  const [department, setDepartment] = useState("");
  const [criticality, setCriticality] =
    useState<MachineRow["criticality"]>("High");
  const [downtimeMinutes, setDowntimeMinutes] = useState("");
  const [preventiveStatus, setPreventiveStatus] =
    useState<MachineRow["preventiveStatus"]>("Due");
  const [morningCheck, setMorningCheck] =
    useState<MachineRow["morningCheck"]>("Pending");
  const [endShiftCheck, setEndShiftCheck] =
    useState<MachineRow["endShiftCheck"]>("Pending");

  const analysedRows = useMemo(() => {
    return rows
      .map((row) => {
        let priority = "Monitor";
        let recommendation = "Continue routine maintenance discipline.";

        if (
          row.criticality === "High" &&
          (row.preventiveStatus === "Overdue" ||
            row.morningCheck === "Pending" ||
            row.downtimeMinutes >= 45)
        ) {
          priority = "Urgent";
          recommendation =
            "Immediate maintenance review required before next production run.";
        } else if (
          row.preventiveStatus === "Due" ||
          row.downtimeMinutes >= 20 ||
          row.endShiftCheck === "Pending"
        ) {
          priority = "High";
          recommendation =
            "Schedule preventive maintenance and verify machine readiness.";
        }

        return { ...row, priority, recommendation };
      })
      .sort((a, b) => b.downtimeMinutes - a.downtimeMinutes);
  }, [rows]);

  const addMachine = () => {
    const downtime = Number(downtimeMinutes);

    if (!machine || !department || downtime < 0) {
      alert("Please enter machine, department, and downtime minutes.");
      return;
    }

    setRows([
      ...rows,
      {
        machine,
        department,
        criticality,
        downtimeMinutes: downtime,
        preventiveStatus,
        morningCheck,
        endShiftCheck,
      },
    ]);

    setMachine("");
    setDepartment("");
    setCriticality("High");
    setDowntimeMinutes("");
    setPreventiveStatus("Due");
    setMorningCheck("Pending");
    setEndShiftCheck("Pending");
  };

  const governanceItems = [
    "Morning readiness check two hours before production starts",
    "Immediate maintenance review after production finishes",
    "Preventive maintenance schedule for every critical machine",
    "Public dashboard for maintenance visibility and accountability",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Machine Downtime Intelligence
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Prevent Downtime Before It Stops Production
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            This module tracks machine downtime, preventive maintenance,
            morning readiness checks, end-of-shift checks, and critical machine
            visibility so managers can protect production flow.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          {/* TOP CARDS */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Morning Maintenance Check",
                color: "bg-orange-100 text-orange-950",
                text:
                  "Critical machines should be checked at least two hours before staff start production so breakdown risk can be reduced before the line begins work.",
              },
              {
                title: "End-of-Production Check",
                color: "bg-blue-100 text-blue-950",
                text:
                  "Maintenance review should be carried out immediately after production finishes to identify faults, wear, leakage, noise, overheating, or adjustment requirements.",
              },
              {
                title: "Preventive Maintenance Routine",
                color: "bg-emerald-100 text-emerald-950",
                text:
                  "Planned preventive maintenance should be scheduled, recorded, reviewed, and displayed so production teams know whether each critical machine is ready, due, or overdue.",
              },
            ].map((item) => {
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

          {/* MAIN GRID */}
          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            {/* ENTRY FORM */}
            <section
              id={slugify("Machine Status Entry")}
              className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-md"
            >
              <h2 className="text-3xl font-extrabold text-blue-950">
                Machine Status Entry
              </h2>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="font-bold text-slate-700">
                    Machine Name
                  </span>

                  <input
                    value={machine}
                    onChange={(e) => setMachine(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white"
                    placeholder="Example: Cutting Machine 1"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Department
                  </span>

                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white"
                    placeholder="Example: Sewing"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Criticality
                  </span>

                  <select
                    value={criticality}
                    onChange={(e) =>
                      setCriticality(
                        e.target.value as MachineRow["criticality"]
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Downtime Minutes
                  </span>

                  <input
                    value={downtimeMinutes}
                    onChange={(e) => setDowntimeMinutes(e.target.value)}
                    type="number"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white"
                    placeholder="Example: 30"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Preventive Maintenance Status
                  </span>

                  <select
                    value={preventiveStatus}
                    onChange={(e) =>
                      setPreventiveStatus(
                        e.target.value as MachineRow["preventiveStatus"]
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white"
                  >
                    <option>Completed</option>
                    <option>Due</option>
                    <option>Overdue</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Morning Check
                  </span>

                  <select
                    value={morningCheck}
                    onChange={(e) =>
                      setMorningCheck(
                        e.target.value as MachineRow["morningCheck"]
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white"
                  >
                    <option>Completed</option>
                    <option>Pending</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    End-of-Production Check
                  </span>

                  <select
                    value={endShiftCheck}
                    onChange={(e) =>
                      setEndShiftCheck(
                        e.target.value as MachineRow["endShiftCheck"]
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white"
                  >
                    <option>Completed</option>
                    <option>Pending</option>
                  </select>
                </label>

                <button
                  onClick={addMachine}
                  className="w-full rounded-2xl bg-blue-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition duration-300 hover:bg-blue-800 hover:shadow-xl"
                >
                  Add Machine Status
                </button>
              </div>
            </section>

            {/* DASHBOARD */}
            <section
              id={slugify("Public Critical Machine Dashboard")}
              className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-md xl:col-span-2"
            >
              <h2 className="text-3xl font-extrabold text-slate-900">
                Public Critical Machine Dashboard
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                This dashboard can be displayed publicly inside the factory so
                maintenance, production, supervisors, and managers can see which
                critical machines are ready, due, overdue, or causing downtime.
              </p>

              <div className="mt-8 space-y-6">
                {analysedRows.map((row) => {
                  const id = slugify(row.machine);

                  return (
                    <div
                      key={row.machine}
                      id={id}
                      className="scroll-mt-28 rounded-3xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:shadow-xl"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-2xl font-extrabold text-slate-900">
                            {row.machine}
                          </h3>

                          <p className="mt-1 text-lg text-slate-700">
                            {row.department} | Criticality:{" "}
                            {row.criticality}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-900 px-5 py-3 text-white">
                          <p className="font-bold">
                            Priority: {row.priority}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-4">
                        <div className="rounded-2xl bg-orange-100 p-4 transition hover:shadow-md">
                          <p className="text-sm font-bold uppercase text-orange-700">
                            Downtime
                          </p>

                          <p className="mt-2 text-2xl font-extrabold text-orange-950">
                            {row.downtimeMinutes} min
                          </p>
                        </div>

                        <div className="rounded-2xl bg-blue-100 p-4 transition hover:shadow-md">
                          <p className="text-sm font-bold uppercase text-blue-700">
                            PM Status
                          </p>

                          <p className="mt-2 text-2xl font-extrabold text-blue-950">
                            {row.preventiveStatus}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-emerald-100 p-4 transition hover:shadow-md">
                          <p className="text-sm font-bold uppercase text-emerald-700">
                            Morning
                          </p>

                          <p className="mt-2 text-2xl font-extrabold text-emerald-950">
                            {row.morningCheck}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-violet-100 p-4 transition hover:shadow-md">
                          <p className="text-sm font-bold uppercase text-violet-700">
                            End Check
                          </p>

                          <p className="mt-2 text-2xl font-extrabold text-violet-950">
                            {row.endShiftCheck}
                          </p>
                        </div>
                      </div>

                      <p className="mt-6 rounded-2xl bg-yellow-50 p-5 text-lg font-semibold text-yellow-950">
                        Recommendation: {row.recommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* GOVERNANCE */}
          <section className="mt-12 rounded-3xl bg-slate-900 p-8 text-white shadow-md">
            <h2 className="text-3xl font-extrabold text-cyan-300">
              Maintenance Governance
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {governanceItems.map((item) => {
                const id = slugify(item);

                return (
                  <a
                    key={item}
                    href={`#${id}`}
                    className="scroll-mt-28 rounded-2xl bg-white/10 p-6 transition duration-300 hover:bg-white/20 hover:shadow-xl"
                  >
                    <h3
                      id={id}
                      className="text-xl font-extrabold text-yellow-300"
                    >
                      {item}
                    </h3>

                    <p className="mt-4 text-slate-300">
                      Designed to reduce avoidable downtime, protect production
                      flow, and support continuous improvement discipline.
                    </p>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}