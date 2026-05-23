"use client";

import DashboardShell from "@/components/software/DashboardShell";

const intelligenceAreas = [
  "Room occupancy analysis",
  "Housekeeping productivity",
  "Guest check-in delay tracking",
  "Guest complaint intelligence",
  "Maintenance request monitoring",
  "Room revenue optimization",
  "Staff deployment planning",
  "Food and beverage cost control",
  "Guest retention risk",
  "Energy and utility cost monitoring",
];

const kpis = [
  { label: "Occupancy", value: "81%", note: "Room demand remains strong" },
  { label: "Housekeeping Delay", value: "Medium", note: "Turnaround pressure visible" },
  { label: "Guest Complaint Risk", value: "Watch", note: "Service feedback requires review" },
  { label: "Utility Cost Risk", value: "11%", note: "Energy use needs monitoring" },
];

const actions = [
  "Improve room turnaround and housekeeping flow",
  "Track guest complaints and service recovery",
  "Monitor maintenance requests by priority",
  "Optimize staffing by occupancy pattern",
  "Reduce utility cost leakage",
  "Improve guest retention through service intelligence",
];

export default function AIResidentialHotelIntelligencePage() {
  return (
    <DashboardShell title="AI Residential Hotel Intelligence">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-8">
            <p className="text-sm font-semibold text-cyan-300">
              MBNCON AI Transformation Division
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              AI Residential Hotel Intelligence
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              This module helps residential hotels improve occupancy visibility,
              housekeeping performance, guest service quality, maintenance control,
              room revenue, staffing efficiency and operational cost management.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {kpis.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-slate-900 p-5"
              >
                <p className="text-sm text-slate-400">{item.label}</p>

                <h2 className="mt-2 text-3xl font-bold text-cyan-300">
                  {item.value}
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  {item.note}
                </p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                Hotel Intelligence Areas
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {intelligenceAreas.map((area) => (
                  <div
                    key={area}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-200"
                  >
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h2 className="text-2xl font-bold">
                AI Recommended Actions
              </h2>

              <div className="mt-5 space-y-3">
                {actions.map((action, index) => (
                  <div
                    key={action}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4"
                  >
                    <p className="text-sm text-cyan-200">
                      {index + 1}. {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold">
              Executive Summary
            </h2>

            <p className="mt-4 max-w-5xl text-slate-300">
              MBNCON AI Residential Hotel Intelligence converts daily hotel
              operations, guest service signals, housekeeping flow and revenue
              data into practical management insight. It helps hotel owners improve
              service quality, reduce cost leakage, increase room productivity and
              protect guest satisfaction.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}