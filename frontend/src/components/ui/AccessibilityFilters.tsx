"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AccessibilityFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    wheelchair: false,
    stepFree: false,
    wideDoorways: false,
    accessibleBath: false,
    visualAlarms: false
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const applyFilters = () => {
    setIsOpen(false);
    
    const activeFilters = Object.entries(filters)
      .filter(([, isActive]) => isActive)
      .map(([key]) => key);

    const params = new URLSearchParams(searchParams.toString());
    
    if (activeFilters.length > 0) {
      params.set('accessibility', activeFilters.join(','));
    } else {
      params.delete('accessibility');
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsOpen(true)}>
         <span>♿</span> Filtros A11y
      </Button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-border flex justify-between items-center">
                <h2 className="text-xl font-bold text-ink">Accesibilidad Física</h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-muted hover:text-ink">✕</button>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-muted mb-4">Muestra solo alojamientos con estas características verificadas.</p>
                
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <input type="checkbox" checked={filters.wheelchair} onChange={() => toggleFilter('wheelchair')} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                    <span className="text-ink font-medium">Acceso para silla de ruedas</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <input type="checkbox" checked={filters.stepFree} onChange={() => toggleFilter('stepFree')} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                    <span className="text-ink font-medium">Entrada sin escalones</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <input type="checkbox" checked={filters.wideDoorways} onChange={() => toggleFilter('wideDoorways')} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                    <span className="text-ink font-medium">Puertas anchas (+32&quot;)</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <input type="checkbox" checked={filters.accessibleBath} onChange={() => toggleFilter('accessibleBath')} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                    <span className="text-ink font-medium">Baño adaptado</span>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <input type="checkbox" checked={filters.visualAlarms} onChange={() => toggleFilter('visualAlarms')} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                    <span className="text-ink font-medium">Alarmas visuales/estroboscópicas</span>
                </label>
              </div>

              <div className="p-6 border-t border-gray-border bg-gray-50 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button variant="primary" onClick={applyFilters}>Mostrar resultados</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
