"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const productionByDepartment = [
  { department: "Cutting", output: 2456 },
  { department: "Sewing Line 1", output: 3782 },
  { department: "Sewing Line 2", output: 3215 },
  { department: "Sewing Line 3", output: 2105 },
  { department: "Finishing", output: 4812 },
  { department: "Packing", output: 2372 },
];

const dailyTrend = [
  { day: "Day 1", output: 2312 },
  { day: "Day 2", output: 2658 },
  { day: "Day 3", output: 2947 },
  { day: "Day 4", output: 2487 },
  { day: "Day 5", output: 2201 },
  { day: "Day 6", output: 2896 },
  { day: "Day 7", output: 3229 },
];

const downtimeReasons = [
  { reason: "Machine Breakdown", value: 38 },
  { reason: "Manpower Delay", value: 24 },
  { reason: "Material Shortage", value: 16 },
  { reason: "Method Issue", value: 12 },
  { reason: "Others", value: 10 },
];

const paretoIssues = [
  { issue: "Machine Breakdown", impact: 38, cumulative: 38 },
  { issue: "Manpower Delay", impact: 24, cumulative: 62 },
  { issue: "Material Shortage", impact: 16, cumulative: 78 },
  { issue: "Method Issue", impact: 12, cumulative: 90 },
  { issue: "Others", impact: 10, cumulative: 100 },
];
export default function AutoDataAnalysisPage() {
  const totalProduction = productionByDepartment.reduce(
    (sum, item) => sum + item.output,
    0
  );

  const lowestDepartment = productionByDepartment.reduce((lowest, item) =>
    item.output < lowest.output ? item : lowest
  );

  const highestDowntime = downtimeReasons.reduce((highest, item) =>
    item.value > highest.value ? item : highest
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold text-slate-900">
        AI Performance Analytics & Investigation Intelligence
      </h1>

      <p className="mt-2 text-slate-600">
        Auto data analysis for production performance, bottleneck signals,
        downtime causes, and investigation recommendations.
      </p>

      <section className="mt-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Total Production
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {totalProduction.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Lowest Output Area
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-700">
            {lowestDepartment.department}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Highest Downtime Cause
          </p>

          <h2 className="mt-3 text-3xl font-bold text-orange-700">
            {highestDowntime.reason}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-slate-500">
            Recommended Priority
          </p>

          <h2 className="mt-3 text-4xl font-bold text-red-700">
            High
          </h2>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold text-slate-800">
            Production by Department
          </h2>

                    <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionByDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="output" name="Output pcs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Downtime Distribution
          </h2>

                    <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={downtimeReasons}
                  dataKey="value"
                  nameKey="reason"
                  outerRadius={110}
                  label
                >
                  {downtimeReasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Seven Day Production Trend
        </h2>

                  <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="output"
                  name="Output pcs"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
      </section>
      <section className="mt-10 rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-slate-800">
          Pareto Analysis: Top Loss Causes
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          80/20 view of the major causes affecting factory performance.
        </p>

        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paretoIssues}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="issue" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impact" name="Impact %" />
              <Line
                type="monotone"
                dataKey="cumulative"
                name="Cumulative %"
                strokeWidth={3}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

            <section className="mt-10 rounded-xl bg-slate-900 p-6 text-white shadow">
        <h2 className="text-2xl font-bold">
          AI Investigation Summary
        </h2>

        <div className="mt-6 space-y-4 text-slate-200">
          <p>
            Sewing Line 3 is showing the lowest production output and should be
            reviewed first.
          </p>

          <p>
            Machine Breakdown is the highest downtime contributor and should be
            investigated through machine utilization study and maintenance
            history review.
          </p>

          <p>
            Recommended investigation techniques: Method Study, Activity
            Sampling, Time Study, Machine Utilization Study, and Root Cause
            Analysis.
          </p>

          <div className="mt-8 rounded-xl bg-slate-800 p-6">
            <h3 className="text-xl font-bold text-cyan-300">
              AI Investigation Recommendation
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-400">
                  Investigation Priority
                </p>

                <p className="mt-1 text-3xl font-bold text-red-400">
                  CRITICAL
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Department
                </p>

                <p className="mt-1 text-3xl font-bold text-orange-300">
                  Sewing Line 3
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Expected Productivity Improvement
                </p>

                <p className="mt-1 text-3xl font-bold text-green-400">
                  12–18%
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Estimated Annual Saving
                </p>

                <p className="mt-1 text-3xl font-bold text-cyan-300">
                  £85,000
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  AI Confidence Score
                </p>

                <p className="mt-1 text-3xl font-bold text-emerald-400">
                  94%
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Based on production, downtime, and trend analysis.
                </p>
              </div>

              <div className="md:col-span-2 rounded-xl border border-cyan-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-cyan-300">
                  AI Evidence Summary
                </h4>

                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  <li>✓ Production output is 32% below department average.</li>
                  <li>✓ Downtime has increased continuously over the last 7 days.</li>
                  <li>✓ Machine Breakdown is the highest recorded loss category.</li>
                  <li>✓ Pareto analysis shows 62% of losses originate from the first two causes.</li>
                  <li>✓ Trend analysis indicates continuing deterioration if no action is taken.</li>
                </ul>
              </div>

              <div className="md:col-span-2 rounded-xl border border-emerald-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-emerald-300">
                  Recommended Investigation Techniques
                </h4>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="font-semibold text-cyan-300">Method Study</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="font-semibold text-cyan-300">Activity Sampling</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="font-semibold text-cyan-300">Time Study</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="font-semibold text-cyan-300">Machine Utilization</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="font-semibold text-cyan-300">Root Cause Analysis</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="font-semibold text-cyan-300">Line Balancing</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl border border-amber-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-amber-300">
                  AI Investigation Action Plan
                </h4>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-300">
                        <th className="py-2 text-left">Action</th>
                        <th className="py-2 text-left">Owner</th>
                        <th className="py-2 text-left">Duration</th>
                        <th className="py-2 text-left">Priority</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-b border-slate-800">
                        <td className="py-3">Conduct Method Study</td>
                        <td>Industrial Engineer</td>
                        <td>1 Day</td>
                        <td className="font-semibold text-red-400">Critical</td>
                      </tr>

                      <tr className="border-b border-slate-800">
                        <td className="py-3">Perform Activity Sampling</td>
                        <td>IE Team</td>
                        <td>2 Days</td>
                        <td className="font-semibold text-orange-400">High</td>
                      </tr>

                      <tr className="border-b border-slate-800">
                        <td className="py-3">Review Machine History</td>
                        <td>Maintenance Manager</td>
                        <td>1 Day</td>
                        <td className="font-semibold text-yellow-400">Medium</td>
                      </tr>

                      <tr>
                        <td className="py-3">Present Investigation Report</td>
                        <td>Factory Manager</td>
                        <td>Half Day</td>
                        <td className="font-semibold text-green-400">Normal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl border border-blue-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-blue-300">
                  Expected Business Impact
                </h4>

                <div className="mt-5 grid gap-5 md:grid-cols-4">
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Productivity Gain</p>
                    <p className="mt-2 text-3xl font-bold text-green-400">+15%</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Downtime Reduction</p>
                    <p className="mt-2 text-3xl font-bold text-cyan-300">-22%</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Quality Improvement</p>
                    <p className="mt-2 text-3xl font-bold text-yellow-300">+11%</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Estimated Annual Saving</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-400">£85K</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl border border-violet-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-violet-300">
                  Investigation Readiness Score
                </h4>

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">
                      Overall Readiness
                    </span>

                    <span className="text-4xl font-bold text-violet-300">
                      91%
                    </span>
                  </div>

                  <div className="mt-4 h-5 rounded-full bg-slate-700">
                    <div
                      className="h-5 rounded-full bg-violet-500"
                      style={{ width: "91%" }}
                    />
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-slate-800 p-4 text-center">
                      <p className="text-sm text-slate-400">Production Data</p>
                      <p className="mt-2 font-bold text-green-400">Complete</p>
                    </div>

                    <div className="rounded-lg bg-slate-800 p-4 text-center">
                      <p className="text-sm text-slate-400">Downtime Data</p>
                      <p className="mt-2 font-bold text-green-400">Complete</p>
                    </div>

                    <div className="rounded-lg bg-slate-800 p-4 text-center">
                      <p className="text-sm text-slate-400">Quality Data</p>
                      <p className="mt-2 font-bold text-yellow-300">Partial</p>
                    </div>

                    <div className="rounded-lg bg-slate-800 p-4 text-center">
                      <p className="text-sm text-slate-400">IE Observation</p>
                      <p className="mt-2 font-bold text-red-400">Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl border border-indigo-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-indigo-300">
                  Recommended Investigation Team
                </h4>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-300">
                        <th className="py-2 text-left">Role</th>
                        <th className="py-2 text-left">Responsibility</th>
                        <th className="py-2 text-left">Participation</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-b border-slate-800">
                        <td className="py-3">Industrial Engineer</td>
                        <td>Lead Investigation</td>
                        <td className="font-semibold text-green-400">Mandatory</td>
                      </tr>

                      <tr className="border-b border-slate-800">
                        <td className="py-3">Production Manager</td>
                        <td>Production Support</td>
                        <td className="font-semibold text-green-400">Mandatory</td>
                      </tr>

                      <tr className="border-b border-slate-800">
                        <td className="py-3">Maintenance Engineer</td>
                        <td>Machine Assessment</td>
                        <td className="font-semibold text-yellow-300">If Required</td>
                      </tr>

                      <tr className="border-b border-slate-800">
                        <td className="py-3">Quality Manager</td>
                        <td>Quality Verification</td>
                        <td className="font-semibold text-yellow-300">If Required</td>
                      </tr>

                      <tr>
                        <td className="py-3">Department Supervisor</td>
                        <td>Operational Support</td>
                        <td className="font-semibold text-green-400">Mandatory</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl border border-teal-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-teal-300">
                  AI Investigation Timeline
                </h4>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-slate-800 p-4">
                    <div>
                      <p className="font-semibold text-white">Day 1</p>
                      <p className="text-sm text-slate-400">
                        Method Study & Initial Observation
                      </p>
                    </div>

                    <span className="rounded bg-green-600 px-3 py-1 text-sm">
                      Planned
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-800 p-4">
                    <div>
                      <p className="font-semibold text-white">Day 2–3</p>
                      <p className="text-sm text-slate-400">
                        Activity Sampling & Time Study
                      </p>
                    </div>

                    <span className="rounded bg-blue-600 px-3 py-1 text-sm">
                      Planned
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-800 p-4">
                    <div>
                      <p className="font-semibold text-white">Day 4</p>
                      <p className="text-sm text-slate-400">
                        Root Cause Analysis & Validation
                      </p>
                    </div>

                    <span className="rounded bg-amber-600 px-3 py-1 text-sm">
                      Pending
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-800 p-4">
                    <div>
                      <p className="font-semibold text-white">Day 5</p>
                      <p className="text-sm text-slate-400">
                        Final Report & Management Presentation
                      </p>
                    </div>

                                        <span className="rounded bg-slate-600 px-3 py-1 text-sm">
                      Scheduled
                    </span>
                  </div>
                </div>

              </div>

              <div className="md:col-span-2 rounded-xl border border-green-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-green-300">
                  Before vs After Improvement Projection
                </h4>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Current Efficiency
                    </p>

                    <p className="mt-2 text-3xl font-bold text-red-400">
                      62%
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Target Efficiency
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-400">
                      76%
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Expected Improvement
                    </p>

                    <p className="mt-2 text-3xl font-bold text-cyan-300">
                      +14%
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  Projection is based on reduction of machine downtime, better
                  line balancing, improved method control, and reduced waiting
                  time.
                </p>
              </div>
              <div className="md:col-span-2 rounded-xl border border-purple-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-purple-300">
                  Investigation Report Readiness
                </h4>

                <div className="mt-5 grid gap-5 md:grid-cols-4">
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Data Analysis
                    </p>

                    <p className="mt-2 font-bold text-green-400">
                      Ready
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      IE Findings
                    </p>

                    <p className="mt-2 font-bold text-yellow-300">
                      Pending
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Evidence
                    </p>

                    <p className="mt-2 font-bold text-yellow-300">
                      Partial
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Management Review
                    </p>

                    <p className="mt-2 font-bold text-red-400">
                      Not Started
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  The final investigation report can be generated after IE
                  observations, evidence upload, and management review are completed.
                </p>
              </div>
                            <div className="md:col-span-2 rounded-xl border border-orange-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-orange-300">
                  Evidence Collection Status
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Production Records
                    </p>

                    <p className="mt-2 text-sm text-green-400">
                      Uploaded / Available
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Machine Downtime Log
                    </p>

                    <p className="mt-2 text-sm text-green-400">
                      Uploaded / Available
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      IE Observation Notes
                    </p>

                    <p className="mt-2 text-sm text-yellow-300">
                      Pending
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Photos / Videos
                    </p>

                    <p className="mt-2 text-sm text-yellow-300">
                      Partial
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Operator Interview
                    </p>

                    <p className="mt-2 text-sm text-red-400">
                      Not Started
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Supervisor Comments
                    </p>

                    <p className="mt-2 text-sm text-yellow-300">
                      Pending
                    </p>
                  </div>
                </div>
              </div>
                            <div className="md:col-span-2 rounded-xl border border-red-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-red-300">
                  Root Cause Analysis Readiness
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      5 Whys Analysis
                    </p>

                    <p className="mt-2 text-sm text-yellow-300">
                      Ready to Start
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Fishbone Diagram
                    </p>

                    <p className="mt-2 text-sm text-yellow-300">
                      Ready to Prepare
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Pareto Evidence
                    </p>

                    <p className="mt-2 text-sm text-green-400">
                      Available
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Management Validation
                    </p>

                    <p className="mt-2 text-sm text-red-400">
                      Pending
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  Root cause analysis should begin after IE observation notes,
                  operator interview, and supervisor comments are completed.
                </p>
              </div>
                            <div className="md:col-span-2 rounded-xl border border-lime-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-lime-300">
                  Corrective Action Readiness
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-4">

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Action Plan
                    </p>

                    <p className="mt-2 font-bold text-green-400">
                      Ready
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Responsible Person
                    </p>

                    <p className="mt-2 font-bold text-yellow-300">
                      Assign
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Target Date
                    </p>

                    <p className="mt-2 font-bold text-yellow-300">
                      Set Date
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Verification
                    </p>

                    <p className="mt-2 font-bold text-red-400">
                      Pending
                    </p>
                  </div>

                </div>

                <p className="mt-5 text-sm text-slate-400">
                  Corrective actions should only be released after the root causes
                  have been confirmed and approved by the investigation team.
                </p>

              </div>
                            <div className="md:col-span-2 rounded-xl border border-sky-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-sky-300">
                  AI Expected Outcome
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-4">

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Productivity
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-400">
                      +15%
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Efficiency
                    </p>

                    <p className="mt-2 text-3xl font-bold text-cyan-300">
                      +14%
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Downtime
                    </p>

                    <p className="mt-2 text-3xl font-bold text-red-300">
                      -22%
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Annual Saving
                    </p>

                    <p className="mt-2 text-3xl font-bold text-emerald-400">
                      £85K
                    </p>
                  </div>

                </div>

                <p className="mt-5 text-sm text-slate-400">
                  These projections are AI estimates based on the current
                  investigation findings and will be recalculated after
                  corrective actions are implemented.
                </p>

              </div>
                            <div className="md:col-span-2 rounded-xl border border-emerald-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-emerald-300">
                  Investigation Completion Checklist
                </h4>

                <div className="mt-5 grid gap-3">

                  <label className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <input type="checkbox" checked readOnly />
                    <span>Production data analysed</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <input type="checkbox" checked readOnly />
                    <span>Downtime analysed</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <input type="checkbox" readOnly />
                    <span>Method Study completed</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <input type="checkbox" readOnly />
                    <span>Root Cause verified</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <input type="checkbox" readOnly />
                    <span>Corrective Action implemented</span>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
                    <input type="checkbox" readOnly />
                    <span>Performance improvement verified</span>
                  </label>

                </div>

                <p className="mt-5 text-sm text-slate-400">
                  The investigation should only be closed after every checklist
                  item has been completed and verified.
                </p>

              </div>
                            <div className="md:col-span-2 rounded-xl border border-yellow-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-yellow-300">
                  Management Approval Status
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-4">

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      IE Manager
                    </p>

                    <p className="mt-2 font-bold text-green-400">
                      Approved
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Production Manager
                    </p>

                    <p className="mt-2 font-bold text-yellow-300">
                      Pending
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Factory Manager
                    </p>

                    <p className="mt-2 font-bold text-yellow-300">
                      Pending
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Investigation Closed
                    </p>

                    <p className="mt-2 font-bold text-red-400">
                      No
                    </p>
                  </div>

                </div>

                <p className="mt-5 text-sm text-slate-400">
                  The investigation can only be closed after all required
                  approvals have been received and corrective actions have been
                  verified.
                </p>

              </div>
                            <div className="md:col-span-2 rounded-xl border border-cyan-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-cyan-300">
                  Interactive IE Tools
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <button className="rounded-lg bg-slate-800 p-4 text-left transition hover:bg-slate-700">
                    <p className="font-semibold text-white">
                      Time Study Stopwatch
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Record cycle time, observed time, rating, and allowances.
                    </p>
                  </button>

                  <button className="rounded-lg bg-slate-800 p-4 text-left transition hover:bg-slate-700">
                    <p className="font-semibold text-white">
                      Activity Sampling
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Capture working, idle, waiting, movement, and rework samples.
                    </p>
                  </button>

                  <button className="rounded-lg bg-slate-800 p-4 text-left transition hover:bg-slate-700">
                    <p className="font-semibold text-white">
                      5 Whys Analysis
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Investigate the deeper cause behind repeated performance loss.
                    </p>
                  </button>

                  <button className="rounded-lg bg-slate-800 p-4 text-left transition hover:bg-slate-700">
                    <p className="font-semibold text-white">
                      Fishbone Diagram
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Organize causes under Man, Machine, Method, Material, and Management.
                    </p>
                  </button>

                  <button className="rounded-lg bg-slate-800 p-4 text-left transition hover:bg-slate-700">
                    <p className="font-semibold text-white">
                      Evidence Upload
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Attach photos, videos, notes, documents, and investigation proof.
                    </p>
                  </button>

                  <button className="rounded-lg bg-slate-800 p-4 text-left transition hover:bg-slate-700">
                    <p className="font-semibold text-white">
                      Final Report Generator
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      Prepare management-ready investigation summary and action report.
                    </p>
                  </button>
                </div>
              </div>
                            <div className="md:col-span-2 rounded-xl border border-blue-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-blue-300">
                  Time Study Stopwatch Preview
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Observed Time</p>
                    <p className="mt-2 text-3xl font-bold text-cyan-300">0.00s</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Rating</p>
                    <p className="mt-2 text-3xl font-bold text-yellow-300">100%</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Allowance</p>
                    <p className="mt-2 text-3xl font-bold text-green-400">15%</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Standard Time</p>
                    <p className="mt-2 text-3xl font-bold text-purple-300">0.00s</p>
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  This preview will later become a live stopwatch for recording cycle
                  time, rating, allowance, and calculated standard time.
                </p>
              </div>
                            <div className="md:col-span-2 rounded-xl border border-pink-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-pink-300">
                  Activity Sampling Preview
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-5">
                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Working</p>
                    <p className="mt-2 text-3xl font-bold text-green-400">48%</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Idle</p>
                    <p className="mt-2 text-3xl font-bold text-red-400">18%</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Waiting</p>
                    <p className="mt-2 text-3xl font-bold text-yellow-300">14%</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Movement</p>
                    <p className="mt-2 text-3xl font-bold text-cyan-300">12%</p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">Rework</p>
                    <p className="mt-2 text-3xl font-bold text-orange-300">8%</p>
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-400">
                  This preview will later become a live sampling tool for recording
                  operator activity, idle time, waiting, movement, and rework observations.
                </p>
              </div>
                            <div className="md:col-span-2 rounded-xl border border-red-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-red-300">
                  5 Whys Analysis Preview
                </h4>

                <div className="mt-5 space-y-3">
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Why 1</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Why is Sewing Line 3 output low?
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Why 2</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Why is machine downtime increasing?
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Why 3</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Why is preventive maintenance not controlling stoppages?
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Why 4</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Why are repeated faults not being escalated?
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Why 5</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Why is there no closed-loop corrective action tracking?
                    </p>
                  </div>
                </div>
              </div>
                            <div className="md:col-span-2 rounded-xl border border-teal-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-teal-300">
                  Fishbone Diagram Preview
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Man</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Skill gap, absenteeism, fatigue, poor training.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Machine</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Breakdown, low utilization, poor maintenance.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Method</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Inefficient operation method and poor line balance.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Material</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Late input, quality variation, missing trims.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Measurement</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Wrong target, weak reporting, late data update.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">Management</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Slow decision, weak follow-up, unclear ownership.
                    </p>
                  </div>
                </div>
              </div>
                            <div className="md:col-span-2 rounded-xl border border-rose-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-rose-300">
                  AI Investigation Risk Assessment
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-4">

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Production Risk
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-400">
                      HIGH
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Delivery Risk
                    </p>

                    <p className="mt-2 text-2xl font-bold text-yellow-300">
                      MEDIUM
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Quality Risk
                    </p>

                    <p className="mt-2 text-2xl font-bold text-orange-300">
                      MEDIUM
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Financial Risk
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-400">
                      HIGH
                    </p>
                  </div>

                </div>

                <p className="mt-5 text-sm text-slate-400">
                  AI estimates that immediate investigation is recommended to
                  reduce production loss, shipment delay, and profitability risk.
                </p>

              </div>
                            <div className="md:col-span-2 rounded-xl border border-indigo-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-indigo-300">
                  AI Investigation Decision
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  <div className="rounded-lg bg-slate-800 p-5">
                    <p className="text-sm text-slate-400">
                      Recommended Decision
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-400">
                      Start Full Investigation
                    </p>

                    <p className="mt-3 text-sm text-slate-400">
                      Immediate Industrial Engineering investigation is recommended.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-5">
                    <p className="text-sm text-slate-400">
                      Expected Completion
                    </p>

                    <p className="mt-2 text-2xl font-bold text-cyan-300">
                      5 Working Days
                    </p>

                    <p className="mt-3 text-sm text-slate-400">
                      Includes investigation, validation, corrective actions, and management review.
                    </p>
                  </div>

                </div>

                <p className="mt-5 text-sm text-slate-400">
                  This recommendation is generated from production performance,
                  downtime behaviour, trend analysis, and Industrial Engineering indicators.
                </p>

              </div>
                            <div className="md:col-span-2 rounded-xl border border-emerald-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-emerald-300">
                  AI Investigation Progress Tracker
                </h4>

                <div className="mt-6 space-y-4">

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Data Collection</span>
                      <span>100%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-700">
                      <div className="h-3 w-full rounded-full bg-green-500"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Industrial Engineering Investigation</span>
                      <span>65%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-700">
                      <div className="h-3 w-2/3 rounded-full bg-cyan-500"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Corrective Actions</span>
                      <span>20%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-700">
                      <div className="h-3 w-1/5 rounded-full bg-yellow-500"></div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Final Verification</span>
                      <span>0%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-700">
                      <div className="h-3 w-0 rounded-full bg-red-500"></div>
                    </div>
                  </div>

                </div>

                <p className="mt-5 text-sm text-slate-400">
                  This tracker will automatically update as investigators complete
                  each stage of the investigation process.
                </p>

              </div>
                            <div className="md:col-span-2 rounded-xl border border-fuchsia-700 bg-slate-900/40 p-5">
                <h4 className="text-lg font-bold text-fuchsia-300">
                  Final Investigation Report Generator
                </h4>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Executive Summary
                    </p>

                    <p className="mt-2 text-sm text-green-400">
                      Auto prepared
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Charts & Analysis
                    </p>

                    <p className="mt-2 text-sm text-green-400">
                      Ready
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Root Cause Findings
                    </p>

                    <p className="mt-2 text-sm text-yellow-300">
                      Pending validation
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Corrective Actions
                    </p>

                    <p className="mt-2 text-sm text-yellow-300">
                      Draft ready
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Business Impact
                    </p>

                    <p className="mt-2 text-sm text-green-400">
                      Calculated
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="font-semibold text-white">
                      Approval Page
                    </p>

                    <p className="mt-2 text-sm text-red-400">
                      Awaiting management
                    </p>
                  </div>
                </div>

                <button className="mt-6 rounded-lg bg-fuchsia-600 px-5 py-3 font-semibold text-white transition hover:bg-fuchsia-500">
                  Generate Draft Report
                </button>
              </div>
                            <div className="md:col-span-2 rounded-xl border border-emerald-700 bg-slate-900/40 p-5">

                <h4 className="text-lg font-bold text-emerald-300">
                  AI Investigation Readiness Score
                </h4>

                <div className="mt-6 flex items-center gap-6">

                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald-500 text-4xl font-bold text-emerald-400">
                    92%
                  </div>

                  <div>

                    <p className="text-lg font-semibold text-white">
                      Investigation Ready
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      AI has determined that sufficient production,
                      downtime, quality and investigation evidence has
                      been collected to proceed with a full Industrial
                      Engineering investigation.
                    </p>

                  </div>

                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Data Quality
                    </p>

                    <p className="mt-2 font-bold text-green-400">
                      Excellent
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Evidence
                    </p>

                    <p className="mt-2 font-bold text-green-400">
                      Strong
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Confidence
                    </p>

                    <p className="mt-2 font-bold text-cyan-300">
                      94%
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4 text-center">
                    <p className="text-sm text-slate-400">
                      Recommendation
                    </p>

                    <p className="mt-2 font-bold text-emerald-400">
                      Proceed
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}