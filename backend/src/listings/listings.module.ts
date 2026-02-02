import { Module, forwardRef } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsResolver } from './listings.resolver';
import { ReviewsModule } from '../reviews/reviews.module';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [forwardRef(() => ReviewsModule), PrismaModule],
  providers: [ListingsResolver, ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
