import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
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

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private toAuthUser(user: any): AuthUser {
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

  async toggleFavorite(userId: string, listingId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true },
    });

    if (!user) throw new Error('User not found');

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
    } else {
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

  async getFavorites(userId: string): Promise<any[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true },
    });
    return user?.favorites || [];
  }

  async addFlowPoints(userId: string, points: number): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newPoints = (user.flowPoints || 0) + points;
    let newTier = user.flowTier;

    // Simple tier logic
    if (newPoints >= 5000) newTier = 'SURFER';
    else if (newPoints >= 1000) newTier = 'WAVE';
    else newTier = 'RIPPLE';

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        flowPoints: newPoints,
        flowTier: newTier,
      },
    });

    return this.toAuthUser(updatedUser);
  }

  async checkUsernameAvailability(name: string): Promise<{ available: boolean; suggestions: string[] }> {
    const existingUser = await this.prisma.user.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (!existingUser) {
      return { available: true, suggestions: [] };
    }

    const suggestions = await this.generateUsernameSuggestions(name);
    return { available: false, suggestions };
  }

  private async generateUsernameSuggestions(baseName: string): Promise<string[]> {
    const suggestions: string[] = [];
    let attempts = 0;
    
    // Strategy 1: Add random numbers
    while (suggestions.length < 3 && attempts < 10) {
      const randomSuffix = Math.floor(Math.random() * 1000);
      const candidate = `${baseName}${randomSuffix}`;
      
      const exists = await this.prisma.user.findFirst({
        where: { name: { equals: candidate, mode: 'insensitive' } },
      });

      if (!exists && !suggestions.includes(candidate)) {
        suggestions.push(candidate);
      }
      attempts++;
    }

    // Strategy 2: Add year if we still need suggestions
    if (suggestions.length < 3) {
      const year = new Date().getFullYear();
      const candidate = `${baseName}${year}`;
      const exists = await this.prisma.user.findFirst({
        where: { name: { equals: candidate, mode: 'insensitive' } },
      });
      if (!exists && !suggestions.includes(candidate)) {
        suggestions.push(candidate);
      }
    }
    
    return suggestions;
  }

  async create(
    email: string,
    name: string,
    password: string,
    role: string = 'GUEST',
  ): Promise<AuthUser> {
    // Check if email exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new Error('Email already in use');
    }

    // Check if name exists
    const existingName = await this.prisma.user.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
    if (existingName) {
      throw new Error('Username already taken');
    }

    const passwordHash = await bcrypt.hash(password, 10);

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

  async validate(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return null;

    return this.toAuthUser(user);
  }

  async findById(id: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return this.toAuthUser(user);
  }

  async update(id: string, input: UpdateUserInput): Promise<AuthUser> {
    const data: any = {};
    if (input.name) data.name = input.name;
    if (input.avatar) data.avatar = input.avatar;
    if (input.password) {
      data.passwordHash = await bcrypt.hash(input.password, 10);
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
    } catch (e) {
      throw new Error('User update failed (email might be in use)');
    }
  }

  async setSpotifyTokens(
    id: string,
    params: {
      accessToken: string;
      refreshToken: string;
      expiresAt: Date;
      displayName?: string;
    },
  ): Promise<AuthUser> {
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

  async getSpotifyTokens(id: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  } | null> {
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

  async getHostStats(userId: string) {
    // 1. Get all listings for this host
    const listings = await this.prisma.listing.findMany({
      where: { hostId: userId },
      include: { bookings: true }
    });

    const activeListings = listings.length;
    
    // 2. Calculate total bookings across all listings
    const totalBookings = listings.reduce((acc, listing) => acc + listing.bookings.length, 0);

    // 3. Calculate total revenue
    // Revenue = sum of booking.totalPrice for confirmed bookings
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
}
