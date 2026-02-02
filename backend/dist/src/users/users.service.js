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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_service_1 = require("../prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toAuthUser(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar || undefined,
            createdAt: user.createdAt,
            spotifyConnected: !!user.spotifyAccessToken,
            spotifyDisplayName: user.spotifyDisplayName || undefined,
            flowPoints: user.flowPoints || 0,
            flowTier: user.flowTier || 'RIPPLE',
            favorites: user.favorites,
        };
    }
    async toggleFavorite(userId, listingId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { favorites: true },
        });
        if (!user)
            throw new Error('User not found');
        const isFavorite = user.favorites.some((f) => f.id === listingId);
        if (isFavorite) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    favorites: {
                        disconnect: { id: listingId },
                    },
                },
            });
        }
        else {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    favorites: {
                        connect: { id: listingId },
                    },
                },
            });
        }
        const updatedUser = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { favorites: true },
        });
        return this.toAuthUser(updatedUser);
    }
    async getFavorites(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { favorites: true },
        });
        return user?.favorites || [];
    }
    async addFlowPoints(userId, points) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        const newPoints = (user.flowPoints || 0) + points;
        let newTier = user.flowTier;
        if (newPoints >= 5000)
            newTier = 'SURFER';
        else if (newPoints >= 1000)
            newTier = 'WAVE';
        else
            newTier = 'RIPPLE';
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                flowPoints: newPoints,
                flowTier: newTier,
            },
        });
        return this.toAuthUser(updatedUser);
    }
    async create(email, name, password, role = 'GUEST') {
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
                role,
            },
        });
        return this.toAuthUser(user);
    }
    async validate(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user)
            return null;
        const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!ok)
            return null;
        return this.toAuthUser(user);
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user)
            return null;
        return this.toAuthUser(user);
    }
    async update(id, input) {
        const data = {};
        if (input.name)
            data.name = input.name;
        if (input.avatar)
            data.avatar = input.avatar;
        if (input.password) {
            data.passwordHash = await bcryptjs_1.default.hash(input.password, 10);
        }
        if (input.email) {
            data.email = input.email;
        }
        try {
            const user = await this.prisma.user.update({
                where: { id },
                data,
            });
            return this.toAuthUser(user);
        }
        catch (e) {
            throw new Error('User update failed (email might be in use)');
        }
    }
    async setSpotifyTokens(id, params) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                spotifyAccessToken: params.accessToken,
                spotifyRefreshToken: params.refreshToken,
                spotifyExpiresAt: params.expiresAt,
                spotifyDisplayName: params.displayName,
            },
        });
        return this.toAuthUser(user);
    }
    async getSpotifyTokens(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user || !user.spotifyAccessToken || !user.spotifyRefreshToken || !user.spotifyExpiresAt) {
            return null;
        }
        return {
            accessToken: user.spotifyAccessToken,
            refreshToken: user.spotifyRefreshToken,
            expiresAt: user.spotifyExpiresAt,
        };
    }
    async getHostStats(userId) {
        const listings = await this.prisma.listing.findMany({
            where: { hostId: userId },
            include: { bookings: true }
        });
        const activeListings = listings.length;
        const totalBookings = listings.reduce((acc, listing) => acc + listing.bookings.length, 0);
        const totalRevenue = listings.reduce((acc, listing) => {
            const listingRevenue = listing.bookings
                .filter(b => b.status === 'confirmed')
                .reduce((sum, b) => sum + b.totalPrice, 0);
            return acc + listingRevenue;
        }, 0);
        return {
            activeListings,
            totalBookings,
            totalRevenue
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map