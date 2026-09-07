"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  startDatasetWorkflow,
} from "@/lib/optifabric/workflow";

type LaunchStatus =
  | "preparing"
  | "success"
  | "error";

export default function GlobalDemoWorkflowStartPage() {
  const router = useRouter();

  const [status, setStatus] =
    useState<LaunchStatus>("preparing");

  const [message, setMessage] = useState(
    "Preparing EDS-001 engineering workflow..."
  );

  useEffect(() => {
    try {
      const workflow =
        startDatasetWorkflow("EDS-001");

      setStatus("success");

      setMessage(
        `${workflow.datasetCode} has been loaded successfully.`
      );

      const redirectTimer = window.setTimeout(() => {
        router.replace(
          "/optifabric/engineering-wizard"
        );
      }, 900);

      return () => {
        window.clearTimeout(redirectTimer);
      };
    } catch (error) {
      setStatus("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "The engineering workflow could not be started."
      );
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl shadow-cyan-950/20 sm:p-12">
        <div
          className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-4xl ${
            status === "error"
              ? "bg-red-400/10"
              : status === "success"
                ? "bg-emerald-400/10"
                : "bg-cyan-400/10"
          }`}
        >
          {status === "error"
            ? "!"
            : status === "success"
              ? "✓"
              : "AI"}
        </div>

        <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
          OptiFabric AI Global Demo 001
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-4xl">
          {status === "error"
            ? "Workflow initialization failed"
            : status === "success"
              ? "Engineering workflow ready"
              : "Preparing engineering workflow"}
        </h1>

        <p className="mt-5 leading-relaxed text-slate-300">
          {message}
        </p>

        {status === "preparing" && (
          <div className="mx-auto mt-8 h-2 max-w-md overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-cyan-400" />
          </div>
        )}

        {status === "success" && (
          <p className="mt-6 text-sm text-emerald-300">
            Opening the OptiFabric engineering wizard...
          </p>
        )}

        {status === "error" && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/optifabric/global-demo"
              className="rounded-xl border border-slate-600 bg-slate-950 px-5 py-3 font-bold text-slate-200 transition hover:border-slate-400"
            >
              Return to Global Demo
            </Link>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Try Again
            </button>
          </div>
        )}
      </section>
    </main>
  );
}