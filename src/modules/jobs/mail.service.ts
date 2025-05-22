import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
  async sendWelcomeEmail(email: string) {
    console.log(`📬 Sending welcome email to ${email}...`)
    await new Promise((res) => setTimeout(res, 15000))
    console.log(`✅ Welcome email sent to ${email}`)
  }
}
