import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Listing } from '../../listings/entities/listing.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Boolean, { nullable: true })
  spotifyConnected?: boolean;

  @Field({ nullable: true })
  spotifyDisplayName?: string;

  @Field(() => Number)
  flowPoints: number;

  @Field()
  flowTier: string;

  @Field(() => [Listing], { nullable: true })
  favorites?: Listing[];
}
