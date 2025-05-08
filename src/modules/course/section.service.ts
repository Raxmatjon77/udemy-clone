import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
@Injectable()
export class SectionService {
  readonly #_prisma: PrismaService;
  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }
}
