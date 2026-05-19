import DashboardShell from "@/components/software/DashboardShell";
import KpiCard from "@/components/software/KpiCard";
import AlertPanel from "@/components/software/AlertPanel";
import ScoreRing from "@/components/software/ScoreRing";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const kpis = [
  { title: "Kaizen Actions", value: "24", change: "+6 this month", risk: "Low" },
  { title: "Muda Issues", value: "11", change: "3 high priority", risk: "Medium" },
  { title: "Gemba Findings", value: "18", change: "Shop-floor observations", risk: "Medium" },
  { title: "Improvement Score", value: "82%", change: "Good progress", risk: "Low" },
];

const focusAreas = [
  "Overproduction",
  "Waiting Time",
  "Transport Waste",
  "Excess Inventory",
  "Unnecessary Motion",
  "Over Processing",
  "Defects / Rework",
  "Unused Employee Ideas",
];

export default function LeanKaizenDashboardPage() {
  return (
    <DashboardShell
      title="Lean & Kaizen Intelligence Dashboard"
      subtitle="Track waste reduction, workplace improvement, Gemba observations, Kaizen actions, and continuous improvement performance."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <a
            key={kpi.title}
            href={`#${slugify(kpi.title)}`}
            className="block rounded-3xl transition hover:-translate-y-1 hover:shadow-lg"
          >
            <KpiCard
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              risk={kpi.risk}
            />
          </a>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <section id="lean-score" className="scroll-mt-28">
          <ScoreRing label="Lean Score" score={82} />
        </section>

        <section id="kaizen-closure" className="scroll-mt-28">
          <ScoreRing label="Kaizen Closure" score={76} />
        </section>

        <section id="waste-control" className="scroll-mt-28">
          <ScoreRing label="Waste Control" score={69} />
        </section>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section id="ai-lean-observation" className="scroll-mt-28">
          <AlertPanel
            title="AI Lean Observation"
            message="The current improvement pattern shows positive Kaizen activity, but Muda issues remain visible in waiting time, material movement, and rework areas."
            severity="warning"
          />
        </section>

        <section id="recommended-management-action" className="scroll-mt-28">
          <AlertPanel
            title="Recommended Management Action"
            message="Prioritize Gemba walks in high-rework areas, assign Kaizen owners, and review waste reduction progress weekly."
            severity="info"
          />
        </section>
      </div>

      <section
        id="lean-kaizen-focus-areas"
        className="mt-10 scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-neutral-950">
          Lean / Kaizen Focus Areas
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {focusAreas.map((item) => (
            <a
              key={item}
              id={slugify(item)}
              href={`#${slugify(item)}`}
              className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-md"
            >
              <p className="font-semibold text-neutral-900">{item}</p>

              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Track, score, assign owner, and monitor improvement actions.
              </p>
            </a>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <section
            key={kpi.title}
            id={slugify(kpi.title)}
            className="scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-neutral-500">{kpi.title}</p>
            <p className="mt-2 text-2xl font-bold text-neutral-950">
              {kpi.value}
            </p>
            <p className="mt-2 text-sm leading-7 text-neutral-600">
              {kpi.change}
            </p>
          </section>
        ))}
      </div>
    </DashboardShell>
  );
}