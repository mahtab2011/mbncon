export interface KnowledgeValidationIssue {
  library: string;

  code: string;

  issue: string;
}

export function validateKnowledgeLibrary(
  libraryName: string,
  library: any[]
): KnowledgeValidationIssue[] {
  const issues: KnowledgeValidationIssue[] = [];

  library.forEach((item) => {
    if (!item.code) {
      issues.push({
        library: libraryName,
        code: "UNKNOWN",
        issue: "Missing code",
      });
    }

    if (item.isActive === undefined) {
      issues.push({
        library: libraryName,
        code: item.code ?? "UNKNOWN",
        issue: "Missing isActive flag",
      });
    }

    if (!item.version) {
      issues.push({
        library: libraryName,
        code: item.code ?? "UNKNOWN",
        issue: "Missing version",
      });
    }

    if (!item.lastReviewed) {
      issues.push({
        library: libraryName,
        code: item.code ?? "UNKNOWN",
        issue: "Missing lastReviewed date",
      });
    }
  });

  return issues;
}