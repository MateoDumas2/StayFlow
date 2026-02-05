import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
  ObjectType,
  Field,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { RegisterInput } from '../users/dto/register.input';
import { LoginInput } from '../users/dto/login.input';
import { User } from '../users/entities/user.entity';
import { Listing } from '../listings/entities/listing.entity';
import * as jwt from 'jsonwebtoken';

import { UpdateUserInput } from '../users/dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { UsernameCheckResponse } from './dto/username-check.response';

@ObjectType()
class AuthPayload {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
}

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly users: UsersService,
    private readonly spotify: SpotifyService,
  ) {}

  @Query(() => UsernameCheckResponse)
  async checkUsername(@Args('username') username: string) {
    return this.users.checkUsernameAvailability(username);
  }

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput) {
    const user = await this.users.create(
      input.email,
      input.name,
      input.password,
      input.role,
    );
    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET || 'DEV_SECRET',
      {
        expiresIn: '7d',
      },
    );
    return { token, user };
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    const user = await this.users.validate(input.email, input.password);
    if (!user) throw new Error('Invalid credentials');

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET || 'DEV_SECRET',
      {
        expiresIn: '7d',
      },
    );
    return { token, user };
  }

  @Mutation(() => User)
  async updateProfile(
    @Args('input') input: UpdateUserInput,
    @Context() ctx: any,
  ) {
    const auth = String(ctx.req?.headers?.authorization || '');
    const [, token] = auth.split(' ');
    if (!token) throw new Error('Not authenticated');

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'DEV_SECRET',
      ) as any;
      return await this.users.update(decoded.sub, input);
    } catch (e) {
      throw new Error('Invalid token or user not found');
    }
  }

  @Mutation(() => User)
  async toggleFavorite(
    @Args('listingId') listingId: string,
    @Context() ctx: any,
  ) {
    const auth = String(ctx.req?.headers?.authorization || '');
    const [, token] = auth.split(' ');
    if (!token) throw new Error('Not authenticated');

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'DEV_SECRET',
      ) as any;
      return await this.users.toggleFavorite(decoded.sub, listingId);
    } catch (e) {
      throw new Error('Invalid token or user not found');
    }
  }

  @ResolveField(() => [Listing])
  async favorites(@Parent() user: User) {
    if (user.favorites) return user.favorites;
    return this.users.getFavorites(user.id);
  }

  @Query(() => User, { nullable: true })
  async me(@Context() ctx: any) {
    const auth = String(ctx.req?.headers?.authorization || '');
    const [, token] = auth.split(' ');
    if (!token) return null;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'DEV_SECRET',
      ) as any;
      return await this.users.findById(decoded.sub);
    } catch {
      return null;
    }
  }

  @Query(() => [SpotifyPlaylist], { nullable: true })
  async mySpotifyPlaylists(@Context() ctx: any) {
    const auth = String(ctx.req?.headers?.authorization || '');
    const [, token] = auth.split(' ');
    if (!token) return null;

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'DEV_SECRET',
      ) as any;
      
      const tokens = await this.users.getSpotifyTokens(decoded.sub);
      if (!tokens) return null;

      let accessToken = tokens.accessToken;
      
      // Check if expired
      if (new Date() > tokens.expiresAt) {
         try {
           const newTokens = await this.spotify.refreshAccessToken(tokens.refreshToken);
           accessToken = newTokens.accessToken;
           
           const expiresAt = new Date(Date.now() + newTokens.expiresIn * 1000);
           await this.users.setSpotifyTokens(decoded.sub, {
             accessToken: newTokens.accessToken,
             refreshToken: newTokens.refreshToken,
             expiresAt,
           });
         } catch (e) {
           console.error("Failed to refresh token", e);
           return null; 
         }
      }

      return await this.spotify.fetchUserPlaylists(accessToken);
    } catch {
      return null;
    }
  }

  @Query(() => String)
  ping() {
    return 'pong';
  }
}
