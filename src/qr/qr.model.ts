import * as mongoose from 'mongoose';

export const QrSchema = new mongoose.Schema(
  {
    title: { type: String },
    type: { type: String, required: true },
    link: { type: String, required: true },
    ownerId: { type: String, required: true },
    input: { type: Object, required: true },
    isDynamic: { type: Boolean },
    pin: { type: String },
  },
  {
    timestamps: true, // Enable timestamps here
  },
);

export interface Qr {
  id: string;
  title: string;
  type: string;
  link: string;
  ownerId: string;
  input: object;
  isDynamic: boolean;
  pin: string;
}
