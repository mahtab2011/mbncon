"use client";

import { useState } from "react";
import {
  analyzeStripeMatching,
  StripeDirection,
} from "../../../lib/optifabric/stripeMatchingEngine";

export default function StripeMatchingPage() {
  const [fabricType, setFabricType] = useState("woven");
  const [stripeDirection, setStripeDirection] =
    useState<StripeDirection>("vertical");
  const [stripeRepeatInches, setStripeRepeatInches] = useState(2);
  const [patternPieceName, setPatternPieceName] = useState("Front Panel");
  const [requiresMatching, setRequiresMatching] = useState(true);
  const [matchingPriority, setMatchingPriority] =
    useState<"low" | "medium" | "high">("high");

  const result = analyzeStripeMatching({
    fabricType,
    stripeDirection,
    stripeRepeatInches,
    patternPieceName,
    requiresMatching,
    matchingPriority,
  });

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">
          OptiFabric AI — Stripe / Check Matching
        </h1>

        <p className="mt-3 text-slate-300">
          This module helps the cutting master decide whether stripe, check, or
          print alignment is required before marker planning.
        </p>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-900 p-5 shadow">
            <h2 className="text-xl font-semibold">Factory Input</h2>

            <label className="mt-4 block text-sm text-slate-300">
              Fabric Type
            </label>
            <select
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              value={fabricType}
              onChange={(e) => setFabricType(e.target.value)}
            >
              <option value="woven">Woven</option>
              <option value="knit">Knit</option>
              <option value="denim">Denim</option>
              <option value="canvas">Canvas / Tarpaulin</option>
              <option value="traditional">Traditional Garment</option>
            </select>

            <label className="mt-4 block text-sm text-slate-300">
              Stripe / Check Direction
            </label>
            <select
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              value={stripeDirection}
              onChange={(e) =>
                setStripeDirection(e.target.value as StripeDirection)
              }
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
              <option value="diagonal">Diagonal</option>
              <option value="none">None</option>
              <option value="unknown">Unknown</option>
            </select>

            <label className="mt-4 block text-sm text-slate-300">
              Stripe / Check Repeat in Inches
            </label>
            <input
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              type="number"
              min="0"
              step="0.25"
              value={stripeRepeatInches}
              onChange={(e) =>
                setStripeRepeatInches(Number(e.target.value))
              }
            />

            <label className="mt-4 block text-sm text-slate-300">
              Pattern Piece Name
            </label>
            <input
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              value={patternPieceName}
              onChange={(e) => setPatternPieceName(e.target.value)}
            />

            <label className="mt-4 block text-sm text-slate-300">
              Matching Required?
            </label>
            <select
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              value={requiresMatching ? "yes" : "no"}
              onChange={(e) =>
                setRequiresMatching(e.target.value === "yes")
              }
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>

            <label className="mt-4 block text-sm text-slate-300">
              Matching Priority
            </label>
            <select
              className="mt-1 w-full rounded-lg bg-slate-800 p-3 text-white"
              value={matchingPriority}
              onChange={(e) =>
                setMatchingPriority(
                  e.target.value as "low" | "medium" | "high"
                )
              }
            >
              <option value="high">High — Buyer visible area</option>
              <option value="medium">Medium — Important but flexible</option>
              <option value="low">Low — Save fabric first</option>
            </select>
          </div>

          <div className="rounded-2xl bg-slate-900 p-5 shadow">
            <h2 className="text-xl font-semibold">AI Cutting Advice</h2>

            <div className="mt-4 rounded-xl bg-slate-800 p-4">
              <p className="text-sm uppercase text-slate-400">Status</p>
              <p className="mt-1 text-2xl font-bold">{result.status}</p>
            </div>

            <div className="mt-4 rounded-xl bg-slate-800 p-4">
              <p className="text-sm uppercase text-slate-400">Message</p>
              <p className="mt-1 text-slate-100">{result.message}</p>
            </div>

            <div className="mt-4 rounded-xl bg-blue-950 p-4">
              <p className="text-sm uppercase text-blue-300">
                Why does AI ask this?
              </p>
              <p className="mt-1 text-blue-100">{result.aiReason}</p>
            </div>

            <div className="mt-4 rounded-xl bg-slate-800 p-4">
              <p className="text-sm uppercase text-slate-400">
                Recommendations
              </p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-100">
                {result.recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}