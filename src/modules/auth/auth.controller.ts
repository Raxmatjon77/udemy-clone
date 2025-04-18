import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Req,
  HttpStatus,
  Inject,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSigninDto, UserSignupDto } from './dto';
import { Tokens } from './types';
import { UserSigninResponse, UserSignupResponse } from './interface';
// import { RequestWithUser } from './types/express-request.interface'
// import { VerivyUserInterceptor } from 'src/common/interceptors/verify-user.interceptor'

@Injectable()
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  SignUp(@Body() dto: UserSignupDto): Promise<UserSignupResponse> {
    console.log('dto: ', dto);
    return this.authService.SignUp(dto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  SignIn(@Body() dto: UserSigninDto): Promise<UserSigninResponse> {
    return this.authService.SignIn(dto);
  }

  // @Post('logout')
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.NO_CONTENT)
  // logout(@Req() req: RequestWithUser) {
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
