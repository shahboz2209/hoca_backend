import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DislikesDto {
  @ApiProperty({
    example: '1234',
    description: 'The dislikes of the users',
  })
  @IsNotEmpty()
  @IsNumber()
  dislikes: number; 

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'dislike\'s user id',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'disdislike\'s user id',
  })
  @IsNotEmpty()
  @IsString()
  message_id: string;
}
