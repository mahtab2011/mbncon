"use client";
import {
  productionSummary,
  executiveAlerts,
} from "@/lib/manufacturing/manufacturingData";

type DelayRisk = "LOW" | "MEDIUM" | "HIGH";

type ShipmentPrediction = {
  id: string;
  shipmentNo: string;
  buyer: string;
  style: string;
  plannedShipDate: string;
  orderQty: number;
  productionReady: number;
  packedQty: number;
  remainingQty: number;
  delayProbability: number;
  predictedDelayDays: number;
  risk: DelayRisk;
  mainReason: string;
  aiRecommendation: string;
};

const shipments: ShipmentPrediction[] = [
  {
    id: "1",
    shipmentNo: "SHP-HNM-2401",
    buyer: "H&M",
    style: "HNM-2401",
    plannedShipDate: "2026-07-03",
    orderQty: 25000,
    productionReady: 21400,
    packedQty: 20350,
    remainingQty: 4650,
    delayProbability: 18,
    predictedDelayDays: 0,
    risk: "LOW",
    mainReason: "Production flow is stable and shipment buffer remains adequate.",
    aiRecommendation:
      "Continue current production plan and verify final packing one day before shipment.",
  },
  {
    id: "2",
    shipmentNo: "SHP-ZRA-1188",
    buyer: "Zara",
    style: "ZRA-1188",
    plannedShipDate: "2026-07-04",
    orderQty: 18000,
    productionReady: 14200,
    packedQty: 13100,
    remainingQty: 4900,
    delayProbability: 46,
    predictedDelayDays: 1,
    risk: "MEDIUM",
    mainReason:
      "Material shortage and finishing WIP may reduce shipment readiness.",
    aiRecommendation:
      "Expedite neck rib issue, add finishing support, and review packing capacity.",
  },
  {
    id: "3",
    shipmentNo: "SHP-PRM-3307",
    buyer: "Primark",
    style: "PRM-3307",
    plannedShipDate: "2026-07-02",
    orderQty: 12000,
    productionReady: 8700,
    packedQty: 7900,
    remainingQty: 4100,
    delayProbability: 82,
    predictedDelayDays: 2,
    risk: "HIGH",
    mainReason:
      "High DHU, machine downtime, material shortage and sewing bottleneck are affecting shipment readiness.",
    aiRecommendation:
      "Escalate to executive level. Replenish hood fabric, complete machine maintenance, add inline QC and approve overtime.",
  },
];

function riskClass(risk: DelayRisk) {
  if (risk === "LOW") return "bg-green-100 text-green-700";
  if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function ShipmentDelayPredictorPage() {
  const totalOrderQty = shipments.reduce(
    (sum, shipment) => sum + shipment.orderQty,
    0
  );

  const totalPacked = shipments.reduce(
    (sum, shipment) => sum + shipment.packedQty,
    0
  );

  const highRiskShipments = shipments.filter(
    (shipment) => shipment.risk === "HIGH"
  ).length;

  const avgDelayProbability =
    shipments.reduce(
      (sum, shipment) => sum + shipment.delayProbability,
      0
    ) / shipments.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          Shipment Delay Predictor
        </h1>

        <p className="mt-2 text-gray-600">
          AI predicts shipment delay probability using production, quality,
          maintenance, material, WIP and packing readiness signals.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card
          title="Order Quantity"
          value={totalOrderQty.toLocaleString()}
          color="text-blue-700"
        />

        <Card
          title="Packed Quantity"
          value={totalPacked.toLocaleString()}
          color="text-green-700"
        />

        <Card
          title="Avg Delay Risk"
          value={`${100 - productionSummary.shipmentReadiness}%`}
          color="text-orange-700"
        />

        <Card
          title="High Risk Shipments"
          value={executiveAlerts.length.toString()}
          color="text-red-700"
        />
      </div>

      <section className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-2xl font-bold text-red-700">
          AI Shipment Forecast
        </h2>

        <p className="mt-4 text-gray-700">
  AI is currently monitoring{" "}
  <strong>{executiveAlerts.length}</strong> active executive
  alerts.

  Shipment readiness is currently{" "}
  <strong>{productionSummary.shipmentReadiness}%</strong>.

  Production efficiency remains at{" "}
  <strong>{productionSummary.efficiency}%</strong>, indicating that
  on-time delivery is achievable if current corrective actions are
  maintained and critical bottlenecks are resolved promptly.
</p>
      </section>

      <div className="grid gap-6">
        {shipments.map((shipment) => (
          <section
            key={shipment.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-blue-700">
                  {shipment.shipmentNo}
                </h2>

                <p className="text-gray-600">
                  {shipment.buyer} · {shipment.style} · Ship Date:{" "}
                  {shipment.plannedShipDate}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${riskClass(
                  shipment.risk
                )}`}
              >
                {shipment.risk} DELAY RISK
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-5">
              <Metric
                title="Order Qty"
                value={shipment.orderQty.toLocaleString()}
              />

              <Metric
                title="Production Ready"
                value={shipment.productionReady.toLocaleString()}
              />

              <Metric
                title="Packed"
                value={shipment.packedQty.toLocaleString()}
              />

              <Metric
                title="Remaining"
                value={shipment.remainingQty.toLocaleString()}
              />

              <Metric
                title="Delay Probability"
                value={`${shipment.delayProbability}%`}
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-gray-500">
                  Main Delay Reason
                </p>

                <p className="mt-2 text-gray-700">
                  {shipment.mainReason}
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  AI Recovery Recommendation
                </p>

                <p className="mt-2 text-gray-700">
                  {shipment.aiRecommendation}
                </p>
              </div>

              <div className="rounded-lg border p-4 md:col-span-2">
                <p className="text-sm font-semibold text-gray-500">
                  Predicted Delay
                </p>

                <h3 className="mt-2 text-2xl font-bold text-red-700">
                  {shipment.predictedDelayDays} Day(s)
                </h3>
              </div>
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
      <h2 className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}

type MetricProps = {
  title: string;
  value: string;
};

function Metric({ title, value }: MetricProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}