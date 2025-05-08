import { Controller } from "@nestjs/common";
import { LessonService } from "./lesson.service";

@Controller("lessons")
export class LessonController {
  readonly #service: LessonService;
  constructor(service: LessonService) {
    this.#service = service;
  }

  // @Post()
  // async createLesson(@Body() data: CreateLessonRequest): Promise<void> {
}
