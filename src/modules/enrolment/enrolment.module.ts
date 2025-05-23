import { Module } from '@nestjs/common'
import { PrismaModule } from '@prisma'
import { MinioModule } from '@clients'
import { EnrollMentService } from './enrolment.service'
import { EnrollMentController } from './enrolment.controller'

@Module({
  controllers: [EnrollMentController],
  providers: [EnrollMentService],
  imports: [PrismaModule, MinioModule],
})
export class EnrollMentModule {}
