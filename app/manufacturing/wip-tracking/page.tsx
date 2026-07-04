"use client";

type WIPRecord = {
  id: string;
  style: string;
  line: string;
  cutting: number;
  sewing: number;
  finishing: number;
  packing: number;
  shipmentReady: number;
  bottleneck: string;
  aiStatus: "NORMAL" | "WATCH" | "CRITICAL";
};

const wip: WIPRecord[] = [
  {
    id: "1",
    style: "HNM-2401",
    line: "L-001",
    cutting: 1200,
    sewing: 1135,
    finishing: 1098,
    packing: 1050,
    shipmentReady: 1025,
    bottleneck: "None",
    aiStatus: "NORMAL",
  },
  {
    id: "2",
    style: "ZRA-1188",
    line: "L-002",
    cutting: 980,
    sewing: 902,
    finishing: 860,
    packing: 815,
    shipmentReady: 800,
    bottleneck: "Finishing",
    aiStatus: "WATCH",
  },
  {
    id: "3",
    style: "PRM-3307",
    line: "L-003",
    cutting: 700,
    sewing: 642,
    finishing: 590,
    packing: 545,
    shipmentReady: 520,
    bottleneck: "Sewing",
    aiStatus: "CRITICAL",
  },
];

export default function WIPTrackingCentre() {

  const totalReady = wip.reduce(
    (sum, row) => sum + row.shipmentReady,
    0
  );

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-blue-700">
            WIP Tracking Centre
          </h1>

          <p className="mt-2 text-gray-600">
            Live work-in-progress visibility across all production stages.
          </p>

        </div>

        <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">
          + Update WIP
        </button>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <Card
          title="Active Styles"
          value={wip.length.toString()}
        />

        <Card
          title="Shipment Ready"
          value={totalReady.toLocaleString()}
        />

        <Card
          title="Critical Lines"
          value="1"
        />

        <Card
          title="Factory Flow"
          value="Healthy"
        />

      </div>

      <section className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6">

        <h2 className="text-2xl font-bold text-red-700">
          AI WIP Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI has detected a bottleneck on Line L-003 at the sewing stage.
          Production flow is slowing and should be reviewed immediately to
          avoid shipment delays.
        </p>

      </section>

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-blue-700 text-white">
            <tr>
              <TH>Style</TH>
              <TH>Line</TH>
              <TH>Cutting</TH>
              <TH>Sewing</TH>
              <TH>Finishing</TH>
              <TH>Packing</TH>
              <TH>Shipment Ready</TH>
              <TH>Bottleneck</TH>
              <TH>AI Status</TH>
            </tr>
          </thead>

          <tbody>

            {wip.map((row)=>(

              <tr
                key={row.id}
                className="border-b hover:bg-blue-50"
              >

                <TD>{row.style}</TD>
                <TD>{row.line}</TD>
                <TD>{row.cutting}</TD>
                <TD>{row.sewing}</TD>
                <TD>{row.finishing}</TD>
                <TD>{row.packing}</TD>
                <TD>{row.shipmentReady}</TD>
                <TD>{row.bottleneck}</TD>

                <TD>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      row.aiStatus === "CRITICAL"
                        ? "bg-red-100 text-red-700"
                        : row.aiStatus === "WATCH"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {row.aiStatus}
                  </span>

                </TD>

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
}:{
  title:string;
  value:string;
}){
  return(
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
}:{
  children:React.ReactNode;
}){
  return(
    <th className="px-4 py-3 text-left text-sm font-bold">
      {children}
    </th>
  );
}

function TD({
  children,
}:{
  children:React.ReactNode;
}){
  return(
    <td className="px-4 py-3">
      {children}
    </td>
  );
}