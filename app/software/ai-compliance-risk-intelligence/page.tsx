"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type ComplianceRecord = {
  id: string;
  factory: string;
  department: string;
  auditArea: string;
  issue: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved";
  owner: string;
  daysOpen: number;
  financialRisk: number;
};

const demoComplianceData: ComplianceRecord[] = [
  {
    id: "CR-001",
    factory: "Demo Factory",
    department: "Production",
    auditArea: "Working Hours",
    issue: "Excess overtime risk detected",
    severity: "High",
    status: "Open",
    owner: "Production Manager",
    daysOpen: 12,
    financialRisk: 8500,
  },
  {
    id: "CR-002",
    factory: "Demo Factory",
    department: "HR",
    auditArea: "Documentation",
    issue: "Missing worker training record",
    severity: "Medium",
    status: "In Progress",
    owner: "HR Manager",
    daysOpen: 7,
    financialRisk: 2500,
  },
  {
    id: "CR-003",
    factory: "Demo Factory",
    department: "Maintenance",
    auditArea: "Safety",
    issue: "Machine guard inspection overdue",
    severity: "Critical",
    status: "Open",
    owner: "Maintenance Head",
    daysOpen: 18,
    financialRisk: 15000,
  },
  {
    id: "CR-004",
    factory: "Demo Factory",
    department: "Quality",
    auditArea: "Buyer Compliance",
    issue: "Corrective action evidence pending",
    severity: "High",
    status: "Open",
    owner: "QA Manager",
    daysOpen: 10,
    financialRisk: 7200,
  },
];

function getSeverityScore(severity: ComplianceRecord["severity"]) {
  if (severity === "Critical") return 100;
  if (severity === "High") return 75;
  if (severity === "Medium") return 45;
  return 20;
}

function getRiskLabel(score: number) {
  if (score >= 80) return "Critical Compliance Risk";
  if (score >= 60) return "High Compliance Risk";
  if (score >= 35) return "Moderate Compliance Risk";
  return "Controlled Risk";
}

function getRecommendation(record: ComplianceRecord) {
  if (record.severity === "Critical") {
    return "Immediate executive escalation required. Freeze related risk area until corrective action is verified.";
  }

  if (record.severity === "High") {
    return "Department head must submit recovery action, evidence, and closure date within 48 hours.";
  }

  if (record.daysOpen > 10) {
    return "Issue is ageing. Assign owner accountability and review in daily compliance meeting.";
  }

  return "Monitor and close with documented evidence.";
}

export default function AIComplianceRiskIntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<ComplianceRecord[]>([]);

  useEffect(() => {
    let active = true;

    async function loadComplianceRiskData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block.
        // Later we can replace demoComplianceData with Firestore data.
        const data = demoComplianceData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error("Failed to load compliance risk intelligence:", error);
        if (active) {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadComplianceRiskData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalIssues = records.length;
    const openIssues = records.filter((r) => r.status === "Open").length;
    const criticalIssues = records.filter((r) => r.severity === "Critical").length;
    const highIssues = records.filter((r) => r.severity === "High").length;
    const totalFinancialRisk = records.reduce((sum, r) => sum + r.financialRisk, 0);

    const averageRiskScore =
      totalIssues === 0
        ? 0
        : Math.round(
            records.reduce((sum, r) => {
              const ageingPenalty = r.daysOpen > 10 ? 15 : 0;
              const openPenalty = r.status === "Open" ? 10 : 0;
              return sum + getSeverityScore(r.severity) + ageingPenalty + openPenalty;
            }, 0) / totalIssues
          );

    return {
      totalIssues,
      openIssues,
      criticalIssues,
      highIssues,
      totalFinancialRisk,
      averageRiskScore,
      riskLabel: getRiskLabel(averageRiskScore),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Compliance Risk Intelligence">
      <main className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <section className="rounded-2xl bg-linear-to-r from-red-900 via-slate-900 to-slate-950 border border-red-700/40 p-6 shadow-xl">
            <p className="text-sm text-red-300 uppercase tracking-wide">
              Module 24 · AI Compliance Risk Intelligence
            </p>
            <h1 className="text-3xl font-bold mt-2">
              Compliance Risk Monitoring & Executive Alert System
            </h1>
            <p className="text-slate-300 mt-3 max-w-4xl">
              This module identifies audit risks, buyer compliance exposure,
              safety gaps, ageing corrective actions, financial exposure, and
              department-level accountability before they become factory-level
              business losses.
            </p>
          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading AI compliance intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                  <p className="text-slate-400 text-sm">Total Issues</p>
                  <h2 className="text-3xl font-bold">{intelligence.totalIssues}</h2>
                </div>

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                  <p className="text-slate-400 text-sm">Open Issues</p>
                  <h2 className="text-3xl font-bold text-yellow-300">
                    {intelligence.openIssues}
                  </h2>
                </div>

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                  <p className="text-slate-400 text-sm">Critical Issues</p>
                  <h2 className="text-3xl font-bold text-red-400">
                    {intelligence.criticalIssues}
                  </h2>
                </div>

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                  <p className="text-slate-400 text-sm">AI Risk Score</p>
                  <h2 className="text-3xl font-bold">{intelligence.averageRiskScore}</h2>
                </div>

                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
                  <p className="text-slate-400 text-sm">Financial Exposure</p>
                  <h2 className="text-3xl font-bold text-red-300">
                    £{intelligence.totalFinancialRisk.toLocaleString()}
                  </h2>
                </div>
              </section>

              <section className="rounded-2xl bg-red-950/40 border border-red-700/40 p-5">
                <p className="text-red-300 text-sm">Executive AI Assessment</p>
                <h2 className="text-2xl font-bold mt-1">{intelligence.riskLabel}</h2>
                <p className="text-slate-300 mt-2">
                  The system has detected compliance exposure requiring management
                  visibility. Priority should be given to critical, high-severity,
                  and ageing open issues.
                </p>
              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-800">
                  <h2 className="text-xl font-bold">Compliance Risk Register</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-slate-300">
                      <tr>
                        <th className="text-left p-4">ID</th>
                        <th className="text-left p-4">Department</th>
                        <th className="text-left p-4">Audit Area</th>
                        <th className="text-left p-4">Issue</th>
                        <th className="text-left p-4">Severity</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Owner</th>
                        <th className="text-left p-4">Days Open</th>
                        <th className="text-left p-4">Risk £</th>
                      </tr>
                    </thead>

                    <tbody>
                      {records.map((record) => (
                        <tr key={record.id} className="border-b border-slate-800">
                          <td className="p-4">{record.id}</td>
                          <td className="p-4">{record.department}</td>
                          <td className="p-4">{record.auditArea}</td>
                          <td className="p-4 text-slate-300">{record.issue}</td>
                          <td className="p-4">
                            <span className="rounded-full px-3 py-1 bg-red-900/50 text-red-200">
                              {record.severity}
                            </span>
                          </td>
                          <td className="p-4">{record.status}</td>
                          <td className="p-4">{record.owner}</td>
                          <td className="p-4">{record.daysOpen}</td>
                          <td className="p-4">
                            £{record.financialRisk.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-2xl bg-slate-900 border border-slate-800 p-5"
                  >
                    <p className="text-sm text-slate-400">
                      {record.department} · {record.auditArea}
                    </p>
                    <h3 className="text-lg font-bold mt-1">{record.issue}</h3>
                    <p className="text-slate-300 mt-3">
                      {getRecommendation(record)}
                    </p>
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