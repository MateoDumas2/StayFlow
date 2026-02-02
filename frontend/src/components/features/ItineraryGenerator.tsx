'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

export default function ItineraryGenerator({ location }: { location: string }) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(t('itinerary.steps.starting'));

  const generateItinerary = () => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulation steps
    const steps = [
      { p: 10, t: t('itinerary.steps.analyzing') },
      { p: 30, t: t('itinerary.steps.restaurants') },
      { p: 50, t: t('itinerary.steps.activities') },
      { p: 70, t: t('itinerary.steps.routes') },
      { p: 90, t: t('itinerary.steps.pdf') },
      { p: 100, t: t('itinerary.steps.done') }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setIsGenerating(false);
        setIsDone(true);
        return;
      }
      setProgress(steps[currentStep].p);
      setStatusText(steps[currentStep].t);
      currentStep++;
    }, 800);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="text-9xl">🗺️</span>
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-ink mb-2">{t('itinerary.title')}</h3>
        <p className="text-gray-muted mb-6">
          {t('itinerary.description', { location })}
        </p>

        {!isGenerating && !isDone && (
          <Button 
            onClick={generateItinerary}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-lg hover:shadow-indigo-500/30"
          >
            {t('itinerary.generate_btn')}
          </Button>
        )}

        {isGenerating && (
          <div className="space-y-4">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-center font-medium text-indigo-600 animate-pulse">
              {statusText}
            </p>
          </div>
        )}

        {isDone && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <p className="font-bold text-ink">{t('itinerary.ready_title')}</p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                {t('itinerary.download_pdf')}
              </Button>
              <Button variant="ghost" className="w-full text-gray-500" onClick={() => setIsDone(false)}>
                {t('itinerary.generate_new')}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
