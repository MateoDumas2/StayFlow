import { PrismaService } from '../prisma.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UsersService } from '../users/users.service';
export declare class ReviewsService {
    private prisma;
    private usersService;
    constructor(prisma: PrismaService, usersService: UsersService);
    findAllByListingId(listingId: string): Promise<Review[]>;
    findByUserId(userId: string): Promise<Review[]>;
    create(createReviewInput: CreateReviewInput, userId: string): Promise<Review>;
}
