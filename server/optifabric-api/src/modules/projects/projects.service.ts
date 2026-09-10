// Stage 1 engineering-data persistence layer. Every method that takes a
// projectId scopes its lookup by the caller's own factoryId (never a
// client-supplied one — factoryId always comes from the JWT-derived
// AuthenticatedUser) and returns/throws NotFoundException for a project that
// either doesn't exist or belongs to another factory, so a valid id from a
// different tenant is indistinguishable from a nonexistent one. See the
// Project/PatternPiece/PatternGeometry/FabricProfile/MarkerRun comment block
// in prisma/schema.prisma for the id/relationship design.
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";
import { AuthenticatedUser } from "../auth/auth.types";
import { CreateProjectDto } from "./create-project.dto";
import { UpdateProjectDto } from "./update-project.dto";
import { UpdatePatternPieceDto } from "./update-pattern-piece.dto";
import { UpsertPatternGeometryDto } from "./upsert-pattern-geometry.dto";
import { CreateMarkerRunDto } from "./create-marker-run.dto";
import { MAX_CUT_QUANTITY, MAX_NAME_LENGTH, MAX_POLYGON_POINTS, MAX_SEQUENCE } from "./projects.constants";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  // Manual-validation helpers, matching this codebase's existing convention
  // (e.g. AuthService.signUp's inline password-length check) rather than a
  // validation-pipe/decorator framework. `unknown`-typed inputs because
  // nothing coerces/validates the DTO before it reaches the service — a
  // malformed JSON body can put anything in these fields at runtime.
  private validateName(value: unknown, field: string): string {
    if (typeof value !== "string") {
      throw new BadRequestException(`${field} is required.`);
    }
    const trimmed = value.trim();
    if (!trimmed) {
      throw new BadRequestException(`${field} is required.`);
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      throw new BadRequestException(`${field} must be ${MAX_NAME_LENGTH} characters or fewer.`);
    }
    return trimmed;
  }

  private validateBoundedInteger(value: unknown, field: string, min: number, max: number): number {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new BadRequestException(`${field} must be a whole number.`);
    }
    if (value < min || value > max) {
      throw new BadRequestException(`${field} must be between ${min} and ${max}.`);
    }
    return value;
  }

  // Returns the point count of a polygon in either of the frontend's two
  // in-flight shapes (see the PatternGeometry model comment in
  // schema.prisma) — a plain array of points, or a richer object carrying
  // its points under `.points` — without otherwise validating either
  // shape's contents (that would mean picking a winner between them, which
  // this DTO deliberately avoids). Returns null if neither shape matches.
  private polygonPointCount(polygon: unknown): number | null {
    if (Array.isArray(polygon)) return polygon.length;
    if (polygon && typeof polygon === "object" && Array.isArray((polygon as { points?: unknown }).points)) {
      return (polygon as { points: unknown[] }).points.length;
    }
    return null;
  }

  // Reads the Postgres sequence "ProjectCodeSeq" (created directly in the
  // add_persistence_layer migration.sql, not represented in schema.prisma —
  // Prisma has no native sequence primitive). nextval() is atomic, so this
  // is race-free under concurrent POST /projects calls without needing a
  // retry loop; the tradeoff is that the numeric part is a single global
  // counter rather than resetting per year.
  private async generateProjectCode(tx: Prisma.TransactionClient): Promise<string> {
    const rows = await tx.$queryRaw<{ nextval: bigint }[]>`SELECT nextval('"ProjectCodeSeq"') AS nextval`;
    const year = new Date().getFullYear();
    return `OF-${year}-${rows[0].nextval.toString().padStart(6, "0")}`;
  }

  async listProjects(user: AuthenticatedUser, options: { archived?: boolean } = {}) {
    return this.prisma.project.findMany({
      where: {
        factoryId: user.factoryId,
        archivedAt: options.archived ? { not: null } : null,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getProject(user: AuthenticatedUser, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, factoryId: user.factoryId },
    });
    if (!project) {
      throw new NotFoundException(`No project found with id "${projectId}".`);
    }
    return project;
  }

  async createProject(user: AuthenticatedUser, dto: CreateProjectDto) {
    const name = this.validateName(dto.name, "name");

    return this.prisma.$transaction(async (tx) => {
      const code = await this.generateProjectCode(tx);
      const project = await tx.project.create({
        data: {
          factoryId: user.factoryId,
          createdByUserId: user.userId,
          code,
          name,
        },
      });

      await tx.auditEvent.create({
        data: {
          factoryId: user.factoryId,
          entityName: "Project",
          entityId: project.id,
          actionType: "PROJECT_CREATED",
          performedBy: user.userId,
          detailsJson: { code: project.code, name: project.name },
        },
      });

      return project;
    });
  }

  async updateProject(user: AuthenticatedUser, projectId: string, dto: UpdateProjectDto) {
    const name = dto.name !== undefined ? this.validateName(dto.name, "name") : undefined;

    // Optional optimistic-concurrency token (see UpdateProjectDto). Parsed
    // up front, outside the transaction, same as the other validation —
    // an invalid token should never even open a transaction.
    let expectedUpdatedAt: Date | undefined;
    if (dto.expectedUpdatedAt !== undefined) {
      if (typeof dto.expectedUpdatedAt !== "string") {
        throw new BadRequestException("expectedUpdatedAt must be a valid ISO timestamp.");
      }
      const parsed = new Date(dto.expectedUpdatedAt);
      if (Number.isNaN(parsed.getTime())) {
        throw new BadRequestException("expectedUpdatedAt must be a valid ISO timestamp.");
      }
      expectedUpdatedAt = parsed;
    }

    return this.prisma.$transaction(async (tx) => {
      // Factory-scoped read: establishes existence/ownership (404 for a
      // missing or cross-factory project) and the archived-state business
      // rule. This is NOT where staleness is decided — see below — so it
      // does not reintroduce a read-then-write race for the version check
      // itself.
      const project = await tx.project.findFirst({ where: { id: projectId, factoryId: user.factoryId } });
      if (!project) {
        throw new NotFoundException(`No project found with id "${projectId}".`);
      }
      if (project.archivedAt) {
        throw new BadRequestException("Cannot update an archived project. Restore it first.");
      }

      const data = name !== undefined ? { name } : {};
      let updated;

      if (expectedUpdatedAt) {
        // Atomic conditional update: the staleness check is embedded
        // directly in the UPDATE's own WHERE clause (updatedAt is compared
        // by Postgres as part of the single UPDATE statement), never read
        // into application code and compared separately — so two
        // concurrent PATCHes can't both "pass" a check against the same
        // stale snapshot. factoryId is included again here too, redundant
        // with the findFirst above but defense-in-depth on the actual
        // mutating statement.
        const result = await tx.project.updateMany({
          where: { id: projectId, factoryId: user.factoryId, updatedAt: expectedUpdatedAt },
          data,
        });
        if (result.count === 0) {
          // findFirst above already proved this project exists for this
          // factory, so zero rows updated here can only mean the version
          // changed since the caller last read it — never "not found".
          // Cross-factory callers never reach this branch at all (they hit
          // the NotFoundException above), so a 409 never discloses another
          // factory's project.
          throw new ConflictException(
            "This project was modified by someone else since you last loaded it. Reload and try again.",
          );
        }
        updated = await tx.project.findUniqueOrThrow({ where: { id: projectId } });
      } else {
        // No expectedUpdatedAt supplied — unconditional update, preserving
        // backward compatibility for callers not yet sending it (the
        // frontend hasn't been migrated).
        updated = await tx.project.update({ where: { id: projectId }, data });
      }

      await tx.auditEvent.create({
        data: {
          factoryId: user.factoryId,
          entityName: "Project",
          entityId: project.id,
          actionType: "PROJECT_UPDATED",
          performedBy: user.userId,
          detailsJson: { name: updated.name },
        },
      });

      return updated;
    });
  }

  async archiveProject(user: AuthenticatedUser, projectId: string) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({ where: { id: projectId, factoryId: user.factoryId } });
      if (!project) {
        throw new NotFoundException(`No project found with id "${projectId}".`);
      }
      if (project.archivedAt) {
        throw new BadRequestException("This project is already archived.");
      }

      const archived = await tx.project.update({
        where: { id: projectId },
        data: { archivedAt: new Date() },
      });

      await tx.auditEvent.create({
        data: {
          factoryId: user.factoryId,
          entityName: "Project",
          entityId: project.id,
          actionType: "PROJECT_ARCHIVED",
          performedBy: user.userId,
        },
      });

      return archived;
    });
  }

  async restoreProject(user: AuthenticatedUser, projectId: string) {
    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({ where: { id: projectId, factoryId: user.factoryId } });
      if (!project) {
        throw new NotFoundException(`No project found with id "${projectId}".`);
      }
      if (!project.archivedAt) {
        throw new BadRequestException("This project is not archived.");
      }

      const restored = await tx.project.update({
        where: { id: projectId },
        data: { archivedAt: null },
      });

      await tx.auditEvent.create({
        data: {
          factoryId: user.factoryId,
          entityName: "Project",
          entityId: project.id,
          actionType: "PROJECT_RESTORED",
          performedBy: user.userId,
        },
      });

      return restored;
    });
  }

  // PATCH /projects/:id/patterns/:patternId doubles as create-or-update
  // (upsert) keyed on the client's own patternId, rather than requiring a
  // separate POST — Stage 1 deliberately has no standalone
  // "create pattern piece" endpoint (see the task's "do not implement
  // autosave as a separate endpoint" instruction). Update semantics only
  // touch the fields the caller actually sent; create fills in defaults for
  // the rest.
  async upsertPatternPiece(
    user: AuthenticatedUser,
    projectId: string,
    patternId: string,
    dto: UpdatePatternPieceDto,
  ) {
    const name = this.validateName(dto.name, "name");
    const sequence =
      dto.sequence !== undefined ? this.validateBoundedInteger(dto.sequence, "sequence", 0, MAX_SEQUENCE) : undefined;
    const cutQuantity =
      dto.cutQuantity !== undefined
        ? this.validateBoundedInteger(dto.cutQuantity, "cutQuantity", 1, MAX_CUT_QUANTITY)
        : undefined;

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({ where: { id: projectId, factoryId: user.factoryId } });
      if (!project) {
        throw new NotFoundException(`No project found with id "${projectId}".`);
      }
      if (project.archivedAt) {
        throw new BadRequestException("Cannot modify patterns on an archived project.");
      }

      const id = `${projectId}-${patternId}`;
      const updateData: Prisma.PatternPieceUpdateInput = {
        name,
        ...(sequence !== undefined ? { sequence } : {}),
        ...(cutQuantity !== undefined ? { cutQuantity } : {}),
        ...(dto.cutOnFold !== undefined ? { cutOnFold: dto.cutOnFold } : {}),
        ...(dto.required !== undefined ? { required: dto.required } : {}),
        ...(dto.custom !== undefined ? { custom: dto.custom } : {}),
      };

      const piece = await tx.patternPiece.upsert({
        where: { id },
        create: {
          id,
          projectId,
          patternId,
          name,
          sequence: sequence ?? 0,
          cutQuantity: cutQuantity ?? 1,
          cutOnFold: dto.cutOnFold ?? false,
          required: dto.required ?? false,
          custom: dto.custom ?? false,
        },
        update: updateData,
      });

      await tx.auditEvent.create({
        data: {
          factoryId: user.factoryId,
          entityName: "PatternPiece",
          entityId: piece.id,
          actionType: "PATTERN_PIECE_SAVED",
          performedBy: user.userId,
          detailsJson: { projectId, patternId },
        },
      });

      return piece;
    });
  }

  // PUT /projects/:id/patterns/:patternId/geometry — idempotent
  // create-or-replace, keyed the same way as the pattern piece itself. If
  // the piece hasn't been PATCHed yet (a client may save geometry before
  // ever sending piece metadata), a minimal placeholder piece is created
  // in the same transaction rather than requiring a strict ordering.
  async upsertPatternGeometry(
    user: AuthenticatedUser,
    projectId: string,
    patternId: string,
    dto: UpsertPatternGeometryDto,
  ) {
    if (dto.polygon === undefined || dto.polygon === null) {
      throw new BadRequestException("polygon is required.");
    }
    const pointCount = this.polygonPointCount(dto.polygon);
    if (pointCount === null) {
      throw new BadRequestException("polygon must be an array of points, or an object with a points array.");
    }
    if (pointCount > MAX_POLYGON_POINTS) {
      throw new BadRequestException(`polygon must not exceed ${MAX_POLYGON_POINTS} points.`);
    }

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({ where: { id: projectId, factoryId: user.factoryId } });
      if (!project) {
        throw new NotFoundException(`No project found with id "${projectId}".`);
      }
      if (project.archivedAt) {
        throw new BadRequestException("Cannot modify patterns on an archived project.");
      }

      const pieceId = `${projectId}-${patternId}`;
      await tx.patternPiece.upsert({
        where: { id: pieceId },
        create: { id: pieceId, projectId, patternId, name: patternId },
        update: {},
      });

      const geometryId = `${pieceId}-geometry`;
      const data = {
        polygonJson: dto.polygon as Prisma.InputJsonValue,
        calibrationJson: dto.calibration !== undefined ? (dto.calibration as Prisma.InputJsonValue) : Prisma.DbNull,
        grainLineJson: dto.grainLine !== undefined ? (dto.grainLine as Prisma.InputJsonValue) : Prisma.DbNull,
        measurementJson:
          dto.measurements !== undefined ? (dto.measurements as Prisma.InputJsonValue) : Prisma.DbNull,
      };

      const geometry = await tx.patternGeometry.upsert({
        where: { id: geometryId },
        create: { id: geometryId, patternPieceId: pieceId, ...data },
        update: data,
      });

      await tx.auditEvent.create({
        data: {
          factoryId: user.factoryId,
          entityName: "PatternGeometry",
          entityId: geometry.id,
          actionType: "PATTERN_GEOMETRY_SAVED",
          performedBy: user.userId,
          detailsJson: { projectId, patternId },
        },
      });

      return geometry;
    });
  }

  async createMarkerRun(user: AuthenticatedUser, projectId: string, dto: CreateMarkerRunDto) {
    if (dto.snapshot === undefined || dto.snapshot === null) {
      throw new BadRequestException("snapshot is required.");
    }
    if (typeof dto.snapshot !== "object" || Array.isArray(dto.snapshot)) {
      throw new BadRequestException("snapshot must be a JSON object.");
    }
    if (dto.result === undefined || dto.result === null) {
      throw new BadRequestException("result is required.");
    }
    if (typeof dto.result !== "object" || Array.isArray(dto.result)) {
      throw new BadRequestException("result must be a JSON object.");
    }

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({ where: { id: projectId, factoryId: user.factoryId } });
      if (!project) {
        throw new NotFoundException(`No project found with id "${projectId}".`);
      }
      if (project.archivedAt) {
        throw new BadRequestException("Cannot add a marker run to an archived project.");
      }

      const markerRun = await tx.markerRun.create({
        data: {
          projectId,
          createdByUserId: user.userId,
          snapshotJson: dto.snapshot as Prisma.InputJsonValue,
          resultJson: dto.result as Prisma.InputJsonValue,
        },
      });

      await tx.auditEvent.create({
        data: {
          factoryId: user.factoryId,
          entityName: "MarkerRun",
          entityId: markerRun.id,
          actionType: "MARKER_RUN_CREATED",
          performedBy: user.userId,
        },
      });

      return markerRun;
    });
  }

  async listMarkerRuns(user: AuthenticatedUser, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, factoryId: user.factoryId },
    });
    if (!project) {
      throw new NotFoundException(`No project found with id "${projectId}".`);
    }

    return this.prisma.markerRun.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  }
}
