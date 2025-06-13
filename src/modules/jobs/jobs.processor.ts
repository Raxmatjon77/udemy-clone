import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { MailService } from './mail.service'
import { Logger } from '@nestjs/common'

@Processor('mail', { concurrency: 10 })
export class JobsProcessor extends WorkerHost {
  readonly logger = new Logger(JobsProcessor.name)
  constructor(private readonly mailService: MailService) {
    super()
  }

  async process(job: Job<{ email: string }>) {
    const { email } = job.data
    this.logger.log(`Processing job ${job.id} for email ${email}`)
    await this.mailService.sendWelcomeEmail(email)
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    console.log('completed')
  }
}
