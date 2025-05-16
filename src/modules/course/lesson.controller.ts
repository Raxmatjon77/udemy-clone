import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { CreateLessonDto } from "./dtos";
import { GetLessonResponse } from "./interfaces";

@Controller("lessons")
export class LessonController {
  readonly #service: LessonService;
  constructor(service: LessonService) {
    this.#service = service;
  }

  @Post()
  async createLesson(@Body() data: CreateLessonDto): Promise<void> {
    await this.#service.createLesson(data);
  }

  @Get(":id")
  async getLesson(@Param("id") id: string): Promise<GetLessonResponse> {
    return this.#service.getLesson(id);
  }
}
