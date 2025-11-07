import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../assets/css/Formularios.css';
import logoSvg from '../assets/img/Amazon_logo.svg';

export default function RegistroVendedor() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [nombreTienda, setNombreTienda] = useState("");
  const [rfc, setRfc] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [telefono, setTelefono] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { nombre, correo, password, nombreTienda, rfc, tipoProducto, telefono };

    try {
      const response = await fetch(`${API_URL}/api/auth/RegistroVendedor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Vendedor registrado correctamente");
        setNombre(""); setCorreo(""); setPassword("");
        setNombreTienda(""); setRfc(""); setTipoProducto(""); setTelefono("");
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

      <h2>Registro de Vendedor</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="Nombre de la tienda" value={nombreTienda} onChange={(e) => setNombreTienda(e.target.value)} required />
        <input type="text" placeholder="RFC" value={rfc} onChange={(e) => setRfc(e.target.value)} required />
        <input type="text" placeholder="Tipo de producto" value={tipoProducto} onChange={(e) => setTipoProducto(e.target.value)} required />
        <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
