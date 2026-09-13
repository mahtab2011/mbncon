"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getPatternPieceById,
} from "@/lib/optifabric/masters";

import {
  getWorkflowProgress,
  loadWorkflowState,
  type OptiFabricWorkflowState,
} from "@/lib/optifabric/workflow";

import {
  analyzeScaleDetection,
} from "@/lib/optifabric/scaleDetectionEngine";

import {
  analyzeNotches,
} from "@/lib/optifabric/notchDetectionEngine";

import {
  analyzeGrainLine,
} from "@/lib/optifabric/grainLineDetectionEngine";

import {
  analyzeFabricRepeat,
} from "@/lib/optifabric/fabricRepeatDetectionEngine";

import {
  calculateFabricConsumption,
} from "@/lib/optifabric/fabricConsumptionAdvisor";

type WizardLoadingStatus =
  | "loading"
  | "workflow-loaded"
  | "legacy-mode";

function convertFabricWidthToInches(
  width: number,
  unit: "inch" | "cm"
): number {
  if (unit === "cm") {
    return Number((width / 2.54).toFixed(2));
  }

  return width;
}

function formatText(value: string): string {
  return value
    .split("-")
    .map((word) => {
      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
}
function getNotchPieceType(
  patternPieceId: string | undefined
):
  | "front-panel"
  | "back-panel"
  | "sleeve"
  | "collar"
  | "cuff"
  | "waistband"
  | "pocket"
  | "lining"
  | "other" {
  if (!patternPieceId) {
    return "other";
  }

  const normalizedId = patternPieceId.toLowerCase();

  if (normalizedId.includes("front")) {
    return "front-panel";
  }

  if (normalizedId.includes("back")) {
    return "back-panel";
  }

  if (normalizedId.includes("sleeve")) {
    return "sleeve";
  }

  if (
    normalizedId.includes("collar") ||
    normalizedId.includes("collar-stand")
  ) {
    return "collar";
  }

  if (normalizedId.includes("cuff")) {
    return "cuff";
  }

  if (normalizedId.includes("waistband")) {
    return "waistband";
  }

  if (normalizedId.includes("pocket")) {
    return "pocket";
  }

  if (normalizedId.includes("lining")) {
    return "lining";
  }

  return "other";
}
export default function EngineeringWizardPage() {
  const [workflow, setWorkflow] =
    useState<OptiFabricWorkflowState | null>(null);

  const [loadingStatus, setLoadingStatus] =
    useState<WizardLoadingStatus>("loading");

  const [selectedDatasetPatternPieceId, setSelectedDatasetPatternPieceId] =
    useState("");

  const [patternPieceName, setPatternPieceName] =
    useState("");

  const [fabricWidthInches, setFabricWidthInches] =
    useState(60);

  const [patternAreaSqInches, setPatternAreaSqInches] =
    useState(0);

  const [quantity, setQuantity] =
    useState(0);

  const [markerEfficiencyPercent, setMarkerEfficiencyPercent] =
    useState(82);

  useEffect(() => {
    const storedWorkflow = loadWorkflowState();

    if (!storedWorkflow) {
      setPatternPieceName("Front Panel");
      setFabricWidthInches(60);
      setPatternAreaSqInches(850);
      setQuantity(100);
      setMarkerEfficiencyPercent(82);
      setLoadingStatus("legacy-mode");

      return;
    }

    setWorkflow(storedWorkflow);

    const convertedWidth = convertFabricWidthToInches(
      storedWorkflow.fabricSpecification.fabricWidth,
      storedWorkflow.fabricSpecification.fabricWidthUnit
    );

    setFabricWidthInches(convertedWidth);

    const benchmarkEfficiency =
      storedWorkflow.markerResult
        ?.markerEfficiencyPercent;

    setMarkerEfficiencyPercent(
      benchmarkEfficiency ?? 82
    );

    const firstDatasetPiece =
      storedWorkflow.patternPieces[0];

    if (firstDatasetPiece) {
      const firstPatternMaster =
        getPatternPieceById(
          firstDatasetPiece.patternPieceId
        );

      setSelectedDatasetPatternPieceId(
        firstDatasetPiece.id
      );

      setPatternPieceName(
        firstPatternMaster?.name.en ??
          firstDatasetPiece.displayName?.en ??
          firstDatasetPiece.patternPieceId
      );

      setPatternAreaSqInches(
        firstDatasetPiece.area ?? 0
      );

      setQuantity(
        storedWorkflow.orderPlan.orderQuantity *
          firstDatasetPiece.quantityPerGarment
      );
    }

    setLoadingStatus("workflow-loaded");
  }, []);

  const selectedDatasetPiece = useMemo(() => {
    if (!workflow) {
      return undefined;
    }

    return workflow.patternPieces.find(
      (piece) =>
        piece.id === selectedDatasetPatternPieceId
    );
  }, [
    workflow,
    selectedDatasetPatternPieceId,
  ]);

  const selectedPatternMaster = useMemo(() => {
    if (!selectedDatasetPiece) {
      return undefined;
    }

    return getPatternPieceById(
      selectedDatasetPiece.patternPieceId
    );
  }, [selectedDatasetPiece]);

  const workflowProgress = useMemo(() => {
    if (!workflow) {
      return null;
    }

    return getWorkflowProgress(workflow);
  }, [workflow]);

  const totalPatternComponentTypes =
    workflow?.patternPieces.length ?? 0;

  const totalCutPiecesPerGarment =
    workflow?.patternPieces.reduce(
      (total, piece) =>
        total + piece.quantityPerGarment,
      0
    ) ?? 0;

  const sizeRatioText = useMemo(() => {
    if (!workflow?.orderPlan.sizeRatio) {
      return "Not entered";
    }

    return Object.entries(
      workflow.orderPlan.sizeRatio
    )
      .map(([size, ratio]) => `${size}:${ratio}`)
      .join(", ");
  }, [workflow]);

  function handlePatternPieceChange(
    datasetPatternPieceId: string
  ) {
    setSelectedDatasetPatternPieceId(
      datasetPatternPieceId
    );

    if (!workflow) {
      return;
    }

    const datasetPiece =
      workflow.patternPieces.find(
        (piece) =>
          piece.id === datasetPatternPieceId
      );

    if (!datasetPiece) {
      return;
    }

    const patternMaster =
      getPatternPieceById(
        datasetPiece.patternPieceId
      );

    setPatternPieceName(
      patternMaster?.name.en ??
        datasetPiece.displayName?.en ??
        datasetPiece.patternPieceId
    );

    setPatternAreaSqInches(
      datasetPiece.area ?? 0
    );

    setQuantity(
      workflow.orderPlan.orderQuantity *
        datasetPiece.quantityPerGarment
    );
  }

  const scaleResult = useMemo(
    () =>
      analyzeScaleDetection({
        imageHasScale: true,
        scaleType: "12-inch-ruler",
        visibleScaleLengthInches: 12,
        measuredPixelLength: 600,
        photoQuality: "clear",
      }),
    []
  );

  const notchResult = useMemo(
  () =>
    analyzeNotches({
      patternPieceName:
        patternPieceName || "Pattern Piece",

      notchVisible: true,
      notchCount: 4,
      expectedNotchCount: 4,
      notchQuality: "clear",

      pieceType: getNotchPieceType(
        selectedPatternMaster?.id
      ),
    }),
  [
    patternPieceName,
    selectedPatternMaster,
  ]
);

  const grainResult = useMemo(
    () =>
      analyzeGrainLine({
        patternPieceName:
          patternPieceName || "Pattern Piece",

        fabricType:
          workflow?.fabricSpecification
            .fabricPatternType === "solid"
            ? "solid"
            : "stripe",

        grainLineVisible: true,
        grainLineDirection: "lengthwise",

        pieceRequiresStrictGrain:
          selectedPatternMaster
            ?.grainLineRequirement ===
            "required",
      }),
    [
      patternPieceName,
      selectedPatternMaster,
      workflow,
    ]
  );

  const repeatResult = useMemo(
    () =>
      analyzeFabricRepeat({
        fabricType:
          workflow?.fabricSpecification
            .fabricStructure ?? "woven",

        hasVisibleRepeat:
          workflow?.fabricSpecification
            .fabricPatternType !== "solid",

        repeatLengthInches: 2,
        repeatWidthInches: 2,

        printOrCheckType:
          workflow?.fabricSpecification
            .fabricPatternType === "check"
            ? "check"
            : "stripe",

        buyerRequiresRepeatMatching:
          workflow?.fabricSpecification
            .fabricPatternType !== "solid",
      }),
    [workflow]
  );

  const consumptionResult = useMemo(
    () =>
      calculateFabricConsumption({
        patternAreaSqInches,
        fabricWidthInches,
        markerEfficiencyPercent,
        quantity,

        matchingAllowancePercent:
          workflow?.fabricSpecification
            .fabricPatternType === "solid"
            ? 0
            : 5,

        defectAllowancePercent:
          workflow?.orderPlan.allowancePercent ??
          2,
      }),
    [
      patternAreaSqInches,
      fabricWidthInches,
      markerEfficiencyPercent,
      quantity,
      workflow,
    ]
  );

  if (loadingStatus === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <section className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl font-black text-cyan-300">
            AI
          </div>

          <h1 className="mt-6 text-2xl font-black">
            Loading engineering workflow
          </h1>

          <p className="mt-3 text-slate-400">
            OptiFabric AI is reading the active
            engineering dataset.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={
              workflow
                ? "/optifabric/global-demo"
                : "/optifabric/pilot-dashboard"
            }
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            {workflow
              ? "← Back to Global Demo"
              : "← Back to Pilot Dashboard"}
          </Link>

          <span
            className={`w-fit rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${
              workflow
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            {workflow
              ? "Active dataset connected"
              : "Legacy demonstration mode"}
          </span>
        </div>

        {/* Stage 2D-3 — this wizard's fabric-consumption figures are a
            training simulation, not the real project calculation. See
            app/optifabric/project/[projectId]/marker/page.tsx's Fabric
            Planning section (Stage 2D-2) for the real, Marker-Based Fabric
            Consumption feature, driven by a project's saved MarkerRun and
            FabricProfile. */}
        <div className="mt-6 rounded-2xl border border-amber-400 bg-amber-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">
            Training Simulation
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-900">
            This wizard is a training/simulation tool. Its fabric-consumption
            figures are illustrative only — they are not the production
            project calculation. Real project fabric consumption is
            calculated from a project&apos;s saved Marker Runs and Fabric
            Profile using Marker-Based Fabric Consumption in the
            Project → Marker workflow.
          </p>

          <Link
            href="/optifabric/projects"
            className="mt-3 inline-flex items-center font-bold text-amber-800 underline hover:text-amber-950"
          >
            Go to your projects →
          </Link>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
                Global Demo 001 Engineering Workflow
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                OptiFabric AI Engineering Wizard
              </h1>

              <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
                One connected workflow combining
                dataset selection, pattern engineering,
                scale detection, notch inspection,
                grain-line analysis, fabric-repeat
                control and fabric-consumption advice.
              </p>
            </div>

            {workflow && workflowProgress && (
              <div className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-5 xl:max-w-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-300">
                    Workflow Progress
                  </p>

                  <p className="text-lg font-black text-cyan-300">
                    {workflowProgress.completionPercent}%
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{
                      width: `${workflowProgress.completionPercent}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  {workflowProgress.completedSteps} of{" "}
                  {workflowProgress.totalSteps} engineering
                  steps completed
                </p>
              </div>
            )}
          </div>
        </div>

        {workflow && (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <SummaryCard
              label="Dataset"
              value={workflow.datasetCode}
              detail={`Version ${workflow.datasetVersion}`}
            />

            <SummaryCard
              label="Garment"
              value={workflow.garmentCategoryName}
              detail={workflow.datasetName}
            />

            <SummaryCard
              label="Fabric Width"
              value={`${workflow.fabricSpecification.fabricWidth}`}
              detail={
                workflow.fabricSpecification
                  .fabricWidthUnit
              }
            />

            <SummaryCard
              label="Reference Lay"
              value={`${
                workflow.fabricSpecification
                  .referenceLayLength ?? "—"
              }`}
              detail={
                workflow.fabricSpecification
                  .layLengthUnit ?? "Not entered"
              }
            />

            <SummaryCard
              label="Order Quantity"
              value={workflow.orderPlan.orderQuantity.toLocaleString(
                "en-GB"
              )}
              detail="garments"
            />

            <SummaryCard
              label="Pattern Set"
              value={`${totalPatternComponentTypes}`}
              detail={`${totalCutPiecesPerGarment} cut pieces per garment`}
            />
          </section>
        )}

        {workflow && (
          <section className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-800">
              Why does AI ask for the active dataset?
            </p>

            <p className="mt-3 leading-relaxed text-slate-700">
              The active dataset allows every
              OptiFabric module to use the same garment,
              fabric, order, size-ratio and pattern-piece
              information. This prevents users from
              entering conflicting values at different
              stages of the engineering workflow.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-4">
                <p className="text-xs font-bold text-slate-500">
                  Current Step
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {formatText(workflow.currentStepId)}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <p className="text-xs font-bold text-slate-500">
                  Size Ratio
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {sizeRatioText}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4">
                <p className="text-xs font-bold text-slate-500">
                  Fabric Type
                </p>
                <p className="mt-1 font-black capitalize text-slate-900">
                  {
                    workflow.fabricSpecification
                      .fabricStructure
                  }{" "}
                  /{" "}
                  {
                    workflow.fabricSpecification
                      .fabricPatternType
                  }
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">
                  Engineering Input
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Pattern-Piece Input
                </h2>
              </div>

              {workflow && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                  {workflow.datasetCode}
                </span>
              )}
            </div>

            {workflow ? (
              <>
                <label className="mt-5 block text-sm font-semibold text-slate-600">
                  Dataset Pattern Piece
                </label>

                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3"
                  value={selectedDatasetPatternPieceId}
                  onChange={(event) =>
                    handlePatternPieceChange(
                      event.target.value
                    )
                  }
                >
                  {workflow.patternPieces.map(
                    (datasetPiece) => {
                      const pieceMaster =
                        getPatternPieceById(
                          datasetPiece.patternPieceId
                        );

                      return (
                        <option
                          key={datasetPiece.id}
                          value={datasetPiece.id}
                        >
                          {pieceMaster?.name.en ??
                            datasetPiece
                              .displayName?.en ??
                            datasetPiece
                              .patternPieceId}
                        </option>
                      );
                    }
                  )}
                </select>
              </>
            ) : (
              <>
                <label className="mt-5 block text-sm font-semibold text-slate-600">
                  Pattern Piece Name
                </label>

                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 p-3"
                  value={patternPieceName}
                  onChange={(event) =>
                    setPatternPieceName(
                      event.target.value
                    )
                  }
                />
              </>
            )}

            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Pattern Area — Square Inches
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              className="mt-1 w-full rounded-lg border border-slate-300 p-3"
              value={patternAreaSqInches}
              onChange={(event) =>
                setPatternAreaSqInches(
                  Number(event.target.value)
                )
              }
            />

            {workflow &&
              patternAreaSqInches === 0 && (
                <p className="mt-2 text-xs leading-relaxed text-amber-700">
                  No traced area is stored yet. Enter a
                  temporary engineering area or complete
                  pattern tracing and measurement.
                </p>
              )}

            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Fabric Width — Inches
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              className="mt-1 w-full rounded-lg border border-slate-300 p-3"
              value={fabricWidthInches}
              onChange={(event) =>
                setFabricWidthInches(
                  Number(event.target.value)
                )
              }
            />

            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Required Cut Quantity
            </label>

            <input
              type="number"
              min="0"
              className="mt-1 w-full rounded-lg border border-slate-300 p-3"
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  Number(event.target.value)
                )
              }
            />

            {workflow && selectedDatasetPiece && (
              <p className="mt-2 text-xs text-slate-500">
                Order quantity{" "}
                {workflow.orderPlan.orderQuantity.toLocaleString(
                  "en-GB"
                )}{" "}
                ×{" "}
                {
                  selectedDatasetPiece.quantityPerGarment
                }{" "}
                piece(s) per garment
              </p>
            )}

            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Marker Efficiency %
            </label>

            <input
              type="number"
              min="1"
              max="100"
              step="0.1"
              className="mt-1 w-full rounded-lg border border-slate-300 p-3"
              value={markerEfficiencyPercent}
              onChange={(event) =>
                setMarkerEfficiencyPercent(
                  Number(event.target.value)
                )
              }
            />

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                Selected Piece Rule
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {selectedPatternMaster?.name.en ??
                  patternPieceName}
              </p>

              {selectedPatternMaster && (
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>
                    Grain line:{" "}
                    {formatText(
                      selectedPatternMaster
                        .grainLineRequirement
                    )}
                  </p>

                  <p>
                    Cut instruction:{" "}
                    {formatText(
                      selectedPatternMaster
                        .cutInstruction
                    )}
                  </p>

                  <p>
                    Pair matching:{" "}
                    {selectedPatternMaster
                      .requiresPairMatching
                      ? "Required"
                      : "Not required"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow lg:col-span-2">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">
              Existing GPA Cutting Engines
            </p>

            <h2 className="mt-2 text-xl font-bold">
              AI Engineering Results
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ResultCard
                title="Scale Detection"
                status={scaleResult.status}
                message={scaleResult.message}
              />

              <ResultCard
                title="Notch Inspection"
                status={notchResult.status}
                message={notchResult.message}
              />

              <ResultCard
                title="Grain Line"
                status={grainResult.status}
                message={grainResult.message}
              />

              <ResultCard
                title="Fabric Repeat"
                status={repeatResult.status}
                message={repeatResult.message}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-blue-50 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-blue-700">
                    Consumption Engine
                  </p>

                  <h3 className="mt-2 text-lg font-bold">
                    Fabric Consumption Advisor
                  </h3>
                </div>

                {workflow && (
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-blue-800">
                    Active job: {workflow.datasetCode}
                  </span>
                )}
              </div>

              <p className="mt-4 text-3xl font-bold text-blue-900">
                {
                  consumptionResult.estimatedFabricYards
                }{" "}
                yards
              </p>

              <p className="mt-2 text-slate-700">
                Estimated waste:{" "}
                {
                  consumptionResult.estimatedWastePercent
                }
                %
              </p>

              {patternAreaSqInches <= 0 && (
                <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                  Enter or generate a valid pattern
                  area before treating this consumption
                  result as an engineering value.
                </div>
              )}

              <p className="mt-5 font-semibold text-slate-800">
                Why does AI ask for this?
              </p>

              <p className="mt-1 leading-relaxed text-slate-700">
                {consumptionResult.aiReason}
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                {consumptionResult.recommendations.map(
                  (item, index) => (
                    <li key={`${item}-${index}`}>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>

            {workflow && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-800">
                  Shared Workflow Connection
                </p>

                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  EDS-001 is connected successfully
                </h3>

                <p className="mt-3 leading-relaxed text-slate-700">
                  The wizard is now reading garment,
                  fabric, order, size-ratio and
                  pattern-piece information from the
                  active workflow state instead of
                  depending only on isolated
                  demonstration constants.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        {detail}
      </p>
    </article>
  );
}

function ResultCard({
  title,
  status,
  message,
}: {
  title: string;
  status: string;
  message: string;
}) {
  const normalizedStatus =
    status.toLowerCase();

  const statusClass =
    normalizedStatus === "ok" ||
    normalizedStatus === "pass" ||
    normalizedStatus === "passed" ||
    normalizedStatus === "completed"
      ? "bg-green-100 text-green-700"
      : normalizedStatus === "warning"
        ? "bg-amber-100 text-amber-800"
        : normalizedStatus === "error" ||
            normalizedStatus === "failed"
          ? "bg-red-100 text-red-700"
          : "bg-blue-100 text-blue-700";

  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold">
          {title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {message}
      </p>
    </div>
  );
}