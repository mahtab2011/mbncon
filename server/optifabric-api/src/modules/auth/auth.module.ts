import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PrismaService } from "../../common/prisma.service";
import { EntitlementIntegrationModule } from "../../entitlement/entitlement.module";

// EntitlementIntegrationModule is safe to import here (unlike
// SubscriptionModule, which AuthModule must NOT import — see the
// module-level comment in auth.service.ts): EntitlementIntegrationModule
// provides its own SubscriptionService directly rather than importing
// SubscriptionModule, so no cycle exists. See entitlement.module.ts.
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION ?? "7d" },
    }),
    EntitlementIntegrationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
