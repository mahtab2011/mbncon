export type MudaCategory =
  | "Overproduction"
  | "Waiting"
  | "Transport"
  | "Motion"
  | "Overprocessing"
  | "Inventory"
  | "Defects";

export interface MudaInput {
  category: MudaCategory;
  incidents: number;
  severity: number;
  affectedWorkers: number;
}

export interface MudaScoreResult {
  category: MudaCategory;
  score: number;
  risk: "Low" | "Medium" | "High" | "Critical";
}

export function calculateMudaScore(
  input: MudaInput
): MudaScoreResult {
  const baseScore =
    input.incidents * 2 +
    input.severity * 5 +
    input.affectedWorkers;

  let risk: "Low" | "Medium" | "High" | "Critical" =
    "Low";

  if (baseScore >= 80) {
    risk = "Critical";
  } else if (baseScore >= 50) {
    risk = "High";
  } else if (baseScore >= 25) {
    risk = "Medium";
  }

  return {
    category: input.category,
    score: baseScore,
    risk,
  };
}