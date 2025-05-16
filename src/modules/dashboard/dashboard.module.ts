import { Module } from "@nestjs/common";
import { CategoryService } from "./category/category.service";
import { PrismaModule } from "@prisma";
import { CategoryController } from "./category";
import { MinioModule } from "@clients";
@Module({
  providers: [CategoryService],
  imports: [PrismaModule, MinioModule],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class DashboardModule {}
