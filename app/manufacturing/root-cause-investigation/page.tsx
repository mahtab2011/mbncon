"use client";
import {
  productionSummary,
  factoryHealth,
} from "@/lib/manufacturing/manufacturingData";

type RootCauseRisk = "LOW" | "MEDIUM" | "HIGH";

type RootCause = {
  id: string;
  issue: string;
  affectedLine: string;
  affectedStyle: string;
  probability: number;
  risk: RootCauseRisk;
  evidence: string;
  immediateAction: string;
  preventiveAction: string;
};

const rootCauses: RootCause[] = [
  {
    id: "1",
    issue: "High DHU on Line L-003",
    affectedLine: "L-003",
    affectedStyle: "PRM-3307",
    probability: 41,
    risk: "HIGH",
    evidence:
      "Quality entry shows DHU 5.1, maintenance entry shows downtime, and WIP shows sewing bottleneck.",
    immediateAction:
      "Increase inline inspection and check machine folder setting immediately.",
    preventiveAction:
      "Retrain operators on hood attach and update operation SOP.",
  },
  {
    id: "2",
    issue: "Machine Downtime on MC-014",
    affectedLine: "L-002",
    affectedStyle: "ZRA-1188",
    probability: 28,
    risk: "MEDIUM",
    evidence:
      "Maintenance record shows repeated looper damage and 75 minutes downtime.",
    immediateAction:
      "Replace looper and inspect feed dog before next shift.",
    preventiveAction:
      "Move MC-014 to high-frequency preventive maintenance schedule.",
  },
  {
    id: "3",
    issue: "Material Shortage for Hood Fabric",
    affectedLine: "L-003",
    affectedStyle: "PRM-3307",
    probability: 18,
    risk: "HIGH",
    evidence:
      "Material issue centre shows only 5 units balance and WIP indicates sewing slowdown.",
    immediateAction:
      "Replenish hood fabric immediately from store.",
    preventiveAction:
      "Set automatic reorder alert when balance falls below 10 percent.",
  },
  {
    id: "4",
    issue: "Operator Skill Gap",
    affectedLine: "L-003",
    affectedStyle: "PRM-3307",
    probability: 13,
    risk: "MEDIUM",
    evidence:
      "Operator allocation data shows shortage of expert hood attach operators.",
    immediateAction:
      "Move one skilled operator from L-001 to L-003.",
    preventiveAction:
      "Build cross-training plan for critical hoodie operations.",
  },
];

function riskClass(risk: RootCauseRisk) {
  if (risk === "LOW") return "bg-green-100 text-green-700";
  if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function RootCauseInvestigationPage() {
  const highRiskCauses = rootCauses.filter(
    (cause) => cause.risk === "HIGH"
  ).length;

  const highestProbability = rootCauses.reduce((top, cause) =>
    cause.probability > top.probability ? cause : top
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Root Cause Investigation Centre
        </h1>

        <p className="mt-2 text-gray-600">
          AI investigates operational problems across production, quality,
          maintenance, material, WIP and operator skill signals.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card
          title="Issues Investigated"
          value={rootCauses.length.toString()}
          color="text-blue-700"
        />

        <Card
          title="High Risk Causes"
          value={highRiskCauses.toString()}
          color="text-red-700"
        />

        <Card
          title="Top Probability"
          value={`${highestProbability.probability}%`}
          color="text-orange-700"
        />

        <Card
          title="Primary Issue"
          value={highestProbability.issue}
          color="text-purple-700"
        />
      </div>

      <section className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-2xl font-bold text-red-700">
          AI Investigation Summary
        </h2>

 <p className="mt-4 text-gray-700">
  AI is continuously analysing production, quality, maintenance,
  attendance and material information. Factory health is currently{" "}
  <strong>{factoryHealth.overallHealth}%</strong>. Current production is{" "}
  <strong>{productionSummary.totalProduction.toLocaleString()}</strong>{" "}
  pieces with an efficiency of{" "}
  <strong>{productionSummary.efficiency}%</strong>. Investigation
  priorities are automatically updated as operational conditions change.
</p>      </section>

      <div className="grid gap-6">
        {rootCauses.map((cause) => (
          <section
            key={cause.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {cause.issue}
                </h2>

                <p className="text-gray-600">
                  Line: {cause.affectedLine} · Style: {cause.affectedStyle}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${riskClass(
                  cause.risk
                )}`}
              >
                {cause.risk} RISK
              </span>
            </div>

            <div className="mb-5">
              <div className="mb-2 flex justify-between text-sm">
                <span>Root Cause Probability</span>
                <span className="font-bold">{cause.probability}%</span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${cause.probability}%` }}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoBlock
                title="Evidence"
                value={cause.evidence}
              />

              <InfoBlock
                title="Immediate Action"
                value={cause.immediateAction}
              />

              <InfoBlock
                title="Preventive Action"
                value={cause.preventiveAction}
              />
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

type CardProps = {
  title: string;
  value: string;
  color: string;
};

function Card({ title, value, color }: CardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`mt-2 text-2xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}

type InfoBlockProps = {
  title: string;
  value: string;
};

function InfoBlock({ title, value }: InfoBlockProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-semibold text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-gray-700">
        {value}
      </p>
    </div>
  );
}