'use client';

import React from 'react';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { Button } from '@/components/ui/Button';

const GET_MY_FAVORITES = gql`
  query GetMyFavorites {
    me {
      id
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
  }
`;

export default function FavoritesPage() {
  const { data, loading, error } = useQuery(GET_MY_FAVORITES, {
    fetchPolicy: 'network-only',
  });

  const favorites = data?.me?.favorites || [];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error fetching favorites:', error);
    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh] text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error al cargar tus favoritos</h1>
            <p className="text-gray-500">Por favor intenta iniciar sesión nuevamente.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Favoritos</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Aún no tienes alojamientos favoritos</h2>
          <p className="text-gray-500 mb-8">Guarda los lugares que te encantan para encontrarlos fácilmente después.</p>
          <Link href="/">
            <Button variant="primary" size="lg">
              Explorar alojamientos
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((listing: any) => (
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
      )}
    </div>
  );
}
