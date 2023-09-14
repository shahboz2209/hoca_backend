import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TravelsDto {
  @ApiProperty({
    example: '03/23/2006',
    description: 'The departure_date of the travel',
  })
  @IsNotEmpty()
  @IsDate()
  departure_date: Date; 

  @ApiProperty({
    example: '03/23/2006',
    description: 'The departure_date of the travel',
  })
  @IsNotEmpty()
  @IsDate()
  arrival_date: Date;

  @ApiProperty({
    example: 'Mars',
    description: 'The destinations of the travel',
  })
  @IsNotEmpty()
  @IsString()
  destinations: string;

  @ApiProperty({
    example: '412510a6-733b-49f4-aa09-3ffddd1f9de1',
    description: 'The cost of the travel',
  })
  @IsNotEmpty()
  @IsNumber()
  cost: number;
}
