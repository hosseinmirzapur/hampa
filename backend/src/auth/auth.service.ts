import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyOtpAndRegisterUserInput } from './dto/verify-otp.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserProfileType } from '../users/dto/user-profile.dto';

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

  async verifyOtpAndRegisterUser(
    data: VerifyOtpAndRegisterUserInput,
  ): Promise<UserProfileType> {
    const { phone, otp, name, password } = data;
    const otpKey = `otp:${phone}`;

    // Bypass OTP verification if the provided OTP is the default "123456"
    if (otp !== '123456') {
      // Only check cache if not the default OTP
      const storedOtp = await this.cacheManager.get<string>(otpKey);

      if (!storedOtp || storedOtp !== otp) {
        throw new BadRequestException('Invalid or expired OTP.');
      }
      // OTP is valid, remove it from cache to prevent reuse (only for non-default OTPs)
      await this.cacheManager.del(otpKey);
    } else {
      // For default OTP, ensure it's removed from cache if it exists to prevent issues
      await this.cacheManager.del(otpKey);
    }

    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new BadRequestException('User not found.'); // Should not happen if requestOtp was called
    }

    const updateData: { name?: string; password?: string } = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user with name and hashed password (if provided)
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const userProfile: UserProfileType = {
      id: updatedUser.id,
      phone: updatedUser.phone,
      name: updatedUser.name ?? undefined,
      email: updatedUser.email ?? undefined,
      avatarUrl: updatedUser.avatarUrl ?? undefined,
      bio: updatedUser.bio ?? undefined,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return userProfile;
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
    const userProfile: UserProfileType = {
      id: user.id,
      phone: user.phone,
      name: user.name ?? undefined,
      email: user.email ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      bio: user.bio ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: userProfile,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }
}
