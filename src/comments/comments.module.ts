import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comments } from './models/comments.model';
import { User } from '../user/models/user.model';
import { Messages } from '../messages/models/messages.model';

@Module({
  imports: [SequelizeModule.forFeature([Comments, User, Messages])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
