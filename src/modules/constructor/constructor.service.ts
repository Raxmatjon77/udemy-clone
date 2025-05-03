import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";

@Injectable()
export class ConstructorService {
  readonly #_prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.#_prisma = prisma;
  }

  //   async createConstructor(payload: ConstructorCreateInterface): Promise<void> {
  //     const constructor = await this.#_prisma.constructor.create({
  //       data: payload,
  //     });
  //   }
}
