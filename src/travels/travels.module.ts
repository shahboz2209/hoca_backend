import { Module } from '@nestjs/common';
import { TravelsService } from './travels.service';
import { TravelsController } from './travels.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Travels } from './models/travels.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([Travels]), FilesModule],
  controllers: [TravelsController],
  providers: [TravelsService],
})
export class TravelsModule {}
