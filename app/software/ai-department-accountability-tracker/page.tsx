"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type AccountabilityRecord = {
  id: string;
  department: string;
  owner: string;
  issue: string;
  sourceModule: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Overdue" | "Closed";
  dueDate: string;
  evidenceRequired: string;
  aiAction: string;
};

const demoAccountabilityData: AccountabilityRecord[] = [
  {
    id: "ACT-001",
    department: "Production",
    owner: "Production Manager",
    issue: "Output below daily target on Line 4.",
    sourceModule: "Production Bottleneck Intelligence",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-05-20",
    evidenceRequired: "Daily recovery plan and line output report.",
    aiAction: "Review bottleneck station and rebalance operators.",
  },
  {
    id: "ACT-002",
    department: "Quality",
    owner: "QA Manager",
    issue: "Repeated stitching defect found during inline inspection.",
    sourceModule: "Quality Failure Prediction Engine",
    priority: "Critical",
    status: "Overdue",
    dueDate: "2026-05-15",
    evidenceRequired: "Root cause report and corrective action evidence.",
    aiAction: "Escalate to factory head and verify operator retraining.",
  },
  {
    id: "ACT-003",
    department: "Maintenance",
    owner: "Maintenance Manager",
    issue: "Preventive maintenance schedule missed for key machines.",
    sourceModule: "Preventive Maintenance Intelligence",
    priority: "High",
    status: "Open",
    dueDate: "2026-05-22",
    evidenceRequired: "Updated maintenance checklist and completion log.",
    aiAction: "Prioritise high-risk machines and update PM calendar.",
  },
  {
    id: "ACT-004",
    department: "Merchandising",
    owner: "Merchandising Manager",
    issue: "Buyer approval delay may affect shipment plan.",
    sourceModule: "Buyer Risk Intelligence",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-05-24",
    evidenceRequired: "Buyer communication record and revised approval timeline.",
    aiAction: "Escalate buyer follow-up and update shipment recovery plan.",
  },
  {
    id: "ACT-005",
    department: "Finance",
    owner: "Finance Manager",
    issue: "High receivable exposure from delayed buyer payment.",
    sourceModule: "Accounts Receivable Cashflow Intelligence",
    priority: "High",
    status: "Open",
    dueDate: "2026-05-25",
    evidenceRequired: "Payment follow-up note and cashflow impact review.",
    aiAction: "Create buyer payment escalation and working capital alert.",
  },
];

function getPriorityStyle(priority: AccountabilityRecord["priority"]) {
  if (priority === "Critical") {
    return "border-red-700/40 bg-red-950/20 text-red-300";
  }

  if (priority === "High") {
    return "border-orange-700/40 bg-orange-950/20 text-orange-300";
  }

  if (priority === "Medium") {
    return "border-yellow-700/40 bg-yellow-950/20 text-yellow-300";
  }

  return "border-green-700/40 bg-green-950/20 text-green-300";
}

function getStatusStyle(status: AccountabilityRecord["status"]) {
  if (status === "Overdue") {
    return "text-red-300";
  }

  if (status === "Open") {
    return "text-orange-300";
  }

  if (status === "In Progress") {
    return "text-cyan-300";
  }

  return "text-green-300";
}

function getExecutiveAssessment(overdue: number, critical: number) {
  if (overdue >= 2 || critical >= 2) {
    return "Critical Accountability Escalation Required";
  }

  if (overdue >= 1 || critical >= 1) {
    return "High Management Attention Required";
  }

  return "Department Accountability Under Control";
}

export default function AIDepartmentAccountabilityTrackerPage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AccountabilityRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadAccountabilityData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore integration can combine:
        // correctiveActions, riskReports, auditFindings,
        // productionRecoveryActions, shipmentRecoveryActions,
        // qualityIssues, maintenanceActions, buyerEscalations.
        const data = demoAccountabilityData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error("Failed to load accountability tracker:", error);

        if (active) {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAccountabilityData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalActions = records.length;

    const overdueActions = records.filter(
      (record) => record.status === "Overdue"
    ).length;

    const criticalActions = records.filter(
      (record) => record.priority === "Critical"
    ).length;

    const openActions = records.filter(
      (record) => record.status !== "Closed"
    ).length;

    const departments = new Set(records.map((record) => record.department)).size;

    return {
      totalActions,
      overdueActions,
      criticalActions,
      openActions,
      departments,
      assessment: getExecutiveAssessment(overdueActions, criticalActions),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Department Accountability Tracker">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-6 shadow-xl">
            <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm">
              Module 102 · AI Department Accountability Tracker
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Department Accountability & Ownership Control
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              Tracks who owns each operational issue, which department is
              responsible, what evidence is required, and which actions need
              executive escalation.
            </p>
          </section>

          {loading ? (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              Loading department accountability intelligence...
            </section>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-5">
                  <p className="text-cyan-300 text-sm">Total Actions</p>
                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.totalActions}
                  </h2>
                </div>

                <div className="rounded-2xl border border-orange-700/40 bg-orange-950/10 p-5">
                  <p className="text-orange-300 text-sm">Open Actions</p>
                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.openActions}
                  </h2>
                </div>

                <div className="rounded-2xl border border-red-700/40 bg-red-950/10 p-5">
                  <p className="text-red-300 text-sm">Overdue</p>
                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.overdueActions}
                  </h2>
                </div>

                <div className="rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/10 p-5">
                  <p className="text-fuchsia-300 text-sm">Critical</p>
                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalActions}
                  </h2>
                </div>

                <div className="rounded-2xl border border-green-700/40 bg-green-950/10 p-5">
                  <p className="text-green-300 text-sm">Departments</p>
                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.departments}
                  </h2>
                </div>
              </section>

              <section className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6">
                <p className="text-cyan-300 uppercase tracking-widest text-sm">
                  Executive Accountability Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI reviews overdue actions, department ownership, priority
                  level, evidence requirement, and escalation needs so leadership
                  can quickly identify weak follow-up discipline.
                </p>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
                <div className="border-b border-slate-800 p-5">
                  <h2 className="text-2xl font-bold">
                    Accountability Action Register
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="text-left p-4">Department</th>
                        <th className="text-left p-4">Owner</th>
                        <th className="text-left p-4">Issue</th>
                        <th className="text-left p-4">Priority</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Due Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {records.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-slate-800"
                        >
                          <td className="p-4">{record.department}</td>
                          <td className="p-4">{record.owner}</td>
                          <td className="p-4">{record.issue}</td>
                          <td className="p-4">{record.priority}</td>
                          <td className={`p-4 ${getStatusStyle(record.status)}`}>
                            {record.status}
                          </td>
                          <td className="p-4">{record.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((record) => (
                  <article
                    key={record.id}
                    className={`rounded-2xl border p-5 ${getPriorityStyle(
                      record.priority
                    )}`}
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-sm opacity-80">{record.id}</p>
                        <h3 className="text-2xl font-bold mt-1">
                          {record.department}
                        </h3>
                      </div>

                      <div className="text-right">
                        <p className="text-sm opacity-80">Status</p>
                        <p className={`font-bold ${getStatusStyle(record.status)}`}>
                          {record.status}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-slate-200">{record.issue}</p>

                    <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-widest opacity-70">
                        AI Action Required
                      </p>
                      <p className="text-sm text-slate-200 mt-2">
                        {record.aiAction}
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-700/60 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-widest opacity-70">
                        Evidence Required
                      </p>
                      <p className="text-sm text-slate-200 mt-2">
                        {record.evidenceRequired}
                      </p>
                    </div>

                    <div className="mt-4 text-sm text-slate-300">
                      <p>Owner: {record.owner}</p>
                      <p>Source: {record.sourceModule}</p>
                    </div>
                  </article>
                ))}
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}