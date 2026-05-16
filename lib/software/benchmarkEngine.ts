export interface BenchmarkInput {
  productivity: number;
  quality: number;
  delivery: number;
  wastage: number;
  efficiency: number;
}

export interface BenchmarkResult {
  overall: number;
  rating:
    | "Poor"
    | "Developing"
    | "Competitive"
    | "World Class";
}

export function calculateBenchmark(
  input: BenchmarkInput
): BenchmarkResult {
  const overall = Math.round(
    (
      input.productivity +
      input.quality +
      input.delivery +
      input.efficiency -
      input.wastage
    ) / 4
  );

  let rating: BenchmarkResult["rating"] =
    "Poor";

  if (overall >= 90) {
    rating = "World Class";
  } else if (overall >= 75) {
    rating = "Competitive";
  } else if (overall >= 50) {
    rating = "Developing";
  }

  return {
    overall,
    rating,
  };
}