/**
 * Stage 2F-1 — focused unit tests for:
 *   - apiClient.ts's OptiFabricApiError classification (401 vs 402 vs other
 *     HTTP failures vs a network failure that never reaches the server), and
 *   - projectApi.ts's isEntitlementDeniedError / describeProtectedRequestError
 *     / extractStatusCode helpers built on top of it (the "projects-page
 *     decision logic," tested in isolation from any React component).
 *
 * Same no-test-framework convention as markerFabricConsumptionEngine.test.ts
 * and engineeringRecommendationsEngine.test.ts (no Jest/Vitest is configured
 * anywhere in this frontend project) — a small, dependency-free,
 * self-executing check using plain assertions, runnable with Node/TypeScript
 * and no framework, exiting non-zero on any failed assertion.
 *
 * UNLIKE those two files, projectApi.ts transitively imports a module that
 * uses the project's `@/` path alias (patternGeometryEngine.ts imports from
 * "@/lib/optifabric/patternGeometryTypes") — so the plain two-file
 * `npx tsc a.ts b.ts` recipe those files document does NOT work for this
 * one; it fails with TS2307 the same way running their own documented
 * command does (see the Stage 2E recovery-inspection notes). This file
 * needs the project's real path-alias mapping, which can only come from a
 * tsconfig (tsc has no CLI flag for `paths`). From the repo root:
 *
 *   cat > /tmp/apiClient.test.tsconfig.json <<'EOF'
 *   {
 *     "extends": "<absolute path to repo>/tsconfig.json",
 *     "compilerOptions": {
 *       "noEmit": false, "module": "commonjs", "moduleResolution": "node",
 *       "target": "es2019", "isolatedModules": false,
 *       "outDir": "<some tmp dir>", "baseUrl": "<absolute path to repo>",
 *       "typeRoots": ["<absolute path to repo>/node_modules/@types"],
 *       "paths": { "@/*": ["<absolute path to repo>/*"] },
 *       "types": ["node"]
 *     },
 *     "include": ["<absolute path to repo>/lib/optifabric/apiClient.test.ts"]
 *   }
 *   EOF
 *   npx tsc -p /tmp/apiClient.test.tsconfig.json
 *   node <tmp dir>/apiClient.test.js
 *
 * (Stage 2F-3 fixes, both verified by actually running this exact command:
 * (1) without the explicit `typeRoots` line above, tsc fails outright with
 * "TS2688: Cannot find type definition file for 'node'" — a temp config
 * living outside the repo does not reliably discover the repo's own
 * node_modules/@types on its own. (2) the final `node` invocation's path
 * was previously documented as `<tmp dir>/lib/optifabric/apiClient.test.js`
 * — wrong: tsc's implicit common-root inference across this file's full
 * transitive import graph (projectApi.ts, patternGeometryEngine.ts, the
 * pattern library, etc. — all under lib/optifabric/) makes lib/optifabric/
 * itself the root, so apiClient.test.js lands flat under <tmp dir>, not
 * nested under it.)
 *
 * Shims `global.window.localStorage` and `global.fetch` — apiClient.ts is
 * the one module in lib/optifabric that legitimately touches those browser
 * globals directly, so unlike the other two Stage 2D/2E test files, this
 * one cannot avoid a minimal environment shim to run under plain Node.
 */
import { apiFetch, OptiFabricApiError } from "./apiClient";
import {
  describeProtectedRequestError,
  ENTITLEMENT_DENIED_MESSAGE,
  extractStatusCode,
  isEntitlementDeniedError,
} from "./projectApi";

let passed = 0;
let failed = 0;

function check(name: string, condition: boolean): void {
  if (condition) {
    passed += 1;
    console.log(`PASS: ${name}`);
  } else {
    failed += 1;
    console.error(`FAIL: ${name}`);
  }
}

// -- Minimal browser-global shims --------------------------------------------

let storedToken: string | null = null;
(globalThis as unknown as { window: unknown }).window = {
  localStorage: {
    getItem: () => storedToken,
    setItem: (_key: string, value: string) => {
      storedToken = value;
    },
    removeItem: () => {
      storedToken = null;
    },
  },
};

type MinimalResponse = {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
  json: () => Promise<unknown>;
};

function jsonResponse(status: number, body: unknown): MinimalResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
    json: async () => body,
  };
}

function setFetch(impl: () => Promise<MinimalResponse>): void {
  (globalThis as unknown as { fetch: unknown }).fetch = impl;
}

async function run(): Promise<void> {
  // 1. HTTP 401 retains existing behavior: OptiFabricApiError, category
  // "auth", and the stored token is still cleared (unchanged from before
  // Stage 2F-1 introduced the typed error).
  storedToken = "a-token";
  setFetch(async () => jsonResponse(401, { statusCode: 401, message: "Unauthorized" }));
  try {
    await apiFetch("/projects");
    check("401 throws", false);
  } catch (error) {
    check("401 is an OptiFabricApiError", error instanceof OptiFabricApiError);
    if (error instanceof OptiFabricApiError) {
      check("401 category is 'auth'", error.category === "auth");
      check("401 status is 401", error.status === 401);
    }
    check("401 clears the stored token", storedToken === null);
  }

  // 2. HTTP 402 produces the explicit entitlement-denied category, and does
  // NOT clear the token (a 402 is a valid, authenticated request that was
  // denied for entitlement reasons — not an auth failure).
  storedToken = "a-token";
  const backendMessage =
    "Your free trial or subscription has ended. Please subscribe to continue using OptiFabric.";
  setFetch(async () => jsonResponse(402, { statusCode: 402, message: backendMessage }));
  try {
    await apiFetch("/projects");
    check("402 throws", false);
  } catch (error) {
    check("402 is an OptiFabricApiError", error instanceof OptiFabricApiError);
    if (error instanceof OptiFabricApiError) {
      check("402 category is 'entitlement'", error.category === "entitlement");
      check("402 preserves the backend message", error.backendMessage === backendMessage);
    }
    check("402 does NOT clear the stored token", storedToken === "a-token");
    check("isEntitlementDeniedError(error) is true for a 402", isEntitlementDeniedError(error));
    check(
      "describeProtectedRequestError returns the calm, canonical message for a 402",
      describeProtectedRequestError(error, "fallback") === ENTITLEMENT_DENIED_MESSAGE
    );
    check("extractStatusCode(error) is 402", extractStatusCode(error) === 402);
  }

  // 3. HTTP 500 is NOT classified as entitlement denial.
  setFetch(async () => jsonResponse(500, { statusCode: 500, message: "Internal server error" }));
  try {
    await apiFetch("/projects");
    check("500 throws", false);
  } catch (error) {
    check("500 is an OptiFabricApiError", error instanceof OptiFabricApiError);
    if (error instanceof OptiFabricApiError) {
      check("500 category is 'api', not 'entitlement'", error.category === "api");
    }
    check("isEntitlementDeniedError(error) is false for a 500", !isEntitlementDeniedError(error));
    check(
      "describeProtectedRequestError falls back to the Error's own message for a 500 (unchanged prior behavior)",
      describeProtectedRequestError(error, "fallback") ===
        (error instanceof Error ? error.message : "fallback")
    );
  }

  // 4. A network failure (fetch() itself rejects) is NOT classified as
  // entitlement denial — it never becomes an OptiFabricApiError at all,
  // which is exactly how callers are meant to tell "the server explicitly
  // answered with a failure" apart from "the server was never reached."
  setFetch(async () => {
    throw new TypeError("Failed to fetch");
  });
  try {
    await apiFetch("/projects");
    check("network failure throws", false);
  } catch (error) {
    check("network failure is NOT an OptiFabricApiError", !(error instanceof OptiFabricApiError));
    check("network failure is still a normal Error", error instanceof Error);
    check("isEntitlementDeniedError(error) is false for a network failure", !isEntitlementDeniedError(error));
    check("extractStatusCode(error) is null for a network failure", extractStatusCode(error) === null);
  }

  // 5. Backend 402 message/code handling does not expose unsafe data: a
  // response body that is valid JSON but not the expected {message: string}
  // shape falls back to the raw text rather than inventing/guessing a
  // message from an unexpected structure.
  setFetch(async () => jsonResponse(402, { statusCode: 402, unexpectedField: "some other shape" }));
  try {
    await apiFetch("/projects");
    check("402 with unexpected JSON shape throws", false);
  } catch (error) {
    check(
      "402 with unexpected JSON shape still classifies as entitlement",
      error instanceof OptiFabricApiError && error.category === "entitlement"
    );
    if (error instanceof OptiFabricApiError) {
      check(
        "402 with unexpected JSON shape falls back to the raw body text, not a guessed field",
        error.backendMessage === JSON.stringify({ statusCode: 402, unexpectedField: "some other shape" })
      );
    }
  }

  // Non-JSON body entirely (e.g. an HTML error page from an intermediary).
  setFetch(async () => ({
    ok: false,
    status: 402,
    text: async () => "<html>not json</html>",
    json: async () => {
      throw new Error("json() should not be called on a non-2xx response");
    },
  }));
  try {
    await apiFetch("/projects");
    check("non-JSON 402 body throws", false);
  } catch (error) {
    check(
      "non-JSON 402 body still classifies as entitlement and falls back to raw text",
      error instanceof OptiFabricApiError &&
        error.category === "entitlement" &&
        error.backendMessage === "<html>not json</html>"
    );
  }

  console.log(failed === 0 ? "\nALL CHECKS PASSED" : `\n${failed} CHECK(S) FAILED`);
  process.exitCode = failed === 0 ? 0 : 1;
}

void run();
