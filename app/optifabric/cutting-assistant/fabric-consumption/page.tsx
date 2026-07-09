import Link from "next/link";

import {
  calculateFabricConsumption,
} from "@/lib/optifabric/fabricConsumptionEngine";

export default function FabricConsumptionPage() {
  const result = calculateFabricConsumption({
    garmentAreaSqInches: 168,
    markerAreaSqInches: 188.16,
    fabricWidthInches: 60,
    garmentsPerMarker: 8,
    orderQuantity: 5000,
    fabricPricePerYard: 2.5,
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/optifabric/cutting-assistant/marker-layout"
          className="text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Marker Layout
        </Link>

        <section className="mt-8 rounded-3xl bg-slate-900 border border-slate-700 p-8">
          <p className="text-cyan-300 font-semibold mb-3">
            Block 007A · Engineering Fabric Intelligence
          </p>

          <h1 className="text-4xl font-bold mb-4">
            AI Fabric Consumption Intelligence
          </h1>

          <p className="text-slate-300 max-w-3xl">
            OptiFabric AI calculates consumption from square inches, marker
            area, utilization, air area, fabric width, order quantity and fabric
            cost.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">Area-Based Result</h2>

            <p>Garment Area: {result.garmentAreaSqInches} sq inches</p>

            <p className="mt-3">
              Marker Area: {result.markerAreaSqInches} sq inches
            </p>

            <p className="mt-3">
              Air Area / Unused Space: {result.airAreaSqInches} sq inches
            </p>

            <p className="mt-3">
              Marker Efficiency: {result.markerEfficiency}%
            </p>

            <p className="mt-3">
              Fabric Utilization: {result.utilizationPercent}%
            </p>

            <p className="mt-3">
              Linear Length Per Marker:{" "}
              {result.linearLengthPerMarkerInches} inches
            </p>

            <p className="mt-3">
              Consumption Per Garment:{" "}
              {result.consumptionPerGarmentYards} yards
            </p>

            <p className="mt-3 font-bold text-cyan-300">
              Total Order Fabric: {result.totalOrderYards} yards
            </p>

            <p className="mt-3 font-bold text-cyan-300">
              Estimated Fabric Cost: ${result.estimatedFabricCost}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-4">AI Engineering Notes</h2>

            <ul className="space-y-2 text-slate-300">
              {result.notes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-cyan-950/40 border border-cyan-800 p-6">
          <h2 className="text-xl font-bold text-cyan-300">
            Why does AI calculate consumption in square inches?
          </h2>

          <p className="mt-3 text-slate-300">
            Pattern and marker geometry are area-based. AI first calculates
            square inches, then converts that area into linear fabric length by
            dividing by usable fabric width. This gives a more professional and
            auditable cutting calculation.
          </p>
        </section>

        <div className="mt-10 flex justify-end">
          <Link
            href="/optifabric/cutting-assistant/savings"
            className="rounded-2xl bg-cyan-500 px-8 py-4 text-slate-950 font-bold hover:bg-cyan-400"
          >
            Continue →
          </Link>
        </div>
      </div>
    </main>
  );
}