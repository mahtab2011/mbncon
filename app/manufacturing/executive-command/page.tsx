"use client";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

type ExecutiveMetric = {
  title: string;
  value: string;
  status: RiskLevel;
  note: string;
};

type ExecutiveAlert = {
  id: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  area: string;
  issue: string;
  recommendation: string;
};

const metrics: ExecutiveMetric[] = [
  {
    title: "Factory Health",
    value: "92%",
    status: "LOW",
    note: "Factory operating within stable range.",
  },
  {
    title: "Production Performance",
    value: "81%",
    status: "MEDIUM",
    note: "One line below expected efficiency.",
  },
  {
    title: "Quality Health",
    value: "98%",
    status: "LOW",
    note: "DHU under control.",
  },
  {
    title: "Machine Health",
    value: "88%",
    status: "MEDIUM",
    note: "One overlock machine requires maintenance.",
  },
  {
    title: "Operator Readiness",
    value: "94%",
    status: "LOW",
    note: "Skill coverage sufficient.",
  },
  {
    title: "Shipment Confidence",
    value: "96%",
    status: "LOW",
    note: "Shipments currently on track.",
  },
];

const alerts: ExecutiveAlert[] = [
  {
    id: "1",
    priority: "HIGH",
    area: "Bottleneck",
    issue: "Collar Attach may slow Line L-002 during HNM-POLO-2401.",
    recommendation:
      "Assign OPR-142 and keep one backup collar operator ready.",
  },
  {
    id: "2",
    priority: "MEDIUM",
    area: "Maintenance",
    issue: "Machine MC-014 has high failure risk.",
    recommendation:
      "Schedule preventive maintenance before next bulk input.",
  },
  {
    id: "3",
    priority: "MEDIUM",
    area: "Readiness",
    issue: "PP sample approval is still pending.",
    recommendation:
      "Approve PP sample before confirming full bulk production.",
  },
];

function statusBadgeClass(status: RiskLevel) {
  if (status === "LOW") {
    return "bg-green-100 text-green-700";
  }

  if (status === "MEDIUM") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

function priorityBadgeClass(priority: ExecutiveAlert["priority"]) {
  if (priority === "CRITICAL") {
    return "bg-red-100 text-red-700";
  }

  if (priority === "HIGH") {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function ExecutiveManufacturingCommandPage() {
  const criticalOrHighAlerts = alerts.filter(
    (alert) =>
      alert.priority === "CRITICAL" || alert.priority === "HIGH"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          Executive Manufacturing Command Centre
        </h1>

        <p className="mt-2 text-gray-600">
          CEO-level control tower for factory health, production, quality,
          machines, operators, shipment risk and AI alerts.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Overall Status</p>
          <h2 className="mt-2 text-3xl font-bold text-green-700">
            STABLE
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">Factory Health</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            92%
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Critical / High Alerts
          </p>
          <h2 className="mt-2 text-3xl font-bold text-orange-700">
            {criticalOrHighAlerts}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Executive Priority
          </p>
          <h2 className="mt-2 text-2xl font-bold text-red-700">
            Collar Attach
          </h2>
        </div>
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Today's Executive Brief
        </h2>

        <p className="mt-4 text-gray-700">
          Production is on schedule overall. One high-risk bottleneck is
          forecast at Collar Attach for Line L-002. Machine MC-014 should
          receive preventive maintenance before the next bulk input. Shipment
          confidence remains strong, but PP sample approval must be completed
          before full production release.
        </p>
      </section>

      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <section
            key={metric.title}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-700">
                {metric.title}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClass(
                  metric.status
                )}`}
              >
                {metric.status}
              </span>
            </div>

            <h3 className="text-4xl font-bold text-gray-800">
              {metric.value}
            </h3>

            <p className="mt-3 text-sm text-gray-600">
              {metric.note}
            </p>
          </section>
        ))}
      </div>

      <section className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold text-blue-700">
          Executive AI Alerts
        </h2>

        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-lg border p-5"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {alert.area}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${priorityBadgeClass(
                    alert.priority
                  )}`}
                >
                  {alert.priority}
                </span>
              </div>

              <p className="text-gray-700">
                {alert.issue}
              </p>

              <div className="mt-3 rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  Recommended Action
                </p>

                <p className="mt-1 text-gray-700">
                  {alert.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}