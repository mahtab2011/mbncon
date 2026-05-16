import DashboardShell from "@/components/software/DashboardShell";
import KpiCard from "@/components/software/KpiCard";

export default function OrderCancellationBuyerRiskIntelligencePage() {
  return (
    <DashboardShell
      title="Order Cancellation & Buyer Risk Intelligence"
      subtitle="Track buyer reliability, cancellation trends, delayed approvals, and commercial risk exposure across merchandising operations."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Buyer Risk Score"
          value="72%"
          change="+4% this month"
          risk="Medium"
        />

        <KpiCard
          title="Cancellation Rate"
          value="6.8%"
          change="-1.2% improvement"
          risk="Low"
        />

        <KpiCard
          title="Delayed PO Approvals"
          value="14"
          change="+3 pending"
          risk="High"
        />

        <KpiCard
          title="Shipment Exposure"
          value="$184K"
          change="At-risk orders"
          risk="Medium"
        />
      </div>

      <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-neutral-900">
          AI Commercial Risk Observation
        </h2>

        <p className="mt-4 max-w-4xl text-base leading-8 text-neutral-600">
          Buyer cancellation exposure is increasing due to delayed approvals
          and shipment uncertainty. Management should prioritize proactive
          communication, milestone monitoring, and commercial follow-up for
          high-value buyers with repeated delay patterns.
        </p>
      </div>
    </DashboardShell>
  );
}