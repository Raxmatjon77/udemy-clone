import { Module } from "@nestjs/common";
import {
  CourseService,
  LessonService,
  SectionService,
  LessonController,
  SectionController,
  CourseController,
} from "./";
import { PrismaModule } from "@prisma";
import { MinioModule } from "@modules";

@Module({
  controllers: [CourseController, LessonController, SectionController],
  providers: [CourseService, LessonService, SectionService],
  imports: [PrismaModule, MinioModule],
})
export class CourseModule {}
