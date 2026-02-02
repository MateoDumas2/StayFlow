"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SearchWithVoice() {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Voice Recognition Logic
  const startListening = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(t('voice.not_supported'));
      return;
    }

    // @ts-expect-error - Types for SpeechRecognition are not globally available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setShowModal(true);
      setTranscript(t('voice.listening'));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      processCommand(text);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => setShowModal(false), 2000);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      // Quiet error handling
      setTranscript(t('voice.not_understood'));
      setIsListening(false);
    };

    recognition.start();
  };

  const processCommand = (text: string) => {
    const lower = text.toLowerCase();
    
    // Simple command parsing for Vibes
    if (lower.includes('playa') || lower.includes('relax')) {
        router.push('/?vibe=Relax');
    } else if (lower.includes('aventura') || lower.includes('montaña')) {
        router.push('/?vibe=Aventura');
    } else if (lower.includes('ciudad') || lower.includes('urbano')) {
        router.push('/?vibe=Urbano');
    } else if (lower.includes('lujo') || lower.includes('caro')) {
        router.push('/?vibe=Lujo');
    } else {
        // General search for location or title
        if (text.trim()) {
            router.push(`/?search=${encodeURIComponent(text.trim())}`);
        }
    }
  };

  const handleManualSearch = () => {
    if (transcript) {
        processCommand(transcript);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleManualSearch();
    }
  };

  return (
    <>
      <div 
        className="flex w-full max-w-md items-center justify-between rounded-full border border-gray-300 bg-white pl-6 pr-2 py-2.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
        onClick={() => document.getElementById('global-search-input')?.focus()}
      >
        <div className="flex-1 flex flex-col justify-center">
            <span className="text-xs font-bold text-ink px-1">{t('header.search_destinations')}</span>
            <input 
                id="global-search-input"
                type="text" 
                placeholder={t('header.search_placeholder')}
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-600 placeholder:text-gray-400 outline-none p-0 px-1"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
        
        <div className="flex items-center gap-2">
            {/* Voice Button */}
            <button 
                onClick={startListening}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-500 hover:bg-gray-100'}`}
                title={t('voice.button_title')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>

            {/* Search Button (Pink Circle) */}
            <button 
                onClick={handleManualSearch}
                className="bg-primary hover:bg-primary-dark text-white p-2.5 rounded-full transition-colors shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
            </button>
        </div>
      </div>

      {/* Voice Feedback Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-ink/90 backdrop-blur text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 min-w-[300px] justify-center"
          >
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
            <p className="font-medium text-lg">&quot;{transcript}&quot;</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
