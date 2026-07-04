"use client";

type LineDhuRow = {
  line: string;
  product: string;
  buyer: string;
  dhu: number;
  status: "Good" | "Monitor" | "Critical";
};

const lineDhuRows: LineDhuRow[] = [
  {
    line: "Line 01",
    product: "Polo Shirt",
    buyer: "M&S",
    dhu: 1.95,
    status: "Good",
  },
  {
    line: "Line 05",
    product: "Jacket",
    buyer: "Zara",
    dhu: 5.85,
    status: "Monitor",
  },
  {
    line: "Line 08",
    product: "Trouser",
    buyer: "Primark",
    dhu: 7.1,
    status: "Critical",
  },
];

export default function DhuDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
            Quality Intelligence Centre
          </p>

          <h1 className="mt-3 text-4xl font-black">
            DHU Dashboard
          </h1>

          <p className="mt-4 max-w-4xl text-slate-300">
            Executive quality monitoring for garment factories,
            production floors, sewing lines, buyers, styles and
            product categories.
          </p>
        </div>

        {/* Filters */}

        <section className="rounded-3xl border border-white/10 bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-cyan-200">
            Dashboard Filters
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-4">

            <select className="rounded-xl bg-slate-950 p-3">
              <option>All Factories</option>
            </select>

            <select className="rounded-xl bg-slate-950 p-3">
              <option>All Floors</option>
            </select>

            <select className="rounded-xl bg-slate-950 p-3">
              <option>All Lines</option>
            </select>

            <select className="rounded-xl bg-slate-950 p-3">
              <option>All Buyers</option>
<option>M&S</option>
<option>Primark</option>
<option>Zara</option>
<option>H&M</option>
<option>C&A</option>
<option>Next</option>
<option>Tesco</option>
<option>Walmart</option>
<option>Target</option>
<option>Aldi</option>
<option>Lidl</option>
            </select>

            <select className="rounded-xl bg-slate-950 p-3">
              <option>All Product Categories</option>
<option>Knit T-Shirt</option>
<option>Polo Shirt</option>
<option>Shirt</option>
<option>Trouser</option>
<option>Denim Jeans</option>
<option>Sweater</option>
<option>Jacket</option>
<option>Outerwear</option>
<option>Sportswear</option>
<option>Workwear</option>
<option>Lingerie</option>
<option>Children's Wear</option>
            </select>

            <select className="rounded-xl bg-slate-950 p-3">
              <option>All Styles</option>
            </select>

            <input
              type="date"
              className="rounded-xl bg-slate-950 p-3"
            />

            <input
              type="date"
              className="rounded-xl bg-slate-950 p-3"
            />

          </div>
        </section>

        {/* KPI */}

        <section className="mt-6 grid gap-4 md:grid-cols-4">

          <div className="rounded-3xl bg-green-900 p-6">
            <p>Overall DHU</p>
            <h2 className="mt-3 text-4xl font-black">2.48</h2>
          </div>

          <div className="rounded-3xl bg-blue-900 p-6">
            <p>Total Checked</p>
            <h2 className="mt-3 text-4xl font-black">152,450</h2>
          </div>

          <div className="rounded-3xl bg-red-900 p-6">
            <p>Total Defects</p>
            <h2 className="mt-3 text-4xl font-black">3,785</h2>
          </div>

          <div className="rounded-3xl bg-purple-900 p-6">
            <p>Lines Above Target</p>
            <h2 className="mt-3 text-4xl font-black">12</h2>
          </div>

        </section>

        {/* Line Performance */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6">

          <h2 className="text-2xl font-bold text-cyan-200">
            Line Wise DHU
          </h2>

          <table className="mt-6 w-full">

            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 text-left">Line</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Buyer</th>
                <th className="p-3 text-left">DHU</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
  {lineDhuRows.map((row) => (
    <tr key={`${row.line}-${row.buyer}-${row.product}`}>
      <td className="p-3">{row.line}</td>
      <td className="p-3">{row.product}</td>
      <td className="p-3">{row.buyer}</td>
      <td className="p-3">{row.dhu.toFixed(2)}</td>
      <td
        className={`p-3 ${
          row.status === "Good"
            ? "text-green-400"
            : row.status === "Monitor"
            ? "text-yellow-400"
            : "text-red-400"
        }`}
      >
        {row.status}
      </td>
    </tr>
  ))}
</tbody>

          </table>

        </section>

        {/* Pareto */}

        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6">

          <h2 className="text-2xl font-bold text-cyan-200">
            Top Defect Pareto
          </h2>

          <div className="mt-5 space-y-3">

            <div>Open Seam - 28%</div>
            <div>Broken Stitch - 22%</div>
            <div>Measurement Issue - 14%</div>
            <div>Skip Stitch - 11%</div>
            <div>Fabric Defect - 8%</div>

          </div>

        </section>

      </div>
    </main>
  );
}