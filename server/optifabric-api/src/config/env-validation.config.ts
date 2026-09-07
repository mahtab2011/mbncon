// Fail-closed startup check, mirroring OptiSewing's
// apps/api/src/config/env-validation.config.ts.
export interface ValidatedEnv {
  NODE_ENV: string;
  PORT: number;
  API_PREFIX: string;
  DATABASE_URL: string;
  // Phase 2: the central entitlement database (server/entitlement-api's own
  // database) — SubscriptionGuard now depends on it. Must be set to the
  // exact same connection string as entitlement-api's own DATABASE_URL;
  // this is a second binding to the SAME database, not a second database.
  // See docs/PHASE-2-ENTITLEMENT-CUTOVER.md.
  ENTITLEMENT_DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  CORS_ALLOWED_ORIGINS: string[];
  RATE_LIMIT_AUTH_MAX: number;
  RATE_LIMIT_API_MAX: number;
  LICENSE_SIGNING_SECRET: string;
  PLATFORM_REP_API_KEY: string;
}

export function validateEnv(env: Record<string, string | undefined>): ValidatedEnv {
  const missing: string[] = [];
  const require = (key: string): string => {
    const value = env[key];
    if (!value) missing.push(key);
    return value ?? "";
  };

  const databaseUrl = require("DATABASE_URL");
  const entitlementDatabaseUrl = require("ENTITLEMENT_DATABASE_URL");
  const jwtSecret = require("JWT_SECRET");
  const corsAllowedOrigins = require("CORS_ALLOWED_ORIGINS");
  const licenseSigningSecret = require("LICENSE_SIGNING_SECRET");
  const platformRepApiKey = require("PLATFORM_REP_API_KEY");

  if (missing.length > 0) {
    throw new Error(`Fail-closed startup check: missing required env vars: ${missing.join(", ")}`);
  }

  if (jwtSecret.length < 64) {
    throw new Error("Fail-closed startup check: JWT_SECRET must be at least 64 characters.");
  }

  if (licenseSigningSecret.length < 64) {
    throw new Error(
      "Fail-closed startup check: LICENSE_SIGNING_SECRET must be at least 64 characters (same standard applied to JWT_SECRET).",
    );
  }

  if (platformRepApiKey.length < 64) {
    throw new Error(
      "Fail-closed startup check: PLATFORM_REP_API_KEY must be at least 64 characters (same standard applied to JWT_SECRET).",
    );
  }

  if (corsAllowedOrigins.trim() === "*") {
    throw new Error("Fail-closed startup check: CORS_ALLOWED_ORIGINS must not be a wildcard.");
  }

  return {
    NODE_ENV: env.NODE_ENV ?? "production",
    PORT: Number(env.PORT ?? 3011),
    API_PREFIX: env.API_PREFIX ?? "/api/v1",
    DATABASE_URL: databaseUrl,
    ENTITLEMENT_DATABASE_URL: entitlementDatabaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRATION: env.JWT_EXPIRATION ?? "7d",
    CORS_ALLOWED_ORIGINS: corsAllowedOrigins.split(",").map((origin) => origin.trim()),
    RATE_LIMIT_AUTH_MAX: Number(env.RATE_LIMIT_AUTH_MAX ?? 5),
    RATE_LIMIT_API_MAX: Number(env.RATE_LIMIT_API_MAX ?? 120),
    LICENSE_SIGNING_SECRET: licenseSigningSecret,
    PLATFORM_REP_API_KEY: platformRepApiKey,
  };
}
