import { IsEnum, IsNotEmpty, IsOptional, IsString, Length  } from 'class-validator';
import { UserSigninRequest } from '../interface';
import {Role} from "@prisma/client";

export  class UserSigninDto implements UserSigninRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8)
  @IsNotEmpty()
  password: string;
}