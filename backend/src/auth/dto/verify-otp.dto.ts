import { IsPhoneNumber, IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsPhoneNumber('IR', { message: 'Invalid phone number format' }) // 'ZZ' allows any country code, adjust if needed
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be a 6-digit string' })
  otp: string;
}
