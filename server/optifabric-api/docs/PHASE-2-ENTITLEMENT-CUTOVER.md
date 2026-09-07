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

## Rollback

Revert `subscription.guard.ts`, `app.module.ts`, `auth.module.ts`, `auth.service.ts`, `env-validation.config.ts`, and `tsconfig.json` to their pre-Phase-2 state (all other Phase 2 files are new and can simply be deleted); nothing else needs to change, since the legacy Subscription system was never modified or removed.
