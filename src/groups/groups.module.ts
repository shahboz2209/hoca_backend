import { Module } from '@nestjs/common';
import { GroupService } from './groups.service';
import { GroupController } from './groups.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './models/groups.model';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '../tests/models/tests.model';
import { Student } from '../student/models/student.model';
@Module({
  imports: [SequelizeModule.forFeature([Group, Test, Student]), JwtModule.register({})],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
