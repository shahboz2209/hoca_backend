import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GroupDto {
  @ApiProperty({
    example: 'A1',
    description: 'Name of the group',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '8-class',
    description: 'Description of the group',
  })
  @IsString()
  description: string;
}
