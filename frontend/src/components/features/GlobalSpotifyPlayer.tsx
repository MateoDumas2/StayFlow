'use client';

import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music2, Minimize2, Maximize2, ListMusic } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ME_QUERY = gql`
  query MeForPlayer {
    me {
      id
      spotifyConnected
    }
  }
`;

const MY_PLAYLISTS_QUERY = gql`
  query MySpotifyPlaylists {
    mySpotifyPlaylists {
      id
      name
      uri
    }
  }
`;

export default function GlobalSpotifyPlayer() {
  const { data } = useQuery(ME_QUERY);
  const isConnected = !!data?.me?.spotifyConnected;

  const { data: playlistsData } = useQuery(MY_PLAYLISTS_QUERY, {
    skip: !isConnected,
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentUri, setCurrentUri] = useState('spotify:playlist:37i9dQZF1DXcBWIGoYBM5M');
  const [showPlaylists, setShowPlaylists] = useState(false);

  if (!isConnected || !isVisible) return null;

  const embedUrl = `https://open.spotify.com/embed/playlist/${currentUri.split(':').pop()}?utm_source=generator&theme=0`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed z-50 transition-all duration-300 ease-in-out shadow-2xl rounded-t-xl overflow-hidden border border-[#1DB954]/30 backdrop-blur-md bg-black/80
          ${isMinimized 
            ? 'bottom-0 left-4 w-64 h-12' 
            : 'bottom-0 left-4 w-80 h-64'
          }`}
      >
        {/* Header / Controls */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1DB954] text-white h-12 relative z-20">
          <div className="flex items-center gap-2">
            <Music2 size={16} />
            <span className="text-xs font-bold">StayFlow Music</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowPlaylists(!showPlaylists)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Mis Playlists"
            >
              <ListMusic size={14} />
            </button>
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Playlist Selector Overlay */}
        <AnimatePresence>
          {showPlaylists && !isMinimized && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 top-12 bg-black/95 z-30 overflow-y-auto p-2"
            >
              <h3 className="text-xs font-bold text-[#1DB954] mb-2 sticky top-0 bg-black/95 py-1">Mis Playlists</h3>
              <div className="space-y-1">
                {playlistsData?.mySpotifyPlaylists?.map((p: any) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentUri(p.uri);
                      setShowPlaylists(false);
                    }}
                    className="w-full text-left text-xs text-white/80 p-2 hover:bg-[#1DB954]/20 hover:text-white rounded transition-colors truncate border-b border-white/5 last:border-0"
                  >
                    {p.name}
                  </button>
                ))}
                {(!playlistsData?.mySpotifyPlaylists || playlistsData.mySpotifyPlaylists.length === 0) && (
                  <p className="text-xs text-white/50 p-2">No se encontraron playlists</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player Iframe */}
        {!isMinimized && (
          <div className="bg-black h-52 relative z-10">
             <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="border-none"
              />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
