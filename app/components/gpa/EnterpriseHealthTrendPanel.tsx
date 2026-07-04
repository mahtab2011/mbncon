"use client";

import {
  EnterpriseHealthTrend,
} from "../../../lib/gpa/enterpriseHealthTrendEngine";

type Props = {
  trend: EnterpriseHealthTrend;
};

export default function EnterpriseHealthTrendPanel({
  trend,
}: Props) {
  const color =
    trend.direction === "UP"
      ? "text-green-600"
      : trend.direction === "DOWN"
      ? "text-red-600"
      : "text-slate-600";

  const symbol =
    trend.direction === "UP"
      ? "▲"
      : trend.direction === "DOWN"
      ? "▼"
      : "■";

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        Enterprise Health Trend
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Current Health
          </div>

          <div className="mt-2 text-3xl font-bold">
            {trend.current}%
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Previous
          </div>

          <div className="mt-2 text-3xl font-bold">
            {trend.previous}%
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Trend
          </div>

          <div className={`mt-2 text-3xl font-bold ${color}`}>
            {symbol} {trend.change > 0 ? "+" : ""}
            {trend.change}%
          </div>
        </div>
      </div>
    </section>
  );
}