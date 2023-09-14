import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Comments } from './models/comments.model';

@Module({
  imports: [SequelizeModule.forFeature([Comments])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
