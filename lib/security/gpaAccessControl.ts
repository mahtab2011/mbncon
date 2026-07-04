import {
  GpaPermission,
  GpaRole,
  gpaRolePermissions,
} from "./gpaPermissions";

export function hasPermission(
  role: GpaRole,
  permission: GpaPermission
): boolean {
  return gpaRolePermissions[role].includes(permission);
}

export function hasAnyPermission(
  role: GpaRole,
  permissions: GpaPermission[]
): boolean {
  return permissions.some((permission) =>
    gpaRolePermissions[role].includes(permission)
  );
}

export function hasAllPermissions(
  role: GpaRole,
  permissions: GpaPermission[]
): boolean {
  return permissions.every((permission) =>
    gpaRolePermissions[role].includes(permission)
  );
}