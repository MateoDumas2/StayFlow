import { PrismaService } from '../prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, type: string, title: string, message: string, link?: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: string;
        link: string | null;
        message: string;
        read: boolean;
    }>;
    findAllByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: string;
        link: string | null;
        message: string;
        read: boolean;
    }[]>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: string;
        link: string | null;
        message: string;
        read: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
