// Covers PlatformRepGuard — added at the user's explicit request so an MBNCON
// Bangladesh representative can grant extra seats to a Bangladeshi factory
// without needing a factory-scoped user account. Not a reconstruction of any
// historical suite; ordinary fresh unit tests.
import { UnauthorizedException } from "@nestjs/common";
import { PlatformRepGuard, platformRepApiKey } from "../src/common/guards/platform-rep.guard";

const TEST_KEY = "e".repeat(64);

function withRepKey<T>(fn: () => T): T {
  const original = process.env.PLATFORM_REP_API_KEY;
  process.env.PLATFORM_REP_API_KEY = TEST_KEY;
  try {
    return fn();
  } finally {
    if (original === undefined) delete process.env.PLATFORM_REP_API_KEY;
    else process.env.PLATFORM_REP_API_KEY = original;
  }
}

function buildContext(headerValue: string | undefined) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        header: (name: string) => (name === "x-platform-rep-key" ? headerValue : undefined),
      }),
    }),
  } as never;
}

describe("platformRepApiKey", () => {
  it("throws if PLATFORM_REP_API_KEY is unset or shorter than 64 characters", () => {
    const original = process.env.PLATFORM_REP_API_KEY;
    delete process.env.PLATFORM_REP_API_KEY;
    expect(() => platformRepApiKey()).toThrow(/at least 64 characters/);

    process.env.PLATFORM_REP_API_KEY = "too-short";
    expect(() => platformRepApiKey()).toThrow(/at least 64 characters/);

    if (original === undefined) delete process.env.PLATFORM_REP_API_KEY;
    else process.env.PLATFORM_REP_API_KEY = original;
  });
});

describe("PlatformRepGuard", () => {
  it("allows the request through when X-Platform-Rep-Key matches the configured secret", () => {
    withRepKey(() => {
      const guard = new PlatformRepGuard();
      expect(guard.canActivate(buildContext(TEST_KEY))).toBe(true);
    });
  });

  it("rejects a missing X-Platform-Rep-Key header", () => {
    withRepKey(() => {
      const guard = new PlatformRepGuard();
      expect(() => guard.canActivate(buildContext(undefined))).toThrow(UnauthorizedException);
    });
  });

  it("rejects a wrong X-Platform-Rep-Key header", () => {
    withRepKey(() => {
      const guard = new PlatformRepGuard();
      expect(() => guard.canActivate(buildContext("f".repeat(64)))).toThrow(UnauthorizedException);
    });
  });
});
