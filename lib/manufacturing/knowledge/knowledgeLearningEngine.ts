export interface KnowledgeLearningEvent {
  timestamp: string;

  query: string;

  module: string;

  resultCount: number;
}

const learningLog: KnowledgeLearningEvent[] = [];

export function recordKnowledgeLearningEvent(
  query: string,
  module: string,
  resultCount: number
): void {
  learningLog.push({
    timestamp: new Date().toISOString(),

    query,

    module,

    resultCount,
  });
}

export function getKnowledgeLearningLog() {
  return learningLog;
}

export function getMostRequestedTopics(): Record<string, number> {
  const summary: Record<string, number> = {};

  learningLog.forEach((event) => {
    summary[event.query] =
      (summary[event.query] ?? 0) + 1;
  });

  return summary;
}