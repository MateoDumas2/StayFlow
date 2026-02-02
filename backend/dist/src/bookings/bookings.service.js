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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const users_service_1 = require("../users/users.service");
const notifications_service_1 = require("../notifications/notifications.service");
let BookingsService = class BookingsService {
    prisma;
    usersService;
    notificationsService;
    constructor(prisma, usersService, notificationsService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.notificationsService = notificationsService;
    }
    async create(createBookingInput, userId) {
        const checkInDate = new Date(createBookingInput.checkIn);
        const checkOutDate = new Date(createBookingInput.checkOut);
        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        if (checkInDate >= checkOutDate) {
            throw new common_1.BadRequestException('Check-out date must be after check-in date');
        }
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
            throw new common_1.BadRequestException('Las fechas seleccionadas ya están reservadas. Por favor elige otras.');
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
        await this.usersService.addFlowPoints(userId, 1000);
        await this.notificationsService.create(userId, 'BOOKING_CONFIRMED', '¡Reserva Confirmada!', `Has reservado ${booking.listing.title} para el ${createBookingInput.checkIn}.`, `/trips`);
        if (booking.listing.hostId) {
            await this.notificationsService.create(booking.listing.hostId, 'NEW_BOOKING', '¡Nueva Reserva Recibida!', `Alguien ha reservado ${booking.listing.title} por $${booking.totalPrice}.`, `/host/dashboard`);
        }
        return booking;
    }
    async findAll() {
        const bookings = await this.prisma.booking.findMany({ include: { listing: true } });
        return bookings.map(this.transformBooking);
    }
    async findByUserId(userId) {
        const bookings = await this.prisma.booking.findMany({
            where: { userId },
            include: { listing: true },
            orderBy: { checkIn: 'desc' }
        });
        return bookings.map(this.transformBooking);
    }
    transformBooking(booking) {
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
    async findOne(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
        });
        if (!booking)
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        return booking;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        notifications_service_1.NotificationsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map