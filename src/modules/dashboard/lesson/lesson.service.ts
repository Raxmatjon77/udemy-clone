import { Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma'
import { CreateLessonRequest, GetLessonResponse, UpdateLessonRequest } from './interfaces'

@Injectable()
export class LessonService {
  readonly #_prisma: PrismaService
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  async createLesson(data: CreateLessonRequest): Promise<void> {
    await this.#_prisma.lesson.create({
      data: {
        title: data.title,
        videoUrl: data.videoUrl,
        freePreview: data.freePreview,
        sectionId: data.sectionId,
        order: data.order,
      },
    })
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
    })

    return lesson
  }

  async updateLesson(id: string, data: UpdateLessonRequest): Promise<void> {
    await this.#_prisma.lesson.update({
      where: { id },
      data,
    })
  }

  async getLessons(sectionId: string): Promise<GetLessonResponse[]> {
    const lessons = await this.#_prisma.lesson.findMany({
      where: { sectionId },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        freePreview: true,
        sectionId: true,
        order: true,
        comments: true,
      },
    })

    return lessons
  }
}
