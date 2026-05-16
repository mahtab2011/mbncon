"use client";

export default function BangladeshApparelShowcase() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-linear-to-br from-emerald-50 to-cyan-50 p-8 shadow-sm">
      <div className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
          Bangladesh Apparel Intelligence Ecosystem
        </p>

        <h2 className="mt-4 text-4xl font-bold text-neutral-900">
          BangladeshApparel.com Integration Vision
        </h2>

        <p className="mt-5 text-lg leading-8 text-neutral-700">
          A future-ready manufacturing intelligence ecosystem designed to
          support apparel factories, buying houses, compliance teams,
          operational consultants, and international buyers through
          AI-assisted operational visibility.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <FeatureCard
            title="Factory Intelligence"
            description="Operational dashboards, production analytics, and efficiency intelligence."
          />

          <FeatureCard
            title="Buyer Visibility"
            description="Executive manufacturing summaries and shipment confidence insights."
          />

          <FeatureCard
            title="Lean Manufacturing"
            description="Kaizen, Gemba, MUDA analytics, and continuous improvement systems."
          />

          <FeatureCard
            title="AI Operational Analysis"
            description="Root-cause detection and predictive operational intelligence."
          />

          <FeatureCard
            title="Benchmarking"
            description="Factory maturity and operational competitiveness scoring."
          />

          <FeatureCard
            title="Corrective Action Tracking"
            description="Structured operational issue ownership and resolution monitoring."
          />
        </div>
      </div>
    </div>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
};

function FeatureCard({
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-neutral-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-neutral-600">
        {description}
      </p>
    </div>
  );
}