"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ListingsService = class ListingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(search, vibe, accessibility, maxTravelTime) {
        const where = {};
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
        const sortedListings = listings.sort((a, b) => {
            const scoreA = (a.rating || 0) + (Math.log2((a._count?.bookings || 0) + 1) * 1.5);
            const scoreB = (b.rating || 0) + (Math.log2((b._count?.bookings || 0) + 1) * 1.5);
            return scoreB - scoreA;
        });
        return sortedListings;
    }
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Listing with ID ${id} not found`);
        return listing;
    }
    async create(createListingDto, hostId) {
        const listing = await this.prisma.listing.create({
            data: {
                ...createListingDto,
                amenities: createListingDto.amenities?.join(',') || '',
                vibes: createListingDto.vibes?.join(',') || '',
                accessibilityFeatures: createListingDto.accessibilityFeatures?.join(',') || '',
                status: 'available',
                hostId: hostId,
            }
        });
        return listing;
    }
    async findAllByHost(hostId) {
        return this.prisma.listing.findMany({
            where: { hostId },
            include: {
                bookings: true,
                _count: {
                    select: { bookings: true }
                }
            }
        });
    }
    async getHostStats(hostId) {
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
    async remove(id) {
        try {
            return await this.prisma.listing.delete({
                where: { id },
            });
        }
        catch (e) {
            throw new common_1.NotFoundException(`Listing with ID ${id} not found`);
        }
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map