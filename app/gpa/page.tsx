import Link from "next/link";


const gpaCards = [
  {
    title: "GPA Command Centre",
    subtitle: "Factory-wide productivity intelligence dashboard",
    href: "/gpa/dashboard",
  },
  {
    title: "Bottleneck Identification & Resolution",
    subtitle: "Detect constraints, delays, line imbalance and lost output",
    href: "/gpa/bottleneck-centre",
  },
  {
    title: "Line Productivity Control",
    subtitle: "Track output, efficiency, manpower and target achievement",
    href: "/gpa/line-productivity",
  },
  {
    title: "MBO & Division of Work",
    subtitle: "Set objectives, assign responsibility and monitor execution",
    href: "/gpa/mbo-centre",
  },
  {
    title: "Lean, Kaizen & Waste Control",
    subtitle: "Control muda, rework, idle time and process waste",
    href: "/gpa/lean-kaizen",
  },
  {
    title: "Executive Factory Health",
    subtitle: "AI-based factory productivity score and action priorities",
    href: "/gpa/factory-health",
  },
];

export default function GPAPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
            MBNCON Manufacturing Intelligence
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Garments Productivity App
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            AI-powered productivity control system for garments factories,
            covering bottleneck identification, line balancing, manpower
            utilization, Lean Kaizen, MBO, supervisor accountability and
            executive decision support.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/gpa/dashboard"
              className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Open GPA Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-800"
            >
              Back to MBNCON
            </Link>
          </div>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gpaCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-slate-800"
            >
              <h2 className="text-xl font-bold text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {card.subtitle}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">GPA Build Sequence</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-emerald-400">Step 01</p>
              <h3 className="mt-2 font-semibold">Dashboard</h3>
              <p className="mt-2 text-sm text-slate-300">
                Factory productivity score, line efficiency and alerts.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-emerald-400">Step 02</p>
              <h3 className="mt-2 font-semibold">Bottleneck Centre</h3>
              <p className="mt-2 text-sm text-slate-300">
                Theory of constraints, bottleneck ranking and action plan.
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-emerald-400">Step 03</p>
              <h3 className="mt-2 font-semibold">Execution Control</h3>
              <p className="mt-2 text-sm text-slate-300">
                MBO, division of work, supervisor ownership and follow-up.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}