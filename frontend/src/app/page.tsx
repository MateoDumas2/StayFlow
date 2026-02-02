import React from 'react';
import PropertyList from '@/components/ui/PropertyList';
import { PropertyProps } from '@/components/ui/PropertyCard';
import { getClient } from '@/lib/client';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { Home as HomeIcon, Sunset, Mountain, Heart, Gem, TreePine, Building2 } from 'lucide-react';
import { useTranslation } from '@/i18n/server';

const GET_LISTINGS = gql`
  query GetListings($search: String, $vibe: String, $accessibility: [String!], $maxTravelTime: Float) {
    listings(search: $search, vibe: $vibe, accessibility: $accessibility, maxTravelTime: $maxTravelTime) {
      id
      title
      location
      price
      rating
      imageUrl
      status
    }
  }
`;

export default async function Home({ searchParams }: { searchParams: { search?: string; vibe?: string; accessibility?: string; maxTravelTime?: string } }) {
  const { t } = await useTranslation();
  const { search, vibe, accessibility, maxTravelTime } = await searchParams;

  const accessibilityList = accessibility ? accessibility.split(',') : null;
  const maxTravelTimeFloat = maxTravelTime ? parseFloat(maxTravelTime) : null;

  let properties: PropertyProps[] = [];
  let loadError = false;

  try {
    const { data } = await getClient().query({
      query: GET_LISTINGS,
      variables: {
        search: search || null,
        vibe: vibe || null,
        accessibility: accessibilityList,
        maxTravelTime: maxTravelTimeFloat,
      },
      fetchPolicy: 'no-cache',
    });
    properties = data.listings;
  } catch (error) {
    console.error('Error al cargar alojamientos:', error);
    loadError = true;
  }

  const categories = [
    { name: 'Relax', icon: Sunset, label: t('home.categories.relax') },
    { name: 'Aventura', icon: Mountain, label: t('home.categories.adventure') },
    { name: 'Romántico', icon: Heart, label: t('home.categories.romantic') },
    { name: 'Lujo', icon: Gem, label: t('home.categories.luxury') },
    { name: 'Naturaleza', icon: TreePine, label: t('home.categories.nature') },
    { name: 'Urbano', icon: Building2, label: t('home.categories.urban') },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Categories / Filter Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
             <div className="flex items-center gap-8 min-w-max pb-2">
               <Link href="/" className={`flex flex-col items-center gap-2 group cursor-pointer min-w-[64px] ${!vibe ? 'text-ink border-b-2 border-ink pb-2' : 'text-gray-500 hover:text-ink hover:bg-gray-50/50 pb-2 border-b-2 border-transparent hover:border-gray-200'}`}>
                    <HomeIcon className={`w-6 h-6 ${!vibe ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} transition-opacity`} />
                    <span className="text-xs font-semibold">{t('home.categories.all')}</span>
               </Link>
               {categories.map((c) => (
                 <Link href={`/?vibe=${c.name}`} key={c.name} className={`flex flex-col items-center gap-2 group cursor-pointer min-w-[64px] ${vibe === c.name ? 'text-ink border-b-2 border-ink pb-2' : 'text-gray-500 hover:text-ink pb-2 border-b-2 border-transparent hover:border-gray-200'}`}>
                     <c.icon className={`w-6 h-6 ${vibe === c.name ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} transition-opacity`} />
                     <span className="text-xs font-semibold">{c.label}</span>
                 </Link>
               ))}
             </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
          {/* Advanced Features Row */}
          <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center justify-between">
             <div className="w-full lg:w-auto">
                <h1 className="text-2xl font-bold text-ink mb-2">{t('home.explore_title')}</h1>
                <p className="text-gray-500">{t('home.explore_subtitle')}</p>
             </div>
          </div>

        <PropertyList properties={properties} />
      </div>
    </div>
  );
}
