// Simulates an AI Vision model analyzing the property image and metadata
export const generateAIAltText = (property: { title: string; location: string; type?: string; amenities?: string[] }): string => {
  const adjectives = ['luminosa', 'espaciosa', 'moderna', 'acogedora', 'pintoresca'];
  
  // Create a deterministic hash from the property details
  const seedString = `${property.title}-${property.location}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = ((hash << 5) - hash) + seedString.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const positiveHash = Math.abs(hash);

  const adjective = adjectives[positiveHash % adjectives.length];
  
  const timeOfDay = ['bañada por la luz del sol', 'con iluminación cálida de atardecer', 'bajo un cielo despejado'];
  const lighting = timeOfDay[(positiveHash >> 2) % timeOfDay.length]; // Shift to get different randomness

  const features = property.amenities ? `Cuenta con ${property.amenities.slice(0, 3).join(', ')} visibles en la escena.` : '';

  return `Fotografía detallada de una propiedad ${adjective} en ${property.location}. La escena está ${lighting}. Se aprecia la arquitectura del alojamiento "${property.title}" con acabados de alta calidad. ${features} [Descripción generada por StayFlow Vision AI]`;
};
