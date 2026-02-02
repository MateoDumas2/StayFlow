'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

const CREATE_LISTING_MUTATION = gql`
  mutation CreateListing($input: CreateListingDto!) {
    createListing(createListingInput: $input) {
      id
      title
    }
  }
`;

const AMENITIES_OPTIONS = ['Wifi', 'Piscina', 'Aire acondicionado', 'Cocina completa', 'Estacionamiento', 'Gimnasio', 'Jacuzzi', 'Pet friendly'];
const VIBES_OPTIONS = ['Relax', 'Aventura', 'Romántico', 'Lujo', 'Naturaleza', 'Urbano', 'Playa', 'Montaña'];

export default function CreateListingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [createListing, { loading }] = useMutation(CREATE_LISTING_MUTATION);

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
      const res = await fetch('http://localhost:4011/uploads', {
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
      await createListing({
        variables: {
          input: {
            title: formData.title,
            location: formData.location,
            price: parseFloat(formData.price),
            description: formData.description,
            imageUrl: formData.imageUrl,
            amenities: formData.amenities,
            vibes: formData.vibes,
            rating: 5.0, // Default rating for new listings
            accessibilityFeatures: [], // Optional for now
          },
        },
      });
      // Redirect to dashboard or home
      router.push('/host/dashboard');
    } catch (err) {
      console.error('Error creating listing:', err);
      alert('Error al crear el alojamiento. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-ink mb-8">Publicar nuevo alojamiento</h1>
      
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
              required={!formData.imageUrl}
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
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => toggleSelection('amenities', amenity)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Vibe / Ambiente</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {VIBES_OPTIONS.map(vibe => (
                <label key={vibe} className="flex items-center space-x-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.vibes.includes(vibe)}
                    onChange={() => toggleSelection('vibes', vibe)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{vibe}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            className="px-8"
          >
            {loading ? 'Publicando...' : 'Publicar Alojamiento'}
          </Button>
        </div>
      </form>
    </div>
  );
}
