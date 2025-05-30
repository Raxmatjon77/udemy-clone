import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'
import { JobsModule } from '@modules'

@Module({
  imports: [JobsModule],
  controllers: [HealthController],
  providers: [HealthController],
})
export class HealthModule {}

