import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Statistic } from './statistic.schema';
import { Model } from 'mongoose';
import { CreateStadisticDto } from 'src/dtos/createStatisticDto';

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(Statistic.name)
    private readonly statisticModel: Model<Statistic>,
  ) {}

  async addStatistic(dto: CreateStadisticDto) {
    try {
      const { qrId, city, region, country, loc, timezone } = dto;
      const newQr = await this.statisticModel.create({
        qrId,
        city,
        region,
        country,
        loc,
        timezone,
      });
      return newQr;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getQrStatistic(qrId: string) {
    try {
      const qrStaticstics = await this.statisticModel.find({ qrId }).exec();
      return qrStaticstics;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
