import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { SpotifyModule } from '../spotify/spotify.module';

@Module({
  imports: [UsersModule, SpotifyModule],
  providers: [AuthResolver],
})
export class AuthModule {}
