import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { CreateBookingInput } from './dto/create-booking.input';
import { ListingsService } from '../listings/listings.service';
import { Listing } from '../listings/entities/listing.entity';
export declare class BookingsResolver {
    private readonly bookingsService;
    private readonly listingsService;
    constructor(bookingsService: BookingsService, listingsService: ListingsService);
    createBooking(createBookingInput: CreateBookingInput, ctx: any): Promise<Booking>;
    private getUserId;
    myBookings(ctx: any): Promise<Booking[]>;
    findOne(id: string): Promise<Booking>;
    listing(booking: Booking): Promise<Listing>;
}
