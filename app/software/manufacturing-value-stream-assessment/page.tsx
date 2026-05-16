"use client";

import { useMemo, useState } from "react";

type AssessmentItem = {
  name: string;
  score: number;
  notes: string;
};

type SectionType = {
  title: string;
  items: AssessmentItem[];
};

const createItems = (items: string[]): AssessmentItem[] =>
  items.map((item) => ({
    name: item,
    score: 0,
    notes: "",
  }));

export default function ManufacturingValueStreamAssessmentPage() {
  const [sections, setSections] = useState<SectionType[]>([
    {
      title: "1. Customer Order & Costing",
      items: createItems([
        "Order clarity",
        "Specification accuracy",
        "Costing accuracy",
        "Pricing competitiveness",
        "Delivery commitment realism",
        "Customer communication",
        "Profit margin sustainability",
        "Forecast accuracy",
      ]),
    },
    {
      title: "2. Material Procurement",
      items: createItems([
        "Supplier reliability",
        "Material quality",
        "Delivery consistency",
        "Emergency procurement frequency",
        "Inventory synchronization",
        "Over-ordering control",
        "Under-ordering control",
        "Material pricing stability",
        "Alternate supplier availability",
      ]),
    },
    {
      title: "3. Transport & Logistics",
      items: createItems([
        "Shipment timing",
        "Transit visibility",
        "Transport cost efficiency",
        "Damage prevention",
        "Gate waiting time",
        "Unloading efficiency",
        "Customs or external delay control",
      ]),
    },
    {
      title: "4. Production Readiness",
      items: createItems([
        "Machine readiness",
        "Preventive maintenance",
        "Staff availability",
        "Staff skill level",
        "Production scheduling",
        "Workflow clarity",
        "Previous stock utilization",
      ]),
    },
    {
      title: "5. Live Production Flow",
      items: createItems([
        "Production speed",
        "Bottleneck control",
        "Rejection rate",
        "Rework control",
        "Downtime management",
        "Waste reduction",
        "Labour productivity",
        "Material use discipline",
      ]),
    },
    {
      title: "6. Quality Control",
      items: createItems([
        "Inspection efficiency",
        "Defect detection",
        "Corrective action speed",
        "Root cause analysis",
        "Documentation accuracy",
        "Quality ownership",
      ]),
    },
    {
      title: "7. Packaging & Storage",
      items: createItems([
        "Packaging quality",
        "Label accuracy",
        "Warehouse organization",
        "FIFO compliance",
        "Finished goods holding time",
        "Stock visibility",
      ]),
    },
    {
      title: "8. Shipping & Customer Delivery",
      items: createItems([
        "Dispatch accuracy",
        "Shipment preparation time",
        "On-time delivery",
        "Customer receiving efficiency",
        "Shipment coordination",
        "Product transit control",
      ]),
    },
    {
      title: "9. Customer Feedback & Future Risk",
      items: createItems([
        "Complaint frequency",
        "Repeat order probability",
        "Customer trust",
        "Future claim probability",
        "Reputation risk",
        "Customer feedback system",
      ]),
    },
    {
      title: "10. Leadership & Adaptive Capacity",
      items: createItems([
        "Active listening",
        "Trust building",
        "Conflict handling",
        "Employee empowerment",
        "Adaptive leadership",
        "Transparency",
        "Accountability",
        "Cross-functional collaboration",
        "Innovation encouragement",
        "Emotional intelligence",
      ]),
    },
  ]);

  const updateScore = (
    sectionIndex: number,
    itemIndex: number,
    value: number
  ) => {
    const safeValue = Math.max(0, Math.min(10, value || 0));

    const updated = sections.map((section, sIndex) => {
      if (sIndex !== sectionIndex) return section;

      return {
        ...section,
        items: section.items.map((item, iIndex) => {
          if (iIndex !== itemIndex) return item;

          return {
            ...item,
            score: safeValue,
          };
        }),
      };
    });

    setSections(updated);
  };

  const updateNotes = (
    sectionIndex: number,
    itemIndex: number,
    value: string
  ) => {
    const updated = sections.map((section, sIndex) => {
      if (sIndex !== sectionIndex) return section;

      return {
        ...section,
        items: section.items.map((item, iIndex) => {
          if (iIndex !== itemIndex) return item;

          return {
            ...item,
            notes: value,
          };
        }),
      };
    });

    setSections(updated);
  };

  const totalItems = sections.reduce(
    (count, section) => count + section.items.length,
    0
  );

  const totalRawScore = sections.reduce((total, section) => {
    return (
      total +
      section.items.reduce((sectionTotal, item) => sectionTotal + item.score, 0)
    );
  }, 0);

  const maxScore = totalItems * 10;

  const totalScore = useMemo(() => {
    if (!maxScore) return "0.0";
    return ((totalRawScore / maxScore) * 100).toFixed(1);
  }, [totalRawScore, maxScore]);

  const finalRecommendation = useMemo(() => {
    const score = Number(totalScore);

    if (score >= 90) return "Excellent – Expansion Ready";
    if (score >= 80) return "Very Good – Optimization Recommended";
    if (score >= 70) return "Stable – Training Required";
    if (score >= 60) return "Moderate Risk – Retraining Needed";
    if (score >= 50) return "High Risk – Structural Intervention Needed";

    return "Critical – Immediate Turnaround Required";
  }, [totalScore]);

  const finalAction = useMemo(() => {
    const score = Number(totalScore);

    if (score >= 90) {
      return "The value stream is strong. Prepare for expansion, digital integration, and advanced analytics.";
    }

    if (score >= 80) {
      return "The system is performing well. Optimize weaker stages and reward responsible teams.";
    }

    if (score >= 70) {
      return "The system is stable but needs targeted training, Kaizen review, and process improvement.";
    }

    if (score >= 60) {
      return "Moderate risk exists. Retraining, closer supervision, and stronger KPI tracking are recommended.";
    }

    if (score >= 50) {
      return "High risk exists. Structural intervention, workflow redesign, and leadership review are needed.";
    }

    return "Critical condition. Immediate turnaround action, bottleneck diagnosis, quality control review, and leadership intervention are required.";
  }, [totalScore]);

  const sectionScores = sections.map((section) => {
    const score = section.items.reduce((sum, item) => sum + item.score, 0);
    const max = section.items.length * 10;
    const percent = max ? Math.round((score / max) * 100) : 0;

    return {
      title: section.title,
      percent,
    };
  });

  const weakestSection = sectionScores.reduce((weakest, current) =>
    current.percent < weakest.percent ? current : weakest
  );

  const strongestSection = sectionScores.reduce((strongest, current) =>
    current.percent > strongest.percent ? current : strongest
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl bg-linear-to-r from-blue-700 to-indigo-700 p-10 shadow-2xl">
          <h1 className="text-5xl font-bold">
            MBNCON Manufacturing Intelligence Assessment System
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-blue-100">
            Integrated Lean Manufacturing, Adaptive Leadership, Operational
            Excellence and Value Stream Mapping platform for analysing costs,
            bottlenecks, losses, delays, quality risks and customer impact
            across the full manufacturing journey.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl bg-neutral-900 p-6">
            <p className="text-neutral-400">Overall Score</p>
            <h2 className="mt-3 text-4xl font-bold text-blue-300">
              {totalScore}%
            </h2>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6">
            <p className="text-neutral-400">Total Points</p>
            <h2 className="mt-3 text-4xl font-bold text-green-300">
              {totalRawScore}/{maxScore}
            </h2>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6">
            <p className="text-neutral-400">Strongest Area</p>
            <h2 className="mt-3 text-xl font-bold text-emerald-300">
              {strongestSection.title}
            </h2>
          </div>

          <div className="rounded-2xl bg-neutral-900 p-6">
            <p className="text-neutral-400">Weakest Area</p>
            <h2 className="mt-3 text-xl font-bold text-red-300">
              {weakestSection.title}
            </h2>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-2xl font-bold">
            Section Score Breakdown
          </h2>

          <div className="mt-6 space-y-4">
            {sectionScores.map((section) => (
              <div key={section.title}>
                <div className="flex justify-between text-sm">
                  <span>{section.title}</span>
                  <span>{section.percent}%</span>
                </div>

                <div className="mt-2 h-3 rounded-full bg-neutral-800">
                  <div
                    className="h-3 rounded-full bg-blue-500"
                    style={{ width: `${section.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {sections.map((section, sectionIndex) => (
            <div
              key={section.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
            >
              <h2 className="mb-6 text-2xl font-bold">
                {section.title}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-800">
                      <th className="p-4 text-left">
                        Assessment Criteria
                      </th>
                      <th className="p-4 text-left">
                        Score (0-10)
                      </th>
                      <th className="p-4 text-left">
                        Risk Level
                      </th>
                      <th className="p-4 text-left">
                        Qualitative Notes
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {section.items.map((item, itemIndex) => {
                      let risk = "Stable";

                      if (item.score <= 3) risk = "Critical";
                      else if (item.score <= 5) risk = "High Risk";
                      else if (item.score <= 7) risk = "Moderate";

                      return (
                        <tr
                          key={item.name}
                          className="border-b border-neutral-800"
                        >
                          <td className="p-4">
                            {item.name}
                          </td>

                          <td className="p-4">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={item.score}
                              onChange={(e) =>
                                updateScore(
                                  sectionIndex,
                                  itemIndex,
                                  Number(e.target.value)
                                )
                              }
                              className="w-24 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                            />
                          </td>

                          <td className="p-4">
                            <span
                              className={`rounded-full px-3 py-1 text-sm ${
                                risk === "Critical"
                                  ? "bg-red-700"
                                  : risk === "High Risk"
                                  ? "bg-orange-700"
                                  : risk === "Moderate"
                                  ? "bg-yellow-600 text-black"
                                  : "bg-green-700"
                              }`}
                            >
                              {risk}
                            </span>
                          </td>

                          <td className="p-4">
                            <textarea
                              value={item.notes}
                              onChange={(e) =>
                                updateNotes(
                                  sectionIndex,
                                  itemIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Costs, bottlenecks, loss, delay, risk, leadership issue, supplier issue..."
                              className="min-h-20 w-full min-w-65 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-linear-to-r from-blue-700 to-indigo-700 p-8">
          <h2 className="mb-4 text-3xl font-bold">
            Final Assessment Dashboard
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-6">
              <p className="mb-2 text-lg">
                Overall Score
              </p>

              <div className="text-5xl font-bold">
                {totalScore}%
              </div>
            </div>

            <div className="rounded-xl bg-white/10 p-6">
              <p className="mb-2 text-lg">
                Final Recommendation
              </p>

              <div className="text-2xl font-bold">
                {finalRecommendation}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-white/10 p-6">
            <p className="text-lg font-semibold">
              Suggested Action
            </p>

            <p className="mt-3 text-lg leading-8 text-blue-100">
              {finalAction}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}