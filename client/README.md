# Client

Frontend del proyecto (carpeta `client`).

Tecnologías sugeridas:
- React (Vite o Create React App)
- TypeScript
- Tailwind CSS o CSS Modules

Propósito:
- Interfaz de usuario para clientes y vendedores.
- Consumir la API REST del backend.

Estructura propuesta:
```
client/
└─ src/
   ├─ pages/
   ├─ components/
   ├─ hooks/
   └─ services/ (llamadas a la API)
```

Primeros pasos local:
1. `cd client`
2. `npm init vite@latest . -- --template react-ts` (o usar CRA)
3. `npm install`
4. `npm run dev`

Responsables iniciales (Sprint 1):
- Componentes de Login/Register
- Página de inicio que muestre productos
- Formulario para que el vendedor publique un producto (sin imágenes)
