'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { gql, useQuery } from '@apollo/client';
import { ReviewModal } from '@/components/features/ReviewModal';
import { ReportModal } from '@/components/features/ReportModal';
import { AlertTriangle } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
}

interface Trip {
  id: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  listing: Listing;
}

const GET_MY_TRIPS = gql`
  query GetMyTrips {
    myBookings {
      id
      checkIn
      checkOut
      totalPrice
      status
      listing {
        id
        title
        location
        imageUrl
      }
    }
  }
`;

export default function TripsPage() {
  const { data, loading, error } = useQuery(GET_MY_TRIPS, {
    fetchPolicy: 'network-only',
  });
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [reportTrip, setReportTrip] = useState<Trip | null>(null);
  // Demo state to simulate trip completion
  const [demoCompletedTrips, setDemoCompletedTrips] = useState<Set<string>>(new Set());

  const trips: Trip[] = data?.myBookings || [];

  const getTripStatus = (trip: Trip) => {
    if (demoCompletedTrips.has(trip.id)) {
      return { label: 'Completado (Demo)', isCompleted: true, color: 'text-purple-600 bg-purple-100' };
    }

    const checkOutDate = new Date(trip.checkOut);
    const now = new Date();
    // Reset hours to compare just dates
    now.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);

    if (checkOutDate < now) return { label: 'Completado', isCompleted: true, color: 'text-green-600 bg-green-100' };
    if (trip.status === 'confirmed') return { label: 'Confirmado', isCompleted: false, color: 'text-blue-600 bg-blue-100' };
    return { label: trip.status, isCompleted: false, color: 'text-gray-600 bg-gray-100' };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching trips:', error);
    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh] text-center">
            <h1 className="text-2xl font-bold text-error mb-4">Error al cargar tus viajes</h1>
            <p className="text-gray-muted">Por favor intenta iniciar sesión nuevamente.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-ink mb-8">Mis Viajes</h1>

      {trips.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Aún no tienes viajes reservados</h2>
          <p className="text-gray-500 mb-8">¡Es hora de desempolvar las maletas y empezar a planear tu próxima aventura!</p>
          <Link href="/">
            <Button variant="primary" size="lg">
              Explorar alojamientos
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const status = getTripStatus(trip);
            return (
            <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-border hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={trip.listing.imageUrl} 
                  alt={trip.listing.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm z-10 ${status.color}`}>
                  {status.label}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1 truncate">{trip.listing.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{trip.listing.location}</p>
                
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Check-in</span>
                    <span className="font-medium">{new Date(trip.checkIn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Check-out</span>
                    <span className="font-medium">{new Date(trip.checkOut).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 font-semibold text-primary">
                    <span>Total</span>
                    <span>${trip.totalPrice}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col gap-2">
                   <div className="flex gap-2">
                     <Link href={`/bookings/success/${trip.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Ver detalles
                        </Button>
                     </Link>
                     {status.isCompleted ? (
                       <Button 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => setSelectedTrip(trip)}
                        title="Califica tu estadía y gana puntos"
                       >
                         Reseñar
                       </Button>
                     ) : (
                        <div className="flex-1 flex gap-1">
                          <Button 
                            variant="secondary" 
                            className="flex-1 opacity-50 cursor-not-allowed"
                            disabled
                            title="Podrás reseñar cuando finalice tu viaje"
                          >
                            Reseñar
                          </Button>
                          {/* Demo Button to force completion */}
                          <button
                            onClick={() => setDemoCompletedTrips(prev => new Set(prev).add(trip.id))}
                            className="bg-purple-100 text-purple-700 px-2 rounded hover:bg-purple-200 text-xs font-bold"
                            title="Demo: Simular fin de viaje"
                          >
                            Demo
                          </button>
                        </div>
                     )}
                   </div>
                   
                   <button 
                    onClick={() => setReportTrip(trip)}
                    className="text-xs text-gray-500 hover:text-error flex items-center justify-center gap-1 py-2 hover:bg-red-50 rounded transition-colors w-full"
                   >
                     <AlertTriangle className="w-3 h-3" />
                     Reportar problema
                   </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {selectedTrip && (
        <ReviewModal
          isOpen={!!selectedTrip}
          onClose={() => setSelectedTrip(null)}
          listingId={selectedTrip.listing.id}
          listingTitle={selectedTrip.listing.title}
          onSuccess={() => {
            // Optionally refetch or show success message
          }}
        />
      )}

      {reportTrip && (
        <ReportModal
          isOpen={!!reportTrip}
          onClose={() => setReportTrip(null)}
          bookingId={reportTrip.id}
          listingTitle={reportTrip.listing.title}
        />
      )}
    </div>
  );
}
