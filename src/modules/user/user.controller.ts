import { Controller, Get, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRetrieveByIdDto } from "@modules/auth/dto";
import { UserRetreiveByIdResponseInterface } from "@modules/auth/interface";

@Controller("user")
export class UserController {
  readonly #_service: UserService;
  constructor(service: UserService) {
    this.#_service = service;
  }

  @Get("user")
  getUser(
    @Body() payload: UserRetrieveByIdDto,
  ): Promise<UserRetreiveByIdResponseInterface> {
    return this.#_service.getUserById(payload);
  }
}
