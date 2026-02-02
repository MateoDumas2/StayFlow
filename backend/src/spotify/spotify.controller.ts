import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotify: SpotifyService) {}

  @Get('start')
  async start(@Req() req: Request, @Res() res: Response) {
    const auth = String(req.headers.authorization || '');
    const [, token] = auth.split(' ');
    if (!token) {
      res.status(401).send('Not authenticated');
      return;
    }

    let userId: string;
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'DEV_SECRET',
      ) as any;
      userId = String(decoded.sub);
    } catch {
      res.status(401).send('Invalid token');
      return;
    }

    const url = this.spotify.getAuthorizeUrl(userId);
    res.json({ url });
  }

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    if (!code || !state) {
      res.status(400).send('Missing code or state');
      return;
    }

    try {
      await this.spotify.handleCallback(code, state);
      const redirectTarget =
        process.env.SPOTIFY_CONNECTED_REDIRECT ||
        'http://localhost:3001/?spotify=connected';
      res.redirect(redirectTarget);
    } catch (e: any) {
      res
        .status(500)
        .send(e?.message || 'Error processing Spotify callback');
    }
  }
}
