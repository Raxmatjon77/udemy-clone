import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-ioredis'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategies'

@Module({
  imports: [
    JwtModule.register({}),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: 'localhost',
        port: 6379,
        ttl: 60, // seconds
      }),
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
