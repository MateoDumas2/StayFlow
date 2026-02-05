import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

declare const fetch: any;

@Injectable()
export class SpotifyService {
  private clientId = process.env.SPOTIFY_CLIENT_ID || '';
  private clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  private redirectUri =
    process.env.SPOTIFY_REDIRECT_URI ||
    (process.env.NODE_ENV === 'production'
      ? 'https://stayflow.onrender.com/spotify/callback'
      : 'http://localhost:4011/spotify/callback');

  constructor(private readonly usersService: UsersService) {}

  private get isDemoMode() {
    return !this.clientId || this.clientId === 'YOUR_SPOTIFY_CLIENT_ID_HERE';
  }

  getAuthorizeUrl(userId: string) {
    if (this.isDemoMode) {
      console.warn('SpotifyService running in DEMO mode');
      // In demo mode, we skip Spotify and go straight to our callback with a fake code
      const state = Buffer.from(
        JSON.stringify({ u: userId, t: Date.now() }),
      ).toString('base64url');
      return `${this.redirectUri}?code=DEMO_CODE&state=${state}`;
    }

    const state = Buffer.from(
      JSON.stringify({
        u: userId,
        t: Date.now(),
      }),
    ).toString('base64url');

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: 'user-read-email user-read-private user-top-read',
      state,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  decodeState(state: string): { userId: string } | null {
    try {
      const json = Buffer.from(state, 'base64url').toString('utf8');
      const parsed = JSON.parse(json);
      if (!parsed.u) return null;
      return { userId: String(parsed.u) };
    } catch {
      return null;
    }
  }

  async exchangeCodeForTokens(code: string) {
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
      accessToken: data.access_token as string,
      refreshToken: data.refresh_token as string,
      expiresIn: data.expires_in as number,
    };
  }

  async fetchProfile(accessToken: string) {
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

  async handleCallback(code: string, state: string) {
    const decoded = this.decodeState(state);
    if (!decoded) {
      throw new Error('Invalid Spotify state');
    }

    let tokenData;
    let profile;

    if (code === 'DEMO_CODE') {
      // Fake data for demo mode
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
    } else {
      tokenData = await this.exchangeCodeForTokens(code);
      profile = await this.fetchProfile(tokenData.accessToken);
    }

    const expiresAt = new Date(
      Date.now() + tokenData.expiresIn * 1000,
    );

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
}

