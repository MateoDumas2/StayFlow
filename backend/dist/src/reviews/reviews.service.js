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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const users_service_1 = require("../users/users.service");
let ReviewsService = class ReviewsService {
    prisma;
    usersService;
    constructor(prisma, usersService) {
        this.prisma = prisma;
        this.usersService = usersService;
    }
    async findAllByListingId(listingId) {
        return this.prisma.review.findMany({
            where: { listingId },
        });
    }
    async findByUserId(userId) {
        return this.prisma.review.findMany({
            where: { userId },
        });
    }
    async create(createReviewInput, userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        const review = await this.prisma.review.create({
            data: {
                ...createReviewInput,
                userId,
                authorName: user.name,
                authorAvatar: user.avatar || 'https://i.pravatar.cc/150?u=default',
            },
        });
        let points = 500;
        if (createReviewInput.content.length > 50) {
            points += 200;
        }
        await this.usersService.addFlowPoints(userId, points);
        const aggregations = await this.prisma.review.aggregate({
            where: { listingId: createReviewInput.listingId },
            _avg: { rating: true },
        });
        const newRating = aggregations._avg.rating || createReviewInput.rating;
        await this.prisma.listing.update({
            where: { id: createReviewInput.listingId },
            data: { rating: newRating },
        });
        return review;
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map