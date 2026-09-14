"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        
        <Link
          href="/"
          className="text-xl font-bold tracking-wide text-cyan-300"
        >
          MBNCON
        </Link>

        <nav className="hidden flex-wrap items-center justify-end gap-x-3 gap-y-2 lg:flex">
          <Link
            href="/about-mbncon"
            className="rounded-full border border-cyan-400/20 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-cyan-400/10"
          >
            About MBNCON
          </Link>

          <div className="group relative">
            <button
              type="button"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Solutions ▾
            </button>

            <div className="invisible absolute left-0 top-full z-50 mt-2 w-48 rounded-2xl border border-white/10 bg-slate-900 py-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                href="/optifabric"
                className="block px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                OptiFabric
              </Link>

              <Link
                href="/optisewing"
                className="block px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                OptiSewing
              </Link>
            </div>
          </div>

          <Link
            href="/insights-discussion"
            className="rounded-full border border-emerald-400/20 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-emerald-400/10"
          >
            Insights & Discussion
          </Link>

          <Link
            href="/software"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Enterprise Platform
          </Link>

          <Link
            href="/software#modules"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Modules
          </Link>

          <Link
            href="/#platforms"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Our Platforms
          </Link>

          <Link
            href="/contact"
            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Contact Us
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-xl border border-white/10 px-4 py-2 text-white lg:hidden"
        >
          Menu
        </button>
      </div>

      {mobileMenu && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/about-mbncon"
              className="rounded-2xl border border-cyan-400/20 px-4 py-3 text-slate-200"
            >
              About MBNCON
            </Link>

            <Link
              href="/optifabric"
              className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200"
            >
              OptiFabric
            </Link>

            <Link
              href="/optisewing"
              className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200"
            >
              OptiSewing
            </Link>

            <Link
              href="/insights-discussion"
              className="rounded-2xl border border-emerald-400/20 px-4 py-3 text-slate-200"
            >
              Insights & Discussion
            </Link>

            <Link
              href="/software"
              className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200"
            >
              Enterprise Platform
            </Link>

            <Link
              href="/software#modules"
              className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200"
            >
              Modules
            </Link>

            <Link
              href="/#platforms"
              className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200"
            >
              Our Platforms
            </Link>

            <Link
              href="/contact"
              className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}