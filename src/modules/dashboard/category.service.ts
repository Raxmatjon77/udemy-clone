import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { Category } from '@prisma/client';
import { CreateCategoryRequest, UpdateCategoryRequest, GetCategoryByIdRequest } from './interfaces';
@Injectable()
export class CategoryService {
  readonly #_prisma: PrismaService;
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async getCategories(): Promise<Category[]> {
    return this.#_prisma.category.findMany();
  }

  async getCategoryById(payload: GetCategoryByIdRequest): Promise<Category> {
    return this.#_prisma.category.findUnique({ where: { id: payload.id } });
  }

  async createCategory(payload: CreateCategoryRequest): Promise<Category> {
    return this.#_prisma.category.create({ data: payload });
  }

  async updateCategory(payload: UpdateCategoryRequest): Promise<Category> {
    return this.#_prisma.category.update({ where: { id: payload.id }, data: payload });
  }
}
