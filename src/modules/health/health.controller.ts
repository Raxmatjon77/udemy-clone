import { Controller, Get } from "@nestjs/common";

@Controller("healt")
export class HealthController {
  @Get("ping")
  async ping() {
    return "pong";
  }
}
