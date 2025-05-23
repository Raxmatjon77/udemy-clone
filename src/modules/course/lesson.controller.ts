import { Controller, Get, Param, Req } from '@nestjs/common'
import { LessonService } from './lesson.service'
import { GetLessonResponse } from './interfaces'
import { CustomUser } from '@modules/common'

@Controller('lessons')
export class LessonController {
  readonly #_service: LessonService
  constructor(service: LessonService) {
    this.#_service = service
  }

  @Get(':id')
  async getLesson(@Param('id') id: string, @Req() req: CustomUser): Promise<GetLessonResponse> {
    return this.#_service.getLesson({userId:req.user.id,id})
  }

  @Get('section/:sectionId')
  async getLessons(@Param('sectionId') sectionId: string): Promise<GetLessonResponse[]> {
    return this.#_service.getLessons(sectionId)
  }
}
