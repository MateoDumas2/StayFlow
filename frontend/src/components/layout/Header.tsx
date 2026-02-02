'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SearchWithVoice from '@/components/ui/SearchWithVoice';
import TravelStreak from '@/components/gamification/TravelStreak';
import UserMenu from './UserMenu';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Logo } from '@/components/ui/Logo';
import NotificationsBell from './NotificationsBell';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleLang = (lang: string) => {
    i18n.changeLanguage(lang);
    // Set cookie for server-side rendering
    document.cookie = `i18next=${lang}; path=/; max-age=31536000`;
    setShowLangMenu(false);
    // Refresh to update server components
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-border bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo />
          </Link>
        </div>

        {/* Navigation / Search Placeholder */}
        <div className="hidden md:flex flex-1 items-center justify-center px-8">
          <SearchWithVoice />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block">
             <TravelStreak />
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-xl"
            title={theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <NotificationsBell />

          <div className="hidden sm:block relative">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span role="img" aria-label="world">🌐</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                <button 
                  onClick={() => toggleLang('es')} 
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${i18n.language === 'es' ? 'font-bold text-primary' : 'text-gray-700'}`}
                >
                  Español
                </button>
                <button 
                  onClick={() => toggleLang('en')} 
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${i18n.language === 'en' ? 'font-bold text-primary' : 'text-gray-700'}`}
                >
                  English
                </button>
              </div>
            )}
          </div>

          {/* User Menu Pill */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
