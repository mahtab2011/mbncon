export interface KnowledgeVersionStatus {
  code?: string;

  version?: string;

  lastReviewed?: string;

  isActive?: boolean;

  status:
    | "CURRENT"
    | "NEEDS_REVIEW"
    | "INACTIVE"
    | "VERSION_MISSING";
}

export function getKnowledgeVersionStatus(
  item: any
): KnowledgeVersionStatus {
  if (item.isActive === false) {
    return {
      code: item.code,
      version: item.version,
      lastReviewed: item.lastReviewed,
      isActive: item.isActive,
      status: "INACTIVE",
    };
  }

  if (!item.version || !item.lastReviewed) {
    return {
      code: item.code,
      version: item.version,
      lastReviewed: item.lastReviewed,
      isActive: item.isActive,
      status: "VERSION_MISSING",
    };
  }

  return {
    code: item.code,
    version: item.version,
    lastReviewed: item.lastReviewed,
    isActive: item.isActive,
    status: "CURRENT",
  };
}