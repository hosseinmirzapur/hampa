import { InputType, Field } from '@nestjs/graphql';
import { IsPhoneNumber, IsString, Length, IsOptional } from 'class-validator';

@InputType()
export class VerifyOtpAndRegisterUserInput {
  @Field()
  @IsPhoneNumber('RU') // Assuming Russian phone numbers. Adjust as needed.
  phone: string;

  @Field()
  @IsString()
  @Length(6, 6) // Assuming 6-digit OTP
  otp: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters.' })
  password: string;
}