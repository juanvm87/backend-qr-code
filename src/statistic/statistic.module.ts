import { Module } from '@nestjs/common';
import { StatisticModel } from './statistic.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';

@Module({
  imports: [
    StatisticModule,
    MongooseModule.forFeature([{ name: 'Statistic', schema: StatisticModel }]),
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
