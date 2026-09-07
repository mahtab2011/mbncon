"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  GeometrySourceProject,
  ProjectGeometryAdapterSummary,
  ProjectGeometryDataset,
} from "@/lib/optifabric/geometry/geometryProjectAdapter";

import {
  getProjectGeometryAdapterSummary,
  initialiseProjectGeometry,
  testProjectGeometryCount,
} from "@/lib/optifabric/geometry/geometryProjectAdapter";

/**
 * OptiFabric AI Geometry Adapter Test Page
 *
 * This page:
 *
 * 1. Loads the existing OptiFabric engineering project.
 * 2. Reads all uploaded project patterns.
 * 3. Creates one geometry record for every uploaded pattern.
 * 4. Saves the geometry dataset in localStorage.
 * 5. Displays the result for engineering review.
 */

interface GeometryCountTestResult {
  passed: boolean;
  expectedCount: number;
  actualCount: number;
  message: string;
}

function formatDateTime(
  value?: string
): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

function formatGeometryStatus(
  status: string
): string {
  return status
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

function getStatusClasses(
  status: string
): string {
  switch (status) {
    case "validated":
      return "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";

    case "image-ready":
      return "border-cyan-400/40 bg-cyan-500/10 text-cyan-200";

    case "calibrated":
      return "border-blue-400/40 bg-blue-500/10 text-blue-200";

    case "traced":
      return "border-violet-400/40 bg-violet-500/10 text-violet-200";

    case "warning":
      return "border-amber-400/40 bg-amber-500/10 text-amber-200";

    case "failed":
      return "border-red-400/40 bg-red-500/10 text-red-200";

    default:
      return "border-slate-600 bg-slate-800 text-slate-300";
  }
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number | string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </article>
  );
}

export default function GeometryTestPage() {
  const params =
    useParams<{
      projectId: string;
    }>();

  const projectId =
    params.projectId;

  const [
    project,
    setProject,
  ] =
    useState<GeometrySourceProject | null>(
      null
    );

  const [
    dataset,
    setDataset,
  ] =
    useState<ProjectGeometryDataset | null>(
      null
    );

  const [
    summary,
    setSummary,
  ] =
    useState<ProjectGeometryAdapterSummary | null>(
      null
    );

  const [
    testResult,
    setTestResult,
  ] =
    useState<GeometryCountTestResult | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    loadError,
    setLoadError,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  const projectStorageKey =
    `optifabric-project-${projectId}`;

  function runGeometryInitialisation(
    loadedProject: GeometrySourceProject
  ) {
    const uploadedPatternCount =
      loadedProject.patterns.filter(
        (pattern) =>
          pattern.uploaded === true
      ).length;

    const createdDataset =
      initialiseProjectGeometry({
        project: loadedProject,

        /**
         * Browser preview URLs currently exist only during the upload-page
         * session. They are not permanently retained after page reload.
         *
         * File names and pattern engineering data are still carried into
         * the geometry records.
         */
        previews: {},

        selection: "uploaded-only",
      });

    const createdSummary =
      getProjectGeometryAdapterSummary(
        loadedProject,
        createdDataset
      );

    const createdTestResult =
      testProjectGeometryCount(
        createdDataset,
        uploadedPatternCount
      );

    setDataset(createdDataset);
    setSummary(createdSummary);
    setTestResult(createdTestResult);

    setMessage(
      createdTestResult.passed
        ? `${createdTestResult.actualCount} uploaded pattern records were successfully converted into geometry objects.`
        : createdTestResult.message
    );
  }

  useEffect(() => {
    if (!projectId) {
      return;
    }

    try {
      setLoading(true);
      setLoadError("");

      const storedProject =
        window.localStorage.getItem(
          projectStorageKey
        );

      if (!storedProject) {
        setLoadError(
          "The engineering project could not be found in browser storage."
        );

        setLoading(false);

        return;
      }

      const parsedProject =
        JSON.parse(
          storedProject
        ) as GeometrySourceProject;

      if (
        !parsedProject ||
        parsedProject.id !== projectId ||
        !Array.isArray(
          parsedProject.patterns
        )
      ) {
        setLoadError(
          "The stored project record is incomplete or invalid."
        );

        setLoading(false);

        return;
      }

      setProject(parsedProject);

      runGeometryInitialisation(
        parsedProject
      );

      setLoading(false);
    } catch (error) {
      console.error(
        "Unable to initialise project geometry:",
        error
      );

      setLoadError(
        "OptiFabric could not read or process the stored engineering project."
      );

      setLoading(false);
    }
  }, [
    projectId,
    projectStorageKey,
  ]);

  const uploadedPatterns =
    useMemo(() => {
      if (!project) {
        return [];
      }

      return project.patterns.filter(
        (pattern) =>
          pattern.uploaded === true
      );
    }, [project]);

  const expectedPatternCount =
    uploadedPatterns.length;

  const actualGeometryCount =
    dataset?.geometries.length ?? 0;

  const geometryTestPassed =
    testResult?.passed === true;

  function refreshGeometryDataset() {
    if (!project) {
      return;
    }

    runGeometryInitialisation(project);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-10">
            <p className="text-lg text-slate-300">
              Loading the OptiFabric geometry test…
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (
    loadError ||
    !project
  ) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-3xl border border-red-500/40 bg-red-950/20 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">
              Geometry Test Error
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Project could not be loaded
            </h1>

            <p className="mt-4 leading-7 text-red-100">
              {loadError}
            </p>

            <Link
              href="/optifabric/projects"
              className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-slate-200"
            >
              Return to Projects
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950 p-6 shadow-2xl shadow-cyan-950/30 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">
                RC4 AI Pattern Geometry
              </p>

              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
                Geometry Project Adapter Test
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                OptiFabric is converting every uploaded
                pattern record into an engineering geometry
                object ready for calibration, tracing,
                measurement and marker planning.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={
                  refreshGeometryDataset
                }
                className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
              >
                Refresh Geometry
              </button>

              <Link
                href={`/optifabric/projects/${projectId}/pattern-upload`}
                className="rounded-xl border border-slate-600 bg-slate-900/70 px-5 py-3 font-bold text-white transition hover:border-slate-400"
              >
                Pattern Upload
              </Link>
            </div>
          </div>
        </section>
<section className="mt-8 rounded-3xl border border-cyan-400/30 bg-cyan-950/20 p-6">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
        Project Reference
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        Project ID
      </h2>

      <p className="mt-3 break-all rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 font-mono text-sm text-cyan-200">
        {projectId}
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Use this unique ID when opening the project, reporting a technical issue,
        or sharing the project with the cutting master and engineering team.
      </p>
    </div>

    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(projectId);

          setMessage(
            `Project ID copied: ${projectId}`
          );
        } catch (error) {
          console.error(
            "Unable to copy project ID:",
            error
          );

          setMessage(
            "Project ID could not be copied automatically."
          );
        }
      }}
      className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
    >
      Copy Project ID
    </button>
  </div>
</section>
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
  <SummaryCard
    label="Project ID"
    value={projectId}
    description="Unique project reference used by the cutting master and engineering team."
  />

  <SummaryCard
    label="Project Patterns"
    value={project.patterns.length}
    description="All standard and custom pattern records inside this project."
  />

  <SummaryCard
    label="Uploaded Patterns"
    value={expectedPatternCount}
    description="Patterns selected for geometry-object creation."
  />

  <SummaryCard
    label="Geometry Objects"
    value={actualGeometryCount}
    description="Engineering digital twins created by the adapter."
  />

  <SummaryCard
    label="Marker Ready"
    value={summary?.markerReady ?? 0}
    description="Patterns fully calibrated, traced and validated."
  />
</section>

        <section
          className={`mt-8 rounded-3xl border p-7 ${
            geometryTestPassed
              ? "border-emerald-400/40 bg-emerald-950/25"
              : "border-red-400/40 bg-red-950/25"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p
                className={`text-sm font-black uppercase tracking-[0.2em] ${
                  geometryTestPassed
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                Adapter Count Test
              </p>

              <h2 className="mt-3 text-3xl font-black">
                {geometryTestPassed
                  ? "TEST PASSED"
                  : "TEST REQUIRES ATTENTION"}
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-300">
                {message}
              </p>
            </div>

            <div className="grid min-w-[280px] grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-center">
                <p className="text-sm text-slate-400">
                  Expected
                </p>

                <p className="mt-2 text-3xl font-black">
                  {expectedPatternCount}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-center">
                <p className="text-sm text-slate-400">
                  Created
                </p>

                <p className="mt-2 text-3xl font-black">
                  {actualGeometryCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        {summary && (
          <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                Geometry Readiness
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Project Engineering Status
              </h2>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label="Not Started"
                value={
                  summary.geometryNotStarted
                }
                description="No retained image or geometry processing yet."
              />

              <SummaryCard
                label="Image Ready"
                value={
                  summary.geometryImageReady
                }
                description="A source image reference is available."
              />

              <SummaryCard
                label="Validated"
                value={
                  summary.geometryValidated
                }
                description="Geometry passed the engineering validation engine."
              />

              <SummaryCard
                label="Readiness"
                value={`${summary.readinessPercentage}%`}
                description="Percentage currently approved for marker planning."
              />
            </div>

            <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{
                  width: `${summary.readinessPercentage}%`,
                }}
              />
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
                Engineering Digital Twins
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Pattern Geometry Records
              </h2>
            </div>

            <p className="text-sm text-slate-400">
              Dataset updated:{" "}
              {formatDateTime(
                dataset?.updatedAt
              )}
            </p>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-950/80">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                      Sequence
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                      Pattern
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                      File
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                      Cut Quantity
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                      Fold
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                      Geometry Status
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-400">
                      Marker Ready
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {dataset?.geometries.map(
                    (
                      geometry,
                      index
                    ) => (
                      <tr
                        key={
                          geometry.patternId
                        }
                        className="transition hover:bg-slate-800/50"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-slate-400">
                          {index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-white">
                            {
                              geometry.patternName
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            ID:{" "}
                            {
                              geometry.patternId
                            }
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {geometry.sourceFileName ??
                            "No filename retained"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-bold">
                          {
                            geometry.cutQuantity
                          }
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm">
                          {geometry.cutOnFold
                            ? "Cut on fold"
                            : "Not on fold"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusClasses(
                              geometry.status
                            )}`}
                          >
                            {formatGeometryStatus(
                              geometry.status
                            )}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                              geometry.markerReady
                                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                                : "border-slate-600 bg-slate-800 text-slate-300"
                            }`}
                          >
                            {geometry.markerReady
                              ? "Ready"
                              : "Pending"}
                          </span>
                        </td>
                      </tr>
                    )
                  )}

                  {actualGeometryCount ===
                    0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        No uploaded patterns
                        were available for
                        geometry creation.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-amber-400/30 bg-amber-950/20 p-6">
          <h2 className="text-xl font-black text-amber-200">
            Why are all patterns not marker-ready yet?
          </h2>

          <p className="mt-3 max-w-5xl leading-7 text-amber-100/80">
            File 005 only proves that the uploaded pattern
            records have entered the geometry system. Each
            pattern must still pass scale calibration,
            boundary tracing, real-size measurement,
            grain-line confirmation and geometry validation
            before OptiFabric allows it to enter the marker
            optimisation engine.
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/optifabric/projects/${projectId}`}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-bold transition hover:border-slate-500"
          >
            Project Command Centre
          </Link>

          <Link
            href={`/optifabric/projects/${projectId}/pattern-upload`}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-bold transition hover:border-slate-500"
          >
            Return to Pattern Upload
          </Link>
        </div>
      </div>
    </main>
  );
}