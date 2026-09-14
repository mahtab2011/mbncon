// OptiFabric subdomain application boundary — Stage A1.
//
// Purpose: let a FUTURE request arriving on optifabric.mahtabsiddiqui.com
// resolve into the existing app/optifabric/* subtree, without moving any
// files and without touching DNS, hosting, CORS, or the backend. No such
// DNS record exists yet — this only prepares the app-level routing so that,
// once it does, no further frontend code changes are needed to serve it.
//
// See OPTIFABRIC-SUBDOMAIN-BOUNDARY.md at the repo root for the full
// migration context.
//
// Named `proxy` (not `middleware`) per Next.js 16 — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md,
// "the middleware file convention is deprecated and has been renamed to
// proxy." This project never had a middleware.ts, so there is nothing to
// migrate — this is a fresh proxy.ts using the current convention directly.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Hostnames that should resolve into the /optifabric subtree.
//   - optifabric.mahtabsiddiqui.com: the real future production domain.
//     Does not exist in DNS yet (Stage A1 is app-routing prep only) — this
//     entry is inert until that record is created in a later stage.
//   - optifabric.localhost: lets this be tested TODAY, in a real browser,
//     with zero configuration. Modern browsers/OS resolve any `*.localhost`
//     hostname straight to 127.0.0.1 (no /etc/hosts edit, no real DNS) —
//     visiting http://optifabric.localhost:3000 against `next dev` exercises
//     the exact same code path production will use later.
const OPTIFABRIC_HOSTNAMES = new Set([
  "optifabric.mahtabsiddiqui.com",
  "optifabric.localhost",
]);

// Paths that must never be rewritten, even on an OptiFabric host:
//   - already under /optifabric — the app's own internal links/redirects
//     (e.g. RequireOptiFabricAuth's `router.replace("/optifabric/login")`)
//     are hardcoded with this prefix; leaving them alone here means every
//     existing internal Link/redirect keeps working unchanged, both today
//     on mbncon.com/optifabric and later on the new subdomain — no file
//     moves, no internal link rewrites required for this stage.
//   - /_next and /api — framework internals and any future API routes.
//   - anything with a file extension — favicon.ico, robots.txt, images,
//     fonts, and any other static asset under /public, which are served
//     from their real path and must not gain an /optifabric prefix.
function shouldBypassRewrite(pathname: string): boolean {
  return (
    pathname.startsWith("/optifabric") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();

  if (!OPTIFABRIC_HOSTNAMES.has(hostname)) {
    // Any other host — including mbncon.com and plain localhost during
    // local development — is completely unaffected. mbncon.com keeps
    // serving its own homepage/navigation exactly as today, and
    // localhost:3000/optifabric keeps working exactly as today.
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (shouldBypassRewrite(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/optifabric" : `/optifabric${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
