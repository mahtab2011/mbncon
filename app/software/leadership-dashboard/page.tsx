"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const performanceData = [
  { name: "Leadership", score: 82 },
  { name: "Production", score: 74 },
  { name: "Quality", score: 69 },
  { name: "Logistics", score: 71 },
  { name: "Procurement", score: 77 },
  { name: "Customer", score: 85 },
];

const riskData = [
  { name: "Stable", value: 45 },
  { name: "Moderate", value: 30 },
  { name: "High Risk", value: 15 },
  { name: "Critical", value: 10 },
];

const trendData = [
  { month: "Jan", score: 58 },
  { month: "Feb", score: 62 },
  { month: "Mar", score: 67 },
  { month: "Apr", score: 70 },
  { month: "May", score: 74 },
  { month: "Jun", score: 81 },
];

const COLORS = ["#22c55e", "#eab308", "#f97316", "#dc2626"];

const kpis = [
  ["Overall Performance", "81%", "text-green-400"],
  ["Leadership Stability", "84%", "text-blue-400"],
  ["Operational Risk", "27%", "text-orange-400"],
  ["Customer Confidence", "88%", "text-purple-400"],
];

const intelligenceCards = [
  {
    title: "Adaptive Leadership",
    tone: "text-blue-300",
    body:
      "Strong adaptive leadership capacity identified. Leadership team demonstrates emotional stability, stakeholder engagement and conflict orchestration.",
  },
  {
    title: "Operational Bottlenecks",
    tone: "text-orange-300",
    body:
      "Moderate bottlenecks detected in quality control and logistics synchronization. Kaizen intervention and workflow balancing recommended.",
  },
  {
    title: "Strategic Recommendation",
    tone: "text-green-300",
    body:
      "Continue lean optimization, leadership coaching, trust rebuilding, supplier diversification and continuous improvement implementation.",
  },
];

export default function LeadershipDashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <section
          id={slugify("MBNCON Leadership Intelligence Dashboard")}
          className="scroll-mt-28 rounded-3xl bg-linear-to-r from-indigo-700 to-blue-700 p-10 shadow-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
            MBNCON Executive Leadership Intelligence
          </p>

          <h1 className="mt-3 text-5xl font-bold">
            MBNCON Leadership Intelligence Dashboard
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-blue-100">
            Executive operational intelligence system integrating adaptive
            leadership, manufacturing diagnostics, organizational trust,
            conflict orchestration, lean systems and performance analytics.
          </p>
        </section>

        <section
          id={slugify("Leadership KPI Cards")}
          className="scroll-mt-28 grid gap-6 md:grid-cols-4"
        >
          {kpis.map(([label, value, tone]) => (
            <a
              key={label}
              id={slugify(label)}
              href={`#${slugify(label)}`}
              className="scroll-mt-28 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition hover:-translate-y-1 hover:border-blue-400/50 hover:bg-blue-950/30 hover:shadow-xl"
            >
              <p className="text-neutral-400">{label}</p>

              <h2 className={`mt-3 text-5xl font-bold ${tone}`}>
                {value}
              </h2>
            </a>
          ))}
        </section>

        <section
          id={slugify("Leadership Analytics Charts")}
          className="scroll-mt-28 grid gap-8 lg:grid-cols-2"
        >
          <ChartCard title="Department Performance Scores">
            <div className="h-88 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="name" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />

                  <Bar
                    dataKey="score"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Organizational Risk Distribution">
            <div className="h-88">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskData} dataKey="value" outerRadius={120} label>
                    {riskData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </section>

        <ChartCard title="Leadership and Operational Growth Trend">
          <div className="h-100 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />

                <XAxis dataKey="month" stroke="#ccc" />

                <YAxis stroke="#ccc" />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22c55e"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <section
          id={slugify("Leadership Intelligence Recommendations")}
          className="scroll-mt-28 grid gap-6 md:grid-cols-3"
        >
          {intelligenceCards.map((card) => (
            <a
              key={card.title}
              id={slugify(card.title)}
              href={`#${slugify(card.title)}`}
              className="scroll-mt-28 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition hover:-translate-y-1 hover:border-blue-400/50 hover:bg-blue-950/30 hover:shadow-xl"
            >
              <h2 className={`text-xl font-bold ${card.tone}`}>
                {card.title}
              </h2>

              <p className="mt-4 leading-8 text-neutral-300">
                {card.body}
              </p>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={slugify(title)}
      className="scroll-mt-28 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-xl"
    >
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      {children}
    </section>
  );
}