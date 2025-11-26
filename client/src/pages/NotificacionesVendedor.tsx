import React, { useEffect, useState } from "react";
import "../assets/css/NotificacionesVendedor.css"; // ← RUTA CORREGIDA

interface Notificacion {
  _id: string;
  mensaje: string;
  productoId: string;
  compradorId: string;
  leida: boolean;
  fecha: string;
}

export default function NotificacionesVendedor() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const vendedorId = "ID_VENDEDOR_AQUI"; // luego lo reemplazas con auth real

  useEffect(() => {
    fetch(`http://localhost:4000/api/notifications/${vendedorId}`)
      .then((res) => res.json())
      .then((data) => setNotificaciones(data));
  }, []);

  return (
    <div className="notif-container">
      <div className="notif-box">

        <h1 className="notif-title">Notificaciones de vendedor</h1>

        {notificaciones.length === 0 ? (
          <p className="notif-empty">No tienes notificaciones por ahora 📭</p>
        ) : (
          <div className="notif-list">
            {notificaciones.map((n) => (
              <div
                key={n._id}
                className={`notif-item ${n.leida ? "leida" : "nueva"}`}
              >
                <div className="notif-icon">🔔</div>

                <div className="notif-info">
                  <p className="notif-msg">{n.mensaje}</p>

                  <p className="notif-producto">Producto: {n.productoId}</p>

                  <p className="notif-fecha">
                    {new Date(n.fecha).toLocaleString()}
                  </p>
                </div>

                {!n.leida && (
                  <button
                    onClick={() => marcarLeida(n._id)}
                    className="notif-btn"
                  >
                    Marcar como leída
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function marcarLeida(id: string) {
  await fetch(`http://localhost:4000/api/notifications/mark-read/${id}`, {
    method: "PUT",
  });

  window.location.reload();
}
