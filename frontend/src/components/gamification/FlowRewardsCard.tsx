import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Droplets, Waves, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FlowRewardsCardProps {
  points: number;
  tier: string;
  userName: string;
  compact?: boolean;
}

const TIERS = {
  RIPPLE: {
    name: 'Ripple',
    min: 0,
    max: 999,
    color: 'from-blue-400 to-cyan-300',
    icon: Droplets,
    next: 'WAVE',
    nextThreshold: 1000,
    benefits: ['Acceso a ofertas básicas', '5% de descuento en cumpleaños']
  },
  WAVE: {
    name: 'Wave',
    min: 1000,
    max: 4999,
    color: 'from-indigo-500 to-blue-500',
    icon: Waves,
    next: 'SURFER',
    nextThreshold: 5000,
    benefits: ['Todo lo de Ripple', 'Early Access a nuevos alojamientos', 'Soporte prioritario']
  },
  SURFER: {
    name: 'Surfer',
    min: 5000,
    max: Infinity,
    color: 'from-purple-600 to-pink-500',
    icon: Crown,
    next: 'LEGEND',
    nextThreshold: Infinity,
    benefits: ['Todo lo de Wave', 'Concierge personal', 'Regalos exclusivos']
  }
};

export const FlowRewardsCard: React.FC<FlowRewardsCardProps> = ({ points, tier, userName, compact = false }) => {
  const currentTier = TIERS[tier as keyof typeof TIERS] || TIERS.RIPPLE;
  const nextTierName = currentTier.next;
  const progress = currentTier.nextThreshold === Infinity 
    ? 100 
    : Math.min(100, ((points - currentTier.min) / (currentTier.nextThreshold - currentTier.min)) * 100);

  const Icon = currentTier.icon;

  if (compact) {
    return (
      <Link href="/dashboard" className="block group">
        <div className={`bg-gradient-to-r ${currentTier.color} p-4 rounded-xl text-white shadow-lg transition-transform group-hover:scale-[1.02]`}>
          <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">{currentTier.name}</span>
              </div>
              <span className="font-mono font-bold">{points} FP</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-white/90"
              />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
        {/* Background Pattern */}
        <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${currentTier.color}`} />
        
        <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">FlowRewards</h3>
                    <h2 className="text-2xl font-bold text-gray-900">Hola, {userName}</h2>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${currentTier.color} text-white shadow-lg transform rotate-3`}>
                    <Icon className="w-8 h-8" />
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <span className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${currentTier.color}`}>
                        {points}
                    </span>
                    <span className="text-gray-500 text-sm font-medium mb-1">FlowPoints</span>
                </div>
                
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-2">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${currentTier.color}`}
                    />
                </div>
                
                {currentTier.nextThreshold !== Infinity ? (
                    <p className="text-xs text-gray-500 text-right">
                        Faltan {currentTier.nextThreshold - points} para {nextTierName}
                    </p>
                ) : (
                    <p className="text-xs text-gray-500 text-right">¡Nivel Máximo!</p>
                )}
            </div>

            <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Beneficios actuales
                </h4>
                <ul className="space-y-2">
                    {currentTier.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            {benefit}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <Button variant="outline" className="w-full text-sm">
                    Ver historial de puntos
                </Button>
            </div>
        </div>
    </div>
  );
};
