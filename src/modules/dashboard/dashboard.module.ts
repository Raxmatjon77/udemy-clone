import { Module } from '@nestjs/common'
import { PrismaModule } from '@prisma'
import { CategoryController, CategoryService } from './category'
import { MinioModule } from '@clients'
import { CourseController, CourseService } from './course'

@Module({
  providers: [CategoryService, CourseService],
  imports: [PrismaModule, MinioModule],
  exports: [CategoryService, CourseService],
  controllers: [CategoryController, CourseController],
})
export class DashboardModule {}
