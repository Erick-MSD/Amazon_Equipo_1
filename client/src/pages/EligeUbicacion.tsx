import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EligeUbicacion() {
  const [direccion, setDireccion] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const guardarDireccion = () => {
    if (!direccion.trim() || !codigo.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (codigo.length < 5 || isNaN(Number(codigo))) {
      setError("Código postal inválido.");
      return;
    }

    const final = `${direccion} ${codigo}`;
    localStorage.setItem("direccion_envio", final);

    navigate("/"); // Regresa al home
  };

  return (
    <div style={{ padding: "30px", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Elige tu ubicación</h1>
      <p>Esta dirección se mostrará en “Entregar en …” en el inicio.</p>

      <div style={{ marginTop: "20px" }}>
        <label>Dirección</label>
        <input
          type="text"
          placeholder="Ej. Monterrey, Nuevo León"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />

        <label>Código postal</label>
        <input
          type="text"
          placeholder="Ej. 64000"
          value={codigo}
          maxLength={5}
          onChange={(e) => setCodigo(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            marginBottom: "15px",
          }}
        />

        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
        )}

        <button
          onClick={guardarDireccion}
          style={{
            width: "100%",
            padding: "12px",
            background: "#ff9900",
            border: "none",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Guardar dirección
        </button>
      </div>
    </div>
  );
}
