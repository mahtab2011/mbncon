"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

  const entryFields = [
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
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Value Added Labour Productivity Module
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Convert Daily Work, Sales, Cost, and Labour Data Into Productivity
            Intelligence
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
            <section className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-emerald-950">
                Input Data Sources
              </h2>

              <div className="mt-8 grid gap-4">
                {inputSources.map((item) => {
                  const id = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${id}`}
                      className="scroll-mt-28 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-lg font-bold text-emerald-950 transition duration-300 hover:-translate-y-1 hover:bg-emerald-100 hover:shadow-lg"
                    >
                      <span id={id}>{item}</span>
                    </a>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-md">
              <h2 className="text-3xl font-extrabold text-blue-950">
                Productivity Outputs
              </h2>

              <div className="mt-8 grid gap-4">
                {outputs.map((item) => {
                  const id = slugify(item);

                  return (
                    <a
                      key={item}
                      href={`#${id}`}
                      className="scroll-mt-28 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-lg font-bold text-blue-950 transition duration-300 hover:-translate-y-1 hover:bg-blue-100 hover:shadow-lg"
                    >
                      <span id={id}>{item}</span>
                    </a>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="mt-10 rounded-3xl bg-yellow-100 p-8 shadow-md transition duration-300 hover:shadow-xl">
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
          </section>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            <section
              id={slugify("Data Entry Simulation")}
              className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-md xl:col-span-2"
            >
              <h2 className="text-3xl font-extrabold text-violet-950">
                Data Entry Simulation
              </h2>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {entryFields.map((label) => {
                  const id = slugify(label);

                  return (
                    <label
                      key={label}
                      id={id}
                      className="scroll-mt-28 block"
                    >
                      <span className="font-bold text-slate-700">
                        {label}
                      </span>

                      <input
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-600 focus:bg-white"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </label>
                  );
                })}
              </div>

              <button className="mt-8 rounded-2xl bg-violet-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition duration-300 hover:bg-violet-800 hover:shadow-xl">
                Calculate Productivity
              </button>
            </section>

            <section
              id={slugify("Output Viewer")}
              className="scroll-mt-28 rounded-3xl bg-slate-900 p-8 text-white shadow-md"
            >
              <h2 className="text-3xl font-extrabold text-cyan-300">
                Output Viewer
              </h2>

              <div className="mt-8 space-y-5">
                {[
                  {
                    title: "Value Added",
                    value: "£18,500",
                  },
                  {
                    title: "Per Employee",
                    value: "£462",
                  },
                  {
                    title: "Per Labour Hour",
                    value: "£57.80",
                  },
                ].map((item) => {
                  const id = slugify(item.title);

                  return (
                    <div
                      key={item.title}
                      id={id}
                      className="scroll-mt-28 rounded-2xl bg-white/10 p-5 transition duration-300 hover:bg-white/20 hover:shadow-xl"
                    >
                      <p className="text-sm font-bold uppercase tracking-wide text-slate-300">
                        {item.title}
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-yellow-300">
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <section
            id={slugify("Who Views the Output")}
            className="scroll-mt-28 mt-10 rounded-3xl bg-blue-100 p-8 shadow-md transition duration-300 hover:shadow-xl"
          >
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
          </section>
        </div>
      </section>
    </main>
  );
}