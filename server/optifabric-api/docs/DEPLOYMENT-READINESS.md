# OptiFabric API — Deployment Readiness (Stage A2)

**Status: production-runnable locally. Not deployed anywhere. No DNS/hosting configured.**

## Recommended hosting model

**A — long-running Node service** (a persistent process, not serverless functions).

Why: `@nestjs/throttler`'s rate limiting uses in-memory, per-process counters
(no Redis/external store configured), and Prisma Client connection pooling
assumes a long-lived process — both would behave incorrectly under a
per-invocation serverless model. This app was not built with stateless-per-
request assumptions and nothing here requires changing that. A container is
not required either — any platform that runs a persistent Node process
(a plain VPS with a process manager, or a container host) works with zero
further code change. No Dockerfile was added in this stage since none of
the available options require one yet — adding one speculatively would be
infrastructure this stage doesn't need.

## Production start

```
npm run build   # prisma generate (both clients) -> nest build -> dist/
npm run start   # node dist/src/main.js
```

`npm install` also runs both `prisma generate` steps via `postinstall`.
`prisma` is a devDependency — the install/build phase must include
devDependencies (the default on most platforms); only the final runtime
image needs to exclude them.

## Required environment variables (names only)

| Variable | Required? | Kind |
|---|---|---|
| `DATABASE_URL` | required | secret, connection string |
| `ENTITLEMENT_DATABASE_URL` | required | secret, connection string |
| `JWT_SECRET` | required (min 64 chars) | secret |
| `CORS_ALLOWED_ORIGINS` | required | origin list (comma-separated) |
| `LICENSE_SIGNING_SECRET` | required (min 64 chars) | secret |
| `PLATFORM_REP_API_KEY` | required (min 64 chars) | secret |
| `NODE_ENV` | optional (defaults `production`) | — |
| `PORT` | optional (defaults `3011`) | — |
| `API_PREFIX` | optional (defaults `/api/v1`) | — |
| `JWT_EXPIRATION` | optional (defaults `7d`) | — |
| `RATE_LIMIT_AUTH_MAX` | optional (defaults `5`) | — |
| `RATE_LIMIT_API_MAX` | optional (defaults `120`) | — |

All required vars are enforced fail-closed at boot (`env-validation.config.ts`) —
missing or malformed values stop the process rather than starting degraded.

## Prisma

Two schemas, two generated clients — both required before `nest build`:

- `prisma/schema.prisma` → default `@prisma/client` location (main OptiFabric DB).
- `prisma/entitlement/schema.prisma` → custom output `node_modules/.prisma-entitlement-client`
  (the central entitlement DB — see `docs/PHASE-2-ENTITLEMENT-CUTOVER.md` for
  why this mirror exists).

Both are now generated automatically by `postinstall` and defensively again
by `build`. Neither requires a live database connection to generate.

**Migration policy:** migrations are a deliberate, separate, manual step —
`prisma migrate deploy` against each database — never run automatically by
`install`, `build`, or `start`. None were run in this stage.

## Health check

`GET /api/v1/health/live` → `{"status":"ok"}`, no auth, no privileged data.
Already suitable for uptime checks and hosting platform health probes as-is —
no change was needed.

## Graceful shutdown (added this stage)

- `main.ts` now calls `app.enableShutdownHooks()`, so a `SIGTERM`/`SIGINT`
  (what a process manager or container orchestrator sends on deploy/restart)
  actually triggers Nest's shutdown lifecycle instead of a bare process kill.
- The main Prisma client already closes correctly on shutdown
  (`PrismaService.onModuleDestroy`).
- The entitlement Prisma client had no shutdown hook at all — added a small
  `EntitlementPrismaLifecycle` provider whose only job is to `$disconnect()`
  it on `onModuleDestroy`. The existing `ENTITLEMENT_PRISMA` token and every
  consumer of it are unchanged.

Validated locally: the compiled build boots via `npm run start`, serves
`/health/live` and correctly 401s `GET /projects` with no JWT. Full SIGTERM
behavior could not be exercised end-to-end on this Windows dev machine
(`taskkill` cannot deliver a soft terminate to a console Node process without
`/F`) — the code path is standard NestJS and will run correctly on the
Linux-based host this eventually deploys to; this is a local testing
limitation, not an unverified code change.

## What remains before live deployment

- Choose and configure an actual host (still undecided — no DNS/Vercel/hosting
  change was made in this stage).
- Set the required env vars above on that host, pointed at real (or newly
  provisioned) production databases.
- Run `prisma migrate deploy` against each production database once it exists.
- Add the eventual public API origin to `CORS_ALLOWED_ORIGINS` and point
  `NEXT_PUBLIC_OPTIFABRIC_API_URL` at it (frontend-side, not part of this stage).
