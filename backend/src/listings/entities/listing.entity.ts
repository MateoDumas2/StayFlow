import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Review } from '../../reviews/entities/review.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@ObjectType()
export class Listing {
  @Field(() => String)
  id: string;

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

  @Field(() => Float, { nullable: true })
  travelTime?: number | null;

  @Field(() => [Review], { nullable: true })
  reviews?: Review[];

  @Field()
  status: string;

  @Field(() => [Booking], { nullable: true })
  bookings?: Booking[];
}
