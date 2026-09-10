export class UpdateProjectDto {
  name?: string;
  // Stage 1B core fields — see CreateProjectDto. All optional here (partial
  // update, same pattern as `name`): only fields actually sent are changed.
  customer?: string;
  styleNumber?: string;
  garmentCategory?: string;
  mainCategory?: string;
  subcategory?: string;
  fabricWidth?: number;
  orderQuantity?: number;
  scaleLength?: number;
  // Optional optimistic-concurrency token — the ISO timestamp the caller
  // last read as this project's `updatedAt`. When supplied, the update only
  // applies if the row's current `updatedAt` still matches (see
  // ProjectsService.updateProject); when omitted, the update proceeds
  // unconditionally (backward-compatible with callers — the frontend isn't
  // migrated to send this yet).
  expectedUpdatedAt?: string;
}
