import { LiveProductionRecord } from "./liveProductionFeed";

export type Bottleneck = {
  line: string;
  factory: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reason: string;
  recommendation: string;
};

export function detectProductionBottlenecks(
  records: LiveProductionRecord[]
): Bottleneck[] {
  const bottlenecks: Bottleneck[] = [];

  records.forEach((record) => {
    if (record.efficiency < 75) {
      bottlenecks.push({
        line: record.line,
        factory: record.factory,
        severity: "HIGH",
        reason: "Production efficiency below 75%",
        recommendation:
          "Review operator allocation, machine condition and work method.",
      });
    }

    if (record.downtime > 30) {
      bottlenecks.push({
        line: record.line,
        factory: record.factory,
        severity: "CRITICAL",
        reason: "Machine downtime exceeds 30 minutes.",
        recommendation:
          "Immediately involve maintenance and recover lost production.",
      });
    }

    if (record.defects > 20) {
      bottlenecks.push({
        line: record.line,
        factory: record.factory,
        severity: "HIGH",
        reason: "High defect rate detected.",
        recommendation:
          "Inspect quality checkpoints and retrain operators if required.",
      });
    }

    if (record.wip > 200) {
      bottlenecks.push({
        line: record.line,
        factory: record.factory,
        severity: "MEDIUM",
        reason: "Excess work-in-progress.",
        recommendation:
          "Balance upstream and downstream processes to reduce WIP.",
      });
    }
  });

  return bottlenecks;
}