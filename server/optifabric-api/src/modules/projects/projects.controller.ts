import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AuthenticatedUser } from "../auth/auth.types";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./create-project.dto";
import { UpdateProjectDto } from "./update-project.dto";
import { UpdatePatternPieceDto } from "./update-pattern-piece.dto";
import { UpsertPatternGeometryDto } from "./upsert-pattern-geometry.dto";
import { CreateMarkerRunDto } from "./create-marker-run.dto";

// Every route is factory-scoped server-side by ProjectsService (never by
// trusting a client-supplied factoryId) — see that file's header comment.
// SubscriptionGuard (global APP_GUARD) is deliberately NOT skipped here:
// engineering-data access requires an active trial/subscription, same as any
// other core OptiFabric feature.
@UseGuards(JwtAuthGuard)
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  private user(request: Request): AuthenticatedUser {
    return request.user as AuthenticatedUser;
  }

  @Post()
  async create(@Req() request: Request, @Body() dto: CreateProjectDto) {
    return this.projectsService.createProject(this.user(request), dto);
  }

  @Get()
  async list(@Req() request: Request, @Query("archived") archived?: string) {
    return this.projectsService.listProjects(this.user(request), { archived: archived === "true" });
  }

  @Get(":id")
  async get(@Req() request: Request, @Param("id") id: string) {
    return this.projectsService.getProject(this.user(request), id);
  }

  @Patch(":id")
  async update(@Req() request: Request, @Param("id") id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.updateProject(this.user(request), id, dto);
  }

  @Delete(":id")
  async archive(@Req() request: Request, @Param("id") id: string) {
    return this.projectsService.archiveProject(this.user(request), id);
  }

  @Post(":id/restore")
  async restore(@Req() request: Request, @Param("id") id: string) {
    return this.projectsService.restoreProject(this.user(request), id);
  }

  @Patch(":id/patterns/:patternId")
  async upsertPattern(
    @Req() request: Request,
    @Param("id") id: string,
    @Param("patternId") patternId: string,
    @Body() dto: UpdatePatternPieceDto,
  ) {
    return this.projectsService.upsertPatternPiece(this.user(request), id, patternId, dto);
  }

  @Put(":id/patterns/:patternId/geometry")
  async upsertGeometry(
    @Req() request: Request,
    @Param("id") id: string,
    @Param("patternId") patternId: string,
    @Body() dto: UpsertPatternGeometryDto,
  ) {
    return this.projectsService.upsertPatternGeometry(this.user(request), id, patternId, dto);
  }

  @Post(":id/marker-runs")
  async createMarkerRun(@Req() request: Request, @Param("id") id: string, @Body() dto: CreateMarkerRunDto) {
    return this.projectsService.createMarkerRun(this.user(request), id, dto);
  }

  @Get(":id/marker-runs")
  async listMarkerRuns(@Req() request: Request, @Param("id") id: string) {
    return this.projectsService.listMarkerRuns(this.user(request), id);
  }
}
