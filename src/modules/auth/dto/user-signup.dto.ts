import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
import { UserSignupRequest } from '../interface'
import { Role } from '@prisma/client'

export class UserSignupDto implements UserSignupRequest {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @Length(8)
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsEnum(Role)
  @IsString()
  role?: Role
}
