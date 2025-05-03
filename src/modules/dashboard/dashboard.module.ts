import { Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { PrismaModule } from "@prisma";
import { CategoryController } from "./category.controller";
@Module({
  providers: [CategoryService],
  imports: [PrismaModule],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class DashboardModule {}
