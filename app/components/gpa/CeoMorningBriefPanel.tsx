"use client";

import {
  CeoMorningBrief,
} from "../../../lib/gpa/ceoMorningBriefEngine";

type Props = {
  brief: CeoMorningBrief;
};

export default function CeoMorningBriefPanel({
  brief,
}: Props) {
  return (
    <section className="rounded-2xl bg-slate-900 p-6 text-white shadow">
      <h2 className="text-2xl font-bold">
        CEO Morning Brief
      </h2>

      <p className="mt-4 rounded-lg bg-white/10 p-4 text-lg font-semibold">
        {brief.headline}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold">
            Executive Summary
          </h3>

          <ul className="space-y-2">
            {brief.summary.map((item) => (
              <li key={item}>
                • {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold">
            Today's Priorities
          </h3>

          <ul className="space-y-2">
            {brief.priorities.map((item) => (
              <li key={item}>
                ✓ {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}