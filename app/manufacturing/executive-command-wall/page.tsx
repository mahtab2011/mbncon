"use client";
import {
  productionSummary,
  executiveAlerts,
  factoryHealth,
} from "@/lib/manufacturing/manufacturingData";

type Alert = {
  title: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
};

const alerts: Alert[] = executiveAlerts.map((item: typeof executiveAlerts[number]) => ({
  title: item.title,
  severity:
    item.severity === "CRITICAL"
      ? "CRITICAL"
      : item.severity === "HIGH"
      ? "WARNING"
      : "INFO",
}));

function alertColor(level: Alert["severity"]) {
  switch (level) {
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    case "WARNING":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-green-100 text-green-700";
  }
}

export default function ExecutiveCommandWallPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">

      <div className="mb-10 flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Executive Command Wall
          </h1>

          <p className="mt-3 text-slate-300">
            Live enterprise manufacturing intelligence
          </p>

        </div>

        <div className="rounded-xl bg-green-600 px-6 py-4 text-center">

          <div className="text-sm uppercase">
            Factory Health
          </div>

          <div className="text-4xl font-bold">
            91%
          </div>

        </div>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <KPI
          title="Production"
          value="2,679"
          color="text-green-400"
        />

        <KPI
          title="Efficiency"
          value="89%"
          color="text-blue-400"
        />

        <KPI
          title="Average DHU"
          value="3.7"
          color="text-red-400"
        />

        <KPI
          title="Shipment Ready"
          value="2,345"
          color="text-purple-400"
        />

      </div>

      <div className="grid gap-8 xl:grid-cols-3">

        <section className="rounded-xl bg-slate-900 p-6">

          <h2 className="mb-5 text-2xl font-bold text-red-400">
            Executive Alerts
          </h2>

          <div className="space-y-4">

            {alerts.map((alert) => (

              <div
                key={alert.title}
                className={`rounded-lg p-4 font-semibold ${alertColor(
                  alert.severity
                )}`}
              >
                {alert.title}
              </div>

            ))}

          </div>

        </section>

        <section className="rounded-xl bg-slate-900 p-6">

          <h2 className="mb-5 text-2xl font-bold text-blue-400">
            AI Executive Decisions
          </h2>

          <div className="space-y-4">

            <Decision
              text="Move 2 operators to Line L-003"
            />

            <Decision
              text="Approve hood fabric replenishment"
            />

            <Decision
              text="Complete MC-014 maintenance"
            />

            <Decision
              text="Increase inline QC inspection"
            />

            <Decision
              text="Review shipment schedule"
            />

          </div>

        </section>

        <section className="rounded-xl bg-slate-900 p-6">

          <h2 className="mb-5 text-2xl font-bold text-green-400">
            AI Predictions
          </h2>

          <Prediction
            title="Shipment Delay Risk"
            value="18%"
          />

          <Prediction
            title="Machine Failure Risk"
            value="22%"
          />

          <Prediction
            title="Quality Risk"
            value="14%"
          />

          <Prediction
            title="Profit Leakage"
            value="9%"
          />

          <Prediction
            title="Buyer Satisfaction"
            value="96%"
          />

        </section>

      </div>

      <section className="mt-10 rounded-xl bg-slate-900 p-8">

        <h2 className="text-3xl font-bold text-cyan-400">
          AI Command Recommendation
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-300">

          Overall factory health remains stable.

          Immediate attention should be focused on
          Line L-003 due to simultaneous material shortage,
          machine downtime and elevated DHU.

          AI estimates that immediate corrective action
          can recover approximately 4–6% production
          efficiency before the next shipment window.

        </p>

      </section>

    </main>
  );
}

function KPI({
  title,
  value,
  color,
}:{
  title:string;
  value:string;
  color:string;
}){
  return(
    <div className="rounded-xl bg-slate-900 p-6">

      <p className="text-slate-400">
        {title}
      </p>

      <h2 className={`mt-3 text-5xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  );
}

function Decision({
  text,
}:{
  text:string;
}){
  return(
    <div className="rounded-lg bg-slate-800 p-4">
      {text}
    </div>
  );
}

function Prediction({
  title,
  value,
}:{
  title:string;
  value:string;
}){
  return(
    <div className="mb-4 rounded-lg bg-slate-800 p-4">

      <div className="text-sm text-slate-400">
        {title}
      </div>

      <div className="mt-2 text-3xl font-bold text-green-400">
        {value}
      </div>

    </div>
  );
}