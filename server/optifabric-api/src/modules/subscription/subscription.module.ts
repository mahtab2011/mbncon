import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";
import { PrismaService } from "../../common/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PassportModule, AuthModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, PrismaService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
