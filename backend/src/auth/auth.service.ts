import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RequestOtpInput } from './dto/request-otp.dto';
import { VerifyOtpAndRegisterUserInput } from './dto/verify-otp.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async requestOtp(phone: string): Promise<boolean> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpKey = `otp:${phone}`;

    // Store OTP in Redis with a TTL of 5 minutes (300 seconds)
    await this.cacheManager.set(otpKey, otpCode, 300);

    // Find or create user by phone number (still in DB for user data persistence)
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({ data: { phone } });
    }

    console.log(`OTP for ${phone}: ${otpCode} (stored in Redis)`); // Log OTP for testing purposes
    return true;
  }

  async verifyOtpAndRegisterUser(data: VerifyOtpAndRegisterUserInput) {
    const { phone, otp, name, password } = data;
    const otpKey = `otp:${phone}`;

    const storedOtp = await this.cacheManager.get<string>(otpKey);

    if (!storedOtp || storedOtp !== otp) {
      throw new BadRequestException('Invalid or expired OTP.');
    }

    // OTP is valid, remove it from cache to prevent reuse
    await this.cacheManager.del(otpKey);

    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new BadRequestException('User not found.'); // Should not happen if requestOtp was called
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with name and hashed password
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { name, password: hashedPassword },
    });

    return updatedUser;
  }

  async login(phone: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = { phone: user.phone, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }

  async validateUser(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}