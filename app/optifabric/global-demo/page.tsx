import Link from "next/link";

import WhyAiAsksPanel from "@/components/optifabric/WhyAiAsksPanel";

import {
  garmentCategoryMaster,
  garmentCategoryRoadmap,
  getEngineeringDatasetByCode,
  getGarmentCategoryById,
  getPatternPieceById,
  plannedEngineeringDatasets,
  validateEngineeringDataset,
} from "@/lib/optifabric/masters";

function formatPlacementRule(rule: string): string {
  return rule
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function formatCutInstruction(
  instruction: string | undefined
): string {
  if (!instruction) {
    return "Not specified";
  }

  const labels: Record<string, string> = {
    "cut-one": "Cut One",
    "cut-one-pair": "Cut One Pair",
    "cut-two": "Cut Two",
    "cut-on-fold": "Cut on Fold",
    "cut-as-required": "Cut as Required",
  };

  return labels[instruction] ?? formatPlacementRule(instruction);
}

function formatSide(side: string | undefined): string {
  if (!side) {
    return "Not specified";
  }

  const labels: Record<string, string> = {
    left: "Left",
    right: "Right",
    pair: "Pair",
    centre: "Centre",
    "not-applicable": "Not Applicable",
  };

  return labels[side] ?? formatPlacementRule(side);
}

export default function OptiFabricGlobalDemoPage() {
  const dataset = getEngineeringDatasetByCode("EDS-001");

  if (!dataset) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-500/40 bg-red-950/30 p-10">
          <h1 className="text-3xl font-black text-red-300">
            EDS-001 could not be loaded
          </h1>

          <p className="mt-4 text-slate-300">
            Please check the Engineering Demonstration Dataset
            Master.
          </p>
        </div>
      </main>
    );
  }

  const garmentCategory = getGarmentCategoryById(
    dataset.garmentCategoryId
  );

  const validation = validateEngineeringDataset(dataset);

  const activeGarmentCategories =
    garmentCategoryMaster
      .filter((category) => category.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  const patternPieceRows = dataset.patternPieces.map(
    (datasetPiece) => {
      const patternPiece = getPatternPieceById(
        datasetPiece.patternPieceId
      );

      return {
        datasetPiece,
        patternPiece,
      };
    }
  );

  const totalPatternComponents =
    dataset.patternPieces.length;

  const totalCutPiecesPerGarment =
    dataset.patternPieces.reduce(
      (total, piece) =>
        total + piece.quantityPerGarment,
      0
    );

  const sizeRatioEntries = Object.entries(
    dataset.orderPlan.sizeRatio ?? {}
  );

  const totalRatio = sizeRatioEntries.reduce(
    (total, [, ratio]) => total + ratio,
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  Global Demo 001
                </span>

                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                  Commercial MVP
                </span>

                <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                  Engineering Dataset
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                OptiFabric AI
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                  Global Engineering Demonstration
                </span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
                A scalable AI-powered fabric cutting and
                engineering platform for woven, knit, denim,
                outerwear, sportswear, uniforms, workwear and
                other applicable sewn-product categories.
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-400">
                The demonstration datasets are reusable engineering
                assets for system validation, product demonstrations,
                customer presentations, user training and factory
                onboarding. They do not limit the commercial scope of
                OptiFabric AI.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/optifabric"
                className="rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-400 hover:bg-slate-800"
              >
                ← OptiFabric Home
              </Link>

              <Link
               href="/optifabric/global-demo/start"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
              >
                Start Engineering Workflow →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-6 py-10">
        <section>
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              Scalable Product Architecture
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Garment Category Master
            </h2>

            <p className="mt-3 max-w-4xl text-slate-400">
              Garment categories are controlled by master data.
              Additional categories can be added without rebuilding
              the measurement, marker, lay-planning or consumption
              engines.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {activeGarmentCategories.map((category) => {
              const selected =
                category.id === dataset.garmentCategoryId;

              return (
                <article
                  key={category.id}
                  className={`rounded-2xl border p-5 transition ${
                    selected
                      ? "border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/30"
                      : "border-slate-800 bg-slate-900/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        {category.code}
                      </p>

                      <h3 className="mt-2 text-xl font-black">
                        {category.name.en}
                      </h3>
                    </div>

                    {selected ? (
                      <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-black text-slate-950">
                        SELECTED
                      </span>
                    ) : (
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-bold text-slate-400">
                        AVAILABLE
                      </span>
                    )}
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-400">
                    {category.description.en}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                      {category.constructionType.toUpperCase()}
                    </span>

                    {category.productGroups
                      .slice(0, 2)
                      .map((group) => (
                        <span
                          key={group}
                          className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300"
                        >
                          {formatPlacementRule(group)}
                        </span>
                      ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-950/70 p-3">
                      <p className="text-slate-500">
                        Standard Pieces
                      </p>
                      <p className="mt-1 text-lg font-black text-white">
                        {category.defaultPatternPieceIds.length}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-950/70 p-3">
                      <p className="text-slate-500">
                        Size Ratio
                      </p>
                      <p className="mt-1 text-lg font-black text-white">
                        {category.supportsSizeRatioPlanning
                          ? "Yes"
                          : "No"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {garmentCategory && (
          <WhyAiAsksPanel
            explanation={garmentCategory.whyAiAsks}
          />
        )}

        <section>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                Active Engineering Dataset
              </p>

              <h2 className="mt-2 text-3xl font-black">
                {dataset.name.en}
              </h2>

              <p className="mt-3 max-w-4xl text-slate-400">
                {dataset.description.en}
              </p>
            </div>

            <div
              className={`rounded-xl border px-4 py-3 ${
                validation.valid
                  ? "border-emerald-400/40 bg-emerald-400/10"
                  : "border-red-400/40 bg-red-400/10"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Dataset Validation
              </p>

              <p
                className={`mt-1 text-lg font-black ${
                  validation.valid
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {validation.valid
                  ? "VALIDATED"
                  : "ACTION REQUIRED"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Dataset Code
              </p>
              <p className="mt-3 text-2xl font-black text-cyan-300">
                {dataset.code}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Version {dataset.version}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Fabric Width
              </p>
              <p className="mt-3 text-2xl font-black">
                {dataset.fabricSpecification.fabricWidth}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {dataset.fabricSpecification.fabricWidthUnit}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Reference Lay
              </p>
              <p className="mt-3 text-2xl font-black">
                {dataset.fabricSpecification.referenceLayLength ??
                  "—"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {dataset.fabricSpecification.layLengthUnit ??
                  "Not entered"}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Order Quantity
              </p>
              <p className="mt-3 text-2xl font-black">
                {dataset.orderPlan.orderQuantity.toLocaleString(
                  "en-GB"
                )}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                garments
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Pattern Components
              </p>
              <p className="mt-3 text-2xl font-black">
                {totalPatternComponents}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {totalCutPiecesPerGarment} cut pieces per garment
              </p>
            </article>
          </div>
        </section>

        <WhyAiAsksPanel
          explanation={dataset.whyAiAsks}
        />

        <section className="grid gap-6 xl:grid-cols-3">
          <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                  EDS-001 Pattern Set
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Pattern-Piece Requirements
                </h2>
              </div>

              <span className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-300">
                {totalPatternComponents} component types
              </span>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-700 text-xs uppercase tracking-[0.15em] text-slate-500">
                    <th className="px-3 py-4">
                      Pattern Piece
                    </th>
                    <th className="px-3 py-4">
                      Code
                    </th>
                    <th className="px-3 py-4">
                      Quantity
                    </th>
                    <th className="px-3 py-4">
                      Side
                    </th>
                    <th className="px-3 py-4">
                      Cut Instruction
                    </th>
                    <th className="px-3 py-4">
                      Placement
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {patternPieceRows.map(
                    ({ datasetPiece, patternPiece }) => (
                      <tr
                        key={datasetPiece.id}
                        className="border-b border-slate-800 text-sm"
                      >
                        <td className="px-3 py-4">
                          <p className="font-bold text-white">
                            {patternPiece?.name.en ??
                              datasetPiece.patternPieceId}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {patternPiece?.name.bn ??
                              "Translation pending"}
                          </p>
                        </td>

                        <td className="px-3 py-4 font-mono text-xs text-cyan-300">
                          {patternPiece?.code ?? "Unknown"}
                        </td>

                        <td className="px-3 py-4">
                          <span className="rounded-lg bg-slate-800 px-3 py-2 font-black">
                            {datasetPiece.quantityPerGarment}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-slate-300">
                          {formatSide(datasetPiece.side)}
                        </td>

                        <td className="px-3 py-4 text-slate-300">
                          {formatCutInstruction(
                            datasetPiece.cutInstruction
                          )}
                        </td>

                        <td className="px-3 py-4">
                          <div className="flex flex-wrap gap-2">
                            {(
                              datasetPiece.placementRules ?? []
                            ).map((rule) => (
                              <span
                                key={rule}
                                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-300"
                              >
                                {formatPlacementRule(rule)}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <div className="space-y-6">
            <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                Size-Ratio Planning
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Reference Ratio
              </h2>

              <div className="mt-6 space-y-3">
                {sizeRatioEntries.map(([size, ratio]) => {
                  const percentage =
                    totalRatio > 0
                      ? (ratio / totalRatio) * 100
                      : 0;

                  return (
                    <div
                      key={size}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black">
                          {size}
                        </span>

                        <span className="text-sm font-bold text-cyan-300">
                          Ratio {ratio}
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        Approximately{" "}
                        {Math.round(
                          (dataset.orderPlan.orderQuantity *
                            ratio) /
                            totalRatio
                        ).toLocaleString("en-GB")}{" "}
                        garments
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                Lay Planning Inputs
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm text-slate-400">
                    Planned Plies
                  </span>
                  <span className="font-black">
                    {dataset.orderPlan.plannedPlies ?? "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm text-slate-400">
                    Bundle Size
                  </span>
                  <span className="font-black">
                    {dataset.orderPlan.bundleSize ?? "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-sm text-slate-400">
                    Allowance
                  </span>
                  <span className="font-black">
                    {dataset.orderPlan.allowancePercent ?? 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Fabric Structure
                  </span>
                  <span className="font-black capitalize">
                    {
                      dataset.fabricSpecification
                        .fabricStructure
                    }
                  </span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                Dataset Quality Control
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Engineering Validation Result
              </h2>
            </div>

            <span
              className={`rounded-xl px-4 py-2 text-sm font-black ${
                validation.valid
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-red-400 text-slate-950"
              }`}
            >
              {validation.valid
                ? "PASSED"
                : "FAILED"}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-950 p-5">
              <p className="text-sm text-slate-500">
                Validation Status
              </p>
              <p className="mt-2 text-xl font-black text-emerald-300">
                {validation.valid ? "Valid" : "Invalid"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5">
              <p className="text-sm text-slate-500">
                Errors
              </p>
              <p className="mt-2 text-xl font-black text-red-300">
                {validation.errors.length}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 p-5">
              <p className="text-sm text-slate-500">
                Warnings
              </p>
              <p className="mt-2 text-xl font-black text-amber-300">
                {validation.warnings.length}
              </p>
            </div>
          </div>

          {validation.errors.length > 0 && (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-950/30 p-5">
              <h3 className="font-black text-red-300">
                Validation Errors
              </h3>

              <div className="mt-3 space-y-2">
                {validation.errors.map((issue, index) => (
                  <p
                    key={`${issue.field}-${index}`}
                    className="text-sm text-red-200"
                  >
                    <strong>{issue.field}:</strong>{" "}
                    {issue.message}
                  </p>
                ))}
              </div>
            </div>
          )}

          {validation.warnings.length > 0 && (
            <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-950/30 p-5">
              <h3 className="font-black text-amber-300">
                Engineering Warnings
              </h3>

              <div className="mt-3 space-y-2">
                {validation.warnings.map(
                  (issue, index) => (
                    <p
                      key={`${issue.field}-${index}`}
                      className="text-sm text-amber-100"
                    >
                      <strong>{issue.field}:</strong>{" "}
                      {issue.message}
                    </p>
                  )
                )}
              </div>
            </div>
          )}

          {validation.valid &&
            validation.warnings.length === 0 && (
              <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-950/30 p-5">
                <p className="font-bold text-emerald-200">
                  EDS-001 contains a recognised garment category,
                  valid fabric and order information, and all
                  standard pattern-piece requirements for the
                  selected Men&apos;s Basic Shirt category.
                </p>
              </div>
            )}
        </section>

        <section>
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
              Dataset Expansion Roadmap
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Planned Engineering Demonstration Datasets
            </h2>

            <p className="mt-3 max-w-4xl text-slate-400">
              Each dataset will use the same scalable architecture
              and existing OptiFabric engineering engines.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {plannedEngineeringDatasets.map(
              (plannedDataset) => (
                <article
                  key={plannedDataset.code}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-violet-300">
                        {plannedDataset.code}
                      </p>

                      <h3 className="mt-2 text-xl font-black">
                        {plannedDataset.name}
                      </h3>
                    </div>

                    <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-black uppercase text-amber-300">
                      Planned
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-400">
                    Will support recognition testing, marker
                    optimization, lay planning, consumption analysis
                    and engineering reporting.
                  </p>
                </article>
              )
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-blue-400/30 bg-gradient-to-r from-cyan-950/60 via-blue-950/60 to-violet-950/60 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Continue Global Demo 001
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Start the complete AI engineering workflow
              </h2>

              <p className="mt-4 leading-relaxed text-slate-300">
                Continue from dataset selection to pattern upload,
                recognition, calibration, tracing, measurement,
                marker optimization, lay planning, fabric
                consumption, savings analysis and the professional
                PDF engineering report.
              </p>
            </div>

            <Link
              href="/optifabric/global-demo/start"
              className="shrink-0 rounded-xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Begin EDS-001 Engineering →
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            Future Garment Category Expansion
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {garmentCategoryRoadmap.map((category) => (
              <span
                key={category.id}
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-300"
              >
                {category.nameEn}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}