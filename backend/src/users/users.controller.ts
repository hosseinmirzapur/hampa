import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto } from './dto/user-profile.dto'; // Import UserProfileDto
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client'; // Import User type from Prisma

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto, // Use UserProfileDto here
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() req): Promise<User> {
    // The user object is attached to the request by the JwtStrategy
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  @ApiOperation({ summary: 'Update authenticated user profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserProfileDto, // Use UserProfileDto here
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateMe(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // The user object is attached to the request by the JwtStrategy
    return this.usersService.update(req.user.id, updateUserDto);
  }
}
