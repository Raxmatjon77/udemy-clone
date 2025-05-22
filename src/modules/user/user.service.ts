import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { Cache } from 'cache-manager'
import { UserRetreiveByIdRequestInterface, UserRetreiveByIdResponseInterface, UserUpdateInterface } from './interfaces'

@Injectable()
export class UserService {
  readonly #_prisma: PrismaService
  readonly #_jwt: JwtService
  readonly #_cashe: Cache
  constructor(@Inject('CACHE_MANAGER') cashe: Cache, prisma: PrismaService, jwt: JwtService) {
    this.#_prisma = prisma
    this.#_jwt = jwt
    this.#_cashe = cashe
  }

  async getUserById(payload: UserRetreiveByIdRequestInterface): Promise<UserRetreiveByIdResponseInterface> {
    const cachedUser: UserRetreiveByIdResponseInterface = await this.#_cashe.get(payload.id)

    if (cachedUser) {
      console.log('cachedUser', cachedUser)
      return cachedUser
    }

    const user = await this.#_prisma.user.findUnique({
      where: { id: payload.id, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) throw new NotFoundException('User not found !')

    await this.#_cashe.set(payload.id, user)

    return user
  }

  async updateUser(payload: UserUpdateInterface): Promise<void> {
    const user = await this.#_prisma.user
      .findUnique({
        where: { id: payload.id, deletedAt: null },
      })
      .catch((err) => {
        console.log(err)
      })

    if (!user) throw new NotFoundException('User not found !')

    await this.#_prisma.user.update({
      where: { id: payload.id },
      data: {
        email: payload.email ? payload.email : user.email,
        name: payload.name ? payload.name : user.name,
      },
    })
  }

  async deleteUser(payload: { id: string }): Promise<void> {
    const user = await this.#_prisma.user.findUnique({
      where: { id: payload.id, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        deletedAt: true,
      },
    })

    if (!user) throw new NotFoundException('User not found !')

    console.log(user)
    //   await this.#_prisma.user.update({
    //     where: { id: payload.id },
    //     data: { deletedAt: new Date() },
    //   });
    // }

    // async getUserByEmail(payload: { email: string }): Promise<UserRetreiveByIdResponseInterface> {
    //   const user = await this.#_prisma.user.findUnique({
    //     where: { email: payload.email, deletedAt: null },
    //   });
  }
}
