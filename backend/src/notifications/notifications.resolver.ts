import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import * as jwt from 'jsonwebtoken';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

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

  @Query(() => [Notification], { name: 'myNotifications' })
  myNotifications(@Context() ctx: any) {
    const userId = this.getUserId(ctx);
    return this.notificationsService.findAllByUser(userId);
  }

  @Mutation(() => Notification)
  markNotificationAsRead(@Args('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Mutation(() => Number) // Returns count of updated records
  async markAllNotificationsAsRead(@Context() ctx: any) {
    const userId = this.getUserId(ctx);
    const result = await this.notificationsService.markAllAsRead(userId);
    return result.count;
  }
}
