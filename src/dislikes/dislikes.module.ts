import { Module } from '@nestjs/common';
import { DislikesService } from './dislikes.service';
import { DislikesController } from './dislikes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dislikes } from './models/dislikes.model';
import { User } from '../user/models/user.model';
import { Messages } from '../messages/models/messages.model';

@Module({
  imports: [SequelizeModule.forFeature([Dislikes, User, Messages])],
  controllers: [DislikesController],
  providers: [DislikesService],
})
export class DislikesModule {}
