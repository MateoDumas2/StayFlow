"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { useAccessibility } from "@/components/providers/AccessibilityProvider";
import SpotifyConnect from "@/components/features/SpotifyConnect";
import { AuthModal } from "@/components/auth/AuthModal";
import { gql, useQuery } from "@apollo/client";
import { FlowRewardsCard } from "@/components/gamification/FlowRewardsCard";

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      avatar
      role
      flowPoints
      flowTier
    }
  }
`;

// Hook to detect outside click
function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function UserMenu() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: meData } = useQuery(ME_QUERY, {
    skip: !isLoggedIn,
  });
  
  useOutsideClick(menuRef, () => setIsOpen(false));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [authModalOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsOpen(false);
    window.location.reload(); // Simple reload to clear state
  };

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setIsOpen(false);
  };

  const currentUser = meData?.me;

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Trigger: User Pill */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md transition-shadow cursor-pointer bg-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          <div className="h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold text-xs overflow-hidden">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : isLoggedIn ? (
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            )}
          </div>
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
            >
              {isLoggedIn ? (
                <>
                  {/* Profile Section */}
                  <div className="p-4 border-b border-gray-100">
                      <Link href="/dashboard" className="block">
                          <div className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative group">
                                  {currentUser?.avatar ? (
                                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="User" className="w-full h-full object-cover" />
                                  )}
                              </div>
                              <div>
                                  <h4 className="font-bold text-ink">
                                    {currentUser?.name || t('user_menu.your_account')}
                                  </h4>
                                  <p className="text-xs text-gray-500">{t('user_menu.view_profile')}</p>
                              </div>
                          </div>
                      </Link>
                      
                      {currentUser && (
                        <div className="mt-2">
                           <FlowRewardsCard 
                             points={currentUser.flowPoints || 0} 
                             tier={currentUser.flowTier || 'RIPPLE'} 
                             userName={currentUser.name} 
                             compact 
                           />
                        </div>
                      )}
                  </div>
                  
                  <div className="p-2 border-b border-gray-100">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Mis Puntos y Logros
                    </Link>
                    <Link href="/trips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Mis Viajes
                    </Link>
                    <Link href="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Mis Favoritos
                    </Link>
                  </div>
                  
                  {currentUser?.role === 'HOST' && (
                    <div className="p-2 border-b border-gray-100">
                      <Link href="/host/dashboard" className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        Panel de Anfitrión
                      </Link>
                    </div>
                  )}

                  {/* Accessibility Section */}
                  <AccessibilitySection />

                  {/* Integrations Section */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('user_menu.integrations')}</h5>
                      <SpotifyConnect />
                  </div>

                  <div className="p-2 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                          {t('user_menu.logout')}
                      </button>
                  </div>
                </>
              ) : (
                <>
                   <div className="p-2 border-b border-gray-100">
                      <button 
                        onClick={() => openAuth('login')}
                        className="w-full text-left px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                          {t('user_menu.login')}
                      </button>
                      <button 
                        onClick={() => openAuth('register')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                          {t('user_menu.register')}
                      </button>
                  </div>
                   {/* Accessibility Section */}
                   <AccessibilitySection />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
}

// Subcomponent for Accessibility to handle Context
function AccessibilitySection() {
    const { t } = useTranslation();
    const { isDyslexic, isHighContrast, isReducedMotion, toggleDyslexic, toggleHighContrast, toggleReducedMotion } = useAccessibility();

    return (
        <div className="p-4 border-b border-gray-100">
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span>{t('user_menu.accessibility')}</span>
            </h5>
            <div className="space-y-2">
                <ToggleItem 
                    label={t('user_menu.dyslexic')} 
                    description={t('user_menu.dyslexic_desc')}
                    active={isDyslexic} 
                    onClick={toggleDyslexic} 
                />
                <ToggleItem 
                    label={t('user_menu.high_contrast')} 
                    description={t('user_menu.high_contrast_desc')}
                    active={isHighContrast} 
                    onClick={toggleHighContrast} 
                />
                <ToggleItem 
                    label={t('user_menu.reduced_motion')} 
                    description={t('user_menu.reduced_motion_desc')}
                    active={isReducedMotion} 
                    onClick={toggleReducedMotion} 
                />
            </div>
        </div>
    );
}

const ToggleItem = ({ label, description, active, onClick }: { label: string, description: string, active: boolean, onClick: () => void }) => (
    <div className="flex items-center justify-between cursor-pointer group" onClick={onClick}>
        <div>
            <p className={`text-sm font-medium ${active ? 'text-primary' : 'text-gray-700'}`}>{label}</p>
            <p className="text-[10px] text-gray-400">{description}</p>
        </div>
        <div className={`w-10 h-6 rounded-full relative transition-colors ${active ? 'bg-primary' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'left-5' : 'left-1'}`} />
        </div>
    </div>
);
