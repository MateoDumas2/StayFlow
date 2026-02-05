import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
export declare class ReviewsResolver {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    private getUserId;
    findAllByListingId(listingId: string): Promise<Review[]>;
    myReviews(ctx: any): Promise<Review[]>;
    createReview(createReviewInput: CreateReviewInput, ctx: any): Promise<Review>;
}
