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
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private smsService: SmsService, // Inject SmsService
  ) {}

  async requestOtp(phone: string): Promise<string> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpKey = `otp:${phone}`;
    const otpAttemptsKey = `otp:attempts:${phone}`;
    const MAX_OTP_ATTEMPTS = 3;

    // Store OTP in Redis with a TTL of 5 minutes (300 seconds)
    await this.cacheManager.set(otpKey, otpCode, 300);
    // Initialize OTP attempts in Redis with a TTL of 5 minutes (300 seconds)
    await this.cacheManager.set(otpAttemptsKey, MAX_OTP_ATTEMPTS, 300);

    // Find or create user by phone number (still in DB for user data persistence)
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({ data: { phone } });
    }

    // Send OTP via SMS.ir
    const smsSent = await this.smsService.sendOtp(phone, otpCode);
    if (!smsSent) {
      throw new BadRequestException('Failed to send OTP. Please try again.');
    }

    return 'کد یکبار مصرف با موفقیت ارسال شد'; // Return a success message, not the OTP code itself
  }

  async verifyOtpAndRegisterUser(
    data: VerifyOtpAndRegisterUserInput,
  ): Promise<UserProfileType> {
    const { phone, otp, name, password } = data;
    const otpKey = `otp:${phone}`;
    const otpAttemptsKey = `otp:attempts:${phone}`;

    const storedOtp = await this.cacheManager.get<string>(otpKey);
    let attemptsLeft = await this.cacheManager.get<number>(otpAttemptsKey);

    if (attemptsLeft === null || attemptsLeft === undefined) {
      throw new BadRequestException(
        'Invalid or expired OTP. Please request a new OTP.',
      );
    }

    if (!storedOtp || storedOtp !== otp) {
      attemptsLeft--;
      await this.cacheManager.set(otpAttemptsKey, attemptsLeft, 300);

      if (attemptsLeft <= 0) {
        await this.cacheManager.del(otpKey);
        await this.cacheManager.del(otpAttemptsKey);
        throw new BadRequestException(
          'Too many failed attempts. Please request a new OTP.',
        );
      }

      throw new BadRequestException(
        `Invalid or expired OTP. ${attemptsLeft} attempts remaining.`,
      );
    }

    // If OTP is valid from Redis, remove it from cache to prevent reuse
    await this.cacheManager.del(otpKey);
    await this.cacheManager.del(otpAttemptsKey);
    // OTP is valid, it has already been removed if from in-memory or Redis

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
      hasSubscription: updatedUser.hasSubscription,
      subscriptionExpiryDate: updatedUser.subscriptionExpiryDate ?? undefined,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return userProfile;
  }

  async login(phone: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { phone },
      select: {
        // Explicitly select all fields needed, including password
        id: true,
        phone: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
        hasSubscription: true,
        subscriptionExpiryDate: true,
        createdAt: true,
        updatedAt: true,
        password: true, // Explicitly select password
      },
    });

    if (!user) {
      // If user is not found, it means they haven't even gone through requestOtp yet.
      // This case should ideally be handled by the requestOtp/verifyOtp flow first.
      // For now, we'll throw an exception, but a more robust solution might involve
      // initiating the OTP flow from here if this 'login' is meant to be a universal entry.
      throw new UnauthorizedException('User not found.');
    }

    // If user exists but has no password (e.g., just registered via OTP and hasn't set one)
    if (!user.password) {
      // Generate token for this user directly, as they've been OTP-verified
      const payload = { phone: user.phone, sub: user.id };
      const userProfile: UserProfileType = {
        id: user.id,
        phone: user.phone,
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        avatarUrl: user.avatarUrl ?? undefined,
        bio: user.bio ?? undefined,
        hasSubscription: user.hasSubscription,
        subscriptionExpiryDate: user.subscriptionExpiryDate ?? undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return {
        accessToken: this.jwtService.sign(payload),
        user: userProfile,
      };
    }

    // If user has a password, proceed with password validation
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Generate token for password-authenticated user
    const payload = { phone: user.phone, sub: user.id };
    const userProfile: UserProfileType = {
      id: user.id,
      phone: user.phone,
      name: user.name ?? undefined,
      email: user.email ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      bio: user.bio ?? undefined,
      hasSubscription: user.hasSubscription,
      subscriptionExpiryDate: user.subscriptionExpiryDate ?? undefined,
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
