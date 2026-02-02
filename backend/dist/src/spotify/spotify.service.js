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
exports.SpotifyService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
let SpotifyService = class SpotifyService {
    usersService;
    clientId = process.env.SPOTIFY_CLIENT_ID || '';
    clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
    redirectUri = process.env.SPOTIFY_REDIRECT_URI ||
        'http://127.0.0.1:4000/spotify/callback';
    constructor(usersService) {
        this.usersService = usersService;
    }
    get isDemoMode() {
        return !this.clientId || this.clientId === 'YOUR_SPOTIFY_CLIENT_ID_HERE';
    }
    getAuthorizeUrl(userId) {
        if (this.isDemoMode) {
            console.warn('SpotifyService running in DEMO mode');
            const state = Buffer.from(JSON.stringify({ u: userId, t: Date.now() })).toString('base64url');
            return `${this.redirectUri}?code=DEMO_CODE&state=${state}`;
        }
        const state = Buffer.from(JSON.stringify({
            u: userId,
            t: Date.now(),
        })).toString('base64url');
        const params = new URLSearchParams({
            client_id: this.clientId,
            response_type: 'code',
            redirect_uri: this.redirectUri,
            scope: 'user-read-email user-read-private user-top-read',
            state,
        });
        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }
    decodeState(state) {
        try {
            const json = Buffer.from(state, 'base64url').toString('utf8');
            const parsed = JSON.parse(json);
            if (!parsed.u)
                return null;
            return { userId: String(parsed.u) };
        }
        catch {
            return null;
        }
    }
    async exchangeCodeForTokens(code) {
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });
        if (!res.ok) {
            throw new Error('Failed to exchange Spotify code');
        }
        const data = await res.json();
        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
        };
    }
    async fetchProfile(accessToken) {
        const res = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!res.ok) {
            throw new Error('Failed to fetch Spotify profile');
        }
        return res.json();
    }
    async handleCallback(code, state) {
        const decoded = this.decodeState(state);
        if (!decoded) {
            throw new Error('Invalid Spotify state');
        }
        let tokenData;
        let profile;
        if (code === 'DEMO_CODE') {
            tokenData = {
                accessToken: 'DEMO_ACCESS_TOKEN',
                refreshToken: 'DEMO_REFRESH_TOKEN',
                expiresIn: 3600,
            };
            profile = {
                display_name: 'Usuario Demo',
                email: 'demo@spotify.com',
                id: 'demo_user',
            };
        }
        else {
            tokenData = await this.exchangeCodeForTokens(code);
            profile = await this.fetchProfile(tokenData.accessToken);
        }
        const expiresAt = new Date(Date.now() + tokenData.expiresIn * 1000);
        const user = await this.usersService.setSpotifyTokens(decoded.userId, {
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            expiresAt,
            displayName: profile.display_name,
        });
        return {
            user,
            profile,
        };
    }
};
exports.SpotifyService = SpotifyService;
exports.SpotifyService = SpotifyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], SpotifyService);
//# sourceMappingURL=spotify.service.js.map