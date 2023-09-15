/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@nestjs/jwt';

// import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { JobsModule } from './jobs/jobs.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { diskStorage } from 'multer';
import { resolve } from 'path';
import { FilesModule } from './files/files.module';
import { LikesModule } from './likes/likes.module';
import { UserModule } from './user/user.module';
import { MessagesModule } from './messages/messages.module';
import { TravelsModule } from './travels/travels.module';
import { DislikesModule } from './dislikes/dislikes.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
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
    MulterModule.register({
      storage: diskStorage({
        destination: '/uploads',
        filename: (req, file, cb) => {
          const unique_suffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + unique_suffix);
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    JwtModule.register({ global: true }),
    UserModule,
    JobsModule,
    MessagesModule,
    TravelsModule,
    DislikesModule,
    CommentsModule,
    FilesModule,
  ],
})
export class AppModule {}
