/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { role as Role } from '../../enum/role.enum'; // 👈 import your enum

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8, {message: `Sorry you must put in 8 characters`})
    @MaxLength(16, {message: `password should not be more than 16 characters`})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z]).{8,}$/, {message: `password must contain at least One Uppercase, one number and one special key`})
    password: string;

    @IsOptional()
    role: Role
}
