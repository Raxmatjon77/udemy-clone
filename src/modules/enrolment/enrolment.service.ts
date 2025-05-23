import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { CreateEnrollmentRequest, Enrollment, GetEnrollmentsRequest } from './interfaces'
import { PaginationRequest, PaginationResponse } from '@modules/common'

@Injectable()
export class EnrollMentService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  async createEnrollment(payload: CreateEnrollmentRequest): Promise<void> {
    const [user, course, existingEnrollment] = await Promise.all([
      this.#_prisma.user.findUnique({
        where: {
          id: payload.userId,
          deletedAt: null,
        },
      }),
      this.#_prisma.course.findUnique({
        where: {
          id: payload.courseId,
        },
      }),
      this.#_prisma.enrollment.findUnique({
        where: {
          enrollment_user_course_uq: {
            courseId: payload.courseId,
            userId: payload.userId,
          },
        },
      }),
    ])

    if (existingEnrollment) throw new BadRequestException('you  already enrolled to this course !')

    if (!user) throw new NotFoundException('User not found !')

    if (!course) throw new NotFoundException('Course not found !')

    await this.#_prisma.enrollment.create({
      data: {
        userId: payload.userId,
        courseId: payload.courseId,
      },
    })
  }

  async getEnrollments(payload: GetEnrollmentsRequest & PaginationRequest): Promise<PaginationResponse<Enrollment>> {
    let { pageNumber, pageSize } = payload

    if (!pageNumber) pageNumber = 1
    if (!pageSize) pageSize = 10

    const skip = (Number(pageNumber) - 1) * Number(pageSize)
    const take = Number(pageSize)
    const [user, enrollments, total] = await Promise.all([
      this.#_prisma.user.findUnique({
        where: {
          id: payload.userId,
          deletedAt: null,
        },
      }),
      this.#_prisma.enrollment.findMany({
        where: {
          userId: payload.userId,
        },

        select: {
          id: true,
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              categoryId: true,
              image: true,
            },
          },
        },
        take,
        skip,
      }),
      this.#_prisma.enrollment.count({
        where: {
          userId: payload.userId,
        },
      }),
    ])

    if (!user) throw new NotFoundException('User not found !')

    return {
      data: enrollments,
      pageNumber,
      total,
      pageSize,
    }
  }
}
