'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Map, Trophy, Compass, Calendar, Star, Edit2, X, Camera, Save, Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import NFTStamps from '@/components/gamification/NFTStamps';
import CollaborativeBoard from '@/components/gamification/CollaborativeBoard';
import ExplorerLeaderboard from '@/components/gamification/ExplorerLeaderboard';
import { FlowRewardsCard } from '@/components/gamification/FlowRewardsCard';
import LuggageChecker from '@/components/features/LuggageChecker';
import { AccessibilitySettings } from '@/components/ui/AccessibilitySettings';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { useTranslation } from 'react-i18next';

const DASHBOARD_QUERY = gql`
  query DashboardData {
    me {
      id
      name
      email
      avatar
      flowPoints
      flowTier
      favorites {
        id
        title
        location
        price
        rating
        imageUrl
        status
      }
    }
    myBookings {
      id
      checkIn
      checkOut
      status
      listing {
        title
        location
        imageUrl
        travelTime
      }
    }
    myReviews {
      id
      rating
    }
  }
`;

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateUserInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      avatar
    }
  }
`;

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, loading, refetch } = useQuery(DASHBOARD_QUERY);
  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE_MUTATION);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    avatar: '',
    password: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const meData = data?.me;
  const bookings = data?.myBookings || [];
  const reviews = data?.myReviews || [];
  const favorites = meData?.favorites || [];

  // Sync data when loaded
  useEffect(() => {
    if (meData) {
      setEditForm(prev => ({
        ...prev,
        name: meData.name || '',
        email: meData.email || '',
        avatar: meData.avatar || ''
      }));
    }
  }, [meData]);

  // Calculate Real Stats
  const stats = React.useMemo(() => {
    const kms = bookings.reduce((acc: number, booking: any) => {
      const travelTime = booking.listing?.travelTime || 2; 
      return acc + (travelTime * 800);
    }, 0);

    const uniqueCities = new Set(bookings.map((b: any) => b.listing?.location?.split(',')[0].trim())).size;

    return {
      kms: Math.round(kms),
      cities: uniqueCities,
      reviews: reviews.length
    };
  }, [bookings, reviews]);

  const userTrips = bookings.map((b: any) => ({
    id: b.id,
    destination: b.listing?.location || 'Unknown',
    dates: `${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()}`,
    image: b.listing?.imageUrl,
    status: b.status === 'confirmed' ? 'Confirmado' : 'Completado'
  }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4011';
      const res = await fetch(`${apiUrl}/uploads`, {
        method: 'POST',
        body: uploadData,
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setEditForm(prev => ({ ...prev, avatar: data.url }));
    } catch (err) {
      console.error('Upload failed', err);
      setMessage({ type: 'error', text: 'Error al subir imagen' });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const input: any = {};
      if (editForm.name !== meData.name) input.name = editForm.name;
      if (editForm.email !== meData.email) input.email = editForm.email;
      if (editForm.avatar !== meData.avatar) input.avatar = editForm.avatar;
      if (editForm.password) input.password = editForm.password;

      if (Object.keys(input).length === 0) {
        setIsEditing(false);
        return;
      }

      await updateProfile({
        variables: { input },
      });

      await refetch();
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setEditForm(prev => ({ ...prev, password: '' }));
      setIsEditing(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al actualizar perfil' });
    }
  };

  // Derived User Data
  const user = {
    name: meData?.name || "Viajero",
    avatar: meData?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Mateo",
    level: "Explorador Nivel " + (Math.floor(stats.kms / 5000) + 1), // Dynamic Level
    points: stats.kms + (stats.reviews * 100), // Dynamic Points
    nextLevel: (Math.floor(stats.kms / 5000) + 1) * 5000,
    trips: userTrips,
    stats: stats
  };

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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-canvas pb-20 relative">
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-ink">{t('dashboard.edit_profile')}</h3>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <div 
                    className="w-24 h-24 rounded-full bg-gray-100 relative overflow-hidden group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                     <img 
                       src={editForm.avatar || user.avatar} 
                       alt="Avatar Preview" 
                       className="w-full h-full object-cover"
                     />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {uploading ? (
                          <Loader2 className="text-white w-8 h-8 animate-spin" />
                        ) : (
                          <Camera className="text-white w-8 h-8" />
                        )}
                     </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-gray-500 mt-2">{t('dashboard.paste_image')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.full_name')}</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.email')}</label>
                  <input 
                    type="email" 
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.avatar_url')}</label>
                  <input 
                    type="text" 
                    value={editForm.avatar}
                    onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.new_password')}</label>
                  <input 
                    type="password" 
                    value={editForm.password}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    placeholder={t('dashboard.password_placeholder')}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                    {t('dashboard.cancel')}
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" disabled={updating}>
                    {updating ? t('common.loading') : t('dashboard.save_changes')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-primary-soft h-64 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
             <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary blur-3xl"></div>
             <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-secondary blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
            <div className="flex items-end gap-6 w-full">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg relative group">
                    <img 
                      src={user.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover rounded-full bg-gray-100" 
                    />
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors border border-gray-100 text-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="mb-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-ink">{t('dashboard.welcome', { name: user.name })} 👋</h1>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-ink/70">{t('dashboard.ready')}</p>
                </div>
                
                {/* Stats Summary for Header (Desktop) */}
                <div className="hidden md:flex gap-6 mb-3">
                   <div className="text-center">
                      <p className="text-2xl font-bold text-ink">{user.stats.kms.toLocaleString()}</p>
                      <p className="text-xs uppercase tracking-wider text-gray-500">{t('dashboard.kms')}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-2xl font-bold text-ink">{user.stats.cities}</p>
                      <p className="text-xs uppercase tracking-wider text-gray-500">{t('dashboard.cities')}</p>
                   </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            {/* Main Dashboard - Left Column */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Stats Cards */}
                <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Map className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('dashboard.distance')}</p>
                            <p className="text-xl font-bold text-ink">{user.stats.kms.toLocaleString()} km</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Compass className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('dashboard.cities')}</p>
                            <p className="text-xl font-bold text-ink">{user.stats.cities}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{t('dashboard.reviews')}</p>
                            <p className="text-xl font-bold text-ink">{user.stats.reviews}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Upcoming Trips */}
                <motion.div variants={item} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Mis Viajes
                        </h2>
                        <Link href="/trips">
                            <Button variant="outline" size="sm">Ver todos</Button>
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {user.trips.length > 0 ? (
                            user.trips.map((trip: any) => (
                                <div key={trip.id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                                        <Image src={trip.image} alt={trip.destination} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-ink">{trip.destination}</h3>
                                        <p className="text-sm text-gray-500">{trip.dates}</p>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            trip.status === 'Completado' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                            {trip.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p>Aún no tienes viajes registrados.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Favorites Section */}
                <motion.div variants={item} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            Mis Favoritos
                        </h2>
                        <Link href="/favorites">
                            <Button variant="outline" size="sm">Ver todos</Button>
                        </Link>
                    </div>
                    <div className="p-6">
                        {favorites.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {favorites.slice(0, 2).map((listing: any) => (
                                    <PropertyCard
                                        key={listing.id}
                                        id={listing.id}
                                        title={listing.title}
                                        location={listing.location}
                                        price={listing.price}
                                        rating={listing.rating}
                                        imageUrl={listing.imageUrl}
                                        status={listing.status}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No tienes favoritos guardados aún.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Social Gamification - Collaborative Boards */}
                <motion.div variants={item}>
                    <CollaborativeBoard />
                </motion.div>
            </div>

            {/* Sidebar - Gamification */}
            <motion.div variants={item} className="lg:col-span-1 space-y-8">
                {/* Tools */}
                <LuggageChecker />

                {/* NFT Passport */}
                <NFTStamps />
                
                {/* Leaderboard */}
                <ExplorerLeaderboard />
                
                <FlowRewardsCard 
                  points={meData?.flowPoints || 0} 
                  tier={meData?.flowTier || 'RIPPLE'} 
                  userName={user.name} 
                />

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <h3 className="font-bold text-ink mb-4">Logros Desbloqueados</h3>
                     <div className="grid grid-cols-4 gap-2">
                         {[1,2,3,4,5,6,7,8].map(i => (
                             <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xl ${i <= 3 ? 'bg-primary-soft text-primary' : 'bg-gray-100 text-gray-300 grayscale'}`}>
                                 {i === 1 ? '🎒' : i === 2 ? '📸' : i === 3 ? '⭐' : '🔒'}
                             </div>
                         ))}
                     </div>
                </div>

                {/* Accessibility Settings */}
                <AccessibilitySettings />
            </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
