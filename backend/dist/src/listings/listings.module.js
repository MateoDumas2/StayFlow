"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsModule = void 0;
const common_1 = require("@nestjs/common");
const listings_service_1 = require("./listings.service");
const listings_resolver_1 = require("./listings.resolver");
const reviews_module_1 = require("../reviews/reviews.module");
const prisma_module_1 = require("../prisma.module");
let ListingsModule = class ListingsModule {
};
exports.ListingsModule = ListingsModule;
exports.ListingsModule = ListingsModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => reviews_module_1.ReviewsModule), prisma_module_1.PrismaModule],
        providers: [listings_resolver_1.ListingsResolver, listings_service_1.ListingsService],
        exports: [listings_service_1.ListingsService],
    })
], ListingsModule);
//# sourceMappingURL=listings.module.js.map