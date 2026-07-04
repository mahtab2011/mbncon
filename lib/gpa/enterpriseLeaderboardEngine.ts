export type EnterpriseLeaderboardEntry = {
  factoryId: string;
  factoryName: string;
  executiveScore: number;
};

export function buildEnterpriseLeaderboard(
  factories: EnterpriseLeaderboardEntry[]
): EnterpriseLeaderboardEntry[] {
  return [...factories].sort(
    (a, b) => b.executiveScore - a.executiveScore
  );
}