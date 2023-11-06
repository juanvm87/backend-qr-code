import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateQrDto {
  @IsString()
  title?: string;
  @IsNotEmpty()
  @IsString()
  type: string;
  @IsNotEmpty()
  @IsString()
  link: string;
  @IsNotEmpty()
  input: object;
  @IsBoolean()
  isDynamic: boolean;
}
