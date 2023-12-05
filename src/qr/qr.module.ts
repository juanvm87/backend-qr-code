import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QrSchema } from './qr.schema';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { StatisticModel } from 'src/statistic/statistic.schema';

@Module({
  imports: [
    //TODO check if is ok add PassportModule.. here too.
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    MongooseModule.forFeature([
      { name: 'Qr', schema: QrSchema },
      { name: 'Statistic', schema: StatisticModel },
    ]),
  ],
  controllers: [QrController],
  providers: [QrService],
})
export class QrModule {}
