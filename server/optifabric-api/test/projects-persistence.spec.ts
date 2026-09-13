// Covers the Stage 1 engineering-data persistence layer added to
// src/modules/projects — ordinary fresh unit tests against
// ProjectsService, mirroring the buildPrismaMock()/tx pattern used by
// test/auth-signup.spec.ts (this codebase's unit tests mock Prisma directly
// rather than spinning up a Nest testing module / real database).
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { ProjectsService } from "../src/modules/projects/projects.service";
import { AuthenticatedUser } from "../src/modules/auth/auth.types";
import { MAX_NAME_LENGTH, MAX_POLYGON_POINTS } from "../src/modules/projects/projects.constants";

function buildPrismaMock() {
  const project = {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  };
  const patternPiece = { upsert: jest.fn(), create: jest.fn() };
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

// Stage 1B core fields — valid values shared by every createProject() test
// that doesn't specifically exercise one of these fields.
const VALID_CORE_FIELDS = {
  customer: "Acme Apparel",
  styleNumber: "EDS-001",
  garmentCategory: "shirt",
  mainCategory: "woven",
  subcategory: "tops",
  fabricWidth: 60,
  orderQuantity: 1200,
  scaleLength: 12,
};

describe("ProjectsService.createProject", () => {
  it("creates a project scoped to the authenticated factory with a server-generated code", async () => {
    const { prisma, tx, queryRaw } = buildPrismaMock();
    queryRaw.mockResolvedValue([{ nextval: 7n }]);
    tx.project.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "project-1", ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const result = await service.createProject(userA, { name: "Denim Jacket RC1", ...VALID_CORE_FIELDS });

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
    await expect(
      service.createProject(userA, { name: "   ", ...VALID_CORE_FIELDS }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects a name longer than MAX_NAME_LENGTH", async () => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);
    await expect(
      service.createProject(userA, { name: "x".repeat(MAX_NAME_LENGTH + 1), ...VALID_CORE_FIELDS }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([
    ["customer", { customer: "" }],
    ["styleNumber", { styleNumber: "" }],
    ["garmentCategory", { garmentCategory: "" }],
  ])("rejects an empty required core field: %s", async (_label, override) => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);
    await expect(
      service.createProject(userA, { name: "Valid Name", ...VALID_CORE_FIELDS, ...override }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([
    ["negative fabricWidth", { fabricWidth: -1 }],
    ["zero fabricWidth", { fabricWidth: 0 }],
    ["fabricWidth over MAX_FABRIC_WIDTH", { fabricWidth: 1_000_001 }],
    ["fractional orderQuantity", { orderQuantity: 12.5 }],
    ["negative orderQuantity", { orderQuantity: -5 }],
    ["orderQuantity over MAX_ORDER_QUANTITY", { orderQuantity: 10_000_000_001 }],
    ["zero scaleLength", { scaleLength: 0 }],
    ["scaleLength over MAX_SCALE_LENGTH", { scaleLength: 1_000_001 }],
  ])("rejects an invalid numeric core field: %s", async (_label, override) => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);
    await expect(
      service.createProject(userA, { name: "Valid Name", ...VALID_CORE_FIELDS, ...override }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("accepts omitted mainCategory/subcategory (optional, mirroring EngineeringProject)", async () => {
    const { prisma, tx, queryRaw } = buildPrismaMock();
    queryRaw.mockResolvedValue([{ nextval: 1n }]);
    tx.project.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "project-1", ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const { mainCategory, subcategory, ...rest } = VALID_CORE_FIELDS;
    void mainCategory;
    void subcategory;

    await expect(service.createProject(userA, { name: "Valid Name", ...rest })).resolves.toBeDefined();
    expect(tx.project.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ mainCategory: undefined, subcategory: undefined }),
      }),
    );
  });

  // Stage 1B+2A correction: initial pattern pieces must be persisted
  // atomically with the project, not require N follow-up calls.
  it("persists initial pattern pieces atomically with the project", async () => {
    const { prisma, tx, queryRaw } = buildPrismaMock();
    queryRaw.mockResolvedValue([{ nextval: 1n }]);
    tx.project.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "project-1", ...data }),
    );
    tx.patternPiece.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const result = await service.createProject(userA, {
      name: "Denim Jacket",
      ...VALID_CORE_FIELDS,
      patterns: [
        { patternId: "front-body", name: "Front Body", sequence: 0, cutQuantity: 2, required: true },
        { patternId: "back-body", name: "Back Body", sequence: 1 },
      ],
    });

    expect(tx.patternPiece.create).toHaveBeenCalledTimes(2);
    expect(tx.patternPiece.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          id: "project-1-front-body",
          projectId: "project-1",
          patternId: "front-body",
          name: "Front Body",
          cutQuantity: 2,
          required: true,
        }),
      }),
    );
    expect(result.patternPieces).toHaveLength(2);
    expect(tx.auditEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ detailsJson: expect.objectContaining({ initialPatternCount: 2 }) }),
      }),
    );
  });

  it("rejects a duplicate patternId within the initial patterns array", async () => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);

    await expect(
      service.createProject(userA, {
        name: "Denim Jacket",
        ...VALID_CORE_FIELDS,
        patterns: [
          { patternId: "front-body", name: "Front Body" },
          { patternId: "front-body", name: "Front Body Again" },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects more than MAX_INITIAL_PATTERNS initial pattern pieces", async () => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);

    const patterns = Array.from({ length: 501 }, (_, i) => ({ patternId: `piece-${i}`, name: `Piece ${i}` }));

    await expect(
      service.createProject(userA, { name: "Denim Jacket", ...VALID_CORE_FIELDS, patterns }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  // Simulates a failure partway through persisting the initial pattern set
  // (e.g. a DB-level constraint violation on the second piece). Since the
  // whole loop runs inside the same Prisma $transaction as the Project
  // insert, a thrown error here must reject createProject's own promise
  // (proving the code never treats a partial pattern-piece write as
  // success) — real all-or-nothing rollback of the Project row itself is a
  // property of the underlying Postgres transaction (unchanged from Stage
  // 1's design), which a mocked-Prisma unit test cannot independently
  // exercise.
  it("does not report success if pattern-piece creation fails partway through", async () => {
    const { prisma, tx, queryRaw } = buildPrismaMock();
    queryRaw.mockResolvedValue([{ nextval: 1n }]);
    tx.project.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "project-1", ...data }),
    );
    tx.patternPiece.create
      .mockResolvedValueOnce({ id: "project-1-front-body" })
      .mockRejectedValueOnce(new Error("simulated unique constraint violation"));
    const service = new ProjectsService(prisma as never);

    await expect(
      service.createProject(userA, {
        name: "Denim Jacket",
        ...VALID_CORE_FIELDS,
        patterns: [
          { patternId: "front-body", name: "Front Body" },
          { patternId: "back-body", name: "Back Body" },
        ],
      }),
    ).rejects.toThrow("simulated unique constraint violation");

    // The loop never reaches a third piece, and no audit event is written
    // for a run that didn't complete.
    expect(tx.patternPiece.create).toHaveBeenCalledTimes(2);
    expect(tx.auditEvent.create).not.toHaveBeenCalled();
  });
});

describe("ProjectsService.getProject", () => {
  it("returns a project's persisted pattern pieces", async () => {
    const { prisma } = buildPrismaMock();
    prisma.project.findFirst.mockResolvedValue({
      id: "project-1",
      factoryId: "factory-a",
      patternPieces: [{ id: "project-1-front-body", patternId: "front-body", name: "Front Body" }],
    });
    const service = new ProjectsService(prisma as never);

    const result = await service.getProject(userA, "project-1");

    expect(prisma.project.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "project-1", factoryId: "factory-a" },
        include: { patternPieces: { orderBy: { sequence: "asc" }, include: { geometry: true } } },
      }),
    );
    expect(result.patternPieces).toEqual([
      { id: "project-1-front-body", patternId: "front-body", name: "Front Body" },
    ]);
  });

  // Stage 2B-1: GET /projects/:id must return each piece's saved geometry
  // (nested include), not just the piece itself — the fresh-device frontend
  // mapper (lib/optifabric/projectApi.ts's extractSavedGeometryRecords)
  // depends on this to reconstruct geometry without any local cache.
  it("returns each pattern piece's saved geometry, when present", async () => {
    const { prisma } = buildPrismaMock();
    prisma.project.findFirst.mockResolvedValue({
      id: "project-1",
      factoryId: "factory-a",
      patternPieces: [
        {
          id: "project-1-front-body",
          patternId: "front-body",
          name: "Front Body",
          geometry: {
            id: "project-1-front-body-geometry",
            patternPieceId: "project-1-front-body",
            polygonJson: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }],
            calibrationJson: { pixelsPerCm: 12.5 },
            grainLineJson: null,
            measurementJson: { widthCm: 20, heightCm: 15 },
          },
        },
        { id: "project-1-back-body", patternId: "back-body", name: "Back Body", geometry: null },
      ],
    });
    const service = new ProjectsService(prisma as never);

    const result = await service.getProject(userA, "project-1");

    expect(result.patternPieces[0].geometry).toEqual(
      expect.objectContaining({ polygonJson: expect.any(Array), calibrationJson: { pixelsPerCm: 12.5 } }),
    );
    expect(result.patternPieces[1].geometry).toBeNull();
  });

  // Stage 2B-3: grainLineJson is opaque on the backend (same as
  // calibrationJson/measurementJson above) — this just confirms a populated
  // value round-trips through GET unchanged, the same way the null case
  // above already does. The frontend shape it happens to hold today
  // (lib/optifabric/projectApi.ts's readGrainLine) is a frontend concern.
  it("returns a populated grainLineJson unchanged", async () => {
    const { prisma } = buildPrismaMock();
    const grainLineJson = { firstPoint: { x: 2, y: 2 }, secondPoint: { x: 2, y: 30 }, lengthCm: 25.4 };
    prisma.project.findFirst.mockResolvedValue({
      id: "project-1",
      factoryId: "factory-a",
      patternPieces: [
        {
          id: "project-1-front-body",
          patternId: "front-body",
          name: "Front Body",
          geometry: {
            id: "project-1-front-body-geometry",
            patternPieceId: "project-1-front-body",
            polygonJson: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }],
            calibrationJson: { pixelsPerCm: 12.5 },
            grainLineJson,
            measurementJson: { widthCm: 20, heightCm: 15 },
          },
        },
      ],
    });
    const service = new ProjectsService(prisma as never);

    const result = await service.getProject(userA, "project-1");

    expect(result.patternPieces[0].geometry).toEqual(
      expect.objectContaining({ grainLineJson }),
    );
  });

  it("denies reading a project (with geometry) belonging to another factory", async () => {
    const { prisma } = buildPrismaMock();
    prisma.project.findFirst.mockResolvedValue(null);
    const service = new ProjectsService(prisma as never);

    await expect(service.getProject(userA, "project-owned-by-factory-b")).rejects.toBeInstanceOf(NotFoundException);
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

  // Stage 1A: a stale-version update attempt on another factory's project
  // must still surface as 404, never 409 — a 409 would disclose that a
  // project with that id exists (just with a different version) even
  // though the caller has no access to it at all.
  it("denies a stale-update attempt on a project belonging to another factory as 404, not 409", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue(null);
    const service = new ProjectsService(prisma as never);

    await expect(
      service.updateProject(userA, "project-b", {
        name: "New name",
        expectedUpdatedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(tx.project.updateMany).not.toHaveBeenCalled();
  });
});

describe("ProjectsService.updateProject optimistic concurrency", () => {
  const CURRENT_UPDATED_AT = new Date("2026-01-01T00:00:00.000Z");

  it("succeeds when expectedUpdatedAt matches the project's current updatedAt", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({
      id: "project-1",
      factoryId: "factory-a",
      archivedAt: null,
      updatedAt: CURRENT_UPDATED_AT,
    });
    tx.project.updateMany.mockResolvedValue({ count: 1 });
    tx.project.findUniqueOrThrow.mockResolvedValue({ id: "project-1", name: "New name" });
    const service = new ProjectsService(prisma as never);

    const result = await service.updateProject(userA, "project-1", {
      name: "New name",
      expectedUpdatedAt: CURRENT_UPDATED_AT.toISOString(),
    });

    expect(tx.project.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "project-1", factoryId: "factory-a", updatedAt: CURRENT_UPDATED_AT },
      }),
    );
    expect(result.name).toBe("New name");
  });

  it("rejects a stale expectedUpdatedAt with 409, without touching the row", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({
      id: "project-1",
      factoryId: "factory-a",
      archivedAt: null,
      updatedAt: CURRENT_UPDATED_AT,
    });
    // The conditional UPDATE's own WHERE clause is what decides staleness —
    // simulated here by the DB-side match failing (0 rows affected), not by
    // comparing timestamps in the test/application code.
    tx.project.updateMany.mockResolvedValue({ count: 0 });
    const service = new ProjectsService(prisma as never);

    await expect(
      service.updateProject(userA, "project-1", {
        name: "New name",
        expectedUpdatedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(tx.project.findUniqueOrThrow).not.toHaveBeenCalled();
  });

  it("rejects an invalid expectedUpdatedAt timestamp with 400", async () => {
    const { prisma, tx } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);

    await expect(
      service.updateProject(userA, "project-1", { name: "New name", expectedUpdatedAt: "not-a-date" }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(tx.project.findFirst).not.toHaveBeenCalled();
  });

  it("falls back to an unconditional update when expectedUpdatedAt is omitted (backward compatibility)", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({
      id: "project-1",
      factoryId: "factory-a",
      archivedAt: null,
      updatedAt: CURRENT_UPDATED_AT,
    });
    tx.project.update.mockResolvedValue({ id: "project-1", name: "New name" });
    const service = new ProjectsService(prisma as never);

    const result = await service.updateProject(userA, "project-1", { name: "New name" });

    expect(tx.project.updateMany).not.toHaveBeenCalled();
    expect(tx.project.update).toHaveBeenCalledWith({ where: { id: "project-1" }, data: { name: "New name" } });
    expect(result.name).toBe("New name");
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

  it("rejects a name longer than MAX_NAME_LENGTH", async () => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);

    await expect(
      service.upsertPatternPiece(userA, "project-1", "front-body", { name: "x".repeat(MAX_NAME_LENGTH + 1) }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([
    ["negative", -1],
    ["fractional", 1.5],
    ["excessively large", 100_000_001],
  ])("rejects a %s sequence value", async (_label, value) => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);

    await expect(
      service.upsertPatternPiece(userA, "project-1", "front-body", { name: "Front Body", sequence: value }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([
    ["negative", -1],
    ["zero", 0],
    ["fractional", 2.5],
    ["excessively large", 100_000_001],
  ])("rejects a %s cutQuantity value", async (_label, value) => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);

    await expect(
      service.upsertPatternPiece(userA, "project-1", "front-body", { name: "Front Body", cutQuantity: value }),
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

  // Stage 2B-3: grainLine follows the exact same passthrough as
  // calibration/measurements above — this was already true before this
  // stage (the DTO/service were Stage 1 groundwork with no frontend writer
  // yet), this just adds coverage now that the trace page actually sends it.
  it("persists a provided grainLine payload", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.patternGeometry.upsert.mockResolvedValue({ id: "project-1-front-body-geometry" });
    const service = new ProjectsService(prisma as never);
    const grainLine = { firstPoint: { x: 2, y: 2 }, secondPoint: { x: 2, y: 30 }, lengthCm: 25.4 };

    await service.upsertPatternGeometry(userA, "project-1", "front-body", {
      polygon: [{ x: 1, y: 1 }],
      grainLine,
    });

    const call = tx.patternGeometry.upsert.mock.calls[0][0];
    expect(call.update.grainLineJson).toEqual(grainLine);
    expect(call.create.grainLineJson).toEqual(grainLine);
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

  // Stage 1A payload investigation: these two accept-case tests cover both
  // of the frontend's non-interchangeable in-flight polygon shapes (a flat
  // point array, and a richer object carrying its points under `.points`)
  // at a realistically large-but-legitimate size (800 points — well above a
  // typical piece, comfortably below MAX_POLYGON_POINTS), confirming the
  // structural check doesn't pick a winner between them or reject
  // legitimate detailed tracing data.
  it("accepts a large, realistic polygon in the flat point-array shape", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.patternGeometry.upsert.mockResolvedValue({ id: "project-1-front-body-geometry" });
    const service = new ProjectsService(prisma as never);

    const polygon = Array.from({ length: 800 }, (_, i) => ({ x: i, y: i * 2 }));

    await expect(service.upsertPatternGeometry(userA, "project-1", "front-body", { polygon })).resolves.toBeDefined();
  });

  it("accepts a large, realistic polygon in the rich points-object shape", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.patternGeometry.upsert.mockResolvedValue({ id: "project-1-front-body-geometry" });
    const service = new ProjectsService(prisma as never);

    const polygon = {
      points: Array.from({ length: 800 }, (_, i) => ({ id: `p-${i}`, x: i, y: i * 2, sequence: i })),
      closed: true,
    };

    await expect(service.upsertPatternGeometry(userA, "project-1", "front-body", { polygon })).resolves.toBeDefined();
  });

  it("rejects a polygon exceeding MAX_POLYGON_POINTS", async () => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);

    const polygon = Array.from({ length: MAX_POLYGON_POINTS + 1 }, (_, i) => ({ x: i, y: i }));

    await expect(
      service.upsertPatternGeometry(userA, "project-1", "front-body", { polygon }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects a polygon that is neither an array nor a points-bearing object", async () => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);

    await expect(
      service.upsertPatternGeometry(userA, "project-1", "front-body", { polygon: "not-a-polygon" }),
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

  // Stage 1A payload investigation: a realistically large marker run (40
  // distinct pieces in the snapshot, 300 placed instances in the result,
  // each carrying its own 100-point polygon — see main.ts's sizing note)
  // must still be accepted at the service/validation layer. The actual
  // byte-size ceiling (5 MB, see JSON_BODY_LIMIT in main.ts) is enforced by
  // Express's body parser before a request ever reaches this service, and
  // isn't exercised by this unit-test suite (no supertest/live-server
  // tests exist in this codebase — see test/auth-signup.spec.ts's own
  // comment on the convention this suite follows).
  it("accepts a large, realistic marker snapshot/result payload", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.project.findFirst.mockResolvedValue({ id: "project-1", factoryId: "factory-a", archivedAt: null });
    tx.markerRun.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: "marker-run-1", ...data }),
    );
    const service = new ProjectsService(prisma as never);

    const pieces = Array.from({ length: 40 }, (_, i) => ({
      id: `piece-${i}`,
      patternId: `pattern-${i}`,
      polygon: Array.from({ length: 100 }, (_, j) => ({ x: j, y: j })),
    }));
    const placedPieces = Array.from({ length: 300 }, (_, i) => ({
      id: `placed-${i}`,
      sourcePieceId: `piece-${i % 40}`,
      transformedPolygon: Array.from({ length: 100 }, (_, j) => ({ x: j, y: j })),
    }));

    await expect(
      service.createMarkerRun(userA, "project-1", {
        snapshot: { pieces, settings: { fabricWidthCm: 150 } },
        result: { success: true, layout: { placedPieces }, statistics: { markerEfficiencyPercent: 82.4 } },
      }),
    ).resolves.toBeDefined();
  });

  it("rejects a snapshot/result that is an array instead of a JSON object", async () => {
    const { prisma } = buildPrismaMock();
    const service = new ProjectsService(prisma as never);

    await expect(
      service.createMarkerRun(userA, "project-1", { snapshot: [], result: { success: true } }),
    ).rejects.toBeInstanceOf(BadRequestException);
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

    const result = await service.createProject(userA, { name: "Project 42", ...VALID_CORE_FIELDS });

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
      service.createProject(userA, { name: "A", ...VALID_CORE_FIELDS }),
      service.createProject(userA, { name: "B", ...VALID_CORE_FIELDS }),
      service.createProject(userA, { name: "C", ...VALID_CORE_FIELDS }),
    ]);

    expect(new Set([a.code, b.code, c.code]).size).toBe(3);
    expect(queryRaw).toHaveBeenCalledTimes(3);
  });
});
