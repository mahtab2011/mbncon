"use client";

import { useState } from "react";

type Question = {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  source: string;
};

const questions: Question[] = [
  {
    id: "1",
    question: "Why did Line L-003 efficiency drop today?",
    answer:
      "Line L-003 efficiency dropped because of three combined issues: high DHU at 5.1, machine downtime of 75 minutes, and critical material shortage for hood fabric. AI recommends replenishing material, repairing the machine issue, and increasing inline quality checking.",
    confidence: 96,
    source: "Production + Quality + Maintenance + Material + WIP",
  },
  {
    id: "2",
    question: "Which machine is most likely to fail next?",
    answer:
      "Machine MC-014 is the highest risk machine. It has repeated breakdown history, reduced OEE, and an open maintenance case. AI recommends preventive overhaul before the next production cycle.",
    confidence: 94,
    source: "Machine Master + Maintenance Entry",
  },
  {
    id: "3",
    question: "Which line needs immediate management attention?",
    answer:
      "Line L-003 needs immediate attention. It has critical material risk, high DHU, machine downtime, and a WIP bottleneck at sewing. This line may delay shipment if no action is taken.",
    confidence: 97,
    source: "Live Production Dashboard + Digital Factory Twin",
  },
  {
    id: "4",
    question: "How can we improve factory efficiency tomorrow?",
    answer:
      "AI recommends three actions: move one skilled operator to Line L-003, complete MC-014 maintenance, and replenish hood fabric before shift start. These actions may improve factory efficiency by 3 to 5 percent.",
    confidence: 92,
    source: "Attendance + Maintenance + Material + Production",
  },
];

export default function AIManufacturingAssistantLivePage() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(
    questions[0]
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-700">
          AI Manufacturing Assistant Live
        </h1>

        <p className="mt-2 text-gray-600">
          Ask operational questions using production, quality, maintenance,
          attendance, material and WIP intelligence.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-2xl font-bold text-blue-700">
            Suggested Questions
          </h2>

          <div className="space-y-3">
            {questions.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedQuestion(item)}
                className={`w-full rounded-lg border p-4 text-left hover:bg-blue-50 ${
                  selectedQuestion.id === item.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {item.question}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-8 shadow lg:col-span-2">
          <h2 className="text-2xl font-bold text-blue-700">
            Question
          </h2>

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-5">
            <p className="text-lg font-semibold">
              {selectedQuestion.question}
            </p>
          </div>

          <h2 className="mt-8 text-2xl font-bold text-green-700">
            AI Answer
          </h2>

          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-6">
            <p className="leading-8 text-gray-700">
              {selectedQuestion.answer}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Metric
              title="Confidence"
              value={`${selectedQuestion.confidence}%`}
            />

            <Metric
              title="Data Source"
              value={selectedQuestion.source}
            />

            <Metric
              title="Status"
              value="Operational"
            />
          </div>

          <section className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-6">
            <h3 className="text-xl font-bold text-orange-700">
              Recommended Management Action
            </h3>

            <p className="mt-3 text-gray-700">
              Review the affected line immediately, confirm material
              availability, check machine condition, and assign responsible
              managers for corrective action before the next shift.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-2 font-bold">{value}</h3>
    </div>
  );
}