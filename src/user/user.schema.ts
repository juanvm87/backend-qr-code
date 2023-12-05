import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ unique: [true, 'Duplicate userId'] })
  userId: string;
  @Prop()
  name: string;

  @Prop()
  phone: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;
  @Prop()
  signinByGoogle: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
