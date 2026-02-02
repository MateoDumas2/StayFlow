import { Review } from '../../reviews/entities/review.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class Listing {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    imageUrl: string;
    description: string;
    amenities?: string[];
    vibes?: string[];
    accessibilityFeatures?: string[];
    travelTime?: number | null;
    reviews?: Review[];
    status: string;
    bookings?: Booking[];
}
