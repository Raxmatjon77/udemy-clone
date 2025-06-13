import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { jobsService } from './jobs.service'
import { JobsProcessor } from './jobs.processor'
import { MailService } from './mail.service'
import { BullBoardModule } from '@bull-board/nestjs'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'mail' }, { name: 'audio' }),
    BullBoardModule.forFeature(
      {
        name: 'mail',
        adapter: BullMQAdapter,
      },
      {
        name: 'audio',
        adapter: BullMQAdapter,
      },
    ),
  ],
  providers: [jobsService, JobsProcessor, MailService],
  exports: [jobsService],
})
export class JobsModule {}
