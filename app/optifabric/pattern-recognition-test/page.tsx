"use client";

import {
  calculatePatternRecognitionSummary,
  getPatternsRequiringReview,
  getRecognisedPatternsForMarker,
  recogniseProjectPatterns,
} from "@/lib/optifabric/patternRecognitionEngine";

import { PatternRecognitionInput } from "@/lib/optifabric/patternRecognitionTypes";

const TEST_PROJECT_ID = "optifabric-recognition-test";

const testPatterns: PatternRecognitionInput[] = [
  {
    patternId: "pattern-001",
    projectId: TEST_PROJECT_ID,
    name: "Shirt Front",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 1,
    description: "Main front body pattern",
    uploaded: true,
    detectedWidthPixels: 720,
    detectedHeightPixels: 1540,
    calibratedWidthCm: 38,
    calibratedHeightCm: 78,
    calibratedAreaSqCm: 2180,
    calibratedPerimeterCm: 226,
  },
  {
    patternId: "pattern-002",
    projectId: TEST_PROJECT_ID,
    name: "Shirt Back",
    required: true,
    cutQuantity: 1,
    cutOnFold: true,
    custom: false,
    sequence: 2,
    description: "Back body pattern cut on fold",
    uploaded: true,
    detectedWidthPixels: 760,
    detectedHeightPixels: 1580,
    calibratedWidthCm: 40,
    calibratedHeightCm: 80,
    calibratedAreaSqCm: 2310,
    calibratedPerimeterCm: 232,
  },
  {
    patternId: "pattern-003",
    projectId: TEST_PROJECT_ID,
    name: "Long Sleeve",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 3,
    description: "Long sleeve pair",
    uploaded: true,
    detectedWidthPixels: 640,
    detectedHeightPixels: 1320,
    calibratedWidthCm: 34,
    calibratedHeightCm: 66,
    calibratedAreaSqCm: 1470,
    calibratedPerimeterCm: 194,
  },
  {
    patternId: "pattern-004",
    projectId: TEST_PROJECT_ID,
    name: "Collar Stand",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 4,
    description: "Collar stand pattern",
    uploaded: true,
    detectedWidthPixels: 820,
    detectedHeightPixels: 190,
    calibratedWidthCm: 42,
    calibratedHeightCm: 9,
    calibratedAreaSqCm: 292,
    calibratedPerimeterCm: 98,
  },
  {
    patternId: "pattern-005",
    projectId: TEST_PROJECT_ID,
    name: "Cuff",
    required: true,
    cutQuantity: 2,
    cutOnFold: false,
    custom: false,
    sequence: 5,
    description: "Shirt cuff pair",
    uploaded: true,
    detectedWidthPixels: 480,
    detectedHeightPixels: 260,
    calibratedWidthCm: 25,
    calibratedHeightCm: 13,
    calibratedAreaSqCm: 275,
    calibratedPerimeterCm: 72,
  },
  {
    patternId: "pattern-006",
    projectId: TEST_PROJECT_ID,
    name: "Hidden Placket",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: true,
    sequence: 6,
    description: "Premium concealed front placket",
    uploaded: true,
    detectedWidthPixels: 180,
    detectedHeightPixels: 1360,
    calibratedWidthCm: 9,
    calibratedHeightCm: 68,
    calibratedAreaSqCm: 520,
    calibratedPerimeterCm: 154,
  },
  {
    patternId: "pattern-007",
    projectId: TEST_PROJECT_ID,
    name: "Collar Stay",
    required: false,
    cutQuantity: 2,
    cutOnFold: false,
    custom: true,
    sequence: 7,
    description: "Collar reinforcement stay",
    uploaded: true,
    detectedWidthPixels: 160,
    detectedHeightPixels: 360,
    calibratedWidthCm: 8,
    calibratedHeightCm: 18,
    calibratedAreaSqCm: 92,
    calibratedPerimeterCm: 48,
  },
  {
    patternId: "pattern-008",
    projectId: TEST_PROJECT_ID,
    name: "Decorative Back Pleat Guide",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: true,
    sequence: 8,
    description: "Guide used for decorative pleat placement",
    uploaded: true,
  },
  {
    patternId: "pattern-009",
    projectId: TEST_PROJECT_ID,
    name: "Unknown Custom Detail",
    required: false,
    cutQuantity: 1,
    cutOnFold: false,
    custom: true,
    sequence: 9,
    description: "Unidentified custom pattern component",
    uploaded: true,
  },
];

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatLabel(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusClasses(status: string): string {
  if (status === "recognised") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "requires-review") {
    return "border-amber-500/40 bg-amber-500/10 text-amber-300";
  }

  if (status === "rejected") {
    return "border-red-500/40 bg-red-500/10 text-red-300";
  }

  return "border-slate-500/40 bg-slate-500/10 text-slate-300";
}

export default function PatternRecognitionTestPage() {
  const recognitionResult = recogniseProjectPatterns(
    TEST_PROJECT_ID,
    testPatterns
  );

  const summary = calculatePatternRecognitionSummary(
    recognitionResult.patterns
  );

  const markerPatterns = getRecognisedPatternsForMarker(
    recognitionResult.patterns
  );

  const reviewPatterns = getPatternsRequiringReview(
    recognitionResult.patterns
  );

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950 p-6 shadow-2xl sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            OptiFabric AI · RC3 Test
          </p>

          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            AI Pattern Recognition Engine
          </h1>

          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300 sm:text-lg">
            This test page sends sample shirt patterns through the recognition
            engine and displays the resulting engineering classification,
            confidence, restrictions, warnings and marker eligibility.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Patterns Analysed"
            value={recognitionResult.totalPatterns.toString()}
          />

          <MetricCard
            label="Recognised"
            value={recognitionResult.recognisedPatterns.toString()}
          />

          <MetricCard
            label="Requires Review"
            value={recognitionResult.reviewRequired.toString()}
          />

          <MetricCard
            label="Average Confidence"
            value={formatPercentage(recognitionResult.averageConfidence)}
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-cyan-300">
              Recognition Summary
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Project Engineering Statistics
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryItem
              label="Main Fabric"
              value={summary.mainFabricPatterns}
            />

            <SummaryItem
              label="Lining"
              value={summary.liningPatterns}
            />

            <SummaryItem
              label="Fusing / Interlining"
              value={summary.fusingPatterns}
            />

            <SummaryItem
              label="Cut on Fold"
              value={summary.foldPatterns}
            />

            <SummaryItem
              label="Paired Pieces"
              value={summary.pairedPatterns}
            />

            <SummaryItem
              label="Marker Eligible"
              value={summary.markerEligiblePatterns}
            />

            <SummaryItem
              label="Review Required"
              value={summary.reviewRequired}
            />

            <SummaryItem
              label="Marker Output"
              value={markerPatterns.length}
            />
          </div>
        </section>

        <section className="mt-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-cyan-300">
              Recognition Results
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Pattern-by-Pattern Engineering Analysis
            </h2>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {recognitionResult.patterns.map((pattern) => (
              <article
                key={pattern.patternId}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Original: {pattern.originalName}
                    </p>

                    <h3 className="mt-1 text-2xl font-black text-white">
                      {pattern.recognisedName}
                    </h3>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getStatusClasses(
                      pattern.status
                    )}`}
                  >
                    {formatLabel(pattern.status)}
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <EngineeringValue
                    label="Material"
                    value={formatLabel(pattern.materialCategory)}
                  />

                  <EngineeringValue
                    label="Side"
                    value={formatLabel(pattern.side)}
                  />

                  <EngineeringValue
                    label="Grain Direction"
                    value={formatLabel(pattern.grainDirection)}
                  />

                  <EngineeringValue
                    label="Symmetry"
                    value={formatLabel(pattern.symmetry)}
                  />

                  <EngineeringValue
                    label="Rotation Rule"
                    value={formatLabel(pattern.rotationRule)}
                  />

                  <EngineeringValue
                    label="Cut Quantity"
                    value={pattern.cutQuantity.toString()}
                  />

                  <EngineeringValue
                    label="Cut on Fold"
                    value={pattern.cutOnFold ? "Yes" : "No"}
                  />

                  <EngineeringValue
                    label="Pair Required"
                    value={pattern.requiresPair ? "Yes" : "No"}
                  />

                  <EngineeringValue
                    label="Marker Eligible"
                    value={pattern.markerEligible ? "Yes" : "No"}
                  />

                  <EngineeringValue
                    label="AI Confidence"
                    value={formatPercentage(pattern.confidence.overall)}
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Why did AI decide this?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {pattern.explanation}
                  </p>
                </div>

                {pattern.restrictions.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-bold text-white">
                      Marker Restrictions
                    </p>

                    <div className="mt-3 space-y-2">
                      {pattern.restrictions.map((restriction) => (
                        <div
                          key={restriction.id}
                          className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100"
                        >
                          {restriction.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pattern.warnings.length > 0 && (
                  <div className="mt-5">
                    <p className="text-sm font-bold text-white">
                      AI Warnings
                    </p>

                    <div className="mt-3 space-y-2">
                      {pattern.warnings.map((warning) => (
                        <div
                          key={warning.id}
                          className={
                            warning.severity === "critical"
                              ? "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                              : "rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
                          }
                        >
                          <span className="font-bold">
                            {warning.code.replace(/_/g, " ")}:
                          </span>{" "}
                          {warning.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-amber-300">
            Manual Review Queue
          </p>

          <h2 className="mt-2 text-2xl font-black">
            {reviewPatterns.length} Pattern
            {reviewPatterns.length === 1 ? "" : "s"} Require Review
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reviewPatterns.map((pattern) => (
              <div
                key={pattern.patternId}
                className="rounded-2xl border border-amber-500/20 bg-slate-950/50 p-4"
              >
                <p className="font-bold text-white">
                  {pattern.recognisedName}
                </p>

                <p className="mt-1 text-sm text-amber-100">
                  Confidence:{" "}
                  {formatPercentage(pattern.confidence.overall)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 text-3xl font-black text-cyan-300">{value}</p>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function EngineeringValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-100">{value}</p>
    </div>
  );
}