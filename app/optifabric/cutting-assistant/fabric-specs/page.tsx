import Link from "next/link";

export default function FabricSpecsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <Link
          href="/optifabric/cutting-assistant/upload"
          className="text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Pattern Upload
        </Link>

        <div className="mt-8 rounded-3xl bg-slate-900 border border-slate-700 p-8">

          <h1 className="text-4xl font-bold mb-3">
            Fabric & Lay Specification
          </h1>

          <p className="text-slate-300">
            These engineering parameters allow OptiFabric AI to estimate
            marker efficiency, fabric utilization and cutting behaviour.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          {/* Fabric Width */}

          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

            <h2 className="text-xl font-bold mb-4">
              Fabric Width
            </h2>

            <input
              type="number"
              placeholder="Example: 60"
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4"
            />

            <p className="text-cyan-300 mt-4 font-semibold">
              Why does AI ask this?
            </p>

            <p className="text-slate-300 text-sm mt-2">
              Fabric width determines how many pattern pieces can fit
              across the marker and directly affects fabric consumption.
            </p>

          </div>

          {/* GSM */}

          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

            <h2 className="text-xl font-bold mb-4">
              Fabric GSM
            </h2>

            <input
              type="number"
              placeholder="Example: 180"
              className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4"
            />

            <p className="text-cyan-300 mt-4 font-semibold">
              Why does AI ask this?
            </p>

            <p className="text-slate-300 text-sm mt-2">
              GSM influences spreading behaviour, compression and production planning.
            </p>

          </div>

          {/* Fabric Type */}

          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

            <h2 className="text-xl font-bold mb-4">
              Fabric Type
            </h2>

            <select className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4">

              <option>Single Jersey</option>
              <option>Interlock</option>
              <option>Rib</option>
              <option>Pique</option>
              <option>Woven</option>
              <option>Denim</option>
              <option>Fleece</option>

            </select>

            <p className="text-cyan-300 mt-4 font-semibold">
              Why does AI ask this?
            </p>

            <p className="text-slate-300 text-sm mt-2">
              Different fabrics require different cutting rules and marker optimisation.
            </p>

          </div>

          {/* Shade */}

          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6">

            <h2 className="text-xl font-bold mb-4">
              Shade Lot
            </h2>

            <select className="w-full rounded-xl bg-slate-800 border border-slate-600 p-4">

              <option>Single Shade</option>
              <option>Multiple Shades</option>

            </select>

            <p className="text-cyan-300 mt-4 font-semibold">
              Why does AI ask this?
            </p>

            <p className="text-slate-300 text-sm mt-2">
              Shade grouping affects spreading sequence and bundle integrity.
            </p>

          </div>

        </div>

        <div className="mt-10 flex justify-end">

          <Link
            href="/optifabric/cutting-assistant/pattern-analysis"
            className="rounded-2xl bg-cyan-500 px-8 py-4 text-slate-950 font-bold hover:bg-cyan-400"
          >
            Continue →
          </Link>

        </div>

      </div>
    </main>
  );
}