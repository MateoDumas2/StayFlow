"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CreditCardInput, CreditCardData } from './CreditCardInput';
import { X, CheckCircle, ShieldCheck, Calendar as CalendarIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerHaptic, hapticPatterns } from '@/lib/haptics';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { format, isBefore, addDays } from 'date-fns';

interface BookingCardProps {
  listingId: string;
  price: number;
  rating: number;
  listingTitle?: string;
  bookings?: { checkIn: string; checkOut: string }[];
}

const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(createBookingInput: $input) {
      id
      status
    }
  }
`;

import { AuthModal } from '@/components/auth/AuthModal';

const ME_QUERY = gql`
  query MeBooking {
    me {
      id
    }
  }
`;

const GET_MY_FRIENDS_SIMPLE = gql`
  query GetMyFriendsSimple {
    myFriends {
      id
      name
      avatar
    }
  }
`;

export function BookingCard({ listingId, price, rating, bookings = [] }: BookingCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  
  const handleDateSelect = (date: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(format(date, 'yyyy-MM-dd'));
      setCheckOut('');
    } else {
      const start = new Date(checkIn);
      if (isBefore(date, start)) {
        setCheckIn(format(date, 'yyyy-MM-dd'));
        setCheckOut('');
      } else {
        setCheckOut(format(date, 'yyyy-MM-dd'));
        setShowCalendar(false); // Close calendar after selection
      }
    }
  };
  const [guests, setGuests] = useState(1);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'card' | 'processing' | 'success'>('card');
  const [cardDetails, setCardDetails] = useState<Partial<CreditCardData>>({});
  const [isSplitPay, setIsSplitPay] = useState(false);
  const [friendsEmails, setFriendsEmails] = useState<string[]>([]);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);

  const { data: meData, loading: meLoading } = useQuery(ME_QUERY);
  const { data: friendsData } = useQuery(GET_MY_FRIENDS_SIMPLE, { skip: !meData?.me });

  const CLEANING_FEE = 40;
  const SERVICE_FEE = 65;

  const [createBooking] = useMutation(CREATE_BOOKING);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end <= start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const totalStayPrice = price * nights;
  const grandTotal = totalStayPrice + CLEANING_FEE + SERVICE_FEE;

  const handleReserveClick = () => {
    if (!checkIn || !checkOut || nights === 0) {
      alert(t('booking.select_valid_dates'));
      triggerHaptic(hapticPatterns.error);
      return;
    }
    
    if (meLoading) return;

    if (!meData?.me) {
      setIsAuthModalOpen(true);
      return;
    }

    triggerHaptic(hapticPatterns.click);
    setIsPaymentModalOpen(true);
    setPaymentStep('card');
  };

  const handleConfirmPayment = async () => {
    // Basic validation
    if (!cardDetails.number || cardDetails.number.length < 16) {
        alert(t('booking.enter_valid_card'));
        triggerHaptic(hapticPatterns.error);
        return;
    }

    triggerHaptic(hapticPatterns.click);
    setPaymentStep('processing');

    // Simulate payment processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const { data } = await createBooking({
        variables: {
          input: {
            listingId,
            checkIn,
            checkOut,
            guests: parseInt(guests.toString()),
            totalPrice: grandTotal,
            isSplitPay,
            invitedEmails: friendsEmails,
            participantIds: selectedFriendIds
          },
        },
      });

      if (data?.createBooking?.id) {
        setPaymentStep('success');
        triggerHaptic(hapticPatterns.success);
        
        // Trigger confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }; // Higher z-index for modal

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          // since particles fall down, start a bit higher than random
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        setTimeout(() => {
            router.push(`/bookings/success/${data.createBooking.id}`);
        }, 3500); // Increased delay to enjoy confetti
      }
    } catch (err) {
      console.error(err);
      alert(t('booking.error_creating'));
      setPaymentStep('card');
    }
  };

  return (
    <>
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/50 sticky top-24 z-10 transition-all hover:shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-2xl font-bold text-ink">${price}</span>
            <span className="text-gray-muted"> {t('booking.night')}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full border border-white/60 shadow-sm">
            <span className="text-ember-dark">★</span>
            <span className="font-medium text-ink">{rating}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm relative">
            <div className="grid grid-cols-2 border-b border-gray-200">
              <div 
                className="p-3 border-r border-gray-200 bg-white/40 hover:bg-white/60 transition-colors cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <label className="block text-xs font-bold text-ink uppercase">{t('booking.check_in')}</label>
                <div className="text-sm text-gray-700 h-5">
                   {checkIn || <span className="text-gray-400">Add date</span>}
                </div>
              </div>
              <div 
                className="p-3 bg-white/40 hover:bg-white/60 transition-colors cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <label className="block text-xs font-bold text-ink uppercase">{t('booking.check_out')}</label>
                <div className="text-sm text-gray-700 h-5">
                   {checkOut || <span className="text-gray-400">Add date</span>}
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {showCalendar && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white border-b border-gray-200"
                >
                  <AvailabilityCalendar 
                    bookings={bookings}
                    checkIn={checkIn ? new Date(checkIn) : null}
                    checkOut={checkOut ? new Date(checkOut) : null}
                    onSelectDate={handleDateSelect}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="p-3 bg-white/40 hover:bg-white/60 transition-colors">
              <label className="block text-xs font-bold text-ink uppercase">{t('booking.guests')}</label>
              <select 
                className="w-full text-sm text-gray-muted focus:outline-none bg-transparent"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
              >
                <option value={1}>{t('booking.guest_1')}</option>
                <option value={2}>{t('booking.guest_n', { count: 2 })}</option>
                <option value={3}>{t('booking.guest_n', { count: 3 })}</option>
                <option value={4}>{t('booking.guest_n', { count: 4 })}</option>
              </select>
            </div>
          </div>
        </div>

        <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
        >
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full mb-4 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow relative overflow-hidden"
          onClick={handleReserveClick}
        >
          <span className="relative z-10">{t('booking.reserve_button')}</span>
          {/* Subtle shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </Button>
        </motion.div>
        
        <p className="text-center text-sm text-gray-muted">{t('booking.no_charge')}</p>
        
        {nights > 0 && (
          <div className="mt-6 space-y-3 text-sm text-ink animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between">
              <span className="underline">${price} x {nights} noches</span>
              <span>${totalStayPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Tarifa de limpieza</span>
              <span>${CLEANING_FEE}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Comisión de servicio</span>
              <span>${SERVICE_FEE}</span>
            </div>
            <div className="border-t border-gray-border my-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${grandTotal}</span>
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg text-ink flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  Pago Seguro
                </h3>
                <button 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {paymentStep === 'card' && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-6">
                            <p className="text-gray-500 text-sm">{isSplitPay ? 'Tu parte a pagar' : 'Total a pagar'}</p>
                            <p className="text-3xl font-bold text-ink">
                              ${(isSplitPay ? grandTotal / (friendsEmails.length + selectedFriendIds.length + 1) : grandTotal).toFixed(2)}
                            </p>
                            {isSplitPay && (
                              <p className="text-xs text-gray-400 mt-1">Total: ${grandTotal}</p>
                            )}
                        </div>

                        {/* Split Pay Toggle */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={isSplitPay} 
                                onChange={(e) => setIsSplitPay(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              Dividir pago con amigos (Split Pay)
                            </label>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">New</span>
                          </div>

                          {isSplitPay && (
                            <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-2">
                              {/* Friends Selection */}
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Selecciona amigos:</p>
                                {friendsData?.myFriends?.length > 0 ? (
                                   <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-100 rounded-lg p-2 bg-white">
                                     {friendsData.myFriends.map((friend: any) => (
                                       <label key={friend.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                         <input 
                                           type="checkbox"
                                           checked={selectedFriendIds.includes(friend.id)}
                                           onChange={(e) => {
                                             if(e.target.checked) setSelectedFriendIds([...selectedFriendIds, friend.id]);
                                             else setSelectedFriendIds(selectedFriendIds.filter(id => id !== friend.id));
                                           }}
                                           className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                         />
                                         <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                                             {friend.avatar ? (
                                                 <img src={friend.avatar} alt={friend.name} className="object-cover w-full h-full" />
                                             ) : (
                                                 <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-bold">
                                                     {friend.name[0]}
                                                 </div>
                                             )}
                                         </div>
                                         <span className="text-sm text-gray-700 font-medium">{friend.name}</span>
                                       </label>
                                     ))}
                                   </div>
                                ) : (
                                   <p className="text-xs text-gray-500 mb-2">No tienes amigos agregados aún.</p>
                                )}
                              </div>

                              {/* Email Invites */}
                              <div className="border-t border-gray-100 pt-3">
                                <p className="text-xs text-gray-500 mb-2">O invita por email:</p>
                                <div className="flex gap-2">
                                  <input 
                                    type="email" 
                                    placeholder="Email de tu amigo" 
                                    className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={newFriendEmail}
                                    onChange={(e) => setNewFriendEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (setFriendsEmails([...friendsEmails, newFriendEmail]), setNewFriendEmail(''))}
                                  />
                                  <Button 
                                    size="sm" 
                                    variant="secondary"
                                    onClick={() => {
                                      if(newFriendEmail) {
                                        setFriendsEmails([...friendsEmails, newFriendEmail]);
                                        setNewFriendEmail('');
                                      }
                                    }}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">
                                  Tú (Organizador)
                                </span>
                                {selectedFriendIds.map(id => {
                                  const friend = friendsData?.myFriends?.find((f: any) => f.id === id);
                                  return friend ? (
                                    <span key={id} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 flex items-center gap-1">
                                      {friend.name}
                                      <button onClick={() => setSelectedFriendIds(selectedFriendIds.filter(fid => fid !== id))} className="hover:text-red-500 ml-1">×</button>
                                    </span>
                                  ) : null;
                                })}
                                {friendsEmails.map((email, idx) => (
                                  <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1">
                                    {email}
                                    <button 
                                      onClick={() => setFriendsEmails(friendsEmails.filter((_, i) => i !== idx))}
                                      className="hover:text-red-500"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <CreditCardInput onChange={setCardDetails} />

                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="w-full mt-6"
                            onClick={handleConfirmPayment}
                        >
                            Pagar y Confirmar
                        </Button>
                    </motion.div>
                )}

                {paymentStep === 'processing' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12"
                    >
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg font-medium text-ink">Procesando pago...</p>
                        <p className="text-sm text-gray-500">Por favor no cierres esta ventana</p>
                    </motion.div>
                )}

                {paymentStep === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-8"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-ink mb-2">¡Pago Exitoso!</h3>
                        <p className="text-gray-500 text-center">Tu reserva ha sido confirmada. Te estamos redirigiendo...</p>
                    </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
