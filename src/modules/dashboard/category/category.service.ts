import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@prisma'
import { CreateCategoryRequest, UpdateCategoryRequest, GetCategoryByIdRequest, Category } from './interfaces'
import { MinioService } from '@clients'
import { PaginationRequest, PaginationResponse } from '@modules'

@Injectable()
export class CategoryService {
  readonly #_prisma: PrismaService
  readonly #_minio: MinioService
  constructor(prisma: PrismaService, minio: MinioService) {
    this.#_prisma = prisma
    this.#_minio = minio
  }

  async getCategories(payload: PaginationRequest): Promise<PaginationResponse<Category>> {
    let { pageNumber, pageSize } = payload

    if (!pageNumber) pageNumber = 1
    if (!pageSize) pageSize = 10

    const skip = (Number(pageNumber) - 1) * Number(pageSize)
    const take = Number(pageSize)

    const categories = await this.#_prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take,
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
    })

    return {
      data: categories,
      total: categories.length,
      pageNumber: Number(pageNumber) || 1,
      pageSize: Number(pageSize) || 10,
    }
  }

  async getCategoryById(payload: GetCategoryByIdRequest): Promise<Category> {
    const category = await this.#_prisma.category.findUnique({
      where: { id: payload.id },
    })
    if (!category) {
      throw new NotFoundException('Category not found')
    }
    return category
  }

  async createCategory(payload: CreateCategoryRequest, image: Express.Multer.File): Promise<void> {
    const category = await this.#_prisma.category.findUnique({
      where: { slug: payload.slug },
    })
    if (category) {
      throw new BadRequestException('Category already exists')
    }

    let imageUrl = null
    if (image) {
      imageUrl = await this.#_minio.uploadFile('category', image)
    }

    await this.#_prisma.category.create({
      data: { ...payload, image: imageUrl },
    })
  }

  async updateCategory(payload: UpdateCategoryRequest): Promise<Category> {
    return this.#_prisma.category.update({
      where: { id: payload.id },
      data: payload,
    })
  }
}
