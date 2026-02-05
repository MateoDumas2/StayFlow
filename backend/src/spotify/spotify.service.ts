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
      scope: 'user-read-email user-read-private user-top-read playlist-read-private playlist-read-collaborative',
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

  async refreshAccessToken(refreshToken: string) {
    if (refreshToken === 'DEMO_REFRESH_TOKEN') {
      return {
        accessToken: 'DEMO_ACCESS_TOKEN',
        refreshToken: 'DEMO_REFRESH_TOKEN',
        expiresIn: 3600,
      };
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
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
      throw new Error('Failed to refresh Spotify token');
    }

    const data = await res.json();
    return {
      accessToken: data.access_token as string,
      refreshToken: (data.refresh_token as string) || refreshToken,
      expiresIn: data.expires_in as number,
    };
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

  async fetchUserPlaylists(accessToken: string) {
    if (accessToken === 'DEMO_ACCESS_TOKEN') {
      return [
        {
          id: 'demo1',
          name: 'Vibe Match Demo',
          description: 'A playlist generated for demo purposes',
          images: [{ url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' }],
          uri: 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M',
          externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
        },
        {
          id: 'demo2',
          name: 'Chill Vibes',
          description: 'Relax and unwind',
          images: [{ url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop' }],
          uri: 'spotify:playlist:37i9dQZF1DX4WYpdgoIcn6',
          externalUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
        },
      ];
    }

    try {
      const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=20', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!res.ok) {
        console.error('Failed to fetch playlists:', await res.text());
        return [];
      }

      const data = await res.json();
      return data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        images: item.images,
        uri: item.uri,
        externalUrl: item.external_urls.spotify,
      }));
    } catch (e) {
      console.error('Error fetching playlists:', e);
      return [];
    }
  }
}

