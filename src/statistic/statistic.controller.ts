import { Body, Controller, Post, UseGuards, Param, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateStadisticDto } from 'src/dtos/createStatisticDto';
import { StatisticService } from './statistic.service';

@ApiBearerAuth()
@Controller('statistic')
export class StatisticController {
  constructor(private readonly stadisticService: StatisticService) {}

  @Post()
  @UseGuards(AuthGuard())
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
  @UseGuards(AuthGuard())
  async getQrStatistic(@Param('qrId') qrId: string) {
    try {
      const reply = await this.getQrStatistic(qrId);
      return reply;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
