// Fail-closed startup checks (mirroring OptiSewing's env-validation coverage)
// plus AuthService's token issuance/revocation ledger.
import { validateEnv } from "../src/config/env-validation.config";
import { AuthService } from "../src/modules/auth/auth.service";

const VALID_JWT_SECRET = "a".repeat(64);
const VALID_LICENSE_SIGNING_SECRET = "b".repeat(64);
const VALID_PLATFORM_REP_API_KEY = "e".repeat(64);

function baseEnv(overrides: Record<string, string | undefined> = {}) {
  return {
    DATABASE_URL: "postgresql://user:pass@localhost:5432/optifabric",
    JWT_SECRET: VALID_JWT_SECRET,
    CORS_ALLOWED_ORIGINS: "https://optifabric.mbncon.com",
    LICENSE_SIGNING_SECRET: VALID_LICENSE_SIGNING_SECRET,
    PLATFORM_REP_API_KEY: VALID_PLATFORM_REP_API_KEY,
    ...overrides,
  };
}

describe("validateEnv (fail-closed startup checks)", () => {
  it("throws when required env vars are missing", () => {
    expect(() => validateEnv({})).toThrow(/missing required env vars/);
  });

  it("throws when JWT_SECRET is shorter than 64 characters", () => {
    expect(() => validateEnv(baseEnv({ JWT_SECRET: "too-short" }))).toThrow(/JWT_SECRET must be at least 64/);
  });

  it("throws when LICENSE_SIGNING_SECRET is shorter than 64 characters", () => {
    expect(() => validateEnv(baseEnv({ LICENSE_SIGNING_SECRET: "too-short" }))).toThrow(
      /LICENSE_SIGNING_SECRET must be at least 64/,
    );
  });

  it("throws when PLATFORM_REP_API_KEY is shorter than 64 characters", () => {
    expect(() => validateEnv(baseEnv({ PLATFORM_REP_API_KEY: "too-short" }))).toThrow(
      /PLATFORM_REP_API_KEY must be at least 64/,
    );
  });

  it("throws when CORS_ALLOWED_ORIGINS is a wildcard", () => {
    expect(() => validateEnv(baseEnv({ CORS_ALLOWED_ORIGINS: "*" }))).toThrow(/must not be a wildcard/);
  });

  it("defaults JWT_EXPIRATION to the canonical 7d baseline when unset", () => {
    const env = validateEnv(baseEnv());
    expect(env.JWT_EXPIRATION).toBe("7d");
  });

  it("parses a comma-separated CORS origin list", () => {
    const env = validateEnv(
      baseEnv({ CORS_ALLOWED_ORIGINS: "https://a.mbncon.com, https://b.mbncon.com" }),
    );
    expect(env.CORS_ALLOWED_ORIGINS).toEqual(["https://a.mbncon.com", "https://b.mbncon.com"]);
  });

  it("accepts a fully valid environment and returns typed defaults", () => {
    const env = validateEnv(baseEnv());
    expect(env.RATE_LIMIT_AUTH_MAX).toBe(5);
    expect(env.RATE_LIMIT_API_MAX).toBe(120);
    expect(env.API_PREFIX).toBe("/api/v1");
  });
});

describe("AuthService token revocation", () => {
  function buildPrismaMock() {
    return {
      user: { findFirst: jest.fn() },
      revokedTokenRecord: { findUnique: jest.fn(), upsert: jest.fn() },
    };
  }

  it("isRevoked returns false for a token never revoked", async () => {
    const prisma = buildPrismaMock();
    prisma.revokedTokenRecord.findUnique.mockResolvedValue(null);
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(prisma as never, jwtService as never);

    await expect(service.isRevoked("jti-1")).resolves.toBe(false);
  });

  it("isRevoked returns true once revokeToken has recorded the jti", async () => {
    const prisma = buildPrismaMock();
    prisma.revokedTokenRecord.upsert.mockResolvedValue({ tokenJti: "jti-1" });
    prisma.revokedTokenRecord.findUnique.mockResolvedValue({ tokenJti: "jti-1" });
    const jwtService = { signAsync: jest.fn() };
    const service = new AuthService(prisma as never, jwtService as never);

    await service.revokeToken("jti-1", new Date(Date.now() + 60_000));
    await expect(service.isRevoked("jti-1")).resolves.toBe(true);
  });

  it("issueToken signs a payload carrying factoryId, role, and a fresh jti", async () => {
    const prisma = buildPrismaMock();
    const jwtService = { signAsync: jest.fn().mockResolvedValue("signed.jwt.token") };
    const service = new AuthService(prisma as never, jwtService as never);

    const result = await service.issueToken({ id: "user-1", factoryId: "f-1", role: "ROLE_OPERATOR" });

    expect(result.accessToken).toBe("signed.jwt.token");
    expect(result.tokenType).toBe("Bearer");
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ sub: "user-1", factoryId: "f-1", role: "ROLE_OPERATOR" }),
    );
  });
});
