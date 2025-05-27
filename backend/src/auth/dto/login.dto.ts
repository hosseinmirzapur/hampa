import { InputType, Field } from '@nestjs/graphql';
import { IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsPhoneNumber('RU') // Assuming Russian phone numbers. Adjust as needed.
  phone: string;

  @Field()
  @IsString()
  password: string;
}