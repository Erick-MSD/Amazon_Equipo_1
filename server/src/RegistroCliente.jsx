// === Código de Pablo: RegistroCliente ===
import React, { useState } from "react";

export default function RegistroCliente() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    direccion: ""
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
      // Si backend aún NO disponible, esto puede quedar comentado.
      const resp = await fetch("http://localhost:5314/api/registroCliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      // Si backend responde JSON
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.message || "Error en el servidor");
      }

      setMensaje("Registro de cliente exitoso 🎉");
      setFormData({ nombre: "", correo: "", contraseña: "", direccion: "" });
    } catch (err) {
      // Si el backend no existe o hay CORS, verás el error aquí.
      setError(err.message || "Error al registrar");
      console.error("RegistroCliente error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto", padding: 20, background: "#fff", borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>Registro de Cliente</h2>

      <form onSubmit={handleSubmit}>
        <label>Nombre completo</label>
        <input name="nombre" value={formData.nombre} onChange={handleChange} required style={{ width: "100%", padding: 8, marginBottom: 10 }} />

        <label>Correo electrónico</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required style={{ width: "100%", padding: 8, marginBottom: 10 }} />

        <label>Contraseña</label>
        <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required style={{ width: "100%", padding: 8, marginBottom: 10 }} />

        <label>Dirección</label>
        <input name="direccion" value={formData.direccion} onChange={handleChange} style={{ width: "100%", padding: 8, marginBottom: 14 }} />

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#FF9900", border: "none", color: "white", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Enviando..." : "Registrarse"}
        </button>
      </form>

      {mensaje && <p style={{ color: "green", marginTop: 12 }}>{mensaje}</p>}
      {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}
    </div>
  );
}

// === Fin del código de Pablo (RegistroCliente) ===
