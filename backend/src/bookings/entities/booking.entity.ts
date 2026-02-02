import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Listing } from '../../listings/entities/listing.entity';

@ObjectType()
export class Booking {
  @Field(() => ID)
  id: string;

  @Field()
  listingId: string;

  @Field(() => Listing, { nullable: true })
  listing?: Listing;

  @Field()
  checkIn: string;

  @Field()
  checkOut: string;

  @Field(() => Int)
  guests: number;

  @Field(() => Float)
  totalPrice: number;

  @Field()
  status: string; // 'confirmed' | 'cancelled'
}
