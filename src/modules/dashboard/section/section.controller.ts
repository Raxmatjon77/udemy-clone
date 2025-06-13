import { Controller, Post, Body, Get, Query, Param, Delete, Patch } from '@nestjs/common'
import { SectionService } from './section.service'
import { SectionCreateDto, SectionUpdateDto } from './dtos'

@Controller('sections')
export class SectionController {
  readonly #service: SectionService
  constructor(service: SectionService) {
    this.#service = service
  }

  @Post()
  async createSection(@Body() data: SectionCreateDto) {
    return this.#service.createSection(data)
  }

  @Get()
  async getSections(@Query('courseId') courseId: string) {
    return this.#service.getSections(courseId)
  }

  @Get(':id')
  async getSection(@Param('id') id: string) {
    return this.#service.getSection(id)
  }

  @Patch(':id')
  async updateSection(@Param('id') id: string, @Body() data: SectionUpdateDto) {
    return this.#service.updateSection(id, data)
  }

  @Delete(':id')
  async deleteSection(@Param('id') id: string) {
    return this.#service.deleteSection(id)
  }
}
