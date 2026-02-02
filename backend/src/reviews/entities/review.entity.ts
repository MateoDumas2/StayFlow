import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  rating: number;

  @Field(() => String)
  authorName: string;

  @Field(() => String)
  authorAvatar: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  listingId: string;
}
