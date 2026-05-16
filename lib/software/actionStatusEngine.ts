export type OperationalStatus =
  | "Open"
  | "In Progress"
  | "Completed"
  | "Escalated";

export const operationalStatuses: OperationalStatus[] = [
  "Open",
  "In Progress",
  "Completed",
  "Escalated",
];

export function getStatusBadgeClass(
  status: OperationalStatus | string
): string {
  if (status === "Completed") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "In Progress") {
    return "bg-cyan-100 text-cyan-700";
  }

  if (status === "Escalated") {
    return "bg-red-100 text-red-700";
  }

  return "bg-neutral-100 text-neutral-700";
}