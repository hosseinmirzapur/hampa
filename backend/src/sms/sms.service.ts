import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private smsIrApiKey: string;
  private smsIrTemplateId: number;

  constructor(private configService: ConfigService) {
    this.smsIrApiKey = this.configService.get<string>('SMSIR_API_KEY')!;
    this.smsIrTemplateId = this.configService.get<number>('SMSIR_TEMPLATE_ID')!;
  }

  async sendOtp(mobile: string, code: string): Promise<boolean> {
    if (!this.smsIrApiKey || !this.smsIrTemplateId) {
      this.logger.error('SMS.ir API Key or Template ID is not configured.');
      return false;
    }

    const url = 'https://api.sms.ir/v1/send/verify';
    const data = {
      mobile: mobile,
      templateId: this.smsIrTemplateId,
      parameters: [
        {
          name: 'OTP_CODE', // As per the user's provided template text
          value: code,
        },
      ],
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
          'X-API-KEY': this.smsIrApiKey,
        },
      });

      if (response.data.status === 1) {
        this.logger.log(
          `OTP sent successfully to ${mobile}. MessageId: ${response.data.data.messageId}`,
        );
        return true;
      } else {
        this.logger.error(
          `Failed to send OTP to ${mobile}. Status: ${response.data.status}, Message: ${response.data.message}`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error(`Error sending OTP to ${mobile}: ${error.message}`);
      return false;
    }
  }
}
