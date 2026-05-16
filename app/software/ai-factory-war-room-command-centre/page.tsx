"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type WarRoomAlert = {
  id: string;
  category:
    | "Production"
    | "Shipment"
    | "Quality"
    | "Buyer"
    | "Energy"
    | "Maintenance";
  title: string;
  department: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  impact: string;
  recommendedAction: string;
};

const demoWarRoomAlerts: WarRoomAlert[] = [
  {
    id: "WR-001",
    category: "Production",
    title: "Line 4 efficiency collapse detected",
    department: "Production",
    severity: "Critical",
    impact:
      "Shipment delay probability increasing rapidly.",
    recommendedAction:
      "Immediate line balancing and manpower intervention required.",
  },
  {
    id: "WR-002",
    category: "Quality",
    title: "Inline rejection spike detected",
    department: "Quality",
    severity: "High",
    impact:
      "Rework exposure and buyer dissatisfaction risk rising.",
    recommendedAction:
      "Escalate inline inspection and conduct root cause analysis.",
  },
  {
    id: "WR-003",
    category: "Energy",
    title: "Abnormal generator fuel consumption",
    department: "Utilities",
    severity: "High",
    impact:
      "Energy cost escalation impacting profitability.",
    recommendedAction:
      "Conduct urgent utility efficiency audit.",
  },
  {
    id: "WR-004",
    category: "Buyer",
    title: "Repeat order probability weakening",
    department: "Commercial",
    severity: "Medium",
    impact:
      "Buyer confidence instability detected.",
    recommendedAction:
      "Initiate proactive buyer engagement and recovery planning.",
  },
];

function getSeverityColor(
  severity: WarRoomAlert["severity"]
) {
  if (severity === "Critical") {
    return "text-red-300 border-red-700/40 bg-red-950/20";
  }

  if (severity === "High") {
    return "text-orange-300 border-orange-700/40 bg-orange-950/20";
  }

  if (severity === "Medium") {
    return "text-yellow-300 border-yellow-700/40 bg-yellow-950/20";
  }

  return "text-green-300 border-green-700/40 bg-green-950/20";
}

function getWarRoomAssessment(
  critical: number,
  high: number
) {
  if (critical >= 2) {
    return "Factory Operational Emergency";
  }

  if (critical >= 1 || high >= 3) {
    return "High Executive Intervention Required";
  }

  if (high >= 1) {
    return "Operational Instability Detected";
  }

  return "Factory Operations Stable";
}

export default function AIFactoryWarRoomCommandCentrePage() {
  const [loading, setLoading] = useState(true);

  const [alerts, setAlerts] = useState<
    WarRoomAlert[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadWarRoomData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoWarRoomAlerts;

        if (active) {
          setAlerts(data);
        }
      } catch (error) {
        console.error(
          "Failed to load factory war room command centre:",
          error
        );

        if (active) {
          setAlerts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWarRoomData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const criticalAlerts = alerts.filter(
      (a) => a.severity === "Critical"
    ).length;

    const highAlerts = alerts.filter(
      (a) =>
        a.severity === "Critical" ||
        a.severity === "High"
    ).length;

    const productionAlerts = alerts.filter(
      (a) => a.category === "Production"
    ).length;

    const qualityAlerts = alerts.filter(
      (a) => a.category === "Quality"
    ).length;

    return {
      criticalAlerts,
      highAlerts,
      productionAlerts,
      qualityAlerts,
      assessment: getWarRoomAssessment(
        criticalAlerts,
        highAlerts
      ),
    };
  }, [alerts]);

  return (
    <DashboardShell title="AI Factory War Room Command Centre">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-red-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-red-300 uppercase tracking-widest text-sm">
              Module 39 · AI Factory War Room Command Centre
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Executive Factory Mission Control Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered factory command centre
              for monitoring operational instability,
              shipment exposure, quality risks,
              buyer threats, energy inefficiency,
              production collapse risks,
              and executive intervention priorities
              across manufacturing operations.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading factory war room intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="rounded-2xl border border-red-700/40 bg-red-950/20 p-5">

                  <p className="text-red-300 text-sm">
                    Critical Alerts
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalAlerts}
                  </h2>

                </div>

                <div className="rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5">

                  <p className="text-orange-300 text-sm">
                    High Priority Alerts
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.highAlerts}
                  </h2>

                </div>

                <div className="rounded-2xl border border-cyan-700/40 bg-cyan-950/20 p-5">

                  <p className="text-cyan-300 text-sm">
                    Production Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.productionAlerts}
                  </h2>

                </div>

                <div className="rounded-2xl border border-pink-700/40 bg-pink-950/20 p-5">

                  <p className="text-pink-300 text-sm">
                    Quality Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.qualityAlerts}
                  </h2>

                </div>

              </section>

              <section className="rounded-2xl border border-red-700/40 bg-red-950/10 p-6">

                <p className="text-red-300 uppercase tracking-widest text-sm">
                  Executive War Room Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates live factory
                  operational behaviour, executive risks,
                  production instability,
                  and recovery priorities
                  to support rapid executive intervention.
                </p>

              </section>

              <section className="space-y-4">

                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-2xl border p-6 ${getSeverityColor(
                      alert.severity
                    )}`}
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>

                        <p className="text-sm opacity-80">
                          {alert.category} · {alert.department}
                        </p>

                        <h3 className="text-2xl font-bold mt-2">
                          {alert.title}
                        </h3>

                      </div>

                      <div className="text-right">

                        <p className="text-sm opacity-70">
                          Severity
                        </p>

                        <h4 className="text-2xl font-bold">
                          {alert.severity}
                        </h4>

                      </div>

                    </div>

                    <div className="mt-5">

                      <p className="text-slate-200">
                        <span className="font-semibold">
                          Operational Impact:
                        </span>
                        {" "}
                        {alert.impact}
                      </p>

                    </div>

                    <div className="mt-4">

                      <p className="text-slate-200">
                        <span className="font-semibold">
                          AI Recommended Action:
                        </span>
                        {" "}
                        {alert.recommendedAction}
                      </p>

                    </div>

                  </div>
                ))}

              </section>

            </>
          )}

        </div>

      </main>

    </DashboardShell>
  );
}