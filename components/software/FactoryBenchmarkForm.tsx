"use client";

import { useMemo, useState } from "react";

import { calculateBenchmark } from "@/lib/software/benchmarkEngine";

export default function FactoryBenchmarkForm() {
  const [productivity, setProductivity] =
    useState(70);

  const [quality, setQuality] = useState(75);

  const [delivery, setDelivery] = useState(80);

  const [wastage, setWastage] = useState(20);

  const [efficiency, setEfficiency] =
    useState(78);

  const result = useMemo(() => {
    return calculateBenchmark({
      productivity,
      quality,
      delivery,
      wastage,
      efficiency,
    });
  }, [
    productivity,
    quality,
    delivery,
    wastage,
    efficiency,
  ]);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          Factory Benchmarking System
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Compare operational excellence and manufacturing competitiveness.
        </p>
      </div>

      <div className="grid gap-5">
        <BenchmarkSlider
          label="Productivity"
          value={productivity}
          setValue={setProductivity}
        />

        <BenchmarkSlider
          label="Quality"
          value={quality}
          setValue={setQuality}
        />

        <BenchmarkSlider
          label="Delivery Performance"
          value={delivery}
          setValue={setDelivery}
        />

        <BenchmarkSlider
          label="Efficiency"
          value={efficiency}
          setValue={setEfficiency}
        />

        <BenchmarkSlider
          label="Wastage"
          value={wastage}
          setValue={setWastage}
        />

        <div className="mt-4 rounded-2xl bg-neutral-100 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Benchmark Result
          </p>

          <h3 className="mt-2 text-5xl font-bold text-neutral-900">
            {result.overall}
          </h3>

          <p className="mt-3 text-lg font-semibold text-neutral-700">
            Factory Rating: {result.rating}
          </p>
        </div>
      </div>
    </div>
  );
}

type SliderProps = {
  label: string;
  value: number;
  setValue: (value: number) => void;
};

function BenchmarkSlider({
  label,
  value,
  setValue,
}: SliderProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-neutral-700">
        {label}
      </label>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) =>
          setValue(Number(e.target.value))
        }
        className="w-full"
      />

      <div className="mt-1 text-sm font-semibold text-neutral-500">
        Score: {value}
      </div>
    </div>
  );
}