import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getClient } from '@/lib/client';
import { gql } from '@apollo/client';
import { notFound } from 'next/navigation';
import HiddenGems from '@/components/gamification/HiddenGems';
import LuggageChecker from '@/components/features/LuggageChecker';

const GET_BOOKING = gql`
  query GetBooking($id: String!) {
    booking(id: $id) {
      id
      checkIn
      checkOut
      guests
      totalPrice
      status
    }
  }
`;

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
}

interface BookingData {
  booking: Booking;
}

export default async function BookingSuccessPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  let booking: Booking | null = null;
  let error = null;

  try {
    const { data } = await getClient().query<BookingData>({
      query: GET_BOOKING,
      variables: { id },
      fetchPolicy: 'no-cache', // Important for dynamic data
    });
    booking = data.booking;
  } catch (e) {
    error = e;
  }

  if (error) {
    console.error(error);
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-error mb-4">Error al cargar la reserva</h1>
        <p className="text-gray-muted">No pudimos encontrar los detalles de tu reserva.</p>
        <Link href="/" className="mt-8 inline-block">
          <Button variant="secondary">Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  if (!booking) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg animate-bounce">
          ✓
        </div>
        
        <h1 className="text-4xl font-extrabold text-ink mb-4">¡Reserva Confirmada!</h1>
        <p className="text-xl text-gray-muted mb-8 max-w-lg">
          Tu viaje está listo. Hemos enviado los detalles de tu reserva a tu correo electrónico.
        </p>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-border w-full max-w-md mb-8 text-left">
          <h2 className="text-lg font-bold text-ink mb-4 border-b border-gray-border pb-2">Detalles de la reserva</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-muted">Código de reserva</span>
              <span className="font-mono font-bold text-primary">#{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-muted">Llegada</span>
              <span className="font-medium text-ink">{booking.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-muted">Salida</span>
              <span className="font-medium text-ink">{booking.checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-muted">Huéspedes</span>
              <span className="font-medium text-ink">{booking.guests}</span>
            </div>
            <div className="border-t border-gray-border pt-4 flex justify-between">
              <span className="font-bold text-ink">Total pagado</span>
              <span className="font-bold text-success text-lg">${booking.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Gamification - Hidden Gems Unlock */}
        <HiddenGems />

        {/* Travel Tools */}
        <div className="w-full max-w-4xl mx-auto my-8">
            <h2 className="text-2xl font-bold text-ink mb-6 text-left">Herramientas para tu viaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <LuggageChecker />
            </div>
        </div>

        <div className="flex gap-4 mt-8">
          <Link href="/">
            <Button variant="primary" size="lg">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    );
}
