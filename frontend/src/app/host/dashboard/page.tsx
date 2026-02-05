'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useQuery, useMutation, gql } from '@apollo/client';
import { PropertyCard } from '@/components/ui/PropertyCard';

const GET_HOST_STATS = gql`
  query GetHostStats {
    hostStats {
      activeListings
      totalBookings
      totalRevenue
    }
  }
`;

const GET_MY_LISTINGS = gql`
  query GetMyListings {
    myListings {
      id
      title
      location
      price
      imageUrl
      status
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: String!) {
    removeListing(id: $id) {
      id
    }
  }
`;

export default function HostDashboardPage() {
  const { t } = useTranslation();
  const { data: statsData, loading: statsLoading } = useQuery(GET_HOST_STATS, {
    fetchPolicy: 'cache-and-network',
  });
  const { data: listingsData, loading: listingsLoading } = useQuery(GET_MY_LISTINGS, {
    fetchPolicy: 'cache-and-network',
  });
  
  const [deleteListing] = useMutation(DELETE_LISTING, {
    refetchQueries: ['GetMyListings', 'GetHostStats'],
  });

  const stats = statsData?.hostStats || { activeListings: 0, totalBookings: 0, totalRevenue: 0 };
  const listings = listingsData?.myListings || [];

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este alojamiento? Esta acción no se puede deshacer.')) {
      try {
        await deleteListing({ variables: { id } });
      } catch (err) {
        console.error('Error deleting listing:', err);
        alert('Error al eliminar el alojamiento.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">Panel de Anfitrión</h1>
          <p className="text-gray-500 mt-2">Gestiona tus alojamientos y reservas desde aquí.</p>
        </div>
        <Link href="/host/create-listing">
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Publicar nuevo alojamiento
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCard 
          title="Alojamientos Activos" 
          value={statsLoading ? "..." : stats.activeListings.toString()} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
        />
        <StatsCard 
          title="Reservas Totales" 
          value={statsLoading ? "..." : stats.totalBookings.toString()} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
        />
        <StatsCard 
          title="Ingresos Totales" 
          value={statsLoading ? "..." : `$${stats.totalRevenue.toLocaleString()}`} 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
        />
      </div>

      <h2 className="text-2xl font-bold text-ink mb-6">Mis Alojamientos</h2>
      
      {listingsLoading ? (
        <div className="text-center py-12">Cargando alojamientos...</div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing: any) => (
            <PropertyCard 
              key={listing.id} 
              {...listing} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes alojamientos publicados</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Empieza a ganar dinero compartiendo tu espacio. Es fácil crear un anuncio y empezar a recibir huéspedes.
          </p>
          <Link href="/host/create-listing">
            <Button variant="outline">Crear mi primer anuncio</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className="p-3 bg-primary/5 text-primary rounded-lg">
        {icon}
      </div>
    </div>
  );
}
