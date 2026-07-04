"use client";

import {
  EnterpriseLeaderboardEntry,
} from "../../../lib/gpa/enterpriseLeaderboardEngine";

type Props = {
  entries: EnterpriseLeaderboardEntry[];
};

export default function EnterpriseLeaderboardPanel({ entries }: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-slate-800">
        Enterprise Leaderboard
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Factory ranking by executive performance score.
      </p>

      <div className="mt-6 space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.factoryId}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div>
              <p className="text-sm font-bold text-blue-700">
                #{index + 1}
              </p>

              <h3 className="text-lg font-bold text-slate-800">
                {entry.factoryName}
              </h3>
            </div>

            <div className="text-3xl font-extrabold text-blue-700">
              {entry.executiveScore}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}