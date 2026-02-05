'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

const GET_LISTING = gql`
  query GetListing($id: String!) {
    listing(id: $id) {
      id
      title
      location
      price
      description
      imageUrl
      amenities
      vibes
      accessibilityFeatures
    }
  }
`;

const UPDATE_LISTING_MUTATION = gql`
  mutation UpdateListing($id: String!, $input: UpdateListingDto!) {
    updateListing(id: $id, updateListingInput: $input) {
      id
      title
    }
  }
`;

const AMENITIES_OPTIONS = ['Wifi', 'Piscina', 'Aire acondicionado', 'Cocina completa', 'Estacionamiento', 'Gimnasio', 'Jacuzzi', 'Pet friendly'];
const VIBES_OPTIONS = ['Relax', 'Aventura', 'Romántico', 'Lujo', 'Naturaleza', 'Urbano', 'Playa', 'Montaña'];

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { t } = useTranslation();

  const { data, loading: loadingData, error } = useQuery(GET_LISTING, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
  });

  const [updateListing, { loading: updating }] = useMutation(UPDATE_LISTING_MUTATION, {
    refetchQueries: ['GetMyListings', 'GetHostStats', 'GetListing'],
  });

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    imageUrl: '',
    amenities: [] as string[],
    vibes: [] as string[],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data?.listing) {
      setFormData({
        title: data.listing.title || '',
        location: data.listing.location || '',
        price: data.listing.price?.toString() || '',
        description: data.listing.description || '',
        imageUrl: data.listing.imageUrl || '',
        amenities: data.listing.amenities || [],
        vibes: data.listing.vibes || [],
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4011';
      const res = await fetch(`${apiUrl}/uploads`, {
        method: 'POST',
        body: uploadData,
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      console.error('Upload failed', err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const toggleSelection = (field: 'amenities' | 'vibes', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateListing({
        variables: {
          id,
          input: {
            title: formData.title,
            location: formData.location,
            price: parseFloat(formData.price),
            description: formData.description,
            imageUrl: formData.imageUrl,
            amenities: formData.amenities,
            vibes: formData.vibes,
          },
        },
      });
      router.push('/host/dashboard');
    } catch (err) {
      console.error('Error updating listing:', err);
      alert('Error al actualizar el alojamiento. Por favor intenta de nuevo.');
    }
  };

  if (loadingData) return <div className="p-8 text-center">Cargando datos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error al cargar el alojamiento</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-ink mb-8">Editar alojamiento</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Información Básica</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título del anuncio</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Ej: Cabaña acogedora en el bosque"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="Ej: Bariloche, Argentina"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio por noche ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="Ej: 150"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Describe tu alojamiento..."
              required
            />
          </div>
        </section>

        {/* Media */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Fotos</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen principal</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Subiendo imagen...</p>}
          </div>
          {formData.imageUrl && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 h-64 w-full relative">
               <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </section>

        {/* Details */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Detalles</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Comodidades (Amenities)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AMENITIES_OPTIONS.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => toggleSelection('amenities', amenity)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Vibe</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {VIBES_OPTIONS.map(vibe => (
                <label key={vibe} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.vibes.includes(vibe)}
                    onChange={() => toggleSelection('vibes', vibe)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-600">{vibe}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="flex gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={uploading || updating}
          >
            {updating ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
}
