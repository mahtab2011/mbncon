import { Controller, Get } from "@nestjs/common";
import { SkipSubscriptionCheck } from "../../common/guards/subscription.guard";
import { SkipJwtAuth } from "../auth/jwt-auth.guard";

// Fully public — no JWT, no entitlement. Load balancers/uptime checks must
// be able to reach this with no credentials at all.
@SkipJwtAuth()
@SkipSubscriptionCheck()
@Controller("health")
export class HealthController {
  @Get("live")
  live() {
    return { status: "ok" };
  }
}
