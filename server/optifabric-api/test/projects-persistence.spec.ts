// Covers the Stage 1 engineering-data persistence layer added to
// src/modules/projects — ordinary fresh unit tests against
// ProjectsService, mirroring the buildPrismaMock()/tx pattern used by
// test/auth-signup.spec.ts (this codebase's unit tests mock Prisma directly
// rather than spinning up a Nest testing module / real database).
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ProjectsService } from "../src/modules/projects/projects.service";
import { AuthenticatedUser } from "../src/modules/auth/auth.types";

function buildPrismaMock() {
  const project = {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
  const patternPiece = { upsert: jest.fn() };
  const patternGeometry = { upsert: jest.fn() };
  const markerRun = { create: jest.fn(), findMany: jest.fn() };
  const auditEvent = { create: jest.fn().mockResolvedValue({}) };
  const queryRaw = jest.fn().mockResolvedValue([{ nextval: 1n }]);

  // project/patternPiece/patternGeometry/markerRun/auditEvent are the SAME
  // objects on both `prisma` and `tx` — ProjectsService reads some models
  // (project.findMany, project.findFirst for plain reads) directly off
  // PrismaService, and others only inside $transaction(tx => ...); sharing
  // the mock objects means a test can set expectations without caring which
  // path a given method takes.
  const tx = { project, patternPiece, patternGeometry, markerRun, auditEvent, $queryRaw: queryRaw };
  const prisma = {
    project,
    patternPiece,
    patternGeometry,
    markerRun,
    auditEvent,
    $transaction: jest.fn((fn: (tx: unknown) => unknown) => fn(tx)),
  };
  return { prisma, tx, queryRaw };
}

const userA: AuthenticatedUser = { userId: "user-a", factoryId: "factory-a", role: "ROLE_OPERATIVE", jti: "jti-a" };

describe("ProjectsService.createProject", () => {
  it("creates a project scoped to the authenticated factory with a server-generated code", async () => {
    const { prisma, tx, queryRaw } = buildPrismaMock();
    queryRaw.mockResolvedValue([{ nextval: 7n }]);
    tx.project.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "project-1", ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const result = await service.createProject(userA, { name: "Denim Jacket RC1" });

    expect(tx.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          factoryId: "factory-a",
          createdByUserId: "user-a",
          name: "Denim Jacket RC1",
        }),
      }),
    );
    expect(result.code).toBe(`OF-${new Date().getFullYear()}-000007`);
    expect(tx.auditEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ actionType: "PROJECT_CREATED", factoryId: "factory-a" }),
      }),
    );
  });

  it("rejects an empty name", async () => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);
    await expect(service.createProject(userA, { name: "   " })).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe("ProjectsService.listProjects", () => {
  it("only queries projects scoped to the caller's own factory", async () => {
    const { prisma } = buildPrismaMock();
    prisma.project.findMany.mockResolvedValue([{ id: "p1" }]);
    const service = new ProjectsService(prisma as never);

    await service.listProjects(userA);

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ factoryId: "factory-a" }) }),
    );
  });
});

describe("ProjectsService cross-factory access", () => {
  it("denies reading a project belonging to another factory", async () => {
    const { prisma } = buildPrismaMock();
    prisma.project.findFirst.mockResolvedValue(null); // scoped query finds nothing for this factory
    const service = new ProjectsService(prisma as never);

    await expect(service.getProject(userA, "project-owned-by-factory-b")).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.project.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "project-owned-by-factory-b", factoryId: "factory-a" } }),
    );
  });

  it("denies updating a project belonging to another factory", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue(null);
    const service = new ProjectsService(prisma as never);

    await expect(service.updateProject(userA, "project-b", { name: "New name" })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(tx.project.update).not.toHaveBeenCalled();
  });

  it("denies archiving a project belonging to another factory", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue(null);
    const service = new ProjectsService(prisma as never);

    await expect(service.archiveProject(userA, "project-b")).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.project.update).not.toHaveBeenCalled();
  });

  it("denies restoring a project belonging to another factory", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue(null);
    const service = new ProjectsService(prisma as never);

    await expect(service.restoreProject(userA, "project-b")).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.project.update).not.toHaveBeenCalled();
  });

  it("denies patching a pattern piece on a project belonging to another factory", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue(null);
    const service = new ProjectsService(prisma as never);

    await expect(
      service.upsertPatternPiece(userA, "project-b", "front-body", { name: "Front Body" }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.patternPiece.upsert).not.toHaveBeenCalled();
  });

  it("denies saving geometry on a project belonging to another factory", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue(null);
    const service = new ProjectsService(prisma as never);

    await expect(
      service.upsertPatternGeometry(userA, "project-b", "front-body", { polygon: [{ x: 0, y: 0 }] }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.patternGeometry.upsert).not.toHaveBeenCalled();
  });

  it("denies creating a marker run on a project belonging to another factory", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue(null);
    const service = new ProjectsService(prisma as never);

    await expect(
      service.createMarkerRun(userA, "project-b", { snapshot: { pieces: [] }, result: { success: true } }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.markerRun.create).not.toHaveBeenCalled();
  });

  it("denies listing marker runs on a project belonging to another factory", async () => {
    const { prisma } = buildPrismaMock();
    prisma.project.findFirst.mockResolvedValue(null);
    const service = new ProjectsService(prisma as never);

    await expect(service.listMarkerRuns(userA, "project-b")).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.markerRun.findMany).not.toHaveBeenCalled();
  });
});

describe("ProjectsService.upsertPatternPiece", () => {
  it("creates a new piece with defaults for omitted optional fields", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.patternPiece.upsert.mockImplementation(({ create }: { create: Record<string, unknown> }) =>
      Promise.resolve({ ...create }),
    );
    const service = new ProjectsService(prisma as never);

    const result = await service.upsertPatternPiece(userA, "project-1", "front-body", { name: "Front Body" });

    expect(result).toEqual(
      expect.objectContaining({
        id: "project-1-front-body",
        patternId: "front-body",
        cutQuantity: 1,
        cutOnFold: false,
      }),
    );
  });

  it("only updates fields explicitly provided, leaving others untouched", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.patternPiece.upsert.mockResolvedValue({ id: "project-1-front-body" });
    const service = new ProjectsService(prisma as never);

    await service.upsertPatternPiece(userA, "project-1", "front-body", { name: "Front Body", cutQuantity: 4 });

    const call = tx.patternPiece.upsert.mock.calls[0][0];
    expect(call.update).toEqual({ name: "Front Body", cutQuantity: 4 });
    expect(call.update.cutOnFold).toBeUndefined();
  });

  it("rejects modifying patterns on an archived project", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: new Date() });
    const service = new ProjectsService(prisma as never);

    await expect(
      service.upsertPatternPiece(userA, "project-1", "front-body", { name: "Front Body" }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe("ProjectsService.upsertPatternGeometry", () => {
  it("creates a piece placeholder and geometry when neither exists yet", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.patternGeometry.upsert.mockImplementation(({ create }: { create: Record<string, unknown> }) =>
      Promise.resolve({ ...create }),
    );
    const service = new ProjectsService(prisma as never);

    const result = await service.upsertPatternGeometry(userA, "project-1", "front-body", {
      polygon: [{ x: 0, y: 0 }],
      calibration: { calibrated: true },
    });

    expect(tx.patternPiece.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "project-1-front-body" } }),
    );
    expect(tx.patternGeometry.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "project-1-front-body-geometry" },
        create: expect.objectContaining({ patternPieceId: "project-1-front-body" }),
      }),
    );
    expect(result.id).toBe("project-1-front-body-geometry");
  });

  it("updates existing geometry, clearing omitted optional fields to null", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.patternGeometry.upsert.mockResolvedValue({ id: "project-1-front-body-geometry" });
    const service = new ProjectsService(prisma as never);

    await service.upsertPatternGeometry(userA, "project-1", "front-body", { polygon: [{ x: 1, y: 1 }] });

    const call = tx.patternGeometry.upsert.mock.calls[0][0];
    expect(call.update.polygonJson).toEqual([{ x: 1, y: 1 }]);
    // Absent optional fields must become Prisma.DbNull (an explicit SQL NULL
    // sentinel), not be silently dropped from the update — Prisma throws if
    // you pass a plain JS `null` for a nullable Json column directly.
    expect(call.update.calibrationJson).toBeDefined();
  });

  it("rejects a missing polygon", async () => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);
    await expect(
      service.upsertPatternGeometry(userA, "project-1", "front-body", { polygon: undefined }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects modifying patterns on an archived project", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: new Date() });
    const service = new ProjectsService(prisma as never);

    await expect(
      service.upsertPatternGeometry(userA, "project-1", "front-body", { polygon: [] }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe("ProjectsService.createMarkerRun", () => {
  it("records a marker run created by the authenticated user", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.markerRun.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "marker-run-1", ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const result = await service.createMarkerRun(userA, "project-1", {
      snapshot: { fabricWidthCm: 150 },
      result: { success: true },
    });

    expect(result.createdByUserId).toBe("user-a");
    expect(tx.auditEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ actionType: "MARKER_RUN_CREATED" }) }),
    );
  });
});

describe("ProjectsService archive/restore", () => {
  it("archives an active project", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.project.update.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "project-1", ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const result = await service.archiveProject(userA, "project-1");

    expect(result.archivedAt).toBeInstanceOf(Date);
    expect(tx.auditEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ actionType: "PROJECT_ARCHIVED" }) }),
    );
  });

  it("rejects archiving an already-archived project", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: new Date() });
    const service = new ProjectsService(prisma as never);

    await expect(service.archiveProject(userA, "project-1")).rejects.toBeInstanceOf(BadRequestException);
  });

  it("restores an archived project", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: new Date() });
    tx.project.update.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "project-1", archivedAt: null, ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const result = await service.restoreProject(userA, "project-1");

    expect(result.archivedAt).toBeNull();
    expect(tx.auditEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ actionType: "PROJECT_RESTORED" }) }),
    );
  });

  it("rejects restoring a project that isn't archived", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    const service = new ProjectsService(prisma as never);

    await expect(service.restoreProject(userA, "project-1")).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe("ProjectsService project-code generation", () => {
  it("formats the code from the sequence's next value, zero-padded to 6 digits", async () => {
    const { prisma, tx, queryRaw } = buildPrismaMock();
    queryRaw.mockResolvedValue([{ nextval: 42n }]);
    tx.project.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "project-1", ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const result = await service.createProject(userA, { name: "Project 42" });

    expect(result.code).toBe(`OF-${new Date().getFullYear()}-000042`);
  });

  // Simulates what concurrent POST /projects requests rely on: each call
  // gets its own nextval() draw (Postgres sequences are atomic across
  // concurrent transactions), so codes never collide even under contention.
  it("never reuses a code across concurrent creates, since nextval() is drawn once per create", async () => {
    const { prisma, tx, queryRaw } = buildPrismaMock();
    let counter = 0;
    queryRaw.mockImplementation(() => Promise.resolve([{ nextval: BigInt(++counter) }]));
    tx.project.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: `project-${String(data.code)}`, ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const [a, b, c] = await Promise.all([
      service.createProject(userA, { name: "A" }),
      service.createProject(userA, { name: "B" }),
      service.createProject(userA, { name: "C" }),
    ]);

    expect(new Set([a.code, b.code, c.code]).size).toBe(3);
    expect(queryRaw).toHaveBeenCalledTimes(3);
  });
});
