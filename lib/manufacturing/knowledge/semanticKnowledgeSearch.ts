import { searchManufacturingKnowledge } from "./knowledgeSearchEngine";

const semanticDictionary: Record<string, string[]> = {
  needle: [
    "needle",
    "needle cut",
    "skipped stitch",
    "broken stitch",
    "needle policy",
  ],

  thread: [
    "thread",
    "thread breakage",
    "thread tension",
    "broken stitch",
  ],

  quality: [
    "quality",
    "inspection",
    "defect",
    "audit",
    "measurement",
  ],

  maintenance: [
    "machine",
    "maintenance",
    "lubrication",
    "timing",
    "repair",
  ],

  productivity: [
    "time study",
    "method study",
    "activity sampling",
    "line balancing",
  ],
};

export function semanticKnowledgeSearch(
  concept: string
) {
  const keywords =
    semanticDictionary[
      concept.toLowerCase()
    ] ?? [concept];

  const results = [];

  for (const keyword of keywords) {
    results.push(
      ...searchManufacturingKnowledge(keyword)
    );
  }

  return results;
}