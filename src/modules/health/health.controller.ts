import { jobsService } from '@modules'
import { Controller, Get } from '@nestjs/common'

@Controller('health')
export class HealthController {
  readonly #_service: jobsService
  constructor(service: jobsService) {
    this.#_service = service
  }
  @Get('ping')
  async ping() {
    this.#_service.sendWelcomeEmail('hamidov.inbox@gmail.com')
    return 'pong'
  }
}
