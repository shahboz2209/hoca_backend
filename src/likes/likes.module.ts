import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Likes } from './models/likes.model';
import { User } from '../user/models/user.model';
import { Messages } from '../messages/models/messages.model';

@Module({
  imports: [SequelizeModule.forFeature([Likes, User, Messages])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
