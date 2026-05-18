"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell from "@/components/software/DashboardShell";

import {
  getRiskReports,
  getProductionLogs,
  getMaintenanceLogs,
  getUtilitiesLogs,
} from "@/lib/software/firestoreService";

type RecordType = Record<string, any>;

type AccessRole = {
  role: string;
  accessLevel: string;
  modules: string[];
  risk: "Low" | "Medium" | "High" | "Critical";
  responsibility: string;
  action: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function riskStyle(risk: AccessRole["risk"]) {
  if (risk === "Low") {
    return "border-emerald-500 bg-emerald-500/10 text-emerald-300";
  }

  if (risk === "Medium") {
    return "border-cyan-500 bg-cyan-500/10 text-cyan-300";
  }

  if (risk === "High") {
    return "border-yellow-500 bg-yellow-500/10 text-yellow-300";
  }

  return "border-red-500 bg-red-500/10 text-red-300";
}

function getGovernanceAssessment(score: number) {
  if (score >= 85) {
    return "Enterprise Access Governance Stable";
  }

  if (score >= 70) {
    return "Moderate Governance Monitoring Required";
  }

  if (score >= 50) {
    return "High Access Control Risk Exposure";
  }

  return "Critical Access Governance Intervention Required";
}

export default function AIUserRoleAccessControlCentrePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [riskReports, setRiskReports] = useState<RecordType[]>([]);
  const [productionLogs, setProductionLogs] = useState<RecordType[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<RecordType[]>([]);
  const [utilitiesLogs, setUtilitiesLogs] = useState<RecordType[]>([]);

  useEffect(() => {
    let active = true;

    async function loadAccessData() {
      setLoading(true);
      setError("");

      try {
        const factoryId = "demo-factory";

        const results = await Promise.allSettled([
          getRiskReports(factoryId),
          getProductionLogs(factoryId),
          getMaintenanceLogs(factoryId),
          getUtilitiesLogs(factoryId),
        ]);

        if (!active) return;

        setRiskReports(
          results[0].status === "fulfilled" && Array.isArray(results[0].value)
            ? results[0].value
            : []
        );

        setProductionLogs(
          results[1].status === "fulfilled" && Array.isArray(results[1].value)
            ? results[1].value
            : []
        );

        setMaintenanceLogs(
          results[2].status === "fulfilled" && Array.isArray(results[2].value)
            ? results[2].value
            : []
        );

        setUtilitiesLogs(
          results[3].status === "fulfilled" && Array.isArray(results[3].value)
            ? results[3].value
            : []
        );
      } catch (err) {
        console.error("Access control loading failed:", err);

        if (active) {
          setError(
            "Live Firestore access control data could not be loaded. Demo governance view is shown."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAccessData();

    return () => {
      active = false;
    };
  }, []);

  const accessRoles = useMemo<AccessRole[]>(() => {
    const riskCount = riskReports.length;
    const productionCount = productionLogs.length;
    const maintenanceCount = maintenanceLogs.length;
    const utilitiesCount = utilitiesLogs.length;

    return [
      {
        role: "Super Admin",
        accessLevel: "Full Enterprise Access",
        modules: [
          "Executive Dashboard",
          "Risk Governance",
          "Factory War Room",
          "AI Management Review",
        ],
        risk: "Critical",
        responsibility:
          "Controls enterprise-wide permissions, governance and confidential intelligence.",
        action:
          "Enable multi-level approval and audit logging for all admin activities.",
      },
      {
        role: "Factory Director",
        accessLevel: "Strategic Management Access",
        modules: [
          "Production Intelligence",
          "Profitability Intelligence",
          "Executive Reports",
        ],
        risk: riskCount > 5 ? "High" : "Medium",
        responsibility:
          "Reviews operational performance, escalation and enterprise profitability.",
        action:
          "Restrict sensitive user management and infrastructure settings.",
      },
      {
        role: "Production Manager",
        accessLevel: "Operational Control Access",
        modules: [
          "Production Entry",
          "Line Balancing",
          "Wastage Intelligence",
        ],
        risk: productionCount > 10 ? "Medium" : "Low",
        responsibility:
          "Responsible for production execution, efficiency and bottleneck management.",
        action:
          "Limit access to financial, payroll and confidential governance modules.",
      },
      {
        role: "Maintenance Manager",
        accessLevel: "Technical Operations Access",
        modules: [
          "Maintenance Logs",
          "Machine Intelligence",
          "Downtime Analytics",
        ],
        risk: maintenanceCount > 5 ? "Medium" : "Low",
        responsibility:
          "Maintains machine uptime, repair governance and preventive maintenance.",
        action:
          "Track all maintenance approvals and spare usage with audit history.",
      },
      {
        role: "Utilities & Energy Team",
        accessLevel: "Utilities Monitoring Access",
        modules: [
          "Utilities Logs",
          "Generator Cost",
          "Energy Intelligence",
        ],
        risk: utilitiesCount > 5 ? "Medium" : "Low",
        responsibility:
          "Controls energy monitoring, utility cost review and abnormal spikes.",
        action:
          "Restrict access to strategic commercial and buyer information.",
      },
      {
        role: "Audit & Compliance Team",
        accessLevel: "Evidence & Governance Access",
        modules: [
          "Document Evidence Control",
          "Risk Reports",
          "Corrective Actions",
        ],
        risk: "High",
        responsibility:
          "Maintains audit readiness, compliance proof and governance review.",
        action:
          "Enable approval workflow and evidence traceability for every action.",
      },
    ];
  }, [
    riskReports,
    productionLogs,
    maintenanceLogs,
    utilitiesLogs,
  ]);

  const governanceScore = useMemo(() => {
    const scoreMap = {
      Low: 92,
      Medium: 74,
      High: 48,
      Critical: 28,
    };

    const total = accessRoles.reduce(
      (sum, item) => sum + scoreMap[item.risk],
      0
    );

    return Math.round(total / accessRoles.length);
  }, [accessRoles]);

  const governanceAssessment = getGovernanceAssessment(governanceScore);

  const criticalRoles = accessRoles.filter(
    (item) => item.risk === "Critical"
  ).length;

  const highRiskRoles = accessRoles.filter(
    (item) => item.risk === "High" || item.risk === "Critical"
  ).length;

  const kpiCards = [
    {
      title: "Governance Score",
      value: governanceScore,
      href: "#executive-access-assessment",
      className: "border-cyan-500/20 bg-cyan-500/10",
    },
    {
      title: "Critical Roles",
      value: criticalRoles,
      href: "#role-access-feed",
      className: "border-red-500/30 bg-red-500/10",
    },
    {
      title: "High Risk Roles",
      value: highRiskRoles,
      href: "#role-access-feed",
      className: "border-yellow-500/30 bg-yellow-500/10",
    },
    {
      title: "Governance Checklist",
      value: 9,
      href: "#governance-checklist",
      className: "border-emerald-500/30 bg-emerald-500/10",
    },
  ];

  return (
    <DashboardShell title="AI User Role & Access Control Centre">
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[linear(#0f172a,#020617)] px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Module 108
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              AI User Role & Access Control Centre
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              Enterprise governance centre for user permissions, module access,
              operational responsibility, audit visibility and role-based
              intelligence control across manufacturing operations.
            </p>

            {loading && (
              <p className="mt-5 text-sm text-cyan-200">
                Loading live role governance intelligence...
              </p>
            )}

            {error && (
              <p className="mt-5 text-sm text-yellow-300">{error}</p>
            )}
          </div>
        </section>

        <section
          id="enterprise-kpis"
          className="mx-auto grid max-w-7xl scroll-mt-28 grid-cols-1 gap-4 px-6 py-8 md:grid-cols-4"
        >
          {kpiCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl ${card.className}`}
            >
              <p className="text-sm text-slate-300">{card.title}</p>

              <h2 className="mt-3 text-5xl font-bold">{card.value}</h2>

              <p className="mt-3 text-xs text-slate-500">
                Click to review access intelligence
              </p>
            </a>
          ))}
        </section>

        <section
          id="executive-access-assessment"
          className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-8"
        >
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <p className="text-sm uppercase tracking-widest text-cyan-200">
              Executive Access Assessment
            </p>

            <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end">
              <h2 className="text-5xl font-bold md:text-6xl">
                {governanceScore}
              </h2>

              <div className="mb-2 rounded-full border border-cyan-400/30 px-4 py-1 text-sm text-cyan-200">
                {governanceAssessment}
              </div>
            </div>

            <p className="mt-4 max-w-4xl text-sm text-slate-300">
              AI evaluates user roles, permission exposure, operational access,
              audit control and confidential module governance to reduce
              enterprise data leakage, unauthorized actions and accountability
              gaps.
            </p>
          </div>
        </section>

        <section
          id="role-access-feed"
          className="mx-auto max-w-7xl scroll-mt-28 px-6 py-8"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {accessRoles.map((item) => {
              const sectionId = slugify(item.role);

              return (
                <a
                  key={item.role}
                  id={sectionId}
                  href="#governance-checklist"
                  className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">{item.role}</h2>

                      <p className="mt-2 text-sm text-cyan-300">
                        {item.accessLevel}
                      </p>
                    </div>

                    <div
                      className={`rounded-full border px-4 py-1 text-xs font-semibold ${riskStyle(
                        item.risk
                      )}`}
                    >
                      {item.risk}
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm font-semibold text-cyan-300">
                      Responsibility
                    </p>

                    <p className="mt-2 text-sm text-slate-200">
                      {item.responsibility}
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm font-semibold text-yellow-300">
                      Accessible modules
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.modules.map((module) => (
                        <span
                          key={module}
                          className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm font-semibold text-red-300">
                      AI Governance Recommendation
                    </p>

                    <p className="mt-2 text-sm text-slate-200">
                      {item.action}
                    </p>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Click to review governance checklist
                  </p>
                </a>
              );
            })}
          </div>
        </section>

        <section
          id="governance-checklist"
          className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-10"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold">
              Enterprise access governance checklist
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              This checklist supports access governance, audit readiness,
              permission ownership and enterprise confidentiality discipline.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "Role-based access only",
                "Audit log tracking",
                "Password and MFA policy",
                "Sensitive data restrictions",
                "Approval workflow governance",
                "Department ownership control",
                "Executive escalation access",
                "Document confidentiality",
                "User suspension & recovery",
              ].map((item) => (
                <a
                  key={item}
                  href="#enterprise-kpis"
                  className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:bg-slate-800"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}