export type EnterpriseHealthSnapshot = {
  timestamp: string;
  health: number;
};

export type EnterpriseHealthTrend = {
  current: number;
  previous: number;
  change: number;
  direction: "UP" | "DOWN" | "STABLE";
};

export function calculateEnterpriseHealthTrend(
  snapshots: EnterpriseHealthSnapshot[]
): EnterpriseHealthTrend {
  if (snapshots.length < 2) {
    return {
      current: snapshots[0]?.health ?? 0,
      previous: snapshots[0]?.health ?? 0,
      change: 0,
      direction: "STABLE",
    };
  }

  const current = snapshots[snapshots.length - 1].health;
  const previous = snapshots[snapshots.length - 2].health;
  const change = current - previous;

  return {
    current,
    previous,
    change,
    direction:
      change > 0
        ? "UP"
        : change < 0
        ? "DOWN"
        : "STABLE",
  };
}