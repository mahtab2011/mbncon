export default function LeadershipChallengeResiliencePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-950 to-violet-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <span className="rounded-full bg-violet-500/20 px-4 py-2 text-sm font-semibold text-violet-300">
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

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8">
            <h2 className="text-3xl font-bold text-cyan-300">
              Routine Management
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Routine management works when the problem is known, the solution
              is available, and people already have the skills to complete the
              work. It depends on process, discipline, expertise, and control.
            </p>

            <ul className="mt-6 space-y-3 text-slate-300">
              <li>• Known problem</li>
              <li>• Existing solution</li>
              <li>• Expert-driven</li>
              <li>• Procedure-based</li>
              <li>• Maintains stability</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-violet-700 bg-violet-900/50 p-8">
            <h2 className="text-3xl font-bold text-violet-200">
              Adaptive Leadership
            </h2>

            <p className="mt-5 text-lg leading-8 text-violet-100">
              Adaptive leadership is needed when the challenge requires people
              to change behaviour, mindset, relationships, habits, priorities,
              or culture. The leader cannot simply give the answer; people must
              learn, adapt, and take ownership.
            </p>

            <ul className="mt-6 space-y-3 text-violet-100">
              <li>• Uncertain or changing problem</li>
              <li>• New learning required</li>
              <li>• Trust-driven</li>
              <li>• Behaviour-based</li>
              <li>• Builds new capacity</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 rounded-3xl border border-slate-700 bg-slate-900 p-10">
          <h2 className="text-4xl font-extrabold">
            MBN Adaptive Leadership Framework
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Get Above the Noise",
                desc: "Step back from daily pressure and observe patterns before reacting.",
              },
              {
                title: "Define the Real Work",
                desc: "Separate routine problems from deep behavioural or cultural challenges.",
              },
              {
                title: "Build Trust",
                desc: "Create confidence through listening, reliability, honesty, and follow-up.",
              },
              {
                title: "Lead Across Authority",
                desc: "Influence upward, sideways, and across departments, not only downward.",
              },
              {
                title: "Manage Conflict",
                desc: "Use disagreement as a source of learning instead of avoiding it.",
              },
              {
                title: "Return Work to People",
                desc: "Help teams take responsibility rather than depending only on managers.",
              },
              {
                title: "Anchor Yourself",
                desc: "Stay calm, purposeful, and resilient when change creates pressure.",
              },
              {
                title: "Follow Up Continuously",
                desc: "Behaviour change needs repeated communication, coaching, and review.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-700 bg-slate-950 p-6"
              >
                <h3 className="text-xl font-bold text-cyan-300">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 rounded-3xl bg-linear-to-r from-cyan-900/70 to-violet-900/70 p-10">
          <h2 className="text-4xl font-extrabold">
            Balcony Thinking for Leaders
          </h2>

          <p className="mt-6 max-w-5xl text-xl leading-9 text-slate-200">
            Leaders often become trapped on the “dance floor” of daily urgency.
            Balcony thinking means stepping back mentally, observing the whole
            system, understanding who is moving, who is resisting, what pattern
            is repeating, and what real work must be done next.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              "Observe before reacting",
              "Diagnose before deciding",
              "Reflect before correcting",
              "See the whole system",
              "Notice resistance and loss",
              "Return with better action",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-950/70 p-5 text-lg font-semibold text-cyan-100"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-10">
            <h2 className="text-3xl font-bold text-emerald-300">
              Resilience in Leadership
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Resilience is the ability to stay steady, recover, adapt, and
              continue leading when change creates uncertainty, conflict,
              disappointment, pressure, or loss.
            </p>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-slate-300">
              <li>• Manage yourself under pressure</li>
              <li>• Maintain purpose during uncertainty</li>
              <li>• Build positive working relationships</li>
              <li>• Learn from setbacks and mistakes</li>
              <li>• Adapt your behaviour to changing conditions</li>
              <li>• Create a personal resilience plan</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-violet-700 bg-violet-900/50 p-10">
            <h2 className="text-3xl font-bold text-violet-100">
              From Authority to Influence
            </h2>

            <p className="mt-6 text-lg leading-8 text-violet-100">
              Formal authority gives a manager a position. Informal authority
              is earned through trust, respect, credibility, and reliability.
              Sustainable leadership requires both.
            </p>

            <ul className="mt-8 space-y-4 text-lg leading-8 text-violet-100">
              <li>• Lead with formal responsibility</li>
              <li>• Lead beyond job boundaries</li>
              <li>• Influence across departments</li>
              <li>• Build credibility through action</li>
              <li>• Earn trust from teams and peers</li>
              <li>• Mobilize people without forcing them</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 rounded-3xl border border-slate-700 bg-slate-900 p-10">
          <h2 className="text-4xl font-extrabold">
            Leadership Reflection & Resilience Form
          </h2>

          <form className="mt-10 grid gap-6 md:grid-cols-2">
            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white"
              placeholder="Leadership challenge you are facing"
            />

            <select className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white">
              <option>Routine / Technical Problem</option>
              <option>Adaptive Leadership Challenge</option>
              <option>Mixed Challenge</option>
              <option>Not Sure Yet</option>
            </select>

            <textarea
              className="min-h-36 rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white md:col-span-2"
              placeholder="What is really happening? What patterns, resistance, emotions, or losses do you observe?"
            />

            <textarea
              className="min-h-36 rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white md:col-span-2"
              placeholder="Who needs to learn, adapt, take responsibility, or change behaviour?"
            />

            <textarea
              className="min-h-36 rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white md:col-span-2"
              placeholder="What action will you take next? How will you communicate, build trust, and follow up?"
            />

            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white"
              placeholder="Resilience habit to strengthen"
            />

            <input
              className="rounded-2xl border border-slate-700 bg-slate-950 p-5 text-white"
              placeholder="Follow-up date"
              type="date"
            />

            <button
              type="button"
              className="rounded-full bg-linear-to-r from-cyan-500 to-violet-500 px-10 py-5 text-lg font-bold text-white md:col-span-2"
            >
              Save Leadership Reflection
            </button>
          </form>
        </div>

        <div className="mt-24 rounded-3xl bg-linear-to-r from-violet-600 to-cyan-600 p-12 text-center shadow-2xl">
          <h2 className="text-5xl font-extrabold">
            Routine Management Keeps Work Moving.
            <br />
            Adaptive Leadership Builds the Future.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-violet-100">
            MBN Consultancy helps managers, supervisors, and teams develop the
            resilience, trust, communication, and adaptive capacity needed to
            lead through change.
          </p>

          <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-violet-700 transition hover:scale-105">
            Request Leadership & Resilience Consultation
          </button>
        </div>
      </section>
    </main>
  );
}