"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const leadershipAreas = [
  {
    title: "Gallery Observation Thinking",
    tone: "text-indigo-300",
    border: "border-indigo-500",
    body:
      "Effective leaders do not remain trapped inside operational pressure. They step back mentally like observing a tennis match from a gallery to understand movement, behaviour, pressure, reactions, conflict, and opportunities.",
    points: [
      "Observe before reacting",
      "Diagnose before solving",
      "Understand system pressure",
      "Detect resistance patterns",
      "Identify stakeholder behaviour",
      "Analyse operational bottlenecks",
    ],
  },
  {
    title: "Technical vs Adaptive Challenges",
    tone: "text-purple-300",
    border: "border-purple-500",
    body:
      "Some problems can be solved using existing expertise, systems, and routines. Other challenges require people to develop new thinking, new behaviour, and new capacity.",
    children: [
      {
        title: "Technical Problems",
        tone: "text-emerald-300",
        body:
          "Existing knowledge already provides solutions. Examples include machine repair, payroll processing, inventory reporting, or routine quality inspections.",
      },
      {
        title: "Adaptive Challenges",
        tone: "text-amber-300",
        body:
          "Require behavioural change, learning, innovation, trust building, collaboration, and emotional adjustment throughout the organization.",
      },
    ],
  },
  {
    title: "Leadership Beyond Authority",
    tone: "text-cyan-300",
    border: "border-cyan-500",
    body:
      "Leadership is not limited to job titles. Individuals at every level can influence direction, learning, problem-solving, and organizational improvement.",
    points: [
      "Lead with authority",
      "Lead beyond authority",
      "Lead without authority",
      "Build informal influence",
      "Develop trust and credibility",
      "Mobilize collective learning",
    ],
  },
  {
    title: "Trust and Human Systems",
    tone: "text-emerald-300",
    border: "border-emerald-500",
    body:
      "Sustainable organizations operate through trust. Employees, customers, managers, suppliers, and stakeholders continuously evaluate integrity, competence, fairness, and reliability.",
    points: [
      "Shared values",
      "Operational competence",
      "Psychological safety",
      "Listening culture",
      "Transparency and honesty",
      "Respectful communication",
    ],
  },
];

const conflictCards = [
  {
    title: "Increase Heat",
    tone: "text-red-300",
    body:
      "Surface hidden issues, encourage discussion, expose operational gaps, and challenge outdated assumptions.",
  },
  {
    title: "Regulate Pressure",
    tone: "text-yellow-300",
    body:
      "Maintain productive stress levels while preventing panic, chaos, emotional shutdown, or organizational paralysis.",
  },
  {
    title: "Promote Learning",
    tone: "text-green-300",
    body:
      "Help teams learn publicly, collaborate openly, and develop sustainable solutions together.",
  },
];

const resilienceCards = [
  {
    title: "Personal Anchors",
    tone: "text-pink-300",
    points: [
      "Reflection and self-awareness",
      "Emotional discipline",
      "Sanctuary and recovery",
      "Long-term purpose",
      "Patience under pressure",
    ],
  },
  {
    title: "Leadership Support Systems",
    tone: "text-blue-300",
    points: [
      "Trusted confidants",
      "Honest feedback",
      "Diverse perspectives",
      "Public learning culture",
      "Collaborative adaptation",
    ],
  },
];

export default function LeadershipIntelligencePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl space-y-20">
        <section
          id={slugify("Leadership Intelligence System")}
          className="scroll-mt-28 rounded-3xl bg-linear-to-r from-indigo-700 to-purple-700 p-12 shadow-2xl"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-100">
            MBNCON Adaptive Leadership Intelligence
          </p>

          <h1 className="mt-3 text-5xl font-extrabold leading-tight">
            Leadership Intelligence System
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-9 text-indigo-100">
            MBN Consultancy develops leadership systems that help organizations
            diagnose challenges, mobilize people, strengthen trust, regulate
            conflict, and build adaptive capacity for long-term success.
          </p>
        </section>

        <section
          id={slugify("Leadership Intelligence Areas")}
          className="scroll-mt-28 grid gap-8 md:grid-cols-2"
        >
          {leadershipAreas.map((area) => (
            <section
              key={area.title}
              id={slugify(area.title)}
              className={`scroll-mt-28 rounded-3xl border ${area.border} bg-neutral-950 p-8 transition hover:-translate-y-1 hover:shadow-2xl`}
            >
              <h2 className={`text-3xl font-bold ${area.tone}`}>
                {area.title}
              </h2>

              <p className="mt-4 text-lg leading-8 text-neutral-300">
                {area.body}
              </p>

              {area.points ? (
                <ul className="mt-6 space-y-3 text-neutral-200">
                  {area.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              ) : null}

              {area.children ? (
                <div className="mt-6 space-y-4">
                  {area.children.map((child) => (
                    <div
                      key={child.title}
                      id={slugify(child.title)}
                      className="scroll-mt-28 rounded-2xl bg-neutral-900 p-5 transition hover:-translate-y-1 hover:bg-neutral-800"
                    >
                      <h3 className={`text-xl font-bold ${child.tone}`}>
                        {child.title}
                      </h3>

                      <p className="mt-2 text-neutral-300">
                        {child.body}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </section>

        <section
          id={slugify("Conflict as a Source of Innovation")}
          className="scroll-mt-28 rounded-3xl bg-linear-to-r from-neutral-900 to-neutral-800 p-12"
        >
          <h2 className="text-4xl font-extrabold">
            Conflict as a Source of Innovation
          </h2>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-neutral-300">
            Healthy organizations do not suppress all conflict. Productive
            disagreement can generate innovation, learning, creativity,
            accountability, and adaptive growth. Leadership requires the ability
            to regulate pressure while maintaining stability and learning.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {conflictCards.map((card) => (
              <a
                key={card.title}
                id={slugify(card.title)}
                href={`#${slugify(card.title)}`}
                className="scroll-mt-28 rounded-2xl bg-black p-6 transition hover:-translate-y-1 hover:bg-neutral-950 hover:shadow-xl"
              >
                <h3 className={`text-2xl font-bold ${card.tone}`}>
                  {card.title}
                </h3>

                <p className="mt-4 leading-8 text-neutral-300">
                  {card.body}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section
          id={slugify("Leadership Resilience and Staying Alive")}
          className="scroll-mt-28 rounded-3xl border border-white/10 bg-neutral-950 p-12"
        >
          <h2 className="text-4xl font-extrabold">
            Leadership Resilience & Staying Alive
          </h2>

          <p className="mt-6 text-xl leading-9 text-neutral-300">
            Leadership requires emotional discipline, patience,
            self-reflection, courage, and resilience. Long-term leadership
            sustainability depends on maintaining personal balance, trusted
            confidants, reflective thinking, and a strong sense of purpose.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {resilienceCards.map((card) => (
              <a
                key={card.title}
                id={slugify(card.title)}
                href={`#${slugify(card.title)}`}
                className="scroll-mt-28 rounded-2xl bg-black p-6 transition hover:-translate-y-1 hover:bg-neutral-900 hover:shadow-xl"
              >
                <h3 className={`text-2xl font-bold ${card.tone}`}>
                  {card.title}
                </h3>

                <ul className="mt-5 space-y-3 text-neutral-300">
                  {card.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}