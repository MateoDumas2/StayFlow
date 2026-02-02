import { UsersService } from '../users/users.service';
export declare class SpotifyService {
    private readonly usersService;
    private clientId;
    private clientSecret;
    private redirectUri;
    constructor(usersService: UsersService);
    private get isDemoMode();
    getAuthorizeUrl(userId: string): string;
    decodeState(state: string): {
        userId: string;
    } | null;
    exchangeCodeForTokens(code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    fetchProfile(accessToken: string): Promise<any>;
    handleCallback(code: string, state: string): Promise<{
        user: import("../users/users.service").AuthUser;
        profile: any;
    }>;
}
