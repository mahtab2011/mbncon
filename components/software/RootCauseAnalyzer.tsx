"use client";

import { useMemo, useState } from "react";
import { analyzeRootCause } from "@/lib/software/rootCauseEngine";

export default function RootCauseAnalyzer() {
  const [issue, setIssue] = useState("");

  const result = useMemo(() => {
    if (!issue.trim()) return null;
    return analyzeRootCause(issue);
  }, [issue]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          AI Root Cause Analysis
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Identify likely operational root causes from factory problems.
        </p>
      </div>

      <textarea
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        rows={5}
        placeholder="Example: Shipment delayed due to sewing line bottleneck..."
        className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
      />

      {result && (
        <div className="mt-6 rounded-2xl bg-neutral-100 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Probable Root Causes
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm font-medium text-neutral-700">
            {result.possibleCauses.map((cause) => (
              <li key={cause}>{cause}</li>
            ))}
          </ul>

          <div className="mt-5 rounded-xl bg-white p-4">
            <p className="text-sm font-semibold text-neutral-500">
              Recommendation
            </p>

            <p className="mt-2 font-semibold text-neutral-900">
              {result.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}