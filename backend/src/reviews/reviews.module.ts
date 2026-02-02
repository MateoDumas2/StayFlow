import { Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { ListingsModule } from '../listings/listings.module';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [forwardRef(() => ListingsModule), UsersModule, PrismaModule],
  providers: [ReviewsResolver, ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
