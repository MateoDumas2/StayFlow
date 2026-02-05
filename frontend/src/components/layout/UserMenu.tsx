"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import SpotifyConnect from "@/components/features/SpotifyConnect";
import { AuthModal } from "@/components/auth/AuthModal";
import { gql, useQuery } from "@apollo/client";
import { AccessibilitySettings } from "@/components/ui/AccessibilitySettings";
import { getSessions, switchSession, removeSession } from "@/lib/auth-utils";

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
  const [otherSessions, setOtherSessions] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: meData } = useQuery(ME_QUERY, {
    skip: !isLoggedIn,
  });
  
  useOutsideClick(menuRef, () => setIsOpen(false));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    if (token) {
      const sessions = getSessions();
      setOtherSessions(sessions.filter(s => s.token !== token));
    }
  }, [authModalOpen, isOpen]); // Refresh when menu opens or auth changes

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      removeSession(token);
    } else {
      window.location.reload();
    }
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
                  </div>
                  
                  {currentUser?.role === 'HOST' && (
                    <div className="p-2 border-b border-gray-100">
                      <Link href="/host/dashboard" className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        Panel de Anfitrión
                      </Link>
                    </div>
                  )}

                  {/* Integrations Section */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('user_menu.integrations')}</h5>
                      <SpotifyConnect />
                  </div>

                  {/* Switch Account Section */}
                  <div className="p-2 border-t border-gray-100">
                    <h5 className="px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Cuentas</h5>
                    {otherSessions.map((session) => (
                      <button
                        key={session.user.id}
                        onClick={() => switchSession(session.token)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {session.user.avatar ? (
                            <img src={session.user.avatar} alt={session.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs">
                              {session.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="truncate flex-1 text-left">{session.user.name}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => openAuth('login')}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <span className="w-6 h-6 flex items-center justify-center border border-dashed border-primary rounded-full">+</span>
                      Añadir cuenta existente
                    </button>
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
                   <AccessibilitySettings variant="menu" />
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
