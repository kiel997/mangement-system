import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
;
dotenv.config()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      // envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.getOrThrow<string>('DB_HOST'),
        port: ConfigService.getOrThrow<number>('DB_PORT'),
        username: ConfigService.getOrThrow<string>('DB_USERNAME'),
        password: ConfigService.getOrThrow<string>('DB_PASSWORD'),
        database: ConfigService.getOrThrow<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize:true
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    // you can delete from here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
