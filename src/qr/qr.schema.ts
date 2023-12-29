import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Qr extends Document {
  @Prop()
  title: string;
  @Prop()
  type: string;
  @Prop()
  link: string;
  @Prop()
  ownerId: string;
  @Prop({ type: Object })
  input: object;
  @Prop()
  isDynamic: boolean;
  @Prop()
  isFormDisplay: boolean;
  @Prop()
  formResponses: Array<object>;
  @Prop()
  pin: string;
}

export const QrSchema = SchemaFactory.createForClass(Qr);
