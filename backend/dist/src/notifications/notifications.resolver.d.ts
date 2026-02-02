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
        message: string;
        read: boolean;
        link: string | null;
    }[]>;
    markNotificationAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        userId: string;
        type: string;
        message: string;
        read: boolean;
        link: string | null;
    }>;
    markAllNotificationsAsRead(ctx: any): Promise<number>;
}
