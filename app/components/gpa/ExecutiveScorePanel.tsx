"use client";

import {
  ExecutiveScoreResult,
} from "../../../lib/gpa/enterpriseExecutiveScoreEngine";

type Props = {
  score: ExecutiveScoreResult;
};

export default function ExecutiveScorePanel({
  score,
}: Props) {
  const badgeClass =
    score.status === "EXCELLENT"
      ? "bg-green-100 text-green-700"
      : score.status === "GOOD"
      ? "bg-blue-100 text-blue-700"
      : score.status === "WATCH"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        Enterprise Executive Score
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Overall enterprise performance indicator.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Executive Score
          </div>

          <div className="mt-2 text-4xl font-bold text-blue-700">
            {score.score}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Grade
          </div>

          <div className="mt-2 text-4xl font-bold text-slate-800">
            {score.grade}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">
            Enterprise Status
          </div>

          <div className="mt-2">
            <span
              className={`rounded-full px-4 py-2 text-sm font-bold ${badgeClass}`}
            >
              {score.status}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}