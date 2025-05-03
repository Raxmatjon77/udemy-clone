import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@prisma";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  GetCategoryByIdRequest,
  Category,
} from "./interfaces";
@Injectable()
export class CategoryService {
  readonly #_prisma: PrismaService;
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  async getCategories(): Promise<Category[]> {
    return this.#_prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getCategoryById(payload: GetCategoryByIdRequest): Promise<Category> {
    return this.#_prisma.category.findUnique({ where: { id: payload.id } });
  }

  async createCategory(payload: CreateCategoryRequest): Promise<void> {
    const category = await this.#_prisma.category.findUnique({
      where: { slug: payload.slug },
    });
    if (category) {
      throw new BadRequestException("Category already exists");
    }
    await this.#_prisma.category.create({ data: payload });
  }

  async updateCategory(payload: UpdateCategoryRequest): Promise<Category> {
    return this.#_prisma.category.update({
      where: { id: payload.id },
      data: payload,
    });
  }
}
