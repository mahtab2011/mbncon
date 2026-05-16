import DashboardShell from "@/components/software/DashboardShell";
import KpiCard from "@/components/software/KpiCard";
import AlertPanel from "@/components/software/AlertPanel";
import ScoreRing from "@/components/software/ScoreRing";

export default function LeanKaizenDashboardPage() {
  return (
    <DashboardShell
      title="Lean & Kaizen Intelligence Dashboard"
      subtitle="Track waste reduction, workplace improvement, Gemba observations, Kaizen actions, and continuous improvement performance."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Kaizen Actions" value="24" change="+6 this month" risk="Low" />
        <KpiCard title="Muda Issues" value="11" change="3 high priority" risk="Medium" />
        <KpiCard title="Gemba Findings" value="18" change="Shop-floor observations" risk="Medium" />
        <KpiCard title="Improvement Score" value="82%" change="Good progress" risk="Low" />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <ScoreRing label="Lean Score" score={82} />
        <ScoreRing label="Kaizen Closure" score={76} />
        <ScoreRing label="Waste Control" score={69} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <AlertPanel
          title="AI Lean Observation"
          message="The current improvement pattern shows positive Kaizen activity, but Muda issues remain visible in waiting time, material movement, and rework areas."
          severity="warning"
        />

        <AlertPanel
          title="Recommended Management Action"
          message="Prioritize Gemba walks in high-rework areas, assign Kaizen owners, and review waste reduction progress weekly."
          severity="info"
        />
      </div>

      <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-950">
          Lean / Kaizen Focus Areas
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
  "Overproduction",
  "Waiting Time",
  "Transport Waste",
  "Excess Inventory",
  "Unnecessary Motion",
  "Over Processing",
  "Defects / Rework",
  "Unused Employee Ideas",
].map((item) => {
  return (
    <div
      key={item}
      className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"
    >
      <p className="font-semibold text-neutral-900">{item}</p>

      <p className="mt-2 text-sm leading-7 text-neutral-600">
        Track, score, assign owner, and monitor improvement actions.
      </p>
    </div>
  );
})}
        </div>
      </div>
    </DashboardShell>
  );
}