import { hasPermission } from "./gpaAccessControl";
import {
  GpaPermission,
  GpaRole,
} from "./gpaPermissions";

export function protectRoute(
  role: GpaRole,
  permission: GpaPermission
) {
  return hasPermission(role, permission);
}