import { Module } from '@nestjs/common'
import { PrismaModule } from '@prisma'
import { ReviewService } from './review.service'
import { ReviewController } from './review.controller'

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
  imports: [PrismaModule],
})
export class ReviewModule {}
