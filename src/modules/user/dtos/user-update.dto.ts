import { IsString, IsEmail } from "class-validator";
import { UserUpdateInterface } from "../interfaces";

export class UserUpdateDto implements Omit<UserUpdateInterface, "id"> {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
