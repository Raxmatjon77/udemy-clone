import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { GetSectionResponse } from "./interfaces";
import { PaginationResponse } from "@modules";
@Injectable()
export class SectionService {
  readonly #_prisma: PrismaService;
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async getSections(payload: {courseId: string, pageNumber: number, pageSize: number}): Promise<PaginationResponse<GetSectionResponse>> {
    
    if(!payload.pageNumber) payload.pageNumber = 1;
    if(!payload.pageSize) payload.pageSize = 10;

    const skip = (Number(payload.pageNumber) - 1) * Number(payload.pageSize);
    const take = Number(payload.pageSize);

    const sections = await this.#_prisma.section.findMany({
      where: { courseId: payload.courseId },
      include: {
        lessons: true,
      },
      skip,
      take,
    });

    const sectionsResponse = sections.map((section) => ({
      id: section.id,
      title: section.title,
      order: section.order,
      lessons: section.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        freePreview: lesson.freePreview,
      })),
    }));

    return {
      data: sectionsResponse,
      total: sections.length,
      pageNumber: Number(payload.pageNumber),
      pageSize: Number(payload.pageSize),
    };
  }

  async getSection(id: string): Promise<GetSectionResponse> {
    const section = await this.#_prisma.section.findUnique({
      where: { id },
      include: {
        lessons: true,
      },
    });

    if (!section) {
      throw new NotFoundException("Section not found");
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
    };
  }
}
