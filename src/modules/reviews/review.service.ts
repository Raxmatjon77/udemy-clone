import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { PaginationRequest, PaginationResponse } from '@modules/common'
import { CreateReviewRequest, DeleteReviewRequest, Review, UpdateReviewRequest } from './interfaces'

@Injectable()
export class ReviewService {
  readonly #_prisma: PrismaService

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma
  }

  async createReview(payload: CreateReviewRequest): Promise<void> {
    const [user, cource] = await Promise.all([
      this.#_prisma.user.findUnique({
        where: {
          id: payload.userId,
          deletedAt: null,
        },
      }),
      this.#_prisma.course.findUnique({
        where: {
          id: payload.courseId,
          isPublished: true,
          deletedAt: null,
        },
      }),
    ])

    if (!user) throw new NotFoundException('User not found !')
    if (!cource) throw new NotFoundException('Course not found !')

    await this.#_prisma.review.create({
      data: {
        userId: payload.userId,
        rating: payload.rating,
        comment: payload.comment,
        courseId: payload.courseId,
      },
    })
  }

  async getAllReviews(payload: { courseId: string } & PaginationRequest): Promise<PaginationResponse<Review>> {
    let { pageNumber, pageSize } = payload

    if (!pageNumber) pageNumber = 1
    if (!pageSize) pageSize = 10

    const skip = (Number(pageNumber) - 1) * Number(pageSize)
    const take = Number(pageSize)
    const [reviews, total] = await Promise.all([
      this.#_prisma.review.findMany({
        where: {
          courseId: payload.courseId,
        },

        select: {
          id: true,
          courseId: true,
          rating: true,
          comment: true,
          user: {
            select: {
              email: true,
            },
          },
        },
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.#_prisma.review.count({
        where: {
          courseId: payload.courseId,
        },
      }),
    ])

    const data = reviews.map((review) => {
      return {
        id: review.id,
        userEmail: review.user.email,
        courseId: review.courseId,
        rating: review.rating,
        comment: review.comment,
      }
    })

    return {
      data,
      pageNumber,
      pageSize,
      total,
    }
  }

  async updateReview(payload: UpdateReviewRequest): Promise<void> {
    const review = await this.#_prisma.review.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
      },
    })

    if (review.userId !== payload.userId) throw new ForbiddenException('you do not have permission to this resource !')
    await this.#_prisma.review.update({
      where: { id: review.id },
      data: {
        comment: payload.comment !== undefined ? payload.comment : review.comment,
        rating: payload.rating !== undefined ? payload.rating : review.rating,
      },
    })
  }

  async deleteReview(payload: DeleteReviewRequest): Promise<void> {
    const review = await this.#_prisma.review.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
      },
    })

    if (review.userId !== payload.userId) throw new ForbiddenException('you do not have permission to this resource !')
    await this.#_prisma.review.update({
      where: { id: review.id },
      data: {
        deletedAt: null,
      },
    })
  }

  async getUserReviews(payload: { userId: string } & PaginationRequest): Promise<PaginationResponse<Review>> {
    let { pageNumber, pageSize } = payload

    if (!pageNumber) pageNumber = 1
    if (!pageSize) pageSize = 10

    const skip = (Number(pageNumber) - 1) * Number(pageSize)
    const take = Number(pageSize)

    const [reviews, total] = await Promise.all([
      this.#_prisma.review.findMany({
        where: {
          userId: payload.userId,
        },

        select: {
          id: true,
          courseId: true,
          rating: true,
          comment: true,
          user: {
            select: {
              email: true,
            },
          },
        },
        take,
        skip,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.#_prisma.review.count({
        where: {
          userId: payload.userId,
        },
      }),
    ])

    const data = reviews.map((review) => {
      return {
        id: review.id,
        userEmail: review.user.email,
        courseId: review.courseId,
        rating: review.rating,
        comment: review.comment,
      }
    })

    return {
      data,
      pageNumber,
      pageSize,
      total,
    }
  }

  async getReviewById(payload: { id: string }): Promise<Review> {
    const review = await this.#_prisma.review.findFirst({
      where: {
        id: payload.id,
        deletedAt: null,
      },
    })

    if (!review) throw new NotFoundException('review not found !')
    return
  }
  
}
