/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { Max, Min } from 'sequelize-typescript';

export class UpdateStudentDto {
  @ApiProperty({
    example: 'John',
    description: 'The username of the student',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    example: 'john1234',
    description: 'The password of the student',
  })
  @IsString()
  password?: string;

  @ApiProperty({
    example: '01/01/2023',
    description: 'The start date of the student',
  })
  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    example: '123',
    description: 'The id of the student',
  })
  @IsNotEmpty()
  @IsNumber()
  student_id: number;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The group id of the student',
  })
  @IsNotEmpty()
  @IsString()
  group_id: string; 
}
