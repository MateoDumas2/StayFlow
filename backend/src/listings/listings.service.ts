import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Listing } from './entities/listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';

import { UpdateListingDto } from './dto/update-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    search?: string,
    vibe?: string,
    accessibility?: string[],
    maxTravelTime?: number,
  ): Promise<Listing[]> {
    const where: any = {};
    // Only show available listings by default? No, let's show all for now as per previous logic.
    // delete where.status; // Redundant as we start with empty object.

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (vibe) {
      where.vibes = { contains: vibe };
    }

    if (maxTravelTime) {
      where.travelTime = { lte: maxTravelTime };
    }

    if (accessibility && accessibility.length > 0) {
      where.AND = accessibility.map(feature => ({
        accessibilityFeatures: { contains: feature }
      }));
    }

    const listings = await this.prisma.listing.findMany({
      where,
      include: { 
        reviews: true,
        _count: {
          select: { bookings: true }
        }
      } 
    });
    
    // Algorithm: Recommendation Score = Rating (0-5) + (Bookings Count * 0.5)
    // This prioritizes listings with good ratings AND high booking volume.
    // Example:
    // - Listing A: 5.0 rating, 0 bookings = 5.0
    // - Listing B: 4.5 rating, 10 bookings = 4.5 + 5.0 = 9.5 (Winner)
    // - Listing C: 3.0 rating, 20 bookings = 3.0 + 10.0 = 13.0 (Winner, popular but mediocre)
    // To balance, maybe cap booking bonus or use log?
    // Let's use log to avoid popularity strictly dominating quality.
    // Score = Rating + (log2(bookings + 1) * 1.5)
    // - A: 5.0 + 0 = 5.0
    // - B: 4.5 + (log2(11)≈3.46 * 1.5)≈5.2 = 9.7
    // - C: 3.0 + (log2(21)≈4.39 * 1.5)≈6.6 = 9.6
    // This looks better.
    
    const sortedListings = listings.sort((a: any, b: any) => {
      const scoreA = (a.rating || 0) + (Math.log2((a._count?.bookings || 0) + 1) * 1.5);
      const scoreB = (b.rating || 0) + (Math.log2((b._count?.bookings || 0) + 1) * 1.5);
      return scoreB - scoreA;
    });

    return sortedListings as any;
  }

  async findOne(id: string): Promise<Listing> {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        bookings: {
          select: { checkIn: true, checkOut: true, status: true },
          where: { status: 'confirmed' }
        },
        reviews: true
      }
    });
    if (!listing)
      throw new NotFoundException(`Listing with ID ${id} not found`);
    return listing as any;
  }

  async create(createListingDto: CreateListingDto, hostId?: string): Promise<Listing> {
    const defaultImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    const listing = await this.prisma.listing.create({
      data: {
        ...createListingDto,
        imageUrl: createListingDto.imageUrl || defaultImage,
        amenities: createListingDto.amenities?.join(',') || '',
        vibes: createListingDto.vibes?.join(',') || '',
        accessibilityFeatures: createListingDto.accessibilityFeatures?.join(',') || '',
        status: 'available',
        hostId: hostId,
      }
    });
    return listing as any;
  }

  async update(id: string, updateListingDto: UpdateListingDto): Promise<Listing> {
    const data: any = { ...updateListingDto };
    
    if (updateListingDto.amenities) {
      data.amenities = updateListingDto.amenities.join(',');
    }
    if (updateListingDto.vibes) {
      data.vibes = updateListingDto.vibes.join(',');
    }
    if (updateListingDto.accessibilityFeatures) {
      data.accessibilityFeatures = updateListingDto.accessibilityFeatures.join(',');
    }

    try {
      const listing = await this.prisma.listing.update({
        where: { id },
        data,
      });
      return listing as any;
    } catch (e) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }
  }

  async findAllByHost(hostId: string): Promise<Listing[]> {
    return this.prisma.listing.findMany({
      where: { hostId },
      include: {
        bookings: true,
        _count: {
          select: { bookings: true }
        }
      }
    }) as any;
  }

  async getHostStats(hostId: string) {
    const listings = await this.prisma.listing.findMany({
      where: { hostId },
      include: {
        bookings: {
          where: { status: 'confirmed' }
        }
      }
    });

    const activeListings = listings.length;
    let totalBookings = 0;
    let totalRevenue = 0;

    listings.forEach(listing => {
      totalBookings += listing.bookings.length;
      listing.bookings.forEach(booking => {
        totalRevenue += booking.totalPrice;
      });
    });

    return {
      activeListings,
      totalBookings,
      totalRevenue
    };
  }

  async remove(id: string): Promise<Listing> {
    try {
      return await this.prisma.listing.delete({
        where: { id },
      }) as any;
    } catch (e) {
      throw new NotFoundException(`Listing with ID ${id} not found`);
    }
  }
}
