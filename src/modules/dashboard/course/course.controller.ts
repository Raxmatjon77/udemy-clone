import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Delete,
  Patch,
  Query,
} from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto, UpdateCourseDto } from "./dtos";
import { FileInterceptor } from "@nestjs/platform-express";
import { PaginationResponse } from "@modules";
import { GetCourseResponse } from "./interfaces";

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

  @Get()
  async getCourses(
    @Query("pageNumber") pageNumber: number,
    @Query("pageSize") pageSize: number,
  ): Promise<PaginationResponse<GetCourseResponse>> {
    return this.#_service.getCourses({ pageNumber, pageSize });
  }

  @Get(":id")
  async getCourse(@Param("id") id: string) {
    return this.#_service.getCourse(id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("course"))
  async updateCourse(
    @Param("id") id: string,
    @Body() body: UpdateCourseDto,
    @UploadedFile() image: Express.Multer.File | undefined,
  ) {
    return this.#_service.updateCourse(id, body, image);
  }

  @Delete(":id")
  async deleteCourse(@Param("id") id: string) {
    return this.#_service.deleteCourse(id);
  }
}
