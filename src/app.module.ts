/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { SalesmanModule } from './salesman/salesman.module';
import { SocialNetworkModule } from './social-network/social-network.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ImageModule } from './image/image.module';
import { ClientModule } from './client/client.module';
import { SoldProductModule } from './sold-product/sold-product.module';
import { JwtModule } from '@nestjs/jwt';
import { StudentModule } from './student/student.module';
import { TestModule } from './tests/tests.module';

// import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { BOT_NAME } from './app.constants';
import { Bot } from './bot/models/bot.model';
import { GroupModule } from './groups/groups.module';
import { AnswerModule } from './answers/answers.module';

@Module({
  imports: [
    // TelegrafModule.forRootAsync({
    //   botName: BOT_NAME,
    //   useFactory: () => ({
    //     token: process.env.BOT_TOKEN,
    //     middlewares: [],
    //     includes: [BotModule],
    //   }),
    // }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: String(process.env.PG_PASS),
      database: process.env.PG_DB,
      autoLoadModels: true,
      models: [],
      logging: true,
    }),
    JwtModule.register({ global: true }),
    AdminModule,
    SalesmanModule,
    SocialNetworkModule,
    StudentModule,
    CategoryModule,
    ProductModule,
    ImageModule,
    ClientModule,
    SoldProductModule,
    TestModule,
    // BotModule,
    GroupModule,
    AnswerModule,
  ],
})
export class AppModule {}
