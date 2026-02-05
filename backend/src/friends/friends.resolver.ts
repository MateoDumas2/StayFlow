import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { FriendsService } from './friends.service';
import { Friendship } from './entities/friendship.entity';
import { User } from '../users/entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Resolver(() => Friendship)
export class FriendsResolver {
  constructor(private readonly friendsService: FriendsService) {}

  private getUserId(ctx: any): string {
    const auth = String(ctx.req?.headers?.authorization || '');
    const [, token] = auth.split(' ');
    if (!token) throw new Error('Not authenticated');
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'DEV_SECRET',
      ) as any;
      return decoded.sub;
    } catch (e) {
      throw new Error('Invalid token');
    }
  }

  @Mutation(() => Friendship)
  sendFriendRequest(
    @Args('userId') userId: string,
    @Context() ctx: any,
  ) {
    const myId = this.getUserId(ctx);
    return this.friendsService.sendFriendRequest(myId, userId);
  }

  @Mutation(() => Friendship)
  acceptFriendRequest(
    @Args('requestId') requestId: string,
    @Context() ctx: any,
  ) {
    const myId = this.getUserId(ctx);
    return this.friendsService.acceptFriendRequest(requestId, myId);
  }

  @Mutation(() => Friendship)
  rejectFriendRequest(
    @Args('requestId') requestId: string,
    @Context() ctx: any,
  ) {
    const myId = this.getUserId(ctx);
    return this.friendsService.rejectFriendRequest(requestId, myId);
  }

  @Mutation(() => Friendship)
  removeFriend(
    @Args('friendId') friendId: string,
    @Context() ctx: any,
  ) {
    const myId = this.getUserId(ctx);
    return this.friendsService.removeFriend(friendId, myId);
  }

  @Query(() => [User])
  myFriends(@Context() ctx: any) {
    const myId = this.getUserId(ctx);
    return this.friendsService.getMyFriends(myId);
  }

  @Query(() => [Friendship])
  myFriendRequests(@Context() ctx: any) {
    const myId = this.getUserId(ctx);
    return this.friendsService.getPendingRequests(myId);
  }

  @Query(() => [User])
  searchUsers(
    @Args('query') query: string,
    @Context() ctx: any
  ) {
    const myId = this.getUserId(ctx);
    return this.friendsService.searchUsers(query, myId);
  }
}
