import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SpotifyImage {
  @Field()
  url: string;
  
  @Field({ nullable: true })
  height?: number;
  
  @Field({ nullable: true })
  width?: number;
}

@ObjectType()
export class SpotifyPlaylist {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [SpotifyImage], { nullable: true })
  images?: SpotifyImage[];
  
  @Field()
  uri: string;
  
  @Field()
  externalUrl: string;
}
