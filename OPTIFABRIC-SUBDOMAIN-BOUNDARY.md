# OptiFabric Subdomain Application Boundary (Stage A1)

**Status: application-routing boundary only. Not a production cutover.**

## What this is

`proxy.ts` (repo root) lets a request arriving with `Host: optifabric.mahtabsiddiqui.com`
resolve into the existing `app/optifabric/*` subtree, by rewriting the request
path to be prefixed with `/optifabric` — without moving any files.

This is preparation, not activation. As of this stage:

- **No DNS record exists** for `optifabric.mahtabsiddiqui.com`. The hostname
  check in `proxy.ts` is inert in production until that record is created.
- **No hosting/Vercel configuration changed.** This app still deploys and
  serves exactly as it does today.
- **No CORS, API URL, auth, or entitlement code changed.** `server/optifabric-api`
  is untouched.

## Current (temporary) architecture

OptiFabric continues to live inside this repo, alongside the general mbncon
site, for now:

```
mbncon.com                          -> corporate/consultancy site (unchanged)
mbncon.com/optifabric                -> OptiFabric (works today, as before)
optifabric.mahtabsiddiqui.com        -> OptiFabric, once DNS + hosting exist
                                         (same code, routed via proxy.ts)
optifabric.localhost:3000            -> local dev equivalent, no DNS needed
                                         (`*.localhost` resolves to 127.0.0.1
                                         automatically in modern browsers)
```

## Why one repo, one Next.js app

There is currently no deployment tooling (no `vercel.json`, no Dockerfile, no
CI) that ties the frontend and backend into one deployable unit — they are
already two independently buildable codebases. Host-based rewriting is the
smallest change that lets a future subdomain serve real traffic without
restructuring the repo. A full split into a separate repository/application
per product remains a reasonable **future** option — worth doing once
OptiSewing and OptiFootwear are real products sharing this pattern, not
before.

## What is explicitly out of scope for this stage

- Changing DNS for `mahtabsiddiqui.com`
- Changing Vercel/hosting project settings
- Changing `CORS_ALLOWED_ORIGINS` or `NEXT_PUBLIC_OPTIFABRIC_API_URL`
- Moving any OptiFabric files
- Any English/Bangla translation work
- Any change to `server/optifabric-api`, its guards, entitlement logic, or databases

See the "OptiFabric Expansion Blueprint" architecture audit for the fuller
domain-migration and bilingual plan this stage is the first small step of.
