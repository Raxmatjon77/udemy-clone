// src/auth/strategies/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserPayload } from "../interface";
import { PrismaService } from "@prisma";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_AT_SECRET,
    });
  }

  async validate(payload: UserPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    return {
      id: payload.sub,
      email: payload.email,
      role: user.role,
    };
  }
}
