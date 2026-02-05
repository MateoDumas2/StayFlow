import { ListingsService } from './listings.service';
import { Listing } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { ReviewsService } from '../reviews/reviews.service';
import { Review } from '../reviews/entities/review.entity';
export declare class HostStats {
    activeListings: number;
    totalBookings: number;
    totalRevenue: number;
}
export declare class ListingsResolver {
    private readonly listingsService;
    private readonly reviewsService;
    constructor(listingsService: ListingsService, reviewsService: ReviewsService);
    private getUserId;
    findAll(search?: string, vibe?: string, accessibility?: string[], maxTravelTime?: number): Promise<Listing[]>;
    findOne(id: string): Promise<Listing>;
    myListings(ctx: any): Promise<Listing[]>;
    hostStats(ctx: any): Promise<{
        activeListings: number;
        totalBookings: number;
        totalRevenue: number;
    }>;
    createListing(createListingInput: CreateListingDto, ctx: any): Promise<Listing>;
    removeListing(id: string): Promise<Listing>;
    reviews(listing: Listing): Promise<Review[]>;
    amenities(listing: any): any;
    vibes(listing: any): any;
    accessibilityFeatures(listing: any): any;
}
