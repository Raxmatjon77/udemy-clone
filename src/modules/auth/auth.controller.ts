import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserSigninDto, UserSignupDto } from "./dto";
import { UserSigninResponse, UserSignupResponse } from "./interface";

@Injectable()
@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  readonly #_service: AuthService;
  constructor(service: AuthService) {
    this.#_service = service;
  }

  @Post("/signup")
  @HttpCode(HttpStatus.CREATED)
  SignUp(@Body() dto: UserSignupDto): Promise<UserSignupResponse> {
    console.log("dto: ", dto);
    return this.#_service.SignUp(dto);
  }

  @Post("/signin")
  @HttpCode(HttpStatus.OK)
  SignIn(@Body() dto: UserSigninDto): Promise<UserSigninResponse> {
    return this.#_service.SignIn(dto);
  }

  // @Post('logout')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // logout() {
  //   console.log('user', req.user);
  //   const userId = req.user.sub;
  //   return this.authService.logout(userId);
  // }

  // @Post('refresh')
  // @UseInterceptors(VerivyUserInterceptor)
  // @HttpCode(HttpStatus.OK)
  // refresh(
  //   @Req() req: RequestWithUser,
  //   @Body() payload: { Rtoken: string },
  // ): Promise<Tokens> {
  //   const userId = req.body.userId;
  //   const rt = payload.Rtoken;
  //   return this.authService.refresh(userId, rt);
  // }
}
