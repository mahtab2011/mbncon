"use client";

import {
  ShipmentPredictionResult,
} from "../../../lib/gpa/shipmentDelayPredictorEngine";

type Props = {
  prediction: ShipmentPredictionResult;
};

export default function ShipmentDelayPredictorPanel({
  prediction,
}: Props) {
  const badgeClass =
    prediction.delayRisk === "LOW"
      ? "bg-green-100 text-green-700"
      : prediction.delayRisk === "MEDIUM"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        Shipment Delay Predictor
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        AI forecast of shipment readiness.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Predicted Readiness
          </div>

          <div className="mt-2 text-3xl font-bold text-blue-700">
            {prediction.predictedReadiness}%
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Delay Risk
          </div>

          <div className="mt-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${badgeClass}`}
            >
              {prediction.delayRisk}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Recommendation
          </div>

          <div className="mt-2 text-sm text-slate-700">
            {prediction.recommendation}
          </div>
        </div>
      </div>
    </section>
  );
}