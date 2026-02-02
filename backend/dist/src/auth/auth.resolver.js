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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const users_service_1 = require("../users/users.service");
const register_input_1 = require("../users/dto/register.input");
const login_input_1 = require("../users/dto/login.input");
const user_entity_1 = require("../users/entities/user.entity");
const listing_entity_1 = require("../listings/entities/listing.entity");
const jwt = __importStar(require("jsonwebtoken"));
const update_user_input_1 = require("../users/dto/update-user.input");
let AuthPayload = class AuthPayload {
    token;
    user;
};
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], AuthPayload.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], AuthPayload.prototype, "user", void 0);
AuthPayload = __decorate([
    (0, graphql_1.ObjectType)()
], AuthPayload);
let AuthResolver = class AuthResolver {
    users;
    constructor(users) {
        this.users = users;
    }
    async register(input) {
        const user = await this.users.create(input.email, input.name, input.password, input.role);
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'DEV_SECRET', {
            expiresIn: '7d',
        });
        return { token, user };
    }
    async login(input) {
        const user = await this.users.validate(input.email, input.password);
        if (!user)
            throw new Error('Invalid credentials');
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET || 'DEV_SECRET', {
            expiresIn: '7d',
        });
        return { token, user };
    }
    async updateProfile(input, ctx) {
        const auth = String(ctx.req?.headers?.authorization || '');
        const [, token] = auth.split(' ');
        if (!token)
            throw new Error('Not authenticated');
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DEV_SECRET');
            return await this.users.update(decoded.sub, input);
        }
        catch (e) {
            throw new Error('Invalid token or user not found');
        }
    }
    async toggleFavorite(listingId, ctx) {
        const auth = String(ctx.req?.headers?.authorization || '');
        const [, token] = auth.split(' ');
        if (!token)
            throw new Error('Not authenticated');
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DEV_SECRET');
            return await this.users.toggleFavorite(decoded.sub, listingId);
        }
        catch (e) {
            throw new Error('Invalid token or user not found');
        }
    }
    async favorites(user) {
        if (user.favorites)
            return user.favorites;
        return this.users.getFavorites(user.id);
    }
    async me(ctx) {
        const auth = String(ctx.req?.headers?.authorization || '');
        const [, token] = auth.split(' ');
        if (!token)
            return null;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'DEV_SECRET');
            return await this.users.findById(decoded.sub);
        }
        catch {
            return null;
        }
    }
    ping() {
        return 'pong';
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Mutation)(() => AuthPayload),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_input_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "register", null);
__decorate([
    (0, graphql_1.Mutation)(() => AuthPayload),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_input_1.LoginInput]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_entity_1.User),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_input_1.UpdateUserInput, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "updateProfile", null);
__decorate([
    (0, graphql_1.Mutation)(() => user_entity_1.User),
    __param(0, (0, graphql_1.Args)('listingId')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "toggleFavorite", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [listing_entity_1.Listing]),
    __param(0, (0, graphql_1.Parent)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "favorites", null);
__decorate([
    (0, graphql_1.Query)(() => user_entity_1.User, { nullable: true }),
    __param(0, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "me", null);
__decorate([
    (0, graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthResolver.prototype, "ping", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(() => user_entity_1.User),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map