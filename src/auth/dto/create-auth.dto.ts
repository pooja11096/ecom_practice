import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string

    @IsNotEmpty()
    @IsString()
    @Length(3,20, { message: 'Password has to be at between 3 and 20 chars'})
    password: string

    roleId: number

    role: string
    

}