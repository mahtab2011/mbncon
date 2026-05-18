"use client";

import React from "react";

export default function AdaptiveLeadershipAssessmentPage() {
  const assessmentAreas = [
    {
      title: "Strategic Observation & Gallery Thinking",
      points: [
        "Ability to step back and observe organizational dynamics",
        "Ability to diagnose before reacting",
        "Capacity to identify hidden operational pressures",
        "Ability to separate emotion from observation",
        "Regular reflection before major decisions",
      ],
    },
    {
      title: "Technical vs Adaptive Diagnosis",
      points: [
        "Ability to distinguish routine problems from adaptive challenges",
        "Recognizes when existing expertise is insufficient",
        "Encourages learning instead of quick blame",
        "Identifies long-term organizational adaptation needs",
        "Separates symptoms from root causes",
      ],
    },
    {
      title: "Leadership Beyond Authority",
      points: [
        "Can influence without formal power",
        "Builds trust across departments",
        "Encourages collaborative decision-making",
        "Creates ownership at all levels",
        "Supports upward and lateral communication",
      ],
    },
    {
      title: "Trust & Psychological Safety",
      points: [
        "Employees feel safe sharing concerns",
        "Managers actively listen to employees",
        "Mistakes are treated as learning opportunities",
        "Leadership demonstrates integrity and consistency",
        "Teams trust leadership intentions",
      ],
    },
    {
      title: "Conflict Orchestration & Adaptive Pressure",
      points: [
        "Healthy disagreement is encouraged",
        "Conflict is managed professionally",
        "Leadership avoids suppressing important tensions",
        "Teams are challenged without intimidation",
        "Adaptive pressure is regulated constructively",
      ],
    },
    {
      title: "Employee Empowerment & Learning",
      points: [
        "Employees are encouraged to solve problems",
        "Training and retraining systems exist",
        "Positive reinforcement is regularly used",
        "Employees are involved in improvements",
        "Continuous learning culture exists",
      ],
    },
    {
      title: "Change Management Capability",
      points: [
        "Organization adapts effectively to change",
        "Leadership explains reasons for change clearly",
        "Employee resistance is understood respectfully",
        "Losses and uncertainty are acknowledged honestly",
        "Teams participate in transformation efforts",
      ],
    },
    {
      title: "Leadership Stability & Self-Management",
      points: [
        "Leadership remains calm under pressure",
        "Leaders avoid emotional overreaction",
        "Leaders demonstrate patience and discipline",
        "Long-term organizational goals remain visible",
        "Leaders maintain ethical consistency",
      ],
    },
  ];

  const allQuestions = assessmentAreas.flatMap((area) => area.points);

  const [scores, setScores] = React.useState<number[]>(
    Array(allQuestions.length).fill(0)
  );

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = allQuestions.length * 10;
  const percentage = Math.round((totalScore / maxScore) * 100);

  let grade = "";
  let recommendation = "";

  if (percentage >= 90) {
    grade = "Excellent";
    recommendation =
      "Ready for the next phase of leadership responsibility. This person or team demonstrates strong adaptive leadership capacity, trust-building ability, pressure regulation, and organizational maturity.";
  } else if (percentage >= 80) {
    grade = "Very Good";
    recommendation =
      "Reward, recognise, and provide further leadership training for the next stage. Strong foundation exists, but continued development will help prepare for higher responsibility.";
  } else if (percentage >= 70) {
    grade = "Needs Targeted Training";
    recommendation =
      "Needs focused training on certain existing leadership aspects. Identify weaker assessment areas and provide coaching, workshops, and follow-up review.";
  } else if (percentage >= 60) {
    grade = "Needs Retraining";
    recommendation =
      "Requires structured retraining and close leadership mentoring. Improvement is possible, but development should be monitored with clear follow-up dates.";
  } else if (percentage >= 50) {
    grade = "Retraining & Reassessment";
    recommendation =
      "Needs retraining and reassessment for current or alternative responsibilities. Review role fit, confidence level, communication ability, and readiness for people-management duties.";
  } else {
    grade = "Serious Development Required";
    recommendation =
      "Needs vigorous retraining before making future leadership decisions. Do not assign higher responsibility until development, coaching, and reassessment are completed.";
  }

  const getGlobalIndex = (areaIndex: number, pointIndex: number) => {
    return (
      assessmentAreas
        .slice(0, areaIndex)
        .reduce((acc, curr) => acc + curr.points.length, 0) + pointIndex
    );
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-blue-50 text-gray-800">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-5xl">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            MBNCON Adaptive Leadership Systems
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight">
            Adaptive Leadership Intelligence Assessment System
          </h1>

          <p className="mt-6 text-xl leading-9 text-gray-600">
            Modern organizations face uncertainty, rapid change, workforce
            pressure, technological disruption, and operational complexity.
            This assessment helps evaluate adaptive leadership capability,
            trust, empowerment, conflict handling, pressure management, and
            organizational readiness for change.
          </p>
        </div>

        <div className="mt-16 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-700">
            The Gallery Thinking Model
          </h2>

          <p className="mt-6 text-lg leading-9 text-gray-700">
            Leaders must sometimes move away from the operational “tennis
            court” and observe from the “gallery.” From the gallery, they can
            see wider patterns: pressure, resistance, communication gaps,
            bottlenecks, trust levels, stakeholder behaviour, and emotional
            temperature.
          </p>

          <p className="mt-6 text-lg leading-9 text-gray-700">
            Effective leadership means moving between action and reflection:
            play the point when action is needed, then step back to read the
            whole match before deciding the next move.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-blue-700">
              Technical Problems
            </h2>

            <ul className="mt-6 space-y-4 text-lg leading-8 text-gray-700">
              <li>• Existing expertise can solve the problem</li>
              <li>• Solutions are already known</li>
              <li>• Procedures and systems already exist</li>
              <li>• Routine operational corrections</li>
              <li>• Often solved through managerial expertise</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-red-700">
              Adaptive Challenges
            </h2>

            <ul className="mt-6 space-y-4 text-lg leading-8 text-gray-700">
              <li>• Existing expertise alone is insufficient</li>
              <li>• Requires behavioural and cultural change</li>
              <li>• Requires learning and experimentation</li>
              <li>• Often involves uncertainty and loss</li>
              <li>• Requires people to adapt collectively</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-700">
            Assessment Instructions
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-700">
            Score each item from 0 to 10. A score of 0 means the behaviour is
            absent or very weak. A score of 10 means the behaviour is strong,
            consistent, and visible in practice.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-4xl font-bold text-blue-700">
            Organizational Assessment Rows
          </h2>

          <div className="mt-10 space-y-8">
            {assessmentAreas.map((section, areaIndex) => (
              <div
                key={section.title}
                className="rounded-3xl bg-white p-8 shadow-xl"
              >
                <h3 className="text-2xl font-bold text-blue-700">
                  {section.title}
                </h3>

                <div className="mt-8 space-y-5">
                  {section.points.map((point, pointIndex) => {
                    const globalIndex = getGlobalIndex(areaIndex, pointIndex);

                    return (
                      <div
                        key={point}
                        className="rounded-2xl border border-blue-100 bg-blue-50 p-5"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          <p className="text-lg leading-8 text-gray-700">
                            {point}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                              (score) => (
                                <button
                                  key={score}
                                  type="button"
                                  onClick={() => {
                                    const updated = [...scores];
                                    updated[globalIndex] = score;
                                    setScores(updated);
                                  }}
                                  className={`h-10 w-10 rounded-full border text-sm font-bold transition ${
                                    scores[globalIndex] === score
                                      ? "border-blue-700 bg-blue-700 text-white"
                                      : "border-blue-300 text-blue-700 hover:bg-blue-100"
                                  }`}
                                >
                                  {score}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-700">
            Assessment Results
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-8 text-center">
              <div className="text-5xl font-extrabold text-blue-700">
                {totalScore}
              </div>

              <p className="mt-3 text-lg text-gray-700">
                Total Score / {maxScore}
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-8 text-center">
              <div className="text-5xl font-extrabold text-green-700">
                {percentage}%
              </div>

              <p className="mt-3 text-lg text-gray-700">
                Performance Percentage
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-8 text-center">
              <div className="text-3xl font-extrabold text-orange-700">
                {grade}
              </div>

              <p className="mt-3 text-lg text-gray-700">
                Leadership Grade
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-8">
            <h3 className="text-2xl font-bold text-blue-700">
              Recommendation
            </h3>

            <p className="mt-4 text-lg leading-8 text-gray-700">
              {recommendation}
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-700">
            Rating Interpretation
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                range: "90%+",
                title: "Excellent",
                message: "Ready for next phase of leadership responsibility.",
              },
              {
                range: "80%+",
                title: "Very Good",
                message:
                  "Reward, recognise, and provide further training for next stage.",
              },
              {
                range: "70%+",
                title: "Needs Targeted Training",
                message:
                  "Needs training on certain existing leadership aspects.",
              },
              {
                range: "60%+",
                title: "Needs Retraining",
                message: "Requires structured retraining and close follow-up.",
              },
              {
                range: "50%+",
                title: "Retraining & Reassessment",
                message:
                  "Retrain and assess suitability for other fields or responsibilities.",
              },
              {
                range: "Below 50%",
                title: "Serious Development Required",
                message:
                  "Needs vigorous retraining before deciding future responsibility.",
              },
            ].map((item) => (
              <div
                key={item.range}
                className="rounded-2xl border border-blue-100 bg-blue-50 p-6"
              >
                <div className="text-3xl font-extrabold text-blue-700">
                  {item.range}
                </div>

                <h3 className="mt-3 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-700">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-blue-700 p-10 text-white shadow-2xl">
          <h2 className="text-3xl font-bold">
            Organizational Heat & Pressure Management
          </h2>

          <p className="mt-6 text-lg leading-9 text-blue-100">
            Adaptive leadership recognizes that organizational learning
            requires productive pressure. Too little pressure creates
            complacency, while excessive pressure creates fear, resistance, and
            instability.
          </p>

          <p className="mt-6 text-lg leading-9 text-blue-100">
            Effective leaders regulate pressure carefully by pacing change,
            maintaining trust, creating psychological safety, and supporting
            teams through uncertainty.
          </p>
        </div>

        <div className="mt-16 rounded-3xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-700">
            Stakeholder Mapping Intelligence
          </h2>

          <p className="mt-6 text-lg leading-9 text-gray-700">
            Adaptive leadership requires understanding stakeholders,
            constituencies, factions, political pressures, resistance,
            potential losses, communication barriers, and competing values.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              ["01", "Stakeholder interests", "#stakeholder-interests"],
              ["02", "Sources of resistance", "#sources-of-resistance"],
              ["03", "Political pressures", "#political-pressures"],
              ["04", "Potential losses", "#potential-losses"],
              ["05", "Competing priorities", "#competing-priorities"],
              ["06", "Communication barriers", "#communication-barriers"],
              ["07", "Trust relationships", "#trust-relationships"],
              [
                "08",
                "Shared and conflicting values",
                "#shared-conflicting-values",
              ],
            ].map(([number, item, href]) => (
              <a
                key={item}
                href={href}
                className="rounded-2xl bg-blue-50 p-5 text-lg font-medium text-gray-700 transition hover:-translate-y-1 hover:bg-blue-100"
              >
                <span className="mr-3 font-extrabold text-blue-700">
                  {number}
                </span>
                {item}
              </a>
            ))}
          </div>

          <div className="mt-10 space-y-6">
            {[
              ["stakeholder-interests", "Stakeholder Interests"],
              ["sources-of-resistance", "Sources of Resistance"],
              ["political-pressures", "Political Pressures"],
              ["potential-losses", "Potential Losses"],
              ["competing-priorities", "Competing Priorities"],
              ["communication-barriers", "Communication Barriers"],
              ["trust-relationships", "Trust Relationships"],
              [
                "shared-conflicting-values",
                "Shared and Conflicting Values",
              ],
            ].map(([id, title]) => (
              <section
                key={id}
                id={id}
                className="scroll-mt-28 rounded-2xl border border-blue-100 bg-blue-50 p-6"
              >
                <h3 className="text-2xl font-bold text-blue-700">
                  {title}
                </h3>

                <p className="mt-4 text-lg leading-8 text-gray-700">
                  This area helps leadership understand hidden pressure,
                  resistance, trust gaps, communication barriers,
                  organizational politics, and alignment risks before major
                  decisions are made.
                </p>
              </section>
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-blue-200 bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-blue-700">
            MBNCON Consulting Integration
          </h2>

          <div className="mt-8 space-y-5 text-lg leading-8 text-gray-700">
            <p>• Adaptive leadership diagnostics and assessments</p>
            <p>• Organizational change readiness evaluation</p>
            <p>• Leadership capability development</p>
            <p>• Employee engagement and trust rebuilding systems</p>
            <p>• Stakeholder mapping and conflict analysis</p>
            <p>• Operational culture transformation programs</p>
            <p>• Lean, Kaizen, and continuous improvement integration</p>
            <p>• Organizational resilience and sustainability planning</p>
          </div>
        </div>
      </section>
    </main>
  );
}