import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class HostStats {
  @Field(() => Int)
  activeListings: number;

  @Field(() => Int)
  totalBookings: number;

  @Field(() => Float)
  totalRevenue: number;
}
