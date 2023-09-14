import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JobsDto {
  @ApiProperty({
    example: 'Hoca',
    description: 'The name of the Company',
  })
  @IsNotEmpty()
  @IsString()
  company: string; 

  @ApiProperty({
    example: '300$',
    description: 'The salary of the job',
  })
  @IsNotEmpty()
  @IsString()
  salary: string;

  @ApiProperty({
    example: 'Visa',
    description: 'The visa of the job',
  })
  @IsNotEmpty()
  @IsString()
  visa: string;
}
