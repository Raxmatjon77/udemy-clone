import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { Tokens } from "./types/";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";
import {
  UserSigninRequest,
  UserSigninResponse,
  UserSignupRequest,
  UserSignupResponse,
} from "./interface";

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

  async SignUp(dto: UserSignupRequest): Promise<UserSignupResponse> {
    const existuser = await this.#_prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    console.log("existuser: ", existuser);

    if (existuser) {
      throw new BadRequestException("User with this email is already exist !");
    }

    const hash = this.hashdata(dto.password);
    const newUser = await this.#_prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        role: dto.role,
        name: dto.name,
      },
    });

    console.log("new user", newUser);

    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.#_createRtHash(newUser.id, tokens.refresh_token);
    
    return {
      id: newUser.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async SignIn(dto: UserSigninRequest): Promise<UserSigninResponse> {
    const user = await this.#_prisma.user.findUnique({
      where: {
        email: dto.email,
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

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    console.log("compare ", passwordMatches);

    if (!passwordMatches) {
      throw new ForbiddenException("Access denied !");
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.refreshTokens[0].id, tokens.refresh_token);

    return {
      id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async refresh(userId: string, rt: string): Promise<Tokens> {
    const user = await this.#_prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        refreshTokens: true,
      },
    });

    if (!user) throw new NotFoundException("User not Found !");
    if (!user.refreshTokens)
      throw new ForbiddenException("You are not logged in !");

    const rtMatches = bcrypt.compare(rt, user.refreshTokens[0].token);
    if (!rtMatches) throw new ForbiddenException("access denied !");

    const tokens = await this.getTokens(userId, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string) {
    const user = await this.#_prisma.user.findUnique({
      where: {
        id: userId,
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
    //
    console.log("decoded: ", decoded);

    const user = await this.#_prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });
    if (!user) throw new NotFoundException("User not found !");
    return user;
  }

  hashdata(data: string): string {
    const hasheddata = bcrypt.hashSync(data, 10);
    return hasheddata;
  }

  async getTokens(UserId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.#_jwt.signAsync(
        {
          sub: UserId,
          email,
          type: "access",
        },
        {
          expiresIn: "3",
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

  async updateRtHash(id: string, rt: string) {
    const updatedRt = this.hashdata(rt);

    await this.#_prisma.refreshToken.update({
      where: { id },
      data: {
        token: updatedRt,
      },
    });
  }

  async #_createRtHash(userId: string, rt: string) {
    const hashedRt = this.hashdata(rt);

    await this.#_prisma.refreshToken.create({
      data: {
        token: hashedRt,
        userId: userId,
      },
    });
  }
}
