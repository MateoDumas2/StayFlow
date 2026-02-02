import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [NotificationsResolver, NotificationsService, PrismaService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
