import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { Booking } from './entities/booking.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private notificationsService: NotificationsService
  ) {}

  async create(createBookingInput: CreateBookingInput, userId: string): Promise<Booking> {
    const checkInDate = new Date(createBookingInput.checkIn);
    const checkOutDate = new Date(createBookingInput.checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (checkInDate >= checkOutDate) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    // Check for overlapping bookings
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        listingId: createBookingInput.listingId,
        status: 'confirmed',
        AND: [
          { checkIn: { lt: createBookingInput.checkOut } },
          { checkOut: { gt: createBookingInput.checkIn } }
        ]
      }
    });

    if (conflictingBooking) {
      throw new BadRequestException('Las fechas seleccionadas ya están reservadas. Por favor elige otras.');
    }

    const booking = await this.prisma.booking.create({
      data: {
        listingId: createBookingInput.listingId,
        checkIn: createBookingInput.checkIn,
        checkOut: createBookingInput.checkOut,
        guests: createBookingInput.guests,
        totalPrice: createBookingInput.totalPrice,
        userId,
        status: 'confirmed',
        isSplitPay: createBookingInput.isSplitPay || false,
        invitedEmails: createBookingInput.invitedEmails ? createBookingInput.invitedEmails.join(',') : null,
      },
      include: {
        listing: true,
      },
    });

    // Award FlowPoints for booking
    // 1000 points per booking
    await this.usersService.addFlowPoints(userId, 1000);

    // Notify User (Guest)
    await this.notificationsService.create(
      userId,
      'BOOKING_CONFIRMED',
      '¡Reserva Confirmada!',
      `Has reservado ${booking.listing.title} para el ${createBookingInput.checkIn}.`,
      `/trips`
    );

    // Notify Host
    if (booking.listing.hostId) {
      await this.notificationsService.create(
        booking.listing.hostId,
        'NEW_BOOKING',
        '¡Nueva Reserva Recibida!',
        `Alguien ha reservado ${booking.listing.title} por $${booking.totalPrice}.`,
        `/host/dashboard`
      );
    }

    return booking as any;
  }

  async findAll(): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({ include: { listing: true } });
    return bookings.map(this.transformBooking);
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: { listing: true },
      orderBy: { checkIn: 'desc' }
    });
    return bookings.map(this.transformBooking);
  }

  private transformBooking(booking: any): any {
    return {
      ...booking,
      listing: booking.listing ? {
        ...booking.listing,
        amenities: booking.listing.amenities ? booking.listing.amenities.split(',') : [],
        vibes: booking.listing.vibes ? booking.listing.vibes.split(',') : [],
        accessibilityFeatures: booking.listing.accessibilityFeatures ? booking.listing.accessibilityFeatures.split(',') : [],
      } : null,
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    if (!booking)
      throw new NotFoundException(`Booking with ID ${id} not found`);
    return booking;
  }
}
