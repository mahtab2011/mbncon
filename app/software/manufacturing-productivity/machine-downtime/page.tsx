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

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-slate-950 via-blue-900 to-orange-800 px-6 py-16 text-white">
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
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-orange-100 p-8 shadow-md">
              <h2 className="text-2xl font-extrabold text-orange-950">
                Morning Maintenance Check
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-orange-950">
                Critical machines should be checked at least two hours before
                staff start production so breakdown risk can be reduced before
                the line begins work.
              </p>
            </div>

            <div className="rounded-3xl bg-blue-100 p-8 shadow-md">
              <h2 className="text-2xl font-extrabold text-blue-950">
                End-of-Production Check
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                Maintenance review should be carried out immediately after
                production finishes to identify faults, wear, leakage, noise,
                overheating, or adjustment requirements.
              </p>
            </div>

            <div className="rounded-3xl bg-emerald-100 p-8 shadow-md">
              <h2 className="text-2xl font-extrabold text-emerald-950">
                Preventive Maintenance Routine
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                Planned preventive maintenance should be scheduled, recorded,
                reviewed, and displayed so production teams know whether each
                critical machine is ready, due, or overdue.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-md">
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
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Example: Cutting Machine 1"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">Department</span>
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                    placeholder="Example: Sewing"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">Criticality</span>
                  <select
                    value={criticality}
                    onChange={(e) =>
                      setCriticality(e.target.value as MachineRow["criticality"])
                    }
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
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
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
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
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
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
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
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
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-blue-600"
                  >
                    <option>Completed</option>
                    <option>Pending</option>
                  </select>
                </label>

                <button
                  onClick={addMachine}
                  className="w-full rounded-2xl bg-blue-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-blue-800"
                >
                  Add Machine Status
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md xl:col-span-2">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Public Critical Machine Dashboard
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-slate-700">
                This dashboard can be displayed publicly inside the factory so
                maintenance, production, supervisors, and managers can see which
                critical machines are ready, due, overdue, or causing downtime.
              </p>

              <div className="mt-8 space-y-6">
                {analysedRows.map((row) => (
                  <div
                    key={row.machine}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900">
                          {row.machine}
                        </h3>
                        <p className="mt-1 text-lg text-slate-700">
                          {row.department} | Criticality: {row.criticality}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-900 px-5 py-3 text-white">
                        <p className="font-bold">Priority: {row.priority}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-4">
                      <div className="rounded-2xl bg-orange-100 p-4">
                        <p className="text-sm font-bold uppercase text-orange-700">
                          Downtime
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-orange-950">
                          {row.downtimeMinutes} min
                        </p>
                      </div>

                      <div className="rounded-2xl bg-blue-100 p-4">
                        <p className="text-sm font-bold uppercase text-blue-700">
                          PM Status
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-blue-950">
                          {row.preventiveStatus}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-100 p-4">
                        <p className="text-sm font-bold uppercase text-emerald-700">
                          Morning
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-emerald-950">
                          {row.morningCheck}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-violet-100 p-4">
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
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-slate-900 p-8 text-white shadow-md">
            <h2 className="text-3xl font-extrabold text-cyan-300">
              Maintenance Governance
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                "Morning readiness check two hours before production starts",
                "Immediate maintenance review after production finishes",
                "Preventive maintenance schedule for every critical machine",
                "Public dashboard for maintenance visibility and accountability",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-6">
                  <h3 className="text-xl font-extrabold text-yellow-300">
                    {item}
                  </h3>
                  <p className="mt-4 text-slate-300">
                    Designed to reduce avoidable downtime, protect production
                    flow, and support continuous improvement discipline.
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