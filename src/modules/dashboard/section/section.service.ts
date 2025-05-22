import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@prisma'
import { GetSectionResponse, SectionCreate, SectionUpdate } from './interfaces'
@Injectable()
export class SectionService {
  readonly #_prisma: PrismaService
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  async createSection(data: SectionCreate): Promise<void> {
    const course = await this.#_prisma.course.findUnique({
      where: { id: data.courseId },
    })

    if (!course) {
      throw new NotFoundException('Course not found')
    }
    await this.#_prisma.section.create({
      data: {
        title: data.title,
        courseId: data.courseId,
        order: data.order,
      },
    })
  }

  async getSections(courseId: string): Promise<GetSectionResponse[]> {
    const sections = await this.#_prisma.section.findMany({
      where: { courseId },
      include: {
        lessons: true,
      },
    })

    return sections.map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        freePreview: lesson.freePreview,
      })),
    }))
  }

  async updateSection(id: string, data: SectionUpdate): Promise<void> {
    const section = await this.#_prisma.section.findUnique({
      where: { id },
    })

    if (!section) {
      throw new NotFoundException('Section not found')
    }

    await this.#_prisma.section.update({
      where: { id },
      data,
    })
  }

  async deleteSection(id: string): Promise<void> {
    const section = await this.#_prisma.section.findUnique({
      where: { id },
    })

    if (!section) {
      throw new NotFoundException('Section not found')
    }

    await this.#_prisma.section.delete({
      where: { id },
    })
  }

  async getSection(id: string): Promise<GetSectionResponse> {
    const section = await this.#_prisma.section.findUnique({
      where: { id },
      include: {
        lessons: true,
      },
    })

    if (!section) {
      throw new NotFoundException('Section not found')
    }

    return {
      id: section.id,
      title: section.title,
      order: section.order,
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        freePreview: lesson.freePreview,
      })),
    }
  }
}
