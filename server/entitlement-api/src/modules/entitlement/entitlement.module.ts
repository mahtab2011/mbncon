import { Module } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { EntitlementService } from "./entitlement.service";

// No controller yet — Phase 1 is service-layer only. See
// CENTRAL-ENTITLEMENT-PHASE-1.md, "No public API in Phase 1", for why an
// HTTP surface is deliberately deferred until a real admin/service-auth
// pattern is designed.
@Module({
  providers: [PrismaService, EntitlementService],
  exports: [EntitlementService],
})
export class EntitlementModule {}
