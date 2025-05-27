import { InputType, Field } from '@nestjs/graphql';
import { IsPhoneNumber, IsString, Length, IsOptional } from 'class-validator';

@InputType()
export class VerifyOtpAndRegisterUserInput {
  @Field()
  @IsPhoneNumber('IR') // Assuming 'IR' is the country code for Iran
  phone: string;

  @Field()
  @IsString()
  @Length(6, 6) // Assuming 6-digit OTP
  otp: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters.' })
  password?: string;
}
