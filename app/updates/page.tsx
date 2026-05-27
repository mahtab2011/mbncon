"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const updates = [
  {
    date: "2026-05-28",
    category: "AI Transformation",
    title: "Updates Coming Soon",
    content:
      "Our first update will be published soon. Each update will be kept concise for easier reading. Longer articles may be published in separate parts.",
  },
];

export default function UpdatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All");

  const availableDates = ["All", ...updates.map((item) => item.date)];

  const filteredUpdates = useMemo(() => {
    return updates.filter((item) => {
      const matchesDate = dateFilter === "All" || item.date === dateFilter;

      const keyword = searchTerm.toLowerCase();

      const matchesKeyword =
        item.title.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword) ||
        item.date.toLowerCase().includes(keyword);

      return matchesDate && matchesKeyword;
    });
  }, [searchTerm, dateFilter]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          ← Back to Home
        </Link>

        <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-slate-900 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            MBNCON Updates
          </p>

          <h1 className="mt-5 text-4xl font-bold md:text-6xl">
            Enterprise Intelligence & AI Transformation Updates
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Short updates, articles and operational insights from MBNCON.
          </p>
        </div>

        <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
          <input
            type="text"
            placeholder="Search by keyword, title, category or date..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <select
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
          >
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date === "All" ? "All Dates" : date}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-8 space-y-6">
          {filteredUpdates.map((item) => (
            <article
              key={`${item.date}-${item.title}`}
              className="rounded-3xl border border-white/10 bg-slate-900 p-8"
            >
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-cyan-400 px-4 py-1 font-semibold text-slate-950">
                  {item.date}
                </span>

                <span className="rounded-full border border-white/20 px-4 py-1 text-slate-300">
                  {item.category}
                </span>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-white">
                {item.title}
              </h2>

              <p className="mt-4 max-w-4xl leading-8 text-slate-300">
                {item.content}
              </p>
            </article>
          ))}

          {filteredUpdates.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 text-slate-300">
              No updates matched your search.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}