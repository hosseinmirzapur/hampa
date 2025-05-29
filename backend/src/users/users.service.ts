import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateUserProfileInput,
  UserProfileType,
} from './dto/user-profile.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private _mapUserToUserProfileType(user: User): UserProfileType {
    return {
      id: user.id,
      phone: user.phone,
      name: user.name ?? undefined,
      email: user.email ?? undefined,
      avatarUrl: user.avatarUrl ?? undefined,
      bio: user.bio ?? undefined,
      hasSubscription: user.hasSubscription, // Add new field
      subscriptionExpiryDate: user.subscriptionExpiryDate ?? undefined, // Add new field
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findOneById(id: string): Promise<UserProfileType | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this._mapUserToUserProfileType(user) : null;
  }

  async updateProfile(
    userId: string,
    data: UpdateUserProfileInput,
  ): Promise<UserProfileType> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return this._mapUserToUserProfileType(updatedUser);
  }
}
