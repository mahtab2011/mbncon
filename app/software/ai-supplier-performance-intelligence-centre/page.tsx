"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type SupplierRecord = {
  id: string;
  supplierName: string;
  category: string;
  country: string;
  onTimeDelivery: number;
  rejectionRate: number;
  priceStability: number;
  dependencyLevel: "Low" | "Medium" | "High" | "Critical";
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  status: "Stable" | "Watchlist" | "Recovery Required";
  aiPrediction: string;
};

const demoSupplierData: SupplierRecord[] = [
  {
    id: "SUP-001",
    supplierName: "Global Textile Mills",
    category: "Fabric",
    country: "Bangladesh",
    onTimeDelivery: 92,
    rejectionRate: 3,
    priceStability: 88,
    dependencyLevel: "High",
    riskLevel: "Medium",
    status: "Stable",
    aiPrediction:
      "Supplier expected to remain stable with manageable operational exposure.",
  },
  {
    id: "SUP-002",
    supplierName: "Eastern Trim Solutions",
    category: "Accessories",
    country: "China",
    onTimeDelivery: 71,
    rejectionRate: 11,
    priceStability: 59,
    dependencyLevel: "Critical",
    riskLevel: "Critical",
    status: "Recovery Required",
    aiPrediction:
      "High disruption probability due to delivery inconsistency and unstable pricing.",
  },
  {
    id: "SUP-003",
    supplierName: "Prime Packaging Ltd",
    category: "Packaging",
    country: "Vietnam",
    onTimeDelivery: 84,
    rejectionRate: 5,
    priceStability: 73,
    dependencyLevel: "Medium",
    riskLevel: "Medium",
    status: "Watchlist",
    aiPrediction:
      "Moderate supply chain monitoring recommended during next procurement cycle.",
  },
  {
    id: "SUP-004",
    supplierName: "Northern Chemicals",
    category: "Chemical",
    country: "India",
    onTimeDelivery: 95,
    rejectionRate: 2,
    priceStability: 91,
    dependencyLevel: "Low",
    riskLevel: "Low",
    status: "Stable",
    aiPrediction:
      "Supplier performance highly stable with low operational risk exposure.",
  },
];

function getRiskStyle(risk: SupplierRecord["riskLevel"]) {
  if (risk === "Critical") {
    return "border-red-700/40 bg-red-950/20 text-red-300";
  }

  if (risk === "High") {
    return "border-orange-700/40 bg-orange-950/20 text-orange-300";
  }

  if (risk === "Medium") {
    return "border-yellow-700/40 bg-yellow-950/20 text-yellow-300";
  }

  return "border-green-700/40 bg-green-950/20 text-green-300";
}

function getExecutiveAssessment(
  critical: number,
  high: number
) {
  if (critical >= 1) {
    return "Critical Supplier Risk Exposure";
  }

  if (high >= 2) {
    return "High Supplier Stabilization Required";
  }

  if (high >= 1) {
    return "Moderate Supplier Risk Environment";
  }

  return "Supplier Ecosystem Stable";
}

export default function AISupplierPerformanceIntelligenceCentrePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    SupplierRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadSupplierData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore integration goes here

        const data = demoSupplierData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load supplier intelligence:",
          error
        );

        if (active) {
          setRecords([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSupplierData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const criticalSuppliers = records.filter(
      (r) => r.riskLevel === "Critical"
    ).length;

    const highRiskSuppliers = records.filter(
      (r) =>
        r.riskLevel === "Critical" ||
        r.riskLevel === "High"
    ).length;

    const averageOTD =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + r.onTimeDelivery,
              0
            ) / records.length
          );

    const averagePriceStability =
      records.length === 0
        ? 0
        : Math.round(
            records.reduce(
              (sum, r) => sum + r.priceStability,
              0
            ) / records.length
          );

    return {
      criticalSuppliers,
      highRiskSuppliers,
      averageOTD,
      averagePriceStability,
      assessment: getExecutiveAssessment(
        criticalSuppliers,
        highRiskSuppliers
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Supplier Performance Intelligence Centre">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-cyan-300 uppercase tracking-widest text-sm">
              Module 42 · AI Supplier Performance Intelligence Centre
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Supplier Performance Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered supplier monitoring system
              for delivery performance,
              material quality stability,
              supplier dependency analysis,
              procurement intelligence,
              and enterprise supply chain risk management.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading supplier intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="rounded-2xl border border-red-700/40 bg-red-950/20 p-5">

                  <p className="text-red-300 text-sm">
                    Critical Suppliers
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalSuppliers}
                  </h2>

                </div>

                <div className="rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5">

                  <p className="text-orange-300 text-sm">
                    High Risk Suppliers
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.highRiskSuppliers}
                  </h2>

                </div>

                <div className="rounded-2xl border border-cyan-700/40 bg-cyan-950/20 p-5">

                  <p className="text-cyan-300 text-sm">
                    Avg On-Time Delivery
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averageOTD}%
                  </h2>

                </div>

                <div className="rounded-2xl border border-green-700/40 bg-green-950/20 p-5">

                  <p className="text-green-300 text-sm">
                    Price Stability
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.averagePriceStability}%
                  </h2>

                </div>

              </section>

              <section className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6">

                <p className="text-cyan-300 uppercase tracking-widest text-sm">
                  Executive Supplier Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates supplier
                  reliability, dependency exposure,
                  delivery stability,
                  procurement vulnerability,
                  and future supply disruption risks.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Supplier Intelligence Feed
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">

                      <tr>
                        <th className="text-left p-4">
                          Supplier
                        </th>

                        <th className="text-left p-4">
                          Category
                        </th>

                        <th className="text-left p-4">
                          OTD
                        </th>

                        <th className="text-left p-4">
                          Rejection
                        </th>

                        <th className="text-left p-4">
                          Risk
                        </th>

                        <th className="text-left p-4">
                          Status
                        </th>
                      </tr>

                    </thead>

                    <tbody>

                      {records.map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-slate-800"
                        >

                          <td className="p-4">
                            {record.supplierName}
                          </td>

                          <td className="p-4">
                            {record.category}
                          </td>

                          <td className="p-4 text-cyan-300">
                            {record.onTimeDelivery}%
                          </td>

                          <td className="p-4 text-red-300">
                            {record.rejectionRate}%
                          </td>

                          <td className="p-4">
                            {record.riskLevel}
                          </td>

                          <td className="p-4">
                            {record.status}
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
                    className={`rounded-2xl border p-5 ${getRiskStyle(
                      record.riskLevel
                    )}`}
                  >

                    <p className="text-sm opacity-80">
                      {record.supplierName}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      AI Supplier Analysis
                    </h3>

                    <p className="mt-4 text-slate-200">
                      {record.aiPrediction}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">

                      <div>
                        <p className="opacity-70">
                          Dependency
                        </p>

                        <p className="font-semibold">
                          {record.dependencyLevel}
                        </p>
                      </div>

                      <div>
                        <p className="opacity-70">
                          Country
                        </p>

                        <p className="font-semibold">
                          {record.country}
                        </p>
                      </div>

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