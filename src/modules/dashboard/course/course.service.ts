import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { CreateCourseRequest, GetCourseResponse, UpdateCourseRequest } from './interfaces'
import { MinioService } from '@clients'
import { PaginationResponse, PaginationRequest } from '@modules'

@Injectable()
export class CourseService {
  readonly #_prisma: PrismaService
  readonly #_minio: MinioService
  constructor(prisma: PrismaService, minio: MinioService) {
    this.#_prisma = prisma
    this.#_minio = minio
  }

  async createCourse(data: CreateCourseRequest, image: Express.Multer.File): Promise<void> {
    if (!image) {
      throw new BadRequestException('Image is required')
    }

    const [author, category, existingCourse] = await Promise.all([
      this.#_prisma.user.findUnique({
        where: { id: data.authorId },
      }),
      this.#_prisma.category.findUnique({
        where: { id: data.categoryId },
      }),
      this.#_prisma.course.findUnique({
        where: { slug: data.slug },
      }),
    ])

    if (existingCourse) {
      throw new BadRequestException('Course already exists')
    }

    if (!author) {
      throw new BadRequestException('Author not found')
    }

    if (!category) {
      throw new BadRequestException('Category not found')
    }

    const imageUrl = await this.#_minio.uploadFile('course', image)

    await this.#_prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        desc: data.desc,
        price: Number(data.price),
        thumbnail: data.thumbnail,
        isPublished: Boolean(data.isPublished),
        image: imageUrl,
        author: {
          connect: {
            id: data.authorId,
          },
        },
        category: {
          connect: {
            id: data.categoryId,
          },
        },
      },
    })
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

  async updateCourse(id: string, data: UpdateCourseRequest, image: Express.Multer.File | undefined): Promise<void> {
    const existingCourse = await this.#_prisma.course.findUnique({
      where: { id },
    })

    if (!existingCourse) {
      throw new BadRequestException('Course not found')
    }

    let imageUrl: string | undefined
    if (image) {
      if (existingCourse.image) {
        await this.#_minio.deleteFile('course', existingCourse.image)
      }

      imageUrl = await this.#_minio.uploadFile('course', image)
      data.thumbnail = imageUrl
    }

    await this.#_prisma.course
      .update({
        where: { id },
        data: {
          title: data.title ? data.title : existingCourse.title,
          slug: data.slug ? data.slug : existingCourse.slug,
          desc: data.desc ? data.desc : existingCourse.desc,
          price: data.price ? Number(data.price) : existingCourse.price,
          thumbnail: data.thumbnail ? data.thumbnail : existingCourse.thumbnail,
          isPublished: data.isPublished ? Boolean(data.isPublished) : existingCourse.isPublished,
          image: imageUrl ? imageUrl : existingCourse.image,
          author: {
            connect: {
              id: data.authorId ? data.authorId : existingCourse.authorId,
            },
          },
          category: {
            connect: {
              id: data.categoryId ? data.categoryId : existingCourse.categoryId,
            },
          },
        },
      })
      .catch(() => {
        throw new BadRequestException('Failed to update course')
      })
  }

  async deleteCourse(id: string): Promise<void> {
    const existingCourse = await this.#_prisma.course.findUnique({
      where: { id },
    })

    if (!existingCourse) {
      throw new BadRequestException('Course not found')
    }

    if (existingCourse.image) {
      await this.#_minio.deleteFile('course', existingCourse.image).catch(() => {
        throw new BadRequestException('Failed to delete image')
      })
    }

    await this.#_prisma.course
      .delete({
        where: { id },
      })
      .catch(() => {
        throw new BadRequestException('Failed to delete course')
      })
  }
}
