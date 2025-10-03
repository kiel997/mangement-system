/* eslint-disable prettier/prettier */
import { 
  IsEmail, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  Matches, 
  MaxLength, 
  MinLength 
} from "class-validator";
import { role as Role } from '../../enum/role.enum'; // 👈 import your enum

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsEmail({}, { message: 'Invalid email format' })
    @Matches(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, { 
      message: 'Email domain must be valid and cannot end with multiple ".com"' 
    })
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8, {message: `Sorry you must put in 8 characters`})
    @MaxLength(16, {message: `Password should not be more than 16 characters`})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z]).{8,}$/, { 
      message: `Password must contain at least one uppercase, one number, and one special character` 
    })
    password: string;

    @IsOptional()
    role: Role
}
