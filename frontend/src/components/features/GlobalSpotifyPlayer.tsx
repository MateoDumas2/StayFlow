'use client';

import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Music2, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ME_QUERY = gql`
  query MeForPlayer {
    me {
      id
      spotifyConnected
    }
  }
`;

export default function GlobalSpotifyPlayer() {
  const { data } = useQuery(ME_QUERY);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const isConnected = !!data?.me?.spotifyConnected;

  if (!isConnected || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={`fixed z-40 transition-all duration-300 ease-in-out shadow-2xl rounded-t-xl overflow-hidden border border-[#1DB954]/30 backdrop-blur-md bg-black/80
          ${isMinimized 
            ? 'bottom-0 left-4 w-64 h-12' 
            : 'bottom-0 left-4 w-80 h-48'
          }`}
      >
        {/* Header / Controls */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1DB954] text-white h-12">
          <div className="flex items-center gap-2">
            <Music2 size={16} />
            <span className="text-xs font-bold">StayFlow Music</span>
          </div>
          <div className="flex items-center gap-1">
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

        {/* Player Iframe */}
        {!isMinimized && (
          <div className="bg-black h-36">
             <iframe
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0"
                width="100%"
                height="152"
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
