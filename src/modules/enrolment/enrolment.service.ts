import { Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { MinioService } from '@clients'
// import { PaginationRequest, PaginationResponse } from '@modules/common'

@Injectable()
export class CourseService {
  readonly #_prisma: PrismaService
  readonly #_minio: MinioService
  constructor(prisma: PrismaService, minio: MinioService) {
    this.#_prisma = prisma
    this.#_minio = minio
  }
}
