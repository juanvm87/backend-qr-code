import { Module } from '@nestjs/common';
import { StatisticModel } from './statistic.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    //TODO check if is ok add PassportModule.. here too.
    PassportModule.register({ defaultStrategy: 'jwt' }),
    StatisticModule,
    MongooseModule.forFeature([{ name: 'Statistic', schema: StatisticModel }]),
  ],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
