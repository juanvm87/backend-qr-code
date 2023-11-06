import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QrService } from './qr.service';
import { CreateQrDto } from '../dtos/createQrDto';
import { UpdateQrDto } from '../dtos/updateQrDto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Post()
  @UseGuards(AuthGuard())
  async addQr(@Body() createQrDto: CreateQrDto, @Req() req) {
    try {
      const generatedId = await this.qrService.insertQr(
        createQrDto.title,
        createQrDto.type,
        createQrDto.link,
        createQrDto.input,
        createQrDto.isDynamic,
        req.user.userId,
      );
      return generatedId;
    } catch (error) {
      throw error;
    }
  }

  @Get('owner')
  @UseGuards(AuthGuard())
  async getAllQrByOwnerId(@Req() req) {
    try {
      const qrArray = await this.qrService.getAllQrByOwner(req.user.userId);

      return qrArray;
    } catch (error) {
      throw error;
    }
  }

  @Get('id/:qrId')
  @UseGuards(AuthGuard())
  async getQr(@Param('qrId') qrId: string) {
    try {
      const qr = await this.qrService.getQr(qrId);

      return qr;
    } catch (error) {
      throw error;
    }
  }
  @Get('dynamic-id/:qrId')
  async getQrLink(@Param('qrId') qrId: string) {
    try {
      const qr = await this.qrService.getQr(qrId);
      const link = qr.link;
      console.log(link);
      return link;
    } catch (error) {
      throw error;
    }
  }

  @Patch(':qrId')
  @UseGuards(AuthGuard())
  async updateQr(
    @Param('qrId') qrId: string,
    @Body() updateQrDto: UpdateQrDto,
  ) {
    try {
      const updatedQr = await this.qrService.updateQr(qrId, updateQrDto);
      return updatedQr;
    } catch (error) {
      throw error;
    }
  }

  @Get('owner/:ownerId/pin/:pin')
  async QrByOwnerIdAndPin(
    @Param('ownerId') ownerId: string,
    @Param('pin') pin: number,
  ) {
    try {
      const qr = await this.qrService.findQrByOwnerIdAndPin(ownerId, pin);

      return qr;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Delete(':qrId')
  @UseGuards(AuthGuard())
  async removeQrCode(@Param('qrId') qrId: string, @Req() req) {
    try {
      await this.qrService.removeQrCode(qrId, req.user.userId);
      return { message: 'QR code deleted successfully' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
