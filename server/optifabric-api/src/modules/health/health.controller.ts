import { Controller, Get } from "@nestjs/common";
import { SkipSubscriptionCheck } from "../../common/guards/subscription.guard";

@SkipSubscriptionCheck()
@Controller("health")
export class HealthController {
  @Get("live")
  live() {
    return { status: "ok" };
  }
}
