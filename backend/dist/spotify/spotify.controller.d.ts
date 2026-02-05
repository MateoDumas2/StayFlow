import type { Response, Request } from 'express';
import { SpotifyService } from './spotify.service';
export declare class SpotifyController {
    private readonly spotify;
    constructor(spotify: SpotifyService);
    start(req: Request, res: Response): Promise<void>;
    callback(code: string, state: string, res: Response): Promise<void>;
}
