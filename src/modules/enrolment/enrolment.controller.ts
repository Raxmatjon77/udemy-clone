import { Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { EnrollMentService } from './enrolment.service'
import { CustomUser, PaginationRequest, PaginationResponse } from '@modules/common'
import { Enrollment } from './interfaces'
import { CreateEnrollmentDto } from './dros'
import { VerivyUserInterceptor } from '@interceptors'
import { JwtGuard } from '@guards'

@Controller('enroll')
@UseInterceptors(VerivyUserInterceptor)
@UseGuards(JwtGuard)
export class EnrollMentController {
  readonly #_service: EnrollMentService
  constructor(service: EnrollMentService) {
    this.#_service = service
  }

  @Post(':courseId')
  async createEnrollments(@Param() param: CreateEnrollmentDto, @Req() req: CustomUser) {
    return this.#_service.createEnrollment({ courseId: param.courseId, userId: req.user.id })
  }

  @Get()
  async getEnrollments(
    @Param() param: PaginationRequest,
    @Req() req: CustomUser,
  ): Promise<PaginationResponse<Enrollment>> {
    return this.#_service.getEnrollments({ ...param, userId: req.user.id })
  }
  
}
