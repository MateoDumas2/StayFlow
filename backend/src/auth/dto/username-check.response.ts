import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UsernameCheckResponse {
  @Field()
  available: boolean;

  @Field(() => [String])
  suggestions: string[];
}
