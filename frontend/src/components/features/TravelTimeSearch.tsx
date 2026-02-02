"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Clock, MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function TravelTimeSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [travelTime, setTravelTime] = useState(3);
  const [location, setLocation] = useState("Mi ubicación actual");
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // In a real app, we would calculate coordinates here
    // For now, we just pass the maxTravelTime to the URL
    params.set('maxTravelTime', travelTime.toString());
    
    router.push(`/?${params.toString()}`);
    setIsOpen(false);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('maxTravelTime');
    router.push(`/?${params.toString()}`);
    setIsOpen(false);
  };

  const currentMaxTime = searchParams.get('maxTravelTime');

  return (
    <div className="relative z-30">
      <Button 
        variant={currentMaxTime ? "primary" : "outline"}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Car size={18} />
        <span className="hidden sm:inline">
            {currentMaxTime ? `< ${currentMaxTime}h viaje` : "Tiempo de Viaje"}
        </span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" 
                onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50"
            >
              <div className="flex items-center gap-2 mb-6 text-ink font-bold text-lg">
                <Clock className="text-primary" />
                <h3>Búsqueda por Tiempo</h3>
              </div>

              <div className="space-y-6">
                <div className="relative">
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Desde</label>
                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <MapPin size={16} className="text-gray-400" />
                        <input 
                            type="text" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-transparent w-full text-sm font-medium text-ink outline-none"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tiempo Máximo</label>
                        <span className="text-primary font-bold text-lg">{travelTime}h</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="0.5"
                        value={travelTime}
                        onChange={(e) => setTravelTime(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
                        <span>1h</span>
                        <span>5h</span>
                        <span>10h</span>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    {currentMaxTime && (
                        <Button variant="ghost" size="sm" onClick={clearSearch} className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50">
                            Limpiar
                        </Button>
                    )}
                    <Button variant="primary" size="sm" onClick={handleSearch} className="flex-1">
                        Buscar Destinos
                    </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
