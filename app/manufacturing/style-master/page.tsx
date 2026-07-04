"use client";

type StyleRisk = "LOW" | "MEDIUM" | "HIGH";

type StyleMaster = {
  id: string;
  styleNo: string;
  buyer: string;
  productType: string;
  fabricType: string;
  orderQty: number;
  sam: number;
  targetEfficiency: number;
  expectedDhu: number;
  difficulty: StyleRisk;
  bottleneckOperation: string;
  machineRequirement: string;
  skillRequirement: string;
  aiRecommendation: string;
};

const styles: StyleMaster[] = [
  {
    id: "1",
    styleNo: "HNM-POLO-2401",
    buyer: "H&M",
    productType: "Polo Shirt",
    fabricType: "Cotton Pique",
    orderQty: 25000,
    sam: 12.5,
    targetEfficiency: 72,
    expectedDhu: 2.8,
    difficulty: "MEDIUM",
    bottleneckOperation: "Collar Attach",
    machineRequirement: "SNLS, Overlock, Flatlock, Button Hole",
    skillRequirement: "Medium skilled collar and placket operators",
    aiRecommendation:
      "Prepare collar attach operators one day before input. Monitor first 3 hours closely.",
  },
  {
    id: "2",
    styleNo: "ZRA-TEE-1188",
    buyer: "Zara",
    productType: "Fashion T-Shirt",
    fabricType: "Single Jersey",
    orderQty: 18000,
    sam: 8.2,
    targetEfficiency: 78,
    expectedDhu: 3.5,
    difficulty: "LOW",
    bottleneckOperation: "Neck Rib Attach",
    machineRequirement: "Overlock, Flatlock, SNLS",
    skillRequirement: "Regular knit operators",
    aiRecommendation:
      "Use standard knit layout. Keep one backup rib attach operator available.",
  },
  {
    id: "3",
    styleNo: "PRM-HOOD-3307",
    buyer: "Primark",
    productType: "Hoodie",
    fabricType: "Fleece",
    orderQty: 12000,
    sam: 22.8,
    targetEfficiency: 65,
    expectedDhu: 4.2,
    difficulty: "HIGH",
    bottleneckOperation: "Hood Attach",
    machineRequirement: "SNLS, Overlock, Flatlock, Kansai, Bartack",
    skillRequirement: "Highly skilled operators for hood and pocket operations",
    aiRecommendation:
      "Run pilot batch before bulk input. Assign senior supervisor and IE support for first 2 days.",
  },
];

function getRiskBadgeClass(risk: StyleRisk) {
  if (risk === "LOW") return "bg-green-100 text-green-700";
  if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function StyleMasterPage() {
  const totalStyles = styles.length;

  const totalOrderQty = styles.reduce(
    (sum, style) => sum + style.orderQty,
    0
  );

  const avgSam =
    styles.reduce((sum, style) => sum + style.sam, 0) / styles.length;

  const highRiskStyles = styles.filter(
    (style) => style.difficulty === "HIGH"
  ).length;

  const avgEfficiency =
    styles.reduce((sum, style) => sum + style.targetEfficiency, 0) /
    styles.length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            AI Style Master Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Enterprise style administration with AI difficulty, bottleneck,
            SMV, efficiency and production readiness intelligence.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          + New Style
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {["List", "Create", "Analytics", "Import", "Export", "Print", "AI Insights"].map(
          (item) => (
            <button
              key={item}
              className={`rounded-lg px-5 py-2 font-semibold shadow ${
                item === "List"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-5">
        <Card title="Total Styles" value={totalStyles.toString()} />
        <Card title="Order Quantity" value={totalOrderQty.toLocaleString()} />
        <Card title="Average SAM" value={avgSam.toFixed(1)} />
        <Card title="Avg Efficiency" value={`${avgEfficiency.toFixed(1)}%`} />
        <Card title="High Risk" value={highRiskStyles.toString()} />
      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-2xl font-bold text-blue-700">
          AI Style Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI has identified <strong>{highRiskStyles}</strong> high-risk style.
          Average SAM is <strong>{avgSam.toFixed(1)}</strong> and average
          target efficiency is <strong>{avgEfficiency.toFixed(1)}%</strong>.
          Primary attention should remain on Hoodie style PRM-HOOD-3307 due to
          high complexity and Hood Attach bottleneck risk.
        </p>
      </section>

      <div className="mb-6 rounded-xl bg-white p-5 shadow">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            placeholder="Search Style..."
            className="rounded-lg border p-3"
          />

          <select className="rounded-lg border p-3">
            <option>All Buyers</option>
            <option>H&M</option>
            <option>Zara</option>
            <option>Primark</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>All Product Types</option>
            <option>Polo Shirt</option>
            <option>Fashion T-Shirt</option>
            <option>Hoodie</option>
          </select>

          <select className="rounded-lg border p-3">
            <option>All Risk Levels</option>
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-blue-700 text-white">
            <tr>
              <TH>Style No</TH>
              <TH>Buyer</TH>
              <TH>Product</TH>
              <TH>Fabric</TH>
              <TH>Qty</TH>
              <TH>SAM</TH>
              <TH>Target</TH>
              <TH>DHU</TH>
              <TH>Risk</TH>
              <TH>Bottleneck</TH>
              <TH>Actions</TH>
            </tr>
          </thead>

          <tbody>
            {styles.map((style) => (
              <tr key={style.id} className="border-b hover:bg-blue-50">
                <TD>
                  <span className="font-semibold">{style.styleNo}</span>
                </TD>
                <TD>{style.buyer}</TD>
                <TD>{style.productType}</TD>
                <TD>{style.fabricType}</TD>
                <TD>{style.orderQty.toLocaleString()}</TD>
                <TD>{style.sam}</TD>
                <TD>{style.targetEfficiency}%</TD>
                <TD>{style.expectedDhu}%</TD>
                <TD>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${getRiskBadgeClass(
                      style.difficulty
                    )}`}
                  >
                    {style.difficulty}
                  </span>
                </TD>
                <TD>
                  <span className="font-semibold text-red-700">
                    {style.bottleneckOperation}
                  </span>
                </TD>
                <TD>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton label="View" color="bg-blue-600" />
                    <ActionButton label="Edit" color="bg-orange-500" />
                    <ActionButton label="AI" color="bg-green-600" />
                    <ActionButton label="Bulletin" color="bg-purple-600" />
                  </div>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-bold text-blue-700">{value}</h2>
    </div>
  );
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-sm font-bold">
      {children}
    </th>
  );
}

function TD({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3">{children}</td>;
}

function ActionButton({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <button className={`rounded px-3 py-1 text-sm text-white ${color}`}>
      {label}
    </button>
  );
}