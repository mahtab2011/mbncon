import {
  buildKnowledgeRelationships,
  KnowledgeRelationship,
} from "./knowledgeRelationshipEngine";

export interface KnowledgeGraph {
  nodes: string[];

  edges: KnowledgeRelationship[];
}

export function buildManufacturingKnowledgeGraph(): KnowledgeGraph {
  const edges = buildKnowledgeRelationships();

  const nodeSet = new Set<string>();

  edges.forEach((edge) => {
    nodeSet.add(edge.sourceLibrary);
    nodeSet.add(edge.sourceCode);
    nodeSet.add(edge.targetLibrary);
  });

  return {
    nodes: [...nodeSet],

    edges,
  };
}