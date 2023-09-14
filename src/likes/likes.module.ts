import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Likes } from './models/likes.model';

@Module({
  imports: [SequelizeModule.forFeature([Likes])],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
