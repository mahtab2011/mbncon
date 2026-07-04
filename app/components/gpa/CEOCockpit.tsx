type Props = {
  factoryHealth: number;
  productionRisk: string;
  bottleneck: string;
  lineBalancing: number;
  operatorProductivity: number;
  executiveAlerts: number;
  executiveRecommendations: number;
};

export default function CEOCockpit({
  factoryHealth,
  productionRisk,
  bottleneck,
  lineBalancing,
  operatorProductivity,
  executiveAlerts,
  executiveRecommendations,
}: Props) {
  return (
    <div className="rounded-2xl bg-slate-900 text-white p-8 shadow-xl">
      <h2 className="text-3xl font-bold">
        CEO Cockpit
      </h2>

      <p className="mt-2 text-slate-300">
        Enterprise Executive Command View
      </p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">

        <Metric
          title="Factory Health"
          value={`${factoryHealth}%`}
        />

        <Metric
          title="Production Risk"
          value={productionRisk}
        />

        <Metric
          title="Bottleneck"
          value={bottleneck}
        />

        <Metric
          title="Line Balance"
          value={`${lineBalancing}%`}
        />

        <Metric
          title="Operator"
          value={`${operatorProductivity}%`}
        />

        <Metric
          title="Alerts"
          value={String(executiveAlerts)}
        />

        <Metric
          title="Recommendations"
          value={String(executiveRecommendations)}
        />

      </div>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <div className="text-sm text-slate-400">
        {title}
      </div>

      <div className="mt-2 text-2xl font-bold">
        {value}
      </div>
    </div>
  );
}