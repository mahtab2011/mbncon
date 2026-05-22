"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { moduleRegistry } from "@/lib/software/moduleRegistry";

export default function InternalSearch() {
  const [query, setQuery] = useState("");

  const filteredModules = useMemo(() => {
    if (!query.trim()) return [];

    const lower = query.toLowerCase();

    return moduleRegistry
      .map((module) => {
        const nameScore = module.name.toLowerCase().includes(lower) ? 10 : 0;

        const keywordScore = module.keywords.some((keyword) =>
          keyword.toLowerCase().includes(lower)
        )
          ? 5
          : 0;

        const categoryScore = module.category?.toLowerCase().includes(lower)
          ? 3
          : 0;

        const featuredBonus = module.featured ? 2 : 0;

        return {
          ...module,
          score: nameScore + keywordScore + categoryScore + featuredBonus,
        };
      })
      .filter((module) => module.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  return (
    <div className="w-full rounded-2xl border border-cyan-500/20 bg-slate-800 p-5 shadow-lg">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
            MBNCON Internal Intelligence Search
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Search Intelligence Modules
          </h2>
        </div>

        <input
          type="text"
          placeholder="Search bottleneck, risk, leadership, productivity..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-cyan-400"
        />

        {query && (
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="block rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-cyan-500/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">
                        {module.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {module.href}
                      </p>
                    </div>

                    {module.category && (
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                        {module.category}
                      </span>
                    )}
                  </div>

                  {module.description && (
                    <p className="mt-2 text-sm text-slate-300">
                      {module.description}
                    </p>
                  )}
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-200">
                No matching intelligence module found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}