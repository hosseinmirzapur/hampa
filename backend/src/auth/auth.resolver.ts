import { Resolver, Mutation, Args, Field, InputType, ObjectType } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@InputType()
class RequestOtpInput {
  @Field()
  phoneNumber: string;
}

@InputType()
class VerifyOtpInput {
  @Field()
  phoneNumber: string;
  @Field()
  otp: string;
}

@ObjectType()
class AuthResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // The AuthService methods expect an object with 'phone' property,
  // so we need to map phoneNumber to phone for the service call.
  @Mutation(() => AuthResult)
  async requestOtp(@Args('input') input: RequestOtpInput): Promise<AuthResult> {
    try {
      const result = await this.authService.requestOtp({ phone: input.phoneNumber });
      return { success: true, message: result.message };
    } catch (error) {
      return { success: false, message: error.message || 'Failed to request OTP' };
    }
  }

  @Mutation(() => AuthResult)
  async verifyOtp(@Args('input') input: VerifyOtpInput): Promise<AuthResult> {
    try {
      const result = await this.authService.verifyOtp({
        phone: input.phoneNumber,
        otp: input.otp,
      });
      return { success: true, message: result.accessToken }; // Return accessToken as message for now
    } catch (error) {
      return { success: false, message: error.message || 'Failed to verify OTP' };
    }
  }
}