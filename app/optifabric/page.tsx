import Link from "next/link";

const modules = [
  ["Pattern Upload", "Upload pattern photos/PDF with 12-inch or 30 cm scale.", "/optifabric/upload-pattern"],
  ["Workflow Explanation", "Learn why OptiFabric asks for each engineering input.", "/optifabric/workflow"],
  ["Fabric & Lay Specs", "Fabric type, GSM, thickness, layers, bundle and shade lot.", "/optifabric/fabric-engineering"],
  ["Marker Optimization", "Generate AI layout, utilization, waste and saving.", "/optifabric/marker-optimization"],
  ["Cutting Engineering", "Blade, machine, operator skill, cutting risk and time.", "/optifabric/cutting-engineering"],
  ["Engineering Report", "Generate PDF cutting layout and savings report.", "/optifabric/engineering-report"],
];

export default function OptiFabricHomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-blue-900 p-8 text-white shadow-xl">
        <div className="max-w-5xl">
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-200">
            MBNCON AI Engineering Solutions
          </div>

          <h1 className="text-4xl font-extrabold md:text-6xl">
            OptiFabric AI
          </h1>

          <p className="mt-4 max-w-3xl text-xl text-blue-100">
            AI Fabric Cutting & Engineering Optimization Platform for garment
            factories, cutting masters and production teams.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/optifabric/upload-pattern"
              className="rounded-xl bg-white px-6 py-3 font-bold text-blue-900 hover:bg-blue-50"
            >
              Start Optimization
            </Link>
<Link
  href="/optifabric/cutting-assistant"
  className="rounded-2xl bg-cyan-500 px-6 py-4 text-slate-950 font-bold hover:bg-cyan-400"
>
  Start AI Cutting Assistant
</Link>
            <Link
              href="/optifabric/workflow"
              className="rounded-xl border border-white px-6 py-3 font-bold text-white hover:bg-white hover:text-blue-900"
            >
              How It Works
            </Link>
          </div>
          
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          ["Fabric Saving", "Reduce waste through better marker and lay planning."],
          ["Cutting Accuracy", "Use scale, pattern names and AI layout guidance."],
          ["Factory Profit", "Compare current consumption with AI recommendation."],
        ].map((item) => (
          <div key={item[0]} className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-slate-800">{item[0]}</h2>
            <p className="mt-2 text-slate-600">{item[1]}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-slate-800">
          OptiFabric AI Modules
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module[0]}
              href={module[2]}
              className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-xl font-bold text-blue-800">
                {module[0]}
              </h3>

              <p className="mt-3 text-slate-600">
                {module[1]}
              </p>

              <div className="mt-5 font-semibold text-blue-700">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-green-50 p-6 shadow">
        <h2 className="text-2xl font-bold text-green-800">
          Why factories will use OptiFabric AI
        </h2>

        <p className="mt-3 max-w-4xl text-slate-700">
          OptiFabric AI does not only create a layout. It explains the
          engineering reason, recommends fabric and lay settings, calculates
          savings, supports multilingual users, and prepares a professional PDF
          cutting report for future reference by article ID.
        </p>
      </section>
    </main>
  );
}