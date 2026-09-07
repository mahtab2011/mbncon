# Central Entitlement — Phase 1

**Status: foundation built and unit-tested. Not wired into OptiFabric or OptiSewing yet. No payment gateway. Not deployed.**

This document describes `server/entitlement-api/`, a new, isolated package inside the MBNCON repository that will become the single source of truth for whether an organisation can use OptiFabric and/or OptiSewing. It does not yet gate anything — see "Future OptiFabric cutover" and "Future OptiSewing cutover" below.

## Why a new isolated package, not a new microservice

`server/optifabric-api/` is the only thing under `server/` today. The smallest design that still gives one authoritative database and API boundary is a sibling package — `server/entitlement-api/` — using the exact same tooling (NestJS conventions, Prisma, ts-jest) already proven out in `optifabric-api`, rather than a new framework, a new language, or a hosted-elsewhere microservice. It is not a "microservice for architectural fashion" — it's a second, small NestJS package with its own database, following a pattern this repo already has one working example of.

It deliberately has **no `main.ts`/`app.module.ts` bootstrap and no HTTP controller yet**. Phase 1 asked for service-layer methods and tests, explicitly deferring a public API until a secure admin/service-auth pattern is designed (see "No public API in Phase 1" below) — so there is nothing to bootstrap yet.

## Architecture

```
Organisation ──┬── OrganisationExternalRef (system: BANGLADESH_APPAREL | OPTIFABRIC | OPTISEWING, externalFactoryId)
               └── ProductEntitlement × 2  (one per product: OPTIFABRIC, OPTISEWING)
```

**Organisation** is a new central identity, independent of every existing product's own factory ID. It is *not* an attempt to force OptiFabric's `Factory.id` and OptiSewing's `Factory.id` to become the same UUID — that would require coordinating both systems' primary keys, which is out of scope and unnecessary. Instead, **OrganisationExternalRef** maps one central `Organisation` to as many external system IDs as apply (today: an OptiFabric factory ID and/or an OptiSewing factory ID; the `BANGLADESH_APPAREL` system value exists for a future mapping to Bangladesh Apparel's own factory ID, once that integration is designed — see below).

**ProductEntitlement** is the actual access record — one row per `(organisationId, product)`, enforced by a compound unique index. There is no separate stored "status" column. Access is always **computed** from `(source, trialEndsAt, currentPeriodEnd)` at read time by `EntitlementService.getEffectiveEntitlement()` — this is a deliberate choice (per the Phase 1 brief: "prefer computed entitlement state over stale stored booleans") so there is no possibility of a cached status disagreeing with the actual dates.

## Organisation mapping (`OrganisationExternalRef`)

Not populated by anything yet in Phase 1 — no code currently creates these rows. The intended future flow: when OptiFabric's guard is cut over to this service, a signup/factory-creation event resolves (or creates) an `Organisation`, then upserts an `OrganisationExternalRef{system: OPTIFABRIC, externalFactoryId: <optifabric factory id>}`. OptiSewing's eventual cutover does the same with `system: OPTISEWING`. A future Bangladesh Apparel integration would do the same with `system: BANGLADESH_APPAREL`, giving one `Organisation` a trustworthy link across all three systems without ever needing their primary keys to match.

## The 90-day international trial

`EntitlementService.startInternationalTrial(organisationId)`:
- Creates **both** `ProductEntitlement` rows (`OPTIFABRIC` and `OPTISEWING`) in a single `prisma.$transaction([...])` call, with the **same** `trialStartedAt`/`trialEndsAt` timestamps on both.
- `trialEndsAt = trialStartedAt + 90 * 24h` — both fields are server-generated `new Date()` values inside the service; no caller can supply either.
- **Idempotent**: if *either* product already has an entitlement row for that organisation (trial, paid, or Bangladesh-free), the method creates nothing and returns the current state unchanged. This is what makes "re-login doesn't restart the trial," "a new browser doesn't restart the trial," and "calling `startInternationalTrial` twice doesn't extend the trial" true by construction — there is no code path that overwrites an existing row.
- Access ends **at the exact `trialEndsAt` timestamp**, not on some ambiguous "Day 90 vs Day 91" client-side boundary — `getEffectiveEntitlement()` uses a strict `now < trialEndsAt` comparison, so a request arriving at exactly `trialEndsAt` is already denied.

## Bangladesh-free entitlement

`EntitlementService.grantBangladeshFreeEntitlement(organisationId)`:
- Grants **both** products, permanently — no `trialEndsAt`/`currentPeriodEnd` is ever set for a `BANGLADESH_FREE` row, and `getEffectiveEntitlement()` never checks a date for this source. It cannot expire because there is no date it could expire against.
- **Idempotent** (an upsert).
- **Deliberately takes only an `organisationId`.** There is no `country` parameter and no call to a country-text matcher anywhere in this method. This directly satisfies the instruction not to grant Bangladesh-free entitlement merely because someone typed "Bangladesh" into a form field — the method has no way to do that, structurally.

### Future Bangladesh Apparel integration

This phase does **not** call Bangladesh Apparel's API and does not integrate with its verification system in any way — `verificationStatus` on that platform is untouched, and nothing in this package reads or writes it. `grantBangladeshFreeEntitlement()` today can only be invoked by trusted first-party code (there is no HTTP endpoint at all yet).

When Bangladesh Apparel integration is designed in a later phase, the recommended shape is: Bangladesh Apparel calls a **new, authenticated, service-to-service endpoint** (e.g. `POST /entitlements/bangladesh-free`, protected by a shared secret header — mirroring the `PlatformRepGuard`/`X-Platform-Rep-Key` pattern already proven in `optifabric-api`) **only after its own verification process has independently confirmed the factory** — this entitlement service should never itself decide what counts as "a verified Bangladesh factory"; that decision stays entirely in Bangladesh Apparel's domain, and this service just records the resulting grant. The two systems' notions of "verified"/"eligible" must remain decoupled, exactly as this task required.

## Paid entitlements (no payment gateway — see below)

`activateOptiFabricMonthly`, `activateOptiSewingMonthly`, `activateBundleMonthly` — admin/test-controlled primitives, **not proof of payment**. Each:
- Sets `source: PAID`, the matching `planCode`, and a `currentPeriodStart`/`currentPeriodEnd` pair.
- **Monthly period convention: a fixed 30-day window** (`currentPeriodStart + 30 × 24h`), matching the exact convention already used by the legacy `optifabric-api` subscription system (`periodDays = 30` for monthly plans) rather than calendar-month arithmetic — chosen for existing-system compatibility and to avoid month-length edge cases (there is no well-defined "one month after Jan 31").
- The single-product methods (`activateOptiFabricMonthly`/`activateOptiSewingMonthly`) only write their own product's row — a fresh organisation ends up with exactly one product enabled, the other correctly reporting `NO_ENTITLEMENT`. They do **not** retract an existing entitlement on the other product if an organisation is *downgrading* from an active bundle — seeplan-change handling is called out as an open design question below.
- `activateBundleMonthly` writes **both** rows in one `prisma.$transaction([...])` call with the identical `currentPeriodStart`/`currentPeriodEnd` — a bundle purchase cannot succeed for one product and silently fail for the other; a transaction failure propagates as a rejected promise from the method (tested).

No auto-renewal exists or was added — calling these again is a fully manual, explicit act (matching the instruction not to silently invent auto-renewal).

## Cancellation

`EntitlementService.cancelEntitlement(organisationId, product)`:
- Sets `cancelAtPeriodEnd = true` only. Does **not** touch `currentPeriodEnd`, and `getEffectiveEntitlement()` never reads this flag when deciding access — access continues, unaffected, until `currentPeriodEnd` naturally passes.
- If the entitlement being cancelled has `planCode: BUNDLE_MONTHLY`, **both** product rows are cancelled together in one transaction — a bundle is one commercial purchase, so partial cancellation of just one leg would misrepresent what was actually bought.
- Throws `NotFoundException` for an organisation/product with no entitlement row at all (fail-closed).

## Security controls implemented

- Every timestamp (`trialStartedAt`, `trialEndsAt`, `currentPeriodStart`, `currentPeriodEnd`) is computed from the server clock inside the service. No method signature accepts an end date from a caller.
- `product` is the generated Prisma enum at the type level; `assertValidProduct()` also defends this at runtime for any future caller that bypasses TypeScript (e.g. a JSON body).
- Fail-closed reads: an unknown `organisationId` simply has no entitlement row, so `getEffectiveEntitlement()` returns `isAccessAllowed: false` — never throws, never defaults open.
- Fail-closed writes: `ProductEntitlement.organisationId` has a foreign-key constraint against `Organisation.id` — Postgres itself rejects any attempted write for an organisation that doesn't exist, independent of application logic.
- Tenant isolation: every method requires an explicit `organisationId`; there is no ambient/session-derived identity anywhere in this package (there is no session at all yet — see "No public API in Phase 1").
- No secrets in source — this package needs its own `DATABASE_URL` at deploy time (schema only references `env("DATABASE_URL")`), no value is hardcoded or was ever printed to any log/output in this phase.
- No privilege is granted based on country text — see "Bangladesh-free entitlement" above.
- Idempotent trial creation and atomic bundle updates — both explicitly implemented and tested (see below).

## No public API in Phase 1

Per the brief, this phase deliberately stops short of an HTTP layer: *"Do not expose privileged entitlement mutation endpoints publicly without authentication/authorization. If no secure admin/service-auth pattern exists yet: implement service-layer methods and tests first."* `optifabric-api` has two proven service-auth patterns already (`PlatformRepGuard`'s shared-secret header, and JWT-based user auth) — a future phase should reuse one of those rather than invent a third, once it's decided who is actually allowed to call `POST /entitlements/activate` etc. (a platform rep? an authenticated payment webhook? Bangladesh Apparel's backend?). That decision is explicitly deferred, not made here.

## No payment gateway

Confirmed in the prior audit and unchanged here: **no real payment provider exists anywhere in this repository or OptiSewing's.** `activateOptiFabricMonthly`/`activateOptiSewingMonthly`/`activateBundleMonthly` are entitlement primitives only — calling them does not mean, and was never claimed to mean, that a charge occurred. Integrating a real provider (Stripe or otherwise) is explicitly out of scope for Phase 1 and should happen only once this entitlement model is stable and, ideally, in production use by at least OptiFabric.

## Rollback considerations

Because this phase does not touch `server/optifabric-api/` or OptiSewing's `apps/api/` at all — no guard changed, no existing schema altered, no existing route behavior changed — rollback is simply: stop using `server/entitlement-api/`, or delete it. Nothing outside this new package depends on it yet. Once a future phase does cut a guard over to it, that phase's own rollback plan needs to restore the old guard/table as the source of truth — that is out of scope for this document until that phase is designed.
