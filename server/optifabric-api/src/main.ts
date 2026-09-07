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
import helmet from "helmet";
import { AppModule } from "./app.module";
import { validateEnv } from "./config/env-validation.config";

async function bootstrap() {
  const env = validateEnv(process.env);

  const app = await NestFactory.create(AppModule);

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
