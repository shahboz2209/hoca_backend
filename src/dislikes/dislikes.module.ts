import { Module } from '@nestjs/common';
import { DislikesService } from './dislikes.service';
import { DislikesController } from './dislikes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dislikes } from './models/dislikes.model';

@Module({
  imports: [SequelizeModule.forFeature([Dislikes])],
  controllers: [DislikesController],
  providers: [DislikesService],
})
export class DislikesModule {}
