import { NotificationsService } from './notifications.service';
export declare class NotificationsResolver {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    private getUserId;
    myNotifications(ctx: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: string;
        link: string | null;
        message: string;
        read: boolean;
    }[]>;
    markNotificationAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: string;
        link: string | null;
        message: string;
        read: boolean;
    }>;
    markAllNotificationsAsRead(ctx: any): Promise<number>;
}
