import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QrSchema } from './qr.model';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    //TODO check if is ok add PassportModule.. here too.
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    MongooseModule.forFeature([{ name: 'Qr', schema: QrSchema }]),
  ],
  controllers: [QrController],
  providers: [QrService],
})
export class QrModule {}
