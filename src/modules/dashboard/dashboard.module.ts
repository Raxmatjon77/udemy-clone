import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { PrismaModule } from "@prisma";
import { CategoryController } from "./category.controller";
import { MinioModule } from "@modules";
@Module({
  providers: [CategoryService],
  imports: [PrismaModule, MinioModule],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class DashboardModule {}
