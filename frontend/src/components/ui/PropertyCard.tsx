import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { generateAIAltText } from '@/lib/ai-accessibility';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Heart } from 'lucide-react';

const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($listingId: String!) {
    toggleFavorite(listingId: $listingId) {
      id
      favorites {
        id
      }
    }
  }
`;

const ME_FAVORITES = gql`
  query MeFavorites {
    me {
      id
      favorites {
        id
      }
    }
  }
`;

export interface PropertyProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  status: 'available' | 'booked' | 'pending' | 'blocked';
}

export const PropertyCard: React.FC<PropertyProps> = ({
  id,
  title,
  location,
  price,
  rating,
  imageUrl,
  status,
}) => {
  const { t } = useTranslation();
  const statusColors = {
    available: 'bg-white text-ink shadow-sm',
    booked: 'bg-gray-200 text-gray-500',
    pending: 'bg-yellow-100 text-yellow-800',
    blocked: 'bg-gray-100 text-gray-400',
  };

  const statusLabels = {
    available: t('listings.available'),
    booked: t('listings.booked'),
    pending: t('listings.pending'),
    blocked: t('listings.blocked'),
  };

  const aiAltText = generateAIAltText({ title, location });

  const { data: meData, error: meError } = useQuery(ME_FAVORITES);
  const [toggleFavorite, { error: toggleError }] = useMutation(TOGGLE_FAVORITE, {
    refetchQueries: [{ query: ME_FAVORITES }],
    awaitRefetchQueries: true,
  });

  const isFavoriteServer = meData?.me?.favorites?.some((f: any) => f.id === id);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(!!isFavoriteServer);
  }, [isFavoriteServer]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!meData?.me) {
        alert("Debes iniciar sesión para guardar favoritos.");
        return;
    }
    
    const previousState = isFavorite;
    setIsFavorite(!previousState);

    try {
        await toggleFavorite({ variables: { listingId: id } });
    } catch (err) {
        console.error("Error toggling favorite:", err);
        setIsFavorite(previousState);
        alert("No se pudo guardar el favorito. Intenta de nuevo.");
    }
  };

  if (meError) console.error("Error loading favorites:", meError);
  if (toggleError) console.error("Error mutating favorite:", toggleError);

  return (
    <Link href={`/listings/${id}`} className="group block h-full cursor-pointer">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-200">
        <Image
          src={imageUrl}
          alt={aiAltText}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        {/* Favorite Button Overlay */}
        <button 
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 hover:scale-110 transition-all focus:outline-none"
        >
           <Heart 
             className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : "text-white fill-black/40"}`} 
           />
        </button>

        {status !== 'available' && (
            <div className={`absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-semibold ${statusColors[status]}`}>
            {statusLabels[status]}
            </div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex justify-between items-start">
            <h3 className="font-semibold text-ink text-base truncate pr-2">{title}</h3>
            <div className="flex items-center gap-1 text-sm">
                <span className="text-ink">★</span>
                <span>{rating}</span>
            </div>
        </div>
        <p className="text-gray-500 text-sm">{location}</p>
        <div className="flex items-baseline gap-1 mt-1">
            <span className="font-semibold text-ink text-base">${price}</span>
            <span className="text-ink font-light"> {t('listings.night')}</span>
        </div>
      </div>
    </Link>
  );
};
