import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from './models/messages.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([Messages]), FilesModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
