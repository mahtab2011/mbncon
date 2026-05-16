"use client";

import { useMemo, useState } from "react";

export default function TQMImplementationForm() {
  const [leadership, setLeadership] = useState(5);
  const [training, setTraining] = useState(5);
  const [processControl, setProcessControl] =
    useState(5);
  const [continuousImprovement, setContinuousImprovement] =
    useState(5);
  const [customerFocus, setCustomerFocus] =
    useState(5);

  const overallScore = useMemo(() => {
    return Math.round(
      (
        leadership +
        training +
        processControl +
        continuousImprovement +
        customerFocus
      ) / 5
    );
  }, [
    leadership,
    training,
    processControl,
    continuousImprovement,
    customerFocus,
  ]);

  function getMaturity(score: number) {
    if (score >= 9) return "World Class";
    if (score >= 7) return "Advanced";
    if (score >= 5) return "Developing";
    return "Critical";
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900">
          TQM Implementation System
        </h2>

        <p className="mt-2 text-sm text-neutral-600">
          Total Quality Management readiness and operational excellence assessment.
        </p>
      </div>

      <div className="grid gap-5">
        <TQMInput
          label="Leadership Commitment"
          value={leadership}
          setValue={setLeadership}
        />

        <TQMInput
          label="Employee Training"
          value={training}
          setValue={setTraining}
        />

        <TQMInput
          label="Process Control"
          value={processControl}
          setValue={setProcessControl}
        />

        <TQMInput
          label="Continuous Improvement"
          value={continuousImprovement}
          setValue={setContinuousImprovement}
        />

        <TQMInput
          label="Customer Focus"
          value={customerFocus}
          setValue={setCustomerFocus}
        />

        <div className="mt-4 rounded-2xl bg-neutral-100 p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            TQM Maturity Score
          </p>

          <h3 className="mt-2 text-5xl font-bold text-neutral-900">
            {overallScore}/10
          </h3>

          <p className="mt-3 text-lg font-semibold text-neutral-700">
            Maturity Level: {getMaturity(overallScore)}
          </p>
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  value: number;
  setValue: (value: number) => void;
};

function TQMInput({
  label,
  value,
  setValue,
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-neutral-700">
        {label}
      </label>

      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) =>
          setValue(Number(e.target.value))
        }
        className="w-full"
      />

      <div className="mt-1 text-sm font-semibold text-neutral-500">
        Score: {value}/10
      </div>
    </div>
  );
}