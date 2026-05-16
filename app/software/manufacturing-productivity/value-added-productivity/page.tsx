"use client";

export default function ValueAddedProductivityPage() {
  const inputSources = [
    "Cashier / Sales Entry",
    "Production Output Entry",
    "Staff Attendance Entry",
    "Supervisor Quality Entry",
    "Manager Cost Entry",
    "Purchasing / Material Cost Entry",
  ];

  const outputs = [
    "Value Added Per Employee",
    "Value Added Per Labour Hour",
    "Team Productivity Comparison",
    "Department Productivity Ranking",
    "Cost Leakage Visibility",
    "Management Improvement Priorities",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-emerald-900 via-blue-900 to-violet-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Value Added Labour Productivity Module
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Convert Daily Work, Sales, Cost, and Labour Data Into Productivity Intelligence
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            This module shows how operational inputs from cashiers, production
            teams, staff, supervisors, and managers can be converted into value
            added productivity outputs for improvement teams, managers, owners,
            and top management.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-emerald-950">
                Input Data Sources
              </h2>

              <div className="mt-8 grid gap-4">
                {inputSources.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-lg font-bold text-emerald-950"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-blue-950">
                Productivity Outputs
              </h2>

              <div className="mt-8 grid gap-4">
                {outputs.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-lg font-bold text-blue-950"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-linear-to-r from-yellow-100 via-orange-100 to-red-100 p-8 shadow-md">
            <h2 className="text-3xl font-extrabold text-red-950">
              Value Added Productivity Formula
            </h2>

            <p className="mt-5 text-xl leading-relaxed text-red-950">
              Value Added = Sales or Output Value - Material Cost - Bought-in
              Services - Direct External Costs
            </p>

            <p className="mt-4 text-xl leading-relaxed text-red-950">
              Labour Productivity = Value Added ÷ Employees or Total Labour
              Hours
            </p>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-md xl:col-span-2">
              <h2 className="text-3xl font-extrabold text-violet-950">
                Data Entry Simulation
              </h2>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {[
                  "Daily Sales / Output Value",
                  "Material Cost",
                  "Bought-in Services",
                  "Direct External Costs",
                  "Total Employees",
                  "Total Labour Hours",
                  "Department",
                  "Team / Line",
                  "Supervisor",
                  "Shift",
                ].map((label) => (
                  <label key={label} className="block">
                    <span className="font-bold text-slate-700">{label}</span>
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-violet-600"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </label>
                ))}
              </div>

              <button className="mt-8 rounded-2xl bg-violet-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-violet-800">
                Calculate Productivity
              </button>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-md">
              <h2 className="text-3xl font-extrabold text-cyan-300">
                Output Viewer
              </h2>

              <div className="mt-8 space-y-5">
                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
                    Value Added
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-yellow-300">
                    £18,500
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
                    Per Employee
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-yellow-300">
                    £462
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-5">
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
                    Per Labour Hour
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-yellow-300">
                    £57.80
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-blue-100 p-8 shadow-md">
            <h2 className="text-3xl font-extrabold text-blue-950">
              Who Views the Output?
            </h2>

            <p className="mt-5 text-xl leading-relaxed text-blue-950">
              The productivity improvement team can review team-level and
              department-level trends. Managers can monitor labour efficiency,
              cost leakage, and improvement priorities. Top management and
              owners can view value added performance, profitability direction,
              and strategic productivity opportunities.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}