import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class TestDto {
  @ApiProperty({
    example: 'Arguments',
    description: 'Title of the test',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '30',
    description: 'Count of the test',
  })
  @IsNotEmpty()
  @IsNumber()
  test_count: number;

  @ApiProperty({
    example: '60',
    description: 'minimum ball of the test',
  })
  @IsNotEmpty()
  @IsNumber()
  min_ball: number;

  @ApiProperty({
    example: '08/28/2023 14:00',
    description: 'Start time of the test',
  })
  @IsNotEmpty()
  @IsDateString()
  start_time: Date;

  @ApiProperty({
    example: '08/28/2023 17:00',
    description: 'End time of the test',
  })
  @IsDateString()
  end_time: Date;

  @ApiProperty({
    example: 'false',
    description: 'IsTime of the test',
  })
  @IsBoolean()
  is_time: boolean;

  @ApiProperty({
    example: 'false',
    description: 'IsMessage of the test',
  })
  @IsBoolean()
  is_message: boolean;

  @ApiProperty({
    example: 'ABCD',
    description: 'Variants of the test',
  })
  @IsString()
  variants: string;

  @ApiProperty({
    example: 'ABCDBDCA',
    description: 'Answers of the test',
  })
  @IsString()
  answers: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'The group id of the student',
  })
  @IsNotEmpty()
  @IsString()
  group_id: string;
}
