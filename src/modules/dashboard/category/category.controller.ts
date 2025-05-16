import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./interfaces";
import { CreateCategoryDto, UpdateCategoryDto } from "./dtos";
import { Roles } from "@decorators";
import { Role } from "@enums";
import { JwtGuard, RolesGuard } from "@guards";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("category")
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CategoryController {
  readonly #_service: CategoryService;
  constructor(service: CategoryService) {
    this.#_service = service;
  }

  @Get()
  async getCategories(): Promise<Category[]> {
    return this.#_service.getCategories();
  }

  @Get(":id")
  async getCategoryById(@Param("id") id: string): Promise<Category> {
    return this.#_service.getCategoryById({ id });
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async createCategory(
    @UploadedFile() image: Express.Multer.File,
    @Body() payload: CreateCategoryDto
  ): Promise<void> {
    return this.#_service.createCategory(payload, image);
  }

  @Patch(":id")
  async updateCategory(
    @Param("id") id: string,
    @Body() payload: UpdateCategoryDto
  ): Promise<Category> {
    return this.#_service.updateCategory({ id, ...payload });
  }
}
