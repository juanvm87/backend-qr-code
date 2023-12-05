import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  @IsString()
  readonly email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
