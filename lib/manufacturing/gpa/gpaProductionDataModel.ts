export type GPADepartment =
  | "CUTTING"
  | "SEWING"
  | "FINISHING"
  | "QUALITY"
  | "PACKING"
  | "WAREHOUSE"
  | "MAINTENANCE";

export type GPAMachineStatus =
  | "RUNNING"
  | "IDLE"
  | "BREAKDOWN"
  | "MAINTENANCE"
  | "NOT_REQUIRED";

export type GPABottleneckFlag =
  | "NONE"
  | "WATCH"
  | "BOTTLENECK"
  | "CRITICAL_BOTTLENECK";

export type GPAProductionRecord = {
  id: string;

  factoryName: string;
  floorName: string;
  department: GPADepartment;
  lineName: string;

  buyerName: string;
  styleNo: string;
  orderNo: string;
  operationName: string;

  date: string;
  hourSlot: string;

  hourlyTarget: number;
  hourlyOutput: number;

  operators: number;
  helpers: number;
  targetOperators: number;

  wip: number;
  defects: number;
  waitingMinutes: number;

  machineStatus: GPAMachineStatus;
  bottleneckFlag: GPABottleneckFlag;

  supervisorName: string;
  productionManagerName: string;

  remarks?: string;
};

export type GPAProductionSummary = {
  totalTarget: number;
  totalOutput: number;
  achievementPercent: number;
  totalDefects: number;
  totalWip: number;
  bottleneckCount: number;
  criticalBottleneckCount: number;
};

export function calculateGPAProductionSummary(
  records: GPAProductionRecord[]
): GPAProductionSummary {
  const totalTarget = records.reduce(
    (sum, item) => sum + item.hourlyTarget,
    0
  );

  const totalOutput = records.reduce(
    (sum, item) => sum + item.hourlyOutput,
    0
  );

  const totalDefects = records.reduce(
    (sum, item) => sum + item.defects,
    0
  );

  const totalWip = records.reduce(
    (sum, item) => sum + item.wip,
    0
  );

  const bottleneckCount = records.filter(
    (item) =>
      item.bottleneckFlag === "BOTTLENECK" ||
      item.bottleneckFlag === "CRITICAL_BOTTLENECK"
  ).length;

  const criticalBottleneckCount = records.filter(
    (item) => item.bottleneckFlag === "CRITICAL_BOTTLENECK"
  ).length;

  const achievementPercent =
    totalTarget === 0 ? 0 : (totalOutput / totalTarget) * 100;

  return {
    totalTarget,
    totalOutput,
    achievementPercent: Number(achievementPercent.toFixed(1)),
    totalDefects,
    totalWip,
    bottleneckCount,
    criticalBottleneckCount,
  };
}