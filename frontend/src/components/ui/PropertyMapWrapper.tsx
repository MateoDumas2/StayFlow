"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import { PropertyMapProps } from './PropertyMap';

const PropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Cargando mapa...</div>
});

export default function PropertyMapWrapper(props: PropertyMapProps) {
  return <PropertyMap {...props} />;
}