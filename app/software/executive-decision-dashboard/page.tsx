"use client";

import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";
import RiskBadge from "@/components/software/RiskBadge";

type RiskLevel = "Low" | "Medium" | "High" | "Critical";

type Decision = {
  title: string;
  department: string;
  risk: RiskLevel;
  owner: string;
  deadline: string;
  action: string;
  status: string;
  href: string;
};

const decisions: Decision[] = [
  {
    title: "Reduce Production Rejection",
    department: "Production",
    risk: "High",
    owner: "Production Manager",
    deadline: "7 Days",
    action: "Launch root cause analysis and operator retraining programme.",
    status: "Urgent",
    href: "/software/root-cause-intelligence",
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
    href: "/software/utility-cost-intelligence",
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
    href: "/software/shipment-delay-prediction",
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
    href: "/software/preventive-maintenance-intelligence",
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
    href: "/software/idle-manpower-intelligence",
  },
];

const decisionSummary = [
  {
    label: "Critical Decisions",
    value: decisions.filter((item) => item.risk === "Critical").length,
  },
  {
    label: "High Risk Actions",
    value: decisions.filter((item) => item.risk === "High").length,
  },
  {
    label: "Active Departments",
    value: new Set(decisions.map((item) => item.department)).size,
  },
  {
    label: "Total Actions",
    value: decisions.length,
  },
];

export default function ExecutiveDecisionDashboardPage() {
  return (
    <DashboardShell title="Executive Decision Dashboard">
      <div className="space-y-8">
        <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
            Executive Control Board
          </p>

          <h1 className="mt-3 text-4xl font-bold text-neutral-950">
            Executive Decision Dashboard
          </h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-neutral-700">
            Centralized management decision board for operational risk,
            corrective actions, escalation tracking, department ownership, and
            strategic execution.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {decisionSummary.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg"
            >
              <p className="text-sm font-semibold text-neutral-500">
                {item.label}
              </p>

              <p className="mt-3 text-4xl font-bold text-neutral-950">
                {item.value}
              </p>

              <p className="mt-3 text-xs font-semibold text-cyan-700">
                Executive decision signal
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6">
          {decisions.map((decision) => (
            <Link
              key={decision.title}
              href={decision.href}
              className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-950">
                    {decision.title}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-neutral-500">
                    Department: {decision.department}
                  </p>
                </div>

                <RiskBadge level={decision.risk} />
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InfoBox label="Decision Owner" value={decision.owner} />
                <InfoBox label="Completion Deadline" value={decision.deadline} />
                <InfoBox label="Current Status" value={decision.status} />
                <InfoBox label="Priority Level" value={decision.risk} />
              </div>

              <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
                <p className="text-sm font-bold uppercase tracking-wide text-neutral-500">
                  Recommended Action
                </p>

                <p className="mt-3 text-sm leading-7 text-neutral-700">
                  {decision.action}
                </p>
              </div>

              <p className="mt-5 text-xs font-semibold text-cyan-700">
                Open related intelligence module
              </p>
            </Link>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
        {label}
      </p>

      <p className="mt-2 text-base font-semibold text-neutral-900">{value}</p>
    </div>
  );
}