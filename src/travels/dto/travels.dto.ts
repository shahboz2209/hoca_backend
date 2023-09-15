import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TravelsDto {
  @ApiProperty({
    example: '03/23/2006',
    description: 'The departure_date of the travel',
  })
  @IsNotEmpty()
  @IsDateString()
  departure_date: Date; 

  @ApiProperty({
    example: '03/23/2006',
    description: 'The departure_date of the travel',
  })
  @IsNotEmpty()
  @IsDateString()
  arrival_date: Date;

  @ApiProperty({
    example: 'Mars',
    description: 'The destinations of the travel',
  })
  @IsNotEmpty()
  @IsString()
  destinations: string;

  @ApiProperty({
    example: '300$',
    description: 'The cost of the travel',
  })
  @IsNotEmpty()
  @IsString()
  cost: string;
}
