"use client";

import DashboardShell from "@/components/software/DashboardShell";
import RiskBadge from "@/components/software/RiskBadge";

const decisions = [
  {
    title: "Reduce Production Rejection",
    department: "Production",
    risk: "High",
    owner: "Production Manager",
    deadline: "7 Days",
    action:
      "Launch root cause analysis and operator retraining programme.",
    status: "Urgent",
  },
  {
    title: "Control Excess Utilities Consumption",
    department: "Utilities",
    risk: "Medium",
    owner: "Engineering Team",
    deadline: "14 Days",
    action:
      "Investigate generator overuse and optimize electricity consumption.",
    status: "Monitoring",
  },
  {
    title: "Export Shipment Delay Recovery",
    department: "Export",
    risk: "Critical",
    owner: "Commercial Director",
    deadline: "48 Hours",
    action:
      "Coordinate with logistics partner and prioritize delayed shipment.",
    status: "Escalated",
  },
  {
    title: "Machine Breakdown Prevention",
    department: "Maintenance",
    risk: "High",
    owner: "Maintenance Head",
    deadline: "5 Days",
    action:
      "Perform preventive maintenance audit for all critical machines.",
    status: "Action Required",
  },
  {
    title: "Absenteeism Reduction Plan",
    department: "HR & Workforce",
    risk: "Medium",
    owner: "HR Department",
    deadline: "10 Days",
    action:
      "Review attendance trend and improve workforce engagement programme.",
    status: "In Progress",
  },
];

export default function ExecutiveDecisionDashboardPage() {
  return (
    <DashboardShell title="Executive Decision Dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">
            Executive Decision Dashboard
          </h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-neutral-600">
            Centralized management decision board for operational risk,
            corrective actions, escalation tracking, and strategic execution.
          </p>
        </div>

        <div className="grid gap-6">
          {decisions.map((decision) => (
            <div
              key={decision.title}
              className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {decision.title}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-neutral-500">
                    Department: {decision.department}
                  </p>
                </div>

                <RiskBadge level={decision.risk as any} />
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InfoBox
                  label="Decision Owner"
                  value={decision.owner}
                />

                <InfoBox
                  label="Completion Deadline"
                  value={decision.deadline}
                />

                <InfoBox
                  label="Current Status"
                  value={decision.status}
                />

                <InfoBox
                  label="Priority Level"
                  value={decision.risk}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                  Recommended Action
                </p>

                <p className="mt-3 text-sm leading-7 text-neutral-700">
                  {decision.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
        {label}
      </p>

      <p className="mt-2 text-base font-semibold text-neutral-900">
        {value}
      </p>
    </div>
  );
}