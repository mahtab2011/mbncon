import { manufacturingKnowledgeRegistry } from "./knowledgeRegistry";

export interface KnowledgeRelationship {
  sourceLibrary: string;

  sourceCode: string;

  targetLibrary: string;

  relationship: string;
}

export function buildKnowledgeRelationships(): KnowledgeRelationship[] {
  const relationships: KnowledgeRelationship[] = [];

  Object.entries(manufacturingKnowledgeRegistry).forEach(
    ([libraryName, library]) => {
      if (!Array.isArray(library)) return;

      library.forEach((item: any) => {
        if (!item.code) return;

        relationships.push({
          sourceLibrary: libraryName,

          sourceCode: item.code,

          targetLibrary: libraryName,

          relationship: "BELONGS_TO_LIBRARY",
        });

        if (item.department) {
          relationships.push({
            sourceLibrary: libraryName,

            sourceCode: item.code,

            targetLibrary: item.department,

            relationship: "RELATED_TO_DEPARTMENT",
          });
        }

        if (item.machineType) {
          relationships.push({
            sourceLibrary: libraryName,

            sourceCode: item.code,

            targetLibrary: item.machineType,

            relationship: "RELATED_TO_MACHINE",
          });
        }

        if (item.category) {
          relationships.push({
            sourceLibrary: libraryName,

            sourceCode: item.code,

            targetLibrary: item.category,

            relationship: "RELATED_TO_CATEGORY",
          });
        }
      });
    }
  );

  return relationships;
}