# OptiFabric API — Hosting Selection & Staging Deployment Plan (Stage A3)

**Status (updated, Stage 2F-3): this document itself was, and remains, planning/documentation only — nothing in this stage created an account, deployed anything, or changed DNS. However, repository history since this document was written shows that at least some of §12's "next actions" were subsequently carried out: a later commit ("Fix OptiFabric API Render build: nest CLI unavailable in production install") describes reproducing a real Render build failure and fixing it, which is only possible if a Render account, connected repo, and Web Service already existed and a real deploy was attempted. Current live deployment status — whether that service exists today, is running, or is reachable — is NOT checked by this document and must be verified directly against Render, not inferred from this plan.**

## 1. Hosting requirements (derived from the actual backend)

- A **persistent, long-running Node process** — not serverless (see Stage A2:
  `@nestjs/throttler`'s in-memory rate-limit counters and Prisma's connection
  pooling both assume a long-lived process).
- PostgreSQL reachable via **two** connection strings (`DATABASE_URL`,
  `ENTITLEMENT_DATABASE_URL`) — Prisma, two separately generated clients.
- 6 required secret/env vars, 6 optional/defaulted (see §10).
- HTTPS, custom domain support, a configurable health-check path
  (`/api/v1/health/live` already exists and is public/minimal — see Stage A2).
- Delivery of `SIGTERM` (not just `SIGKILL`) on redeploy/restart, so the
  graceful-shutdown hooks added in Stage A2 actually run — and a **Linux**
  runtime, since that path could not be exercised on local Windows dev.
- Automatic restart on crash, accessible logs, low-cost initial capacity,
  GitHub-based deploy (this repo is already on GitHub:
  `github.com/mahtab2011/mbncon`).

## 2. Host comparison

| Host | Persistent Node | Prisma/Postgres | Deploy simplicity | Custom domain | Health checks | Logs | Secrets | Auto-restart | Ops complexity | Cost (staging) |
|---|---|---|---|---|---|---|---|---|---|---|
| **Render** | Native "Web Service" | Managed Postgres add-on | Connect GitHub repo, dashboard-configured, zero required config file | Yes, managed TLS | Native path config | Built-in viewer | Dashboard secret fields | Yes | **Low** | Free web service + free (time-limited) Postgres — genuinely $0 to start |
| **Railway** | Native | Managed Postgres add-on | Connect GitHub repo, near-identical flow to Render | Yes, managed TLS | Native | Built-in | Dashboard | Yes | **Low** | No perpetual free tier today — usage-based billing from day one |
| **Fly.io** | Native (runs containers) | Fly Postgres (managed) or bring-your-own | Requires `flyctl` + `fly.toml`, more moving parts (regions, volumes) | Yes | Native | Built-in | `fly secrets` | Yes | **Medium** | Low, but effectively requires a card on file even for small apps |
| **Hostinger** | Only via a raw VPS you administer yourself | You install/manage Postgres, or connect an external managed DB | No native GitHub deploy pipeline — you build one (systemd unit, nginx, certbot) | Manual nginx + certbot | Manual (you write the probe/monitor) | Manual (journalctl/log files) | Manual `.env`/systemd environment file | You configure systemd restart policy yourself | **High** | Cost of the VPS itself — may already be paid for other sites, but all ops work is manual |
| **Vercel** | **Not suitable** — serverless/edge functions only, no persistent process; would break in-memory throttling and Prisma pooling exactly as flagged in the earlier domain-migration audit | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

Vercel is ruled out on technical grounds, not preference — this backend was
never built for a stateless-per-invocation model, and adapting it would be
the kind of framework/architecture change this stage is explicitly not
allowed to make.

## 3. Chosen host: **Render** — fallback: **Railway**

Render and Railway are close to equally suitable — both are purpose-built
PaaS platforms for exactly this shape of app (persistent Node + Postgres +
GitHub deploy), both handle health checks, custom domains, logs, secrets,
and SIGTERM-based redeploys natively, with low day-to-day operational
overhead compared to Fly.io's extra CLI/config surface or a raw Hostinger
VPS's fully manual ops burden.

The deciding factor: **Render currently offers a genuinely zero-cost path**
for a first staging deployment (free web service tier + free, time-limited
Postgres), whereas Railway's free tier has been retired in favour of
usage-based billing from the first deployment. For a first *staging*
deployment whose only job is to prove the architecture works — not to serve
real traffic — that makes Render the lower-friction, lower-commitment
choice. Railway remains an excellent, essentially equivalent fallback if
Render's specifics (region availability, free-tier limits) don't suit once
you look at it directly.

Hostinger is not ruled out long-term — if you're already paying for it
anyway, it could be a legitimate cost optimisation once the app is proven —
but it is not the right choice for a *first* staging deployment, where
"simplest reliable architecture" was the explicit brief.

## 4. Production API hostname

**`api.optifabric.mahtabsiddiqui.com`** — matches your own suggested form,
reads clearly as "the API behind the OptiFabric product," and needs nothing
more than one CNAME record once a real cutover stage decides to configure
DNS (not this stage). A flatter alternative, `optifabric-api.mahtabsiddiqui.com`,
would work identically from a hosting/CORS perspective if you'd rather avoid
the extra subdomain level — no technical reason favours one over the other,
so this is a naming preference, not a constraint.

## 5. Staging deployment architecture

**Staging hostname: the provider-generated URL** (e.g.
`optifabric-api-staging.onrender.com`), not a custom subdomain — this needs
zero DNS configuration at all, which is the safest possible first step. A
real `staging-api.optifabric.mahtabsiddiqui.com` CNAME can be added later,
once the provider-generated URL has already proven the deployment works.

**Recommended Render "Web Service" configuration** (dashboard values — see
§7 for why no `render.yaml` blueprint file was added):

| Setting | Value |
|---|---|
| Root directory | `server/optifabric-api` |
| Build command | `npm install && npm run build` |
| Start command | `npm run start` |
| Health check path | `/api/v1/health/live` |
| Runtime | Node |

**Staging verification checklist** (run once the deployment exists — not
performed in this stage):

1. Boots without error; `/api/v1/health/live` returns `{"status":"ok"}`.
2. Main Postgres (`DATABASE_URL`) and entitlement Postgres
   (`ENTITLEMENT_DATABASE_URL`) both connect — confirmed implicitly by (3)
   succeeding, since signup/login touch both databases.
3. Signup or login against staging succeeds and issues a JWT.
4. `GET /projects` with no `Authorization` header → 401.
5. `GET /projects` with a valid JWT + an active staging entitlement → 200.
6. Same JWT, entitlement's `trialEndsAt` temporarily set to a past
   timestamp (same reversible technique already proven locally in Stages
   4B/4E — triple-scoped update, immediate restore) → 402, then restored → 200.
7. A request from a disallowed origin is rejected by CORS; a request from
   an allowed origin succeeds.
8. **Graceful SIGTERM on Linux** — see §8. Mandatory before any production
   cutover, since this is the one thing local Windows dev could not verify.

None of this touches local dev data, and steps 5–6 use a dedicated staging
entitlement row, never production data (none exists yet regardless).

## 6. Database strategy: **B — new hosted staging Postgres**

- **A (existing local DB)** is ruled out by instruction: local Postgres must
  never be exposed to the internet, and a hosted backend cannot reach a
  local-only database without doing exactly that.
- **C (existing production-capable DB)** doesn't apply — none has ever been
  provisioned; only local dev Postgres exists today.
- **B** is therefore not just preferred but the only safe option available:
  two new, disposable Render-managed Postgres databases (mirroring the local
  two-database split — one main, one entitlement), fully isolated from local
  dev and from any future production data. Nothing about local or existing
  databases changes.

## 7. Why no deployment config file was added

Render does not *require* a tracked `render.yaml` — full configuration
through its dashboard (build/start commands, health check path, env vars)
is completely sufficient for a first deploy, and is what §5's table
documents. A Blueprint YAML file was considered, but its exact schema can't
be validated without Render's own tooling (no local validator available in
this environment), and shipping a subtly-wrong config file would be worse
than clear, accurate prose instructions the user can check directly against
Render's own dashboard. This matches the instruction to add a config file
only where the host *requires* one — Render doesn't.

## 8. Linux SIGTERM verification plan (mandatory before production)

Once staging exists on Render (a Linux container host):

1. Trigger a manual redeploy or restart from the Render dashboard — this is
   a normal container lifecycle event and sends `SIGTERM` before `SIGKILL`,
   exactly what Stage A2's `app.enableShutdownHooks()` exists to handle, and
   exactly what local Windows `taskkill` could not do.
2. Confirm the new instance comes up healthy immediately, with no error
   logs from the outgoing instance about a failed/forced Postgres
   disconnect.
3. Optionally cross-check via Render's Postgres connection-count metric (or
   `SELECT * FROM pg_stat_activity`) that the outgoing instance's
   connections drop to zero promptly rather than lingering — direct
   evidence `PrismaService.onModuleDestroy` and the new
   `EntitlementPrismaLifecycle` hook both actually ran.

This is the one verification step Stage A2 explicitly could not complete
locally, and this stage's whole purpose is to make it possible — not to
perform it. It stays outstanding until a staging deployment exists.

## 9. CORS origin progression (no code change — already comma-separated)

| Environment | Origin | Where configured |
|---|---|---|
| Local dev | `http://localhost:3000` | `server/optifabric-api/.env` (unchanged) |
| Staging | the staging frontend's origin, once one exists | `CORS_ALLOWED_ORIGINS` env var **on the staging backend deployment**, appended, not replacing anything |
| Production | `https://optifabric.mahtabsiddiqui.com` | `CORS_ALLOWED_ORIGINS` env var **on the production backend deployment**, at actual cutover (future stage) |

`CORS_ALLOWED_ORIGINS` already parses as a comma-separated list
(`env-validation.config.ts`) — nothing about the CORS logic itself changes
for any of this. The tracked local `.env` is untouched by this stage.

## 10. Frontend `NEXT_PUBLIC_OPTIFABRIC_API_URL` progression

| Environment | Value | Where configured |
|---|---|---|
| Local dev | `http://localhost:3011/api/v1` (current) | `.env.local` (unchanged) |
| Staging | the staging backend's provider URL + `/api/v1` | env var on the staging **frontend** deployment |
| Production | `https://api.optifabric.mahtabsiddiqui.com/api/v1` | env var on the production **frontend** deployment, at actual cutover |

No live values changed in this stage.

## 11. Secrets that must be configured on the host (names only — never printed/committed)

Required: `DATABASE_URL`, `ENTITLEMENT_DATABASE_URL`, `JWT_SECRET`,
`CORS_ALLOWED_ORIGINS`, `LICENSE_SIGNING_SECRET`, `PLATFORM_REP_API_KEY`.
Optional/defaulted: `NODE_ENV`, `PORT` (most hosts, including Render, inject
their own `PORT` value — already respected via `env.PORT ?? 3011`),
`API_PREFIX`, `JWT_EXPIRATION`, `RATE_LIMIT_AUTH_MAX`, `RATE_LIMIT_API_MAX`.

Staging must use **freshly generated** secret values, distinct from local
dev's — not copied from the tracked `.env`, and not generated or committed
by this stage.

## 12. What requires your action next

This stage deliberately stops before any account/billing/DNS action:

1. Create a Render account (or confirm you already have one).
2. Connect the `mahtab2011/mbncon` GitHub repo.
3. Create a new Web Service using the §5 dashboard values.
4. Create the two staging Postgres databases and copy their connection
   strings into `DATABASE_URL` / `ENTITLEMENT_DATABASE_URL`.
5. Generate and enter fresh values for the four required secrets.
6. Deploy, then work through the §5 verification checklist, finishing with
   the §8 SIGTERM check.

None of this was performed as part of this stage. (Stage 2F-3 note: repository
history indicates steps 1–4, and at least one deploy attempt, were carried
out in a later stage — see this document's updated status line above. Steps
5's exact secret values and the full §5/§8 verification checklist are not
confirmed by repository evidence and must be checked directly against
Render.)
