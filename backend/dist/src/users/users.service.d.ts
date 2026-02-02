import { PrismaService } from '../prisma.service';
import { UpdateUserInput } from './dto/update-user.input';
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    createdAt: Date;
    spotifyConnected?: boolean;
    spotifyDisplayName?: string;
    flowPoints: number;
    flowTier: string;
    favorites?: any[];
}
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    private toAuthUser;
    toggleFavorite(userId: string, listingId: string): Promise<AuthUser>;
    getFavorites(userId: string): Promise<any[]>;
    addFlowPoints(userId: string, points: number): Promise<AuthUser>;
    create(email: string, name: string, password: string, role?: string): Promise<AuthUser>;
    validate(email: string, password: string): Promise<AuthUser | null>;
    findById(id: string): Promise<AuthUser | null>;
    update(id: string, input: UpdateUserInput): Promise<AuthUser>;
    setSpotifyTokens(id: string, params: {
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
        displayName?: string;
    }): Promise<AuthUser>;
    getSpotifyTokens(id: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresAt: Date;
    } | null>;
    getHostStats(userId: string): Promise<{
        activeListings: number;
        totalBookings: number;
        totalRevenue: number;
    }>;
}
