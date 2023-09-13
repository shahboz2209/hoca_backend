/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Student } from './models/student.model';
import { Otp } from 'src/admin/models/otp.model';
import { Group } from 'src/groups/models/groups.model';
import { JwtModule } from '@nestjs/jwt';
import { Answer } from '../answers/models/answers.model';
@Module({
  imports: [
    SequelizeModule.forFeature([Student, Answer, Otp]),
    JwtModule.register({}),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
