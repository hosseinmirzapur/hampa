import { Resolver, Query, Mutation, Args, Field, ObjectType, InputType } from '@nestjs/graphql';
import { UsersService } from './users.service'; // Assuming a UsersService exists
import { AuthService } from '../auth/auth.service'; // Assuming an AuthService exists

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  phoneNumber: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  profilePicture?: string;
}

@InputType()
export class LoginInput {
  @Field()
  phoneNumber: string;

  @Field()
  otp: string;
}

@InputType()
export class SignupInput {
  @Field()
  phoneNumber: string;

  // Add other fields needed for signup
  @Field({ nullable: true })
  name?: string;

  // Add other fields as necessary
}

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService, // Inject UsersService
    private authService: AuthService, // Inject AuthService
  ) {}

  @Query(() => User, { nullable: true })
  async currentUser(
    // You will likely need to get the user from the context/request here
    // For now, returning null or a placeholder
  ): Promise<User | null> {
    // Logic to get the authenticated user from the context
    // const userId = context.req.user.id; // Example
    // return this.usersService.findById(userId); // Example
    return null; // Placeholder
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    // Call AuthService to handle login logic (e.g., verify OTP, generate token)
    const { user, token } = await this.authService.validateUserByOtp(input.phoneNumber, input.otp);
    return { user, token };
  }

  @Mutation(() => AuthPayload) // Or a different return type for signup
  async signup(@Args('input') input: SignupInput): Promise<AuthPayload> {
    // Call AuthService or UsersService to handle signup logic (e.g., create user)
    const newUser = await this.usersService.create(input);
    // You might want to automatically log in the user after signup
    const token = await this.authService.generateToken(newUser.id); // Example token generation
    return { user: newUser, token }; // Returning user and token for immediate login
  }
}