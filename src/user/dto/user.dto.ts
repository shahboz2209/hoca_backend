/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: 'I am a full stack developer',
    description: 'The description of the user',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'The address of the user',
  }) 
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: '03/23/2006',
    description: 'The birth date of the user',
  })
  @IsNotEmpty()
  @IsDate()
  birth_date: Date;

  @ApiProperty({
    example: 'false',
    description: 'The isAlien of the user',
  })
  @IsNotEmpty()
  @IsBoolean()
  isAlien: boolean;

  @ApiProperty({
    example: 'john@gmail.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Mail',
    description: 'The gender of the user',
  })
  @IsNotEmpty()
  @IsString()
  gender: string;
}
