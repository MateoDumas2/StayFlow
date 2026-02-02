import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { CreateBookingInput } from './dto/create-booking.input';
import { ListingsService } from '../listings/listings.service';
import { Listing } from '../listings/entities/listing.entity';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly listingsService: ListingsService,
  ) {}

  @Mutation(() => Booking)
  createBooking(
    @Args('createBookingInput') createBookingInput: CreateBookingInput,
    @Context() ctx: any,
  ) {
    const userId = this.getUserId(ctx);
    return this.bookingsService.create(createBookingInput, userId);
  }

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

  @Query(() => [Booking], { name: 'myBookings' })
  myBookings(@Context() ctx: any) {
    const userId = this.getUserId(ctx);
    return this.bookingsService.findByUserId(userId);
  }

  @Query(() => Booking, { name: 'booking' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.bookingsService.findOne(id);
  }

  @ResolveField(() => Listing)
  listing(@Parent() booking: Booking) {
    return this.listingsService.findOne(booking.listingId);
  }
}
