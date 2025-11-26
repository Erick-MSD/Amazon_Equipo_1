// === Código de Pablo: RegistroVendedor ===
import React, { useState } from "react";

export default function RegistroVendedor() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    nombreTienda: "",
    rfc: "",
    tipoProducto: "",
    telefono: ""
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validar = () => {
    if (!formData.nombre.trim()) return "El nombre es obligatorio.";
    if (!formData.correo.includes("@")) return "Ingresa un correo válido.";
    if (formData.contraseña.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (!formData.nombreTienda.trim()) return "El nombre de la tienda es obligatorio.";
    // RFC y teléfono: validaciones simples
    if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono)) return "Ingresa un teléfono válido (solo números).";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    const validErr = validar();
    if (validErr) {
      setError(validErr);
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("http://localhost:5314/api/registroVendedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.message || "Error en el servidor");
      }

      setMensaje("Registro de vendedor exitoso 🎉");
      setFormData({ nombre: "", correo: "", contraseña: "", nombreTienda: "", rfc: "", tipoProducto: "", telefono: "" });
    } catch (err) {
      setError(err.message || "Error al registrar");
      console.error("RegistroVendedor error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "2rem auto", padding: 20, background: "#fff", borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>Registro de Vendedor</h2>

      <form onSubmit={handleSubmit}>
        <label>Nombre completo</label>
        <input name="nombre" value={formData.nombre} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 8 }} />

        <label>Correo</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 8 }} />

        <label>Contraseña</label>
        <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 8 }} />

        <label>Nombre de la tienda</label>
        <input name="nombreTienda" value={formData.nombreTienda} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 8 }} />

        <label>RFC</label>
        <input name="rfc" value={formData.rfc} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 8 }} />

        <label>Tipo de producto</label>
        <input name="tipoProducto" value={formData.tipoProducto} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 8 }} />

        <label>Teléfono</label>
        <input name="telefono" value={formData.telefono} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 12 }} />

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#10B981", border: "none", color: "white", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Enviando..." : "Registrar Vendedor"}
        </button>
      </form>

      {mensaje && <p style={{ color: "green", marginTop: 12 }}>{mensaje}</p>}
      {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
    </div>
  );
}

// === Fin del código de Pablo (RegistroVendedor) ===
