"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import AuctionTimer from '@/components/features/AuctionTimer';
import AIImageDescriber from '@/components/features/AIImageDescriber';

interface ListingHeroProps {
  listing: {
    id: string;
    title: string;
    imageUrl: string;
    status: string;
  };
}

export default function ListingHero({ listing }: ListingHeroProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      layoutId={`listing-image-${listing.id}`}
      className="relative h-[60vh] rounded-2xl overflow-hidden mb-8 group"
    >
      <AuctionTimer />
      <Button variant="secondary" size="sm" className="absolute top-4 left-4 z-10 backdrop-blur-md bg-white/80 border-none shadow-lg">
        {listing.status === 'available' ? t('listings.available') : t('listings.booked')}
      </Button>
      <Image
        src={listing.imageUrl}
        alt={listing.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/20" />
      <AIImageDescriber imageUrl={listing.imageUrl} context={listing.title} />
    </motion.div>
  );
}
