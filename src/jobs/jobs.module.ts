import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Jobs } from './models/jobs.model';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([Jobs]), FilesModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}