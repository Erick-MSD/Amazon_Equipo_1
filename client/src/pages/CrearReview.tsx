import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/css/CrearReview.css";

export default function CrearReview() {
  const { productId } = useParams();
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const usuarioId = "ID_DEL_USUARIO"; 

  const enviarReview = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId, productoId: productId, comentario, calificacion })
    });

    const data = await res.json();
    alert("Reseña enviada");
  };

  return (
    <div className="review-container">
      <h1>Agregar reseña</h1>

      <form className="review-form" onSubmit={enviarReview}>
        <label>Calificación</label>
        <select value={calificacion} onChange={e => setCalificacion(Number(e.target.value))}>
          <option value={1}>⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={5}>⭐⭐⭐⭐⭐</option>
        </select>

        <label>Comentario</label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe tu opinión..."
        />

        <button type="submit">Enviar reseña</button>
      </form>
    </div>
  );
}
