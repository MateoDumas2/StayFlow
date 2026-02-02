import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  content: string;

  @Field(() => Int)
  rating: number;

  @Field(() => String)
  listingId: string;
}
