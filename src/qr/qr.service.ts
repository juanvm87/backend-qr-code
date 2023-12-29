import { Injectable, NotFoundException } from '@nestjs/common';
import { Qr } from './qr.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateQrDto } from 'src/dtos/updateQrDto';
import { Statistic } from 'src/statistic/statistic.schema';

@Injectable()
export class QrService {
  constructor(
    @InjectModel('Qr') private readonly qrModel: Model<Qr>,
    @InjectModel(Statistic.name)
    private readonly statisticModel: Model<Statistic>,
  ) {}

  async insertQr(
    title: string,
    type: string,
    link: string,
    input: object,
    isDynamic: boolean,
    isFormDisplay: boolean,
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
        isFormDisplay,
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

      if (!qr) {
        throw new NotFoundException(`QR code with ID ${qrId} not found`);
      }
      return qr;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateQr(_id: string, updateQrDto: UpdateQrDto) {
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
      if (updateQrDto.isFormDisplay) {
        updatedFields.isFormDisplay = updateQrDto.isFormDisplay;
      }
      if (updateQrDto.formResponses) {
        const qrupdated = await this.qrModel
          .findByIdAndUpdate(
            _id,
            {
              $push: {
                formResponses: updateQrDto.formResponses,
              },
            },
            {
              new: true, // Return the updated document
              runValidators: true, // Run Mongoose validators
            },
          )
          .exec();

        return qrupdated;
      }

      const updatedQr = await this.qrModel
        .findByIdAndUpdate(_id, updatedFields, {
          new: true, // Return the updated document
          runValidators: true, // Run Mongoose validators
        })
        .exec();

      if (!updatedQr) {
        throw new NotFoundException(`QR code with ID ${_id} not found`);
      }

      return updatedQr;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeQrCode(_id: string) {
    try {
      const result = await this.qrModel.deleteOne({ _id: _id }).exec();

      if (result.deletedCount === 0) {
        throw new NotFoundException(`QR code with ID ${_id} not found`);
      }
      if (result.acknowledged) {
        await this.statisticModel.deleteMany({ qrId: _id }).exec();
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
