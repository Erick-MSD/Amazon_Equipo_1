<!-- Este README ya existía, se puede actualizar si hace falta -->
# Server

Backend del proyecto (carpeta `server`).

Instrucciones rápidas para arrancar:

1. Instalar dependencias:

```powershell
cd d:\Documents\GitHub\Amazon_Equipo_1\server
npm install
```

2. Crear un archivo `.env` basado en `.env.example` y ajustar `MONGODB_URI` si usas MongoDB local.

3. Ejecutar en desarrollo:

```powershell
npm run dev
```

Endpoints mínimos:
- `GET /health` — Salud del servidor
- `GET /api/products` — Lista de productos (temporal, estático)
# Server

Backend del proyecto (carpeta `server`).

Tecnologías sugeridas:
- Node.js + TypeScript
- Express
- MongoDB (con Mongoose)

Propósito:
- Exponer una API REST para autenticación, gestión de productos, carrito y pedidos.

Estructura propuesta:
```
server/
└─ src/
   ├─ controllers/
   ├─ routes/
   ├─ models/
   └─ services/
```

Primeros pasos local:
1. `cd server`
2. `npm init -y` y `npm install typescript ts-node-dev express mongoose dotenv`
3. `npx tsc --init` (configurar `tsconfig.json`)
4. Crear `.env` con la conexión a MongoDB

Responsables iniciales (Sprint 1):
- Endpoints de registro e inicio de sesión
- Modelo y endpoint para publicar un producto
- Endpoint para listar productos en la página de inicio
