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
exports.Listing = void 0;
const graphql_1 = require("@nestjs/graphql");
const review_entity_1 = require("../../reviews/entities/review.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
let Listing = class Listing {
    id;
    title;
    location;
    price;
    rating;
    imageUrl;
    description;
    amenities;
    vibes;
    accessibilityFeatures;
    travelTime;
    reviews;
    status;
    bookings;
};
exports.Listing = Listing;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Listing.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Listing.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Listing.prototype, "location", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Listing.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Listing.prototype, "rating", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Listing.prototype, "imageUrl", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Listing.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Listing.prototype, "amenities", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Listing.prototype, "vibes", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Listing.prototype, "accessibilityFeatures", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "travelTime", void 0);
__decorate([
    (0, graphql_1.Field)(() => [review_entity_1.Review], { nullable: true }),
    __metadata("design:type", Array)
], Listing.prototype, "reviews", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Listing.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => [booking_entity_1.Booking], { nullable: true }),
    __metadata("design:type", Array)
], Listing.prototype, "bookings", void 0);
exports.Listing = Listing = __decorate([
    (0, graphql_1.ObjectType)()
], Listing);
//# sourceMappingURL=listing.entity.js.map