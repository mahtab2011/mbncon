// Stage 1 engineering-data persistence layer. Every method that takes a
// projectId scopes its lookup by the caller's own factoryId (never a
// client-supplied one — factoryId always comes from the JWT-derived
// AuthenticatedUser) and returns/throws NotFoundException for a project that
// either doesn't exist or belongs to another factory, so a valid id from a
// different tenant is indistinguishable from a nonexistent one. See the
// Project/PatternPiece/PatternGeometry/FabricProfile/MarkerRun comment block
// in prisma/schema.prisma for the id/relationship design.
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";
import { AuthenticatedUser } from "../auth/auth.types";
import { CreateProjectDto } from "./create-project.dto";
import { UpdateProjectDto } from "./update-project.dto";
import { UpdatePatternPieceDto } from "./update-pattern-piece.dto";
import { UpsertPatternGeometryDto } from "./upsert-pattern-geometry.dto";
import { CreateMarkerRunDto } from "./create-marker-run.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

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
    if (!dto.name || !dto.name.trim()) {
      throw new BadRequestException("name is required.");
    }

    return this.prisma.$transaction(async (tx) => {
      const code = await this.generateProjectCode(tx);
      const project = await tx.project.create({
        data: {
          factoryId: user.factoryId,
          createdByUserId: user.userId,
          code,
          name: dto.name.trim(),
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
    if (dto.name !== undefined && !dto.name.trim()) {
      throw new BadRequestException("name cannot be empty.");
    }

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({ where: { id: projectId, factoryId: user.factoryId } });
      if (!project) {
        throw new NotFoundException(`No project found with id "${projectId}".`);
      }
      if (project.archivedAt) {
        throw new BadRequestException("Cannot update an archived project. Restore it first.");
      }

      const updated = await tx.project.update({
        where: { id: projectId },
        data: dto.name !== undefined ? { name: dto.name.trim() } : {},
      });

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
    if (!dto.name || !dto.name.trim()) {
      throw new BadRequestException("name is required.");
    }

    return this.prisma.$transaction(async (tx) => {
      const project = await tx.project.findFirst({ where: { id: projectId, factoryId: user.factoryId } });
      if (!project) {
        throw new NotFoundException(`No project found with id "${projectId}".`);
      }
      if (project.archivedAt) {
        throw new BadRequestException("Cannot modify patterns on an archived project.");
      }

      const id = `${projectId}-${patternId}`;
      const name = dto.name.trim();
      const updateData: Prisma.PatternPieceUpdateInput = {
        name,
        ...(dto.sequence !== undefined ? { sequence: dto.sequence } : {}),
        ...(dto.cutQuantity !== undefined ? { cutQuantity: dto.cutQuantity } : {}),
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
          sequence: dto.sequence ?? 0,
          cutQuantity: dto.cutQuantity ?? 1,
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
    if (dto.result === undefined || dto.result === null) {
      throw new BadRequestException("result is required.");
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
