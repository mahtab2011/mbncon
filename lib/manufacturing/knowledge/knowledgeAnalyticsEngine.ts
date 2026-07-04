import { manufacturingKnowledgeRegistry } from "./knowledgeRegistry";

export interface KnowledgeLibraryAnalytics {
  libraryName: string;

  totalItems: number;

  activeItems: number;

  inactiveItems: number;
}

export function getKnowledgeLibraryAnalytics(): KnowledgeLibraryAnalytics[] {
  return Object.entries(manufacturingKnowledgeRegistry).map(
    ([libraryName, library]) => {
      if (!Array.isArray(library)) {
        return {
          libraryName,
          totalItems: 0,
          activeItems: 0,
          inactiveItems: 0,
        };
      }

      const activeItems = library.filter(
        (item: any) => item.isActive !== false
      ).length;

      return {
        libraryName,

        totalItems: library.length,

        activeItems,

        inactiveItems: library.length - activeItems,
      };
    }
  );
}