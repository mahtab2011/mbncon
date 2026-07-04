export default function MarkerIntelligencePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-4xl font-bold text-blue-700">
          Marker Intelligence
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Marker Intelligence module is currently under development.
        </p>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-xl font-semibold text-blue-700">
            Planned Features
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
            <li>AI Marker Optimization</li>
            <li>Fabric Utilization Analysis</li>
            <li>Marker Efficiency Dashboard</li>
            <li>Cost Saving Recommendations</li>
            <li>Auto Marker Comparison</li>
          </ul>
        </div>
      </div>
    </main>
  );
}