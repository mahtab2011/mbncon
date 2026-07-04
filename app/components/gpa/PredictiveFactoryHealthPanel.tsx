"use client";

import {
  PredictiveHealthResult,
} from "../../../lib/gpa/predictiveFactoryHealthEngine";

type Props = {
  prediction: PredictiveHealthResult;
};

export default function PredictiveFactoryHealthPanel({
  prediction,
}: Props) {
  const badgeClass =
    prediction.outlook === "IMPROVING"
      ? "bg-green-100 text-green-700"
      : prediction.outlook === "STABLE"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        Predictive Factory Health
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Forecast based on current enterprise trend.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Predicted Health
          </div>

          <div className="mt-2 text-3xl font-bold text-blue-700">
            {prediction.predictedHealth}%
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Outlook
          </div>

          <div className="mt-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold ${badgeClass}`}
            >
              {prediction.outlook}
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