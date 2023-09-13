import { Module } from '@nestjs/common';
import { TestService } from './tests.service';
import { TestController } from './tests.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test } from './models/tests.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Test]), JwtModule.register({})],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
