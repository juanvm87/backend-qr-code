import { Module } from '@nestjs/common';
import { QrModule } from './qr/qr.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { UserModule } from './user/user.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [
    StatisticModule,
    QrModule,
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
