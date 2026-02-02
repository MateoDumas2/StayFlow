import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field()
  listingId: string;

  @Field()
  checkIn: string;

  @Field()
  checkOut: string;

  @Field(() => Int)
  guests: number;

  @Field(() => Float)
  totalPrice: number;

  @Field(() => Boolean, { nullable: true })
  isSplitPay?: boolean;

  @Field(() => [String], { nullable: true })
  invitedEmails?: string[];
}
