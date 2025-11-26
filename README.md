# 🛒 Amazon E-commerce - Proyecto Metodologías Ágiles

Plataforma de comercio electrónico tipo Amazon con autenticación, gestión de productos, carrito de compras y checkout.

## 📁 Estructura del Proyecto

```
Amazon_Equipo_1/
├── client/               # Frontend - React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/       # Páginas (Home, Login, Checkout, etc.)
│   │   ├── components/  # Componentes reutilizables
│   │   └── assets/      # Imágenes y estilos CSS
│   └── dist/            # Build de producción
└── server/              # Backend - Node.js + Express + TypeScript
    ├── src/
    │   ├── models/      # Modelos Mongoose (User, Product, Order, etc.)
    │   ├── routes/      # Rutas API (auth, products, upload, etc.)
    │   └── scripts/     # Scripts (seed database)
    └── dist/            # Build de producción
```

## 🚀 Inicio Rápido

### **Requisitos:**
- Node.js 18+
- pnpm
- MongoDB Atlas

### **1. Clonar repositorio:**
```bash
git clone https://github.com/Erick-MSD/Amazon_Equipo_1.git
cd Amazon_Equipo_1
```

### **2. Backend:**

```bash
cd server
pnpm install

# Crear .env:
# MONGODB_URI=tu_mongodb_uri
# JWT_SECRET=tu_secret
# PORT=4000

# Poblar base de datos:
pnpm run seed

# Iniciar servidor:
pnpm run dev
```

### **3. Frontend:**

```bash
cd ../client
pnpm install

# Crear .env:
# VITE_API_URL=http://localhost:4000

# Iniciar app:
pnpm run dev
```

## 🔑 Funcionalidades

✅ Autenticación JWT con roles (cliente/vendedor)  
✅ Gestión de productos con imágenes  
✅ Carrito de compras  
✅ Checkout con direcciones y pagos  
✅ Búsqueda y filtros  
✅ Responsive design  

## 🛠️ Stack

**Frontend:** React 18 + TypeScript + Vite + React Router  
**Backend:** Node.js + Express + TypeScript + MongoDB + Mongoose  

## 📝 Credenciales de Prueba

**Cliente:** `cliente@test.com` / `password123`  
**Vendedor:** `vendedor@test.com` / `password123`
