"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const jwt = __importStar(require("jsonwebtoken"));
const bookings_service_1 = require("./bookings.service");
const booking_entity_1 = require("./entities/booking.entity");
const create_booking_input_1 = require("./dto/create-booking.input");
const listings_service_1 = require("../listings/listings.service");
const listing_entity_1 = require("../listings/entities/listing.entity");
let BookingsResolver = class BookingsResolver {
    bookingsService;
    listingsService;
    constructor(bookingsService, listingsService) {
        this.bookingsService = bookingsService;
        this.listingsService = listingsService;
    }
    createBooking(createBookingInput, ctx) {
        const userId = this.getUserId(ctx);
        return this.bookingsService.create(createBookingInput, userId);
    }
    getUserId(ctx) {
        const auth = String(ctx.req?.headers?.authorization || '');
        const [, token] = auth.split(' ');
        if (!token)
            throw new Error('Not authenticated');
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DEV_SECRET');
            return decoded.sub;
        }
        catch (e) {
            throw new Error('Invalid token');
        }
    }
    myBookings(ctx) {
        const userId = this.getUserId(ctx);
        return this.bookingsService.findByUserId(userId);
    }
    findOne(id) {
        return this.bookingsService.findOne(id);
    }
    listing(booking) {
        return this.listingsService.findOne(booking.listingId);
    }
};
exports.BookingsResolver = BookingsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => booking_entity_1.Booking),
    __param(0, (0, graphql_1.Args)('createBookingInput')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_input_1.CreateBookingInput, Object]),
    __metadata("design:returntype", void 0)
], BookingsResolver.prototype, "createBooking", null);
__decorate([
    (0, graphql_1.Query)(() => [booking_entity_1.Booking], { name: 'myBookings' }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsResolver.prototype, "myBookings", null);
__decorate([
    (0, graphql_1.Query)(() => booking_entity_1.Booking, { name: 'booking' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.ResolveField)(() => listing_entity_1.Listing),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_entity_1.Booking]),
    __metadata("design:returntype", void 0)
], BookingsResolver.prototype, "listing", null);
exports.BookingsResolver = BookingsResolver = __decorate([
    (0, graphql_1.Resolver)(() => booking_entity_1.Booking),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService,
        listings_service_1.ListingsService])
], BookingsResolver);
//# sourceMappingURL=bookings.resolver.js.map