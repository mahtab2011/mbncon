import { manufacturingKnowledgeRegistry } from "./knowledgeRegistry";

export interface KnowledgeSearchResult {
  library: string;

  item: unknown;
}

export function searchManufacturingKnowledge(
  keyword: string
): KnowledgeSearchResult[] {
  const search = keyword.toLowerCase();

  const results: KnowledgeSearchResult[] = [];

  Object.entries(manufacturingKnowledgeRegistry).forEach(
    ([libraryName, library]) => {
      if (!Array.isArray(library)) return;

      library.forEach((item) => {
        const text = JSON.stringify(item).toLowerCase();

        if (text.includes(search)) {
          results.push({
            library: libraryName,
            item,
          });
        }
      });
    }
  );

  return results;
}