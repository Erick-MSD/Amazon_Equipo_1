import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../assets/css/Formularios.css';
import logoSvg from '../assets/img/Amazon_logo.svg';

export default function RegistroCliente() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { nombre, correo, password, direccion };

    try {
      const response = await fetch(`${API_URL}/api/auth/RegistroCliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Cliente registrado correctamente");
        setNombre(""); setCorreo(""); setPassword(""); setDireccion("");
      } else {
        const data = await response.json();
        alert("❌ Error: " + (data.error || data.message));
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      alert("⚠️ No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="form-wrapper">
      {/* Logo clickeable que lleva al Home */}
      <Link to="/">
        <img src={logoSvg} alt="Amazon Logo" className="logo-clickable" />
      </Link>

      <h2>Registro de Cliente</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
