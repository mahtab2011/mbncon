import { LiveProductionRecord } from "./liveProductionFeed";

export type ProductionIntelligence = {
  totalTarget: number;
  totalActual: number;
  averageEfficiency: number;
  totalDefects: number;
  totalDowntime: number;
  totalWip: number;
  linesBehindTarget: number;
};

export function buildProductionIntelligence(
  records: LiveProductionRecord[]
): ProductionIntelligence {
  if (records.length === 0) {
    return {
      totalTarget: 0,
      totalActual: 0,
      averageEfficiency: 0,
      totalDefects: 0,
      totalDowntime: 0,
      totalWip: 0,
      linesBehindTarget: 0,
    };
  }

  let totalTarget = 0;
  let totalActual = 0;
  let totalEfficiency = 0;
  let totalDefects = 0;
  let totalDowntime = 0;
  let totalWip = 0;
  let linesBehindTarget = 0;

  records.forEach((record) => {
    totalTarget += record.target;
    totalActual += record.actual;
    totalEfficiency += record.efficiency;
    totalDefects += record.defects;
    totalDowntime += record.downtime;
    totalWip += record.wip;

    if (record.actual < record.target) {
      linesBehindTarget++;
    }
  });

  return {
    totalTarget,
    totalActual,
    averageEfficiency: Math.round(
      totalEfficiency / records.length
    ),
    totalDefects,
    totalDowntime,
    totalWip,
    linesBehindTarget,
  };
}