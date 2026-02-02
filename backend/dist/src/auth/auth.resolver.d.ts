import { UsersService } from '../users/users.service';
import { RegisterInput } from '../users/dto/register.input';
import { LoginInput } from '../users/dto/login.input';
import { User } from '../users/entities/user.entity';
import { UpdateUserInput } from '../users/dto/update-user.input';
export declare class AuthResolver {
    private readonly users;
    constructor(users: UsersService);
    register(input: RegisterInput): Promise<{
        token: string;
        user: import("../users/users.service").AuthUser;
    }>;
    login(input: LoginInput): Promise<{
        token: string;
        user: import("../users/users.service").AuthUser;
    }>;
    updateProfile(input: UpdateUserInput, ctx: any): Promise<import("../users/users.service").AuthUser>;
    toggleFavorite(listingId: string, ctx: any): Promise<import("../users/users.service").AuthUser>;
    favorites(user: User): Promise<any[]>;
    me(ctx: any): Promise<import("../users/users.service").AuthUser | null>;
    ping(): string;
}
