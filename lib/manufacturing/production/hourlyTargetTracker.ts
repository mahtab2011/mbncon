import { LiveProductionRecord } from "./liveProductionFeed";

export type HourlyTargetStatus = {
  line: string;
  target: number;
  actual: number;
  variance: number;
  achievement: number;
  status: "AHEAD" | "ON_TRACK" | "BEHIND";
};

export function buildHourlyTargetTracker(
  records: LiveProductionRecord[]
): HourlyTargetStatus[] {
  return records.map((record) => {
    const variance = record.actual - record.target;

    const achievement =
      record.target > 0
        ? Math.round(
            (record.actual / record.target) * 100
          )
        : 0;

    let status: HourlyTargetStatus["status"] =
      "ON_TRACK";

    if (achievement >= 100) {
      status = "AHEAD";
    } else if (achievement < 90) {
      status = "BEHIND";
    }

    return {
      line: record.line,
      target: record.target,
      actual: record.actual,
      variance,
      achievement,
      status,
    };
  });
}