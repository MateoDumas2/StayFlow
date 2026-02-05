import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) throw new Error("Cannot add yourself");

    const existing = await this.prisma.friendship.findUnique({
        where: {
            requesterId_addresseeId: { requesterId, addresseeId }
        }
    });
    if (existing) return existing;

    const inverse = await this.prisma.friendship.findUnique({
        where: {
            requesterId_addresseeId: { requesterId: addresseeId, addresseeId: requesterId }
        }
    });
    if (inverse) {
        if (inverse.status === 'PENDING') {
             return this.prisma.friendship.update({
                 where: { id: inverse.id },
                 data: { status: 'ACCEPTED' }
             });
        }
        return inverse; // Already accepted or rejected
    }

    return this.prisma.friendship.create({
      data: {
        requesterId,
        addresseeId,
        status: 'PENDING',
      },
    });
  }

  async acceptFriendRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendship.findUnique({ where: { id: requestId } });
    if (!request) throw new Error("Request not found");
    if (request.addresseeId !== userId) throw new Error("Not authorized");

    return this.prisma.friendship.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });
  }

  async rejectFriendRequest(requestId: string, userId: string) {
    const request = await this.prisma.friendship.findUnique({ where: { id: requestId } });
    if (!request) throw new Error("Request not found");
    if (request.addresseeId !== userId) throw new Error("Not authorized");
    
    return this.prisma.friendship.delete({ where: { id: requestId } });
  }

  async removeFriend(friendId: string, userId: string) {
    const f1 = await this.prisma.friendship.findFirst({
        where: { requesterId: userId, addresseeId: friendId }
    });
    if (f1) return this.prisma.friendship.delete({ where: { id: f1.id } });

    const f2 = await this.prisma.friendship.findFirst({
        where: { requesterId: friendId, addresseeId: userId }
    });
    if (f2) return this.prisma.friendship.delete({ where: { id: f2.id } });
    
    throw new Error("Friendship not found");
  }

  async getMyFriends(userId: string) {
    const sent = await this.prisma.friendship.findMany({
      where: { requesterId: userId, status: 'ACCEPTED' },
      include: { addressee: true }
    });
    const received = await this.prisma.friendship.findMany({
      where: { addresseeId: userId, status: 'ACCEPTED' },
      include: { requester: true }
    });

    return [...sent.map(f => f.addressee), ...received.map(f => f.requester)];
  }

  async getPendingRequests(userId: string) {
    return this.prisma.friendship.findMany({
      where: { addresseeId: userId, status: 'PENDING' },
      include: { requester: true }
    });
  }

  async searchUsers(query: string, currentUserId: string) {
    if (!query || query.length < 2) return [];
    
    return this.prisma.user.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
        id: { not: currentUserId }
      },
      take: 10
    });
  }
}
