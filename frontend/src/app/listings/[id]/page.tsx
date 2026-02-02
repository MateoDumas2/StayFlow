import React from 'react';
import Image from 'next/image';
import { getClient } from '@/lib/client';
import { gql } from '@apollo/client';
import { Button } from '@/components/ui/Button';
import { BookingCard } from '@/components/ui/BookingCard';
import { notFound } from 'next/navigation';
import PropertyMapWrapper from '@/components/ui/PropertyMapWrapper';

import PriceHistoryChart from '@/components/features/PriceHistoryChart';
import ItineraryGenerator from '@/components/features/ItineraryGenerator';
import ListingHero from '@/components/features/ListingHero';
import { ReactiveTitle } from '@/components/ui/ReactiveTitle';
import { useTranslation } from '@/i18n/server';

interface Review {
  id: string;
  content: string;
  rating: number;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
}

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  status: string;
  description: string;
  amenities: string[];
  reviews: Review[];
  bookings: { checkIn: string; checkOut: string }[];
}

const GET_LISTING = gql`
  query GetListing($id: String!) {
    listing(id: $id) {
      id
      title
      location
      price
      rating
      imageUrl
      status
      description
      amenities
      reviews {
        id
        content
        rating
        authorName
        authorAvatar
        createdAt
      }
      bookings {
        checkIn
        checkOut
      }
    }
  }
`;



export default async function ListingPage({ params }: { params: { id: string } }) {
  // Await params to avoid the sync/async error in Next.js 15+
  const { id } = await params;
  const { t } = await useTranslation();
  
  const { data } = await getClient().query<{ listing: Listing }>({
    query: GET_LISTING,
    variables: { id },
  });

  const listing = data.listing;

  if (!listing) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <ReactiveTitle text={listing.title} />
        <div className="flex items-center gap-2 text-sm text-gray-muted">
          <span className="flex items-center gap-1 font-medium text-ink">
            <span className="text-ember-dark">★</span> {listing.rating}
          </span>
          <span>•</span>
          <span className="underline">{listing.location}</span>
        </div>
      </div>

        {/* Hero Section */}
        <ListingHero listing={listing} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Host Info (Mock) */}
          <div className="flex items-center justify-between pb-8 border-b border-gray-border">
            <div>
              <h2 className="text-xl font-bold text-ink">{t('listing_page.host_title')}</h2>
              <p className="text-gray-muted">{t('listing_page.host_details')}</p>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👤</div>
          </div>

          {/* Description */}
          <div className="pb-8 border-b border-gray-border">
             <h2 className="text-xl font-bold text-ink mb-4">{t('listing_page.about_title')}</h2>
            <p className="text-gray-muted leading-relaxed">
              {listing.description || t('listing_page.default_description')}
            </p>
          </div>

          {/* Price History */}
          <div className="pb-8 border-b border-gray-border">
             <PriceHistoryChart currentPrice={listing.price} />
          </div>

          {/* Amenities */}
          <div className="pb-8 border-b border-gray-border">
            <h2 className="text-xl font-bold text-ink mb-6">{t('listing_page.amenities_title')}</h2>
            <div className="grid grid-cols-2 gap-4">
              {listing.amenities && listing.amenities.length > 0 ? (
                listing.amenities.map((amenity: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 text-gray-muted">
                    <span className="text-primary">✓</span>
                    {amenity}
                  </div>
                ))
              ) : (
                <p className="text-gray-muted">{t('listing_page.standard_amenities')}</p>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="pb-8 border-b border-gray-border" id="map-section">
            <h2 className="text-xl font-bold text-ink mb-6">{t('listing_page.location_title')}</h2>
            <PropertyMapWrapper location={listing.location} />
        </div>

        {/* GenAI Itinerary */}
        <div className="pb-8 border-b border-gray-border">
          <ItineraryGenerator location={listing.location} />
        </div>

          {/* Reviews Section */}
          <div className="pb-8 border-b border-gray-border" id="reviews-section">
            <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
              <span className="text-ember-dark">★</span> 
              {listing.rating} · {listing.reviews?.length || 0} {t('listing_page.reviews_count_label')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {listing.reviews && listing.reviews.length > 0 ? (
                listing.reviews.map((review: Review) => (
                  <div key={review.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={review.authorAvatar} 
                        alt={review.authorName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover" 
                        unoptimized
                      />
                      <div>
                        <p className="font-bold text-ink text-sm">{review.authorName}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {review.content}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-muted">{t('listing_page.no_reviews')}</p>
              )}
            </div>
            
            <div className="mt-8">
               <Button variant="outline" className="w-full sm:w-auto">{t('listing_page.show_all_reviews', { count: listing.reviews?.length || 0 })}</Button>
            </div>
          </div>
        </div>

        {/* Sidebar Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingCard 
              price={listing.price} 
              rating={listing.rating}
              listingId={listing.id}
              listingTitle={listing.title}
              bookings={listing.bookings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
