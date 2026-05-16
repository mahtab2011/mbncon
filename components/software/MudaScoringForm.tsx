"use client";

import { useMemo, useState } from "react";
import {
  calculateMudaScore,
  MudaCategory,
} from "@/lib/software/mudaEngine";

const mudaCategories: MudaCategory[] = [
  "Overproduction",
  "Waiting",
  "Transport",
  "Motion",
  "Overprocessing",
  "Inventory",
  "Defects",
];

export default function MudaScoringForm() {
  const [category, setCategory] =
    useState<MudaCategory>("Waiting");

  const [incidents, setIncidents] = useState(1);
  const [severity, setSeverity] = useState(1);
  const [affectedWorkers, setAffectedWorkers] =
    useState(1);

  const result = useMemo(() => {
    return calculateMudaScore({
      category,
      incidents,
      severity,
      affectedWorkers,
    });
  }, [category, incidents, severity, affectedWorkers]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          MUDA Waste Scoring Engine
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Lean manufacturing waste intelligence and operational loss scoring.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Waste Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as MudaCategory)
            }
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          >
            {mudaCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Number of Incidents
          </label>

          <input
            type="number"
            value={incidents}
            onChange={(e) =>
              setIncidents(Number(e.target.value))
            }
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Severity Level (1–10)
          </label>

          <input
            type="number"
            min={1}
            max={10}
            value={severity}
            onChange={(e) =>
              setSeverity(Number(e.target.value))
            }
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-neutral-700">
            Affected Workers
          </label>

          <input
            type="number"
            value={affectedWorkers}
            onChange={(e) =>
              setAffectedWorkers(Number(e.target.value))
            }
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div className="mt-4 rounded-2xl bg-neutral-100 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Waste Intelligence Result
          </p>

          <h3 className="mt-2 text-4xl font-bold text-neutral-900">
            {result.score}
          </h3>

          <p className="mt-2 text-lg font-semibold">
            Risk Level: {result.risk}
          </p>
        </div>
      </div>
    </div>
  );
}