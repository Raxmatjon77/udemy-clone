import {
  Controller,
  Get,
  Body,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
  Delete,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRetreiveByIdResponseInterface } from "@modules/auth/interface";
import { JwtGuard } from "@guards";
import { UserUpdateDto } from "./dtos";
import { CustomUser } from "@modules/common";
import { VerivyUserInterceptor } from "@interceptors";

@Controller("user")
@UseInterceptors(VerivyUserInterceptor)
export class UserController {
  readonly #_service: UserService;
  constructor(service: UserService) {
    this.#_service = service;
  }

  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  getUser(@Req() req: CustomUser): Promise<UserRetreiveByIdResponseInterface> {
    return this.#_service.getUserById({ id: req.user.id });
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch()
  updateUser(
    @Body() payload: UserUpdateDto,
    @Req() req: CustomUser,
  ): Promise<void> {
    return this.#_service.updateUser({ id: req.user.id, ...payload });
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteUser(@Req() req: CustomUser): Promise<void> {
    return await this.#_service.deleteUser({ id: req.user.id });
  }
}
