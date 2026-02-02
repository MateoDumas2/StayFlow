"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

interface AIImageDescriberProps {
  imageUrl: string;
  context?: string;
}

export default function AIImageDescriber({ imageUrl, context = "propiedad" }: AIImageDescriberProps) {
  const { t } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [description, setDescription] = useState<string | null>(null);

  const generateDescription = () => {
    setIsAnalyzing(true);
    
    // Simulate AI Processing time
    setTimeout(() => {
      // Mock AI response based on keywords in URL or random context
      const descriptions = [
        t('ai_describer.descriptions.1', { context }),
        t('ai_describer.descriptions.2', { context }),
        t('ai_describer.descriptions.3', { context }),
        t('ai_describer.descriptions.4', { context })
      ];
      
      // Simple deterministic selection based on string length to seem "consistent" for the same image
      const index = imageUrl.length % descriptions.length;
      setDescription(descriptions[index]);
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <AnimatePresence mode="wait">
        {!description && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Button 
              onClick={generateDescription}
              variant="secondary"
              className="bg-black/60 backdrop-blur-md text-white border-none hover:bg-black/80 flex items-center gap-2 shadow-lg"
              size="sm"
            >
              <Sparkles size={16} className="text-purple-400" />
              <span className="text-xs font-medium">{t('ai_describer.button')}</span>
            </Button>
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-3 shadow-lg"
          >
            <Loader2 size={16} className="animate-spin text-purple-400" />
            <span className="text-xs font-medium">{t('ai_describer.analyzing')}</span>
          </motion.div>
        )}

        {description && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="bg-black/80 backdrop-blur-xl text-white p-4 rounded-xl max-w-sm shadow-2xl border border-white/10"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles size={14} />
                <span>{t('ai_describer.completed')}</span>
              </div>
              <button 
                onClick={() => setDescription(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm leading-relaxed text-gray-100 font-light">
              {description}
            </p>
            <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">{t('ai_describer.confidence')}</span>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">{t('ai_describer.objects')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
