/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { TodolistModule } from './todolist/todolist.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
  {
    ttl: 10000,   
    limit: 2, 
  },
]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: configService.getOrThrow<number>('DB_PORT'),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    DatabaseModule,
    UserModule,
    TodolistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // 👈 apply globally
    },
  ],
})
export class AppModule  implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthMiddleware).forRoutes('/auth', '/');
    consumer
    .apply(AuthMiddleware)
    .exclude('/user')
    .forRoutes({path: 'User', method: RequestMethod.GET})
  }
}
