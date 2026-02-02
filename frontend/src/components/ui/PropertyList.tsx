"use client";

import React from 'react';
import { PropertyCard, PropertyProps } from '@/components/ui/PropertyCard';
import { useTranslation } from 'react-i18next';

interface PropertyListProps {
  properties: PropertyProps[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const { t } = useTranslation();

  if (properties.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-ink">{t('listings.no_results')}</h3>
        <p className="text-gray-muted">{t('listings.try_clearing')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {properties.map((property) => (
        <div key={property.id} className="transition-all duration-200 rounded-xl">
            <PropertyCard {...property} />
        </div>
      ))}
    </div>
  );
}
