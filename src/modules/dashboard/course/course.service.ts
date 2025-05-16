import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import {
  CreateCourseRequest,
  GetCourseResponse,
  UpdateCourseRequest,
} from "./interfaces";
import { MinioService } from "@clients";

@Injectable()
export class CourseService {
  readonly #_prisma: PrismaService;
  readonly #_minio: MinioService;
  constructor(prisma: PrismaService, minio: MinioService) {
    this.#_prisma = prisma;
    this.#_minio = minio;
  }

  async createCourse(
    data: CreateCourseRequest,
    image: Express.Multer.File,
  ): Promise<void> {
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

  async updateCourse(
    id: string,
    data: UpdateCourseRequest,
    image: Express.Multer.File | undefined,
  ): Promise<void> {
    const existingCourse = await this.#_prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new BadRequestException("Course not found");
    }

    let imageUrl: string | undefined;
    if (image) {
      if (existingCourse.image) {
        await this.#_minio.deleteFile("course", existingCourse.image);
      }

      imageUrl = await this.#_minio.uploadFile("course", image);
      data.thumbnail = imageUrl;
    }

    await this.#_prisma.course
      .update({
        where: { id },
        data: {
          title: data.title ? data.title : existingCourse.title,
          slug: data.slug ? data.slug : existingCourse.slug,
          desc: data.desc ? data.desc : existingCourse.desc,
          price: data.price ? Number(data.price) : existingCourse.price,
          thumbnail: data.thumbnail ? data.thumbnail : existingCourse.thumbnail,
          isPublished: data.isPublished
            ? Boolean(data.isPublished)
            : existingCourse.isPublished,
          image: imageUrl ? imageUrl : existingCourse.image,
          author: {
            connect: {
              id: data.authorId ? data.authorId : existingCourse.authorId,
            },
          },
          category: {
            connect: {
              id: data.categoryId ? data.categoryId : existingCourse.categoryId,
            },
          },
        },
      })
      .catch(() => {
        throw new BadRequestException("Failed to update course");
      });
  }

  async deleteCourse(id: string): Promise<void> {
    const existingCourse = await this.#_prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new BadRequestException("Course not found");
    }

    if (existingCourse.image) {
      await this.#_minio
        .deleteFile("course", existingCourse.image)
        .catch(() => {
          throw new BadRequestException("Failed to delete image");
        });
    }

    await this.#_prisma.course
      .delete({
        where: { id },
      })
      .catch(() => {
        throw new BadRequestException("Failed to delete course");
      });
  }
}
