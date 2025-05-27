import { InputType, Field } from '@nestjs/graphql';
import { IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsPhoneNumber('IR')
  phone: string;

  @Field()
  @IsString()
  password: string;
}
