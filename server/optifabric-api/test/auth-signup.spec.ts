// Covers AuthService.signUp() — mirrors OptiSewing's test/auth-signup.spec.ts.
// Ordinary fresh unit tests against src/modules/auth/auth.service.ts.
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { AuthService } from "../src/modules/auth/auth.service";

const TEST_SECRET = "d".repeat(64);

async function withLicenseSecret<T>(fn: () => Promise<T>): Promise<T> {
  const original = process.env.LICENSE_SIGNING_SECRET;
  process.env.LICENSE_SIGNING_SECRET = TEST_SECRET;
  try {
    return await fn();
  } finally {
    if (original === undefined) delete process.env.LICENSE_SIGNING_SECRET;
    else process.env.LICENSE_SIGNING_SECRET = original;
  }
}

function buildPrismaMock() {
  const tx = {
    factory: { findUnique: jest.fn(), create: jest.fn() },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
    },
    subscription: {
      create: jest.fn(),
      findUnique: jest.fn().mockResolvedValue(null),
      upsert: jest.fn(),
    },
    auditEvent: { create: jest.fn().mockResolvedValue({}) },
  };
  const prisma = { $transaction: jest.fn((fn: (tx: unknown) => unknown) => fn(tx)) };
  return { prisma, tx };
}

describe("AuthService.signUp", () => {
  it("rejects a password shorter than 8 characters", async () => {
    const { prisma } = buildPrismaMock();
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(prisma as never, jwtService as never);

    await expect(
      service.signUp({
        factoryCode: "F-1",
        factoryName: "Test Factory",
        country: "Bangladesh",
        city: "Dhaka",
        email: "admin@test.local",
        password: "short",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("creates a new factory, makes the signing-up user ROLE_FACTORY_ADMIN, and starts a trial", async () => {
    await withLicenseSecret(async () => {
      const { prisma, tx } = buildPrismaMock();
      tx.factory.findUnique.mockResolvedValue(null);
      tx.factory.create.mockResolvedValue({ id: "factory-1", factoryCode: "F-1", country: "Vietnam" });
      tx.user.findUnique.mockResolvedValue(null);
      tx.user.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({ id: "user-1", ...data }),
      );
      const jwtService = { signAsync: jest.fn().mockResolvedValue("signed.jwt") };
      const service = new AuthService(prisma as never, jwtService as never);

      const result = await service.signUp({
        factoryCode: "F-1",
        factoryName: "Test Factory",
        country: "Vietnam",
        city: "Hanoi",
        email: "admin@test.local",
        password: "password123",
      });

      expect(tx.factory.create).toHaveBeenCalled();
      expect(tx.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ role: "ROLE_FACTORY_ADMIN" }) }),
      );
      expect(tx.subscription.create).toHaveBeenCalled();
      expect(result.isFoundingAdmin).toBe(true);
      expect(result.accessToken).toBe("signed.jwt");
    });
  });

  it("joins an existing factory as ROLE_OPERATIVE by default, without creating a duplicate factory or a new trial", async () => {
    await withLicenseSecret(async () => {
      const { prisma, tx } = buildPrismaMock();
      tx.factory.findUnique.mockResolvedValue({ id: "factory-1", factoryCode: "F-1", country: "Vietnam" });
      tx.user.findUnique.mockResolvedValue(null);
      tx.user.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({ id: "user-2", ...data }),
      );
      const jwtService = { signAsync: jest.fn().mockResolvedValue("signed.jwt") };
      const service = new AuthService(prisma as never, jwtService as never);

      const result = await service.signUp({
        factoryCode: "F-1",
        factoryName: "ignored",
        country: "ignored",
        city: "ignored",
        email: "second@test.local",
        password: "password123",
      });

      expect(tx.factory.create).not.toHaveBeenCalled();
      expect(tx.subscription.create).not.toHaveBeenCalled();
      expect(tx.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ role: "ROLE_OPERATIVE" }) }),
      );
      expect(result.isFoundingAdmin).toBe(false);
    });
  });

  it("gives a new Bangladeshi factory's founding admin 3 free seats (FREE_REGIONAL) instead of a trial", async () => {
    await withLicenseSecret(async () => {
      const { prisma, tx } = buildPrismaMock();
      tx.factory.findUnique.mockResolvedValue(null);
      tx.factory.create.mockResolvedValue({ id: "factory-bd", factoryCode: "BD-1", country: "Bangladesh" });
      tx.user.findUnique.mockResolvedValue(null);
      tx.user.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({ id: "user-1", ...data }),
      );
      const jwtService = { signAsync: jest.fn().mockResolvedValue("signed.jwt") };
      const service = new AuthService(prisma as never, jwtService as never);

      await service.signUp({
        factoryCode: "BD-1",
        factoryName: "Dhaka Garments",
        country: "Bangladesh",
        city: "Dhaka",
        email: "admin@test.local",
        password: "password123",
      });

      expect(tx.subscription.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            planType: "BD_FREE_REGIONAL",
            status: "FREE_REGIONAL",
            includedSeats: 3,
            extraSeats: 0,
          }),
        }),
      );
    });
  });

  it("blocks joining a Bangladeshi factory once its 3 free seats (plus any rep-granted extras) are all used", async () => {
    await withLicenseSecret(async () => {
      const { prisma, tx } = buildPrismaMock();
      tx.factory.findUnique.mockResolvedValue({ id: "factory-bd", factoryCode: "BD-1", country: "Bangladesh" });
      tx.user.findUnique.mockResolvedValue(null);
      tx.subscription.findUnique.mockResolvedValue({ includedSeats: 3, extraSeats: 0 });
      tx.user.count.mockResolvedValue(3);
      tx.user.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({ id: "user-4", ...data }),
      );
      const jwtService = { signAsync: jest.fn() };
      const service = new AuthService(prisma as never, jwtService as never);

      const result = await service.signUp({
        factoryCode: "BD-1",
        factoryName: "ignored",
        country: "ignored",
        city: "ignored",
        email: "fourth@test.local",
        password: "password123",
      });

      expect(result.status).toBe("PENDING_APPROVAL");
      expect(tx.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ isActive: false }) }),
      );
    });
  });

  it("holds a foreign factory's signup for approval too, once 3 seats are used (universal rule, no payment gateway yet)", async () => {
    await withLicenseSecret(async () => {
      const { prisma, tx } = buildPrismaMock();
      tx.factory.findUnique.mockResolvedValue({ id: "factory-vn", factoryCode: "VN-1", country: "Vietnam" });
      tx.user.findUnique.mockResolvedValue(null);
      tx.subscription.findUnique.mockResolvedValue({ includedSeats: 2, extraSeats: 0 });
      tx.user.count.mockResolvedValue(3);
      tx.user.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({ id: "user-4", ...data }),
      );
      const jwtService = { signAsync: jest.fn() };
      const service = new AuthService(prisma as never, jwtService as never);

      const result = await service.signUp({
        factoryCode: "VN-1",
        factoryName: "ignored",
        country: "ignored",
        city: "ignored",
        email: "fourth@test.local",
        password: "password123",
      });

      expect(result.status).toBe("PENDING_APPROVAL");
    });
  });

  it("allows joining a Bangladeshi factory while seats remain, counting rep-granted extra seats toward the limit", async () => {
    await withLicenseSecret(async () => {
      const { prisma, tx } = buildPrismaMock();
      tx.factory.findUnique.mockResolvedValue({ id: "factory-bd", factoryCode: "BD-1", country: "Bangladesh" });
      tx.user.findUnique.mockResolvedValue(null);
      tx.subscription.findUnique.mockResolvedValue({ includedSeats: 3, extraSeats: 2 });
      tx.user.count.mockResolvedValue(4); // 4 used, 5 total (3 + 2 extra) — one seat left
      tx.user.create.mockImplementation(({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({ id: "user-5", ...data }),
      );
      const jwtService = { signAsync: jest.fn().mockResolvedValue("signed.jwt") };
      const service = new AuthService(prisma as never, jwtService as never);

      const result = await service.signUp({
        factoryCode: "BD-1",
        factoryName: "ignored",
        country: "ignored",
        city: "ignored",
        email: "fifth@test.local",
        password: "password123",
      });

      expect(tx.user.create).toHaveBeenCalled();
      expect(result.isFoundingAdmin).toBe(false);
    });
  });

  it("rejects signup with an email that already exists for that factory", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.factory.findUnique.mockResolvedValue({ id: "factory-1", factoryCode: "F-1" });
    tx.user.findUnique.mockResolvedValue({ id: "existing-user" });
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(prisma as never, jwtService as never);

    await expect(
      service.signUp({
        factoryCode: "F-1",
        factoryName: "ignored",
        country: "ignored",
        city: "ignored",
        email: "duplicate@test.local",
        password: "password123",
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});

describe("AuthService.approvePendingUser", () => {
  it("activates a pending user and grants the factory one more extra seat", async () => {
    await withLicenseSecret(async () => {
      const { prisma, tx } = buildPrismaMock();
      tx.user.findUnique.mockResolvedValue({ id: "user-4", factoryId: "factory-bd", isActive: false });
      tx.factory.findUnique.mockResolvedValue({ id: "factory-bd", country: "Bangladesh" });
      tx.subscription.findUnique.mockResolvedValue(null);
      tx.subscription.upsert.mockImplementation(({ create }: { create: Record<string, unknown> }) =>
        Promise.resolve({ id: "sub-bd", ...create }),
      );
      const jwtService = { signAsync: jest.fn() };
      const service = new AuthService(prisma as never, jwtService as never);

      const result = await service.approvePendingUser("user-4", "confirmed via bKash");

      expect(tx.user.update).toHaveBeenCalledWith({ where: { id: "user-4" }, data: { isActive: true } });
      expect(result.extraSeats).toBe(1);
    });
  });

  it("rejects approving a user that does not exist", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.user.findUnique.mockResolvedValue(null);
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(prisma as never, jwtService as never);

    await expect(service.approvePendingUser("missing-user")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("rejects approving a user that is already active", async () => {
    const { prisma, tx } = buildPrismaMock();
    tx.user.findUnique.mockResolvedValue({ id: "user-1", factoryId: "factory-1", isActive: true });
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(prisma as never, jwtService as never);

    await expect(service.approvePendingUser("user-1")).rejects.toBeInstanceOf(BadRequestException);
  });
});
