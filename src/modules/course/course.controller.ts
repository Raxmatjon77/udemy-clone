import { Controller, Get, Param } from "@nestjs/common";
import { CourseService } from "./course.service";

@Controller("course")
export class CourseController {
  readonly #_service: CourseService;

  constructor(service: CourseService) {
    this.#_service = service;
  }

  @Get()
  async getCourses() {
    return this.#_service.getCourses();
  }

  @Get(":id")
  async getCourse(@Param("id") id: string) {
    return this.#_service.getCourse(id);
  }
}
