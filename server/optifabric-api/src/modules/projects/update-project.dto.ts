export class UpdateProjectDto {
  name?: string;
  // Optional optimistic-concurrency token — the ISO timestamp the caller
  // last read as this project's `updatedAt`. When supplied, the update only
  // applies if the row's current `updatedAt` still matches (see
  // ProjectsService.updateProject); when omitted, the update proceeds
  // unconditionally (backward-compatible with callers — the frontend isn't
  // migrated to send this yet).
  expectedUpdatedAt?: string;
}
