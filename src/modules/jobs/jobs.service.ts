import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class jobsService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async sendWelcomeEmail(email: string) {
    await this.mailQueue
      .add(
        'nima gap',
        { email },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 3000,
          },
          removeOnComplete: false,
          removeOnFail: false,
        },
      )
      .catch(() => console.log('error adding quee'))
  }
}
