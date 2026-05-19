"use client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function LeadershipChallengeResiliencePage() {
  const leadershipFramework = [
    {
      title: "Get Above the Noise",
      desc:
        "Step back from daily pressure and observe patterns before reacting.",
    },
    {
      title: "Define the Real Work",
      desc:
        "Separate routine problems from deep behavioural or cultural challenges.",
    },
    {
      title: "Build Trust",
      desc:
        "Create confidence through listening, reliability, honesty, and follow-up.",
    },
    {
      title: "Lead Across Authority",
      desc:
        "Influence upward, sideways, and across departments, not only downward.",
    },
    {
      title: "Manage Conflict",
      desc:
        "Use disagreement as a source of learning instead of avoiding it.",
    },
    {
      title: "Return Work to People",
      desc:
        "Help teams take responsibility rather than depending only on managers.",
    },
    {
      title: "Anchor Yourself",
      desc:
        "Stay calm, purposeful, and resilient when change creates pressure.",
    },
    {
      title: "Follow Up Continuously",
      desc:
        "Behaviour change needs repeated communication, coaching, and review.",
    },
  ];

  const balconyThinking = [
    "Observe before reacting",
    "Diagnose before deciding",
    "Reflect before correcting",
    "See the whole system",
    "Notice resistance and loss",
    "Return with better action",
  ];

  const resilienceItems = [
    "Manage yourself under pressure",
    "Maintain purpose during uncertainty",
    "Build positive working relationships",
    "Learn from setbacks and mistakes",
    "Adapt your behaviour to changing conditions",
    "Create a personal resilience plan",
  ];

  const influenceItems = [
    "Lead with formal responsibility",
    "Lead beyond job boundaries",
    "Influence across departments",
    "Build credibility through action",
    "Earn trust from teams and peers",
    "Mobilize people without forcing them",
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HERO */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Management Excellence • Adaptive Leadership • Resilience
          </span>

          <h1 className="mt-6 max-w-5xl text-5xl font-extrabold leading-tight">
            Leadership Challenge & Resilience System
          </h1>

          <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
            MBN Consultancy helps managers move beyond routine management into
            adaptive leadership — the ability to mobilize people, build trust,
            handle resistance, and create new capacity during difficult change.
          </p>
        </div>
      </section>

      {/* MANAGEMENT VS ADAPTIVE */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-cyan-700">
                Routine Management
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-700">
                Routine management works when the problem is known, the solution
                is available, and people already have the skills to complete the
                work. It depends on process, discipline, expertise, and control.
              </p>

              <ul className="mt-6 space-y-3 text-slate-700">
                {[
                  "Known problem",
                  "Existing solution",
                  "Expert-driven",
                  "Procedure-based",
                  "Maintains stability",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-slate-100 p-3 transition duration-300 hover:bg-slate-200"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-violet-200 bg-violet-100 p-8 shadow-md transition duration-300 hover:shadow-xl">
              <h2 className="text-3xl font-bold text-violet-900">
                Adaptive Leadership
              </h2>

              <p className="mt-5 text-lg leading-8 text-violet-900">
                Adaptive leadership is needed when the challenge requires people
                to change behaviour, mindset, relationships, habits,
                priorities, or culture. The leader cannot simply give the
                answer; people must learn, adapt, and take ownership.
              </p>

              <ul className="mt-6 space-y-3 text-violet-900">
                {[
                  "Uncertain or changing problem",
                  "New learning required",
                  "Trust-driven",
                  "Behaviour-based",
                  "Builds new capacity",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-white/70 p-3 transition duration-300 hover:bg-white"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* FRAMEWORK */}
          <section className="mt-20 rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-extrabold">
              MBN Adaptive Leadership Framework
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {leadershipFramework.map((item) => {
                const id = slugify(item.title);

                return (
                  <section
                    key={item.title}
                    id={id}
                    className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <h3 className="text-xl font-bold text-cyan-700">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-700">
                      {item.desc}
                    </p>
                  </section>
                );
              })}
            </div>
          </section>

          {/* BALCONY THINKING */}
          <section className="mt-20 rounded-3xl bg-slate-900 p-10 text-white shadow-xl">
            <h2 className="text-4xl font-extrabold text-cyan-300">
              Balcony Thinking for Leaders
            </h2>

            <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-300">
              Leaders often become trapped on the “dance floor” of daily urgency.
              Balcony thinking means stepping back mentally, observing the whole
              system, understanding who is moving, who is resisting, what pattern
              is repeating, and what real work must be done next.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {balconyThinking.map((item) => {
                const id = slugify(item);

                return (
                  <div
                    key={item}
                    id={id}
                    className="scroll-mt-28 rounded-2xl bg-white/10 p-5 text-lg font-semibold text-cyan-100 transition duration-300 hover:bg-white/20 hover:shadow-xl"
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </section>

          {/* RESILIENCE & INFLUENCE */}
          <div className="mt-20 grid gap-8 lg:grid-cols-2">
            {/* RESILIENCE */}
            <section className="rounded-3xl bg-white p-10 shadow-xl transition duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-bold text-emerald-700">
                Resilience in Leadership
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-700">
                Resilience is the ability to stay steady, recover, adapt, and
                continue leading when change creates uncertainty, conflict,
                disappointment, pressure, or loss.
              </p>

              <ul className="mt-8 space-y-4 text-lg leading-8 text-slate-700">
                {resilienceItems.map((item) => {
                  const id = slugify(item);

                  return (
                    <li
                      key={item}
                      id={id}
                      className="scroll-mt-28 rounded-xl bg-emerald-50 p-4 transition duration-300 hover:bg-emerald-100"
                    >
                      • {item}
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* INFLUENCE */}
            <section className="rounded-3xl bg-violet-100 p-10 shadow-xl transition duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-bold text-violet-900">
                From Authority to Influence
              </h2>

              <p className="mt-6 text-lg leading-8 text-violet-900">
                Formal authority gives a manager a position. Informal authority
                is earned through trust, respect, credibility, and reliability.
                Sustainable leadership requires both.
              </p>

              <ul className="mt-8 space-y-4 text-lg leading-8 text-violet-900">
                {influenceItems.map((item) => {
                  const id = slugify(item);

                  return (
                    <li
                      key={item}
                      id={id}
                      className="scroll-mt-28 rounded-xl bg-white/70 p-4 transition duration-300 hover:bg-white"
                    >
                      • {item}
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* REFLECTION FORM */}
          <section className="mt-20 rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-extrabold">
              Leadership Reflection & Resilience Form
            </h2>

            <form className="mt-10 grid gap-6 md:grid-cols-2">
              <input
                className="rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-cyan-600 focus:bg-white"
                placeholder="Leadership challenge you are facing"
              />

              <select className="rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-cyan-600 focus:bg-white">
                <option>Routine / Technical Problem</option>
                <option>Adaptive Leadership Challenge</option>
                <option>Mixed Challenge</option>
                <option>Not Sure Yet</option>
              </select>

              <textarea
                className="min-h-36 rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-cyan-600 focus:bg-white md:col-span-2"
                placeholder="What is really happening? What patterns, resistance, emotions, or losses do you observe?"
              />

              <textarea
                className="min-h-36 rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-cyan-600 focus:bg-white md:col-span-2"
                placeholder="Who needs to learn, adapt, take responsibility, or change behaviour?"
              />

              <textarea
                className="min-h-36 rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-cyan-600 focus:bg-white md:col-span-2"
                placeholder="What action will you take next? How will you communicate, build trust, and follow up?"
              />

              <input
                className="rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-cyan-600 focus:bg-white"
                placeholder="Resilience habit to strengthen"
              />

              <input
                className="rounded-2xl border border-slate-300 bg-slate-50 p-5 outline-none transition focus:border-cyan-600 focus:bg-white"
                placeholder="Follow-up date"
                type="date"
              />

              <button
                type="button"
                className="rounded-full bg-cyan-700 px-10 py-5 text-lg font-bold text-white transition duration-300 hover:scale-[1.02] hover:bg-cyan-800 hover:shadow-xl md:col-span-2"
              >
                Save Leadership Reflection
              </button>
            </form>
          </section>

          {/* CTA */}
          <section className="mt-24 rounded-3xl bg-violet-700 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <h2 className="text-5xl font-extrabold leading-tight">
              Routine Management Keeps Work Moving.
              <br />
              Adaptive Leadership Builds the Future.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-violet-100">
              MBN Consultancy helps managers, supervisors, and teams develop the
              resilience, trust, communication, and adaptive capacity needed to
              lead through change.
            </p>

            <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-violet-700 transition duration-300 hover:scale-105 hover:shadow-xl">
              Request Leadership & Resilience Consultation
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}