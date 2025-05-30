import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { ReviewService } from './review.service'
// import { CustomUser, PaginationRequest, PaginationResponse } from '@modules/common'
import { VerivyUserInterceptor } from '@interceptors'
import { JwtGuard } from '@guards'
import { CustomUser, PaginationRequest, PaginationResponse } from '@modules/common'
import { CreateReviewDto } from './dros'
import { Review } from './interfaces'

@Controller('enroll')
@UseInterceptors(VerivyUserInterceptor)
@UseGuards(JwtGuard)
export class ReviewController {
  readonly #_service: ReviewService
  constructor(service: ReviewService) {
    this.#_service = service
  }

  @Post(':courseId')
  async createReviews(@Param('courseId') courseId: string, @Req() req: CustomUser, @Body() body: CreateReviewDto) {
    return this.#_service.createReview({ courseId, userId: req.user.id, ...body })
  }

  @Get(':courseId')
  async getReviews(@Param() param: PaginationRequest & {courseId:string}, @Req() req: CustomUser): Promise<PaginationResponse<Review>> {
    return this.#_service.getAllReviews({ ...param })
  }

  // @Patch(':id')
  // async updateReviews(@Param('id') courseId: string, @Req() req: CustomUser, @Body() body: CreateReviewDto) {
  //   return this.#_service.updateReview({ courseId, userId: req.user.id, ...body })
}
