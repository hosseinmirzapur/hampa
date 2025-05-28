import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RequestOtpInput } from './dto/request-otp.dto';
import { VerifyOtpAndRegisterUserInput } from './dto/verify-otp.dto';
import { LoginInput } from './dto/login.dto';
import { AuthPayload } from './dto/auth-payload.dto';
import { UserProfileType } from '../users/dto/user-profile.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String) // Change return type to String
  async requestOtp(@Args('requestOtpInput') requestOtpInput: RequestOtpInput) {
    return this.authService.requestOtp(requestOtpInput.phone);
  }

  @Mutation(() => UserProfileType)
  async verifyOtpAndRegisterUser(
    @Args('verifyOtpAndRegisterUserInput')
    verifyOtpAndRegisterUserInput: VerifyOtpAndRegisterUserInput,
  ) {
    return this.authService.verifyOtpAndRegisterUser(
      verifyOtpAndRegisterUserInput,
    );
  }

  @Mutation(() => AuthPayload)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput.phone, loginInput.password);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async testProtectedRoute(@CurrentUser() user: UserProfileType) {
    return `Hello ${user.name || user.phone}! You are authenticated.`;
  }
}
