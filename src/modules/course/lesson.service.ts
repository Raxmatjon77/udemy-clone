import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";

@Injectable()
export class LessonService {
  readonly #_prisma: PrismaService;
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  // async createLesson(data: CreateLessonRequest): Promise<void> {
  //     await this.#_prisma.lesson.create({
  //         data,
  //     });
  // }


}
