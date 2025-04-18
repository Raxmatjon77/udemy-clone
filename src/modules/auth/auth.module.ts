import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
// import { RtStrategy } from './strategies/rt'
// import { AtStrategy } from './strategies/at'
import { JwtModule } from '@nestjs/jwt'
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-ioredis'

@Module({
  imports: [JwtModule.register({}),    CacheModule.registerAsync({
        useFactory: async () => ({
          store: redisStore,
          host: 'localhost',
          port: 6379,
          ttl: 60, // seconds
        }),
      }),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
