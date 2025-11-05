// === Código de Pablo ===
import React from 'react';

export default function RegistroCliente() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Registro de Cliente</h2>
      <form>
        <label>Nombre:</label>
        <input type="text" placeholder="Ingresa tu nombre" className="border p-2 mb-4 block" />

        <label>Correo:</label>
        <input type="email" placeholder="Ingresa tu correo" className="border p-2 mb-4 block" />

        <label>Contraseña:</label>
        <input type="password" placeholder="Crea una contraseña" className="border p-2 mb-4 block" />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Registrar</button>
      </form>
    </div>
  );
}
