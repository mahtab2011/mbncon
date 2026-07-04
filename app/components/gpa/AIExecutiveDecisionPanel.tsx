"use client";

import {
  ExecutiveDecision,
} from "../../../lib/gpa/aiExecutiveDecisionEngine";

type Props = {
  decisions: ExecutiveDecision[];
};

export default function AIExecutiveDecisionPanel({
  decisions,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        AI Executive Decision Centre
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        AI-generated executive recommendations for enterprise operations.
      </p>

      <div className="mt-6 space-y-4">
        {decisions.map((decision) => (
          <div
            key={decision.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {decision.title}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  decision.priority === "HIGH"
                    ? "bg-red-100 text-red-700"
                    : decision.priority === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {decision.priority}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              {decision.recommendation}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}