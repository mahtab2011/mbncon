"use client";

import {
  fabricShadeMaster,
} from "@/lib/manufacturing/fabric-shade-management/fabricShadeMaster";

function riskClass(risk: string) {
  if (risk === "LOW") return "bg-green-100 text-green-700";
  if (risk === "MEDIUM") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function statusClass(status: string) {
  if (status === "APPROVED") return "bg-green-100 text-green-700";
  if (status === "HOLD") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

export default function FabricShadeManagementPage() {

  const approved =
    fabricShadeMaster.filter(
      item => item.status === "APPROVED"
    ).length;

  const hold =
    fabricShadeMaster.filter(
      item => item.status === "HOLD"
    ).length;

  const rejected =
    fabricShadeMaster.filter(
      item => item.status === "REJECTED"
    ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          AI Fabric Shade Management
        </h1>

        <p className="mt-2 text-gray-600">
          AI controls shade grouping, lay allocation,
          bundle integrity and shade traceability before cutting.
        </p>

      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-4">

        <Card
          title="Total Rolls"
          value={fabricShadeMaster.length.toString()}
        />

        <Card
          title="Approved"
          value={approved.toString()}
        />

        <Card
          title="Hold"
          value={hold.toString()}
        />

        <Card
          title="Rejected"
          value={rejected.toString()}
        />

      </div>

      <section className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">

        <h2 className="text-2xl font-bold text-blue-700">
          AI Shade Summary
        </h2>

        <p className="mt-3 text-gray-700">
          AI prevents shade mixing between fabric lots,
          controls bundle integrity and maintains complete
          shade traceability throughout cutting and sewing.
        </p>

      </section>

      <div className="grid gap-6">

        {fabricShadeMaster.map((item) => (

          <section
            key={item.id}
            className="rounded-xl bg-white p-6 shadow"
          >

            <div className="mb-5 flex flex-wrap items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-blue-700">
                  {item.style}
                </h2>

                <p className="text-gray-600">
                  {item.buyer} • {item.fabricType}
                </p>

              </div>

              <div className="flex gap-2">

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${riskClass(item.riskLevel)}`}
                >
                  {item.riskLevel}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${statusClass(item.status)}`}
                >
                  {item.status}
                </span>

              </div>

            </div>

            <div className="grid gap-4 md:grid-cols-4">

              <Metric title="Lot" value={item.lotNo} />
              <Metric title="Roll" value={item.rollNo} />
              <Metric title="Shade Group" value={item.shadeGroup} />
              <Metric title="Shade Band" value={item.shadeBand} />

            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              <Info
                title="Assigned Lay"
                value={item.assignedLay}
              />

              <Info
                title="Bundle Range"
                value={item.assignedBundleRange}
              />

            </div>

            <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">

              <p className="text-sm font-semibold text-blue-700">
                AI Recommendation
              </p>

              <p className="mt-2 text-gray-700">
                {item.aiRecommendation}
              </p>

            </div>

          </section>

        ))}

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

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-2xl font-bold text-blue-700">
        {value}
      </h2>

    </div>

  );

}

function Metric({
  title,
  value,
}:{
  title:string;
  value:string;
}){

  return(

    <div className="rounded-lg bg-slate-50 p-4">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="mt-1 font-bold">
        {value}
      </h3>

    </div>

  );

}

function Info({
  title,
  value,
}:{
  title:string;
  value:string;
}){

  return(

    <div className="rounded-lg border p-4">

      <p className="text-sm font-semibold text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-gray-700">
        {value}
      </p>

    </div>

  );

}