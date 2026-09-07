"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface StoredOptiFabricProject {
  id: string;

  projectName?: string;
  name?: string;

  garmentType?: string;
  garmentCategory?: string;

  orderQuantity?: number;

  updatedAt?: string;
  createdAt?: string;

  aiGeometry?: {
    completed?: boolean;
    markerReadyPatterns?: number;
    patterns?: unknown[];
  };

  [key: string]: unknown;
}

interface ProjectCardModel {
  id: string;
  name: string;
  garment: string;
  orderQuantity: number | null;
  markerReadyPatterns: number;
  geometryCompleted: boolean;
  updatedAt: string | null;
}

function formatNumber(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString("en-GB");
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date);
}

function normaliseProject(
  project: StoredOptiFabricProject,
): ProjectCardModel {
  const projectName =
    project.projectName ??
    project.name ??
    project.id;

  const garment =
    project.garmentType ??
    project.garmentCategory ??
    "Garment Project";

  const orderQuantity =
    typeof project.orderQuantity === "number" &&
    Number.isFinite(project.orderQuantity)
      ? project.orderQuantity
      : null;

  const markerReadyPatterns =
    typeof project.aiGeometry?.markerReadyPatterns ===
      "number" &&
    Number.isFinite(
      project.aiGeometry.markerReadyPatterns,
    )
      ? project.aiGeometry.markerReadyPatterns
      : Array.isArray(
            project.aiGeometry?.patterns,
          )
        ? project.aiGeometry?.patterns.length ??
          0
        : 0;

  const geometryCompleted =
    project.aiGeometry?.completed === true;

  return {
    id: project.id,
    name: projectName,
    garment,
    orderQuantity,
    markerReadyPatterns,
    geometryCompleted,
    updatedAt:
      project.updatedAt ??
      project.createdAt ??
      null,
  };
}

function readSavedProjects():
  StoredOptiFabricProject[] {
  if (typeof window === "undefined") {
    return [];
  }

  const projects:
    StoredOptiFabricProject[] = [];

  for (
    let index = 0;
    index < localStorage.length;
    index += 1
  ) {
    const key =
      localStorage.key(index);

    if (
      !key ||
      !key.startsWith(
        "optifabric-project-",
      )
    ) {
      continue;
    }

    try {
      const rawValue =
        localStorage.getItem(key);

      if (!rawValue) {
        continue;
      }

      const parsed =
        JSON.parse(
          rawValue,
        ) as StoredOptiFabricProject;

      const fallbackId =
        key.replace(
          "optifabric-project-",
          "",
        );

      projects.push({
        ...parsed,
        id:
          typeof parsed.id ===
            "string" &&
          parsed.id.trim()
            ? parsed.id
            : fallbackId,
      });
    } catch (error) {
      console.warn(
        `Unable to read saved OptiFabric project: ${key}`,
        error,
      );
    }
  }

  return projects;
}

export default function OptiFabricProjectWorkspacePage() {
  const [projects, setProjects] =
    useState<
      StoredOptiFabricProject[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    setProjects(
      readSavedProjects(),
    );

    setLoading(false);
  }, []);

  const projectCards =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return projects
        .map(normaliseProject)
        .filter((project) => {
          if (!query) {
            return true;
          }

          return [
            project.name,
            project.id,
            project.garment,
          ].some((value) =>
            value
              .toLowerCase()
              .includes(query),
          );
        })
        .sort((first, second) => {
          if (
            first.geometryCompleted !==
            second.geometryCompleted
          ) {
            return first
              .geometryCompleted
              ? -1
              : 1;
          }

          return first.name.localeCompare(
            second.name,
          );
        });
    }, [
      projects,
      search,
    ]);

  const readyProjectCount =
    projectCards.filter(
      (project) =>
        project.geometryCompleted,
    ).length;

  const markerReadyPatternCount =
    projectCards.reduce(
      (total, project) =>
        total +
        project.markerReadyPatterns,
      0,
    );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-slate-800 bg-gradient-to-r from-cyan-950 via-slate-950 to-blue-950">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              OptiFabric AI
            </span>

            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
              Production Workspace
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Cutting Project Workspace
              </h1>

              <p className="mt-3 text-xl font-black text-cyan-300">
                কাটিং প্রজেক্ট ওয়ার্কস্পেস
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-300">
                Open an existing production project and continue directly
                through Geometry, Batch Engineering and AI Marker Engineering.
                Pilot and demonstration workflows are kept separate from
                production.
              </p>

              <p className="mt-3 leading-8 text-slate-400">
                Existing production project খুলে সরাসরি Geometry, Batch
                Engineering এবং AI Marker Engineering-এ কাজ চালিয়ে যান।
                Pilot ও demo workflow production কাজ থেকে আলাদা রাখা হয়েছে।
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/optifabric"
                className="rounded-xl border border-slate-600 bg-slate-900 px-5 py-3 font-black text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                ← OptiFabric Home
              </Link>

              <Link
                href="/optifabric/project/new"
                className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
              >
                + New Cutting Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Saved Projects
            </p>

            <p className="mt-3 text-3xl font-black text-white">
              {projectCards.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
              Geometry Ready
            </p>

            <p className="mt-3 text-3xl font-black text-emerald-300">
              {readyProjectCount}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/15 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
              Marker-Ready Patterns
            </p>

            <p className="mt-3 text-3xl font-black text-cyan-300">
              {markerReadyPatternCount}
            </p>
          </div>

          <div className="rounded-2xl border border-violet-500/20 bg-violet-950/15 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-400">
              Production Mode
            </p>

            <p className="mt-3 text-xl font-black text-violet-300">
              Active
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                Production Projects
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Select a Cutting Project
              </h2>
            </div>

            <div className="w-full md:max-w-sm">
              <label
                htmlFor="project-search"
                className="text-xs font-black uppercase tracking-[0.16em] text-slate-500"
              >
                Search Projects
              </label>

              <input
                id="project-search"
                value={search}
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Project name, ID or garment..."
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-6">
              <p className="font-black text-cyan-300">
                Loading saved OptiFabric projects...
              </p>
            </div>
          ) : projectCards.length ===
            0 ? (
            <div className="mt-8 rounded-3xl border border-amber-500/30 bg-amber-950/20 p-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                No Production Project Found
              </p>

              <h3 className="mt-3 text-2xl font-black">
                Create your first cutting project
              </h3>

              <p className="mt-4 max-w-3xl leading-7 text-slate-300">
                No OptiFabric project is currently stored in this browser.
                Create a project first, then complete pattern geometry before
                opening AI Marker Engineering.
              </p>

              <Link
                href="/optifabric/project/new"
                className="mt-6 inline-block rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
              >
                Create New Cutting Project →
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {projectCards.map(
                (project) => (
                  <article
                    key={project.id}
                    className="rounded-3xl border border-slate-700 bg-slate-950/60 p-6 transition hover:border-cyan-500/40"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                          Project
                        </p>

                        <h3 className="mt-2 text-2xl font-black text-white">
                          {project.name}
                        </h3>

                        <p className="mt-1 text-sm font-bold text-cyan-300">
                          {project.id}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-2 text-[10px] font-black uppercase tracking-wide ${
                          project.geometryCompleted
                            ? "border-emerald-400/30 bg-emerald-950/20 text-emerald-300"
                            : "border-amber-400/30 bg-amber-950/20 text-amber-300"
                        }`}
                      >
                        {project.geometryCompleted
                          ? "Geometry Ready"
                          : "Geometry Required"}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                          Garment
                        </p>

                        <p className="mt-2 font-black text-white">
                          {project.garment}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                          Order Quantity
                        </p>

                        <p className="mt-2 font-black text-white">
                          {project.orderQuantity !==
                          null
                            ? formatNumber(
                                project.orderQuantity,
                              )
                            : "Not saved"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                          Marker-Ready Patterns
                        </p>

                        <p className="mt-2 font-black text-white">
                          {project.markerReadyPatterns}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                          Last Updated
                        </p>

                        <p className="mt-2 text-sm font-bold text-white">
                          {formatDate(
                            project.updatedAt,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <Link
                        href={`/optifabric/project/${project.id}`}
                        className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-center text-sm font-black text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                      >
                        Project
                      </Link>

                      <Link
                        href={`/optifabric/project/${project.id}/geometry`}
                        className="rounded-xl border border-violet-400/30 bg-violet-950/20 px-4 py-3 text-center text-sm font-black text-violet-300 transition hover:border-violet-300"
                      >
                        Geometry
                      </Link>

                      <Link
                        href={`/optifabric/project/${project.id}/batch`}
                        className="rounded-xl border border-blue-400/30 bg-blue-950/20 px-4 py-3 text-center text-sm font-black text-blue-300 transition hover:border-blue-300"
                      >
                        Batch
                      </Link>

                      <Link
                        href={`/optifabric/project/${project.id}/marker`}
                        className={`rounded-xl px-4 py-3 text-center text-sm font-black transition ${
                          project.geometryCompleted
                            ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                            : "border border-slate-700 bg-slate-900 text-slate-500 hover:border-amber-400 hover:text-amber-300"
                        }`}
                      >
                        AI Marker
                      </Link>
                    </div>

                    {!project.geometryCompleted ? (
                      <p className="mt-4 text-xs leading-5 text-amber-300/80">
                        Complete Project Geometry before approving this project
                        for production Marker Engineering.
                      </p>
                    ) : null}
                  </article>
                ),
              )}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-500/20 bg-cyan-950/10 p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Cutting Master Workflow
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {[
              [
                "01",
                "Project",
                "Order and garment context",
              ],
              [
                "02",
                "Geometry",
                "Engineering-ready patterns",
              ],
              [
                "03",
                "Marker",
                "AI placement and optimisation",
              ],
              [
                "04",
                "Cutting",
                "Review and production decision",
              ],
            ].map(
              ([
                number,
                title,
                description,
              ]) => (
                <div
                  key={number}
                  className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xs font-black text-cyan-300">
                    {number}
                  </div>

                  <p className="mt-4 font-black text-white">
                    {title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {description}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-violet-500/20 bg-violet-950/10 p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
            Demo &amp; Training
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Pilot tools remain available separately
          </h2>

          <p className="mt-3 max-w-4xl leading-7 text-slate-400">
            The RC1 Mini Pilot and Engineering Wizard have not been deleted.
            They remain available from the OptiFabric homepage for training,
            demonstrations and presentations, but they are no longer part of
            the normal Cutting Master production route.
          </p>
        </section>
      </section>
    </main>
  );
}