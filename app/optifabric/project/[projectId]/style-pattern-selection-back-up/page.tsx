"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  EngineeringProject,
  PatternStatus,
} from "@/lib/optifabric/projectMaster";
import {
  updateProjectRegistryEntry,
} from "@/lib/optifabric/projectRegistry";

type PatternMaterialCategory =
  | "Main Fabric"
  | "Contrast Fabric"
  | "Lining"
  | "Interlining"
  | "Fusible"
  | "Reinforcement"
  | "Decorative"
  | "Accessory"
  | "Guide Only"
  | "Other";

interface StylePatternStatus extends PatternStatus {
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
  styleMaterialCategory?: PatternMaterialCategory;
  styleCutQuantity?: number;
  styleCutOnFold?: boolean;
  styleRequired?: boolean;
  styleSelectionNotes?: string;
}

interface StylePatternProject
  extends Omit<EngineeringProject, "patterns"> {
  patterns: StylePatternStatus[];

  patternValidationCompleted?: boolean;
  patternValidationCompletedAt?: string;

  stylePatternSelectionCompleted?: boolean;
  stylePatternSelectionCompletedAt?: string;
  stylePatternSelectionLocked?: boolean;
  stylePatternSelectionLockedAt?: string;

  updatedAt?: string;
}

type PatternFilter =
  | "all"
  | "included"
  | "excluded"
  | "marker"
  | "non-marker"
  | "guide";

const materialCategories: PatternMaterialCategory[] = [
  "Main Fabric",
  "Contrast Fabric",
  "Lining",
  "Interlining",
  "Fusible",
  "Reinforcement",
  "Decorative",
  "Accessory",
  "Guide Only",
  "Other",
];

function normaliseMaterialCategory(
  category?: string
): PatternMaterialCategory {
  const cleanCategory = category?.trim();

  const recognisedCategory =
    materialCategories.find(
      (item) => item === cleanCategory
    );

  return recognisedCategory ?? "Main Fabric";
}

function createPreparedPatterns(
  patterns: StylePatternStatus[]
): StylePatternStatus[] {
  return patterns.map((pattern) => {
    const materialCategory =
      normaliseMaterialCategory(
        pattern.styleMaterialCategory ??
          pattern.materialCategory
      );

    const guideOnly =
      materialCategory === "Guide Only";

    return {
      ...pattern,

      includedInStyle:
        pattern.includedInStyle ??
        pattern.uploaded ??
        pattern.required ??
        false,

      includeInMarker:
        pattern.includeInMarker ??
        (!guideOnly &&
          Boolean(
            pattern.uploaded ||
              pattern.required
          )),

      styleMaterialCategory:
        materialCategory,

      styleCutQuantity:
        pattern.styleCutQuantity ??
        pattern.cutQuantity ??
        1,

      styleCutOnFold:
        pattern.styleCutOnFold ??
        pattern.cutOnFold ??
        false,

      styleRequired:
        pattern.styleRequired ??
        pattern.required ??
        false,

      styleSelectionNotes:
        pattern.styleSelectionNotes ?? "",
    };
  });
}

export default function StylePatternSelectionPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [project, setProject] =
    useState<StylePatternProject | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");

  const [patternSearch, setPatternSearch] =
    useState("");

  const [patternFilter, setPatternFilter] =
    useState<PatternFilter>("all");

  const [materialFilter, setMaterialFilter] =
    useState("all");

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
      ) as StylePatternProject;

      const preparedProject: StylePatternProject = {
        ...parsedProject,
        patterns: createPreparedPatterns(
          parsedProject.patterns ?? []
        ),
      };

      setProject(preparedProject);
      setLoadError("");
    } catch (error) {
      console.error(
        "Unable to load the engineering project:",
        error
      );

      setLoadError(
        "The saved engineering project data is invalid."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId, projectStorageKey]);

  function saveProject(
    updatedProject: StylePatternProject,
    successMessage?: string
  ) {
    const projectWithUpdateTime: StylePatternProject = {
      ...updatedProject,
      updatedAt: new Date().toISOString(),
    };

    setProject(projectWithUpdateTime);

    localStorage.setItem(
      projectStorageKey,
      JSON.stringify(projectWithUpdateTime)
    );

    try {
      updateProjectRegistryEntry(
        projectWithUpdateTime
      );
    } catch (error) {
      console.error(
        "Unable to synchronise the project registry:",
        error
      );
    }

    if (successMessage) {
      setMessage(successMessage);
    }
  }

  function updatePattern(
    patternId: string,
    changes: Partial<StylePatternStatus>
  ) {
    if (
      !project ||
      project.stylePatternSelectionLocked
    ) {
      return;
    }

    const updatedPatterns =
      project.patterns.map((pattern) => {
        if (pattern.id !== patternId) {
          return pattern;
        }

        return {
          ...pattern,
          ...changes,
        };
      });

    saveProject({
      ...project,
      patterns: updatedPatterns,
      stylePatternSelectionCompleted: false,
      stylePatternSelectionCompletedAt: undefined,
    });

    setMessage("");
  }

  function handleIncludedChange(
    patternId: string,
    checked: boolean
  ) {
    const pattern =
      project?.patterns.find(
        (item) => item.id === patternId
      );

    if (!pattern) {
      return;
    }

    const category =
      normaliseMaterialCategory(
        pattern.styleMaterialCategory ??
          pattern.materialCategory
      );

    updatePattern(patternId, {
      includedInStyle: checked,
      includeInMarker:
        checked &&
        category !== "Guide Only"
          ? pattern.includeInMarker ?? true
          : false,
    });
  }

  function handleMaterialChange(
    patternId: string,
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const category =
      event.target
        .value as PatternMaterialCategory;

    updatePattern(patternId, {
      styleMaterialCategory: category,
      materialCategory: category,
      includeInMarker:
        category === "Guide Only"
          ? false
          : undefined,
    });
  }

  function includeAllUploadedPatterns() {
    if (
      !project ||
      project.stylePatternSelectionLocked
    ) {
      return;
    }

    const updatedPatterns =
      project.patterns.map((pattern) => {
        if (!pattern.uploaded) {
          return pattern;
        }

        const category =
          normaliseMaterialCategory(
            pattern.styleMaterialCategory ??
              pattern.materialCategory
          );

        return {
          ...pattern,
          includedInStyle: true,
          includeInMarker:
            category !== "Guide Only",
        };
      });

    saveProject(
      {
        ...project,
        patterns: updatedPatterns,
        stylePatternSelectionCompleted: false,
        stylePatternSelectionCompletedAt:
          undefined,
      },
      "All uploaded patterns were included in this style."
    );
  }

  function excludeAllOptionalPatterns() {
    if (
      !project ||
      project.stylePatternSelectionLocked
    ) {
      return;
    }

    const updatedPatterns =
      project.patterns.map((pattern) => {
        const required =
          pattern.styleRequired ??
          pattern.required ??
          false;

        if (required) {
          return pattern;
        }

        return {
          ...pattern,
          includedInStyle: false,
          includeInMarker: false,
        };
      });

    saveProject(
      {
        ...project,
        patterns: updatedPatterns,
        stylePatternSelectionCompleted: false,
        stylePatternSelectionCompletedAt:
          undefined,
      },
      "Optional patterns were excluded. Required pieces remain included."
    );
  }

  function resetToPatternMaster() {
    if (
      !project ||
      project.stylePatternSelectionLocked
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Reset all style selections to the original pattern-master values?"
    );

    if (!confirmed) {
      return;
    }

    const resetPatterns =
      project.patterns.map((pattern) => {
        const category =
          normaliseMaterialCategory(
            pattern.materialCategory
          );

        const included =
          Boolean(
            pattern.uploaded ||
              pattern.required
          );

        return {
          ...pattern,
          includedInStyle: included,
          includeInMarker:
            included &&
            category !== "Guide Only",
          styleMaterialCategory: category,
          styleCutQuantity:
            pattern.cutQuantity ?? 1,
          styleCutOnFold:
            pattern.cutOnFold ?? false,
          styleRequired:
            pattern.required ?? false,
          styleSelectionNotes: "",
        };
      });

    saveProject(
      {
        ...project,
        patterns: resetPatterns,
        stylePatternSelectionCompleted: false,
        stylePatternSelectionCompletedAt:
          undefined,
      },
      "Style pattern selections were reset to the pattern-master values."
    );
  }

  const metrics = useMemo(() => {
    if (!project) {
      return {
        totalPatterns: 0,
        uploadedPatterns: 0,
        includedPatterns: 0,
        excludedPatterns: 0,
        markerPatterns: 0,
        mainFabricPatterns: 0,
        guidePatterns: 0,
        missingUploads: 0,
        invalidQuantities: 0,
      };
    }

    const includedPatterns =
      project.patterns.filter(
        (pattern) =>
          pattern.includedInStyle === true
      );

    const markerPatterns =
      includedPatterns.filter(
        (pattern) =>
          pattern.includeInMarker === true
      );

    const mainFabricPatterns =
      markerPatterns.filter(
        (pattern) =>
          pattern.styleMaterialCategory ===
          "Main Fabric"
      );

    const guidePatterns =
      includedPatterns.filter(
        (pattern) =>
          pattern.styleMaterialCategory ===
          "Guide Only"
      );

    const missingUploads =
      includedPatterns.filter(
        (pattern) => !pattern.uploaded
      );

    const invalidQuantities =
      markerPatterns.filter((pattern) => {
        const quantity =
          pattern.styleCutQuantity ?? 0;

        return (
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > 99
        );
      });

    return {
      totalPatterns:
        project.patterns.length,

      uploadedPatterns:
        project.patterns.filter(
          (pattern) => pattern.uploaded
        ).length,

      includedPatterns:
        includedPatterns.length,

      excludedPatterns:
        project.patterns.length -
        includedPatterns.length,

      markerPatterns:
        markerPatterns.length,

      mainFabricPatterns:
        mainFabricPatterns.length,

      guidePatterns:
        guidePatterns.length,

      missingUploads:
        missingUploads.length,

      invalidQuantities:
        invalidQuantities.length,
    };
  }, [project]);

  const selectionCanBeCompleted =
    useMemo(() => {
      if (!project) {
        return false;
      }

      const includedPatterns =
        project.patterns.filter(
          (pattern) =>
            pattern.includedInStyle === true
        );

      const markerPatterns =
        includedPatterns.filter(
          (pattern) =>
            pattern.includeInMarker === true
        );

      if (
        includedPatterns.length === 0 ||
        markerPatterns.length === 0
      ) {
        return false;
      }

      const allIncludedPatternsUploaded =
        includedPatterns.every(
          (pattern) => pattern.uploaded
        );

      const allMarkerQuantitiesValid =
        markerPatterns.every((pattern) => {
          const quantity =
            pattern.styleCutQuantity ?? 0;

          return (
            Number.isInteger(quantity) &&
            quantity >= 1 &&
            quantity <= 99
          );
        });

      const noGuideInMarker =
        markerPatterns.every(
          (pattern) =>
            pattern.styleMaterialCategory !==
            "Guide Only"
        );

      return (
        allIncludedPatternsUploaded &&
        allMarkerQuantitiesValid &&
        noGuideInMarker
      );
    }, [project]);

  const availableMaterials = useMemo(() => {
    if (!project) {
      return [];
    }

    return Array.from(
      new Set(
        project.patterns.map(
          (pattern) =>
            pattern.styleMaterialCategory ??
            normaliseMaterialCategory(
              pattern.materialCategory
            )
        )
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [project]);

  const filteredPatterns = useMemo(() => {
    if (!project) {
      return [];
    }

    const cleanSearch =
      patternSearch.trim().toLowerCase();

    return project.patterns.filter(
      (pattern) => {
        const matchesSearch =
          cleanSearch.length === 0 ||
          pattern.name
            .toLowerCase()
            .includes(cleanSearch) ||
          pattern.description
            ?.toLowerCase()
            .includes(cleanSearch) ||
          pattern.styleSelectionNotes
            ?.toLowerCase()
            .includes(cleanSearch);

        const included =
          pattern.includedInStyle === true;

        const inMarker =
          pattern.includeInMarker === true;

        const category =
          pattern.styleMaterialCategory ??
          normaliseMaterialCategory(
            pattern.materialCategory
          );

        const matchesPatternFilter =
          patternFilter === "all" ||
          (patternFilter === "included" &&
            included) ||
          (patternFilter === "excluded" &&
            !included) ||
          (patternFilter === "marker" &&
            included &&
            inMarker) ||
          (patternFilter === "non-marker" &&
            included &&
            !inMarker) ||
          (patternFilter === "guide" &&
            category === "Guide Only");

        const matchesMaterial =
          materialFilter === "all" ||
          category === materialFilter;

        return (
          matchesSearch &&
          matchesPatternFilter &&
          matchesMaterial
        );
      }
    );
  }, [
    materialFilter,
    patternFilter,
    patternSearch,
    project,
  ]);

  function completeStyleSelection() {
    if (
      !project ||
      !selectionCanBeCompleted ||
      project.stylePatternSelectionLocked
    ) {
      return;
    }

    const completedAt =
      new Date().toISOString();

    saveProject(
      {
        ...project,
        stylePatternSelectionCompleted: true,
        stylePatternSelectionCompletedAt:
          completedAt,
      },
      "Style pattern selection completed. Review the result and lock it when ready."
    );
  }

  function lockStyleSelection() {
    if (
      !project ||
      !selectionCanBeCompleted
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Lock this style pattern set? The selected pieces, materials and cut quantities will be used by AI recognition and marker preparation."
    );

    if (!confirmed) {
      return;
    }

    const lockedAt =
      new Date().toISOString();

    saveProject(
      {
        ...project,
        stylePatternSelectionCompleted: true,
        stylePatternSelectionCompletedAt:
          project.stylePatternSelectionCompletedAt ??
          lockedAt,
        stylePatternSelectionLocked: true,
        stylePatternSelectionLockedAt:
          lockedAt,
      },
      "Style pattern selection locked successfully. The project is ready for AI pattern recognition."
    );
  }

  function unlockStyleSelection() {
    if (!project) {
      return;
    }

    const confirmed = window.confirm(
      "Unlock the style pattern set for editing? Any later recognition or marker result may need to be regenerated."
    );

    if (!confirmed) {
      return;
    }

    saveProject(
      {
        ...project,
        stylePatternSelectionLocked: false,
        stylePatternSelectionLockedAt:
          undefined,
        stylePatternSelectionCompleted: false,
        stylePatternSelectionCompletedAt:
          undefined,
      },
      "Style pattern selection unlocked. You can now edit the engineering settings."
    );
  }

  function clearFilters() {
    setPatternSearch("");
    setPatternFilter("all");
    setMaterialFilter("all");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 px-10 py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-5 text-lg font-bold">
            Loading Style Pattern Selection...
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

  const selectionLocked =
    project.stylePatternSelectionLocked === true;

  const filtersActive =
    patternSearch.trim().length > 0 ||
    patternFilter !== "all" ||
    materialFilter !== "all";

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-950 p-7 shadow-2xl shadow-violet-950/30 sm:p-10">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-violet-300">
                OptiFabric AI · Module 02
              </p>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                Style Pattern Selection
              </h1>

              <p className="mt-4 text-2xl font-black">
                {project.projectName}
              </p>

              <p className="mt-3 max-w-4xl leading-7 text-slate-300">
                Confirm which uploaded pieces belong to this
                garment style, assign the correct material,
                verify cut quantities and decide which pieces
                must enter each marker.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
              <Link
                href={`/optifabric/project/${project.id}/patterns`}
                className="inline-flex items-center justify-center rounded-xl border border-violet-400/40 bg-violet-950/30 px-5 py-3 font-black text-violet-200 transition hover:bg-violet-900/40"
              >
                ← Pattern Upload
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

        {!project.patternValidationCompleted ? (
          <section className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-950/20 px-5 py-5">
            <h2 className="font-black text-amber-300">
              Pattern validation is incomplete
            </h2>

            <p className="mt-2 leading-7 text-amber-100/80">
              You may review the style set now, but it
              should not be locked for production geometry
              until the required uploaded patterns have
              passed validation.
            </p>

            <Link
              href={`/optifabric/project/${project.id}/patterns`}
              className="mt-4 inline-flex rounded-xl border border-amber-400/30 bg-slate-950 px-4 py-2 font-black text-amber-300 transition hover:bg-amber-950"
            >
              Return to Pattern Validation
            </Link>
          </section>
        ) : null}

        {selectionLocked ? (
          <section className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-950/20 px-5 py-5">
            <h2 className="font-black text-emerald-300">
              Style pattern set locked
            </h2>

            <p className="mt-2 leading-7 text-emerald-100/80">
              These engineering selections are now the
              approved source for AI recognition, geometry
              extraction and marker preparation.
            </p>
          </section>
        ) : null}

        {message ? (
          <section className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-950/20 px-5 py-4 font-bold text-cyan-100">
            {message}
          </section>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Uploaded Patterns"
            value={`${metrics.uploadedPatterns}/${metrics.totalPatterns}`}
            detail="Available in this project"
          />

          <MetricCard
            label="Included in Style"
            value={String(
              metrics.includedPatterns
            )}
            detail={`${metrics.excludedPatterns} excluded`}
          />

          <MetricCard
            label="Marker Pieces"
            value={String(
              metrics.markerPatterns
            )}
            detail={`${metrics.mainFabricPatterns} main-fabric pattern types`}
          />

          <MetricCard
            label="Guides Only"
            value={String(
              metrics.guidePatterns
            )}
            detail="Excluded from fabric consumption"
          />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
                Engineering controls
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Prepare the Actual Style Set
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-400">
                Uploaded patterns are not automatically
                treated as fabric-consuming pieces. Confirm
                every style component before recognition and
                geometry processing.
              </p>
            </div>

            {!selectionLocked ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={includeAllUploadedPatterns}
                  className="rounded-xl border border-cyan-400/30 bg-cyan-950/30 px-5 py-3 font-black text-cyan-300 transition hover:bg-cyan-900/40"
                >
                  Include All Uploaded
                </button>

                <button
                  type="button"
                  onClick={excludeAllOptionalPatterns}
                  className="rounded-xl border border-amber-400/30 bg-amber-950/20 px-5 py-3 font-black text-amber-300 transition hover:bg-amber-900/30"
                >
                  Exclude Optional Pieces
                </button>

                <button
                  type="button"
                  onClick={resetToPatternMaster}
                  className="rounded-xl border border-slate-600 bg-slate-950 px-5 py-3 font-black text-slate-300 transition hover:bg-slate-800"
                >
                  Reset Selection
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-violet-400/20 bg-violet-950/10 p-5 sm:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
                Pattern workspace control
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Search and Filter Style Pieces
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Visible results
              </p>

              <p className="mt-1 text-2xl font-black text-violet-300">
                {filteredPatterns.length} of{" "}
                {project.patterns.length}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <label>
              <span className="text-sm font-black text-slate-300">
                Search patterns
              </span>

              <input
                type="search"
                value={patternSearch}
                onChange={(event) =>
                  setPatternSearch(
                    event.target.value
                  )
                }
                placeholder="Example: collar, pocket, guide"
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-300">
                Style status
              </span>

              <select
                value={patternFilter}
                onChange={(event) =>
                  setPatternFilter(
                    event.target
                      .value as PatternFilter
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400"
              >
                <option value="all">
                  All pattern pieces
                </option>

                <option value="included">
                  Included in style
                </option>

                <option value="excluded">
                  Excluded from style
                </option>

                <option value="marker">
                  Included in marker
                </option>

                <option value="non-marker">
                  Included, not in marker
                </option>

                <option value="guide">
                  Guide-only pieces
                </option>
              </select>
            </label>

            <label>
              <span className="text-sm font-black text-slate-300">
                Material category
              </span>

              <select
                value={materialFilter}
                onChange={(event) =>
                  setMaterialFilter(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400"
              >
                <option value="all">
                  All materials
                </option>

                {availableMaterials.map(
                  (material) => (
                    <option
                      key={material}
                      value={material}
                    >
                      {material}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>

          {filtersActive ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl border border-violet-400/30 bg-slate-950 px-4 py-2 font-black text-violet-300 transition hover:bg-violet-950"
            >
              Clear Filters
            </button>
          ) : null}
        </section>

        <section className="mt-8 space-y-5">
          {filteredPatterns.map(
            (pattern, visibleIndex) => {
              const included =
                pattern.includedInStyle ===
                true;

              const inMarker =
                pattern.includeInMarker ===
                true;

              const material =
                pattern.styleMaterialCategory ??
                normaliseMaterialCategory(
                  pattern.materialCategory
                );

              const cutQuantity =
                pattern.styleCutQuantity ??
                pattern.cutQuantity ??
                1;

              const originalIndex =
                project.patterns.findIndex(
                  (projectPattern) =>
                    projectPattern.id ===
                    pattern.id
                );

              return (
                <article
                  key={pattern.id}
                  className={`rounded-3xl border p-5 transition sm:p-7 ${
                    included
                      ? inMarker
                        ? "border-emerald-400/30 bg-emerald-950/10"
                        : "border-violet-400/30 bg-violet-950/10"
                      : "border-slate-700 bg-slate-900/70 opacity-80"
                  }`}
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 font-black text-violet-300">
                        {String(
                          originalIndex >= 0
                            ? originalIndex + 1
                            : visibleIndex + 1
                        ).padStart(2, "0")}
                      </div>

                      <div>
                        <div className="flex flex-wrap gap-2">
                          {pattern.custom ? (
                            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-violet-300">
                              Custom
                            </span>
                          ) : null}

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${
                              pattern.uploaded
                                ? "border-cyan-400/30 bg-cyan-500/10 text-cyan-300"
                                : "border-red-400/30 bg-red-500/10 text-red-300"
                            }`}
                          >
                            {pattern.uploaded
                              ? "Uploaded"
                              : "Not uploaded"}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${
                              inMarker
                                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                                : "border-slate-600 bg-slate-800 text-slate-400"
                            }`}
                          >
                            {inMarker
                              ? "Marker piece"
                              : "No marker"}
                          </span>
                        </div>

                        <h3 className="mt-3 text-2xl font-black">
                          {pattern.name}
                        </h3>

                        {pattern.description ? (
                          <p className="mt-2 max-w-3xl leading-7 text-slate-400">
                            {pattern.description}
                          </p>
                        ) : null}

                        {pattern.fileName ? (
                          <p className="mt-3 text-sm font-bold text-cyan-300">
                            File: {pattern.fileName}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4">
                      <input
                        type="checkbox"
                        checked={included}
                        disabled={selectionLocked}
                        onChange={(event) =>
                          handleIncludedChange(
                            pattern.id,
                            event.target.checked
                          )
                        }
                        className="h-6 w-6 accent-emerald-400 disabled:cursor-not-allowed"
                      />

                      <span>
                        <span className="block font-black text-white">
                          Include in this style
                        </span>

                        <span className="mt-1 block text-sm text-slate-500">
                          This piece belongs to the
                          approved garment construction.
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <label>
                      <span className="text-sm font-black text-slate-300">
                        Material category
                      </span>

                      <select
                        value={material}
                        disabled={
                          !included ||
                          selectionLocked
                        }
                        onChange={(event) =>
                          handleMaterialChange(
                            pattern.id,
                            event
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition enabled:focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {materialCategories.map(
                          (category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {category}
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    <label>
                      <span className="text-sm font-black text-slate-300">
                        Cut quantity per garment
                      </span>

                      <input
                        type="number"
                        min="1"
                        max="99"
                        step="1"
                        value={cutQuantity}
                        disabled={
                          !included ||
                          !inMarker ||
                          selectionLocked
                        }
                        onChange={(event) =>
                          updatePattern(pattern.id, {
                            styleCutQuantity:
                              Number(
                                event.target.value
                              ),
                          })
                        }
                        className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition enabled:focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          pattern.styleCutOnFold ===
                          true
                        }
                        disabled={
                          !included ||
                          !inMarker ||
                          selectionLocked
                        }
                        onChange={(event) =>
                          updatePattern(pattern.id, {
                            styleCutOnFold:
                              event.target.checked,
                          })
                        }
                        className="h-5 w-5 accent-blue-400 disabled:cursor-not-allowed"
                      />

                      <span>
                        <span className="block font-black text-slate-200">
                          Cut on fold
                        </span>

                        <span className="mt-1 block text-xs text-slate-500">
                          Place the identified edge on a
                          fabric fold.
                        </span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          pattern.styleRequired ===
                          true
                        }
                        disabled={
                          !included ||
                          selectionLocked
                        }
                        onChange={(event) =>
                          updatePattern(pattern.id, {
                            styleRequired:
                              event.target.checked,
                          })
                        }
                        className="h-5 w-5 accent-amber-400 disabled:cursor-not-allowed"
                      />

                      <span>
                        <span className="block font-black text-slate-200">
                          Required piece
                        </span>

                        <span className="mt-1 block text-xs text-slate-500">
                          The style cannot be approved
                          without this component.
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.35fr)]">
                    <label>
                      <span className="text-sm font-black text-slate-300">
                        Engineering notes
                      </span>

                      <textarea
                        value={
                          pattern.styleSelectionNotes ??
                          ""
                        }
                        disabled={
                          !included ||
                          selectionLocked
                        }
                        onChange={(event) =>
                          updatePattern(pattern.id, {
                            styleSelectionNotes:
                              event.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Example: use main shell fabric, pair piece, exclude placement guide from marker."
                        className="mt-2 w-full resize-y rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 enabled:focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-emerald-400/20 bg-slate-950 px-5 py-4">
                      <input
                        type="checkbox"
                        checked={inMarker}
                        disabled={
                          !included ||
                          material ===
                            "Guide Only" ||
                          selectionLocked
                        }
                        onChange={(event) =>
                          updatePattern(pattern.id, {
                            includeInMarker:
                              event.target.checked,
                          })
                        }
                        className="h-6 w-6 accent-emerald-400 disabled:cursor-not-allowed"
                      />

                      <span>
                        <span className="block font-black text-emerald-300">
                          Include in marker
                        </span>

                        <span className="mt-1 block text-sm leading-6 text-slate-500">
                          Use this piece in fabric area,
                          nesting and consumption
                          calculations.
                        </span>
                      </span>
                    </label>
                  </div>

                  {material === "Guide Only" ? (
                    <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-950/10 px-4 py-3 text-sm font-bold text-amber-300">
                      Guide-only pieces are automatically
                      excluded from marker and fabric
                      consumption calculations.
                    </div>
                  ) : null}

                  {included &&
                  !pattern.uploaded ? (
                    <div className="mt-5 rounded-xl border border-red-400/20 bg-red-950/10 px-4 py-3 text-sm font-bold text-red-300">
                      This pattern is included in the
                      style but its source file has not
                      been uploaded.
                    </div>
                  ) : null}
                </article>
              );
            }
          )}

          {filteredPatterns.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-violet-400/30 bg-violet-950/10 px-6 py-12 text-center">
              <p className="text-5xl">🔎</p>

              <h2 className="mt-4 text-2xl font-black">
                No pattern pieces match these filters
              </h2>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-violet-400 px-5 py-3 font-black text-slate-950 transition hover:bg-violet-300"
              >
                Show All Patterns
              </button>
            </div>
          ) : null}
        </section>

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-blue-950 p-6 sm:p-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Module completion
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Approve the Style Pattern Set
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-300">
                OptiFabric will pass only the approved
                pieces, material assignments, quantities and
                fold rules into AI recognition and marker
                preparation.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <ReadinessItem
                  label="Included pieces uploaded"
                  passed={
                    metrics.missingUploads === 0 &&
                    metrics.includedPatterns > 0
                  }
                  detail={
                    metrics.missingUploads === 0
                      ? "All included source files are available."
                      : `${metrics.missingUploads} included pattern(s) are missing uploads.`
                  }
                />

                <ReadinessItem
                  label="Marker quantities valid"
                  passed={
                    metrics.invalidQuantities === 0 &&
                    metrics.markerPatterns > 0
                  }
                  detail={
                    metrics.invalidQuantities === 0
                      ? "All marker quantities are valid."
                      : `${metrics.invalidQuantities} marker quantity value(s) need correction.`
                  }
                />

                <ReadinessItem
                  label="Marker set available"
                  passed={
                    metrics.markerPatterns > 0
                  }
                  detail={`${metrics.markerPatterns} pattern type(s) currently enter a marker.`}
                />
              </div>
            </div>

            <div className="flex min-w-72 flex-col gap-3">
              {!selectionLocked ? (
                <>
                  <button
                    type="button"
                    onClick={completeStyleSelection}
                    disabled={
                      !selectionCanBeCompleted
                    }
                    className="rounded-2xl border border-cyan-400/30 bg-cyan-950/30 px-7 py-4 text-lg font-black text-cyan-200 transition enabled:hover:bg-cyan-900/40 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
                  >
                    Complete Selection Review
                  </button>

                  <button
                    type="button"
                    onClick={lockStyleSelection}
                    disabled={
                      !selectionCanBeCompleted ||
                      !project.patternValidationCompleted
                    }
                    className="rounded-2xl bg-emerald-400 px-7 py-4 text-lg font-black text-slate-950 transition enabled:hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  >
                    Lock Style Pattern Set
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/optifabric/project/${project.id}/ai-pattern-recognition`}
                    className="rounded-2xl bg-cyan-400 px-7 py-4 text-center text-lg font-black text-slate-950 transition hover:bg-cyan-300"
                  >
                    Continue to AI Recognition →
                  </Link>

                  <button
                    type="button"
                    onClick={unlockStyleSelection}
                    className="rounded-2xl border border-amber-400/30 bg-amber-950/20 px-7 py-4 font-black text-amber-300 transition hover:bg-amber-900/30"
                  >
                    Unlock for Editing
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-xl font-black text-violet-300">
            Why does AI ask which patterns enter the
            marker?
          </h2>

          <p className="mt-3 max-w-5xl leading-7 text-slate-300">
            A garment project may contain construction
            guides, optional components, interlining pieces,
            decorative elements and patterns belonging to
            different materials. Including every uploaded
            image in the main-fabric marker would exaggerate
            consumption and produce an incorrect fabric-order
            recommendation.
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

      <p className="mt-2 text-3xl font-black text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {detail}
      </p>
    </article>
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