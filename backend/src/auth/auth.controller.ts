import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for phone number' })
  @ApiResponse({ status: 200, description: 'OTP requested successfully' })
  @ApiResponse({ status: 500, description: 'Failed to request OTP' })
  async requestOtp(
    @Body() requestOtpDto: RequestOtpDto,
  ): Promise<{ message: string }> {
    return this.authService.requestOtp(requestOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for phone number' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid phone number or OTP' })
  @ApiResponse({ status: 500, description: 'Failed to verify OTP' })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ accessToken: string }> {
    // Changed return type to match AuthService
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with phone number and OTP' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access token',
  })
  @ApiResponse({ status: 400, description: 'Invalid phone number or OTP' })
  @ApiResponse({ status: 500, description: 'Failed to login' })
  async login(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(verifyOtpDto);
  }
}
