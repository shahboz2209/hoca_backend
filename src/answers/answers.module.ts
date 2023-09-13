import { Module } from '@nestjs/common';
import { AnswerService } from './answers.service';
import { AnswerController } from './answers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Answer } from './models/answers.model';
import { JwtModule } from '@nestjs/jwt';
import { Student } from '../student/models/student.model';

@Module({
  imports: [SequelizeModule.forFeature([Answer]), JwtModule.register({})],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService],
})
export class AnswerModule {}
