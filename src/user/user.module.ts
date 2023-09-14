/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Otp } from 'src/admin/models/otp.model';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Otp]), FilesModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
