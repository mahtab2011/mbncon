"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const productionFields = [
  "Date",
  "Factory / Site",
  "Department / Line",
  "Product / Style",
  "Shift",
  "Supervisor",
  "Target Output",
  "Actual Output",
  "Good Output",
  "Rejected Quantity",
  "Rework Quantity",
  "Machine Downtime Minutes",
  "Material Waiting Minutes",
  "Number of Operators",
  "Absent Staff",
  "Overtime Hours",
];

const intelligenceCards = [
  {
    title: "Why This Data Matters",
    description:
      "Daily floor reports become the foundation for productivity dashboards, rejection analysis, downtime tracking, labour efficiency, and AI-guided improvement recommendations.",
    bg: "bg-yellow-100",
    text: "text-yellow-950",
  },
  {
    title: "Dashboard Connection",
    description:
      "Actual output, target output, rejected quantity, downtime, absenteeism, and operational issues will feed directly into KPI analytics and management decision support.",
    bg: "bg-blue-100",
    text: "text-blue-950",
  },
  {
    title: "Future Live System",
    description:
      "Later this form can save data to Firebase, generate live dashboards, trigger alerts, and create daily improvement summaries for managers and supervisors.",
    bg: "bg-emerald-100",
    text: "text-emerald-950",
  },
];

export default function DailyProductionReportPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section
        id="daily-production-report-overview"
        className="scroll-mt-28 bg-slate-950 px-6 py-16 text-white"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Daily Production Report
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Shop-Floor Data Entry for Live Productivity Intelligence
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            This report captures daily operational activity from the
            production floor so that dashboards, KPI analytics,
            bottleneck analysis, and management decisions are based on
            real operational data.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 xl:grid-cols-3">
            <section
              id="production-entry-form"
              className="scroll-mt-28 rounded-3xl bg-white p-8 shadow-md xl:col-span-2"
            >
              <h2 className="text-3xl font-extrabold text-blue-950">
                Production Entry Form
              </h2>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {productionFields.map((label) => (
                  <section
                    key={label}
                    id={slugify(label)}
                    className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <label className="block">
                      <span className="font-bold text-slate-700">
                        {label}
                      </span>

                      <input
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </label>
                  </section>
                ))}
              </div>

              <section
                id="main-operational-issues"
                className="mt-8 scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <label className="block">
                  <span className="font-bold text-slate-700">
                    Main Operational Issues Today
                  </span>

                  <textarea
                    className="mt-2 min-h-32 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                    placeholder="Example: Machine 4 downtime, material delay, operator skill gap, quality issue..."
                  />
                </label>
              </section>

              <button className="mt-8 rounded-2xl bg-blue-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:-translate-y-1 hover:bg-blue-800">
                Save Daily Report
              </button>
            </section>

            <div className="space-y-6">
              {intelligenceCards.map((card) => (
                <a
                  key={card.title}
                  id={slugify(card.title)}
                  href={`#${slugify(card.title)}`}
                  className={`block rounded-3xl p-8 shadow-md transition hover:-translate-y-1 hover:shadow-xl ${card.bg}`}
                >
                  <h3
                    className={`text-3xl font-extrabold ${card.text}`}
                  >
                    {card.title}
                  </h3>

                  <p
                    className={`mt-5 text-lg leading-relaxed ${card.text}`}
                  >
                    {card.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <section
            id="production-management-intelligence"
            className="mt-12 scroll-mt-28 rounded-3xl bg-slate-900 p-8 text-white shadow-md"
          >
            <h2 className="text-3xl font-extrabold text-cyan-300">
              Production Management Intelligence
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                "Productivity tracking",
                "Downtime analysis",
                "Rejection monitoring",
                "Operator efficiency",
                "Absenteeism control",
                "Shift comparison",
                "Material delay tracking",
                "Daily escalation support",
              ].map((item) => (
                <a
                  key={item}
                  id={slugify(item)}
                  href={`#${slugify(item)}`}
                  className="rounded-2xl bg-white/10 p-6 transition hover:-translate-y-1 hover:bg-white/20"
                >
                  <h3 className="text-xl font-extrabold text-yellow-300">
                    {item}
                  </h3>

                  <p className="mt-4 text-slate-300">
                    Daily operational data supports management
                    visibility, accountability, productivity analysis,
                    and continuous improvement decisions.
                  </p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}