import { Controller } from '@nestjs/common'

@Controller('lessons')
export class LessonController {
  //   readonly #_service: LessonService;
  //   constructor(service: LessonService) {
  // this.#_service = service;
}

//   @Get(":id")
//   async getLesson(@Param("id") id: string): Promise<GetLessonResponse> {
//     return this.#_service.getLesson(id);
//   }

//   @Get("section/:sectionId")
//   async getLessons(@Param("sectionId") sectionId: string): Promise<GetLessonResponse[]> {
//     return this.#_service.getLessons(sectionId);
//   }
