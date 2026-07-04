import { searchManufacturingKnowledge } from "./knowledgeSearchEngine";

export interface KnowledgeRecommendation {
  keyword: string;

  totalMatches: number;

  recommendations: {
    library: string;

    item: unknown;
  }[];
}

export function recommendManufacturingKnowledge(
  keyword: string
): KnowledgeRecommendation {
  const results = searchManufacturingKnowledge(keyword);

  return {
    keyword,

    totalMatches: results.length,

    recommendations: results,
  };
}