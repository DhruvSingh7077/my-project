import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ArrayUnique,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  readonly full_name!: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  readonly email!: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  readonly phone?: string;

  @IsOptional()
  @IsString({ message: 'LinkedIn must be a string' })
  readonly linkedin?: string;

  @IsOptional()
  @IsString({ message: 'Referred by must be a string' })
  readonly referred_by?: string;

  @IsOptional()
  @IsString({ message: 'Membership type must be a string' })
  readonly membership_type?: string;

  @IsOptional()
  @IsArray({ message: 'Sports must be an array' })
  @ArrayUnique({ message: 'Sports must not contain duplicates' })
  readonly sports?: string[];

  @IsOptional()
  @IsString({ message: 'Why join must be a string' })
  readonly why_join?: string;

  @IsOptional()
  @IsString({ message: 'Contribution must be a string' })
  readonly contribution?: string;
}
