"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function InnerGameOfManagementPage() {
  const leadershipAreas = [
    {
      title: "Self-Awareness",
      desc:
        "Understand your own thinking, reactions, habits, and leadership style before trying to improve others.",
    },
    {
      title: "Focus & Attention",
      desc:
        "Develop the ability to stay present, listen deeply, observe facts, and avoid distraction during management decisions.",
    },
    {
      title: "Confidence Without Ego",
      desc:
        "Build calm leadership confidence while avoiding defensive behavior, blame culture, or command-and-control habits.",
    },
    {
      title: "Listening Leadership",
      desc:
        "Improve communication by listening to employees, customers, suppliers, and frontline realities before acting.",
    },
    {
      title: "Coaching Mindset",
      desc:
        "Shift from only giving instructions to developing people through questions, support, feedback, and trust.",
    },
    {
      title: "Decision Quality",
      desc:
        "Reduce emotional reactions and improve decisions through observation, reflection, evidence, and learning.",
    },
  ];

  const performanceFeatures = [
    "reduce internal interference",
    "improve calm decision-making",
    "increase employee trust",
    "strengthen communication",
    "coach instead of control",
    "observe before judging",
    "build learning culture",
    "improve meeting quality",
    "reduce workplace conflict",
    "support psychological safety",
    "improve accountability",
    "develop future leaders",
  ];

  const managementBehaviours = [
    "Listening before reacting",
    "Asking better questions",
    "Coaching team members",
    "Giving constructive feedback",
    "Managing pressure calmly",
    "Handling disagreement professionally",
    "Making decisions based on facts",
  ];

  const businessBenefits = [
    "Better leadership effectiveness",
    "Stronger employee engagement",
    "Improved productivity",
    "Fewer unnecessary conflicts",
    "Faster problem-solving",
    "Better change management",
    "Healthier workplace culture",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
              Management Excellence • Human Performance
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              Inner Game of Management
            </h1>

            <p className="mt-8 text-xl leading-9 text-white/85">
              High-performing management begins inside the manager — with focus,
              self-awareness, confidence, listening, emotional control,
              coaching mindset, decision quality, and the ability to reduce
              internal interference while improving team performance.
            </p>
          </div>
        </div>
      </section>

      {/* LEADERSHIP AREAS */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {leadershipAreas.map((item) => {
              const id = slugify(item.title);

              return (
                <a
                  key={item.title}
                  href={`#${id}`}
                  className="scroll-mt-28 rounded-3xl border border-purple-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <h2
                    id={id}
                    className="text-2xl font-bold"
                  >
                    {item.title}
                  </h2>

                  <p className="mt-4 leading-7 text-gray-600">
                    {item.desc}
                  </p>
                </a>
              );
            })}
          </div>

          {/* PERFORMANCE */}
          <section className="mt-24 rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-bold">
              From Inner Game to Management Performance
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {performanceFeatures.map((feature) => {
                const id = slugify(feature);

                return (
                  <div
                    key={feature}
                    id={id}
                    className="scroll-mt-28 rounded-2xl bg-purple-50 p-5 text-lg font-medium capitalize transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {feature}
                  </div>
                );
              })}
            </div>
          </section>

          {/* MANAGEMENT GRID */}
          <div className="mt-24 grid gap-10 lg:grid-cols-2">
            {/* BEHAVIOURS */}
            <section className="rounded-3xl bg-slate-900 p-10 text-white shadow-xl">
              <h2 className="text-3xl font-bold">
                Management Behaviours We Improve
              </h2>

              <ul className="mt-8 space-y-4 text-lg leading-8 text-gray-300">
                {managementBehaviours.map((item) => {
                  const id = slugify(item);

                  return (
                    <li
                      key={item}
                      id={id}
                      className="scroll-mt-28 rounded-xl bg-white/5 p-3 transition duration-300 hover:bg-white/10"
                    >
                      • {item}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* BENEFITS */}
            <section className="rounded-3xl bg-purple-700 p-10 text-white shadow-xl">
              <h2 className="text-3xl font-bold">
                Business Benefits
              </h2>

              <ul className="mt-8 space-y-4 text-lg leading-8 text-purple-100">
                {businessBenefits.map((item) => {
                  const id = slugify(item);

                  return (
                    <li
                      key={item}
                      id={id}
                      className="scroll-mt-28 rounded-xl bg-white/10 p-3 transition duration-300 hover:bg-white/20"
                    >
                      • {item}
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* CONSULTANCY CTA */}
          <section className="mt-24 rounded-3xl bg-purple-700 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <h2 className="text-5xl font-extrabold">
              Better Managers Build Better Organizations
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-purple-100">
              MBN Consultancy helps managers and leaders improve performance
              from the inside out — combining human psychology, operational
              excellence, coaching methods, and AI-supported management systems.
            </p>

            <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-purple-700 transition duration-300 hover:scale-105 hover:shadow-xl">
              Request Management Consultation
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}