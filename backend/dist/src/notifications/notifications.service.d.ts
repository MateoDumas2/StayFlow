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
        message: string;
        read: boolean;
        link: string | null;
    }>;
    findAllByUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: string;
        message: string;
        read: boolean;
        link: string | null;
    }[]>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: string;
        message: string;
        read: boolean;
        link: string | null;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
