import { IsPhoneNumber } from 'class-validator';

export class RequestOtpDto {
  @IsPhoneNumber('IR', { message: 'Invalid phone number format' }) // 'ZZ' allows any country code, adjust if needed
  phone: string;
}
