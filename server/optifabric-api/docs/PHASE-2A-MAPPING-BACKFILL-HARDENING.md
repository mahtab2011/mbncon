# OptiFabric — Pre-Commit Mapping / Backfill / Onboarding Hardening (Phase 2A)

**Status (updated, Stage 2F-3): implemented, tested, and committed to `main`, same as Phase 2 (see that document's own updated status line). The title's "Pre-Commit" reflects when this document was written, not the current state.**

This is a companion to [PHASE-2-ENTITLEMENT-CUTOVER.md](./PHASE-2-ENTITLEMENT-CUTOVER.md) — read that first for the base architecture (why a local Prisma client adapter exists, the organisation-mapping model, the Bangladesh transitional rule's original shape). This document covers what Phase 2A changed and why, closing four gaps identified in the Phase 2 checkpoint review.

## Issue 1 — existing Bangladesh factory lockout (confirmed and fixed)

**Confirmed.** Phase 2's guard order was:

```
resolve organisation mapping (read-only)
  -> no mapping? DENY, immediately
  -> central entitlement check
  -> Bangladesh legacy fallback
```

An existing Bangladesh factory with legitimate `FREE_REGIONAL` legacy access but no `OrganisationExternalRef` yet (true for every Bangladesh factory that predates this cutover — nothing had ever created that mapping) was denied at the second line, before the fallback that exists specifically to preserve its access ever ran. This was a real, immediate lockout bug, not a theoretical one — reproduced directly in `test/entitlement-cutover.spec.ts` before the fix (see the old test 8, which asserted this exact denial as "correct").

**Fix:** `FactoryOrganisationMappingService.resolveOrLazilyMapOrganisation(factoryId)` (`src/entitlement/factory-organisation-mapping.service.ts`) replaces the guard's read-only resolver call. It:
1. Tries the existing read-only lookup first (the steady-state case, no write).
2. If nothing is mapped yet, loads the **trusted server-side** `Factory` row (never anything client-supplied) and calls the existing idempotent `resolveOrCreateOrganisationForOptiFabricFactory`.
3. Returns `null` only when `factoryId` doesn't correspond to any real `Factory` — the guard still fails closed on that, exactly as before.

Mapping alone **never** grants anything — no trial, no entitlement row. `SubscriptionGuard`'s new order:

```
skip? -> allow
no user? -> allow (defers to JwtAuthGuard, unchanged)
no/invalid factoryId? -> deny
resolve-or-lazily-map organisationId
  -> null (no such Factory)? -> deny (fail closed)
central canAccess(organisationId, OPTIFABRIC)? -> allow
central reason === NO_ENTITLEMENT? -> Bangladesh transitional check -> allow if eligible
else -> deny
```

A central **EXPIRED** or otherwise-denied entitlement is never overridden by the fallback — unchanged from Phase 2, and re-verified by the existing "does NOT engage when central entitlement exists but has genuinely expired" test, still passing.

## Existing international factories (Issue 2) — deliberately NOT auto-fixed by lazy mapping

Lazy mapping is general (it maps any valid Factory, Bangladesh or not), but mapping alone never grants access. An existing **international** factory with no mapping gets mapped on the fly by the guard, and then — correctly — stays denied, because nothing has told the central system it ever had a trial or a paid period. There is no legacy fallback for international factories (the Bangladesh fallback is BD-specific, per the original business rule). This is intentional: fixing this requires restoring the *original* historical dates, which the guard's hot path must never do — that's what the backfill tool (Issue 2, below) is for. See `test/entitlement-cutover.spec.ts`, "8c. existing INTERNATIONAL factory with no mapping and no backfilled trial -> lazily mapped, but still correctly denied."

## Issue 2 — historical trial/paid preservation + backfill tool

`EntitlementBackfillService.backfillOptiFabricEntitlements()` (`src/entitlement/entitlement-backfill.service.ts`) is the one-time, explicitly-authorized, idempotent migration of legacy `Subscription` state into the central entitlement database, run once per environment before/at real cutover (not run here — see "No real database cutover" below).

**Per-factory logic:**
1. Map (or reuse the mapping) via the same idempotent resolver used elsewhere.
2. **Idempotency gate:** if a central `OPTIFABRIC` `ProductEntitlement` row already exists for this organisation — from a prior backfill run, or from a live Phase-2 signup/trial — skip entirely. Never touched, never extended, never shortened. This is what makes re-running the whole backfill safe.
3. **Bangladesh factories:** identified and counted (`legacyBangladeshFreeDetected`), **never** auto-converted to `BANGLADESH_FREE`. See "Bangladesh Legacy Transition" below.
4. **Legacy `TRIAL`:** migrated to `INTERNATIONAL_TRIAL` with `trialEndsAt` copied **exactly** from the legacy row and `trialStartedAt` approximated from the legacy row's `createdAt` (the legacy schema never stored a separate trial-start date). An expired legacy trial produces an already-expired central row — no new 90 days is ever issued for a historical factory.
5. **Legacy `MONTHLY`/`ANNUAL`:** migrated to `PAID`, `planCode: OPTIFABRIC_MONTHLY` (informational only — `planCode` is not read by any access decision; only `currentPeriodEnd` is). `currentPeriodStart`/`currentPeriodEnd` are copied from the legacy row, **except** when the legacy status is `GRACE_PERIOD`: in that case the nominal `currentPeriodEnd` has already passed but the factory is still legitimately allowed access today, so the grace-adjusted date (`graceEndsAt`, or a computed fallback) is used instead — copying the bare nominal date would deny an actively-paying factory the instant the backfill ran. This is the "preserve the appropriate paid-through period" rule from the task spec, applied literally.
6. **Only ever writes the `OPTIFABRIC` row** — an old OptiFabric-only paid plan never grants OptiSewing access (verified by a dedicated test asserting no `OPTISEWING` row is ever written by this service).

**Report shape** (exact fields, matching the requested spec):
```
factoriesScanned, organisationsCreated, refsCreated, legacyBangladeshFreeDetected,
activeTrialsMigrated, expiredTrialsMigrated, activePaidMigrated, expiredMigrated,
alreadyMappedOrSkipped, errors: [{ factoryId, message }]
```
One factory's error is captured and the batch continues — a single bad row never aborts the run.

**Invocation:** `scripts/backfill-optifabric-entitlements.ts` (also `npm run backfill:optifabric-entitlements`) — a script, not an HTTP endpoint, per instruction. It boots a minimal Nest application context, resolves `EntitlementBackfillService`, runs it, and prints the JSON report. **This script has not been run** — see "No real database cutover."

## Bangladesh Legacy Transition — why this stays temporary

The central source is **not** permanently converted to `BANGLADESH_FREE` from the legacy country field, in either the guard's lazy path or the backfill tool, because a self-declared `Factory.country` string is not a trusted eligibility basis on its own — it's exactly the kind of signal the original architecture audit flagged as insufficient for a permanent grant. The transitional guard fallback (unchanged from Phase 2, now actually reachable — see Issue 1) covers access in the meantime; the backfill tool's `legacyBangladeshFreeDetected` count is the reporting mechanism for a future, separate, deliberate decision. That decision is explicitly out of scope here: **permanent Bangladesh-free app eligibility is a separate question from Bangladesh Apparel *marketplace* verification** — the two are not the same signal and this app's free-tier grant should never be gated on marketplace-verified status. The intended eventual trusted basis for a permanent `BANGLADESH_FREE` grant is a successful Bangladesh Apparel **registration/eligibility** signal (i.e. a real, server-confirmed registration outcome, not a self-declared country field) — see `CENTRAL-ENTITLEMENT-PHASE-1.md`, "Future Bangladesh Apparel integration". Nothing in this phase touches Bangladesh Apparel's own verification logic, per instruction.

## Issue 3 — new international signup hardening

**The gap:** Phase 2's `onboardNewFactoryEntitlement` ran once, best-effort, right after signup; a failure there (entitlement DB hiccup, etc.) left a healthy OptiFabric account with no mapping and no trial, and — critically — nothing ever retried it. The account would be denied indefinitely.

**Options evaluated** (per the task's own list):
1. *Retry/idempotent reconciliation immediately* — chosen, see below.
2. *Persist a detectable "onboarding pending" state* — rejected as unnecessary: reconciliation on login is self-describing (it either completes or it doesn't; the guard's fail-closed state is already the observable signal) and needs no new schema/state field.
3. *Return a controlled "activation pending" signup response* — rejected: it changes the client-facing contract for what is, in the overwhelming majority of cases, a transient failure that heals itself on the next login. Adds complexity nothing here needs yet.
4. *Fail the signup transaction unless made atomic across both databases* — explicitly rejected per instruction: there is no real cross-database atomicity here (two separate Postgres databases, no 2PC via Prisma), and claiming otherwise would be dishonest about what the system actually guarantees.

**Chosen: idempotent recovery/reconciliation**, per the task's own recommended direction. `AuthService.reconcileEntitlementOnboarding(factoryId)` (`src/modules/auth/auth.service.ts`) is called from `validateCredentials` — i.e., on **every login**, not just once at signup:
- Loads the `Factory` row fresh (trusted server-side data).
- Calls `resolveOrCreateOrganisationForOptiFabricFactory` (idempotent — never creates a duplicate mapping).
- Calls `onboardNewInternationalFactory` → `startInternationalTrial` (idempotent — a no-op once an entitlement row already exists for either product) for international factories, or the Bangladesh no-op for Bangladesh factories.
- Never throws: failure is logged (structured, factory-scoped) and swallowed — a reconciliation failure must never block a legitimate login. `SubscriptionGuard`'s fail-closed behavior remains the actual safety net for a factory whose reconciliation keeps failing.

This can **never** create a second trial or extend `trialEndsAt` — both underlying calls are idempotent no-ops once the work is already done, unchanged from Phase 2. `signUp()`'s own onboarding call is untouched (still uses the in-transaction context directly, no behavior change, no additional test churn on the 11 existing `auth-signup.spec.ts` call sites).

**Cost accepted:** every login now does 2-4 extra reads against the entitlement database (mapping lookup, trial-existence check) even once a factory is fully healthy and needs no reconciliation. This is a deliberate trade of steady-state read cost for guaranteed self-healing, and is small relative to a login's existing bcrypt work factor. Flagged here rather than optimized away, since optimizing it (e.g. skip reconciliation once both checks are known-clean) is a Phase 3+ concern, not required for this hardening pass.

## Issue 4 — schema-parity protection

**AUTHORITATIVE SCHEMA:** `server/entitlement-api/prisma/schema.prisma`
**CLIENT MIRROR:** `server/optifabric-api/prisma/entitlement/schema.prisma`

`scripts/entitlement-schema-parity.ts` exports `extractModelsAndEnums(schemaText)`, a pure text-normalization function (strips comments, strips the `generator`/`datasource` blocks — the two places the files are *allowed* to differ — collapses whitespace) and `checkEntitlementSchemaParity()`, which reads both files and compares the normalized text. It has zero Prisma-generated-type dependencies, so importing it from a Jest test carries none of the cross-package `tsc` collision risk documented in the Phase 2 doc — it reads entitlement-api's schema as plain text via `fs`, never as a TypeScript import.

Enforced two ways:
- **`test/entitlement-schema-parity.spec.ts`**, part of the ordinary `npm test` run — this is what "fails development/test validation" on drift, per instruction. Includes a deliberately-mismatched fixture (`test/fixtures/drifted-entitlement-schema.prisma`, missing a `PlanCode` value and carrying an extra field) proving the comparator actually detects a real mismatch, not just passing vacuously.
- **`npm run check:entitlement-schema-parity`** (`scripts/entitlement-schema-parity.ts` run directly) — a standalone CLI exit-1-on-drift check, usable in a pre-commit hook or CI step independent of the full Jest suite.

This does not solve the underlying duplication (still a real Phase 3+ item — an npm workspace or published internal package, as Phase 2's doc already flagged) — it only guarantees drift is caught immediately instead of silently, which is what was actually asked for here.

## No real database cutover

Nothing in Phase 2A connected to a real database. All new tests (`entitlement-backfill.spec.ts`, the guard's lazy-mapping tests in `entitlement-cutover.spec.ts`, `auth-entitlement-reconciliation.spec.ts`, `entitlement-schema-parity.spec.ts`) use the same hand-built in-memory fakes / fixtures established in Phase 1 and Phase 2 — no live Postgres connection anywhere. `scripts/backfill-optifabric-entitlements.ts` exists and is unit-tested via the service it wraps, but has not been invoked against any database, local or otherwise, per instruction.

## Rollback

Same file set as Phase 2's rollback note, plus: revert `src/common/guards/subscription.guard.ts` to its Phase 2 (not pre-Phase-2) state, and delete `src/entitlement/factory-organisation-mapping.service.ts`, `src/entitlement/entitlement-backfill.service.ts`, `scripts/`, and the four new Phase 2A test files. `auth.service.ts`'s `reconcileEntitlementOnboarding` method and its call from `validateCredentials` can be reverted independently of everything else — it has no dependents.
