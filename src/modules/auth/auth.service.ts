import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Tokens } from "./types/";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import {
  UserLogoutInterface,
  UserRefreshRequestInterface,
  UserSigninRequest,
  UserSigninResponse,
  UserSignupRequest,
  UserSignupResponse,
} from "./interface";
import { hash, compare } from "src/helpers";

@Injectable()
export class AuthService {
  readonly #_prisma: PrismaService;
  readonly #_jwt: JwtService;
  readonly #_cashe: Cache;
  constructor(
    @Inject("CACHE_MANAGER") cashe: Cache,
    prisma: PrismaService,
    jwt: JwtService,
  ) {
    this.#_prisma = prisma;
    this.#_jwt = jwt;
    this.#_cashe = cashe;
  }

  async signUp(dto: UserSignupRequest): Promise<UserSignupResponse> {
    const existuser = await this.#_prisma.user.findUnique({
      where: {
        email: dto.email,
        deletedAt: null,
      },
    });

    console.log("existuser: ", existuser);

    if (existuser) {
      throw new BadRequestException("User with this email is already exist !");
    }

    const hashedPassword = await hash(dto.password);
    const newUser = await this.#_prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        name: dto.name,
      },
    });

    console.log("new user", newUser);

    const tokens = await this.#_getTokens(newUser.id, newUser.email);
    await this.#_createRtHash(newUser.id, tokens.refresh_token);

    return {
      id: newUser.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async signIn(dto: UserSigninRequest): Promise<UserSigninResponse> {
    const user = await this.#_prisma.user.findUnique({
      where: {
        email: dto.email,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        password: true,
        refreshTokens: true,
      },
    });

    if (!user) throw new NotFoundException("User Not found !");

    console.log(user);

    const passwordMatches = await compare(dto.password, user.password);

    console.log("compare ", passwordMatches);

    if (!passwordMatches) {
      throw new ForbiddenException("Access denied !");
    }

    const tokens = await this.#_getTokens(user.id, user.email);
    await this.#_updateRtHash(user.refreshTokens[0].id, tokens.refresh_token);

    return {
      id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async refresh(payload: UserRefreshRequestInterface): Promise<Tokens> {
    const user = await this.#_prisma.user.findUnique({
      where: {
        id: payload.userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        refreshTokens: true,
      },
    });

    if (!user) throw new NotFoundException("User not Found !");
    if (!user.refreshTokens || !user.refreshTokens[0].token)
      throw new ForbiddenException("You are not logged in !");

    const rtMatches = await compare(
      payload.refresh_token,
      user.refreshTokens[0].token,
    );

    if (!rtMatches)
      throw new ForbiddenException("Access denied - Invalid refresh token!");
    const tokens = await this.#_getTokens(user.id, user.email);
    await this.#_updateRtHash(user.refreshTokens[0].id, tokens.refresh_token);

    return tokens;
  }

  async logout(payload: UserLogoutInterface): Promise<void> {
    const user = await this.#_prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        refreshTokens: true,
      },
    });

    const refreshToken = user.refreshTokens[0];
    if (!user.refreshTokens[0].token)
      throw new ForbiddenException("Already logged out !");

    await this.#_prisma.refreshToken.update({
      where: {
        id: refreshToken.id,
      },
      data: {
        token: null,
      },
    });

    return null;
  }

  async getUser(token: string) {
    const decoded = this.#_jwt.verify(token, {
      secret: process.env.JWT_AT_SECRET,
    });

    console.log("decoded: ", decoded);

    const user = await this.#_prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });
    if (!user) throw new NotFoundException("User not found !");
    return user;
  }

  async #_getTokens(UserId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.#_jwt.signAsync(
        {
          sub: UserId,
          email,
          type: "access",
        },
        {
          expiresIn: "3000s",
          secret: process.env.JWT_AT_SECRET,
        },
      ),
      this.#_jwt.signAsync(
        {
          sub: UserId,
          email,
          type: "refresh",
        },
        {
          expiresIn: 7,
          secret: process.env.JWT_RT_SECRET,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async #_updateRtHash(id: string, rt: string) {
    console.log("rt: ", rt);
    const updatedRt = await hash(rt);
    console.log("updatedRt: ", updatedRt);

    await this.#_prisma.refreshToken.update({
      where: { id },
      data: {
        token: updatedRt,
      },
    });
  }

  async #_createRtHash(userId: string, rt: string) {
    const hashedRt = await hash(rt);

    await this.#_prisma.refreshToken.create({
      data: {
        token: hashedRt,
        userId: userId,
      },
    });
  }
}
