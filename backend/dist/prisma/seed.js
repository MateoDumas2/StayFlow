"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed...');
    await prisma.notification.deleteMany();
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Database cleaned');
    const passwordHash = await bcryptjs_1.default.hash('password123', 10);
    const guestUser = await prisma.user.create({
        data: {
            email: 'demo@stayflow.com',
            name: 'Mateo Guest',
            passwordHash,
            role: 'GUEST',
            avatar: 'https://i.pravatar.cc/150?u=mateo',
            flowPoints: 1250,
            flowTier: 'WAVE',
        }
    });
    const hostUser = await prisma.user.create({
        data: {
            email: 'host@stayflow.com',
            name: 'Sofia Host',
            passwordHash,
            role: 'HOST',
            avatar: 'https://i.pravatar.cc/150?u=sofia',
            flowPoints: 5500,
            flowTier: 'SURFER',
        }
    });
    const hostUser2 = await prisma.user.create({
        data: {
            email: 'alex@stayflow.com',
            name: 'Alex Host',
            passwordHash,
            role: 'HOST',
            avatar: 'https://i.pravatar.cc/150?u=alex',
        }
    });
    console.log('👥 Users created');
    const listingsData = [
        {
            title: 'Villa frente al mar',
            location: 'Cancún, México',
            price: 250,
            rating: 4.8,
            imageUrl: 'https://fhwsmpnckoxttiybwtxu.supabase.co/storage/v1/object/public/listings/villa-de-arquitectura-moderna-con-piscina-infinita-que-refleja-la-vista-del-mar-puesta-sol-cuenta-una-borde-infinito-se-funde-el-370589134.webp',
            status: 'active',
            description: 'Hermosa villa con acceso privado a la playa, perfecta para unas vacaciones relajantes. Cuenta con amplios espacios, piscina infinita y todas las comodidades de lujo.',
            amenities: 'Wifi,Piscina,Aire acondicionado,Cocina completa,Estacionamiento',
            vibes: 'Relax,Lujo,Playa',
            accessibilityFeatures: 'wheelchair,stepFree,wideDoorways,accessibleBath',
            travelTime: 2.5,
            hostId: hostUser.id,
        },
        {
            title: 'Cabaña en el bosque',
            location: 'Bariloche, Argentina',
            price: 120,
            rating: 4.9,
            imageUrl: 'https://fhwsmpnckoxttiybwtxu.supabase.co/storage/v1/object/public/listings/cabanaenelbosque.jpg',
            status: 'active',
            description: 'Acogedora cabaña rodeada de naturaleza. Ideal para desconectar y disfrutar de la tranquilidad del bosque. Cerca de senderos y lagos.',
            amenities: 'Chimenea,Wifi,Calefacción,Parrilla,Vistas a la montaña',
            vibes: 'Naturaleza,Romántico,Aventura',
            accessibilityFeatures: 'stepFree',
            travelTime: 5.0,
            hostId: hostUser2.id,
        },
        {
            title: 'Apartamento moderno',
            location: 'Bogotá, Colombia',
            price: 85,
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            status: 'active',
            description: 'Moderno apartamento en el corazón de la ciudad. Cerca de restaurantes, museos y transporte público. Diseño elegante y funcional.',
            amenities: 'Wifi,Smart TV,Lavadora,Gimnasio,Seguridad 24h',
            vibes: 'Urbano,Negocios,Gastronomía',
            accessibilityFeatures: 'wheelchair,visualAlarms,wideDoorways',
            travelTime: 0.5,
            hostId: hostUser.id,
        },
        {
            title: 'Loft industrial',
            location: 'Ciudad de México',
            price: 150,
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            status: 'active',
            description: 'Espacioso loft con diseño industrial. Techos altos, grandes ventanales y una ubicación inmejorable en la zona más trendy de la ciudad.',
            amenities: 'Wifi,Espacio de trabajo,Terraza,Ascensor,Pet friendly',
            vibes: 'Arte,Diseño,Vida Nocturna',
            accessibilityFeatures: 'wheelchair,wideDoorways',
            travelTime: 4.0,
            hostId: hostUser2.id,
        },
        {
            title: 'Machiya Tradicional',
            location: 'Kyoto, Japón',
            price: 180,
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            status: 'active',
            description: 'Auténtica casa japonesa tradicional renovada con comodidades modernas. Jardín zen privado, tatami y baño de madera hinoki. Una experiencia cultural inmersiva.',
            amenities: 'Wifi,Jardín Zen,Baño Hinoki,Futones Premium,Té Matcha',
            vibes: 'Cultura,Zen,Historia',
            accessibilityFeatures: 'stepFree',
            travelTime: 14.0,
            hostId: hostUser.id,
        },
        {
            title: 'Villa Blanca con Vista a la Caldera',
            location: 'Santorini, Grecia',
            price: 450,
            rating: 5.0,
            imageUrl: 'https://fhwsmpnckoxttiybwtxu.supabase.co/storage/v1/object/public/listings/hermosa-vista-caldera-arquitectura-blanca-santorini-grecia-paisaje-viaje-romantico-idilico_663265-6059.avif',
            status: 'active',
            description: 'Iconic white villa with breathtaking views of the Aegean Sea. Private terrace, jacuzzi, and daily breakfast included. The ultimate romantic getaway.',
            amenities: 'Jacuzzi,Wifi,Breakfast,Private Terrace,Concierge',
            vibes: 'Romance,Luxury,Views',
            accessibilityFeatures: 'stepFree',
            travelTime: 12.0,
            hostId: hostUser.id,
        }
    ];
    const createdListings = [];
    for (const listing of listingsData) {
        const l = await prisma.listing.create({ data: listing });
        createdListings.push(l);
    }
    console.log(`🏠 ${createdListings.length} Listings created`);
    await prisma.booking.create({
        data: {
            userId: guestUser.id,
            listingId: createdListings[0].id,
            checkIn: '2023-12-01',
            checkOut: '2023-12-05',
            totalPrice: 1000,
            guests: 2,
            status: 'confirmed',
        }
    });
    await prisma.booking.create({
        data: {
            userId: guestUser.id,
            listingId: createdListings[2].id,
            checkIn: '2025-06-15',
            checkOut: '2025-06-20',
            totalPrice: 425,
            guests: 1,
            status: 'confirmed',
        }
    });
    await prisma.booking.create({
        data: {
            userId: hostUser2.id,
            listingId: createdListings[0].id,
            checkIn: '2024-01-10',
            checkOut: '2024-01-15',
            totalPrice: 1250,
            guests: 4,
            status: 'confirmed',
        }
    });
    console.log('📅 Bookings created');
    await prisma.notification.create({
        data: {
            userId: guestUser.id,
            type: 'BOOKING_CONFIRMED',
            title: '¡Reserva Confirmada!',
            message: 'Tu viaje a Bogotá está listo para junio.',
            read: false,
            link: '/trips'
        }
    });
    await prisma.notification.create({
        data: {
            userId: guestUser.id,
            type: 'SYSTEM',
            title: '¡Bienvenido a StayFlow!',
            message: 'Explora el mundo y gana puntos Flow por cada viaje.',
            read: true,
            link: '/'
        }
    });
    await prisma.notification.create({
        data: {
            userId: hostUser.id,
            type: 'NEW_BOOKING',
            title: '¡Nueva Reserva Recibida!',
            message: 'Alex Host ha reservado Villa frente al mar por $1250.',
            read: false,
            link: '/host/dashboard'
        }
    });
    console.log('🔔 Notifications created');
    console.log('✅ Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map