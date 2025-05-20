import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { GetLessonResponse } from "./interfaces";

@Injectable()
export class LessonService {
  readonly #_prisma: PrismaService;
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async getLesson(id: string): Promise<GetLessonResponse> {
    const lesson = await this.#_prisma.lesson.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        freePreview: true,
        sectionId: true,
        order: true,
        comments: true,
      },
    });

    return lesson;
  }

  async getLessons(sectionId: string): Promise<GetLessonResponse[]> {
    const lessons = await this.#_prisma.lesson.findMany({
      where: { sectionId, deletedAt: null },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        freePreview: true,
        sectionId: true,
        order: true,
        comments: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return lessons;
  }
}
