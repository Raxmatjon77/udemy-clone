import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "@prisma";
import {
  AuthModule,
  UserModule,
  ConstructorModule,
  CourseModule,
  DashboardModule,
} from "@modules";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ConstructorModule,
    DashboardModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
