# 🌊 StayFlow

> **Viaja en tu propia sintonía.**
> Una plataforma de reservas moderna que combina búsqueda por voz con IA, pagos sociales y recomendaciones basadas en el "vibe" musical.

![StayFlow Banner](https://via.placeholder.com/1200x400?text=StayFlow+App+Preview)
*(Nota: Reemplazar con una captura real de la Home)*

---

## 🚀 Sobre el Proyecto

**StayFlow** no es solo otra app de reservas; es una reingeniería de la experiencia de usuario en el turismo. Nace de la necesidad de simplificar la planificación de viajes grupales y personalizar el descubrimiento de alojamientos.

El objetivo técnico fue construir una aplicación **Full Stack robusta y escalable**, utilizando una arquitectura moderna que separa claramente las responsabilidades, asegurando **Type Safety** de extremo a extremo y una UX fluida.

### ✨ Funcionalidades Clave

-   🎙️ **Búsqueda por Voz con IA:** Los usuarios pueden describir su viaje ideal (ej: *"Cabaña en Bariloche para 4 personas"*) y el sistema procesa el lenguaje natural para aplicar filtros complejos automáticamente.
-   🎵 **Spotify Vibe Match:** Integración única que analiza las playlists del usuario para recomendar alojamientos que coincidan con su estilo musical y ambiente deseado.
-   💸 **Split Pay:** Sistema nativo para dividir gastos entre amigos antes de reservar, eliminando la fricción financiera en viajes grupales.
-   🎮 **Gamificación (FlowPoints):** Sistema de lealtad con niveles (*Ripple, Wave, Surfer*) que premia a los usuarios por reseñas de calidad, fomentando una comunidad activa.
-   🛠️ **Panel de Anfitrión Completo:** CRUD completo para gestión de propiedades, subida de imágenes optimizada (Cloudinary) y métricas de rendimiento.

---

## 🛠️ Tech Stack

Este proyecto utiliza un stack moderno enfocado en performance, escalabilidad y experiencia de desarrollo.

### Frontend
-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Lenguaje:** TypeScript
-   **Estilos:** Tailwind CSS & Shadcn/UI
-   **Estado & Data Fetching:** Apollo Client (GraphQL)
-   **Formularios:** React Hook Form + Zod

### Backend
-   **Framework:** [NestJS](https://nestjs.com/)
-   **Lenguaje:** TypeScript
-   **API:** GraphQL (Code-First approach)
-   **ORM:** Prisma
-   **Base de Datos:** PostgreSQL (via Supabase)
-   **Almacenamiento:** Cloudinary (Gestión de imágenes)

### DevOps & Herramientas
-   **Linting:** ESLint & Prettier
-   **Control de Versiones:** Git & GitHub

---

## 🏗️ Arquitectura y Decisiones Técnicas

### 1. GraphQL vs REST
Se optó por **GraphQL** para evitar el *over-fetching* de datos, especialmente crítico en dispositivos móviles. Esto permite que el frontend solicite exactamente los campos necesarios para componentes complejos como las tarjetas de propiedad (`PropertyCard`), mejorando los tiempos de carga.

### 2. Prisma & Type Safety
La combinación de **Prisma** con **TypeScript** en el backend y la generación de tipos para el frontend asegura que si cambia un modelo en la base de datos, el error se detecta en tiempo de compilación, no en producción.

### 3. NestJS (Modularidad)
El backend está estructurado en módulos (`Listings`, `Auth`, `Reviews`), siguiendo los principios SOLID y permitiendo una fácil escalabilidad y mantenimiento del código.

---

## 📸 Capturas de Pantalla

| Búsqueda por Voz | Panel de Anfitrión | Detalle de Propiedad |
|:---:|:---:|:---:|
| ![Voice Search](https://via.placeholder.com/300x600?text=Voice+Search) | ![Host Dashboard](https://via.placeholder.com/300x600?text=Host+Dashboard) | ![Listing Detail](https://via.placeholder.com/300x600?text=Listing+Detail) |

*(Nota para reclutadores: El proyecto está en constante evolución. Las capturas pueden variar ligeramente de la versión desplegada).*

---

## ⚡ Instalación y Despliegue

Sigue estos pasos para correr el proyecto localmente:

### Prerrequisitos
- Node.js (v18+)
- PostgreSQL (o conexión a Supabase)

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/MateoDumas2/StayFlow.git
    cd StayFlow
    ```

2.  **Instalar dependencias:**
    ```bash
    # En la carpeta root (o frontend/backend según estructura)
    npm install
    ```

3.  **Configurar variables de entorno:**
    Renombra `.env.example` a `.env` y completa tus credenciales (Database URL, Cloudinary, etc.).

4.  **Correr migraciones de Prisma:**
    ```bash
    npx prisma migrate dev
    ```

5.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

---

## 📬 Contacto

**Mateo Dumas** - Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tu-perfil)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MateoDumas2)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=html5&logoColor=white)](https://tu-portfolio.com)

---

Hecho con 💙 y mucho código.
