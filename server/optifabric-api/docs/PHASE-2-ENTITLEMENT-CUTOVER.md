# OptiFabric — Central Entitlement Guard Cutover (Phase 2)

**Status: implemented and tested. Not committed yet — awaiting review.**

This document is the detailed companion to the Phase 2 report. It covers the parts that need more than a paragraph: why the integration is shaped the way it is, and the one compatibility rule that isn't obvious from the code alone.

## Integration architecture chosen

**Two attempts, one working design.**

**Attempt 1 (abandoned): direct relative-path import of `server/entitlement-api`'s compiled `EntitlementService` and generated Prisma client.** This is architecturally the cleanest option — genuinely one class, one set of generated types, zero duplication. It failed for a concrete, reproduced reason: `entitlement-api` and `optifabric-api` each have their own generated `@prisma/client` package (same package name, different schemas — one has `Factory`/`Subscription`, the other has `Organisation`/`ProductEntitlement`). When both are pulled into one `tsc` compilation via a relative import reaching from `optifabric-api/src/...` into `entitlement-api/src/...`, TypeScript's module-resolution cache for the *nested* nested import inside Prisma's generated `default.d.ts` (`.prisma/client/default`) served the wrong package's generated types — confirmed with `tsc --traceResolution`, reproduced consistently, and not fixed by removing `optifabric-api`'s `baseUrl` (which was a real, separate, but insufficient fix — that one's still applied, see below). This is a `tsc`-level limitation of compiling two identically-named generated packages into one program via cross-directory relative imports, not a bug in either schema.

**Attempt 2 (implemented): a local adapter.** `server/optifabric-api/prisma/entitlement/schema.prisma` is a **model-for-model copy** of `server/entitlement-api/prisma/schema.prisma`, with one difference: `generator client { output = "../../node_modules/.prisma-entitlement-client" }` — a custom output path that can never collide with any other package's `@prisma/client`. `src/entitlement/entitlement-providers.ts` instantiates this local client against `ENTITLEMENT_DATABASE_URL`. `src/entitlement/entitlement-decision.service.ts` is a **local copy of exactly two methods** (`getEffectiveEntitlement`/`canAccess` and `startInternationalTrial`) from entitlement-api's `EntitlementService`, kept logically identical, with an explicit comment that any future change to trial/access rules must be applied in both places.

This is *not* the smallest design in the abstract — it's the smallest design that actually compiles, given the constraint discovered above. The genuinely smallest design (Attempt 1) remains the right long-term target; see "Recommended safe cutover/checkpoint step" for how to get there properly (an npm workspace or a published internal package), which was out of scope to set up as a side effect of this guard cutover.

**Why not an HTTP call:** never seriously in the running here — there's no reason to add network infrastructure and a new failure mode (timeout, retry, auth) for what is, underneath, two TypeScript files talking to one Postgres database.

### One incidental fix that had to happen too

`server/optifabric-api/tsconfig.json` had `"baseUrl": "./"`, unused anywhere in this codebase (confirmed — no `@/`-style import exists in `src/` or `test/`) and directly implicated in Attempt 1's resolution collision (it caused `@prisma/client` to be resolved baseUrl-relative-first for *every* importing file, including ones physically inside `entitlement-api/`). Removed. This alone did not fix Attempt 1 (the deeper nested-cache issue remained), but it was a real, independent bug worth fixing regardless, and is kept even though Attempt 1 was abandoned.

## Organisation mapping

`OrganisationExternalRef{system: "OPTIFABRIC", externalFactoryId: Factory.id}` — looked up by `OrganisationResolverService.resolveOrganisationForOptiFabricFactory(factoryId)` (read-only) and created by `resolveOrCreateOrganisationForOptiFabricFactory(factoryId, factoryName, countryCode)` (idempotent — see the method's own doc comment for the race-condition handling via the database's `@@unique([system, externalFactoryId])` constraint). `Factory.id` is never modified, never assumed equal to `organisationId`.

## New-factory onboarding

`AuthService.signUp()`, only for a founding admin of a **brand-new** factory (unchanged trigger condition from the legacy trial-creation logic): after the OptiFabric-database transaction commits, `onboardNewFactoryEntitlement()` runs as a **separate, best-effort step** — see "Why not one transaction" below. International factories get `resolveOrCreateOrganisationForOptiFabricFactory` + `startInternationalTrial` (both products, atomically, 90 days). Bangladesh factories get the mapping only — `onboardNewBangladeshFactory()` is a documented no-op.

### Why not one transaction

`entitlement-api`'s database and `optifabric-api`'s database are two physically separate Postgres databases. There is no two-phase-commit across them via Prisma. The entitlement side-effect runs *after* the OptiFabric transaction, wrapped in its own try/catch that logs and swallows failure rather than failing the signup. This is a deliberate direction: if entitlement onboarding fails, the account still exists and the guard fails closed for that factory until mapping is retried — never the reverse (never "account half-created" or "access wrongly granted").

## Bangladesh legacy/free compatibility issue

**The problem:** the legacy guard granted free access to any factory whose `country` matched Bangladesh, computed fresh on every request (`isBangladeshFactory`). The new central model requires an explicit `grantBangladeshFreeEntitlement()` call — which this phase, per instruction, does **not** wire to a self-declared country field. Cutting the guard over with nothing else would mean: **every existing Bangladesh factory, which has legitimate free access today, would be denied the moment this guard ships**, because nothing has explicitly granted them a central `BANGLADESH_FREE` row yet.

**The transitional rule implemented:** `EntitlementOnboardingService.isEligibleForBangladeshTransitionalAccess(factoryId, organisationId)`, consulted by the guard only *after* central entitlement has already said "no". It engages **only** when both are true:
1. Central entitlement has genuinely nothing recorded (`reason === "NO_ENTITLEMENT"`) — never overrides a real, deliberate central denial (an expired trial or expired paid period is never bypassed).
2. The legacy `SubscriptionService.getEffectiveState(factoryId)` reports `status === "FREE_REGIONAL"` and `isAccessAllowed === true`.

This preserves exactly the access an existing Bangladesh factory already had — it grants nothing new, and it's read-only against the central store (nothing is written). It logs a `WARN` each time it engages, naming the factory/organisation, so these can be found and backfilled.

**What still needs a decision from you:** run `EntitlementOnboardingService.identifyLegacyBangladeshFreeFactories()` against the real `Factory` table to get the exact list, then explicitly authorize a one-time backfill (a script calling `grantBangladeshFreeEntitlement(organisationId)` for each) so the transitional fallback can eventually be retired. Not run here — this phase intentionally stops at "identify and report," per instruction, and does not execute that backfill against any database.

## Guard logic, exactly

```
skip? -> allow
no authenticated user? -> allow (defers to JwtAuthGuard, unchanged from legacy)
no/invalid factoryId? -> deny (fail closed)
resolve organisationId; lookup failure or no mapping? -> deny (fail closed)
canAccess(organisationId, "OPTIFABRIC")? -> allow
else: Bangladesh transitional check -> allow if eligible
else -> deny
```

`"OPTIFABRIC"` is a hardcoded literal at the one call site in `subscription.guard.ts` — never read from the request body, query, or any client-supplied field.

## Legacy subscription system status

Untouched: `Subscription` Prisma model, `subscription.service.ts`, `subscription.controller.ts`, all existing price constants — all still exist, still work, still have their own passing tests. `AuthService.signUp()` still writes a legacy `Subscription` row exactly as before (unchanged), specifically so legacy state remains available for comparison/rollback, per instruction. The only thing that changed is: **the guard no longer reads `SubscriptionService.getEffectiveState()` as its primary decision** — it's now consulted only by the narrow Bangladesh transitional path above.

## Post-cutover incident: guard-ordering defect (found and fixed)

**Issue:** `SubscriptionGuard` was registered as a global `APP_GUARD` (see "Guard logic, exactly" above) while `JwtAuthGuard` was applied only at controller/method level (`@UseGuards(JwtAuthGuard)`). Nest executes global guards before controller-level guards, so the real request order was:

```
ThrottlerGuard -> SubscriptionGuard -> controller-level JwtAuthGuard
```

`SubscriptionGuard`'s own `if (!user) return true` branch — written to defer to `JwtAuthGuard`'s 401 when there's genuinely no authenticated user — instead saw `request.user` as always-undefined at that point, because `JwtAuthGuard` hadn't run yet. It therefore allowed every request through, skipping entitlement enforcement entirely. `JwtAuthGuard` still ran afterward and correctly authenticated the request, so this was **an entitlement/paywall bypass, not an unauthenticated-access bypass** — a request with no or invalid JWT still received its normal 401.

**Blast radius at discovery:** all 11 `ProjectsController` routes — the entire intended entitlement-protected surface. `AuthController`/`HealthController`/`SubscriptionController` were already intentionally entitlement-exempt and unaffected. No other global `request.user` dependency was found.

**Why existing tests missed it:** every guard/entitlement test in this repo (`test/entitlement-cutover.spec.ts`, `test/subscription-licensing.spec.ts`) instantiates `SubscriptionGuard` directly (`new SubscriptionGuard(...)`) and calls `.canActivate()` against a hand-built `ExecutionContext` whose `request.user` is already populated — i.e. every test assumed `JwtAuthGuard` had already run. That assumption is exactly what was false in production. No test booted a real Nest application or exercised Nest's actual global-guard execution order before this fix.

**Fix (commit `f8d195162e3471da8a2c70b0f69ea127dbebe661`):** `JwtAuthGuard` is now also registered globally, positioned before `SubscriptionGuard`:

```
ThrottlerGuard -> JwtAuthGuard -> SubscriptionGuard
```

A new `@SkipJwtAuth()` decorator (`src/modules/auth/jwt-auth.guard.ts`) was introduced for routes that genuinely don't need a JWT — signup, login, health, and the `PlatformRepGuard`-only routes (`approve-user`, `grant-seats`), which authenticate via a shared secret rather than a JWT at all. This is deliberately a **separate** concept from `@SkipSubscriptionCheck()` — do not conflate them:

- `@SkipJwtAuth()` — no JWT authentication required for this route at all.
- `@SkipSubscriptionCheck()` — a JWT may still be required; only entitlement enforcement is skipped.

Redundant per-controller `@UseGuards(JwtAuthGuard)` declarations were removed once the global guard provided identical protection (`ProjectsController`, `AuthController.logout`, `SubscriptionController.status/activate/cancel`). Neither `PlatformRepGuard` nor `SubscriptionGuard` itself was modified.

**Preserved behavior**, confirmed unchanged: health remains fully public; signup/login remain public; authenticated subscription-management routes (`status`, `activate`, `cancel`) remain JWT-protected but entitlement-exempt; `PlatformRepGuard` routes retain their own shared-secret authorization, independent of JWT.

**Automated verification:** `test/guard-ordering-e2e.spec.ts` boots a real Nest application (`NestFactory.create`, not a mock) and issues real HTTP requests through the actual guard pipeline, proving: no JWT -> 401; invalid JWT -> 401; valid JWT + active entitlement -> 200; valid JWT + expired entitlement -> 402; health stays public; `subscription/status` requires a JWT but is entitlement-exempt; `PlatformRepGuard` behavior is unchanged. It also asserts, by reading `app.module.ts`'s own `@Module()` metadata directly, that the real `APP_GUARD` order is exactly `[ThrottlerGuard, JwtAuthGuard, SubscriptionGuard]` — so a future accidental reordering is caught even without booting the full app. Full suite: **10 test suites, 182/182 tests passing**; `tsc --noEmit` clean; `nest build` clean.

**Live verification:** repeated against the real local backend and real local Postgres databases (a fresh QA international signup; no database mutation left in place afterward): active entitlement -> `GET /projects` = 200; no `Authorization` header -> 401; the same valid JWT with the QA organisation's OPTIFABRIC entitlement temporarily set to an expired `trialEndsAt` -> 402; entitlement restored to its exact original value -> 200 again. The OPTISEWING entitlement and the legacy `Subscription` row were confirmed untouched throughout; no schema, migration, or business-rule change was involved.

### Current guarantee

For every entitlement-protected OptiFabric route:

```
unauthenticated                                             -> 401
authenticated + active OPTIFABRIC entitlement                -> access allowed
authenticated + expired/missing (non-fallback) entitlement  -> 402
```

Authentication now always executes before entitlement enforcement — this ordering is itself covered by the regression suite above, not just by convention.

## Rollback

Revert `subscription.guard.ts`, `app.module.ts`, `auth.module.ts`, `auth.service.ts`, `env-validation.config.ts`, and `tsconfig.json` to their pre-Phase-2 state (all other Phase 2 files are new and can simply be deleted); nothing else needs to change, since the legacy Subscription system was never modified or removed.
