import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "@prisma";
import { AuthModule, UserModule, ConstructorModule } from "@modules";
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CategoryController } from './modules/dashboard/category.controller';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ConstructorModule, DashboardModule],
  controllers: [AppController, CategoryController],
  providers: [AppService],
})
export class AppModule {}
