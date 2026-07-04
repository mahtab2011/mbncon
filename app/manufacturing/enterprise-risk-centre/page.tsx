"use client";
import {
  productionSummary,
  factoryHealth,
  executiveAlerts,
} from "@/lib/manufacturing/manufacturingData";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type EnterpriseRisk = {
  id: string;
  category: string;
  score: number;
  probability: number;
  financialImpact: number;
  owner: string;
  targetDate: string;
  level: RiskLevel;
  recommendation: string;
};

const risks: EnterpriseRisk[] = [
  {
    id: "1",
    category: "Production Risk",
    score: 72,
    probability: 68,
    financialImpact: 18000,
    owner: "Production Manager",
    targetDate: "2026-07-02",
    level: "HIGH",
    recommendation:
      "Increase efficiency on Line L-003 and rebalance operators.",
  },
  {
    id: "2",
    category: "Quality Risk",
    score: 64,
    probability: 52,
    financialImpact: 9200,
    owner: "Quality Manager",
    targetDate: "2026-07-01",
    level: "MEDIUM",
    recommendation:
      "Increase inline inspection and reduce DHU.",
  },
  {
    id: "3",
    category: "Machine Risk",
    score: 88,
    probability: 81,
    financialImpact: 23500,
    owner: "Maintenance Manager",
    targetDate: "2026-06-30",
    level: "CRITICAL",
    recommendation:
      "Complete preventive maintenance for MC-014 immediately.",
  },
  {
    id: "4",
    category: "Shipment Risk",
    score: 79,
    probability: 74,
    financialImpact: 32000,
    owner: "Planning Manager",
    targetDate: "2026-07-01",
    level: "HIGH",
    recommendation:
      "Prioritize SHP-PRM-3307 and monitor packing progress hourly.",
  },
  {
    id: "5",
    category: "Material Risk",
    score: 82,
    probability: 78,
    financialImpact: 15600,
    owner: "Store Manager",
    targetDate: "2026-06-30",
    level: "HIGH",
    recommendation:
      "Release hood fabric and activate low-stock alerts.",
  },
  {
    id: "6",
    category: "HR Risk",
    score: 41,
    probability: 28,
    financialImpact: 3800,
    owner: "HR Manager",
    targetDate: "2026-07-03",
    level: "LOW",
    recommendation:
      "Prepare backup operators for critical operations.",
  },
];

function riskColor(level: RiskLevel) {
  switch (level) {
    case "LOW":
      return "bg-green-100 text-green-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-red-100 text-red-700";
  }
}

export default function EnterpriseRiskCentrePage() {

  const totalImpact = risks.reduce(
    (sum, risk) => sum + risk.financialImpact,
    0
  );

  const critical = risks.filter(
    (risk) => risk.level === "CRITICAL"
  ).length;

  const avgRisk = (
    risks.reduce((sum, risk) => sum + risk.score, 0) /
    risks.length
  ).toFixed(1);

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          Enterprise Risk Centre
        </h1>

        <p className="mt-2 text-gray-600">
          Unified AI enterprise risk assessment across production,
          quality, maintenance, shipment, material and workforce.
        </p>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <Card
          title="Enterprise Risk"
          value={`${100 - factoryHealth.overallHealth}%`}
          color="text-red-700"
        />

        <Card
          title="Critical Risks"
          value={executiveAlerts.length.toString()}
          color="text-orange-700"
        />

        <Card
          title="Financial Exposure"
          value={`$${totalImpact.toLocaleString()}`}
          color="text-purple-700"
        />

        <Card
          title="AI Confidence"
          value={`${productionSummary.machineHealth}%`}
          color="text-green-700"
        />

      </div>

      <section className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">

        <h2 className="text-2xl font-bold text-red-700">
          AI Enterprise Assessment
        </h2>

        <p className="mt-4 text-gray-700">
  AI is currently monitoring{" "}
  <strong>{executiveAlerts.length}</strong> active executive
  alerts. Factory health is{" "}
  <strong>{factoryHealth.overallHealth}%</strong>, while
  production efficiency remains at{" "}
  <strong>{productionSummary.efficiency}%</strong>.
  Enterprise risk is primarily influenced by machine
  reliability, shipment readiness and material availability.
</p>

      </section>

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-blue-700 text-white">

            <tr>

              <TH>Category</TH>
              <TH>Risk</TH>
              <TH>Probability</TH>
              <TH>Financial Impact</TH>
              <TH>Owner</TH>
              <TH>Target</TH>
              <TH>Status</TH>

            </tr>

          </thead>

          <tbody>

            {risks.map((risk)=>(

              <tr
                key={risk.id}
                className="border-b hover:bg-blue-50"
              >

                <TD>{risk.category}</TD>

                <TD>{risk.score}%</TD>

                <TD>{risk.probability}%</TD>

                <TD>
                  ${risk.financialImpact.toLocaleString()}
                </TD>

                <TD>{risk.owner}</TD>

                <TD>{risk.targetDate}</TD>

                <TD>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${riskColor(
                      risk.level
                    )}`}
                  >
                    {risk.level}
                  </span>

                </TD>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-8 grid gap-6">

        {risks.map((risk)=>(

          <section
            key={risk.id}
            className="rounded-xl bg-white p-6 shadow"
          >

            <h2 className="text-xl font-bold text-blue-700">
              {risk.category}
            </h2>

            <p className="mt-3 text-gray-700">
              {risk.recommendation}
            </p>

          </section>

        ))}

      </div>

    </main>
  );
}

type CardProps={
  title:string;
  value:string;
  color:string;
};

function Card({
  title,
  value,
  color,
}:CardProps){
  return(
    <div className="rounded-xl bg-white p-5 shadow">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  );
}

function TH({
  children,
}:{
  children:React.ReactNode;
}){
  return(
    <th className="px-4 py-3 text-left text-sm font-bold">
      {children}
    </th>
  );
}

function TD({
  children,
}:{
  children:React.ReactNode;
}){
  return(
    <td className="px-4 py-3">
      {children}
    </td>
  );
}