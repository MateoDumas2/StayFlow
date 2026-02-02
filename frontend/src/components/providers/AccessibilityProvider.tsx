"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  isDyslexic: boolean;
  isHighContrast: boolean;
  isReducedMotion: boolean;
  toggleDyslexic: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isDyslexic, setIsDyslexic] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage or system preferences
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const savedDyslexic = localStorage.getItem('sf-dyslexic') === 'true';
    const savedHighContrast = localStorage.getItem('sf-high-contrast') === 'true';
    const savedReducedMotion = localStorage.getItem('sf-reduced-motion') === 'true';
    
    // System preference for reduced motion
    const systemReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (savedDyslexic) setIsDyslexic(true);
    if (savedHighContrast) setIsHighContrast(true);
    if (savedReducedMotion || systemReducedMotion) setIsReducedMotion(true);
  }, []);

  // Apply classes to body
  useEffect(() => {
    const body = document.body;
    
    if (isDyslexic) body.classList.add('font-dyslexic');
    else body.classList.remove('font-dyslexic');

    if (isHighContrast) body.classList.add('high-contrast');
    else body.classList.remove('high-contrast');

    if (isReducedMotion) body.classList.add('reduced-motion');
    else body.classList.remove('reduced-motion');

    // Persist
    localStorage.setItem('sf-dyslexic', String(isDyslexic));
    localStorage.setItem('sf-high-contrast', String(isHighContrast));
    localStorage.setItem('sf-reduced-motion', String(isReducedMotion));
  }, [isDyslexic, isHighContrast, isReducedMotion]);

  const toggleDyslexic = () => setIsDyslexic(prev => !prev);
  const toggleHighContrast = () => setIsHighContrast(prev => !prev);
  const toggleReducedMotion = () => setIsReducedMotion(prev => !prev);

  return (
    <AccessibilityContext.Provider value={{
      isDyslexic,
      isHighContrast,
      isReducedMotion,
      toggleDyslexic,
      toggleHighContrast,
      toggleReducedMotion
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
