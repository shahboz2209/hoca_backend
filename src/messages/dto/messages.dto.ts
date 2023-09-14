import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MessagesDto {
  @ApiProperty({
    example: 'About Hoca company',
    description: 'The title of the message',
  })
  @IsNotEmpty()
  @IsString()
  title: string; 

  @ApiProperty({
    example: 'The Hoca company is developing very fast!',
    description: 'The desciption of the message',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  // @ApiProperty({
  //   example: '412510a6-733b-49f4-aa09-3ffddd1f9de1',
  //   description: 'Id of the message\'s like',
  // })
  // @IsNotEmpty()
  // @IsString()
  // like_id: string;

  // @ApiProperty({
  //   example: '412510a6-733b-49f4-aa09-3ffddd1f9de1',
  //   description: 'Id of the message\'s dislike',
  // })
  // @IsNotEmpty()
  // @IsString()
  // dislike_id: string;

  // @ApiProperty({
  //   example: '412510a6-733b-49f4-aa09-3ffddd1f9de1',
  //   description: 'Id of the message\'s comment',
  // })
  // @IsNotEmpty()
  // @IsString()
  // comment_id: string;
}
