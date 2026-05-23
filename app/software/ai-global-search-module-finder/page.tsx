"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/software/DashboardShell";
import { moduleRegistry } from "@/lib/software/moduleRegistry";

function normalise(value: string) {
  return value.toLowerCase().trim();
}

export default function AIGlobalSearchModuleFinderPage() {
  const [query, setQuery] = useState("");

  const filteredModules = useMemo(() => {
    const q = normalise(query);

    if (!q) {
      return moduleRegistry;
    }

    return moduleRegistry.filter((module) => {
      const searchableText = [
        module.name,
        module.href,
        module.category ?? "",
        module.description ?? "",
        module.riskLevel ?? "",
        ...(module.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(q);
    });
  }, [query]);

  return (
    <DashboardShell title="AI Global Search & Module Finder">
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-2xl border border-cyan-700/40 bg-slate-900 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              MBNCON · AI Global Search
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Search Any Intelligence Module
            </h1>

            <p className="mt-4 max-w-4xl text-slate-300">
              A live enterprise module finder connected to the central
              MBNCON module registry. Directors, managers, consultants,
              compliance teams, factory teams, and transformation leaders
              can quickly search and open any intelligence module.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <label className="mb-2 block text-sm text-slate-300">
              Search by module, department, risk, KPI, AI, report, decision or user role
            </label>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: predictive, governance, analytics, agri price, buyer, quality..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-cyan-400"
            />

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {[
                "predictive",
                "governance",
                "analytics",
                "agri price",
                "production",
                "quality",
                "buyer",
                "audit",
                "supplier",
                "utility",
                "report",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <a
              href="#modules-found"
              className="block rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <p className="text-sm text-cyan-300">Modules Found</p>
              <h2 className="mt-3 text-5xl font-bold">
                {filteredModules.length}
              </h2>
            </a>

            <a
              href="#search-mode"
              className="block rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/10 p-5 transition hover:-translate-y-1 hover:border-fuchsia-400/40"
            >
              <p className="text-sm text-fuchsia-300">Search Mode</p>
              <h2 className="mt-4 text-3xl font-bold">
                {query ? "Filtered" : "All"}
              </h2>
            </a>

            <a
              href="#navigation-status"
              className="block rounded-2xl border border-green-700/40 bg-green-950/10 p-5 transition hover:-translate-y-1 hover:border-green-400/40"
            >
              <p className="text-sm text-green-300">Registry Status</p>
              <h2 className="mt-4 text-3xl font-bold">Connected</h2>
            </a>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredModules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="block rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-slate-900/80"
              >
                <p className="text-xs uppercase tracking-widest text-cyan-300">
                  {module.category ?? "MBNCON Intelligence Module"}
                </p>

                <h3 className="mt-3 text-xl font-bold">{module.name}</h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {module.description ??
                    "Enterprise intelligence module connected to the MBNCON software platform."}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(module.keywords ?? []).slice(0, 4).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <p className="text-xs text-slate-500">Risk Level</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {module.riskLevel ?? "standard"}
                  </p>
                </div>
              </Link>
            ))}
          </section>

          <section className="space-y-5">
            <section
              id="modules-found"
              className="scroll-mt-28 rounded-2xl border border-cyan-700/40 bg-cyan-950/10 p-6"
            >
              <h2 className="text-2xl font-bold text-cyan-300">
                Modules Found
              </h2>

              <p className="mt-3 text-slate-300">
                The finder is currently showing {filteredModules.length} module
                result(s) from the central module registry.
              </p>
            </section>

            <section
              id="search-mode"
              className="scroll-mt-28 rounded-2xl border border-fuchsia-700/40 bg-fuchsia-950/10 p-6"
            >
              <h2 className="text-2xl font-bold text-fuchsia-300">
                Search Mode
              </h2>

              <p className="mt-3 text-slate-300">
                Current mode:{" "}
                {query ? "Filtered search result view" : "All modules view"}.
              </p>
            </section>

            <section
              id="navigation-status"
              className="scroll-mt-28 rounded-2xl border border-green-700/40 bg-green-950/10 p-6"
            >
              <h2 className="text-2xl font-bold text-green-300">
                Navigation Status
              </h2>

              <p className="mt-3 text-slate-300">
                Module navigation is connected to the central module registry.
                Each card links directly to the relevant intelligence module.
              </p>
            </section>
          </section>

          {filteredModules.length === 0 && (
            <section className="rounded-2xl border border-amber-700/40 bg-amber-950/10 p-6">
              <h2 className="text-2xl font-bold text-amber-300">
                No module found
              </h2>

              <p className="mt-3 text-slate-300">
                Try searching by terms like predictive, governance, analytics,
                agri price, production, quality, buyer, supplier, audit, utility,
                report, leadership, risk, or AI.
              </p>
            </section>
          )}
        </div>
      </main>
    </DashboardShell>
  );
}