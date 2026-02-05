'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';

const ME_QUERY = gql`
  query MeForSpotify {
    me {
      id
      name
      spotifyConnected
      spotifyDisplayName
    }
  }
`;

const SPOTIFY_START_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_START_URL ||
  'http://localhost:4011/spotify/start';

export default function SpotifyConnect() {
  const router = useRouter();
  const { data, loading, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: 'no-cache',
  });
  const [isLoading, setIsLoading] = useState(false);

  const isConnected = !!data?.me?.spotifyConnected;
  const displayName = data?.me?.spotifyDisplayName || data?.me?.name;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('spotify') === 'connected') {
      refetch();
    }
  }, [refetch]);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const token =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('token')
          : null;
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(SPOTIFY_START_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      if (json?.url && typeof window !== 'undefined') {
        window.location.href = json.url;
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1DB954]/10 to-black/5 p-6 rounded-2xl border border-[#1DB954]/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-ink">
          <span className="text-[#1DB954] text-2xl">🎧</span> Vibe Match
        </h3>
        {isConnected && (
          <span className="text-xs text-emerald-600 font-medium">
            Conectado
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-4"
          >
            <p className="text-sm text-gray-600">
              Conecta tu Spotify para descubrir destinos y poner música
              mientras planificas tu viaje.
            </p>
            <Button
              onClick={handleConnect}
              disabled={isLoading || loading}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-white border-none w-full shadow-lg hover:shadow-[#1DB954]/50 transition-all"
            >
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="animate-spin">⌛</span> Conectando...
                </span>
              ) : (
                'Conectar con Spotify'
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                SF
              </div>
              <div>
                <p className="font-bold text-sm">
                  Hola, {displayName || 'viajero'}
                </p>
                <p className="text-xs text-gray-500">
                  Tu cuenta está conectada. Disfruta de la música en toda la app.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
