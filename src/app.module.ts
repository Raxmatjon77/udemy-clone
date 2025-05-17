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
  VideoModule,
  HealthModule,
} from "@modules";

@Module({
  imports: [
    VideoModule,
    PrismaModule,
    AuthModule,
    UserModule,
    ConstructorModule,
    DashboardModule,
    CourseModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
