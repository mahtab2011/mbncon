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

const COLORS = [
  "#22c55e",
  "#eab308",
  "#f97316",
  "#dc2626",
];

export default function LeadershipDashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl bg-linear-to-r from-indigo-700 to-blue-700 p-10 shadow-2xl">
          <h1 className="text-5xl font-bold">
            MBNCON Leadership Intelligence Dashboard
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-blue-100">
            Executive operational intelligence system integrating
            adaptive leadership, manufacturing diagnostics,
            organizational trust, conflict orchestration,
            lean systems and performance analytics.
          </p>
        </div>

        <div className="grid gap-6 mt-10 md:grid-cols-4">
          <div className="rounded-2xl bg-neutral-900 p-6 border border-neutral-800">
            <p className="text-neutral-400">
              Overall Performance
            </p>

            <h2 className="text-5xl font-bold text-green-400 mt-3">
              81%
            </h2>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6 border border-neutral-800">
            <p className="text-neutral-400">
              Leadership Stability
            </p>

            <h2 className="text-5xl font-bold text-blue-400 mt-3">
              84%
            </h2>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6 border border-neutral-800">
            <p className="text-neutral-400">
              Operational Risk
            </p>

            <h2 className="text-5xl font-bold text-orange-400 mt-3">
              27%
            </h2>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6 border border-neutral-800">
            <p className="text-neutral-400">
              Customer Confidence
            </p>

            <h2 className="text-5xl font-bold text-purple-400 mt-3">
              88%
            </h2>
          </div>
        </div>

        <div className="grid gap-8 mt-12 lg:grid-cols-2">
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-2xl font-bold mb-6">
              Department Performance Scores
            </h2>

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
          </div>

          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-2xl font-bold mb-6">
              Organizational Risk Distribution
            </h2>

            <div className="h-88">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    dataKey="value"
                    outerRadius={120}
                    label
                  >
                    {riskData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 mt-12">
          <h2 className="text-2xl font-bold mb-6">
            Leadership & Operational Growth Trend
          </h2>

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
        </div>

        <div className="grid gap-6 mt-12 md:grid-cols-3">
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-xl font-bold text-blue-300">
              Adaptive Leadership
            </h2>

            <p className="mt-4 text-neutral-300 leading-8">
              Strong adaptive leadership capacity identified.
              Leadership team demonstrates emotional stability,
              stakeholder engagement and conflict orchestration.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-xl font-bold text-orange-300">
              Operational Bottlenecks
            </h2>

            <p className="mt-4 text-neutral-300 leading-8">
              Moderate bottlenecks detected in quality control
              and logistics synchronization. Kaizen intervention
              and workflow balancing recommended.
            </p>
          </div>

          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
            <h2 className="text-xl font-bold text-green-300">
              Strategic Recommendation
            </h2>

            <p className="mt-4 text-neutral-300 leading-8">
              Continue lean optimization, leadership coaching,
              trust rebuilding, supplier diversification and
              continuous improvement implementation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}