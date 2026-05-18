const changeKpis = [
  {
    title: "Transformation Readiness",
    value: "Moderate",
    href: "#executive-change-assessment",
  },
  {
    title: "Leadership Alignment",
    value: "Critical",
    href: "#change-risk-areas",
  },
  {
    title: "Adaptive Capability",
    value: "Growing",
    href: "#adaptive-change",
  },
  {
    title: "Trust & Participation",
    value: "Essential",
    href: "#human-transformation",
  },
];

const changeFailureAreas = [
  {
    title: "Fear Of Loss",
    color: "text-rose-300",
    border: "border-rose-500/20",
    text: "Employees often resist the perceived losses connected to change, including status, control, familiarity, relationships, job security, routines, and confidence.",
  },
  {
    title: "Weak Communication",
    color: "text-amber-300",
    border: "border-amber-500/20",
    text: "Poor communication creates uncertainty, rumours, confusion, mistrust, and resistance throughout the organization.",
  },
  {
    title: "Leadership Misalignment",
    color: "text-cyan-300",
    border: "border-cyan-500/20",
    text: "When leadership teams send inconsistent messages, employees lose confidence in the direction and seriousness of the initiative.",
  },
  {
    title: "Technical-Only Thinking",
    color: "text-indigo-300",
    border: "border-indigo-500/20",
    text: "Organizations frequently focus only on systems, processes, technology, and structure while ignoring adaptive human challenges.",
  },
  {
    title: "Lack Of Participation",
    color: "text-emerald-300",
    border: "border-emerald-500/20",
    text: "People support change more effectively when they are involved in discussions, problem-solving, experimentation, and ownership of solutions.",
  },
  {
    title: "Unrealistic Speed",
    color: "text-purple-300",
    border: "border-purple-500/20",
    text: "Excessive pressure and rapid transformation can overwhelm teams, increase stress, reduce learning capacity, and create burnout.",
  },
];

const changePrinciples = [
  {
    title: "Observe From The Gallery",
    text: "Step back from operational noise to diagnose patterns, pressure points, resistance, bottlenecks, and system behaviour objectively.",
  },
  {
    title: "Regulate Organizational Pressure",
    text: "Too little pressure creates stagnation. Too much pressure creates panic. Productive change requires balanced disequilibrium.",
  },
  {
    title: "Promote Public Learning",
    text: "Encourage employees and departments to learn together openly, discuss operational realities honestly, and solve problems collaboratively.",
  },
  {
    title: "Build Trust During Uncertainty",
    text: "Trust becomes even more important during organizational transition. Honest communication and realistic expectations are essential.",
  },
];

const transformationPillars = [
  {
    title: "Trust",
    color: "text-cyan-300",
    text: "Build organizational confidence and transparency.",
  },
  {
    title: "Learning",
    color: "text-emerald-300",
    text: "Create adaptive and continuously improving teams.",
  },
  {
    title: "Ownership",
    color: "text-amber-300",
    text: "Encourage accountability and participation at every level.",
  },
  {
    title: "Resilience",
    color: "text-purple-300",
    text: "Strengthen long-term organizational adaptability.",
  },
];

export default function ChangeManagementIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="bg-[linear-gradient(to_right,#020617,#1e1b4b,#581c87)] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-5xl">
            <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-200">
              MBNCON Change Management Intelligence System
            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
              Change Is Not The Problem.
              <br />
              Unmanaged Transition Is.
            </h1>

            <p className="mt-10 max-w-4xl text-xl leading-9 text-slate-300">
              Organizations operate in continuously changing environments.
              Technology, customer expectations, competition, regulation,
              economic pressure, workforce behaviour, and global events
              constantly reshape operational reality. Sustainable organizations
              must build adaptive capability instead of relying only on rigid
              structures and historical routines.
            </p>

            <section
              id="enterprise-kpis"
              className="mt-12 grid scroll-mt-28 grid-cols-1 gap-4 md:grid-cols-4"
            >
              {changeKpis.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  className="rounded-2xl border border-cyan-500/20 bg-black/30 p-5 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl"
                >
                  <p className="text-sm text-slate-400">{card.title}</p>

                  <h2 className="mt-3 text-3xl font-bold text-cyan-300">
                    {card.value}
                  </h2>

                  <p className="mt-3 text-xs text-slate-500">
                    Click to review change intelligence
                  </p>
                </a>
              ))}
            </section>

            <section
              id="executive-change-assessment"
              className="mt-10 scroll-mt-28 rounded-3xl border border-cyan-500/20 bg-black/30 p-8"
            >
              <p className="text-sm uppercase tracking-widest text-cyan-300">
                Executive Change Assessment
              </p>

              <h2 className="mt-2 text-4xl font-black">
                Human Resistance Is The Core Risk
              </h2>

              <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
                Most organizational change failures originate from unmanaged
                emotional transition, leadership inconsistency, communication
                gaps, operational fear, and weak participation systems rather
                than technical weakness alone.
              </p>
            </section>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 max-w-4xl">
            <h2 className="text-4xl font-black">
              Why Change Initiatives Fail
            </h2>

            <p className="mt-6 text-xl leading-9 text-slate-300">
              Most organizational change programs fail not because the strategy
              is technically wrong, but because organizations underestimate
              human behaviour, emotional resistance, trust breakdown,
              communication gaps, political pressure, and operational fear.
            </p>
          </div>

          <div
            id="change-risk-areas"
            className="grid scroll-mt-28 gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {changeFailureAreas.map((item) => (
              <a
                key={item.title}
                href="#adaptive-change"
                className={`rounded-3xl border bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl ${item.border}`}
              >
                <h3 className={`text-2xl font-bold ${item.color}`}>
                  {item.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-300">
                  {item.text}
                </p>

                <p className="mt-4 text-xs text-slate-500">
                  Click to review adaptive change principles
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(to_right,#0f172a,#312e81)] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div
            id="adaptive-change"
            className="grid scroll-mt-28 gap-14 lg:grid-cols-2"
          >
            <div>
              <h2 className="text-4xl font-black">
                Technical vs Adaptive Change
              </h2>

              <div className="mt-10 space-y-8">
                <a
                  href="#human-transformation"
                  className="block rounded-3xl border border-cyan-500/20 bg-black/30 p-8 transition hover:-translate-y-1 hover:border-cyan-400/70 hover:shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-cyan-300">
                    Technical Change
                  </h3>

                  <ul className="mt-5 space-y-3 leading-8 text-slate-300">
                    <li>• Existing expertise already available</li>
                    <li>• Solutions are largely known</li>
                    <li>• Clear procedures can be applied</li>
                    <li>• Faster implementation possible</li>
                    <li>• Examples: software upgrade, machine repair</li>
                  </ul>
                </a>

                <a
                  href="#human-transformation"
                  className="block rounded-3xl border border-amber-500/20 bg-black/30 p-8 transition hover:-translate-y-1 hover:border-amber-400/70 hover:shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-amber-300">
                    Adaptive Change
                  </h3>

                  <ul className="mt-5 space-y-3 leading-8 text-slate-300">
                    <li>• Requires behavioural transformation</li>
                    <li>• Requires learning and experimentation</li>
                    <li>• Involves emotional adjustment</li>
                    <li>• Often contains uncertainty</li>
                    <li>• Requires trust and collaboration</li>
                  </ul>
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-black text-indigo-300">
                MBN Change Intelligence Principles
              </h2>

              <div className="mt-10 space-y-6">
                {changePrinciples.map((item) => (
                  <a
                    key={item.title}
                    href="#human-transformation"
                    className="block rounded-2xl bg-slate-900 p-6 transition hover:-translate-y-1 hover:bg-slate-800 hover:shadow-xl"
                  >
                    <h3 className="text-xl font-bold">{item.title}</h3>

                    <p className="mt-3 leading-8 text-slate-300">
                      {item.text}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="human-transformation"
        className="scroll-mt-28 px-6 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-indigo-500/20 bg-[linear-gradient(to_right,#312e81,#0f172a,#581c87)] p-12">
            <h2 className="text-5xl font-black">
              Human-Centered Transformation
            </h2>

            <p className="mt-8 max-w-5xl text-xl leading-9 text-slate-300">
              MBN Consultancy integrates operational excellence, adaptive
              leadership, empowerment systems, continuous improvement, and human
              behaviour intelligence into one transformation framework. The goal
              is not only operational efficiency, but long-term organizational
              resilience, learning capability, and sustainable performance.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {transformationPillars.map((item) => (
                <a
                  key={item.title}
                  href="#enterprise-kpis"
                  className="rounded-2xl bg-black/40 p-6 transition hover:-translate-y-1 hover:bg-black/60 hover:shadow-xl"
                >
                  <h3 className={`text-2xl font-bold ${item.color}`}>
                    {item.title}
                  </h3>

                  <p className="mt-3 text-slate-300">
                    {item.text}
                  </p>
                </a>
              ))}
            </div>

            <div className="mt-12 rounded-3xl border border-cyan-500/20 bg-black/40 p-8">
              <p className="text-sm uppercase tracking-widest text-cyan-300">
                AI Recommendation
              </p>

              <h2 className="mt-3 text-3xl font-black">
                Build Adaptive Organizations, Not Rigid Structures
              </h2>

              <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-300">
                Sustainable transformation requires trust, participation,
                learning, experimentation, emotional resilience, leadership
                consistency, and operational transparency. Human-centered
                adaptive capability should become part of everyday management
                systems rather than temporary change programs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}