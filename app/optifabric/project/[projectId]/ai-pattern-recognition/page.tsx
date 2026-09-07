"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  calculatePatternRecognitionSummary,
  getPatternsRequiringReview,
  getRecognisedPatternsForMarker,
  recogniseProjectPatterns,
} from "@/lib/optifabric/patternRecognitionEngine";

import {
  PatternRecognitionInput,
  PatternRecognitionProjectResult,
  RecognisedPatternPiece,
} from "@/lib/optifabric/patternRecognitionTypes";

import {
  EngineeringProject,
  PatternStatus,
} from "@/lib/optifabric/projectMaster";

import {
  updateProjectRegistryEntry,
} from "@/lib/optifabric/projectRegistry";

interface RecognitionPatternStatus extends PatternStatus {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;

  scaleVisible?: boolean;
  grainLineVisible?: boolean;
  notchesVisible?: boolean;
  validationPassed?: boolean;

  materialCategory?: string;

  includedInStyle?: boolean;
  includeInMarker?: boolean;
  styleMaterialCategory?: string;
  styleCutQuantity?: number;
  styleCutOnFold?: boolean;
  styleRequired?: boolean;
  styleSelectionNotes?: string;

  detectedWidthPixels?: number;
  detectedHeightPixels?: number;

  calibratedWidthCm?: number;
  calibratedHeightCm?: number;
  calibratedAreaSqCm?: number;
  calibratedPerimeterCm?: number;

  imageUrl?: string;
}

interface SavedRecognitionData {
  completed: boolean;
  completedAt?: string;
  averageConfidence: number;
  totalPatterns: number;
  recognisedPatterns: number;
  reviewRequired: number;
  rejectedPatterns: number;
  markerEligiblePatterns: number;
  patterns: RecognisedPatternPiece[];
}

interface RecognitionProject
  extends Omit<EngineeringProject, "patterns"> {
  patterns: RecognitionPatternStatus[];

  patternValidationCompleted?: boolean;
  patternValidationCompletedAt?: string;

  stylePatternSelectionCompleted?: boolean;
  stylePatternSelectionCompletedAt?: string;
  stylePatternSelectionLocked?: boolean;
  stylePatternSelectionLockedAt?: string;

  aiRecognition?: SavedRecognitionData;

  updatedAt?: string;
}

type RecognitionFilter =
  | "all"
  | "recognised"
  | "review"
  | "marker"
  | "excluded";

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

function normaliseMaterialForRecognition(
  material?: string
):
  | "main-fabric"
  | "lining"
  | "fusing"
  | "interlining"
  | "contrast"
  | "pocketing"
  | "unknown" {
  const value = material
    ?.trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (!value) {
    return "unknown";
  }

  if (value === "main fabric") {
    return "main-fabric";
  }

  if (value === "contrast fabric") {
    return "contrast";
  }

  if (value === "lining") {
    return "lining";
  }

  if (value === "interlining") {
    return "interlining";
  }

  if (
    value === "fusible" ||
    value === "reinforcement"
  ) {
    return "fusing";
  }

  if (value === "accessory") {
    return "unknown";
  }

  if (
    value === "decorative" ||
    value === "guide only" ||
    value === "other"
  ) {
    return "unknown";
  }

  return "unknown";
}

function getStatusClasses(status: string): string {
  if (status === "recognised") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "requires-review") {
    return "border-amber-400/30 bg-amber-500/10 text-amber-300";
  }

  if (status === "rejected") {
    return "border-red-400/30 bg-red-500/10 text-red-300";
  }

  return "border-slate-600 bg-slate-800 text-slate-300";
}

function buildRecognitionInputs(
  project: RecognitionProject
): PatternRecognitionInput[] {
  return project.patterns
    .filter(
      (pattern) =>
        pattern.includedInStyle === true
    )
    .map((pattern) => {
      const selectedMaterial =
        pattern.styleMaterialCategory ??
        pattern.materialCategory;

      const materialHint =
        normaliseMaterialForRecognition(
          selectedMaterial
        );

      const originalDescription =
        pattern.description ?? "";

      const engineeringNotes =
        pattern.styleSelectionNotes ?? "";

      const descriptionParts = [
        originalDescription,
        engineeringNotes,
        selectedMaterial
          ? `Material category: ${selectedMaterial}.`
          : "",
        materialHint !== "unknown"
          ? `Recognition material hint: ${materialHint}.`
          : "",
      ].filter(Boolean);

      return {
        patternId: pattern.id,
        projectId: project.id,
        name: pattern.name,

        required:
          pattern.styleRequired ??
          pattern.required ??
          false,

        cutQuantity:
          pattern.styleCutQuantity ??
          pattern.cutQuantity ??
          1,

        cutOnFold:
          pattern.styleCutOnFold ??
          pattern.cutOnFold ??
          false,

        custom: pattern.custom ?? false,
        sequence: pattern.sequence,

        description:
          descriptionParts.join(" "),

        imageUrl: pattern.imageUrl,
        fileName: pattern.fileName,
        uploaded: pattern.uploaded,

        detectedWidthPixels:
          pattern.detectedWidthPixels,

        detectedHeightPixels:
          pattern.detectedHeightPixels,

        calibratedWidthCm:
          pattern.calibratedWidthCm,

        calibratedHeightCm:
          pattern.calibratedHeightCm,

        calibratedAreaSqCm:
          pattern.calibratedAreaSqCm,

        calibratedPerimeterCm:
          pattern.calibratedPerimeterCm,
      };
    });
}

export default function AiPatternRecognitionPage() {
  const params = useParams<{
    projectId: string;
  }>();

  const projectId = params.projectId;

  const [project, setProject] =
    useState<RecognitionProject | null>(null);

  const [recognitionResult, setRecognitionResult] =
    useState<PatternRecognitionProjectResult | null>(
      null
    );

  const [loading, setLoading] = useState(true);
  const [analysing, setAnalysing] =
    useState(false);

  const [loadError, setLoadError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [filter, setFilter] =
    useState<RecognitionFilter>("all");

  const projectStorageKey =
    `optifabric-project-${projectId}`;

  useEffect(() => {
    if (!projectId) {
      return;
    }

    try {
      const storedProject =
        localStorage.getItem(projectStorageKey);

      if (!storedProject) {
        setLoadError(
          "The engineering project could not be found in this browser."
        );

        setLoading(false);
        return;
      }

      const parsedProject = JSON.parse(
        storedProject
      ) as RecognitionProject;

      setProject(parsedProject);

      if (
        parsedProject.aiRecognition?.patterns
          ?.length
      ) {
        const saved =
          parsedProject.aiRecognition;

        setRecognitionResult({
          projectId: parsedProject.id,
          totalPatterns:
            saved.totalPatterns,
          recognisedPatterns:
            saved.recognisedPatterns,
          reviewRequired:
            saved.reviewRequired,
          rejectedPatterns:
            saved.rejectedPatterns,
          markerEligiblePatterns:
            saved.markerEligiblePatterns,
          averageConfidence:
            saved.averageConfidence,
          patterns: saved.patterns,
          completedAt:
            saved.completedAt ??
            new Date().toISOString(),
        });
      }

      setLoadError("");
    } catch (error) {
      console.error(
        "Unable to load AI recognition project:",
        error
      );

      setLoadError(
        "The saved engineering project data is invalid."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId, projectStorageKey]);

  const recognitionInputs = useMemo(() => {
    if (!project) {
      return [];
    }

    return buildRecognitionInputs(project);
  }, [project]);

  const summary = useMemo(() => {
    return calculatePatternRecognitionSummary(
      recognitionResult?.patterns ?? []
    );
  }, [recognitionResult]);

  const markerPatterns = useMemo(() => {
    return getRecognisedPatternsForMarker(
      recognitionResult?.patterns ?? []
    );
  }, [recognitionResult]);

  const reviewPatterns = useMemo(() => {
    return getPatternsRequiringReview(
      recognitionResult?.patterns ?? []
    );
  }, [recognitionResult]);

  const excludedProjectPatterns =
    useMemo(() => {
      if (!project) {
        return [];
      }

      return project.patterns.filter(
        (pattern) =>
          pattern.includedInStyle !== true
      );
    }, [project]);

  const filteredPatterns = useMemo(() => {
    if (!recognitionResult) {
      return [];
    }

    const cleanSearch =
      searchText.trim().toLowerCase();

    return recognitionResult.patterns.filter(
      (pattern) => {
        const matchesSearch =
          cleanSearch.length === 0 ||
          pattern.originalName
            .toLowerCase()
            .includes(cleanSearch) ||
          pattern.recognisedName
            .toLowerCase()
            .includes(cleanSearch) ||
          pattern.materialCategory
            .toLowerCase()
            .includes(cleanSearch);

        const matchesFilter =
          filter === "all" ||
          (filter === "recognised" &&
            pattern.status === "recognised") ||
          (filter === "review" &&
            pattern.status ===
              "requires-review") ||
          (filter === "marker" &&
            pattern.markerEligible);

        return matchesSearch && matchesFilter;
      }
    );
  }, [
    filter,
    recognitionResult,
    searchText,
  ]);

  const completedRecognition =
    Boolean(
      project?.aiRecognition?.completed &&
        recognitionResult
    );

  function saveRecognitionResult(
    result: PatternRecognitionProjectResult,
    successMessage: string
  ) {
    if (!project) {
      return;
    }

    const completedAt =
      new Date().toISOString();

    const savedRecognition: SavedRecognitionData =
      {
        completed: true,
        completedAt,
        averageConfidence:
          result.averageConfidence,
        totalPatterns:
          result.totalPatterns,
        recognisedPatterns:
          result.recognisedPatterns,
        reviewRequired:
          result.reviewRequired,
        rejectedPatterns:
          result.rejectedPatterns,
        markerEligiblePatterns:
          result.markerEligiblePatterns,
        patterns: result.patterns,
      };

    const updatedProject: RecognitionProject = {
      ...project,
      aiRecognition: savedRecognition,
      updatedAt: completedAt,
    };

    setProject(updatedProject);
    setRecognitionResult({
      ...result,
      completedAt,
    });

    localStorage.setItem(
      projectStorageKey,
      JSON.stringify(updatedProject)
    );

    try {
      updateProjectRegistryEntry(
        updatedProject
      );
    } catch (error) {
      console.error(
        "Unable to synchronise recognition status with the project registry:",
        error
      );
    }

    setMessage(successMessage);
  }

  function runRecognition() {
    if (!project) {
      return;
    }

    if (
      !project.stylePatternSelectionLocked
    ) {
      setMessage(
        "Lock the Style Pattern Selection before running AI recognition."
      );

      return;
    }

    if (recognitionInputs.length === 0) {
      setMessage(
        "No approved style patterns are available for recognition."
      );

      return;
    }

    setAnalysing(true);
    setMessage("");

    window.setTimeout(() => {
      try {
        const result =
          recogniseProjectPatterns(
            project.id,
            recognitionInputs
          );

        saveRecognitionResult(
          result,
          `AI recognition completed for ${result.totalPatterns} approved pattern pieces.`
        );
      } catch (error) {
        console.error(
          "AI pattern recognition failed:",
          error
        );

        setMessage(
          "AI pattern recognition could not be completed. Review the project data and try again."
        );
      } finally {
        setAnalysing(false);
      }
    }, 500);
  }

  function rerunRecognition() {
    if (!project) {
      return;
    }

    const confirmed = window.confirm(
      "Run AI recognition again? The saved recognition results will be replaced."
    );

    if (!confirmed) {
      return;
    }

    runRecognition();
  }

  function clearFilters() {
    setSearchText("");
    setFilter("all");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 px-10 py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-5 text-lg font-black">
            Loading AI Pattern Recognition...
          </p>
        </section>
      </main>
    );
  }

  if (loadError || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-2xl rounded-3xl border border-red-400/30 bg-red-950/20 p-8 text-center">
          <h1 className="text-3xl font-black">
            Engineering project unavailable
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            {loadError}
          </p>

          <Link
            href="/optifabric/projects"
            className="mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
          >
            Open Project Registry
          </Link>
        </section>
      </main>
    );
  }

  const styleLocked =
    project.stylePatternSelectionLocked === true;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-cyan-950 to-blue-950 p-7 shadow-2xl shadow-cyan-950/30 sm:p-10">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                OptiFabric AI · Module 03
              </p>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                AI Pattern Recognition
              </h1>

              <p className="mt-4 text-2xl font-black">
                {project.projectName}
              </p>

              <p className="mt-3 max-w-4xl leading-7 text-slate-300">
                Analyse the approved style pieces and convert
                each uploaded pattern into structured cutting,
                material, grain, pairing, rotation and
                marker-eligibility information.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
              <Link
                href={`/optifabric/project/${project.id}/style-pattern-selection`}
                className="inline-flex items-center justify-center rounded-xl border border-violet-400/40 bg-violet-950/30 px-5 py-3 font-black text-violet-200 transition hover:bg-violet-900/40"
              >
                ← Style Pattern Selection
              </Link>

              <Link
                href={`/optifabric/project/${project.id}`}
                className="inline-flex items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-950/30 px-5 py-3 font-black text-cyan-200 transition hover:bg-cyan-900/40"
              >
                Command Centre
              </Link>
            </div>
          </div>
        </header>

        {!styleLocked ? (
          <section className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-950/20 px-5 py-5">
            <h2 className="font-black text-amber-300">
              Style pattern selection is not locked
            </h2>

            <p className="mt-2 leading-7 text-amber-100/80">
              AI recognition must use an approved and locked
              pattern set. Return to Module 02, complete the
              engineering review and lock the style before
              running recognition.
            </p>

            <Link
              href={`/optifabric/project/${project.id}/style-pattern-selection`}
              className="mt-4 inline-flex rounded-xl border border-amber-400/30 bg-slate-950 px-4 py-2 font-black text-amber-300 transition hover:bg-amber-950"
            >
              Return to Style Pattern Selection
            </Link>
          </section>
        ) : (
          <section className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-950/20 px-5 py-5">
            <h2 className="font-black text-emerald-300">
              Approved style set received
            </h2>

            <p className="mt-2 leading-7 text-emerald-100/80">
              {recognitionInputs.length} included pattern
              pieces are available for AI recognition.
              Excluded style components will not enter the
              recognition or marker pipeline.
            </p>
          </section>
        )}

        {message ? (
          <section className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 font-bold text-cyan-100">
            {message}
          </section>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Approved Inputs"
            value={String(
              recognitionInputs.length
            )}
            detail={`${excludedProjectPatterns.length} project pattern(s) excluded`}
          />

          <MetricCard
            label="Recognised"
            value={String(
              recognitionResult
                ?.recognisedPatterns ?? 0
            )}
            detail="Automatically classified"
          />

          <MetricCard
            label="Requires Review"
            value={String(
              recognitionResult
                ?.reviewRequired ?? 0
            )}
            detail="Human confirmation required"
          />

          <MetricCard
            label="Average Confidence"
            value={
              recognitionResult
                ? formatPercentage(
                    recognitionResult.averageConfidence
                  )
                : "—"
            }
            detail="Combined recognition confidence"
          />
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-cyan-950/50 p-6 sm:p-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Recognition control
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Analyse the Approved Pattern Set
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-300">
                The current recognition engine evaluates pattern
                names, uploaded metadata, engineering notes,
                material assignments, cut quantities and fold
                instructions. Shape-based computer vision will be
                connected in the later geometry and vision stages.
              </p>
            </div>

            <div className="min-w-72">
              {!completedRecognition ? (
                <button
                  type="button"
                  onClick={runRecognition}
                  disabled={
                    !styleLocked ||
                    recognitionInputs.length === 0 ||
                    analysing
                  }
                  className="w-full rounded-2xl bg-cyan-400 px-7 py-4 text-lg font-black text-slate-950 transition enabled:hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  {analysing
                    ? "Analysing Patterns..."
                    : "Run AI Pattern Recognition"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={rerunRecognition}
                  disabled={analysing}
                  className="w-full rounded-2xl border border-amber-400/30 bg-amber-950/20 px-7 py-4 text-lg font-black text-amber-300 transition enabled:hover:bg-amber-900/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {analysing
                    ? "Regenerating Results..."
                    : "Re-run AI Recognition"}
                </button>
              )}

              <p className="mt-3 text-center text-sm text-slate-500">
                Results are saved inside this engineering
                project.
              </p>
            </div>
          </div>
        </section>

        {recognitionResult ? (
          <>
            <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                  Engineering summary
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  Recognition Statistics
                </h2>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                  label="Main Fabric"
                  value={summary.mainFabricPatterns}
                />

                <SummaryCard
                  label="Lining"
                  value={summary.liningPatterns}
                />

                <SummaryCard
                  label="Fusing / Interlining"
                  value={summary.fusingPatterns}
                />

                <SummaryCard
                  label="Cut on Fold"
                  value={summary.foldPatterns}
                />

                <SummaryCard
                  label="Paired Pieces"
                  value={summary.pairedPatterns}
                />

                <SummaryCard
                  label="Marker Eligible"
                  value={
                    summary.markerEligiblePatterns
                  }
                />

                <SummaryCard
                  label="Review Required"
                  value={summary.reviewRequired}
                />

                <SummaryCard
                  label="Marker Output"
                  value={markerPatterns.length}
                />
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-950/10 p-5 sm:p-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                    Recognition workspace
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Search and Filter Results
                  </h2>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Visible results
                  </p>

                  <p className="mt-1 text-2xl font-black text-cyan-300">
                    {filter === "excluded"
                      ? excludedProjectPatterns.length
                      : filteredPatterns.length}{" "}
                    of{" "}
                    {filter === "excluded"
                      ? excludedProjectPatterns.length
                      : recognitionResult.patterns.length}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <label>
                  <span className="text-sm font-black text-slate-300">
                    Search recognised patterns
                  </span>

                  <input
                    type="search"
                    value={searchText}
                    disabled={filter === "excluded"}
                    onChange={(event) =>
                      setSearchText(
                        event.target.value
                      )
                    }
                    placeholder="Example: collar, sleeve, pocket"
                    className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 enabled:focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </label>

                <label>
                  <span className="text-sm font-black text-slate-300">
                    Recognition status
                  </span>

                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(
                        event.target
                          .value as RecognitionFilter
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  >
                    <option value="all">
                      All recognised inputs
                    </option>

                    <option value="recognised">
                      Automatically recognised
                    </option>

                    <option value="review">
                      Requires manual review
                    </option>

                    <option value="marker">
                      Marker eligible
                    </option>

                    <option value="excluded">
                      Excluded project patterns
                    </option>
                  </select>
                </label>
              </div>

              {searchText.trim().length > 0 ||
              filter !== "all" ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl border border-cyan-400/30 bg-slate-950 px-4 py-2 font-black text-cyan-300 transition hover:bg-cyan-950"
                >
                  Clear Filters
                </button>
              ) : null}
            </section>

            {filter === "excluded" ? (
              <ExcludedPatternsSection
                patterns={
                  excludedProjectPatterns
                }
              />
            ) : (
              <section className="mt-8">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                    Pattern-by-pattern analysis
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    AI Engineering Results
                  </h2>
                </div>

                {filteredPatterns.length > 0 ? (
                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    {filteredPatterns.map(
                      (pattern) => (
                        <RecognitionPatternCard
                          key={pattern.patternId}
                          pattern={pattern}
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="mt-6 rounded-3xl border border-dashed border-cyan-400/30 bg-cyan-950/10 px-6 py-12 text-center">
                    <p className="text-5xl">🔎</p>

                    <h3 className="mt-4 text-2xl font-black">
                      No recognition results match
                      these filters
                    </h3>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950"
                    >
                      Show All Results
                    </button>
                  </div>
                )}
              </section>
            )}

            {reviewPatterns.length > 0 ? (
              <section className="mt-8 rounded-3xl border border-amber-400/30 bg-amber-950/10 p-6 sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">
                  Manual review queue
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {reviewPatterns.length} Pattern
                  {reviewPatterns.length === 1
                    ? ""
                    : "s"}{" "}
                  Require Confirmation
                </h2>

                <p className="mt-3 max-w-4xl leading-7 text-amber-100/80">
                  These pieces can remain in the project,
                  but uncertain grain, material or geometry
                  information must be confirmed before the
                  production marker is approved.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {reviewPatterns.map(
                    (pattern) => (
                      <article
                        key={pattern.patternId}
                        className="rounded-2xl border border-amber-400/20 bg-slate-950/60 p-5"
                      >
                        <p className="text-lg font-black">
                          {pattern.recognisedName}
                        </p>

                        <p className="mt-2 text-sm text-amber-200">
                          Confidence:{" "}
                          {formatPercentage(
                            pattern.confidence
                              .overall
                          )}
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {pattern.warnings[0]
                            ?.message ??
                            "Engineering confirmation is required."}
                        </p>
                      </article>
                    )
                  )}
                </div>
              </section>
            ) : (
              <section className="mt-8 rounded-3xl border border-emerald-400/30 bg-emerald-950/10 p-6 sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
                  Recognition approval
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  No Manual Review Required
                </h2>

                <p className="mt-3 leading-7 text-emerald-100/80">
                  All recognised pattern pieces have passed
                  the current automatic recognition rules.
                </p>
              </section>
            )}

            <section className="mt-10 rounded-3xl border border-violet-400/20 bg-gradient-to-br from-slate-900 to-violet-950 p-6 sm:p-8">
              <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
                    Module completion
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Continue to Pattern Geometry
                  </h2>

                  <p className="mt-3 max-w-4xl leading-7 text-slate-300">
                    The Geometry Engine will use these
                    recognised pieces, marker restrictions,
                    cut quantities, fold rules and engineering
                    warnings to prepare measurable polygons
                    for nesting.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <ReadinessItem
                      label="Recognition saved"
                      passed={
                        completedRecognition
                      }
                      detail={
                        completedRecognition
                          ? "Recognition results are stored in the project."
                          : "Run and save recognition first."
                      }
                    />

                    <ReadinessItem
                      label="Marker set available"
                      passed={
                        markerPatterns.length > 0
                      }
                      detail={`${markerPatterns.length} pattern type(s) are eligible for marker preparation.`}
                    />

                    <ReadinessItem
                      label="Review visibility"
                      passed={
                        recognitionResult
                          .reviewRequired ===
                        reviewPatterns.length
                      }
                      detail={`${reviewPatterns.length} item(s) are shown in the review queue.`}
                    />
                  </div>
                </div>

                <div className="flex min-w-72 flex-col gap-3">
                  <Link
                    href={`/optifabric/project/${project.id}/geometry-test`}
                    className="rounded-2xl bg-violet-400 px-7 py-4 text-center text-lg font-black text-slate-950 transition hover:bg-violet-300"
                  >
                    Continue to Geometry →
                  </Link>

                  <Link
                    href={`/optifabric/project/${project.id}/style-pattern-selection`}
                    className="rounded-2xl border border-slate-600 bg-slate-950 px-7 py-4 text-center font-black text-slate-300 transition hover:bg-slate-800"
                  >
                    Review Style Selection
                  </Link>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="mt-8 rounded-3xl border border-dashed border-cyan-400/30 bg-cyan-950/10 px-6 py-14 text-center">
            <p className="text-6xl">🧠</p>

            <h2 className="mt-5 text-3xl font-black">
              Recognition Has Not Been Run
            </h2>

            <p className="mx-auto mt-3 max-w-3xl leading-7 text-slate-400">
              Run AI Pattern Recognition to analyse the
              approved style set and create the engineering
              data required by geometry and marker planning.
            </p>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-xl font-black text-cyan-300">
            Why does AI recognise each pattern before geometry?
          </h2>

          <p className="mt-3 max-w-5xl leading-7 text-slate-300">
            Polygon geometry alone does not explain how a
            pattern may be positioned. OptiFabric must also
            understand whether the piece is paired, cut on
            fold, grain-controlled, freely rotatable,
            material-specific or excluded from the production
            marker. These rules prevent technically possible
            but industrially incorrect nesting.
          </p>
        </section>
      </div>
    </main>
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
  value: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
      <p className="text-sm font-bold text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">
        {value}
      </p>
    </article>
  );
}

function RecognitionPatternCard({
  pattern,
}: {
  pattern: RecognisedPatternPiece;
}) {
  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Original: {pattern.originalName}
          </p>

          <h3 className="mt-1 text-2xl font-black">
            {pattern.recognisedName}
          </h3>
        </div>

        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${getStatusClasses(
            pattern.status
          )}`}
        >
          {formatLabel(pattern.status)}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <EngineeringValue
          label="Material"
          value={formatLabel(
            pattern.materialCategory
          )}
        />

        <EngineeringValue
          label="Side"
          value={formatLabel(pattern.side)}
        />

        <EngineeringValue
          label="Grain"
          value={formatLabel(
            pattern.grainDirection
          )}
        />

        <EngineeringValue
          label="Symmetry"
          value={formatLabel(
            pattern.symmetry
          )}
        />

        <EngineeringValue
          label="Rotation"
          value={formatLabel(
            pattern.rotationRule
          )}
        />

        <EngineeringValue
          label="Cut Quantity"
          value={String(pattern.cutQuantity)}
        />

        <EngineeringValue
          label="Cut on Fold"
          value={
            pattern.cutOnFold ? "Yes" : "No"
          }
        />

        <EngineeringValue
          label="Pair Required"
          value={
            pattern.requiresPair ? "Yes" : "No"
          }
        />

        <EngineeringValue
          label="Marker Eligible"
          value={
            pattern.markerEligible
              ? "Yes"
              : "No"
          }
        />

        <EngineeringValue
          label="AI Confidence"
          value={formatPercentage(
            pattern.confidence.overall
          )}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4">
        <p className="text-xs font-black uppercase tracking-wider text-cyan-300">
          Why did AI decide this?
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {pattern.explanation}
        </p>
      </div>

      {pattern.restrictions.length > 0 ? (
        <div className="mt-5">
          <h4 className="font-black">
            Marker Restrictions
          </h4>

          <div className="mt-3 space-y-2">
            {pattern.restrictions.map(
              (restriction) => (
                <div
                  key={restriction.id}
                  className="rounded-xl border border-blue-400/20 bg-blue-950/20 px-4 py-3 text-sm text-blue-100"
                >
                  {restriction.message}
                </div>
              )
            )}
          </div>
        </div>
      ) : null}

      {pattern.warnings.length > 0 ? (
        <div className="mt-5">
          <h4 className="font-black">
            AI Warnings
          </h4>

          <div className="mt-3 space-y-2">
            {pattern.warnings.map(
              (warning) => (
                <div
                  key={warning.id}
                  className={
                    warning.severity ===
                    "critical"
                      ? "rounded-xl border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-200"
                      : "rounded-xl border border-amber-400/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-100"
                  }
                >
                  <span className="font-black">
                    {warning.code.replace(
                      /_/g,
                      " "
                    )}
                    :
                  </span>{" "}
                  {warning.message}
                </div>
              )
            )}
          </div>
        </div>
      ) : null}
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

function ReadinessItem({
  label,
  passed,
  detail,
}: {
  label: string;
  passed: boolean;
  detail: string;
}) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        passed
          ? "border-emerald-400/30 bg-emerald-950/20"
          : "border-amber-400/30 bg-amber-950/20"
      }`}
    >
      <p
        className={`font-black ${
          passed
            ? "text-emerald-300"
            : "text-amber-300"
        }`}
      >
        {passed ? "✓" : "!"} {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {detail}
      </p>
    </article>
  );
}

function ExcludedPatternsSection({
  patterns,
}: {
  patterns: RecognitionPatternStatus[];
}) {
  return (
    <section className="mt-8">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-400">
        Excluded style components
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Patterns Not Sent to Recognition
      </h2>

      {patterns.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {patterns.map((pattern) => (
            <article
              key={pattern.id}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
            >
              <p className="text-lg font-black">
                {pattern.name}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                This piece is not included in the
                approved style and therefore was not
                sent to AI recognition.
              </p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-950/10 p-8 text-center">
          <p className="font-black text-emerald-300">
            No project patterns are excluded.
          </p>
        </div>
      )}
    </section>
  );
}