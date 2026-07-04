"use client";

import {
  fabricCuttingKnowledgeMaster,
} from "@/lib/manufacturing/fabric-cutting-knowledge/fabricCuttingKnowledgeMaster";

export default function FabricCuttingKnowledgePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          Fabric Cutting Knowledge Centre
        </h1>

        <p className="mt-2 text-gray-600">
          AI-ready cutting room knowledge for fabric grain, relaxation,
          marker efficiency, pattern verification and bundle control.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <Card title="Knowledge Items" value={fabricCuttingKnowledgeMaster.length.toString()} />
        <Card title="AI Ready" value="Yes" />
        <Card title="Focus Area" value="Cutting" />
        <Card title="System" value="FIS" />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Cutting Knowledge Summary
        </h2>

        <p className="mt-3 text-gray-700">
          This knowledge centre supports fabric optimization, marker
          efficiency, pattern photo verification and cutting-room SOPs.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {fabricCuttingKnowledgeMaster.map((item) => (
          <section key={item.id} className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-blue-700">
              {item.title}
            </h2>

            <p className="text-sm font-semibold text-gray-500">
              {item.id} · {item.category}
            </p>

            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-semibold text-gray-500">
                Knowledge
              </p>
              <p className="mt-2 text-gray-700">{item.description}</p>
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700">
                AI Recommendation
              </p>
              <p className="mt-2 text-gray-700">{item.aiRecommendation}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold text-blue-700">
        {value}
      </h2>
    </div>
  );
}