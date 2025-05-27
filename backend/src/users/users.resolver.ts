import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserProfileType, UpdateUserProfileInput } from './dto/user-profile.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Resolver(() => UserProfileType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserProfileType, { name: 'me' })
  async getMe(@CurrentUser() user: User): Promise<UserProfileType> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserProfileType, { name: 'user' })
  async getUser(@Args('id') id: string): Promise<UserProfileType> {
    return this.usersService.findOneById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserProfileType)
  async updateUserProfile(
    @CurrentUser() user: User,
    @Args('updateUserProfileInput') updateUserProfileInput: UpdateUserProfileInput,
  ): Promise<UserProfileType> {
    return this.usersService.updateProfile(user.id, updateUserProfileInput);
  }
}