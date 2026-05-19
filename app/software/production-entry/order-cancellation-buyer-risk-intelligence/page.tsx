"use client";

import DashboardShell from "@/components/software/DashboardShell";
import KpiCard from "@/components/software/KpiCard";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const buyerRiskAreas = [
  "Delayed buyer approvals",
  "Repeated cancellation history",
  "Shipment commitment instability",
  "Late tech-pack confirmation",
  "Commercial communication delays",
  "Pricing renegotiation pressure",
  "Frequent order revision requests",
  "LC opening delays",
];

const mitigationActions = [
  "Daily buyer follow-up visibility",
  "Critical-path escalation tracking",
  "Commercial coordination meetings",
  "Buyer reliability scoring",
  "Approval milestone monitoring",
  "Shipment exposure reporting",
  "Margin-risk visibility",
  "Corrective action follow-up",
];

export default function OrderCancellationBuyerRiskIntelligencePage() {
  return (
    <DashboardShell
      title="Order Cancellation & Buyer Risk Intelligence"
      subtitle="Track buyer reliability, cancellation trends, delayed approvals, shipment exposure, and commercial risk visibility across merchandising operations."
    >
      {/* KPI SECTION */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Buyer Risk Score",
            value: "72%",
            change: "+4% this month",
            risk: "Medium",
          },
          {
            title: "Cancellation Rate",
            value: "6.8%",
            change: "-1.2% improvement",
            risk: "Low",
          },
          {
            title: "Delayed PO Approvals",
            value: "14",
            change: "+3 pending",
            risk: "High",
          },
          {
            title: "Shipment Exposure",
            value: "$184K",
            change: "At-risk orders",
            risk: "Medium",
          },
        ].map((item) => {
          const id = slugify(item.title);

          return (
            <a
              key={item.title}
              href={`#${id}`}
              className="scroll-mt-28 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div id={id}>
                <KpiCard
                  title={item.title}
                  value={item.value}
                  change={item.change}
                  risk={item.risk}
                />
              </div>
            </a>
          );
        })}
      </section>

      {/* AI OBSERVATION */}
      <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-neutral-900">
          AI Commercial Risk Observation
        </h2>

        <p className="mt-4 max-w-4xl text-base leading-8 text-neutral-600">
          Buyer cancellation exposure is increasing due to delayed approvals,
          shipment uncertainty, repeated commercial delays, and unstable buyer
          communication patterns. Management should prioritize proactive
          escalation, milestone monitoring, shipment readiness tracking, and
          focused follow-up for high-value buyers with repeated delay behaviour.
        </p>
      </section>

      {/* BUYER RISK AREAS */}
      <section className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-8 shadow-sm transition duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-red-950">
          Buyer Risk Intelligence Areas
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {buyerRiskAreas.map((item) => {
            const id = slugify(item);

            return (
              <div
                key={item}
                id={id}
                className="scroll-mt-28 rounded-2xl border border-red-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="font-semibold leading-7 text-red-950">
                  {item}
                </p>

                <p className="mt-3 text-sm leading-6 text-red-900">
                  Commercial monitoring area requiring visibility, escalation,
                  and operational coordination.
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MITIGATION */}
      <section className="mt-8 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 shadow-sm transition duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-emerald-950">
          Commercial Risk Mitigation Actions
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {mitigationActions.map((item) => {
            const id = slugify(item);

            return (
              <div
                key={item}
                id={id}
                className="scroll-mt-28 rounded-2xl border border-emerald-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="font-semibold leading-7 text-emerald-950">
                  {item}
                </p>

                <p className="mt-3 text-sm leading-6 text-emerald-900">
                  Operational control mechanism designed to reduce cancellation
                  exposure and improve shipment reliability.
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONSULTANCY APPLICATION */}
      <section className="mt-8 rounded-3xl border border-blue-100 bg-blue-50 p-8 shadow-sm transition duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-blue-950">
          Consultancy Application
        </h2>

        <p className="mt-5 max-w-5xl text-lg leading-8 text-blue-950">
          This intelligence module helps merchandising, commercial,
          production, sourcing, and top management teams identify unstable
          buyer behaviour, delayed approvals, shipment exposure, and
          cancellation risks before financial losses occur.
        </p>

        <p className="mt-5 max-w-5xl text-lg leading-8 text-blue-950">
          The system supports proactive communication, buyer accountability,
          escalation visibility, shipment readiness monitoring, and strategic
          commercial decision-making to protect profitability and operational
          stability.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-8 rounded-3xl bg-slate-900 p-12 text-center text-white shadow-2xl transition duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <h2 className="text-5xl font-extrabold">
          Strengthen Commercial Stability & Buyer Visibility
        </h2>

        <p className="mx-auto mt-6 max-w-4xl text-xl leading-9 text-slate-300">
          MBNCON commercial intelligence systems help export manufacturers
          reduce buyer cancellation risk, improve shipment reliability,
          strengthen merchandising visibility, and protect operational
          profitability through structured risk intelligence.
        </p>

        <button className="mt-10 rounded-full bg-white px-10 py-5 text-lg font-bold text-slate-900 transition duration-300 hover:scale-105 hover:shadow-xl">
          Request Buyer Risk Intelligence Consultation
        </button>
      </section>
    </DashboardShell>
  );
}