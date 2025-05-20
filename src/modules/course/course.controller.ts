import { Controller, Get, Param, Query } from "@nestjs/common";
import { CourseService } from "./course.service";
import { PaginationRequest } from "@modules/common";

@Controller("course")
export class CourseController {
  readonly #_service: CourseService;

  constructor(service: CourseService) {
    this.#_service = service;
  }

  @Get()
  async getCourses(@Query() query: PaginationRequest) {
    return this.#_service.getCourses(query);
  }

  @Get(":id")
  async getCourse(@Param("id") id: string) {
    return this.#_service.getCourse(id);
  }
}
