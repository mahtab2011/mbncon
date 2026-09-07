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

interface UploadedPatternStatus extends PatternStatus {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;

  scaleVisible?: boolean;
  grainLineVisible?: boolean;
  notchesVisible?: boolean;

  validationPassed?: boolean;

  materialCategory?: string;
}

interface PatternUploadProject
  extends Omit<EngineeringProject, "patterns"> {
  patterns: UploadedPatternStatus[];

  patternValidationCompleted?: boolean;
  patternValidationCompletedAt?: string;

  updatedAt?: string;
}
type PreviewMap = Record<string, string>;

function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "No file";
  }

  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");

  return parts.length > 1 ? parts.pop() || "" : "";
}

function isSupportedPatternFile(file: File) {
  const supportedTypes = [
    "image/png",
    "image/jpeg",
    "application/pdf",
  ];

  const supportedExtensions = [
    "png",
    "jpg",
    "jpeg",
    "pdf",
  ];

  return (
    supportedTypes.includes(file.type) ||
    supportedExtensions.includes(
      getFileExtension(file.name)
    )
  );
}

export default function PatternSetUploadPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [project, setProject] =
    useState<PatternUploadProject | null>(null);

  const [previews, setPreviews] =
    useState<PreviewMap>({});

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [validationRunning, setValidationRunning] =
    useState(false);

  const [addPatternOpen, setAddPatternOpen] =
    useState(false);

  const [customPatternName, setCustomPatternName] =
    useState("");

  const [customCutQuantity, setCustomCutQuantity] =
    useState("1");

  const [customPatternRequired, setCustomPatternRequired] =
    useState(true);

  const [customCutOnFold, setCustomCutOnFold] =
    useState(false);

  const [customPatternDescription, setCustomPatternDescription] =
    useState("");

  const [customMaterialCategory, setCustomMaterialCategory] =
    useState("Main Fabric");

  const [patternSearch, setPatternSearch] =
    useState("");

  const [patternStatusFilter, setPatternStatusFilter] =
    useState("all");

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
      ) as PatternUploadProject;

      setProject(parsedProject);
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

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, [previews]);

 function saveProject(
  updatedProject: PatternUploadProject
) {
  const projectWithUpdateTime: PatternUploadProject = {
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
}

  function handlePatternUpload(
    patternId: string,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !project) {
      return;
    }

    setMessage("");

    if (!isSupportedPatternFile(file)) {
      setMessage(
        "Please upload a PNG, JPG, JPEG or PDF pattern file."
      );

      event.target.value = "";
      return;
    }

    const maximumFileSize =
      15 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      setMessage(
        "The selected file is larger than 15 MB. Please use a smaller pattern image or PDF."
      );

      event.target.value = "";
      return;
    }

    const oldPreview = previews[patternId];

    if (oldPreview) {
      URL.revokeObjectURL(oldPreview);
    }

    if (file.type.startsWith("image/")) {
      const previewUrl =
        URL.createObjectURL(file);

      setPreviews((current) => ({
        ...current,
        [patternId]: previewUrl,
      }));
    } else {
      setPreviews((current) => {
        const updated = { ...current };
        delete updated[patternId];

        return updated;
      });
    }

    const updatedPatterns =
      project.patterns.map((pattern) => {
        if (pattern.id !== patternId) {
          return pattern;
        }

        return {
          ...pattern,
          uploaded: true,
          recognised: false,
          fileName: file.name,
          fileType:
            file.type || "Unknown file type",
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),

          scaleVisible: true,
          grainLineVisible: true,
          notchesVisible: true,

          validationPassed: false,
        };
      });

    saveProject({
      ...project,
      patterns: updatedPatterns,
      patternValidationCompleted: false,
      patternValidationCompletedAt: undefined,
    });

    setMessage(
      `${file.name} was added to the pattern set.`
    );
  }

  function removePattern(patternId: string) {
    if (!project) {
      return;
    }

    const oldPreview = previews[patternId];

    if (oldPreview) {
      URL.revokeObjectURL(oldPreview);
    }

    setPreviews((current) => {
      const updated = { ...current };
      delete updated[patternId];

      return updated;
    });

    const updatedPatterns =
      project.patterns.map((pattern) => {
        if (pattern.id !== patternId) {
          return pattern;
        }

        return {
          ...pattern,
          uploaded: false,
          recognised: false,
          fileName: undefined,
          fileType: undefined,
          fileSize: undefined,
          uploadedAt: undefined,
          scaleVisible: undefined,
          grainLineVisible: undefined,
          notchesVisible: undefined,
          validationPassed: false,
        };
      });

    saveProject({
      ...project,
      patterns: updatedPatterns,
      patternValidationCompleted: false,
      patternValidationCompletedAt: undefined,
    });

    setMessage("Pattern file removed.");
  }

  function updateVisibilityCheck(
    patternId: string,
    field:
      | "scaleVisible"
      | "grainLineVisible"
      | "notchesVisible",
    checked: boolean
  ) {
    if (!project) {
      return;
    }

    const updatedPatterns =
      project.patterns.map((pattern) => {
        if (pattern.id !== patternId) {
          return pattern;
        }

        return {
          ...pattern,
          [field]: checked,
          validationPassed: false,
        };
      });

    saveProject({
      ...project,
      patterns: updatedPatterns,
      patternValidationCompleted: false,
      patternValidationCompletedAt: undefined,
    });
  }

  function resetCustomPatternForm() {
    setCustomPatternName("");
    setCustomCutQuantity("1");
    setCustomPatternRequired(true);
    setCustomCutOnFold(false);
    setCustomPatternDescription("");
    setCustomMaterialCategory("Main Fabric");
  }

  function closeAddPatternDialog() {
    setAddPatternOpen(false);
    resetCustomPatternForm();
  }

  function addCustomPatternPiece() {
    if (!project) {
      return;
    }

    const cleanName = customPatternName.trim();
    const quantity = Number(customCutQuantity);

    if (!cleanName) {
      setMessage("Enter a name for the additional pattern piece.");
      return;
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      setMessage(
        "Cut quantity must be a whole number between 1 and 99."
      );
      return;
    }

    const duplicatePattern =
      project.patterns.some(
        (pattern) =>
          pattern.name.trim().toLowerCase() ===
          cleanName.toLowerCase()
      );

    if (duplicatePattern) {
      setMessage(
        `A pattern piece named "${cleanName}" already exists in this project.`
      );
      return;
    }

    const customPattern: UploadedPatternStatus = {
      id: `custom-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name: cleanName,
      required: customPatternRequired,
      uploaded: false,
      recognised: false,
      custom: true,
      cutQuantity: quantity,
      cutOnFold: customCutOnFold,
      description:
  customPatternDescription.trim() || undefined,

sequence: project.patterns.length + 1,

materialCategory: customMaterialCategory,

validationPassed: false,
    };

    saveProject({
      ...project,
      patterns: [
        ...project.patterns,
        customPattern,
      ],
      patternValidationCompleted: false,
      patternValidationCompletedAt: undefined,
    });

    closeAddPatternDialog();

    setMessage(
      `${cleanName} was added as a custom pattern piece.`
    );
  }

  function deleteCustomPatternPiece(
    patternId: string
  ) {
    if (!project) {
      return;
    }

    const patternToDelete =
      project.patterns.find(
        (pattern) => pattern.id === patternId
      );

    if (!patternToDelete?.custom) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the custom pattern piece "${patternToDelete.name}"?`
    );

    if (!confirmed) {
      return;
    }

    const oldPreview = previews[patternId];

    if (oldPreview) {
      URL.revokeObjectURL(oldPreview);
    }

    setPreviews((current) => {
      const updated = { ...current };
      delete updated[patternId];

      return updated;
    });

    saveProject({
      ...project,
      patterns: project.patterns.filter(
        (pattern) => pattern.id !== patternId
      ),
      patternValidationCompleted: false,
      patternValidationCompletedAt: undefined,
    });

    setMessage(
      `${patternToDelete.name} was deleted from the project.`
    );
  }

  const projectMetrics = useMemo(() => {
    if (!project) {
      return {
        totalPatterns: 0,
        uploadedPatterns: 0,
        requiredPatterns: 0,
        uploadedRequiredPatterns: 0,
        requiredUploadComplete: false,
        uploadPercentage: 0,
      };
    }

    const totalPatterns =
      project.patterns.length;

    const uploadedPatterns =
      project.patterns.filter(
        (pattern) => pattern.uploaded
      ).length;

    const requiredPatterns =
      project.patterns.filter(
        (pattern) => pattern.required
      );

    const uploadedRequiredPatterns =
      requiredPatterns.filter(
        (pattern) => pattern.uploaded
      ).length;

    const requiredUploadComplete =
      requiredPatterns.length > 0 &&
      uploadedRequiredPatterns ===
        requiredPatterns.length;

    const uploadPercentage =
      totalPatterns > 0
        ? Math.round(
            (uploadedPatterns / totalPatterns) * 100
          )
        : 0;

    return {
      totalPatterns,
      uploadedPatterns,
      requiredPatterns:
        requiredPatterns.length,
      uploadedRequiredPatterns,
      requiredUploadComplete,
      uploadPercentage,
    };
  }, [project]);

  const allUploadedPatternsReadyForValidation =
    useMemo(() => {
      if (!project) {
        return false;
      }

      const uploadedPatterns =
        project.patterns.filter(
          (pattern) => pattern.uploaded
        );

      if (
        uploadedPatterns.length === 0 ||
        !projectMetrics.requiredUploadComplete
      ) {
        return false;
      }

      return uploadedPatterns.every(
        (pattern) =>
          pattern.scaleVisible === true &&
          pattern.grainLineVisible === true &&
          pattern.notchesVisible === true
      );
    }, [
      project,
      projectMetrics.requiredUploadComplete,
    ]);

  function runPatternValidation() {
    if (
      !project ||
      !allUploadedPatternsReadyForValidation
    ) {
      return;
    }

    setValidationRunning(true);
    setMessage("");

    window.setTimeout(() => {
      const updatedPatterns =
        project.patterns.map((pattern) => {
          if (!pattern.uploaded) {
            return pattern;
          }

          const validationPassed =
            pattern.scaleVisible === true &&
            pattern.grainLineVisible === true &&
            pattern.notchesVisible === true;

          return {
            ...pattern,
            validationPassed,
          };
        });

      const validationCompleted =
        updatedPatterns
          .filter((pattern) => pattern.required)
          .every(
            (pattern) =>
              pattern.uploaded &&
              pattern.validationPassed
          );

      const updatedProject: PatternUploadProject = {
        ...project,
        patterns: updatedPatterns,
        patternValidationCompleted:
          validationCompleted,
        patternValidationCompletedAt:
          validationCompleted
            ? new Date().toISOString()
            : undefined,
      };

      saveProject(updatedProject);
      setValidationRunning(false);

      setMessage(
        validationCompleted
          ? "AI pattern-set validation completed successfully. The required pattern set is ready for recognition."
          : "Validation found an incomplete required pattern or missing visibility confirmation."
      );
    }, 1200);
  }

  const standardPatterns =
    project?.patterns.filter(
      (pattern) => !pattern.custom
    ) ?? [];

  const customPatterns =
    project?.patterns.filter(
      (pattern) => pattern.custom
    ) ?? [];

  const availableMaterialCategories = useMemo(() => {
    if (!project) {
      return [];
    }

    return Array.from(
      new Set(
        project.patterns
          .map((pattern) =>
            pattern.materialCategory?.trim()
          )
          .filter(
            (category): category is string =>
              Boolean(category)
          )
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [project]);

  function patternMatchesWorkspaceFilters(
    pattern: UploadedPatternStatus
  ) {
    const cleanSearch =
      patternSearch.trim().toLowerCase();

    const matchesSearch =
      cleanSearch.length === 0 ||
      pattern.name
        .toLowerCase()
        .includes(cleanSearch) ||
      pattern.description
        ?.toLowerCase()
        .includes(cleanSearch) ||
      pattern.materialCategory
        ?.toLowerCase()
        .includes(cleanSearch);

    const matchesStatus =
      patternStatusFilter === "all" ||
      (patternStatusFilter === "waiting" &&
        !pattern.uploaded) ||
      (patternStatusFilter === "uploaded" &&
        pattern.uploaded &&
        !pattern.validationPassed) ||
      (patternStatusFilter === "validated" &&
        pattern.validationPassed);

    const matchesMaterial =
      materialFilter === "all" ||
      pattern.materialCategory ===
        materialFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMaterial
    );
  }

  const filteredStandardPatterns =
    standardPatterns.filter(
      patternMatchesWorkspaceFilters
    );

  const filteredCustomPatterns =
    customPatterns.filter(
      patternMatchesWorkspaceFilters
    );

  const filteredPatternCount =
    filteredStandardPatterns.length +
    filteredCustomPatterns.length;

  const workspaceFilterActive =
    patternSearch.trim().length > 0 ||
    patternStatusFilter !== "all" ||
    materialFilter !== "all";

  function clearWorkspaceFilters() {
    setPatternSearch("");
    setPatternStatusFilter("all");
    setMaterialFilter("all");
  }

  function renderPatternCard(
    pattern: UploadedPatternStatus,
    index: number
  ) {
    const preview = previews[pattern.id];
    const uploaded = pattern.uploaded;

    return (
      <article
        key={pattern.id}
        className={`overflow-hidden rounded-3xl border ${
          pattern.validationPassed
            ? "border-emerald-400/40 bg-emerald-950/20"
            : uploaded
              ? "border-cyan-400/40 bg-cyan-950/20"
              : pattern.custom
                ? "border-violet-400/30 bg-violet-950/10"
                : "border-slate-700 bg-slate-900"
        }`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 font-black text-cyan-300">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              {pattern.custom ? (
                <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-violet-300">
                  Custom
                </span>
              ) : null}

              <span
                className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${
                  pattern.validationPassed
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
                    : uploaded
                      ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-600 bg-slate-800 text-slate-400"
                }`}
              >
                {pattern.validationPassed
                  ? "Validated"
                  : uploaded
                    ? "Uploaded"
                    : "Waiting"}
              </span>
            </div>
          </div>

          <h3 className="mt-5 text-2xl font-black">
            {pattern.name}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
            <span
              className={`rounded-full border px-3 py-1 ${
                pattern.required
                  ? "border-amber-400/30 bg-amber-500/10 text-amber-300"
                  : "border-slate-600 bg-slate-800 text-slate-400"
              }`}
            >
              {pattern.required
                ? "Required pattern"
                : "Optional pattern"}
            </span>

            {pattern.cutQuantity ? (
              <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-slate-300">
                Cut quantity: {pattern.cutQuantity}
              </span>
            ) : null}

            {pattern.cutOnFold ? (
              <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-blue-300">
                Cut on fold
              </span>
            ) : null}
          </div>

          {pattern.materialCategory ? (
            <p className="mt-4 text-sm font-bold text-violet-300">
              Material: {pattern.materialCategory}
            </p>
          ) : null}

          {pattern.description ? (
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {pattern.description}
            </p>
          ) : null}

          {preview ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-white">
              <img
                src={preview}
                alt={`${pattern.name} pattern preview`}
                className="h-56 w-full object-contain"
              />
            </div>
          ) : uploaded &&
            pattern.fileType ===
              "application/pdf" ? (
            <div className="mt-5 flex h-56 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950">
              <div className="text-center">
                <p className="text-5xl">📄</p>

                <p className="mt-3 font-black">
                  PDF Pattern
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-600 bg-slate-950">
              <div className="text-center">
                <p className="text-5xl">📐</p>

                <p className="mt-3 font-bold text-slate-400">
                  No pattern uploaded
                </p>
              </div>
            </div>
          )}

          <label className="mt-5 block cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-center font-black text-slate-950 transition hover:bg-cyan-300">
            {uploaded
              ? "Replace Pattern File"
              : "Choose Pattern File"}

            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
              onChange={(event) =>
                handlePatternUpload(
                  pattern.id,
                  event
                )
              }
              className="hidden"
            />
          </label>
{uploaded ? (
  <Link
    href={`/optifabric/project/${projectId}/patterns/${pattern.id}/trace`}
    className="mt-3 block rounded-xl border border-violet-400/30 bg-violet-950/30 px-4 py-3 text-center font-black text-violet-200 transition hover:bg-violet-900/40"
  >
    Open Tracing Workspace
  </Link>
) : null}
          {uploaded ? (
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950 p-4">
              <p className="break-all font-black text-white">
                {pattern.fileName}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {formatFileSize(
                  pattern.fileSize
                )}
              </p>

              <button
                type="button"
                onClick={() =>
                  removePattern(pattern.id)
                }
                className="mt-3 text-sm font-black text-red-300 transition hover:text-red-200"
              >
                Remove file
              </button>
            </div>
          ) : null}

          {uploaded ? (
            <div className="mt-5 space-y-3">
              <VisibilityCheck
                label="12-inch scale visible"
                checked={
                  pattern.scaleVisible === true
                }
                onChange={(checked) =>
                  updateVisibilityCheck(
                    pattern.id,
                    "scaleVisible",
                    checked
                  )
                }
              />

              <VisibilityCheck
                label="Grain line visible"
                checked={
                  pattern.grainLineVisible === true
                }
                onChange={(checked) =>
                  updateVisibilityCheck(
                    pattern.id,
                    "grainLineVisible",
                    checked
                  )
                }
              />

              <VisibilityCheck
                label="Notches visible"
                checked={
                  pattern.notchesVisible === true
                }
                onChange={(checked) =>
                  updateVisibilityCheck(
                    pattern.id,
                    "notchesVisible",
                    checked
                  )
                }
              />
            </div>
          ) : null}

          {pattern.custom ? (
            <button
              type="button"
              onClick={() =>
                deleteCustomPatternPiece(
                  pattern.id
                )
              }
              className="mt-5 w-full rounded-xl border border-red-400/30 bg-red-950/20 px-4 py-3 font-black text-red-300 transition hover:bg-red-950/40 hover:text-red-200"
            >
              Delete Custom Pattern Piece
            </button>
          ) : null}
        </div>
      </article>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 px-10 py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-5 text-lg font-bold">
            Loading Pattern Set...
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
            Pattern project unavailable
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            {loadError}
          </p>

          <Link
            href="/optifabric/project/new"
            className="mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
          >
            Create New Project
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-7 shadow-2xl shadow-cyan-950/30 sm:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                OptiFabric AI · Module 01
              </p>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                Pattern Set Upload
              </h1>

              <p className="mt-4 text-2xl font-black">
                {project.projectName}
              </p>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Upload and verify each garment pattern
                piece before AI recognition,
                measurement and marker optimisation.
              </p>
            </div>

            <Link
              href={`/optifabric/project/${project.id}`}
              className="inline-flex rounded-xl border border-cyan-400/40 bg-cyan-950/40 px-5 py-3 font-black text-cyan-200 transition hover:bg-cyan-900/50"
            >
              ← Command Centre
            </Link>
          </div>
        </header>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Pattern upload status
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Complete Pattern Set
              </h2>

              <p className="mt-3 text-slate-400">
                Required patterns uploaded:{" "}
                <span className="font-black text-white">
                  {
                    projectMetrics.uploadedRequiredPatterns
                  }{" "}
                  of {
                    projectMetrics.requiredPatterns
                  }
                </span>
              </p>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-5xl font-black text-cyan-300">
                {projectMetrics.uploadPercentage}%
              </p>

              <p className="mt-1 font-bold text-slate-400">
                {
                  projectMetrics.uploadedPatterns
                }{" "}
                of {
                  projectMetrics.totalPatterns
                } pattern types uploaded
              </p>
            </div>
          </div>

          <div className="mt-6 h-5 overflow-hidden rounded-full border border-slate-700 bg-slate-950">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{
                width: `${projectMetrics.uploadPercentage}%`,
              }}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <StatusMetric
              label="Total Pattern Types"
              value={String(
                projectMetrics.totalPatterns
              )}
            />

            <StatusMetric
              label="Required Uploaded"
              value={`${projectMetrics.uploadedRequiredPatterns}/${projectMetrics.requiredPatterns}`}
            />

            <StatusMetric
              label="Validation"
              value={
                project.patternValidationCompleted
                  ? "Completed"
                  : "Waiting"
              }
            />
          </div>
        </section>

        {message ? (
          <section
            className={`mt-6 rounded-2xl border px-5 py-4 font-bold ${
              project.patternValidationCompleted
                ? "border-emerald-400/30 bg-emerald-950/30 text-emerald-200"
                : "border-cyan-400/30 bg-cyan-950/30 text-cyan-100"
            }`}
          >
            {message}
          </section>
        ) : null}

        <section className="mt-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Upload workspace
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Pattern Piece Manager
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-400">
                Upload the standard garment pattern set and add
                any style-specific pieces required for the actual
                design, construction and marker plan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAddPatternOpen(true);
                setMessage("");
              }}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 font-black text-slate-950 transition hover:bg-emerald-400"
            >
              + Add Pattern Piece
            </button>
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-slate-900 p-5 sm:p-7">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                  Pattern Workspace Control
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Search and Filter Pattern Pieces
                </h3>

                <p className="mt-2 max-w-3xl text-slate-400">
                  Find pattern pieces quickly by name, engineering
                  description, material category or upload status.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Visible results
                </p>

                <p className="mt-1 text-2xl font-black text-cyan-300">
                  {filteredPatternCount} of {project.patterns.length}
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
                  placeholder="Example: pocket, collar, lining"
                  className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
                />
              </label>

              <label>
                <span className="text-sm font-black text-slate-300">
                  Upload status
                </span>

                <select
                  value={patternStatusFilter}
                  onChange={(event) =>
                    setPatternStatusFilter(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option value="all">
                    All statuses
                  </option>

                  <option value="waiting">
                    Waiting for upload
                  </option>

                  <option value="uploaded">
                    Uploaded, not validated
                  </option>

                  <option value="validated">
                    Validated
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
                  className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                >
                  <option value="all">
                    All materials
                  </option>

                  {availableMaterialCategories.map(
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
            </div>

            {workspaceFilterActive ? (
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-950/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-bold text-cyan-100">
                  Workspace filters are active.
                </p>

                <button
                  type="button"
                  onClick={clearWorkspaceFilters}
                  className="rounded-xl border border-cyan-400/30 bg-slate-950 px-4 py-2 font-black text-cyan-300 transition hover:bg-cyan-950"
                >
                  Clear Filters
                </button>
              </div>
            ) : null}
          </div>

          {filteredPatternCount === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-amber-400/30 bg-amber-950/10 px-6 py-12 text-center">
              <p className="text-5xl">🔎</p>

              <h3 className="mt-4 text-2xl font-black">
                No pattern pieces match these filters
              </h3>

              <p className="mt-3 text-slate-400">
                Clear the search or change the selected status and
                material category.
              </p>

              <button
                type="button"
                onClick={clearWorkspaceFilters}
                className="mt-6 rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300"
              >
                Show All Pattern Pieces
              </button>
            </div>
          ) : null}

          <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-900/70 p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                  Standard Pattern Set
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Garment Master Pieces
                </h3>
              </div>

              <p className="font-bold text-slate-400">
                {filteredStandardPatterns.length} visible of{" "}
                {standardPatterns.length} pattern types
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredStandardPatterns.map(
                (pattern) =>
                  renderPatternCard(
                    pattern,
                    project.patterns.findIndex(
                      (projectPattern) =>
                        projectPattern.id ===
                        pattern.id
                    )
                  )
              )}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-violet-400/20 bg-violet-950/10 p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-violet-300">
                  Custom Pattern Pieces
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  Style-Specific Components
                </h3>

                <p className="mt-3 max-w-3xl text-slate-400">
                  Add pieces such as pocket flaps, double cuffs,
                  collar tabs, extra facings, contrast panels or
                  reinforcement components.
                </p>
              </div>

              <p className="font-bold text-violet-300">
                {filteredCustomPatterns.length} visible of{" "}
                {customPatterns.length} custom pieces
              </p>
            </div>

            {filteredCustomPatterns.length > 0 ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredCustomPatterns.map(
                  (pattern) =>
                    renderPatternCard(
                      pattern,
                      project.patterns.findIndex(
                        (projectPattern) =>
                          projectPattern.id ===
                          pattern.id
                      )
                    )
                )}
              </div>
            ) : customPatterns.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-violet-400/30 bg-slate-950/50 px-6 py-10 text-center">
                <p className="text-4xl">➕</p>

                <p className="mt-4 text-xl font-black">
                  No custom pattern pieces added
                </p>

                <p className="mt-2 text-slate-400">
                  Use “Add Pattern Piece” when the style contains
                  additional components beyond the standard set.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-violet-400/30 bg-slate-950/50 px-6 py-10 text-center">
                <p className="text-4xl">🔎</p>

                <p className="mt-4 text-xl font-black">
                  No custom pieces match the filters
                </p>

                <p className="mt-2 text-slate-400">
                  The project still contains custom pattern pieces,
                  but none match the current workspace filters.
                </p>
              </div>
            )}
          </div>
        </section>

        {addPatternOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 px-4 py-8 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-pattern-title"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeAddPatternDialog();
              }
            }}
          >
            <section className="max-h-full w-full max-w-3xl overflow-y-auto rounded-3xl border border-emerald-400/30 bg-slate-900 p-6 shadow-2xl shadow-emerald-950/40 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
                    Engineering Pattern Manager
                  </p>

                  <h2
                    id="add-pattern-title"
                    className="mt-2 text-3xl font-black"
                  >
                    Add Custom Pattern Piece
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                    Define a style-specific component that is not
                    included in the garment’s standard pattern set.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeAddPatternDialog}
                  aria-label="Close add pattern dialog"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-950 text-xl font-black text-slate-300 transition hover:border-red-400/40 hover:text-red-300"
                >
                  ×
                </button>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="font-black text-slate-200">
                    Pattern piece name
                  </span>

                  <input
                    type="text"
                    value={customPatternName}
                    onChange={(event) =>
                      setCustomPatternName(
                        event.target.value
                      )
                    }
                    placeholder="Example: Pocket Flap"
                    autoFocus
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </label>

                <label>
                  <span className="font-black text-slate-200">
                    Cut quantity
                  </span>

                  <input
                    type="number"
                    min="1"
                    max="99"
                    step="1"
                    value={customCutQuantity}
                    onChange={(event) =>
                      setCustomCutQuantity(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  />
                </label>

                <label>
                  <span className="font-black text-slate-200">
                    Material category
                  </span>

                  <select
                    value={customMaterialCategory}
                    onChange={(event) =>
                      setCustomMaterialCategory(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                  >
                    <option>Main Fabric</option>
                    <option>Contrast Fabric</option>
                    <option>Lining</option>
                    <option>Interlining</option>
                    <option>Fusible</option>
                    <option>Reinforcement</option>
                    <option>Decorative</option>
                    <option>Accessory</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={customPatternRequired}
                    onChange={(event) =>
                      setCustomPatternRequired(
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 accent-emerald-400"
                  />

                  <span>
                    <span className="block font-black text-slate-200">
                      Required pattern
                    </span>

                    <span className="mt-1 block text-sm text-slate-500">
                      Validation cannot finish until it is uploaded.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={customCutOnFold}
                    onChange={(event) =>
                      setCustomCutOnFold(
                        event.target.checked
                      )
                    }
                    className="h-5 w-5 accent-emerald-400"
                  />

                  <span>
                    <span className="block font-black text-slate-200">
                      Cut on fold
                    </span>

                    <span className="mt-1 block text-sm text-slate-500">
                      The pattern edge is aligned to a fabric fold.
                    </span>
                  </span>
                </label>

                <label className="md:col-span-2">
                  <span className="font-black text-slate-200">
                    Engineering description
                  </span>

                  <textarea
                    value={customPatternDescription}
                    onChange={(event) =>
                      setCustomPatternDescription(
                        event.target.value
                      )
                    }
                    placeholder="Describe the function, construction or placement of this piece."
                    rows={4}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400"
                  />
                </label>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAddPatternDialog}
                  className="rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 font-black text-slate-200 transition hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={addCustomPatternPiece}
                  className="rounded-xl bg-emerald-500 px-6 py-3 font-black text-slate-950 transition hover:bg-emerald-400"
                >
                  Add Pattern Piece
                </button>
              </div>
            </section>
          </div>
        ) : null}

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-blue-950 p-6 sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Module completion
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Run AI Pattern-Set Validation
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Validation checks whether every required
                pattern has been uploaded and whether
                scale, grain line and notch visibility
                have been confirmed.
              </p>

              {!projectMetrics.requiredUploadComplete ? (
                <p className="mt-4 font-bold text-amber-300">
                  Upload all required patterns to activate
                  validation.
                </p>
              ) : !allUploadedPatternsReadyForValidation ? (
                <p className="mt-4 font-bold text-amber-300">
                  Confirm scale, grain line and notches for
                  every uploaded pattern.
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={runPatternValidation}
              disabled={
                !allUploadedPatternsReadyForValidation ||
                validationRunning
              }
              className="min-w-72 rounded-2xl bg-cyan-400 px-7 py-4 text-lg font-black text-slate-950 transition enabled:hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {validationRunning
                ? "AI Validation Running..."
                : project.patternValidationCompleted
                  ? "Validation Completed"
                  : "Run AI Validation"}
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-xl font-black text-cyan-300">
            Why does AI ask for the complete pattern set?
          </h2>

          <p className="mt-3 max-w-5xl leading-7 text-slate-300">
            Marker optimisation and fabric consumption
            require every necessary garment component.
            Missing, duplicated or incorrectly identified
            pieces can produce an inaccurate marker,
            consumption estimate and cutting report.
          </p>
        </section>
      </div>
    </main>
  );
}

function StatusMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-black text-white">
        {value}
      </p>
    </article>
  );
}

function VisibilityCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="h-5 w-5 accent-cyan-400"
      />

      <span className="font-bold text-slate-300">
        {label}
      </span>
    </label>
  );
}