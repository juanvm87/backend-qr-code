import { Injectable, NotFoundException } from '@nestjs/common';
import { Qr } from './qr.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateQrDto } from 'src/dtos/updateQrDto';

@Injectable()
export class QrService {
  constructor(@InjectModel('Qr') private readonly qrModel: Model<Qr>) {}

  async insertQr(
    title: string,
    type: string,
    link: string,
    input: object,
    isDynamic: boolean,
    ownerId: string,
  ) {
    try {
      let pin;
      let reply;

      do {
        pin = String(Math.floor(1 + Math.random() * (9999 - 1 + 1))).padStart(
          4,
          '0',
        );
        reply = await this.qrModel.findOne({ ownerId, pin }).exec();
      } while (reply);

      const newQr = await this.qrModel.create({
        title,
        type,
        link,
        ownerId,
        input,
        isDynamic,
        pin,
      });

      return newQr;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //get all user QR, using ownerId
  async getAllQrByOwner(ownerId: string) {
    try {
      const qrCodes = await this.qrModel.find({ ownerId }).exec();
      return qrCodes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getQr(qrId: string) {
    try {
      const qr = await this.qrModel.findById(qrId).exec();

      return qr;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateQr(id: string, updateQrDto: UpdateQrDto) {
    try {
      const updatedFields: any = {};

      if (updateQrDto.type) {
        updatedFields.type = updateQrDto.type;
      }
      if (updateQrDto.link) {
        updatedFields.link = updateQrDto.link;
      }
      if (updateQrDto.title) {
        updatedFields.title = updateQrDto.title;
      }
      if (updateQrDto.input) {
        updatedFields.input = updateQrDto.input;
      }

      const updatedQr = await this.qrModel
        .findByIdAndUpdate(id, updatedFields, {
          new: true, // Return the updated document
          runValidators: true, // Run Mongoose validators
        })
        .exec();

      if (!updatedQr) {
        throw new NotFoundException(`QR code with ID ${id} not found`);
      }

      return updatedQr;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeQrCode(pin: string, ownerId: string) {
    try {
      const result = await this.qrModel
        .deleteOne({ ownerId: ownerId, pin: pin })
        .exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException(`QR code with ID ${pin} not found`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findQrByOwnerIdAndPin(ownerId: string, pin: number) {
    try {
      const qr = await this.qrModel.findOne({ ownerId, pin }).exec();

      if (!qr) {
        throw new NotFoundException(
          `QR code with pin ${pin} and userId ${ownerId} not found`,
        );
      }
      return qr;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
