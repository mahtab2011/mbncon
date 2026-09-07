// Mirrors OptiSewing's apps/api/src/common/role-tier.ts. Used to gate
// manager-only actions (activating/cancelling a subscription) directly off the
// User.role string carried in the JWT, without needing a full RBAC
// Role/Permission chain.
export type RoleTier = "OPERATIVE" | "MANAGER" | "EXECUTIVE";

export function classifyRoleTier(role: string): RoleTier {
  const upper = role.toUpperCase();
  if (upper.includes("ADMIN") || upper.includes("EXEC") || upper.includes("OWNER")) return "EXECUTIVE";
  if (upper.includes("MANAGER") || upper.includes("SUPERVISOR") || upper.includes("LEAD")) return "MANAGER";
  return "OPERATIVE";
}

export function isAtLeastManager(role: string): boolean {
  const tier = classifyRoleTier(role);
  return tier === "MANAGER" || tier === "EXECUTIVE";
}
