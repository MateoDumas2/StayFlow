import { PrismaService } from '../prisma.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { Booking } from './entities/booking.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class BookingsService {
    private prisma;
    private usersService;
    private notificationsService;
    constructor(prisma: PrismaService, usersService: UsersService, notificationsService: NotificationsService);
    create(createBookingInput: CreateBookingInput, userId: string): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findByUserId(userId: string): Promise<Booking[]>;
    private transformBooking;
    findOne(id: string): Promise<Booking>;
}
