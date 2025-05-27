import { InputType, Field } from '@nestjs/graphql';
import { IsPhoneNumber } from 'class-validator';

@InputType()
export class RequestOtpInput {
  @Field()
  @IsPhoneNumber('IR')
  phone: string;
}
