import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AnswerDto {
  @ApiProperty({
    example: '18c4d9a15-f70b-46eb-8e0e-a122f2039556',
    description: 'student id',
  })
  @IsNotEmpty()
  @IsString()
  student_id: string;

  @ApiProperty({
    example: 'variants',
    description: 'Type of the answer',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    example: 'ABCDABCDABCD',
    description: 'Answers of the student',
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
