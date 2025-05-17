import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { GetCourseResponse } from "./interfaces";
import { MinioService } from "@clients";

@Injectable()
export class CourseService {
  readonly #_prisma: PrismaService;
  readonly #_minio: MinioService;
  constructor(prisma: PrismaService, minio: MinioService) {
    this.#_prisma = prisma;
    this.#_minio = minio;
  }

  async getCourse(id: string): Promise<GetCourseResponse> {
    const course = await this.#_prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        desc: true,
        price: true,
        thumbnail: true,
        isPublished: true,
        image: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        sections: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!course) {
      throw new BadRequestException("Course not found");
    }

    return course;
  }

  async getCourses(): Promise<GetCourseResponse[]> {
    const courses = await this.#_prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        desc: true,
        price: true,
        thumbnail: true,
        isPublished: true,
        image: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        sections: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return courses;
  }

}
