import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { GetCourseResponse } from './interfaces'
import { MinioService } from '@clients'
import { PaginationRequest, PaginationResponse } from '@modules/common'

@Injectable()
export class CourseService {
  readonly #_prisma: PrismaService
  readonly #_minio: MinioService
  constructor(prisma: PrismaService, minio: MinioService) {
    this.#_prisma = prisma
    this.#_minio = minio
  }

  async getCourse(id: string): Promise<GetCourseResponse> {
    const course = await this.#_prisma.course.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        desc: true,
        price: true,
        thumbnail: true,
        isPublished: true,
        image: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        sections: {
          select: {
            id: true,
            title: true,
            lessons: {
              select: {
                id: true,
                title: true,
                videoUrl: true,
                freePreview: true,
                order: true,
                sectionId: true,
              },
            },
          },
        },
      },
    })

    if (!course) {
      throw new BadRequestException('Course not found')
    }

    return course
  }

  async getCourses(payload: PaginationRequest): Promise<PaginationResponse<GetCourseResponse>> {
    let { pageNumber, pageSize } = payload

    if (!pageNumber) pageNumber = 1
    if (!pageSize) pageSize = 10

    const skip = (Number(pageNumber) - 1) * Number(pageSize)
    const take = Number(pageSize)

    const [courses, total] = await Promise.all([
      this.#_prisma.course.findMany({
        where: { deletedAt: null },
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          slug: true,
          desc: true,
          price: true,
          thumbnail: true,
          isPublished: true,
          image: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          sections: {
            select: {
              id: true,
              title: true,
              lessons: {
                select: {
                  id: true,
                  title: true,
                  videoUrl: true,
                  freePreview: true,
                  order: true,
                  sectionId: true,
                },
                orderBy: {
                  order: 'asc',
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      }),
      this.#_prisma.course.count({
        where: { deletedAt: null },
      }),
    ])

    return {
      data: courses || [],
      total: total || 0,
      pageNumber: Number(pageNumber) || 1,
      pageSize: Number(pageSize) || 10,
    }
  }
}
