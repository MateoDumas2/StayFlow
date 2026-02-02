# Guía de Despliegue (Deployment) - StayFlow MVP

Esta aplicación está lista para ser desplegada. A continuación se detallan las opciones recomendadas para llevar StayFlow a producción.

## Opción 1: Despliegue Rápido (Recomendado para Demos)

### 1. Base de Datos (PostgreSQL)
Para producción, SQLite no es recomendable (pierde datos al reiniciar en la nube).
1. Crea una cuenta gratuita en [Supabase](https://supabase.com/) o [Neon](https://neon.tech/).
2. Obtén la `DATABASE_URL` (ej: `postgres://user:pass@host:5432/db`).
3. En `backend/prisma/schema.prisma`, cambia:
   ```prisma
   provider = "postgresql" // En lugar de "sqlite"
   ```
4. Ejecuta las migraciones: `npx prisma migrate deploy`.

### 2. Backend (Railway / Render)
1. Sube tu código a GitHub.
2. Conecta tu repositorio a [Railway](https://railway.app/) o [Render](https://render.com/).
3. Configura las variables de entorno:
   - `DATABASE_URL`: La URL de tu base de datos (paso 1).
   - `JWT_SECRET`: Una clave segura.
   - `PORT`: 4011 (o deja que la plataforma asigne uno, ej: `PORT`).
4. Comando de inicio: `npm run start:prod`.

### 3. Frontend (Vercel)
1. Conecta tu repositorio a [Vercel](https://vercel.com/).
2. Configura las variables de entorno:
   - `NEXT_PUBLIC_GRAPHQL_URL`: La URL de tu backend desplegado (ej: `https://stayflow-backend.up.railway.app/graphql`).
3. Vercel detectará automáticamente que es un proyecto Next.js.

---

## Opción 2: Docker (Contenedores)

Si tienes un servidor VPS (DigitalOcean, AWS EC2), puedes usar Docker.

1. Asegúrate de tener Docker instalado.
2. Ejecuta en la raíz del proyecto:
   ```bash
   docker-compose up --build -d
   ```
3. La aplicación estará disponible en:
   - Frontend: http://localhost:4010
   - Backend: http://localhost:4011

## Lista de Verificación Pre-Despliegue

- [x] **Seed Data:** La base de datos tiene datos de prueba iniciales.
- [x] **Dockerfiles:** Archivos de configuración de contenedores creados.
- [x] **Environment:** Variables de entorno separadas.
- [ ] **Cambio de DB:** Recordar cambiar `provider = "sqlite"` a `postgresql` en `schema.prisma` antes de subir.
