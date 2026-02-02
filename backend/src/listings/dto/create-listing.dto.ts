import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateListingDto {
  @Field()
  title: string;

  @Field()
  location: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  rating: number;

  @Field()
  imageUrl: string;

  @Field()
  description: string;

  @Field(() => [String], { nullable: true })
  amenities?: string[];

  @Field(() => [String], { nullable: true })
  vibes?: string[];

  @Field(() => [String], { nullable: true })
  accessibilityFeatures?: string[];
}
