import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateListingDto } from './create-listing.dto';

@InputType()
export class UpdateListingDto extends PartialType(CreateListingDto) {}
