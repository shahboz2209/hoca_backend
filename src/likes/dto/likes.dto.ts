import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LikesDto {
  @ApiProperty({
    example: '1234',
    description: 'The likes of the users',
  })
  @IsNotEmpty()
  @IsNumber()
  likes: number; 

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'like\'s user id',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty({
    example: 'de53c13b-45as-4e0b-86b2-25ce4c5a2177',
    description: 'dislike\'s user id',
  })
  @IsNotEmpty()
  @IsString()
  message_id: string;
}
