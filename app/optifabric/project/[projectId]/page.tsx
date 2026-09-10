"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  EngineeringProject,
  getGarmentDisplayName,
} from "@/lib/optifabric/projectMaster";
import {
  extractStatusCode,
  getProject as getServerProject,
  mapServerProjectToCachedProject,
  type CachedProject,
} from "@/lib/optifabric/projectApi";

type WorkflowStatus = "waiting" | "in-progress" | "completed";

interface WorkflowModule {
  id: string;
  number: number;
  icon: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  href?: string;
  available: boolean;
}

function formatHierarchyLabel(value?: string): string {
  if (!value) {
    return "Not recorded";
  }

  return value
    .split("-")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function getStatusLabel(status: WorkflowStatus) {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "in-progress") {
    return "In Progress";
  }

  return "Waiting";
}

function getStatusClasses(status: WorkflowStatus) {
  if (status === "completed") {
    return {
      badge:
        "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
      card:
        "border-emerald-400/30 bg-gradient-to-br from-emerald-950/40 to-slate-900",
      dot: "bg-emerald-400",
    };
  }

  if (status === "in-progress") {
    return {
      badge: "border-amber-400/40 bg-amber-500/10 text-amber-300",
      card:
        "border-amber-400/30 bg-gradient-to-br from-amber-950/30 to-slate-900",
      dot: "bg-amber-400",
    };
  }

  return {
    badge: "border-slate-600 bg-slate-800 text-slate-300",
    card: "border-slate-700 bg-slate-900",
    dot: "bg-slate-500",
  };
}

export default function EngineeringCommandCentrePage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [project, setProject] = useState<CachedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [refreshWarning, setRefreshWarning] = useState("");

  useEffect(() => {
    if (!projectId) {
      return;
    }

    let cancelled = false;

    async function load() {
      let parsedProject: CachedProject;

      try {
        const storedProject = localStorage.getItem(
          `optifabric-project-${projectId}`
        );

        if (!storedProject) {
          // No local cache — either a legacy local-only project this
          // browser never had (nothing the server can help with), or a
          // server-backed project being opened for the first time on this
          // device/browser. Ask the server before concluding "not found":
          // only its patterns/core fields are reconstructed here (never
          // geometry/marker state, which stays local-only regardless).
          try {
            const serverProject = await getServerProject(projectId);
            if (cancelled) return;

            const cachedProject =
              mapServerProjectToCachedProject(serverProject);

            localStorage.setItem(
              `optifabric-project-${projectId}`,
              JSON.stringify(cachedProject)
            );

            setProject(cachedProject);
            setLoadError("");
          } catch (fetchError) {
            if (cancelled) return;

            const status = extractStatusCode(fetchError);

            if (status === 404) {
              setLoadError(
                "This engineering project could not be found in this browser."
              );
            } else {
              console.error(
                "Unable to load OptiFabric project from the server:",
                fetchError
              );

              setLoadError(
                "This project is not saved in this browser, and the server could not be reached to load it. Please check your connection and try again."
              );
            }
          } finally {
            if (!cancelled) setLoading(false);
          }

          return;
        }

        parsedProject = JSON.parse(storedProject) as CachedProject;

        setProject(parsedProject);
        setLoadError("");
      } catch (error) {
        console.error("Unable to load OptiFabric project:", error);

        setLoadError(
          "The engineering project could not be opened because its saved data is invalid."
        );
        setLoading(false);
        return;
      }

      setLoading(false);

      // Server-backed project (tagged by the create flow) — refresh the
      // core/identity fields from the server, but never touch patterns/
      // geometry, which stay local-only until a later stage migrates them.
      if (parsedProject._server) {
        try {
          const serverProject = await getServerProject(projectId);
          if (cancelled) return;

          const refreshed: CachedProject = {
            ...parsedProject,
            projectName: serverProject.name,
            customer: serverProject.customer,
            styleNumber: serverProject.styleNumber,
            garmentCategory:
              serverProject.garmentCategory as EngineeringProject["garmentCategory"],
            garmentMainCategory:
              (serverProject.mainCategory as
                | EngineeringProject["garmentMainCategory"]
                | null) ?? undefined,
            garmentSubcategory:
              (serverProject.subcategory as
                | EngineeringProject["garmentSubcategory"]
                | null) ?? undefined,
            fabricWidth: serverProject.fabricWidth,
            orderQuantity: serverProject.orderQuantity,
            scaleLength: serverProject.scaleLength,
            _server: {
              code: serverProject.code,
              updatedAt: serverProject.updatedAt,
              archivedAt: serverProject.archivedAt,
            },
          };

          localStorage.setItem(
            `optifabric-project-${projectId}`,
            JSON.stringify(refreshed)
          );

          setProject(refreshed);
          setRefreshWarning("");
        } catch (refreshError) {
          if (cancelled) return;

          console.error(
            "Unable to refresh OptiFabric project from the server:",
            refreshError
          );

          setRefreshWarning(
            extractStatusCode(refreshError) === 404
              ? "This project could not be found on the server. Showing the last saved local copy."
              : "Could not reach the server to refresh this project. Showing the last saved local copy."
          );
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const projectMetrics = useMemo(() => {
    if (!project) {
      return {
        totalPatterns: 0,
        uploadedPatterns: 0,
        recognisedPatterns: 0,
        requiredPatterns: 0,
        uploadedRequiredPatterns: 0,
        uploadComplete: false,
        recognitionComplete: false,
        progress: 0,
      };
    }

    const totalPatterns = project.patterns.length;

    const uploadedPatterns = project.patterns.filter(
      (pattern) => pattern.uploaded
    ).length;

    const recognisedPatterns = project.patterns.filter(
      (pattern) => pattern.recognised
    ).length;

    const requiredPatterns = project.patterns.filter(
      (pattern) => pattern.required
    );

    const uploadedRequiredPatterns = requiredPatterns.filter(
      (pattern) => pattern.uploaded
    ).length;

    const recognisedRequiredPatterns = requiredPatterns.filter(
      (pattern) => pattern.recognised
    ).length;

    const uploadComplete =
      requiredPatterns.length > 0 &&
      uploadedRequiredPatterns === requiredPatterns.length;

    const recognitionComplete =
      requiredPatterns.length > 0 &&
      recognisedRequiredPatterns === requiredPatterns.length;

    let completedStages = 1;

    if (uploadedPatterns > 0) {
      completedStages += uploadComplete ? 1 : 0.5;
    }

    if (uploadComplete) {
      completedStages += 1;
    }

    if (recognisedPatterns > 0) {
      completedStages += recognitionComplete ? 1 : 0.5;
    }

    const progress = Math.min(
      100,
      Math.round((completedStages / 9) * 100)
    );

    return {
      totalPatterns,
      uploadedPatterns,
      recognisedPatterns,
      requiredPatterns: requiredPatterns.length,
      uploadedRequiredPatterns,
      uploadComplete,
      recognitionComplete,
      progress,
    };
  }, [project]);

  const workflowModules = useMemo<WorkflowModule[]>(() => {
    if (!project) {
      return [];
    }

    const uploadStatus: WorkflowStatus =
      projectMetrics.uploadComplete
        ? "completed"
        : projectMetrics.uploadedPatterns > 0
          ? "in-progress"
          : "waiting";

    const validationStatus: WorkflowStatus =
      projectMetrics.uploadComplete ? "in-progress" : "waiting";

    const recognitionStatus: WorkflowStatus =
      projectMetrics.recognitionComplete
        ? "completed"
        : projectMetrics.recognisedPatterns > 0
          ? "in-progress"
          : "waiting";

    return [
      {
        id: "upload-pattern-set",
        number: 1,
        icon: "📤",
        title: "Upload Pattern Set",
        description:
          "Upload and organise every pattern piece belonging to this garment style.",
        status: uploadStatus,
        href: `/optifabric/project/${project.id}/patterns`,
        available: true,
      },
      {
        id: "ai-validation",
        number: 2,
        icon: "✅",
        title: "AI Validation",
        description:
          "Verify scale visibility, grain direction, notches, required pieces and duplicates.",
        status: validationStatus,
        available: projectMetrics.uploadComplete,
      },
      {
        id: "ai-recognition",
        number: 3,
        icon: "🤖",
        title: "AI Pattern Recognition",
        description:
          "Recognise pattern identity, piece type, cut quantity and engineering markings.",
        status: recognitionStatus,
        available: projectMetrics.uploadComplete,
      },
      {
        id: "pattern-measurements",
        number: 4,
        icon: "📐",
        title: "Pattern Measurements",
        description:
          "Convert calibrated image pixels into real pattern dimensions.",
        status: "waiting",
        available: projectMetrics.recognitionComplete,
      },
      {
        id: "pattern-area",
        number: 5,
        icon: "📏",
        title: "Pattern Area Calculation",
        description:
          "Calculate individual pattern areas and the total garment pattern area.",
        status: "waiting",
        available: projectMetrics.recognitionComplete,
      },
      {
        id: "marker-optimisation",
        number: 6,
        icon: "🧩",
        title: "Marker Optimisation",
        description:
          "Arrange the complete pattern set for improved marker utilisation.",
        status: "waiting",
        available: false,
      },
      {
        id: "fabric-consumption",
        number: 7,
        icon: "🧵",
        title: "Fabric Consumption",
        description:
          "Calculate lay length, garment consumption, wastage and order requirements.",
        status: "waiting",
        available: false,
      },
      {
        id: "ai-recommendations",
        number: 8,
        icon: "💡",
        title: "AI Engineering Recommendations",
        description:
          "Receive engineering guidance on efficiency, savings and cutting risks.",
        status: "waiting",
        available: false,
      },
      {
        id: "engineering-report",
        number: 9,
        icon: "📄",
        title: "AI Engineering Report",
        description:
          "Generate the complete professional engineering PDF report.",
        status: "waiting",
        available: false,
      },
    ];
  }, [project, projectMetrics]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-3xl border border-cyan-400/20 bg-slate-900 px-10 py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-5 text-lg font-bold text-slate-200">
            Loading AI Engineering Project...
          </p>
        </div>
      </main>
    );
  }

  if (loadError || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-2xl rounded-3xl border border-red-400/30 bg-red-950/20 p-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-red-300">
            Project unavailable
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Engineering project not found
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            {loadError ||
              "The requested engineering project could not be loaded."}
          </p>

          <Link
            href="/optifabric/project/new"
            className="mt-7 inline-flex rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
          >
            Create New Project
          </Link>
        </section>
      </main>
    );
  }

  const projectCreatedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(project.createdAt));

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-7 shadow-2xl shadow-cyan-950/30 sm:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">
                OptiFabric AI RC2
              </p>

              <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                AI Engineering Command Centre
              </h1>

              <p className="mt-4 text-2xl font-black text-white">
                {project.projectName}
              </p>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                Central engineering workspace for pattern-set management,
                validation, recognition, measurement, marker optimisation,
                consumption analysis and reporting.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/optifabric/project/new"
                className="rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 font-bold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                New Project
              </Link>

              <Link
                href="/optifabric"
                className="rounded-xl border border-cyan-400/30 bg-cyan-950/40 px-5 py-3 font-bold text-cyan-200 transition hover:bg-cyan-900/50"
              >
                OptiFabric Home
              </Link>
            </div>
          </div>
        </header>

        {refreshWarning ? (
          <section className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-950/20 px-5 py-4 text-sm font-semibold text-amber-200">
            {refreshWarning}
          </section>
        ) : null}

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
              Project master information
            </p>

            <h2 className="mt-2 text-3xl font-black">Project Summary</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              label="Customer or Factory"
              value={project.customer || "Not entered"}
            />

            <SummaryCard
              label="Style Number"
              value={project.styleNumber || "Not entered"}
            />

            <SummaryCard
              label="Main Category"
              value={formatHierarchyLabel(project.garmentMainCategory)}
            />

            <SummaryCard
              label="Subcategory"
              value={formatHierarchyLabel(project.garmentSubcategory)}
            />

            <SummaryCard
              label="Garment"
              value={getGarmentDisplayName(project.garmentCategory)}
            />

            <SummaryCard
              label="Fabric Width"
              value={`${project.fabricWidth} inches`}
            />

            <SummaryCard
              label="Order Quantity"
              value={`${project.orderQuantity.toLocaleString("en-GB")} pieces`}
            />

            <SummaryCard
              label="Calibration Scale"
              value={`${project.scaleLength} inches`}
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Live engineering status
              </p>

              <h2 className="mt-2 text-3xl font-black">Project Progress</h2>

              <p className="mt-2 text-slate-400">
                Required patterns uploaded:{" "}
                <span className="font-bold text-white">
                  {projectMetrics.uploadedRequiredPatterns} of{" "}
                  {projectMetrics.requiredPatterns}
                </span>
              </p>
            </div>

            <p className="text-5xl font-black text-cyan-300">
              {projectMetrics.progress}%
            </p>
          </div>

          <div className="mt-6 h-5 overflow-hidden rounded-full border border-slate-700 bg-slate-950">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{
                width: `${projectMetrics.progress}%`,
              }}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ProgressMetric
              label="Pattern Files"
              value={`${projectMetrics.uploadedPatterns}/${projectMetrics.totalPatterns}`}
            />

            <ProgressMetric
              label="AI Recognised"
              value={`${projectMetrics.recognisedPatterns}/${projectMetrics.totalPatterns}`}
            />

            <ProgressMetric
              label="Project Created"
              value={projectCreatedDate}
            />
          </div>
        </section>

        <section className="mt-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
              Complete engineering process
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Engineering Workflow
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-slate-400">
              Complete each module in sequence. Later modules will become
              available automatically as their engineering prerequisites are
              completed.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {workflowModules.map((module) => {
              const styles = getStatusClasses(module.status);

              const cardContent = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950 text-3xl">
                      {module.icon}
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${styles.badge}`}
                    >
                      {getStatusLabel(module.status)}
                    </span>
                  </div>

                  <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
                    Module {String(module.number).padStart(2, "0")}
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    {module.title}
                  </h3>

                  <p className="mt-3 min-h-20 leading-7 text-slate-400">
                    {module.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-700/70 pt-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full ${styles.dot}`}
                      />

                      <span className="text-sm font-bold text-slate-300">
                        {module.available
                          ? "Module available"
                          : "Prerequisite required"}
                      </span>
                    </div>

                    <span
                      className={`text-sm font-black ${
                        module.available
                          ? "text-cyan-300"
                          : "text-slate-600"
                      }`}
                    >
                      {module.available ? "Open →" : "Locked"}
                    </span>
                  </div>
                </>
              );

              if (module.available && module.href) {
                return (
                  <Link
                    key={module.id}
                    href={module.href}
                    className={`group rounded-3xl border p-6 transition hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-950/30 ${styles.card}`}
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <article
                  key={module.id}
                  className={`rounded-3xl border p-6 opacity-80 ${styles.card}`}
                >
                  {cardContent}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
            Project journey
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Engineering Timeline
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3 xl:grid-cols-5">
            {[
              "Project Created",
              "Pattern Upload",
              "AI Validation",
              "AI Recognition",
              "Measurements",
              "Pattern Area",
              "Marker Layout",
              "Consumption",
              "Engineering Report",
            ].map((stage, index) => {
              const stageComplete =
                index === 0 ||
                (index === 1 && projectMetrics.uploadComplete) ||
                (index === 2 && projectMetrics.uploadComplete) ||
                (index === 3 &&
                  projectMetrics.recognitionComplete);

              const stageActive =
                (index === 1 &&
                  !projectMetrics.uploadComplete) ||
                (index === 2 &&
                  projectMetrics.uploadComplete &&
                  !projectMetrics.recognitionComplete);

              return (
                <div
                  key={stage}
                  className={`rounded-2xl border p-4 ${
                    stageComplete
                      ? "border-emerald-400/30 bg-emerald-950/20"
                      : stageActive
                        ? "border-amber-400/30 bg-amber-950/20"
                        : "border-slate-700 bg-slate-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                        stageComplete
                          ? "bg-emerald-400 text-slate-950"
                          : stageActive
                            ? "bg-amber-400 text-slate-950"
                            : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </span>

                    <p className="font-bold text-slate-200">{stage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-950/20 p-6 sm:p-8">
          <h2 className="text-xl font-black text-cyan-300">
            Why does AI use a project command centre?
          </h2>

          <p className="mt-3 max-w-5xl leading-7 text-slate-300">
            A complete project keeps every pattern, engineering input,
            measurement, calculation, marker result and report connected to
            the correct customer and garment style. This prevents data from
            different styles being mixed and allows the complete engineering
            history to be reviewed later.
          </p>
        </section>
      </div>
    </main>
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
    <article className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </article>
  );
}

function ProgressMetric({
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

      <p className="mt-2 font-black text-slate-100">{value}</p>
    </article>
  );
}