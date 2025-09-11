import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly full_name!: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  readonly linkedin?: string;

  @IsOptional()
  @IsString()
  readonly referred_by?: string;

  @IsOptional()
  @IsString()
  readonly membership_type?: string;

  @IsOptional()
  @IsArray()
  readonly sports?: string[];

  @IsOptional()
  @IsString()
  readonly why_join?: string;

  @IsOptional()
  @IsString()
  readonly contribution?: string;
}
