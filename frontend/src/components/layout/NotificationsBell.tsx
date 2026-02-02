'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const GET_NOTIFICATIONS = gql`
  query GetMyNotifications {
    myNotifications {
      id
      title
      message
      read
      createdAt
      link
      type
    }
  }
`;

const MARK_AS_READ = gql`
  mutation MarkNotificationAsRead($id: String!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

export default function NotificationsBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, refetch } = useQuery(GET_NOTIFICATIONS, {
    pollInterval: 30000, // Poll every 30s
    errorPolicy: 'ignore', // Ignore errors (e.g. if not logged in)
  });
  const [markAsRead] = useMutation(MARK_AS_READ);

  const notifications = data?.myNotifications || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      try {
        await markAsRead({ variables: { id: notification.id } });
        refetch();
      } catch (e) {
        console.error('Error marking as read', e);
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        title="Notificaciones"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform scale-75 -translate-y-1 translate-x-1">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Notificaciones</h3>
                {unreadCount > 0 && (
                  <span className="text-xs text-white bg-primary px-2 py-0.5 rounded-full font-medium">{unreadCount} nuevas</span>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No tienes notificaciones
                  </div>
                ) : (
                  notifications.map((notification: any) => (
                    <div 
                      key={notification.id}
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <Link 
                        href={notification.link || '#'} 
                        onClick={() => handleNotificationClick(notification)}
                        className="block p-4"
                      >
                        <div className="flex gap-3">
                          <div className="mt-1 flex-shrink-0 text-xl">
                            {notification.type === 'BOOKING_CONFIRMED' ? '✅' : 
                             notification.type === 'NEW_BOOKING' ? '💰' : 
                             notification.type === 'REVIEW_RECEIVED' ? '⭐' : '📢'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight mb-1">{notification.title}</p>
                            <p className="text-sm text-gray-600 leading-snug">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
