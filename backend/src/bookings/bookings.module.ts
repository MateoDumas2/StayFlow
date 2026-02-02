import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { ListingsModule } from '../listings/listings.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ListingsModule, UsersModule, NotificationsModule],
  providers: [BookingsResolver, BookingsService],
})
export class BookingsModule {}
