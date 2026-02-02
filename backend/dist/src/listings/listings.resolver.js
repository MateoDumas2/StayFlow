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
exports.ListingsResolver = exports.HostStats = void 0;
const graphql_1 = require("@nestjs/graphql");
const jwt = __importStar(require("jsonwebtoken"));
const listings_service_1 = require("./listings.service");
const listing_entity_1 = require("./entities/listing.entity");
const create_listing_dto_1 = require("./dto/create-listing.dto");
const reviews_service_1 = require("../reviews/reviews.service");
const review_entity_1 = require("../reviews/entities/review.entity");
let HostStats = class HostStats {
    activeListings;
    totalBookings;
    totalRevenue;
};
exports.HostStats = HostStats;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], HostStats.prototype, "activeListings", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], HostStats.prototype, "totalBookings", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], HostStats.prototype, "totalRevenue", void 0);
exports.HostStats = HostStats = __decorate([
    (0, graphql_1.ObjectType)()
], HostStats);
let ListingsResolver = class ListingsResolver {
    listingsService;
    reviewsService;
    constructor(listingsService, reviewsService) {
        this.listingsService = listingsService;
        this.reviewsService = reviewsService;
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
    findAll(search, vibe, accessibility, maxTravelTime) {
        return this.listingsService.findAll(search, vibe, accessibility, maxTravelTime);
    }
    findOne(id) {
        return this.listingsService.findOne(id);
    }
    myListings(ctx) {
        const userId = this.getUserId(ctx);
        return this.listingsService.findAllByHost(userId);
    }
    hostStats(ctx) {
        const userId = this.getUserId(ctx);
        return this.listingsService.getHostStats(userId);
    }
    createListing(createListingInput, ctx) {
        const userId = this.getUserId(ctx);
        return this.listingsService.create(createListingInput, userId);
    }
    removeListing(id) {
        return this.listingsService.remove(id);
    }
    reviews(listing) {
        return this.reviewsService.findAllByListingId(listing.id);
    }
    amenities(listing) {
        if (!listing.amenities)
            return [];
        if (Array.isArray(listing.amenities))
            return listing.amenities;
        if (typeof listing.amenities === 'string')
            return listing.amenities.split(',');
        return [];
    }
    vibes(listing) {
        if (!listing.vibes)
            return [];
        if (Array.isArray(listing.vibes))
            return listing.vibes;
        if (typeof listing.vibes === 'string')
            return listing.vibes.split(',');
        return [];
    }
    accessibilityFeatures(listing) {
        if (!listing.accessibilityFeatures)
            return [];
        if (Array.isArray(listing.accessibilityFeatures))
            return listing.accessibilityFeatures;
        if (typeof listing.accessibilityFeatures === 'string')
            return listing.accessibilityFeatures.split(',');
        return [];
    }
};
exports.ListingsResolver = ListingsResolver;
__decorate([
    (0, graphql_1.Query)(() => [listing_entity_1.Listing], { name: 'listings' }),
    __param(0, (0, graphql_1.Args)('search', { type: () => String, nullable: true })),
    __param(1, (0, graphql_1.Args)('vibe', { type: () => String, nullable: true })),
    __param(2, (0, graphql_1.Args)('accessibility', { type: () => [String], nullable: true })),
    __param(3, (0, graphql_1.Args)('maxTravelTime', { type: () => graphql_1.Float, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array, Number]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => listing_entity_1.Listing, { name: 'listing' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [listing_entity_1.Listing], { name: 'myListings' }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "myListings", null);
__decorate([
    (0, graphql_1.Query)(() => HostStats, { name: 'hostStats' }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "hostStats", null);
__decorate([
    (0, graphql_1.Mutation)(() => listing_entity_1.Listing),
    __param(0, (0, graphql_1.Args)('createListingInput')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_listing_dto_1.CreateListingDto, Object]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "createListing", null);
__decorate([
    (0, graphql_1.Mutation)(() => listing_entity_1.Listing),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "removeListing", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [review_entity_1.Review]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listing_entity_1.Listing]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "reviews", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [String], { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "amenities", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [String], { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "vibes", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [String], { nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListingsResolver.prototype, "accessibilityFeatures", null);
exports.ListingsResolver = ListingsResolver = __decorate([
    (0, graphql_1.Resolver)(() => listing_entity_1.Listing),
    __metadata("design:paramtypes", [listings_service_1.ListingsService,
        reviews_service_1.ReviewsService])
], ListingsResolver);
//# sourceMappingURL=listings.resolver.js.map