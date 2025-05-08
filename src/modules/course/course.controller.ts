import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dtos";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("course")
export class CourseController {
  readonly #_service: CourseService;

  constructor(service: CourseService) {
    this.#_service = service;
  }

  @Post()
  @UseInterceptors(FileInterceptor("course"))
  async createCourse(
    @Body() body: CreateCourseDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.#_service.createCourse(body, image);
  }
}
