import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import {
  UserRetreiveByIdRequestInterface,
  UserRetreiveByIdResponseInterface,
} from "./interfaces";

@Injectable()
export class UserService {
  readonly #_prisma: PrismaService;
  readonly #_jwt: JwtService;
  readonly #_cashe: Cache;
  constructor(
    @Inject("CACHE_MANAGER") cashe: Cache,
    prisma: PrismaService,
    jwt: JwtService,
  ) {
    this.#_prisma = prisma;
    this.#_jwt = jwt;
    this.#_cashe = cashe;
  }
  async getUserById(
    payload: UserRetreiveByIdRequestInterface,
  ): Promise<UserRetreiveByIdResponseInterface> {
    const user = await this.#_prisma.user.findUnique({
      where: { id: payload.id, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) throw new NotFoundException("User not found !");

    return user;
  }
}
