import { PrismaService } from '../prisma.service';
import { Listing } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
export declare class ListingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(search?: string, vibe?: string, accessibility?: string[], maxTravelTime?: number): Promise<Listing[]>;
    findOne(id: string): Promise<Listing>;
    create(createListingDto: CreateListingDto, hostId?: string): Promise<Listing>;
    findAllByHost(hostId: string): Promise<Listing[]>;
    getHostStats(hostId: string): Promise<{
        activeListings: number;
        totalBookings: number;
        totalRevenue: number;
    }>;
    remove(id: string): Promise<Listing>;
}
