"use client";

import {
  ExecutiveIntervention,
} from "../../../lib/gpa/executiveInterventionQueueEngine";

type Props = {
  interventions: ExecutiveIntervention[];
};

export default function ExecutiveInterventionQueuePanel({
  interventions,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        Executive Intervention Queue
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Priority actions requiring executive attention.
      </p>

      <div className="mt-6 space-y-4">
        {interventions.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800">
                  {item.factoryName}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {item.issue}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  item.priority === "HIGH"
                    ? "bg-red-100 text-red-700"
                    : item.priority === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {item.priority}
              </span>
            </div>

            <p className="mt-3 text-sm font-semibold text-blue-700">
              {item.action}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}