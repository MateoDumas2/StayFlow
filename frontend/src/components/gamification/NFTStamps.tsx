'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const stamps = [
  { id: 1, city: "Tulum", country: "México", date: "Ene 2026", image: "https://images.unsplash.com/photo-1552074291-ad4dfdc360d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", artist: "@mexican_art", rarity: "Común" },
  { id: 2, city: "Medellín", country: "Colombia", date: "Dic 2025", image: "https://images.unsplash.com/photo-1599582428965-031f7743d56f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", artist: "@paisa_design", rarity: "Raro" },
  { id: 3, city: "Tokyo", country: "Japón", date: "Nov 2025", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80", artist: "@akira_draws", rarity: "Legendario" },
];

export default function NFTStamps() {
  const [selectedStamp, setSelectedStamp] = useState<typeof stamps[0] | null>(null);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-ink mb-4 flex items-center justify-between">
        <span>Pasaporte Digital (NFTs)</span>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Beta</span>
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        {stamps.map((stamp) => (
          <motion.div
            key={stamp.id}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedStamp(stamp)}
            className={`aspect-[3/4] rounded-lg overflow-hidden relative cursor-pointer border-2 ${
              stamp.rarity === 'Legendario' ? 'border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 
              stamp.rarity === 'Raro' ? 'border-purple-400' : 'border-gray-200'
            }`}
          >
            <Image src={stamp.image} alt={stamp.city} fill className="object-cover" unoptimized />
            <div className="absolute bottom-0 w-full bg-black/60 text-white text-[10px] text-center py-1 backdrop-blur-sm">
              {stamp.city}
            </div>
            
            {/* Stamp Effect Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grunge-wall.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
          </motion.div>
        ))}
        
        {/* Empty Slot */}
        <div className="aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 opacity-50">
          <span className="text-2xl grayscale">✈️</span>
        </div>
      </div>

      <AnimatePresence>
        {selectedStamp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStamp(null)}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white p-2 rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden relative"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                 <Image src={selectedStamp.image} alt={selectedStamp.city} fill className="object-cover" unoptimized />
                 <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full border border-white/20">
                   #{selectedStamp.id}8492
                 </div>
              </div>
              
              <div className="px-4 pb-4 text-center">
                <h2 className="text-2xl font-bold text-ink mb-1">{selectedStamp.city}, {selectedStamp.country}</h2>
                <p className="text-gray-400 text-sm mb-4">Visitado en {selectedStamp.date}</p>
                
                <div className="grid grid-cols-2 gap-4 text-left text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Artista</p>
                    <p className="font-medium text-primary">{selectedStamp.artist}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Rareza</p>
                    <p className={`font-bold ${
                      selectedStamp.rarity === 'Legendario' ? 'text-yellow-500' : 
                      selectedStamp.rarity === 'Raro' ? 'text-purple-500' : 'text-gray-600'
                    }`}>{selectedStamp.rarity}</p>
                  </div>
                </div>
                
                <button className="mt-4 w-full py-2 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors">
                  Ver en Blockchain
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
