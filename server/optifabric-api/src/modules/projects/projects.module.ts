import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { PrismaService } from "../../common/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PassportModule, AuthModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
