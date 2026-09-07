"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  archiveProject,
  getProjectRegistry,
  getProjectRegistryStatistics,
  migrateExistingProjectsToRegistry,
  permanentlyDeleteProject,
  restoreProject,
  searchProjectRegistry,
  type ProjectRegistryEntry,
  type ProjectRegistryStatus,
} from "@/lib/optifabric/projectRegistry";

type RegistryView = "active" | "archived" | "all";

const statusOptions: Array<{
  value: ProjectRegistryStatus | "all";
  label: string;
}> = [
  {
    value: "all",
    label: "All stages",
  },
  {
    value: "draft",
    label: "Project Created",
  },
  {
    value: "pattern-upload",
    label: "Pattern Upload",
  },
  {
    value: "pattern-validation",
    label: "Pattern Validation",
  },
  {
    value: "pattern-recognition",
    label: "AI Pattern Recognition",
  },
  {
    value: "geometry",
    label: "Pattern Geometry",
  },
  {
    value: "marker-planning",
    label: "Marker Planning",
  },
  {
    value: "fabric-consumption",
    label: "Fabric Consumption",
  },
  {
    value: "report-ready",
    label: "Engineering Report Ready",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "archived",
    label: "Archived",
  },
];

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusClasses(
  status: ProjectRegistryStatus
) {
  const classes: Record<
    ProjectRegistryStatus,
    string
  > = {
    draft:
      "border-slate-500/40 bg-slate-500/10 text-slate-300",

    "pattern-upload":
      "border-cyan-400/40 bg-cyan-500/10 text-cyan-300",

    "pattern-validation":
      "border-blue-400/40 bg-blue-500/10 text-blue-300",

    "pattern-recognition":
      "border-violet-400/40 bg-violet-500/10 text-violet-300",

    geometry:
      "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-300",

    "marker-planning":
      "border-amber-400/40 bg-amber-500/10 text-amber-300",

    "fabric-consumption":
      "border-orange-400/40 bg-orange-500/10 text-orange-300",

    "report-ready":
      "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",

    completed:
      "border-green-400/40 bg-green-500/10 text-green-300",

    archived:
      "border-red-400/40 bg-red-500/10 text-red-300",
  };

  return classes[status];
}

export default function EngineeringProjectCentrePage() {
  const router = useRouter();

  const [registry, setRegistry] = useState<
    ProjectRegistryEntry[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ProjectRegistryStatus | "all">(
      "all"
    );

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  const [garmentFilter, setGarmentFilter] =
    useState("all");

  const [createdFrom, setCreatedFrom] =
    useState("");

  const [createdTo, setCreatedTo] =
    useState("");

  const [registryView, setRegistryView] =
    useState<RegistryView>("active");

  function refreshRegistry() {
    setRegistry(getProjectRegistry());
  }

  useEffect(() => {
    try {
      const migratedProjects =
        migrateExistingProjectsToRegistry();

      refreshRegistry();

      if (migratedProjects.length > 0) {
        setMessage(
          `${migratedProjects.length} existing engineering project${
            migratedProjects.length === 1
              ? ""
              : "s"
          } added to the Project Registry.`
        );
      }
    } catch (error) {
      console.error(
        "Unable to initialise the Project Registry:",
        error
      );

      setMessage(
        "The Project Registry could not be initialised."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const statistics = useMemo(() => {
    return getProjectRegistryStatistics();
  }, [registry]);

  const mainCategories = useMemo(() => {
    return Array.from(
      new Set(
        registry
          .map((entry) =>
            entry.mainCategory.trim()
          )
          .filter(Boolean)
      )
    ).sort((first, second) =>
      first.localeCompare(second)
    );
  }, [registry]);

  const garmentTypes = useMemo(() => {
    return Array.from(
      new Set(
        registry
          .map((entry) =>
            entry.garmentType.trim()
          )
          .filter(Boolean)
      )
    ).sort((first, second) =>
      first.localeCompare(second)
    );
  }, [registry]);

  const visibleProjects = useMemo(() => {
    const archivedFilter =
      registryView === "active"
        ? false
        : registryView === "archived"
          ? true
          : "all";

    return searchProjectRegistry({
      query,
      status: statusFilter,
      mainCategory: categoryFilter,
      garmentType: garmentFilter,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      archived: archivedFilter,
    });
  }, [
    registry,
    query,
    statusFilter,
    categoryFilter,
    garmentFilter,
    createdFrom,
    createdTo,
    registryView,
  ]);

  const filtersActive =
    query.trim().length > 0 ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    garmentFilter !== "all" ||
    createdFrom.length > 0 ||
    createdTo.length > 0;

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setGarmentFilter("all");
    setCreatedFrom("");
    setCreatedTo("");
  }

  async function copyProjectReference(
    entry: ProjectRegistryEntry
  ) {
    const reference = [
      `Project Code: ${entry.projectCode}`,
      `Project ID: ${entry.projectId}`,
      `Style Number: ${entry.styleNumber}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(
        reference
      );

      setMessage(
        `${entry.projectCode} reference copied.`
      );
    } catch (error) {
      console.error(
        "Unable to copy project reference:",
        error
      );

      setMessage(
        "The project reference could not be copied."
      );
    }
  }

  function openProject(
    entry: ProjectRegistryEntry
  ) {
    router.push(
      `/optifabric/project/${entry.projectId}`
    );
  }

  function handleArchiveProject(
    entry: ProjectRegistryEntry
  ) {
    const confirmed = window.confirm(
      `Archive ${entry.projectCode} — ${entry.projectName}?\n\nThe project will remain saved and can be restored later.`
    );

    if (!confirmed) {
      return;
    }

    archiveProject(entry.projectId);
    refreshRegistry();

    setMessage(
      `${entry.projectCode} was archived.`
    );
  }

  function handleRestoreProject(
    entry: ProjectRegistryEntry
  ) {
    const restoredEntry = restoreProject(
      entry.projectId
    );

    if (!restoredEntry) {
      setMessage(
        `The saved project data for ${entry.projectCode} could not be found.`
      );

      return;
    }

    refreshRegistry();

    setMessage(
      `${entry.projectCode} was restored.`
    );
  }

  function handleDeleteProject(
    entry: ProjectRegistryEntry
  ) {
    const confirmed = window.confirm(
      `Permanently delete ${entry.projectCode} — ${entry.projectName}?\n\nThis will remove the complete engineering project and cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const secondConfirmation =
      window.confirm(
        `Final confirmation:\n\nDelete project ${entry.projectCode} permanently?`
      );

    if (!secondConfirmation) {
      return;
    }

    permanentlyDeleteProject(entry.projectId);
    refreshRegistry();

    setMessage(
      `${entry.projectCode} was permanently deleted.`
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-900 px-10 py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-5 text-lg font-black">
            Loading Engineering Projects...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 p-7 shadow-2xl shadow-cyan-950/30 sm:p-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                OptiFabric AI · Central Registry
              </p>

              <h1 className="mt-3 max-w-5xl text-4xl font-black sm:text-5xl">
                Engineering Project Management
                Centre
              </h1>

              <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
                Search, retrieve and continue every
                OptiFabric engineering project from
                creation through pattern recognition,
                geometry, marker planning and reporting.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/optifabric"
                className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 font-black text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200"
              >
                ← OptiFabric Home
              </Link>

              <Link
                href="/optifabric/project/new"
                className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
              >
                + Create New Project
              </Link>
            </div>
          </div>
        </header>

        {message ? (
          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-cyan-400/30 bg-cyan-950/30 px-5 py-4 font-bold text-cyan-100 sm:flex-row sm:items-center sm:justify-between">
            <p>{message}</p>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="self-start rounded-lg border border-cyan-400/30 px-3 py-1 text-sm font-black transition hover:bg-cyan-900/40 sm:self-auto"
            >
              Dismiss
            </button>
          </section>
        ) : null}

        <section className="mt-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
              Executive overview
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Project Registry Dashboard
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            <DashboardMetric
              label="Total Projects"
              value={statistics.totalProjects}
              description="All saved projects"
            />

            <DashboardMetric
              label="Active"
              value={statistics.activeProjects}
              description="Current engineering work"
            />

            <DashboardMetric
              label="Created Today"
              value={statistics.projectsToday}
              description="New projects today"
            />

            <DashboardMetric
              label="This Month"
              value={statistics.projectsThisMonth}
              description="Monthly project volume"
            />

            <DashboardMetric
              label="Geometry"
              value={statistics.geometry}
              description="Geometry-stage projects"
            />

            <DashboardMetric
              label="Completed"
              value={statistics.completed}
              description="Report-ready or complete"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StageMetric
              label="Project Created"
              value={statistics.drafts}
            />

            <StageMetric
              label="Pattern Upload"
              value={statistics.patternUpload}
            />

            <StageMetric
              label="AI Recognition"
              value={statistics.recognition}
            />

            <StageMetric
              label="Marker Planning"
              value={statistics.markerPlanning}
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Project retrieval
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Search and Filter Projects
              </h2>

              <p className="mt-3 max-w-4xl leading-7 text-slate-400">
                Search by project code, project ID,
                customer, factory, style, buyer,
                category, garment type or engineering
                stage.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Visible results
              </p>

              <p className="mt-1 text-3xl font-black text-cyan-300">
                {visibleProjects.length}
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 xl:grid-cols-4">
            <label className="xl:col-span-2">
              <span className="text-sm font-black text-slate-300">
                Search project registry
              </span>

              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Project code, ID, factory, style or garment"
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-300">
                Engineering stage
              </span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | ProjectRegistryStatus
                      | "all"
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-black text-slate-300">
                Main category
              </span>

              <select
                value={categoryFilter}
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option value="all">
                  All categories
                </option>

                {mainCategories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <label>
              <span className="text-sm font-black text-slate-300">
                Garment type
              </span>

              <select
                value={garmentFilter}
                onChange={(event) =>
                  setGarmentFilter(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option value="all">
                  All garments
                </option>

                {garmentTypes.map((garment) => (
                  <option
                    key={garment}
                    value={garment}
                  >
                    {garment}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="text-sm font-black text-slate-300">
                Created from
              </span>

              <input
                type="date"
                value={createdFrom}
                onChange={(event) =>
                  setCreatedFrom(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </label>

            <label>
              <span className="text-sm font-black text-slate-300">
                Created to
              </span>

              <input
                type="date"
                value={createdTo}
                onChange={(event) =>
                  setCreatedTo(
                    event.target.value
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!filtersActive}
                className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 font-black text-slate-200 transition enabled:hover:border-cyan-400/40 enabled:hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-300">
                Engineering project database
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Saved Projects
              </h2>
            </div>

            <div className="inline-flex flex-wrap rounded-2xl border border-slate-700 bg-slate-900 p-1">
              <ViewButton
                label="Active"
                active={
                  registryView === "active"
                }
                onClick={() =>
                  setRegistryView("active")
                }
              />

              <ViewButton
                label="Archived"
                active={
                  registryView === "archived"
                }
                onClick={() =>
                  setRegistryView("archived")
                }
              />

              <ViewButton
                label="All"
                active={registryView === "all"}
                onClick={() =>
                  setRegistryView("all")
                }
              />
            </div>
          </div>

          {visibleProjects.length === 0 ? (
            <section className="mt-7 rounded-3xl border border-dashed border-slate-600 bg-slate-900 px-6 py-16 text-center">
              <p className="text-6xl">📂</p>

              <h3 className="mt-5 text-3xl font-black">
                No projects found
              </h3>

              <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-400">
                No saved engineering projects match
                the current search, filters and
                project view.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                {filtersActive ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-950/30 px-6 py-3 font-black text-cyan-200 transition hover:bg-cyan-900/40"
                  >
                    Clear Search Filters
                  </button>
                ) : null}

                <Link
                  href="/optifabric/project/new"
                  className="rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
                >
                  Create New Project
                </Link>
              </div>
            </section>
          ) : (
            <div className="mt-7 grid gap-6 xl:grid-cols-2">
              {visibleProjects.map((entry) => (
                <ProjectCard
                  key={entry.projectId}
                  entry={entry}
                  onOpen={() =>
                    openProject(entry)
                  }
                  onCopy={() =>
                    copyProjectReference(entry)
                  }
                  onArchive={() =>
                    handleArchiveProject(entry)
                  }
                  onRestore={() =>
                    handleRestoreProject(entry)
                  }
                  onDelete={() =>
                    handleDeleteProject(entry)
                  }
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 to-blue-950 p-6 sm:p-8">
          <h2 className="text-xl font-black text-cyan-300">
            Why does OptiFabric maintain a Project
            Registry?
          </h2>

          <p className="mt-3 max-w-6xl leading-7 text-slate-300">
            Garment engineering work continues across
            multiple stages, operators and working
            sessions. A central registry prevents
            projects from being lost, provides
            traceability and allows cutting-room teams
            to retrieve the correct style using a
            project code, customer, style number,
            product type or date.
          </p>
        </section>
      </div>
    </main>
  );
}

function DashboardMetric({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black text-cyan-300">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>
    </article>
  );
}

function StageMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <article className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4">
      <p className="font-black text-slate-300">
        {label}
      </p>

      <p className="text-2xl font-black text-white">
        {value}
      </p>
    </article>
  );
}

function ViewButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-5 py-2 font-black transition ${
        active
          ? "bg-cyan-400 text-slate-950"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function ProjectCard({
  entry,
  onOpen,
  onCopy,
  onArchive,
  onRestore,
  onDelete,
}: {
  entry: ProjectRegistryEntry;
  onOpen: () => void;
  onCopy: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-xl shadow-slate-950/30">
      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
              {entry.projectCode}
            </p>

            <h3 className="mt-2 text-2xl font-black">
              {entry.projectName}
            </h3>

            <p className="mt-2 font-bold text-slate-400">
              {entry.customerFactory}
            </p>
          </div>

          <span
            className={`self-start rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${getStatusClasses(
              entry.status
            )}`}
          >
            {entry.currentStage}
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectDetail
            label="Style Number"
            value={entry.styleNumber}
          />

          <ProjectDetail
            label="Garment"
            value={entry.garmentType}
          />

          <ProjectDetail
            label="Category"
            value={`${entry.mainCategory} · ${entry.subcategory}`}
          />

          <ProjectDetail
            label="Order Quantity"
            value={
              entry.orderQuantity
                ? `${entry.orderQuantity.toLocaleString(
                    "en-GB"
                  )} pieces`
                : "Not specified"
            }
          />

          <ProjectDetail
            label="Created"
            value={formatDate(entry.createdAt)}
          />

          <ProjectDetail
            label="Last Updated"
            value={formatDate(entry.updatedAt)}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950 p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Engineering progress
              </p>

              <p className="mt-2 font-bold text-slate-300">
                {
                  entry.progress.uploadedPatterns
                }
                /{entry.progress.totalPatterns} pattern
                files uploaded
              </p>
            </div>

            <p className="text-4xl font-black text-cyan-300">
              {
                entry.progress
                  .completionPercentage
              }
              %
            </p>
          </div>

          <div className="mt-4 h-4 overflow-hidden rounded-full border border-slate-700 bg-slate-900">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
              style={{
                width: `${entry.progress.completionPercentage}%`,
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniMetric
              label="Uploaded"
              value={entry.progress.uploadedPatterns}
            />

            <MiniMetric
              label="Recognised"
              value={
                entry.progress.recognisedPatterns
              }
            />

            <MiniMetric
              label="Geometry"
              value={entry.progress.geometryPatterns}
            />

            <MiniMetric
              label="Marker Ready"
              value={
                entry.progress.markerReadyPatterns
              }
            />
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            Internal Project ID
          </p>

          <p className="mt-1 break-all font-mono text-sm text-slate-300">
            {entry.projectId}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-700 bg-slate-950/60 p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {!entry.archived ? (
            <button
              type="button"
              onClick={onOpen}
              className="rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Continue Project
            </button>
          ) : (
            <button
              type="button"
              onClick={onRestore}
              className="rounded-xl bg-emerald-500 px-4 py-3 font-black text-slate-950 transition hover:bg-emerald-400"
            >
              Restore Project
            </button>
          )}

          <button
            type="button"
            onClick={onCopy}
            className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 font-black text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200"
          >
            Copy Reference
          </button>

          {!entry.archived ? (
            <button
              type="button"
              onClick={onArchive}
              className="rounded-xl border border-amber-400/30 bg-amber-950/20 px-4 py-3 font-black text-amber-300 transition hover:bg-amber-950/40"
            >
              Archive
            </button>
          ) : (
            <div className="hidden xl:block" />
          )}

          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl border border-red-400/30 bg-red-950/20 px-4 py-3 font-black text-red-300 transition hover:bg-red-950/40"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </article>
  );
}

function ProjectDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-black text-slate-200">
        {value}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-center">
      <p className="text-xs font-bold text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}