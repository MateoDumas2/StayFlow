"use client";

import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Users, Check, X, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { triggerHaptic, hapticPatterns } from '@/lib/haptics';

// GraphQL Queries & Mutations
const GET_FRIENDS_DATA = gql`
  query GetFriendsData {
    myFriends {
      id
      name
      email
      avatar
    }
    myFriendRequests {
      id
      requester {
        id
        name
        avatar
      }
      status
      createdAt
    }
  }
`;

const SEARCH_USERS = gql`
  query SearchUsers($query: String!) {
    searchUsers(query: $query) {
      id
      name
      email
      avatar
    }
  }
`;

const SEND_REQUEST = gql`
  mutation SendFriendRequest($userId: String!) {
    sendFriendRequest(userId: $userId) {
      id
      status
    }
  }
`;

const ACCEPT_REQUEST = gql`
  mutation AcceptFriendRequest($requestId: String!) {
    acceptFriendRequest(requestId: $requestId) {
      id
      status
    }
  }
`;

const REJECT_REQUEST = gql`
  mutation RejectFriendRequest($requestId: String!) {
    rejectFriendRequest(requestId: $requestId) {
      id
      status
    }
  }
`;

const REMOVE_FRIEND = gql`
  mutation RemoveFriend($friendId: String!) {
    removeFriend(friendId: $friendId) {
      id
    }
  }
`;

export default function FriendsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Queries
  const { data, loading, refetch } = useQuery(GET_FRIENDS_DATA, {
    pollInterval: 10000, // Auto-refresh every 10s
  });
  
  const { data: searchData, loading: searchLoading, refetch: refetchSearch } = useQuery(SEARCH_USERS, {
    variables: { query: searchQuery },
    skip: searchQuery.length < 3,
  });

  // Mutations
  const [sendRequest] = useMutation(SEND_REQUEST, {
    onCompleted: () => {
      triggerHaptic(hapticPatterns.success);
      alert('Solicitud enviada correctamente');
      setSearchQuery('');
    },
    onError: (err) => alert(err.message),
  });

  const [acceptRequest] = useMutation(ACCEPT_REQUEST, {
    onCompleted: () => {
      triggerHaptic(hapticPatterns.success);
      refetch();
    },
  });

  const [rejectRequest] = useMutation(REJECT_REQUEST, {
    onCompleted: () => {
      triggerHaptic(hapticPatterns.light);
      refetch();
    },
  });

  const [removeFriend] = useMutation(REMOVE_FRIEND, {
    onCompleted: () => {
      triggerHaptic(hapticPatterns.medium);
      refetch();
    },
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">Mis Amigos</h1>
          <p className="text-gray-500">Conecta con otros viajeros y planea viajes juntos.</p>
        </div>
      </div>

      {/* Search Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" />
          Buscar Personas
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {searchQuery.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              {searchLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : searchData?.searchUsers?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchData.searchUsers.map((user: any) => {
                    const isFriend = data?.myFriends?.some((f: any) => f.id === user.id);
                    // Check if request already sent is harder without backend support for "status" in search, 
                    // but we can assume if they are not friend, we can show "Add" button
                    
                    if (isFriend) return null;

                    return (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name[0]
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-ink">{user.name}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => sendRequest({ variables: { userId: user.id } })}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No se encontraron usuarios.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Friend Requests */}
      {data?.myFriendRequests?.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50/50 p-6 rounded-xl border border-blue-100"
        >
          <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Solicitudes Pendientes
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {data.myFriendRequests.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.myFriendRequests.map((req: any) => (
              <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    {req.requester.avatar ? (
                      <img src={req.requester.avatar} alt={req.requester.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-gray-500">{req.requester.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{req.requester.name}</p>
                    <p className="text-xs text-gray-500">Quiere ser tu amigo</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => acceptRequest({ variables: { requestId: req.id } })}
                    className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => rejectRequest({ variables: { requestId: req.id } })}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* My Friends List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-ink" />
          Mis Amigos
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : data?.myFriends?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.myFriends.map((friend: any) => (
              <motion.div
                key={friend.id}
                variants={item}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                    {friend.avatar ? (
                      <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">{friend.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink text-lg">{friend.name}</h3>
                    <p className="text-sm text-gray-400">{friend.email}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      if(confirm('¿Estás seguro de eliminar a este amigo?')) {
                        removeFriend({ variables: { friendId: friend.id } });
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-600">Aún no tienes amigos</h3>
            <p className="text-gray-400 mt-2 max-w-sm mx-auto">
              Utiliza el buscador de arriba para encontrar a tus conocidos y empezar a planear viajes juntos.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
