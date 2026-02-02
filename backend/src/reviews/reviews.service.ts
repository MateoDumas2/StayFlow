import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService
  ) {}

  async findAllByListingId(listingId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { listingId },
    });
  }

  async findByUserId(userId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { userId },
    });
  }

  async create(createReviewInput: CreateReviewInput, userId: string): Promise<Review> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const review = await this.prisma.review.create({
      data: {
        ...createReviewInput,
        userId,
        authorName: user.name,
        authorAvatar: user.avatar || 'https://i.pravatar.cc/150?u=default',
      },
    });

    // Award FlowPoints for review
    // Base points: 500
    // Detailed review bonus (>50 chars): +200
    let points = 500;
    if (createReviewInput.content.length > 50) {
      points += 200;
    }
    
    await this.usersService.addFlowPoints(userId, points);

    // Update Listing Rating
    const aggregations = await this.prisma.review.aggregate({
      where: { listingId: createReviewInput.listingId },
      _avg: { rating: true },
    });
    
    const newRating = aggregations._avg.rating || createReviewInput.rating;
    
    await this.prisma.listing.update({
      where: { id: createReviewInput.listingId },
      data: { rating: newRating },
    });

    return review;
  }
}
