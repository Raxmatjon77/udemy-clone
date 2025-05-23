import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from '@prisma'
import {
  AuthModule,
  UserModule,
  ConstructorModule,
  CourseModule,
  DashboardModule,
  VideoModule,
  HealthModule,
  JobsModule,
  EnrollMentModule,
} from '@modules'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express'
import { BullModule } from '@nestjs/bullmq'

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
    EnrollMentModule,
    JobsModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
