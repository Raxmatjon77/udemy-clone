import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { MailService } from './mail.service'

@Processor('mail', { concurrency: 10 })
export class JobsProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super()
  }

  async process(job: Job<{ email: string }>) {
    const { email } = job.data
    await this.mailService.sendWelcomeEmail(email)
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    console.log('completed')
  }
}
