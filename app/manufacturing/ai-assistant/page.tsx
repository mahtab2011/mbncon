"use client";

import { useState } from "react";
import {
  productionSummary,
  executiveAlerts,
  factoryHealth,
} from "@/lib/manufacturing/manufacturingData";

type AIResponse = {
  question: string;
  answer: string;
};

const sampleResponses: AIResponse[] = [
  {
    question: "Why is Line L-002 behind target?",
    answer:
      "AI Analysis: Collar Attach is the current bottleneck. Machine MC-014 has reduced OEE, two skilled operators are absent, and WIP before Collar Attach has reached 42 pieces. Expected recovery: move OPR-142, replace MC-014 with standby MC-021 and reduce bundle size.",
  },
  {
    question: "Which shipment is most at risk?",
    answer:
      "Shipment HNM-POLO-2401 has MEDIUM risk due to learning curve and Collar Attach capacity. Shipment confidence is currently 94%.",
  },
  {
    question: "Which machine is likely to fail next?",
    answer:
      "Machine MC-014 has an 87% failure probability based on maintenance history, vibration trend and declining OEE. Preventive maintenance is recommended within 48 hours.",
  },
  {
    question: "Show today's biggest bottleneck.",
    answer:
      "Today's primary bottleneck is Collar Attach on Line L-002. Estimated production loss if untreated: approximately 420 pieces.",
  },
  {
    question: "Which operator should replace OPR-142?",
    answer:
      "Recommended replacement: OPR-188. Historical efficiency: 81%, expected DHU: 2.4%, confidence: 91%.",
  },
];

export default function AIManufacturingAssistantPage() {
  const [selected, setSelected] = useState(sampleResponses[0]);

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Manufacturing Assistant
        </h1>

        <p className="mt-2 text-gray-600">
          Ask the Manufacturing Intelligence Suite questions in natural
          language and receive AI-powered operational guidance.
        </p>
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Live Factory Intelligence
        </h2>

        <p className="mt-3 text-gray-700">
          Factory health is currently{" "}
          <strong>{factoryHealth.overallHealth}%</strong>. Current
          production is{" "}
          <strong>
            {productionSummary.totalProduction.toLocaleString()}
          </strong>{" "}
          pieces with an efficiency of{" "}
          <strong>{productionSummary.efficiency}%</strong>. AI is
          monitoring <strong>{executiveAlerts.length}</strong> active
          executive alerts.
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-bold text-blue-700">
            Suggested Questions
          </h2>

          <div className="space-y-3">
            {sampleResponses.map((item) => (
              <button
                key={item.question}
                onClick={() => setSelected(item)}
                className="w-full rounded-lg border p-4 text-left hover:bg-blue-50"
              >
                {item.question}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white p-8 shadow">
            <h2 className="text-2xl font-bold text-blue-700">
              Question
            </h2>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-5">
              <p className="text-lg font-semibold">
                {selected.question}
              </p>
            </div>

            <h2 className="mt-8 text-2xl font-bold text-green-700">
              AI Answer
            </h2>

            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-6">
              <p className="leading-8 text-gray-700">
                {selected.answer}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <Metric title="Confidence" value="96%" />

              <Metric
                title="Factory Health"
                value={`${factoryHealth.overallHealth}%`}
              />

              <Metric
                title="Efficiency"
                value={`${productionSummary.efficiency}%`}
              />

              <Metric
                title="Alerts"
                value={executiveAlerts.length.toString()}
              />
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h2 className="text-2xl font-bold text-blue-700">
              Future Capability
            </h2>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">
              <li>Answer questions using live Firestore data.</li>
              <li>Explain shipment delays automatically.</li>
              <li>Identify bottlenecks in real time.</li>
              <li>Recommend operators and machines.</li>
              <li>Predict quality, maintenance and production risks.</li>
              <li>Generate executive summaries every hour.</li>
              <li>Support English and Bangla conversations.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

type MetricProps = {
  title: string;
  value: string;
};

function Metric({ title, value }: MetricProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="mt-2 text-lg font-bold">{value}</h3>
    </div>
  );
}