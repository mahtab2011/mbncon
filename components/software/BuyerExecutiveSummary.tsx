"use client";

export default function BuyerExecutiveSummary() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="border-b border-neutral-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">
          MBNCON Manufacturing Intelligence
        </p>

        <h1 className="mt-3 text-4xl font-bold text-neutral-900">
          Buyer Executive Summary
        </h1>

        <p className="mt-4 max-w-3xl text-neutral-600">
          Operational performance overview for international buyers,
          compliance teams, and executive management.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <SummaryCard
          title="Production Stability"
          value="92%"
          description="Production flow operating within planned capacity."
        />

        <SummaryCard
          title="Quality Performance"
          value="96%"
          description="Inline quality and shipment quality performance stable."
        />

        <SummaryCard
          title="Shipment Reliability"
          value="94%"
          description="Shipment planning and dispatch schedules maintained."
        />

        <SummaryCard
          title="Operational Risk"
          value="Low"
          description="No major operational disruption detected."
        />
      </div>

      <div className="mt-10 rounded-2xl bg-neutral-100 p-6">
        <h2 className="text-xl font-bold text-neutral-900">
          Executive Observation
        </h2>

        <p className="mt-4 leading-7 text-neutral-700">
          Factory operational performance remains stable with acceptable
          shipment reliability, quality control, and production continuity.
          Continuous improvement initiatives are active through Kaizen,
          Gemba observation, and corrective action tracking systems.
        </p>
      </div>
    </div>
  );
}

type CardProps = {
  title: string;
  value: string;
  description: string;
};

function SummaryCard({
  title,
  value,
  description,
}: CardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
        {title}
      </p>

      <h3 className="mt-3 text-4xl font-bold text-neutral-900">
        {value}
      </h3>

      <p className="mt-3 text-sm leading-6 text-neutral-600">
        {description}
      </p>
    </div>
  );
}