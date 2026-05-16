"use client";

import { useMemo, useState } from "react";

type DefectRow = {
  defectType: string;
  quantity: number;
  estimatedLoss: number;
};

export default function WasteRejectionTrackingPage() {
  const [defectType, setDefectType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [estimatedLoss, setEstimatedLoss] = useState("");

  const [rows, setRows] = useState<DefectRow[]>([
    { defectType: "Stitching Defect", quantity: 156, estimatedLoss: 2340 },
    { defectType: "Skiving Defect", quantity: 88, estimatedLoss: 1320 },
    { defectType: "Leather Defect", quantity: 63, estimatedLoss: 945 },
    { defectType: "Moulding Defect", quantity: 42, estimatedLoss: 630 },
    { defectType: "Finishing Defect", quantity: 27, estimatedLoss: 405 },
  ]);

  const paretoRows = useMemo(() => {
    const grouped: Record<string, DefectRow> = {};

    rows.forEach((row) => {
      if (!grouped[row.defectType]) {
        grouped[row.defectType] = {
          defectType: row.defectType,
          quantity: 0,
          estimatedLoss: 0,
        };
      }

      grouped[row.defectType].quantity += row.quantity;
      grouped[row.defectType].estimatedLoss += row.estimatedLoss;
    });

    const sorted = Object.values(grouped).sort(
      (a, b) => b.quantity - a.quantity
    );

    const totalQuantity = sorted.reduce((sum, row) => sum + row.quantity, 0);

    let cumulative = 0;

    return sorted.map((row) => {
      const percentage =
        totalQuantity > 0 ? (row.quantity / totalQuantity) * 100 : 0;

      cumulative += percentage;

      return {
        ...row,
        percentage,
        cumulative,
      };
    });
  }, [rows]);

  const totalQuantity = rows.reduce((sum, row) => sum + row.quantity, 0);
  const totalLoss = rows.reduce((sum, row) => sum + row.estimatedLoss, 0);

  const addDefect = () => {
    const qty = Number(quantity);
    const loss = Number(estimatedLoss);

    if (!defectType || qty <= 0 || loss < 0) {
      alert("Please enter defect type, quantity, and estimated loss.");
      return;
    }

    setRows([
      ...rows,
      {
        defectType,
        quantity: qty,
        estimatedLoss: loss,
      },
    ]);

    setDefectType("");
    setQuantity("");
    setEstimatedLoss("");
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="bg-linear-to-r from-red-950 via-violet-900 to-blue-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-yellow-300">
            Live Waste & Rejection Tracking
          </p>

          <h1 className="max-w-5xl text-5xl font-extrabold leading-tight">
            Live Pareto Analysis from Defect Input Data
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-relaxed text-white/85">
            Enter rejection and waste data. The page automatically groups defect
            categories, calculates percentage contribution, builds cumulative
            Pareto ranking, and highlights the biggest quality-loss areas.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-red-100 p-8 shadow-md">
              <p className="text-sm font-bold uppercase tracking-wide text-red-700">
                Total Rejected / Waste Qty
              </p>
              <h2 className="mt-4 text-5xl font-extrabold text-red-950">
                {totalQuantity}
              </h2>
            </div>

            <div className="rounded-3xl bg-yellow-100 p-8 shadow-md">
              <p className="text-sm font-bold uppercase tracking-wide text-yellow-700">
                Estimated Loss
              </p>
              <h2 className="mt-4 text-5xl font-extrabold text-yellow-950">
                £{totalLoss.toLocaleString()}
              </h2>
            </div>

            <div className="rounded-3xl bg-blue-100 p-8 shadow-md">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Priority Defect
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-blue-950">
                {paretoRows[0]?.defectType || "No Data"}
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-md xl:col-span-1">
              <h2 className="text-3xl font-extrabold text-red-950">
                Add Defect / Waste Data
              </h2>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="font-bold text-slate-700">Defect Type</span>
                  <input
                    value={defectType}
                    onChange={(e) => setDefectType(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-red-600"
                    placeholder="Example: Stitching Defect"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">Quantity</span>
                  <input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    type="number"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-red-600"
                    placeholder="Example: 25"
                  />
                </label>

                <label className="block">
                  <span className="font-bold text-slate-700">
                    Estimated Loss Value
                  </span>
                  <input
                    value={estimatedLoss}
                    onChange={(e) => setEstimatedLoss(e.target.value)}
                    type="number"
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-red-600"
                    placeholder="Example: 375"
                  />
                </label>

                <button
                  onClick={addDefect}
                  className="w-full rounded-2xl bg-red-900 px-8 py-4 text-lg font-extrabold text-white shadow-md transition hover:bg-red-800"
                >
                  Add to Pareto Analysis
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-md xl:col-span-2">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Live Pareto Chart
              </h2>

              <div className="mt-8 space-y-5">
                {paretoRows.map((row) => (
                  <div key={row.defectType}>
                    <div className="mb-2 flex flex-wrap justify-between gap-3 text-lg font-bold">
                      <span>{row.defectType}</span>
                      <span>
                        {row.quantity} qty | {row.percentage.toFixed(1)}% |
                        cumulative {row.cumulative.toFixed(1)}%
                      </span>
                    </div>

                    <div className="h-6 rounded-full bg-slate-200">
                      <div
                        className="h-6 rounded-full bg-linear-to-r from-red-700 to-orange-400"
                        style={{ width: `${Math.min(row.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-yellow-50 p-6">
                <h3 className="text-2xl font-extrabold text-yellow-950">
                  Pareto Interpretation
                </h3>

                <p className="mt-4 text-lg leading-relaxed text-yellow-950">
                  The highest-ranked defects should be investigated first. The
                  goal is to identify the small number of defect categories
                  causing the largest share of quality loss, then run root-cause
                  analysis and corrective action on those priority areas.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-white shadow-md">
            <h2 className="text-3xl font-extrabold text-cyan-300">
              Data Table for Productivity Improvement Team
            </h2>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white/10 text-left">
                    <th className="rounded-l-xl p-4">Rank</th>
                    <th className="p-4">Defect Type</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Estimated Loss</th>
                    <th className="p-4">%</th>
                    <th className="rounded-r-xl p-4">Cumulative %</th>
                  </tr>
                </thead>

                <tbody>
                  {paretoRows.map((row, index) => (
                    <tr key={row.defectType} className="border-b border-white/10">
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{row.defectType}</td>
                      <td className="p-4">{row.quantity}</td>
                      <td className="p-4">£{row.estimatedLoss.toLocaleString()}</td>
                      <td className="p-4">{row.percentage.toFixed(1)}%</td>
                      <td className="p-4">{row.cumulative.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl bg-blue-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-blue-950">
                Live Input
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-blue-950">
                Quality teams, supervisors, and production staff can input
                defect quantities and estimated loss values during or after
                production.
              </p>
            </div>

            <div className="rounded-3xl bg-emerald-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-emerald-950">
                Live Prioritisation
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-emerald-950">
                The system automatically ranks defects so improvement teams can
                focus on the biggest causes of loss first.
              </p>
            </div>

            <div className="rounded-3xl bg-violet-100 p-8 shadow-md">
              <h3 className="text-2xl font-extrabold text-violet-950">
                Future Firebase Data
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-violet-950">
                Later, these rows can be saved to Firestore and used across the
                live KPI dashboard, AI assistant, management reports, and
                continuous improvement tracker.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}