'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AuctionTimer() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 0 });
  const [currentDiscount, setCurrentDiscount] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) {
          setCurrentDiscount(d => Math.min(d + 5, 50)); // Increase discount every hour
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"
      >
        <span>{t('auction.active')}</span>
        <span className="bg-white/20 px-1 rounded">-{currentDiscount}%</span>
      </motion.div>
      
      <div className="bg-black/80 backdrop-blur-md text-white px-3 py-2 rounded-lg text-xs font-mono shadow-xl border border-white/10">
        <span className="text-gray-400 mr-2">{t('auction.ends_in')}</span>
        <span className="font-bold text-red-400">
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
