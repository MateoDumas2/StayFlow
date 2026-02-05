import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class Friendship {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  requesterId: string;

  @Field(() => User)
  requester: User;

  @Field(() => String)
  addresseeId: string;

  @Field(() => User)
  addressee: User;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  createdAt: Date;
}
