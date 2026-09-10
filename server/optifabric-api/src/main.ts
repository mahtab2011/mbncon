// OptiFabric's auth + subscription backend. Built at the user's explicit
// request, mirroring the OptiSewing subscription/licensing system 1:1 (same
// Bangladesh-free-tier rule, same tamper-evident signed Subscription rows, same
// JWT/Bearer auth with revocation) so both products behave identically for
// customers and are easy to keep in sync going forward.
import * as path from "path";
import { config as loadDotenv } from "dotenv";
// .env lives directly in this project's own root (server/optifabric-api/.env),
// resolved from process.cwd() rather than __dirname — __dirname's depth under
// dist/ depends on how TypeScript's outDir nesting falls out and is not a
// stable thing to build a path on top of.
loadDotenv({ path: path.resolve(process.cwd(), ".env") });

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { validateEnv } from "./config/env-validation.config";

// Explicit JSON body-size ceiling for the whole API, replacing Express/
// body-parser's incidental ~100kb default. Sized from an investigation of
// OptiFabric's actual geometry/marker payload shapes (lib/optifabric/
// geometry/patternGeometry.ts, geometrySaveTypes.ts, markerTypes.ts):
//  - a single pattern piece's saved geometry (PUT .../patterns/:id/geometry)
//    is small even at the high end — a very detailed traced boundary
//    (roughly 500-1000 points at ~100 bytes/point in the richer of the two
//    frontend point shapes) lands well under 150 KB;
//  - a marker run (POST .../marker-runs) is the largest legitimate payload:
//    its snapshot carries one polygon per DISTINCT pattern piece, but its
//    result carries one full transformed-polygon copy per PLACED piece
//    INSTANCE (i.e. scaled by cut quantity, not just piece count) — a
//    large, many-piece, high-quantity marker can plausibly reach the high
//    hundreds of KB, and a very large/complex one could approach low
//    single-digit MB.
// 5 MB gives that realistic large-marker case multiple times of headroom
// while remaining a firm, finite ceiling that rejects runaway/pathological
// bodies. It's one constant, easy to revisit if real usage ever needs more
// — see the Stage 1A hardening report for the full sizing worksheet this
// was derived from. ProjectsService additionally bounds PatternGeometry's
// polygon by point COUNT (MAX_POLYGON_POINTS), independent of this
// byte-size limit.
const JSON_BODY_LIMIT = "5mb";

async function bootstrap() {
  const env = validateEnv(process.env);

  // bodyParser: false so we can register json/urlencoded parsers ourselves
  // with an explicit limit via useBodyParser below. NestFactory.create()
  // otherwise registers its own default-limit (100kb) parsers automatically
  // during app creation — by the time any app.use(json(...)) added
  // afterwards would run, the request body has already been consumed by
  // that default parser, so a limit can't be overridden that way.
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  app.useBodyParser("json", { limit: JSON_BODY_LIMIT });
  app.useBodyParser("urlencoded", { limit: JSON_BODY_LIMIT, extended: true });

  app.use(
    helmet({
      contentSecurityPolicy: { useDefaults: true },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      frameguard: { action: "deny" },
    }),
  );
  app.use((req: unknown, res: { setHeader: (name: string, value: string) => void }, next: () => void) => {
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  app.enableCors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: false,
  });

  app.setGlobalPrefix(env.API_PREFIX.replace(/^\//, ""));

  await app.listen(env.PORT, "0.0.0.0");
}
void bootstrap();
