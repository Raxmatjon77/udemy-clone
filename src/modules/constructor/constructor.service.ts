import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";

@Injectable()
export class ConstructorService {
  readonly #_prisma: PrismaService;
  readonly #_cashe: Cache;
  constructor(@Inject("CACHE_MANAGER") cashe: Cache, prisma: PrismaService) {
    this.#_prisma = prisma;
    this.#_cashe = cashe;
  }

  //   async createConstructor(payload: ConstructorCreateInterface): Promise<void> {
  //     const constructor = await this.#_prisma.constructor.create({
  //       data: payload,
  //     });
  //   }
}
