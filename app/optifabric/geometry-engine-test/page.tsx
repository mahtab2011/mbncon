"use client";

import { useMemo } from "react";

import {
  calculateBoundingBoxUtilisation,
  generateProjectGeometry,
  getValidGeometryPatterns,
  PatternGeometryInput,
  sortPatternsForPacking,
} from "@/lib/optifabric/patternGeometryEngine";

import {
  GeometryPoint,
  PatternGeometryResult,
} from "@/lib/optifabric/patternGeometryTypes";

const TEST_PROJECT_ID = "optifabric-geometry-engine-test";

const frontPanelVertices: GeometryPoint[] = [
  { x: 90, y: 40 },
  { x: 250, y: 35 },
  { x: 292, y: 78 },
  { x: 315, y: 170 },
  { x: 300, y: 340 },
  { x: 286, y: 545 },
  { x: 270, y: 730 },
  { x: 122, y: 735 },
  { x: 108, y: 560 },
  { x: 96, y: 350 },
  { x: 75, y: 175 },
  { x: 62, y: 95 },
];

const backPanelVertices: GeometryPoint[] = [
  { x: 80, y: 35 },
  { x: 260, y: 35 },
  { x: 295, y: 82 },
  { x: 310, y: 190 },
  { x: 300, y: 390 },
  { x: 288, y: 735 },
  { x: 92, y: 735 },
  { x: 82, y: 390 },
  { x: 65, y: 190 },
  { x: 48, y: 82 },
];

const sleeveVertices: GeometryPoint[] = [
  { x: 55, y: 80 },
  { x: 145, y: 38 },
  { x: 235, y: 60 },
  { x: 295, y: 125 },
  { x: 268, y: 290 },
  { x: 238, y: 470 },
  { x: 205, y: 640 },
  { x: 120, y: 645 },
  { x: 92, y: 470 },
  { x: 68, y: 285 },
];

const collarVertices: GeometryPoint[] = [
  { x: 35, y: 55 },
  { x: 420, y: 45 },
  { x: 438, y: 92 },
  { x: 410, y: 138 },
  { x: 55, y: 145 },
  { x: 22, y: 98 },
];

const cuffVertices: GeometryPoint[] = [
  { x: 30, y: 35 },
  { x: 270, y: 35 },
  { x: 280, y: 115 },
  { x: 25, y: 115 },
];

const pocketVertices: GeometryPoint[] = [
  { x: 45, y: 30 },
  { x: 220, y: 30 },
  { x: 218, y: 185 },
  { x: 135, y: 238 },
  { x: 48, y: 185 },
];

const testGeometryInputs: PatternGeometryInput[] = [
  {
    patternId: "geometry-front",
    recognisedName: "Front",
    vertices: frontPanelVertices,
    pixelsPerCm: 10,
    grainControlled: true,
    cutOnFold: false,
    mirroredPair: true,
    rotation: "rotate-180",
    directionalFabric: false,
    stripeMatch: false,
    checkMatch: false,
    napDirection: false,
    cutQuantity: 2,
    markerEligible: true,
  },
  {
    patternId: "geometry-back",
    recognisedName: "Back",
    vertices: backPanelVertices,
    pixelsPerCm: 10,
    grainControlled: true,
    cutOnFold: true,
    mirroredPair: false,
    rotation: "fixed",
    directionalFabric: false,
    stripeMatch: false,
    checkMatch: false,
    napDirection: false,
    cutQuantity: 1,
    markerEligible: true,
  },
  {
    patternId: "geometry-sleeve",
    recognisedName: "Sleeve",
    vertices: sleeveVertices,
    pixelsPerCm: 10,
    grainControlled: true,
    cutOnFold: false,
    mirroredPair: true,
    rotation: "rotate-180",
    directionalFabric: false,
    stripeMatch: false,
    checkMatch: false,
    napDirection: false,
    cutQuantity: 2,
    markerEligible: true,
  },
  {
    patternId: "geometry-collar",
    recognisedName: "Collar",
    vertices: collarVertices,
    pixelsPerCm: 10,
    grainControlled: true,
    cutOnFold: false,
    mirroredPair: false,
    rotation: "rotate-180",
    directionalFabric: false,
    stripeMatch: true,
    checkMatch: false,
    napDirection: false,
    cutQuantity: 2,
    markerEligible: true,
  },
  {
    patternId: "geometry-cuff",
    recognisedName: "Cuff",
    vertices: cuffVertices,
    pixelsPerCm: 10,
    grainControlled: true,
    cutOnFold: false,
    mirroredPair: true,
    rotation: "rotate-180",
    directionalFabric: false,
    stripeMatch: false,
    checkMatch: false,
    napDirection: false,
    cutQuantity: 2,
    markerEligible: true,
  },
  {
    patternId: "geometry-pocket",
    recognisedName: "Pocket",
    vertices: pocketVertices,
    pixelsPerCm: 10,
    grainControlled: true,
    cutOnFold: false,
    mirroredPair: false,
    rotation: "rotate-180",
    directionalFabric: false,
    stripeMatch: false,
    checkMatch: false,
    napDirection: false,
    cutQuantity: 1,
    markerEligible: true,
  },
];

function formatNumber(
  value: number | undefined,
  decimals = 2
): string {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value.toFixed(decimals);
}

function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatLabel(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

export default function GeometryEngineTestPage() {
  const projectGeometry = useMemo(
    () =>
      generateProjectGeometry(
        TEST_PROJECT_ID,
        testGeometryInputs
      ),
    []
  );

  const validPatterns = useMemo(
    () =>
      getValidGeometryPatterns(
        projectGeometry.patterns
      ),
    [projectGeometry.patterns]
  );

  const packingSequence = useMemo(
    () =>
      sortPatternsForPacking(
        projectGeometry.patterns
      ),
    [projectGeometry.patterns]
  );

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-slate-900 via-violet-950 to-blue-950 p-7 shadow-2xl shadow-violet-950/30 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-violet-300">
            OptiFabric AI · RC4 Test
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Pattern Geometry Engine
          </h1>

          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-300">
            This page sends six representative shirt-pattern
            polygons through the reusable geometry engine and
            verifies their area, perimeter, dimensions,
            centroid, compactness, packing priority and
            engineering readiness.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Patterns Processed"
            value={String(
              projectGeometry.summary.totalPatterns
            )}
            detail="Sample polygon inputs"
          />

          <MetricCard
            label="Valid Polygons"
            value={String(validPatterns.length)}
            detail="Closed measurable geometry"
          />

          <MetricCard
            label="Total Pattern Area"
            value={`${formatNumber(
              projectGeometry.summary.totalAreaCm2
            )} cm²`}
            detail="Combined sample area"
          />

          <MetricCard
            label="Engineering Score"
            value={`${formatNumber(
              projectGeometry.summary
                .averageEngineeringScore,
              1
            )}%`}
            detail="Average geometry readiness"
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
              Project geometry summary
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Engineering Calculation Results
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Total Perimeter"
              value={`${formatNumber(
                projectGeometry.summary
                  .totalPerimeterCm
              )} cm`}
            />

            <SummaryCard
              label="Average Compactness"
              value={formatPercentage(
                projectGeometry.summary
                  .averageCompactness
              )}
            />

            <SummaryCard
              label="Average Engineering Score"
              value={`${formatNumber(
                projectGeometry.summary
                  .averageEngineeringScore,
                1
              )}%`}
            />

            <SummaryCard
              label="Generated"
              value={new Date(
                projectGeometry.summary.generatedAt
              ).toLocaleTimeString()}
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-950/10 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">
            Recommended packing order
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Marker Placement Priority
          </h2>

          <p className="mt-3 max-w-4xl leading-7 text-slate-300">
            Large, constrained and difficult-to-pack pieces
            should normally be positioned before smaller
            pieces are used to fill the remaining gaps.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packingSequence.map(
              (pattern, index) => (
                <article
                  key={pattern.patternId}
                  className="rounded-2xl border border-amber-400/20 bg-slate-950/60 p-5"
                >
                  <p className="text-sm font-black uppercase tracking-wider text-amber-300">
                    Priority {index + 1}
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    {pattern.recognisedName}
                  </h3>

                  <p className="mt-3 text-sm text-slate-400">
                    Packing score:{" "}
                    <span className="font-black text-white">
                      {pattern.packingPriority}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Marker weight:{" "}
                    <span className="font-black text-white">
                      {formatNumber(
                        pattern.markerWeight,
                        0
                      )}
                    </span>
                  </p>
                </article>
              )
            )}
          </div>
        </section>

        <section className="mt-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
            Pattern-by-pattern analysis
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Geometry Results
          </h2>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {projectGeometry.patterns.map(
              (pattern) => (
                <GeometryPatternCard
                  key={pattern.patternId}
                  pattern={pattern}
                />
              )
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            Test result
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {validPatterns.length ===
            projectGeometry.patterns.length
              ? "Geometry Engine Passed"
              : "Geometry Review Required"}
          </h2>

          <p className="mt-3 max-w-4xl leading-7 text-emerald-100/80">
            {validPatterns.length ===
            projectGeometry.patterns.length
              ? "All sample patterns produced closed polygons with measurable area and perimeter. The engine is ready to be connected to project geometry data."
              : `${projectGeometry.patterns.length - validPatterns.length} sample pattern(s) did not produce valid geometry.`}
          </p>
        </section>
      </div>
    </main>
  );
}

function GeometryPatternCard({
  pattern,
}: {
  pattern: PatternGeometryResult;
}) {
  const boundingBoxUtilisation =
    calculateBoundingBoxUtilisation(
      pattern.polygon.area.squarePixels,
      pattern.polygon.boundingBox
    );

  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-violet-300">
            Geometry analysed
          </p>

          <h3 className="mt-2 text-2xl font-black">
            {pattern.recognisedName}
          </h3>
        </div>

        <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
          {pattern.polygon.closed
            ? "Valid Polygon"
            : "Open Polygon"}
        </span>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-4">
        <PolygonPreview pattern={pattern} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <EngineeringValue
          label="Vertices"
          value={String(
            pattern.polygon.vertexCount
          )}
        />

        <EngineeringValue
          label="Area"
          value={`${formatNumber(
            pattern.polygon.area.squareCm
          )} cm²`}
        />

        <EngineeringValue
          label="Perimeter"
          value={`${formatNumber(
            pattern.polygon.perimeter.cm
          )} cm`}
        />

        <EngineeringValue
          label="Dimensions"
          value={`${formatNumber(
            pattern.dimensions.widthCm
          )} × ${formatNumber(
            pattern.dimensions.heightCm
          )} cm`}
        />

        <EngineeringValue
          label="Centroid"
          value={`${formatNumber(
            pattern.polygon.centroid.x,
            1
          )}, ${formatNumber(
            pattern.polygon.centroid.y,
            1
          )}`}
        />

        <EngineeringValue
          label="Aspect Ratio"
          value={formatNumber(
            pattern.aspectRatio,
            3
          )}
        />

        <EngineeringValue
          label="Compactness"
          value={formatPercentage(
            pattern.compactness
          )}
        />

        <EngineeringValue
          label="Box Utilisation"
          value={formatPercentage(
            boundingBoxUtilisation
          )}
        />

        <EngineeringValue
          label="Packing Priority"
          value={String(
            pattern.packingPriority
          )}
        />

        <EngineeringValue
          label="Engineering Score"
          value={`${pattern.engineeringScore}%`}
        />

        <EngineeringValue
          label="Rotation"
          value={formatLabel(
            pattern.constraints.rotation
          )}
        />

        <EngineeringValue
          label="Marker Weight"
          value={formatNumber(
            pattern.markerWeight,
            0
          )}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
        <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
          Marker engineering interpretation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          This pattern has a packing priority of{" "}
          <strong>
            {pattern.packingPriority}
          </strong>
          . Its rotation rule is{" "}
          <strong>
            {formatLabel(
              pattern.constraints.rotation
            )}
          </strong>
          {pattern.constraints.cutOnFold
            ? ", and it must be positioned against the fabric fold"
            : ""}
          {pattern.constraints.mirroredPair
            ? ", with a mirrored or paired cutting requirement"
            : ""}
          .
        </p>
      </div>
    </article>
  );
}

function PolygonPreview({
  pattern,
}: {
  pattern: PatternGeometryResult;
}) {
  const box = pattern.polygon.boundingBox;

  const padding = 20;

  const viewBoxWidth =
    Math.max(box.width, 1) +
    padding * 2;

  const viewBoxHeight =
    Math.max(box.height, 1) +
    padding * 2;

  const pointString =
    pattern.polygon.vertices
      .map(
        (point) =>
          `${point.x - box.minX + padding},${
            point.y - box.minY + padding
          }`
      )
      .join(" ");

  const centroidX =
    pattern.polygon.centroid.x -
    box.minX +
    padding;

  const centroidY =
    pattern.polygon.centroid.y -
    box.minY +
    padding;

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      className="h-72 w-full"
      role="img"
      aria-label={`${pattern.recognisedName} polygon preview`}
    >
      <polygon
        points={pointString}
        fill="rgba(34, 211, 238, 0.12)"
        stroke="rgb(34, 211, 238)"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />

      {pattern.polygon.vertices.map(
        (point, index) => (
          <circle
            key={`${pattern.patternId}-${index}`}
            cx={
              point.x -
              box.minX +
              padding
            }
            cy={
              point.y -
              box.minY +
              padding
            }
            r="4"
            fill="rgb(167, 139, 250)"
            vectorEffect="non-scaling-stroke"
          />
        )
      )}

      <circle
        cx={centroidX}
        cy={centroidY}
        r="6"
        fill="rgb(251, 191, 36)"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-cyan-300">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {detail}
      </p>
    </article>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
      <p className="text-sm font-bold text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">
        {value}
      </p>
    </article>
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
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-100">
        {value}
      </p>
    </div>
  );
}