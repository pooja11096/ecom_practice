// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class UpdateUserDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email:string

    // @IsString()
    @IsNotEmpty()
    roleId: number;

    password: string;

    
    

}

