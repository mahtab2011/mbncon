"use client";

import { patternMaster } from "@/lib/manufacturing/pattern-intelligence/patternMaster";

function statusClass(status: string) {
  if (status === "APPROVED") {
    return "bg-green-100 text-green-700";
  }

  if (status === "UNDER_REVIEW") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-red-100 text-red-700";
}

export default function PatternIntelligencePage() {
  const totalPatterns = patternMaster.length;

  const underReview = patternMaster.filter(
    (pattern) => pattern.status === "UNDER_REVIEW"
  ).length;

  const approved = patternMaster.filter(
    (pattern) => pattern.status === "APPROVED"
  ).length;

  const totalArea = patternMaster.reduce(
    (sum, pattern) => sum + pattern.areaSqCm,
    0
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          Pattern Intelligence Centre
        </h1>

        <p className="mt-2 text-gray-600">
          AI-assisted pattern measurement, revision control and
          scale-based dimension verification.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Patterns" value={totalPatterns.toString()} />
        <Card title="Approved" value={approved.toString()} />
        <Card title="Under Review" value={underReview.toString()} />
        <Card title="Total Area" value={`${totalArea.toLocaleString()} cm²`} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Pattern Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI compares approved dimensions with photo-measured dimensions
          using a 30 cm / 12 inch scale reference. Patterns exceeding
          tolerance are automatically flagged for review before marker
          planning or bulk cutting.
        </p>
      </section>

      <div className="grid gap-6">
        {patternMaster.map((pattern) => {
          const lengthDiff =
            pattern.aiMeasuredLengthMm - pattern.lengthMm;

          const widthDiff =
            pattern.aiMeasuredWidthMm - pattern.widthMm;

          const outOfTolerance =
            Math.abs(lengthDiff) > pattern.toleranceMm ||
            Math.abs(widthDiff) > pattern.toleranceMm;

          return (
            <section
              key={pattern.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-700">
                    {pattern.id} — {pattern.garmentPart}
                  </h2>

                  <p className="text-gray-600">
                    {pattern.buyer} · {pattern.style} · Size {pattern.size}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${statusClass(
                    pattern.status
                  )}`}
                >
                  {pattern.status}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <Metric title="Length" value={`${pattern.lengthMm} mm`} />
                <Metric title="Width" value={`${pattern.widthMm} mm`} />
                <Metric title="AI Length" value={`${pattern.aiMeasuredLengthMm} mm`} />
                <Metric title="AI Width" value={`${pattern.aiMeasuredWidthMm} mm`} />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-4">
                <Metric title="Length Diff" value={`${lengthDiff} mm`} />
                <Metric title="Width Diff" value={`${widthDiff} mm`} />
                <Metric title="Tolerance" value={`±${pattern.toleranceMm} mm`} />
                <Metric
                  title="AI Result"
                  value={outOfTolerance ? "Review Required" : "Within Tolerance"}
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <Info title="Fabric Type" value={pattern.fabricType} />
                <Info title="Grain Line" value={pattern.grainLine} />
                <Info title="Revision" value={pattern.patternRevision} />
              </div>

              <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  AI Recommendation
                </p>

                <p className="mt-2 text-gray-700">
                  {outOfTolerance
                    ? "Pattern measurement exceeds tolerance. Review the physical pattern, scale photo and revision history before marker planning."
                    : "Pattern is within approved tolerance. It can proceed to marker planning and consumption estimation."}
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-700">
        {value}
      </h2>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-1 font-bold">{value}</h3>
    </div>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <p className="mt-2 text-gray-700">{value}</p>
    </div>
  );
}