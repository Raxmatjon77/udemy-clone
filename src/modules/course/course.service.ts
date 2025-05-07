import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { CreateCourseRequest } from "./interfaces";
import { MinioService } from "@modules";

@Injectable()
export class CourseService {
  readonly #_prisma: PrismaService;
  readonly #_minio: MinioService;
  constructor(prisma: PrismaService, minio: MinioService) {
    this.#_prisma = prisma;
    this.#_minio = minio;
  }

  async createCourse(data: CreateCourseRequest, image: Express.Multer.File):Promise<void> {
    if (!image) {
      throw new BadRequestException("Image is required");
    }

    const existingCourse = await this.#_prisma.course.findUnique({
      where: {
        slug: data.slug,
      },
    });
    
    if (existingCourse) {
      throw new BadRequestException("Course already exists");
    }

    const imageUrl = await this.#_minio.uploadFile("course", image);

    await this.#_prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        desc: data.desc,
        price: Number(data.price),
        thumbnail: data.thumbnail,
        isPublished: Boolean(data.isPublished),
        image: imageUrl,
        author: {
          connect: {
            id: data.authorId,
          },
        },
        category: {
          connect: {
            id: data.categoryId,
          },
        },
      },
    });
  }

  
}
