import { Listing } from '../../listings/entities/listing.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    createdAt: Date;
    spotifyConnected?: boolean;
    spotifyDisplayName?: string;
    flowPoints: number;
    flowTier: string;
    favorites?: Listing[];
}
