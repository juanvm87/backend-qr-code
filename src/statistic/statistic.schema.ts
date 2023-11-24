import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Statistic extends Document {
  @Prop()
  qrId: string;

  @Prop()
  city: string;

  @Prop()
  region: string;

  @Prop()
  country: string;

  @Prop()
  loc: string;

  @Prop()
  timezone: string;
}

export const StatisticModel = SchemaFactory.createForClass(Statistic);
