"use client";

import BoundaryQualityBadge from "./BoundaryQualityBadge";
import { BoundaryQualityRuleResult } from "./BoundaryQualityRules";

interface BoundaryQualityPanelProps {
  score: number;
  grade: "A" | "B" | "C" | "D";
  rules: BoundaryQualityRuleResult[];
}

export default function BoundaryQualityPanel({
  score,
  grade,
  rules,
}: BoundaryQualityPanelProps) {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
            Engineering Review
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Boundary Quality Analysis
          </h2>
        </div>

        <BoundaryQualityBadge
          score={score}
          grade={grade}
        />
      </div>

      <div className="mt-6 space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`rounded-2xl border p-4 ${
              rule.passed
                ? "border-emerald-400/20 bg-emerald-950/10"
                : rule.severity === "critical"
                ? "border-red-400/20 bg-red-950/10"
                : "border-amber-400/20 bg-amber-950/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white">
                {rule.label}
              </h3>

              <span
                className={`rounded-lg px-3 py-1 text-xs font-black ${
                  rule.passed
                    ? "bg-emerald-500/20 text-emerald-300"
                    : rule.severity === "critical"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {rule.passed ? "PASS" : "CHECK"}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {rule.message}
            </p>

            {!rule.passed && rule.recommendation ? (
              <p className="mt-2 text-sm text-cyan-300">
                Recommendation: {rule.recommendation}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}