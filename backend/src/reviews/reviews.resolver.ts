import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

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

  @Query(() => [Review], { name: 'reviewsByListing' })
  findAllByListingId(@Args('listingId') listingId: string) {
    return this.reviewsService.findAllByListingId(listingId);
  }

  @Query(() => [Review], { name: 'myReviews' })
  myReviews(@Context() ctx: any) {
    const userId = this.getUserId(ctx);
    return this.reviewsService.findByUserId(userId);
  }

  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @Context() ctx: any,
  ) {
    const userId = this.getUserId(ctx);
    return this.reviewsService.create(createReviewInput, userId);
  }
}
