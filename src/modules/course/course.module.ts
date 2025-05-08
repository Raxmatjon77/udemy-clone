import { Module } from "@nestjs/common";
import { PrismaModule } from "@prisma";
import { CourseController } from "./course.controller";
import { LessonController } from "./lesson.controller";
import { SectionController } from "./section.controller";
import { SectionService } from "./section.service";
import { LessonService } from "./lesson.service";
import { CourseService } from "./course.service";
import { MinioModule } from "@modules";

@Module({
  controllers: [CourseController, LessonController, SectionController],
  providers: [CourseService, LessonService, SectionService],
  imports: [PrismaModule, MinioModule],
})
export class CourseModule {}
