import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-ioredis";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({}),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore,
        host: "localhost",
        port: 6379,
        ttl: 5 * 1000,
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
