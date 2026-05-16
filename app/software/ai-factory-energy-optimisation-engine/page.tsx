"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/components/software/DashboardShell";

type EnergyRecord = {
  id: string;
  department: string;
  electricityKwh: number;
  generatorFuelLitres: number;
  productionUnits: number;
  energyCost: number;
  costPerUnit: number;
  abnormalSpike: boolean;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
};

const demoEnergyData: EnergyRecord[] = [
  {
    id: "FEO-001",
    department: "Production",
    electricityKwh: 18500,
    generatorFuelLitres: 3200,
    productionUnits: 14500,
    energyCost: 21500,
    costPerUnit: 1.48,
    abnormalSpike: true,
    riskLevel: "Critical",
  },
  {
    id: "FEO-002",
    department: "Finishing",
    electricityKwh: 8200,
    generatorFuelLitres: 950,
    productionUnits: 9100,
    energyCost: 7800,
    costPerUnit: 0.86,
    abnormalSpike: false,
    riskLevel: "Low",
  },
  {
    id: "FEO-003",
    department: "Washing",
    electricityKwh: 12400,
    generatorFuelLitres: 1800,
    productionUnits: 8600,
    energyCost: 13600,
    costPerUnit: 1.58,
    abnormalSpike: true,
    riskLevel: "High",
  },
  {
    id: "FEO-004",
    department: "Packaging",
    electricityKwh: 4200,
    generatorFuelLitres: 420,
    productionUnits: 7600,
    energyCost: 3900,
    costPerUnit: 0.51,
    abnormalSpike: false,
    riskLevel: "Medium",
  },
];

function getRiskColor(
  risk: EnergyRecord["riskLevel"]
) {
  if (risk === "Critical") {
    return "text-red-300 border-red-700/40 bg-red-950/20";
  }

  if (risk === "High") {
    return "text-orange-300 border-orange-700/40 bg-orange-950/20";
  }

  if (risk === "Medium") {
    return "text-yellow-300 border-yellow-700/40 bg-yellow-950/20";
  }

  return "text-green-300 border-green-700/40 bg-green-950/20";
}

function getEnergyAssessment(
  critical: number,
  high: number
) {
  if (critical >= 1) {
    return "Critical Energy Inefficiency Detected";
  }

  if (high >= 2) {
    return "High Energy Cost Exposure";
  }

  if (high >= 1) {
    return "Moderate Energy Optimisation Opportunity";
  }

  return "Energy Environment Stable";
}

function getRecommendation(record: EnergyRecord) {
  if (record.riskLevel === "Critical") {
    return "Immediate executive review required. Investigate utility leakage, machine inefficiency, and generator dependency.";
  }

  if (record.abnormalSpike) {
    return "AI detected abnormal energy consumption spike. Conduct operational energy audit immediately.";
  }

  if (record.costPerUnit > 1.4) {
    return "High energy cost per production unit detected. Optimize machine loading and production balancing.";
  }

  return "Energy consumption currently within operational tolerance.";
}

export default function AIFactoryEnergyOptimisationEnginePage() {
  const [loading, setLoading] = useState(true);

  const [records, setRecords] = useState<
    EnergyRecord[]
  >([]);

  useEffect(() => {
    let active = true;

    async function loadEnergyData() {
      try {
        setLoading(true);

        // Enterprise-safe async loading block
        // Future Firestore + AI integration goes here
        const data = demoEnergyData;

        if (active) {
          setRecords(data);
        }
      } catch (error) {
        console.error(
          "Failed to load factory energy optimisation engine:",
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

    loadEnergyData();

    return () => {
      active = false;
    };
  }, []);

  const intelligence = useMemo(() => {
    const totalEnergyCost = records.reduce(
      (sum, r) => sum + r.energyCost,
      0
    );

    const totalElectricity = records.reduce(
      (sum, r) => sum + r.electricityKwh,
      0
    );

    const totalFuel = records.reduce(
      (sum, r) => sum + r.generatorFuelLitres,
      0
    );

    const criticalRisks = records.filter(
      (r) => r.riskLevel === "Critical"
    ).length;

    const highRisks = records.filter(
      (r) =>
        r.riskLevel === "Critical" ||
        r.riskLevel === "High"
    ).length;

    return {
      totalEnergyCost,
      totalElectricity,
      totalFuel,
      criticalRisks,
      highRisks,
      assessment: getEnergyAssessment(
        criticalRisks,
        highRisks
      ),
    };
  }, [records]);

  return (
    <DashboardShell title="AI Factory Energy Optimisation Engine">

      <main className="min-h-screen bg-slate-950 text-white p-6">

        <div className="max-w-7xl mx-auto space-y-6">

          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-6 shadow-xl">

            <p className="text-cyan-300 uppercase tracking-widest text-sm">
              Module 34 · AI Factory Energy Optimisation Engine
            </p>

            <h1 className="text-4xl font-bold mt-3">
              Factory Energy & Utility Intelligence
            </h1>

            <p className="text-slate-300 mt-4 max-w-4xl">
              AI-powered factory energy optimisation
              system for detecting abnormal utility
              consumption, generator inefficiency,
              energy leakage, machine energy waste,
              and production-related energy cost exposure
              before profitability erosion occurs.
            </p>

          </section>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
              Loading factory energy optimisation intelligence...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-5 gap-4">

                <div className="rounded-2xl border border-cyan-700/40 bg-cyan-950/20 p-5">

                  <p className="text-cyan-300 text-sm">
                    Total Energy Cost
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    £
                    {intelligence.totalEnergyCost.toLocaleString()}
                  </h2>

                </div>

                <div className="rounded-2xl border border-blue-700/40 bg-blue-950/20 p-5">

                  <p className="text-blue-300 text-sm">
                    Electricity Usage
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {intelligence.totalElectricity.toLocaleString()}
                  </h2>

                  <p className="text-xs mt-1">
                    kWh
                  </p>

                </div>

                <div className="rounded-2xl border border-orange-700/40 bg-orange-950/20 p-5">

                  <p className="text-orange-300 text-sm">
                    Generator Fuel
                  </p>

                  <h2 className="text-4xl font-bold mt-3">
                    {intelligence.totalFuel.toLocaleString()}
                  </h2>

                  <p className="text-xs mt-1">
                    Litres
                  </p>

                </div>

                <div className="rounded-2xl border border-red-700/40 bg-red-950/20 p-5">

                  <p className="text-red-300 text-sm">
                    Critical Risks
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.criticalRisks}
                  </h2>

                </div>

                <div className="rounded-2xl border border-yellow-700/40 bg-yellow-950/20 p-5">

                  <p className="text-yellow-300 text-sm">
                    High Risk Areas
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {intelligence.highRisks}
                  </h2>

                </div>

              </section>

              <section className="rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6">

                <p className="text-cyan-300 uppercase tracking-widest text-sm">
                  Executive Energy Assessment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {intelligence.assessment}
                </h2>

                <p className="text-slate-300 mt-4">
                  AI continuously evaluates electricity
                  consumption, fuel dependency,
                  operational energy behaviour,
                  and abnormal utility patterns
                  to reduce hidden factory energy losses.
                </p>

              </section>

              <section className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">

                <div className="border-b border-slate-800 p-5">

                  <h2 className="text-2xl font-bold">
                    Factory Energy Intelligence Feed
                  </h2>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-800 text-slate-300">

                      <tr>
                        <th className="text-left p-4">
                          Department
                        </th>

                        <th className="text-left p-4">
                          Electricity
                        </th>

                        <th className="text-left p-4">
                          Generator Fuel
                        </th>

                        <th className="text-left p-4">
                          Production Units
                        </th>

                        <th className="text-left p-4">
                          Energy Cost
                        </th>

                        <th className="text-left p-4">
                          Cost / Unit
                        </th>

                        <th className="text-left p-4">
                          Spike
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
                            {record.department}
                          </td>

                          <td className="p-4">
                            {record.electricityKwh.toLocaleString()} kWh
                          </td>

                          <td className="p-4">
                            {record.generatorFuelLitres.toLocaleString()} L
                          </td>

                          <td className="p-4">
                            {record.productionUnits.toLocaleString()}
                          </td>

                          <td className="p-4 text-red-300">
                            £
                            {record.energyCost.toLocaleString()}
                          </td>

                          <td className="p-4 text-cyan-300">
                            £
                            {record.costPerUnit}
                          </td>

                          <td className="p-4">
                            {record.abnormalSpike
                              ? "Yes"
                              : "No"}
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
                    className={`rounded-2xl border p-5 ${getRiskColor(
                      record.riskLevel
                    )}`}
                  >

                    <p className="text-sm opacity-80">
                      {record.department}
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      Energy Optimisation Analysis
                    </h3>

                    <p className="mt-4 text-slate-200">
                      {getRecommendation(record)}
                    </p>

                    <div className="mt-5 flex justify-between">

                      <span>
                        Cost:
                        {" "}
                        £
                        {record.energyCost.toLocaleString()}
                      </span>

                      <span>
                        Unit Cost:
                        {" "}
                        £
                        {record.costPerUnit}
                      </span>

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