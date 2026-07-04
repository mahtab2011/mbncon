"use client";

type MaterialIssue = {
  id: string;
  date: string;
  style: string;
  line: string;
  material: string;
  issuedQty: number;
  consumedQty: number;
  balanceQty: number;
  shortageRisk: "LOW" | "MEDIUM" | "HIGH";
  aiRecommendation: string;
};

const issues: MaterialIssue[] = [
  {
    id: "1",
    date: "2026-06-29",
    style: "HNM-2401",
    line: "L-001",
    material: "Cotton Pique Fabric",
    issuedQty: 1250,
    consumedQty: 1180,
    balanceQty: 70,
    shortageRisk: "LOW",
    aiRecommendation: "Sufficient stock available.",
  },
  {
    id: "2",
    date: "2026-06-29",
    style: "ZRA-1188",
    line: "L-002",
    material: "Neck Rib",
    issuedQty: 980,
    consumedQty: 955,
    balanceQty: 25,
    shortageRisk: "MEDIUM",
    aiRecommendation: "Prepare next batch within 2 hours.",
  },
  {
    id: "3",
    date: "2026-06-29",
    style: "PRM-3307",
    line: "L-003",
    material: "Hood Fabric",
    issuedQty: 710,
    consumedQty: 705,
    balanceQty: 5,
    shortageRisk: "HIGH",
    aiRecommendation:
      "Immediate replenishment required to avoid line stoppage.",
  },
];

export default function MaterialIssueCentre() {

  const totalIssued = issues.reduce(
    (sum, row) => sum + row.issuedQty,
    0
  );

  const totalConsumed = issues.reduce(
    (sum, row) => sum + row.consumedQty,
    0
  );

  const totalBalance = issues.reduce(
    (sum, row) => sum + row.balanceQty,
    0
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-blue-700">
            Material Issue Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Live material issue, consumption and shortage intelligence.
          </p>

        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">
          + Issue Material
        </button>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">

        <Card
          title="Issued Qty"
          value={totalIssued.toLocaleString()}
        />

        <Card
          title="Consumed Qty"
          value={totalConsumed.toLocaleString()}
        />

        <Card
          title="Balance Qty"
          value={totalBalance.toLocaleString()}
        />

      </div>

      <section className="mb-8 rounded-xl border border-orange-200 bg-orange-50 p-6">

        <h2 className="text-2xl font-bold text-orange-700">
          AI Material Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI predicts Line L-003 will stop within the next production cycle
          unless hood fabric is replenished immediately.
        </p>

      </section>

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-blue-700 text-white">

            <tr>
              <TH>Date</TH>
              <TH>Style</TH>
              <TH>Line</TH>
              <TH>Material</TH>
              <TH>Issued</TH>
              <TH>Consumed</TH>
              <TH>Balance</TH>
              <TH>Risk</TH>
              <TH>AI Recommendation</TH>
            </tr>

          </thead>

          <tbody>

            {issues.map((row) => (

              <tr
                key={row.id}
                className="border-b hover:bg-blue-50"
              >

                <TD>{row.date}</TD>

                <TD>{row.style}</TD>

                <TD>{row.line}</TD>

                <TD>{row.material}</TD>

                <TD>{row.issuedQty}</TD>

                <TD>{row.consumedQty}</TD>

                <TD>{row.balanceQty}</TD>

                <TD>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      row.shortageRisk === "HIGH"
                        ? "bg-red-100 text-red-700"
                        : row.shortageRisk === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {row.shortageRisk}
                  </span>

                </TD>

                <TD>{row.aiRecommendation}</TD>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-3xl font-bold text-blue-700">
        {value}
      </h2>
    </div>
  );
}

function TH({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-3 text-left text-sm font-bold">
      {children}
    </th>
  );
}

function TD({
  children,
}: {
  children: React.ReactNode;
}) {
  return <td className="px-4 py-3">{children}</td>;
}