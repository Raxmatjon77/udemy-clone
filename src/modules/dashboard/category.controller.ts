import { Controller, Get, Param, Post, Body, Put, Patch  } from '@nestjs/common';
import { Category } from '@prisma/client';
import { CategoryService } from './category.service';
import { CreateCategoryRequest, UpdateCategoryRequest } from './interfaces';

@Controller('category')
export class CategoryController {
    readonly #_service: CategoryService;
    constructor(service: CategoryService) {
        this.#_service = service;
    }

    @Get()
    async getCategories(): Promise<Category[]> {
        return this.#_service.getCategories();
    }

    @Get(':id')
    async getCategoryById(@Param('id') id: string): Promise<Category> {
        return this.#_service.getCategoryById({ id });
    }

    @Post()
    async createCategory(@Body() payload: CreateCategoryRequest): Promise<Category> {
        return this.#_service.createCategory(payload);
    }

    @Patch(':id')
    async updateCategory(@Param('id') id: string, @Body() payload: UpdateCategoryRequest): Promise<Category> {
        return this.#_service.updateCategory({ id, ...payload });
    }

}
