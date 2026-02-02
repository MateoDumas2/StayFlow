import { Listing } from '../../listings/entities/listing.entity';
export declare class Booking {
    id: string;
    listingId: string;
    listing?: Listing;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    status: string;
}
