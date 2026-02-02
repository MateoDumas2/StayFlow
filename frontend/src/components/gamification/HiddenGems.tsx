'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Lock } from 'lucide-react';
import Image from 'next/image';

const gems = [
  {
    id: 1,
    name: "La Cueva del Pescador",
    type: "Restaurante Secreto",
    description: "Solo los locales conocen este lugar. Pregunta por Doña María.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    coords: "A 5 min caminando"
  },
  {
    id: 2,
    name: "Mirador de los Suspiros",
    type: "Vista Panorámica",
    description: "El mejor atardecer de la ciudad, sin turistas.",
    image: "https://images.unsplash.com/photo-1534234828563-0253185c707d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    coords: "A 15 min en bici"
  },
  {
    id: 3,
    name: "Bar Clandestino 1920",
    type: "Speakeasy",
    description: "La contraseña es 'StayFlow' en la puerta verde.",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    coords: "Callejón trasero"
  }
];

export default function HiddenGems() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8 rounded-3xl text-white overflow-hidden relative shadow-2xl w-full max-w-4xl mx-auto my-8">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      <div className="relative z-10 text-center mb-8">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-2">
          💎 Gemas Ocultas Desbloqueadas
        </h2>
        <p className="text-gray-300">
          Por reservar con StayFlow, te revelamos 3 secretos locales que no están en las guías.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {gems.map((gem, index) => (
          <motion.div
            key={gem.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 + 0.5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:scale-105 transition-transform group"
          >
            <div className="relative h-40">
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-transparent transition-colors z-20">
                {!unlocked && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setUnlocked(true)}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                  >
                    <Lock size={16} /> Revelar Secreto
                  </motion.button>
                )}
              </div>
              <Image 
                src={gem.image} 
                alt={gem.name} 
                fill 
                className={`object-cover transition-all duration-700 ${unlocked ? 'blur-0' : 'blur-xl'}`}
                unoptimized
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg leading-tight">{unlocked ? gem.name : "???"}</h3>
                <span className="text-xs bg-purple-500/30 px-2 py-1 rounded text-purple-200 border border-purple-500/50">
                  {gem.type}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-4 h-10">
                {unlocked ? gem.description : "Desbloquea para ver la descripción..."}
              </p>

              <div className="flex items-center gap-2 text-xs text-yellow-400 font-mono">
                <MapPin size={12} />
                {unlocked ? gem.coords : "Ubicación oculta"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
