import { Body, Controller, Post, Param, Get } from '@nestjs/common';

import { CreateStadisticDto } from 'src/dtos/createStatisticDto';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly stadisticService: StatisticService) {}

  @Post()
  async addQr(@Body() dto: CreateStadisticDto) {
    try {
      const response = await this.stadisticService.addStatistic({
        qrId: dto.qrId,
        city: dto.city,
        region: dto.region,
        country: dto.country,
        loc: dto.loc,
        timezone: dto.timezone,
      });

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('id/:qrId')
  async getQrStatistics(@Param('qrId') qrId: string) {
    try {
      const reply = await this.stadisticService.getQrStatistic(qrId);

      return reply;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
