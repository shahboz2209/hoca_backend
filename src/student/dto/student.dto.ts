/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class StudentDto {
  @ApiProperty({
    example: 'Will Smith',
    description: 'The full name of the student',
  })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({
    example: '+998991234567',
    description: 'The phone number of the student',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'Tashkent',
    description: 'The address of the student',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: 'https://picsum.photos/id/128/200/300',
    description: 'The image url of the student',
  })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({
    example: 'will@gmail.com',
    description: 'The email of the student',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
