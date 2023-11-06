import { Module } from '@nestjs/common';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { MongooseModule } from '@nestjs/mongoose';
import { QrSchema } from './qr.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Qr', schema: QrSchema }]),
  ],
  controllers: [QrController],
  providers: [QrService],
})
export class QrModule {}
