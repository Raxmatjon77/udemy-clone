import { Controller, Get, Query, Param } from "@nestjs/common";
import { SectionService } from "./section.service";
import { GetSectionResponse } from "./interfaces";
import { PaginationResponse } from "@modules";
@Controller("sections")
export class SectionController {
  readonly #service: SectionService;
  constructor(service: SectionService) {
    this.#service = service;
  }

  @Get()
  async getSections(
    @Query("courseId") courseId: string,
    @Query("pageNumber") pageNumber: number,
    @Query("pageSize") pageSize: number,
  ): Promise<PaginationResponse<GetSectionResponse>> {
    return this.#service.getSections({ courseId, pageNumber, pageSize });
  }

  @Get(":id")
  async getSection(@Param("id") id: string) {
    return this.#service.getSection(id);
  }
}
