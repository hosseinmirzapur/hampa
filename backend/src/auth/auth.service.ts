import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Inject, // Import Inject
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'; // Import CacheManager and Cache type

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Inject CacheManager
  ) {}

  async requestOtp(requestOtpDto: RequestOtpDto): Promise<{ message: string }> {
    const { phone } = requestOtpDto;

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpKey = `otp:${phone}`; // Key for Redis

    // Save OTP to Redis with a 5-minute expiry (in seconds)
    try {
      // Find or create user by phone number (still needed to get user ID for JWT later)
      let user = await this.prisma.user.findUnique({ where: { phone } });

      if (!user) {
        user = await this.prisma.user.create({ data: { phone } });
      }

      // Store OTP in Redis
      await this.cacheManager.set(otpKey, otp, 5 * 60 * 1000); // TTL in milliseconds

      // TODO: Integrate with SMS gateway here
      console.log(`Sending OTP ${otp} to ${phone}`); // Placeholder for now

      return { message: 'OTP requested successfully' };
    } catch (error) {
      console.error('Error requesting OTP:', error);
      throw new InternalServerErrorException('Failed to request OTP');
    }
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ accessToken: string }> {
    const { phone, otp } = verifyOtpDto;
    const otpKey = `otp:${phone}`; // Key for Redis

    try {
      const user = await this.prisma.user.findUnique({ where: { phone } });

      if (!user) {
        throw new BadRequestException('Invalid phone number or OTP');
      }

      // Retrieve OTP from Redis
      const storedOtp = await this.cacheManager.get<string>(otpKey);

      if (!storedOtp || storedOtp !== otp) {
        throw new BadRequestException('Invalid phone number or OTP');
      }

      // Remove OTP from Redis after successful verification
      await this.cacheManager.del(otpKey);

      // Generate JWT
      const payload = { sub: user.id, phone: user.phone }; // Payload for JWT
      const accessToken = this.jwtService.sign(payload);

      return { accessToken }; // Return the JWT
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to verify OTP');
    }
  }

  // The login logic is essentially the verifyOtp process in this flow
  async login(verifyOtpDto: VerifyOtpDto): Promise<{ accessToken: string }> {
    return this.verifyOtp(verifyOtpDto);
  }
}
