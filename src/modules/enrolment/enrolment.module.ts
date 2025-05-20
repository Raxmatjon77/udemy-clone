import { Module } from '@nestjs/common'
import { PrismaModule } from '@prisma'
import { MinioModule } from '@clients'

@Module({
  controllers: [],
  providers: [],
  imports: [PrismaModule, MinioModule],
})
export class CourseModule {}
