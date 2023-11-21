import { IsString } from 'class-validator';

export class CreateStadisticDto {
  @IsString()
  qrId: string;

  @IsString()
  city: string;

  @IsString()
  region: string;

  @IsString()
  country: string;

  @IsString()
  loc: string;
  @IsString()
  timezone: string;
}
